<template>
	<view class="golden">
		<view class="content">
			<view class="golden_info">
				<view class="golden_title">
					总资产(USDT)
				</view>
				<view class="golden_num">
					<text>{{Number(goldeninfo.balance).toFixed(4)}}</text>
				</view>
				<view class="profit">
					<text>今日收益(USDT)</text>
					<text class="add">+{{Number(goldeninfo.todayFee).toFixed(4)}}</text>
				</view>
			</view>
			<view class="detailed">
				<view class="video">
					<view class="video_title">
						<text class="audt">收支明细</text>
					</view>
				</view>
				<view class="det" v-if="balaninfo.length>0">
					<view class="detailed_list" v-for="(item,index) in balaninfo" :key="index">
						<view class="det_top">
							<view class="det_title">
								{{item.note}}(USDT)
							</view>
							<view class="det_num">
								{{Number(item.changeBalance).toFixed(4)}}
							</view>
						</view>
						<view class="det_bot">
							{{item.sequence | timeStamp}}
						</view>
					</view>
				</view>
				
				<view class="notice" v-else>
					<image src="../../static/img/norecord.png" mode=""></image>
					<text>暂无明细记录</text>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid:'',
				goldeninfo:'',
				balaninfo:[],
				lastRecordDate:0,
				// time:[]
			}
		},
		created() {
			
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			this.uid = userInfo.userId;
			// console.log(this.uid);
			this.getgolden();
			this.getbalan()
		},
		onReachBottom() {
			this.getbalan();
		},
		filters: {
			timeStamp: function(value) { //具体到时分秒
				if (!value) return '';
				var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var year = date.getFullYear();
				var month = ("0" + (date.getMonth() + 1)).slice(-2);
				var sdate = ("0" + date.getDate()).slice(-2);
				var hour = ("0" + date.getHours()).slice(-2);
				var minute = ("0" + date.getMinutes()).slice(-2);
				var second = ("0" + date.getSeconds()).slice(-2);
				
				// 拼接
				var result = year + "-" + month + "-" + sdate+" "+hour+ ":" + minute+ ":" + second;
				return result;
			}
		},
		methods: {
			//跳转金丹提取
			extract() {
				uni.navigateTo({
					url:'./extract'
				})
			},
			//跳转金丹互转
			exchange() {
				uni.navigateTo({
					url:'./interturn'
				})
			},
			//跳转金丹充值
			charge(){
				uni.navigateTo({
					url:'./recharge'
				})
			},
			//获取金丹余额
			async getgolden() {
				let golden = await this.$request.post('/task/getUserRewardInfo', {
					"data": {
						"base": {
						       "appId": "001",
						        "channels": "001",
						        "ver": "1.1.5",
						        "clientVer": "1.0",
						        "apn": "wifi",
						        "deviceId": "1233eedds2112",
						        "uid": this.uid,
						        "valat": 22.332112,
						        "lalong": 12.332112,
						        "platform": "IOS",
						        "platformVer": "8",
						        "resolution":"960*640",
						        "deviceType":"P6",
						        "carrier":"china mobile",
						        "city":"合肥",
						        "brand": "huawei"
						    }

				
					}
				});
				this.goldeninfo = golden.data.data;
				console.log(this.goldeninfo)
				// this.getnewarray()
			},
			//获取金丹变动记录
			async getbalan() {
				let that=this
				// that.time=[]
				let balan = await this.$request.post('/user/queryUserBalanRecoList', {
					"data": {
						"base": {
						        "appId": "001",
						        "channels": "001",
						        "ver": "1.1.5",
						        "clientVer": "1.0",
						        "apn": "wifi",
						        "deviceId": "1233eedds2112",
						        "uid": this.uid,
						        "valat": 22.332112,
						        "lalong": 12.332112,
						        "platform": "IOS",
						        "platformVer": "8",
						        "resolution": "960*640",
						        "deviceType": "P6",
						        "carrier": "china mobile",
						        "city": "合肥",
						        "brand": "huawei"
						    },
						    "param": {
						        "lastRecordDate":this.lastRecordDate
						    }
					}
				});
				console.log(balan)
				
				if(balan.data.data.length!==0){
					that.balaninfo = that.balaninfo.concat(balan.data.data);
					this.lastRecordDate = balan.data.data[balan.data.data.length-1].sequence
					// for(let i=0;i<that.balaninfo.length;i++){
					// 	let newllist=that.$api.format(that.balaninfo[i].sequence)					
					// 	that.time.push(newllist)
					// 	console.log(that.time)
					//  }
				}
				
				
				// this.getnewarray()
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
		background: url(../../static/img/golden.png) no-repeat;
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
					color:#FFCA4D;
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
	.handle {
		height:100upx;
		background:rgba(255,255,255,1);
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size:36upx;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color:rgba(232,65,112,1);
		line-height:100upx;
		text-align: center;
		.extract {
			width: 250upx;
			text-align: center;
		}
		.exchange {
			width: 248upx;
			border-left: 1px solid #e8e8e8;
			border-right: 1px solid #e8e8e8;
		}
		.recharge {
			width: 250upx;
			text-align: center;
			background:rgba(232,65,112,1);
			color:rgba(255,255,255,1);
		}
	}
</style>
