<template>
	<view class="container">
		<view class="content">
			<view class="list">
				<view class="list_each" v-for="(item,index) in list" :key="index">
					<view class="list_title">{{item.symbol}}</view>
					<view class="list_info">
						<view class="info">
							<view class="info_left">{{$t('recharge.index11')}}</view>
							<view class="info_right">{{item.amount}}</view>
						</view>
						<view class="info">
							<view class="info_left">{{$t('recharge.index12')}}</view>
							<view class="info_right">{{setStr(item.address,10)}}</view>
						</view>
						<view class="time">{{$t('recharge.index13')}}：{{item.createTime}}</view>
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
				navTitle: this.$t('recharge.index10')
			};
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.navTitle
			})
		},
		methods: {
			async getList(){
				let data = {
					pageNo: this.pageNo,
					pageSize: '10',
					type: '0',
				}
				let header = {
					'x-auth-token':uni.getStorageSync('token'),
					'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
				}
				let res = await this.$request.post('/uc/asset/transaction/all',{header,data})
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
					title: this.$t('recharge.index15')
				})
				this.getList()
			}else{
				this.$api.msg(this.$t('recharge.index16'))
			}
		},
		onLoad() {
			this.getList()
		}
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
						font-size: 32rpx;
						font-weight: 600;
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
