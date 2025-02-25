<template>
	<view class="container">
		<view class="content">
			<view class="list">
				<view class="list_each" v-for="(item,index) in list" :key="index">
					<view class="list_title">
						<view class="name">{{item.coin.name}}</view>
						<view class="status">{{setStatus(item.status)}}</view>
					</view>
					<view class="list_info">
						<view class="info">
							<view class="info_left">{{$t('carryRecord.index1')}}</view>
							<view class="info_right">{{item.totalAmount}}</view>
						</view>
						<view class="info">
							<view class="info_left">{{$t('carryRecord.index2')}}</view>
							<view class="info_right">{{item.fee}}</view>
						</view>
						<view class="info">
							<view class="info_left">{{$t('carryRecord.index3')}}</view>
							<view class="info_right">{{setStr(item.address,10)}}</view>
						</view>
						<view class="time">{{$t('carryRecord.index4')}}：{{item.createTime}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageNo: 1,
				list: [],
				isLoad: false,
				navTitle: this.$t('withdrawalRecord.index16')
			};
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.navTitle
			})
		},
		methods: {
			async record(){
				let data = {
					pageNo: this.pageNo,
					pageSize: '10',
				}
				let header = {
					'x-auth-token':uni.getStorageSync('token'),
					'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
				}
				let res = await this.$request.post('/uc/withdraw/record',{header,data})
				uni.hideLoading()
				if(res.data.code == 0){
					let obj = res.data.data.content
					for(let i in obj){
						this.list.push(obj[i])
					}
					if(obj.length == 10){
						this.pageNo++
						this.isLoad = true
					}else{
						this.isLoad = false
						this.$api.msg(this.$t('recharge.index14'))
					}
				}
			},
			
			setStatus(str){
				let text = '';
				switch(str) {
					case 0:
						return this.$t('carryRecord.index5');
						break;
					case 1:
						return this.$t('carryRecord.index6');
						break;
					case 2:
						return this.$t('carryRecord.index7');
						break;
					case 3:
						return this.$t('carryRecord.index8');
						break;
					case 4:
						return this.$t('carryRecord.index9');
						break;
					case 5:
						return this.$t('carryRecord.index10');
						break;
					case 6:
						return this.$t('carryRecord.index11');
				}
			},
			setStr(str,num){
				let str1 = str.substr(0,num)
				let str2 = str.substr(-num,num)
				let str3 = str1+'....'+str2
				return str3
			}
		},
		onReachBottom() {
			if(isLoad == true){
				uni.showLoading({
					title: '加载中'
				})
				this.record()
			}else{
				this.$api.msg('已加载全部')
			}
		},
		onLoad() {
			this.record()
		},
	}
</script>

<style lang="scss">
	.container{
		background-color: #F6F6F6;
		min-height: calc(100vh - 44px);
		.content{
			padding: 0 32rpx;
			box-sizing: border-box;
			.list{
				padding-top: 24rpx;
				box-sizing: border-box;
				.list_each{
					border-radius: 20rpx;
					box-shadow: 0px 2px 6px 2px rgba(0,0,0,0.16);
					background-color: #fff;
					margin-bottom: 24rpx;
					.list_title{
						padding: 24rpx 32rpx 20rpx;
						border: 1px solid #F0F0F0;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.name{
							font-size: 32rpx;
							font-weight: 600;
						}
						.status{
							padding: 0 24rpx;
							box-sizing: border-box;
							height: 48rpx;
							border-radius: 10rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							background-color: #E8B00D;
							color: #fff;
							font-size: 24rpx;
						}
					}
					.list_info{
						padding: 0rpx 32rpx 24rpx;
						.info{
							display: flex;
							align-items: center;
							justify-content: space-between;
							font-size: 24rpx;
							margin-top: 16rpx;
							.info_left{
								
								color: #999;
							}
							.info_right{
								color: #333;
								font-weight: 600;
							}
						}
						.time{
							text-align: end;
							margin-top: 24rpx;
							color: #999;
						}
					}
				}
			}
		}
	}
</style>
