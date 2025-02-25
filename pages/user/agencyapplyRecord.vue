r<template>
	<view class="record">
		<view class="record_list">
			<view class="extract" v-for="(item,index) in withdrawinfo" :key="index">
				<view class="state_num">
					<view class="state active" v-if="item.status==0">
						申请中
					</view>
					<view class="state" v-else-if='item.status==1'>
						申请通过
					</view>
					<view class="state" v-else-if='item.status==2'>
						申请不通过
					</view>
					<view class="num">
						{{item.amount}}
					</view>
				</view>
				<view class="address">
					ID：{{item.id}}
				</view>
				<view class="time">
					申请时间：{{item.applySequence | timeStamp}}
				</view>
			</view>
			
			<!-- <view class="extract" v-for="i in 5">
				<view class="state_num">
					<view class="state">
						提取成功
					</view>
					<view class="num">
						200
					</view>
				</view>
				<view class="address">
					提起地址：47238473wt8e7r8
				</view>
				<view class="time">
					提取时间：2020-04-10 10:1
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				withdrawinfo:[],
				uid:'',
				sequence:0
			}
		},
		created() {},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			this.uid = userInfo.userId;
			this.getwithdraw()
		},
		methods: {
			//申请记录
			async getwithdraw() {
				let withdraw = await this.$request.post('/applyAgent/records', {
					"data": {
						"uid":this.uid
					}
				});
				// if (buyenery.data.base.code == "000000") {
			
					console.log(withdraw.data.data)
					this.withdrawinfo = withdraw.data.data;
					// console.log(this.withdrawinfo[0].statusDesc)
					this.sequence = withdraw.data.data.sequence
				// } else {
				// 	uni.showToast({
				// 		title: buyenery.data.base.msg,
				// 		duration: 1000,
				// 		icon: 'none'
				// 	});
				// }
			
			}
		},
		filters: {
			// timeStamp: function(value) {
			// 	if (!value) return '';
			// 	var now = new Date(value);
			// 	var year = now.getFullYear();
			// 	var month = now.getMonth() + 1;
			// 	if (month < 10) {
			// 		month = '0' + month
			// 	}
			// 	var date = now.getDate();
			// 	if (date < 10) {
			// 		date = '0' + date
			// 	}
			// 	return year + "-" + month + "-" + date
			// },
			timeStamp: function(value) { //具体到时分秒
				var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var year = date.getFullYear();
				var month = ("0" + (date.getMonth() + 1)).slice(-2);
				var sdate = ("0" + date.getDate()).slice(-2);
				var hour = ("0" + date.getHours()).slice(-2);
				var minute = ("0" + date.getMinutes()).slice(-2);
				var second = ("0" + date.getSeconds()).slice(-2);
				// 拼接
				var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second;
				// 返回
				return result;
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
			height:234upx;
			background:rgba(255,255,255,1);
			padding: 40upx 24upx 40upx 30upx;
			box-sizing: border-box;
			background: #FFFFFF;
			margin-top: 20upx;
			.state_num {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.state {
					font-size:32upx;
					font-family:PingFangSC-Semibold,PingFang SC;
					font-weight:600;
					color:rgba(69,201,158,1);
					
				}
				.num {
					font-size:40upx;
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
	.active {
		color:rgba(232,65,112,1) !important;
	}
</style>
