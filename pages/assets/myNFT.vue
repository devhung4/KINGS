<template>
	<view class="container">
		<view class="content">
			<view class="list">
				<view class="list_each" v-for="(item,index) in list" :key="index">
					<image :src="item.aonProductSkuInfo.imageUrl"></image>
					<view class="extract">{{$t('assets.index8')}}</view>
					<view class="info">
						<view class="name">{{item.aonProductSkuInfo.name}}</view>
						<view class="identifier">
							<view>{{item.productSkuId+'#'+ifNull(item.makeTokenId)+'/'+item.aonProductSkuInfo.totalNum}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import nfcFun from "@/common/nfc.js";
	import testtest from '../../js_sdk/hexiii-nfc/hexiii-nfc.js'
	// import 
	export default {
		data() {
			return {
				show: false,
				nfcId: '',
				pageNo: 1,
				list: [],
				isLoad: false,
			};
		},
		methods: {
			async memberProduct() {
				let res = await this.$request.post('/uc/aonProductSku/memberProduct', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {
						pageNo: this.pageNo,
						pageSize: '10',
					},
				})
				if (res.data.code == 0) {
					console.log(uni.getStorageSync('locale'))
					uni.hideLoading();
					let obj = res.data.data.content
					for (let i in obj) {
						this.list.push(obj[i])
					}
					if (obj.length == 10) {
						this.pageNo++
						this.isLoad = true
					} else {
						this.isLoad = false
						// this.$api.msg('已加载全部')
					}
				}
			},



			//铸造
			async creatNft() {
				let res = await this.$request.post('/uc/aonProductSku/creatNft', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {
						buySkuId: this.nfcId,
					},
					
				})
				if (res.data.code == 0) {
					this.$api.msg(this.$t('withdrawalRecord.index26'))
					this.list = []
					this.memberProduct()
				} else {
					this.$api.msg(res.data.message)
				}
			},


			//Android读取Nfc
			async testNFC() {
				//这里用异步获取读取到的NFC数据
				const nfcId = await testtest.listenNFCStatus();
				console.log(nfcId)
				alert(nfcId)
				this.nfcId = nfcId
				// this.creatNft()
				this.$refs.popup.close()
				//关闭nfc扫描
				testtest.readyRead = false;
			},


			//ios读取nfc
			TagNfcReadAsyncFunc() {
				let _this = this
				var nfcModule = uni.requireNativePlugin("yzy-YzyNfcTagRead")
				nfcModule.TagNfcReadAsyncFunc({ 'name': 'yzyzuishuai' }, (res) => { 
					if (res.type == 1) {
						console.log(res.msg)
						_this.nfcId = res.msg
						_this.creatNft()
					} else {
						_this.$api.msg(this.$t('withdrawalRecord.index20'))
					}
				})
			},
			
			ifNull(str){
				if(str == null || str == ''){
					return ''
				}
			},
			
			
			
			cancel(){
				this.$refs.popup.close()
			}
		},
		onLoad(options) {
			if(options.id){
				console.log(options.id)
				this.nfcId = options.id
				// this.creatNft()
			}
			this.memberProduct()
			console.log()
		},
		
		onReachBottom() {
			if (this.isLoad == true) {
				console.log(this.isLoad)
				uni.showLoading({
					title: this.$t('withdrawalRecord.index21')
				})
				this.memberProduct()
			} else {
				this.$api.msg(this.$t('withdrawalRecord.index22'))
			}
		},
	}
</script>

<style lang="scss">
	.container {
		background-color: #F6F6F6;
		min-height: 100vh;
	}

	.content {
		padding: 0 32rpx;
		box-sizing: border-box;

		.list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.list_each {
				width: 44vw;
				display: flex;
				flex-direction: column;
				background-color: #fff;
				border-radius: 20rpx;
				box-shadow: 0rpx 0rpx 12rpx 2rpx rgba(0, 0, 0, 0.16);
				margin-top: 24rpx;
				position: relative;

				image {
					width: 44vw;
					height: 44vw;
					border-radius: 20rpx;
				}
				
				.extract{
					width: 176rpx;
					height: 200rpx;
					background-image: url('@/static/img/icon_13.png');
					background-size: 100% 100%;
					padding-top: 108rpx;
					text-align: center;
					font-size: 24rpx;
					color: #fff;
					position: absolute;
					top: 35%;
					left: 50%;
					transform: translate(-50%,-50%);
				}

				.info {
					padding: 20rpx 20rpx 24rpx;
					box-sizing: border-box;

					.name {
						font-size: 28rpx;
					}

					.identifier {
						width: 240rpx;
						height: 48rpx;
						background-image: url(../../static/img/icon_6.png);
						background-size: 100% 100%;
						padding-left: 45rpx;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						justify-content: center;

						view {
							font-size: 22rpx;
						}
					}
				}
			}
		}
	}
	.popup{
		padding: 72rpx 32rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		.title{
			font-size: 48rpx;
			color: #999;
		}
		image{
			width: 244rpx;
			height: 244rpx;
			margin-top: 72rpx;
		}
		.scan{
			font-size: 36rpx;
			font-weight: 600;
			margin-top: 30rpx;
		}
		.cancel{
			width: 100%;
			height: 88rpx;
			border-radius: 44rpx;
			background-color: #A5A5A5;
			color: #fff;
			font-size: 36rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 96rpx;
		}
	}
	/deep/.uni-popup{
		border-radius: 20rpx 20rpx 0 0 !important;
		border: 1px solid red;
	}
</style>
