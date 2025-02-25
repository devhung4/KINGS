<template>
	<view class="golden">
		<view class="status_bar">  
		    <view class="top_view"></view>  
		</view>  
		<view class="content">
			<view class="golden_info">
				<view class="golden_title">
					{{$t('assets.index1')}}
					<image class="cutImg"
						:src="pwdtype?'../../static/img/visual.png':'../../static/img/Invisible.png'"
						@tap="pwdseeClick"></image>
					<view class="nfc" @click="scanning">
						<image src="../../static/img/NFC.png"></image>
						<view>{{$t('withdrawalRecord.index23')}}</view>
					</view>
				</view>
				
				<!-- <view class="golden_num">
					<text v-show='pwdtype'>{{ usdtSum }}</text>
					<text v-show='!pwdtype'>*****</text>
					<text style="font-size:24upx;">USDT</text>
				</view> -->
				<view class="profit">
					<view>
						<!-- <text>今日收益(USDT)</text> -->
						<text v-show='pwdtype' class="add">≈{{ cnySum }} USDT</text>
						<text v-show='!pwdtype' class="add">≈***** USDT</text>
					</view>
					<view class="consumption" @click="navTo('/pages/property/recordList')">
						<view>{{$t('assets.index2')}}</view>
					</view>
				</view>
				
			</view>
			<view class="propertyNav">

				<!-- <view class="pList" @click="navTo('/pages/property/consume')" hover-class="common-hover"
					:hover-stay-time="50">
					<image src="../../static/csr.png"></image>
					<view>CSR消费</view>
					<view>积分消费</view>
				</view> -->
				<view class="pList" @click="navTo('/pages/assets/recharge')" hover-class="common-hover"
					:hover-stay-time="50">
					<image src="../../static/img/assets_icon1.png"></image>
					<!-- <view>充值</view> -->
					<view>{{$t('assets.index3')}}</view>
				</view>
				<view class="pList" @click="clickfn()" hover-class="common-hover" 
					:hover-stay-time="50"> <!-- navTo('/pages/assets/carry') -->
					<image src="../../static/img/assets_icon2.png"></image>
					<!-- <view>提确权积分</view> -->
					<view>{{$t('assets.index4')}}</view>
				</view>
				<!-- <view class="pList" @click="navTo('/pages/property/recordList')">
					<image src="../../static/rhinoImg/recording.png"></image>
					<view>记录</view>
				</view> -->
				<view class="pList" @click="navTo('/pages/assets/myNFT')">
					<image src="../../static/img/assets_icon3.png"></image>
					<view>NFT</view>
				</view>
			</view>
			<view class="detailed">
				<view class="title">
					<image src="../../static/img/assets_icon4.png"></image>
					<view>{{$t('assets.index5')}}</view>
				</view>
				<view class="propertyList" v-for="(item,index) in walletList" :key="index">
					<view class="proName">{{item.coin.name}}</view>
					<view class="proNum">
						<view class="proNumli">
							<view>{{$t('assets.index6')}}</view>
							
							<view class="balance">{{item.balance}}</view>
						</view>
						<view class="proNumli">
							<view>{{$t('assets.index7')}}</view>
							
							<view class="balance">{{item.frozenBalance}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="handle">
				<view class="extract" @click="extract">
					提取
				</view>
				<view class="exchange" @click="exchange">
					互转
				</view>
				<view class="recharge" @click="charge">
					充值
				</view>
			</view> -->
		</view>
		<uni-popup ref="popup" :mask-click="false" type="bottom" background-color="#fff">
			<view class="popup">
				<view class="title">{{$t('withdrawalRecord.index17')}}</view>
				<image src="../../static/img/NFC_1.png"></image>
				<view class="scan">{{$t('withdrawalRecord.index18')}}...</view>
				<view @click="cancel" class="cancel">{{$t('withdrawalRecord.index19')}}</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import nfcFun from "@/common/nfc.js";
	import testtest from '../../js_sdk/hexiii-nfc/hexiii-nfc.js'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: {
			...mapState(['hasLogin'])
		},
		data() {
			return {
				uid: '',
				goldeninfo: '',
				balanInfo: [],
				lastRecordDate: 0,
				pwdtype: true, //隐藏
				// time:[]
				name: '',
				balance: '',
				frozenBalance: '',
				walletList: [],
				nfcId: '',
			};
		},
		onLoad() {
			var userInfo = uni.getStorageSync('userInfo');
			// this.getWalletInfo();
		},
		async onShow() {
			this.getWalletInfo();
		},
		filters: {
			timeStamp: function(value) {
				//具体到时分秒
				if (!value) return '';
				var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var year = date.getFullYear();
				var month = ('0' + (date.getMonth() + 1)).slice(-2);
				var sdate = ('0' + date.getDate()).slice(-2);
				var hour = ('0' + date.getHours()).slice(-2);
				var minute = ('0' + date.getMinutes()).slice(-2);
				var second = ('0' + date.getSeconds()).slice(-2);

				// 拼接
				var result = year + '-' + month + '-' + sdate + ' ' + hour + ':' + minute + ':' + second;
				return result;
			}
		},
		computed: {
			usdtSum: function() {
				var usdtAll = 0;
				for (var i = 0; i < this.balanInfo.length; i++) {
					usdtAll += parseInt(this.balanInfo[i].balance * this.balanInfo[i].coin.usdRate);
				}
				return usdtAll;
			},
			cnySum: function() {
				var cnyAll = 0;
				for (var i = 0; i < this.balanInfo.length; i++) {
					cnyAll += parseInt(this.balanInfo[i].balance * this.balanInfo[i].coin.usdtRate);
				}
				return cnyAll;
			}
		},
		methods: {
			// 资产是否可见
			pwdseeClick: function() {
				this.pwdtype = !this.pwdtype;
			},
			//获取资产信息
			async getWalletInfo() {
				try {
					let walletList = await this.$request.post('/uc/asset/wallet', {
						header: {
							'x-auth-token': uni.getStorageSync('token'),
							'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
						},
						data: {}
					});
					if (walletList.data.code == 0) {
						this.walletList = walletList.data.data
						// this.name = walletList.data.data[0].coin.name
						// this.balance = walletList.data.data[0].balance
						// this.frozenBalance = walletList.data.data[0].frozenBalance
						this.balanInfo = walletList.data.data;
					} else {
						uni.setStorageSync('hasLogin', false);
						uni.setStorageSync('userInfo', '');
						// uni.clearStorageSync();
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/public/login'
							});
						}, 200);
					}
				} catch (e) {
					console.log(e);
					// that.$api.msg('网络异常');
				}
			},
			navTo(url) {
				let that = this;
				// if(!that.hasLogin){
				// 	uni.reLaunch({
				// 		url:'/pages/public/login'
				// 	})
				// }else{
				uni.navigateTo({
					url: url
				});
				// }
			},
			
			
			//Android读取Nfc
			async testNFC() {
				document.addEventListener("nfc-tag-discovered", function(event) {
				  event.preventDefault();
				}, true);
				//这里用异步获取读取到的NFC数据
				const nfcId = await testtest.listenNFCStatus();
				console.log(nfcId)
				this.nfcId = nfcId
				if (this.nfcId) {
					this.navTo('./myNFT?id='+this.nfcId)
				}
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
						_this.navTo('./myNFT?id='+_this.nfcId)
					} else {
						_this.$api.msg(this.$t('withdrawalRecord.index20'))
					}
				})
			},
			
			//扫描nfc
			scanning(){
				//判断安卓还是iOS
				let platform = uni.getSystemInfoSync().platform
				if (platform == 'ios') {
					//ios_NFC方法
					this.TagNfcReadAsyncFunc()
				} else if (platform == 'android') {
					//Android_NFC方法
					this.$refs.popup.open()
					this.testNFC()
				}
			},
			cancel(){
				this.$refs.popup.close()
			},
			clickfn(){
				console.log('123')
				uni.navigateTo({
					url:'/pages/assets/carry'
				})
			}
		}
	};
</script>

<style lang="scss">
	.status_bar{
		height: var(--status-bar-height);  
		width: 100%;
		background-image: url(../../static/img/status_bg_1.png);
		background-size: 100% 100%;
		
	}

	page {
		// background: rgba(240, 240, 240, 1);
	}

	.notice {
		padding-top: 200upx;
		background: rgba(240, 240, 240, 1);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 30upx;
		color: #c6c6c6;

		image {
			width: 180upx;
			height: 180upx;
		}
	}

	li {
		list-style: none;
	}

	ul {
		padding: 0;
	}

	.golden_info {
		width: 100%;
		height: 201px;
		background: url(../../static/rhinoImg/propertyBg_1.png) no-repeat;
		background-size: cover;
		padding: 8% 5%;
		box-sizing: border-box;
		

		.golden_title {
			font-size: 32upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #fff;
			display: flex;
			align-items: center;
			position: relative;
			.cutimage {
				width: 40upx;
				height: 40upx;
				vertical-align: middle;
				margin-left: 2%;
			}
			.nfc{
				position: absolute;
				display: flex;
				align-items: center;
				right: 0rpx;
				top: -30rpx;
				image{
					width: 58rpx;
					height: 58rpx;
				}
				view{
					font-size: 26rpx;
					color: #fff;
					margin-left: 8rpx;
				}
			}
		}
		

		.golden_num {
			font-size: 60upx;
			font-family: PingFangSC-Semibold, 'PingFang SC';
			// font-weight: 600;
			color: rgba(255, 255, 255, 1);
			margin: 4% 0;

			text {
				font-family: DINAlternate-Bold, DINAlternate;
				color: rgba(255, 255, 255, 1);
				margin-right: 10upx;
			}
		}

		.profit {
			font-size: 48upx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: bold;
			color: #333333;
			margin-top: 15rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.add {
				font-size: 48upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: bold;
				color: #fff;
			}
			
			.consumption{
				width: 191rpx;
				height: 82rpx;
				background-image: url(../../static/img/icon_2.png);
				background-size: 100% 100%;
				padding-left: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				view{
					font-size: 24rpx;
					color: #fff;
				}
			}
		}
	}

	.propertyNav {
		width: 100%;
		border-radius: 20px 20px 0 0;
		margin-top: -91px;
		background: #fff;
		padding: 40rpx 0 32rpx;
		box-sizing: border-box;
		display: flex;
		border-bottom: 1px solid #F0EEF1;

		.pList {
			width: 33.3333%;
			font-family: PingFangSC-Semibold, PingFang SC;
			color: #333333;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			image {
				width: 48upx;
				height: 48upx;
				margin-right: 16rpx;
			}
		}
	}

	.detailed {
		width: 100%;
		background: white;
		margin-top: -1rpx;
		border-top: 1px solid #F0EEF1;
		padding: 46rpx 32rpx 0;
		box-sizing: border-box;
		.title{
			display: flex;
			align-items: center;
			image{
				width: 40rpx;
				height: 40rpx;
			}
			view{
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
				margin-left: 4rpx;
			}
		}

		.propertyList {
			border-bottom: 1px solid #eeeeee;
			padding: 5% 0 3%;

			.proName {
				font-size: 16px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #00a7eb;
			}

			.proNum {
				display: flex;
				margin-top: 24rpx;
				font-size: 22rpx;

				.proNumli {
					width: 40%;
					color: #848E9C;
					.balance{
						margin-top: 8rpx;
						font-size: 32rpx;
						color: #333;
						font-weight: bold;
					}
				}

				.proBalance {
					font-family: PingFangSC-Regular, "PingFang SC";
					font-weight: 400;
					color: #999999;
					margin-top: 3%;
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
