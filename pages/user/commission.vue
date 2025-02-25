<template>
	<view class="commission">
		<view class="content">
			<view class="golden_info">
				<view class="golden_title">
					推荐收益(USDT)
				</view>
				<view class="golden_num">
					<text>{{Number(goldeninfo.energyIncome).toFixed(4)}}</text>
				</view>
				<view class="profit">
					<text>今日收益(USDT)</text>
					<text class="add">+{{Number(goldeninfo.todayFee).toFixed(4)}}</text>
				</view>
			</view>
			<view class="detailed">
				<view class="video">
					<view class="video_title">
						<text class="audt">推荐收益明细</text>
					</view>
				</view>
				<view class="det" v-if="recordList.length>0">
					<view class="detailed_list" v-for="(item,index) in recordList" :key="index">
						<view class="det_top">
							<view class="det_title">
								{{item.remark}}(USDT)
							</view>
							<view class="det_num">
								{{Number(item.amount).toFixed(4)}}
							</view>
						</view>
						<view class="det_bot">
							{{item.createSequence | timeStamp}}
						</view>
					</view>
				</view>
				
				<view class="notice" v-else>
					<image src="../../static/img/norecord.png" mode=""></image>
					<text>暂无明细记录</text>
				</view>	
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid:'',
				goldeninfo:[],
				recordList:[]
			}
		},
		created() {
			
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			this.uid = userInfo.userId;
			this.getRecord()
		},
		methods: {
			async getRecord() {
				let result = await this.$request.post('/uc/integration/record/page_query',{
					header: {
						 'x-auth-token':uni.getStorageSync('token'),
						 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
					},
					data: {
						"pageNum":1,
						"pageSize":50,
						"type":'',
						"createStartTime":'',
						"createEndTime":'',
					}
				});
				if(result.data.code==0){
					this.recordList=result.data.data;
				}else{
					this.$api.msg(teamlist.data.message);
				}
				
				
			}
		},
		filters:{
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
		background: rgba(240, 240, 240, 1);
	}
	.notice{
		padding-top: 200upx;
		background: rgba(240, 240, 240, 1);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 30upx;
		color: #c6c6c6;
		image{
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
		width: 690upx;
		height: 310upx;
		border-radius: 30upx;
		margin: 30upx auto;
		background: url(../../static/img/commission.png) no-repeat;
		background-size: cover;
		padding: 40upx 50upx 46upx;
		.golden_title {
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
		}
		.golden_num {
			
			font-size:30upx;
			font-family:PingFangSC-Semibold,PingFang SC;
			font-weight:600;
			color:rgba(255,255,255,1);
			text {
				font-size:80upx;
				font-family:DINAlternate-Bold,DINAlternate;
				font-weight:bold;
				color:rgba(255,255,255,1);
				margin-right: 10upx;
			}
		}
		.profit {
			font-size:30upx;
			font-family:PingFangSC-Semibold,PingFang SC;
			font-weight:600;
			color:rgba(255,255,255,1);
			.add {
				font-size:40upx;
				margin-left: 10upx;
			}
		}
	}
	
	.detailed {
		margin-top: 20upx;
		background:rgba(255,255,255,1);
		
		.video {
			border-bottom: 1px solid #e8e8e8;
			height: 100upx;
			padding: 28upx 30upx;
			box-sizing: border-box;
			.video_title {
				height: 56upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.audt {
					padding-left: 20upx;
					box-sizing: border-box;
					font-size:32upx;
					font-family:PingFangSC-Semibold,PingFang SC;
					font-weight:600;
					color:rgba(51,51,51,1);
				}
			}
		}
		
		
		.detailed_list {
			padding: 40upx 0;
			box-sizing: border-box;
			border-bottom: 1px solid #e8e8e8;
			.det_top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.det_title {
					font-size:32upx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(51,51,51,1);
				}
				.det_num {
					font-size:40upx;
					font-family:PingFangSC-Semibold,PingFang SC;
					font-weight:600;
					color:rgba(232,65,112,1);
				}
			}
			.det_bot {
				font-size:28upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(153,153,153,1);
				margin-top: 20upx;
			}
		}
	}
	.det {
		padding: 0 30upx;
		box-sizing: border-box;
		margin-bottom: 140upx;
	}
	.video_title::after {
		position: absolute;
		content:"";
		height: 30upx;
		border-right: 10upx solid #fd852f;		
	}
	
</style>
