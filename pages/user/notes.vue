<template>
	<view class="notes">
		<view class="record_list">
			<view class="extract" v-for="(item,index) in transferinfo" :key="index">
				<view class="state_num">
					<view class="state ">
						<text class="active" v-if="item.type == 11">收款账号</text>
						<text v-else >打款账号</text>
						<text class="phone">{{item.account}}</text>
					</view>
					<view class="num">
						{{item.amount}}
					</view>
				</view>
				<view class="address">
					备注：{{item.remark}}
				</view>
				<view class="time">
					充值时间：{{item.createSequence | timeStamp}}
				</view>
			</view>
			
			<!-- <view class="extract">
				<view class="state_num">
					<view class="state">
						<text>收款账号</text>
						<text class="phone">15877990653</text>
					</view>
					<view class="num">
						200
					</view>
				</view>
				<view class="address">
					充值地址：47238473wt8e7r8
				</view>
				<view class="time">
					充值时间：2020-04-10 10:1
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid:'',
				sequence: 0,
				transferinfo:[]
			}
		},
		created() {
			
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			this.uid = userInfo.userId;
			this.gettransfer()
		},
		methods: {
			//互转记录
			async gettransfer() {
				let transfer = await this.$request.post('/user/transfer/list', {
					"data": {
						"uid": this.uid,
							"sequence": this.sequence

					}
				});
				// if (buyenery.data.base.code == "000000") {
			
					console.log(transfer.data.data)
					this.transferinfo = transfer.data.data;
					this.sequence = transfer.data.data.sequence
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
	.phone {
		color:rgba(51,51,51,1);
		margin-left: 20upx;
	}
</style>
