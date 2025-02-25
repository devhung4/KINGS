<template>
	<view class="service">
		<view v-if="!serviceinfo.length" style="width:100%;padding:100upx 0;text-align: center;">
			<view><image src="../../static/nodata.png" style="width:360upx;height:250upx"></image></view>
			<view style="color: #999;font-size: 30upx;">暂无本地服务</view>
		</view>
		<view class="record_list" v-else>
			<view class="service_info" v-for="(item,index) in serviceinfo" :key='index'>
				<image :src="item.image" mode=""></image>
				<view class="extract">
					<view class="state_num">
						<view class="state">{{item.name}}</view>
						<view class="num">{{item.contact}}</view>
					</view>
					<view class="address">{{item.content}}</view>
				</view>
			</view>
		</view>
		<!-- <uni-load-more :status="loadingType"></uni-load-more> -->
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		data() {
			return {
				serviceinfo:[],
				loadingType: 'more', //加载更多状态
			}
		},
		created() {},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			this.uid = userInfo.userId;
			this.getservice('refresh',);
		},
		methods: {
			//本地服务列表
			async getservice() {
				let that = this;
				let service = await that.$request.post('/user/local/service/list', {
					"data": {
						"base": {
							"appId": "001",
							"channels": "001",
							"ver": "1.1.5",
							"clientVer": "1.0",
							"apn": "wifi",
							"deviceId": "1233eedds2112",
							"uid": "1",
							"valat": 22.332112,
							"lalong": 12.332112,
							"platform": "IOS",
							"platformVer": "8",
							"resolution": "960*640",
							"deviceType": "P6",
							"carrier": "china mobile",
							"city": "合肥",
							"brand": "huawei"
						}
					}
				});
				that.serviceinfo = service.data.data;
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: rgba(246, 246, 246, 1);
	}
	.record_list {
		
		.extract {
			background:rgba(255,255,255,1);
			box-sizing: border-box;
			background: #FFFFFF;
			width: 80%;
			.state_num {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.state {
					font-size:32upx;
					font-family:PingFangSC-Semibold,PingFang SC;
					font-weight:600;
					color:rgba(64,67,72,1);
					
				}
				.num {
					font-size:32upx;
					font-family:PingFangSC-Semibold,PingFang SC;
					font-weight:600;
					color:rgba(51,51,51,1);
				}
			}
			.address {
				font-size:28upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
				margin-top: 20upx;
				margin-bottom: 10upx;
			}
			.time {
				font-size:28upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(153,153,153,1);
			}
		}
		
	}
	.phone {
		color:rgba(51,51,51,1);
		margin-left: 20upx;
	}
	.service_info {
		display: flex;
		justify-content: space-around;
		background: #FFFFFF;
		padding-left: 30upx;
		box-sizing: border-box;
		margin-top: 20upx;
		padding: 5%;
		image {
			width: 60upx;
			height: 60upx;
		}
	}
</style>
