<template>
	<view class="sitt">
		<view class="header">
			<view class="header_top">
				<image src="../../static/btn_back_normal.png" mode="" @click="navidataBack"></image>
				<text>打坐</text>
				<text></text>
			</view>

			<view class="sit_time">
				<view class="sit_pic">
					<image src="../../static/img/sit_time_bg.png" mode=""></image>
				</view>
				<view class="time">
					已连续打坐<text>{{sign}}</text>天
				</view>
				<view class="sit" v-if="open">
					<view class="calendar">
						<view v-for="(item,index) in part" :key="index" :class="(item.status === 1&&item.date<days)? 'ysterday':(item.status === 1&&item.date==days)? 
						'today':'afterday'" >
							<view class="round" v-if="item.status === 1&item.date<days">
								<image src="../../static/img/stars.png" mode=""></image>
							</view>
							<view class="round" v-else>
								{{item.income}}
							</view>
							<text v-if="item.status === 1&item.date==days">今天</text>
							<text v-else>{{mouth}}.{{item.date}}</text>
						</view>
						<!-- <view class="ysterday">
							<view class="round">
								<image src="../../static/img/stars.png" mode=""></image>
							</view>
							<text>4.1</text>
						</view>
						<view class="today">
							<view class="round">
								+2
							</view>
							<text>今天</text>
						</view>
						<view class="afterday" v-for="i in 5">
							<view class="round">
								+{{i+2}}
							</view>
							<text>4.3</text>
						</view> -->
					</view>
				</view>
				<view class="" v-else>
					<view class="mouth">
						<view class="sit_left" @click="lastpage()">
							<image src="../../static/img/sit_left.png" mode=""></image>
						</view>
						<view class="time">
							{{year}}年{{mouth}}月
						</view>
						<view class="sit_right" @click="nextpage()">
							<image src="../../static/img/sit_right.png" mode=""></image>
						</view>
					</view>
					<view class="days">
						<!-- <view class="dliy" v-for="(item,index) in ditateinfo" :key="index" :class="{today: item.status === 1&item.date<days}"> -->
						<view v-for="(item,index) in ditateinfo" :key="index"
						 :class="(item.status === 1&&item.date<days)? 'ysterday':(item.status === 1&item.date==days)? 'today':'afterday'">
							<view class="round" v-if="item.status === 1&item.date<days">
								<image src="../../static/img/stars.png" mode=""></image>
							</view>
							<view class="round" v-else>
								{{item.income}}
							</view>
							<text v-if="item.status === 1&item.date==days">今天</text>
							<text v-else>{{mouth}}.{{item.date}}</text>
						</view>
					</view>
				</view>
				<view class="open" v-if="open" @click="getopendays()">
					<image src="../../static/img/open.png" mode=""></image>
				</view>
				<view class="open" v-else @click="getdowndays()">
					<image src="../../static/img/down.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="countdown">
				<view class="enrtop">
					<ul>
						<li>{{parseInt(hour/10)}}</li>
						<li>{{parseInt(hour%10)}}</li>
						<text>:</text>
						<!-- <li class="colon">:</li> -->
						<li>{{parseInt(minute/10)}}</li>
						<li>{{parseInt(minute%10)}}</li>
						<text>:</text>
						<!-- <li class="colon">:</li> -->
						<li>{{parseInt(timeCount/10)}}</li>
						<li>{{parseInt(timeCount%10)}}</li>
					</ul>
				</view>
				<view class="enrtop_pic">
					<image src="../../static/img/sit.png" mode=""></image>
				</view>
				<!-- <view class="start" v-if="sitid==''" @click="startsit()" v-show="!endsit">
					开始打坐
				</view>
				<view class="start" v-else>
					今日已打坐
				</view> -->
				 <!--  v-if="sitstatus!=1" -->
				<view class="start" @click="startsit()" v-show="!endsit">
					开始打坐
				</view>
				<!-- <view class="start" v-else>
					开始打坐
				</view> -->
				<view class="start" v-show="endsit" @click="meditation()">
					结束打坐
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				open: true,
				year: 2020,
				mouth: '',
				day: [],
				ditateinfo: [],
				uid: '',
				days: '',
				sitstatus: '',
				endsit: false,
				meditateId: '',
				hour: 0,
				minute: 0,
				second: 0,
				timeCount: 0,
				intervalId: null,
				sign:0,
				part:[],
				id:"",
				meditateinfo:"",
				timecount:0

			}
		},
		created() {
			
		},
		onHide() {
			// console.log(11111)
			// this.stoptime();
			// uni.setStorageSync('sittime', {hour:this.hour,minute:this.minute,timeCount:this.timeCount})
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			this.uid = userInfo.userId;
			var sittime = uni.getStorageSync("sittime");
			if(sittime != '') {
				this.timeCount = sittime.timeCount;
				this.minute = sittime.minute;
				this.hour = sittime.hour;
			}
			console.log(this.uid)
			this.getdate();
			this.getmeditate(this.year, this.mouth)
			// this.mGetDate(this.year, this.mouth);
			this.getresitdefine();
			this.getDuration();
		},
		methods: {
			navidataBack() {
				uni.navigateBack();
			},
			//获取当前年份和月份
			getdate() {
				var date = new Date();
				this.year = date.getFullYear();
				this.mouth = date.getMonth() + 1;
				this.days = date.getDate(); //获取当前日期
				console.log(this.days)
			},
			//获取当前月有多少天
			// mGetDate(year, month) {
			// 	var d = new Date(year, month, 0);
			// 	console.log(d.getDate());
			// 	this.getEvryDay(d.getDate())
			// },
			// //获取当前月份的所以天数
			// getEvryDay(day) {
			// 	var dayArry = [];
			// 	// for (var i = 1; i <= day; i++) {
			// 	// 			dayArry.push(i);
			// 	//    }
			// 	//    this.day = dayArry;
			// 	// 	 console.log(this.day)
			// },
			//点击下一月
			nextpage() {
				this.mouth = this.mouth + 1
				if (this.mouth > 12) {
					this.year = this.year + 1
					this.mouth = 1
					this.getmeditate(this.year, this.mouth)
				} else {
					this.getmeditate(this.year, this.mouth)
				}

			},
			//上一页
			lastpage() {
				this.mouth = this.mouth - 1
				if (this.mouth < 1) {
					this.year = this.year - 1
					this.mouth = 12
					this.getmeditate(this.year, this.mouth)
				} else {
					this.getmeditate(this.year, this.mouth)
				}

			},
			//打开所有日期
			getopendays() {
				this.open = false
			},
			//关闭
			getdowndays() {
				this.open = true
			},
			//用户签到情况和奖励情况
			async getmeditate(year, mouth) {
				let ditate = await this.$request.post('/user/meditate/list', {
					"data": {
						"uid": this.uid,
						"year": year,
						"month": mouth

					}
				});
				// console.log(ditate)
				this.ditateinfo = ditate.data.data;
				console.log('yonghuxinxi',this.ditateinfo)
				this.sign = this.ditateinfo.sign
				// console.log('lxdz',this.sign)
				var dzday = ditate.data.data.dates;
				dzday.forEach((item, index) => {
					var date = (item.date).substring((item.date).length - 2, (item.date).length)
					var dates = date.replace(/\b(0+)/gi, "")
					dzday[index].date = dates
					this.ditateinfo = dzday
					// console.log(dzday)
					// var date=[]
					// 			date.push((item.date).substring((item.date).length-2,(item.date).length))
					// 			console.log(date)
				});
				
				this.part = this.ditateinfo.slice(this.days-2,this.days+5)
				// console.log(this.part)
				// console.log(this.ditateinfo)
				// this.getnewarray()
			},
			//判断今日是否打坐 
			async getresitdefine() {
				let sitdefine = await this.$request.post('/user/meditate/get', {
					"data": {
						"uid": this.uid
					}
				});
				this.sitdefine = sitdefine.data.data;
				this.sitid = this.sitdefine.id
				// this.sitstatus = this.sitdefine.status
				// console.log(this.sitdefine)
			},
			// 时间换算
			 timecomputed(t){
				 this.hour=Math.floor(t/3600);
				 this.minute=Math.floor((t-this.hour*3600)/60);
				 this.timeCount=t-(this.hour*60+this.minute)*60;
			 },
			//当前打坐时间
			async getDuration() {
				let meditate = await this.$request.post('/user/meditate/get', {
					"data": {					
							"uid": this.uid
					}
				});
				this.meditateinfo = meditate.data.data.duration;
				// console.log(this.meditateinfo)
				this.flag = meditate.data.data.flag;
				if(this.flag==1){
					this.endsit=false;
				}else if(this.flag==2) {
					this.endsit=true;
					this.addtime();
				}
				
				// this.getnewarray()
				let startTime = meditate.data.data.startTime;
				
				if(startTime!==0){
					let currentTime=new Date().getTime();
					this.timecount=this.flag==1? this.meditateinfo:parseInt((currentTime - startTime)/1000+this.meditateinfo);
					// console.log(this.timeCount)
					this.timecomputed(this.timecount)
				}else{
					this.timecount==0;
				}
				
			},
			//开始打坐
			async startsit() {
				let sit = await this.$request.post('/user/meditate/start', {

					"data": {
						"uid": this.uid
					}
				});
				if(sit.data.base.code == "000000") {
					this.id=sit.data.data.id;
					// 计时器正在进行中，退出函数
					this.addtime();
					// this.sitstart = sit.data.data;
					// this.meditateId = this.sitstart.id
					// console.log(this.sitstart)
					// this.endsit = true;
					// this.addtime()
				}
				// }else {
				// 	uni.showToast({
				// 		title: sit.data.base.msg,
				// 		duration: 1000,
				// 		icon: 'none'
				// 	});
				// }
				
			},
			//结束打坐
			async meditation() {
				
				let result = await this.$request.post('/user/meditate/end',{
					"data": {
						"uid": this.uid,
						"meditateId": this.id
					}
				});
				this.stoptime();
				
				
				// if(this.minute>=2) {
				// 	let sitend = await this.$request.post('/user/meditate/end', {
					
				// 		"data": {
				// 			"uid": this.uid,
				// 			"meditateId": this.meditateId
					
				// 		}
				// 	});
				// 	if (sitend.data.base.code == '000000') {
				// 		this.getmeditate(this.year,this.mouth)
				// 		this.endsit = false
				// 		this.sitstatus = sitend.data.data.status;
				// 		this.stoptime();
				// 		uni.setStorageSync('sittime', {hour:this.hour,minute:this.minute,timeCount:this.timeCount})
				// 	} else {
				// 		uni.showToast({
				// 			title: sitend.data.base.msg,
				// 			duration: 1000,
				// 			icon: 'none'
				// 		});
				// 	}
				// } else {
				// 	let that = this;
				// 	// uni.showModal({
				// 	//     // title: '提示',
				// 	//     content: '打坐时间不到指定时间，提前结束时间则清零，需重新打坐',
				// 	//     success: function (res) {
				// 	//         if (res.confirm) {
				// 	// 					that.stoptime();
				// 	// 					that.hour = 0;
				// 	// 					that.minute = 0;
				// 	// 					that.timeCount = 0;
				// 	// 					that.endsit = false
				// 	// 					uni.removeStorageSync('sittime');
				// 	//            // console.log('用户点击确定');
				// 	//         } else if (res.cancel) {
				// 	//             // console.log('用户点击取消');
				// 	//         }
				// 	//     }
				// 	// });
				// }
				
			},
			
			//计时
			addtime() {
				this.endsit=true;
				// 计时器正在进行中，退出函数
				if (this.intervalId != null) {
					return
				};
				// 计时器为空，操作
				this.intervalId = setInterval(() => {
					this.timecount += 1;
					this.timecomputed(this.timecount)
					
				}, 1000)

			},
			// 停止定时器
			stoptime() {
				clearInterval(this.intervalId) //清除计时器
				this.intervalId = null; //设置为null 
				this.endsit=false;
			}
		}

	}
</script>

<style lang='scss'>
	page {
		background: rgba(240, 240, 240, 1);
	}

	ul {
		padding-left: 0;
	}

	li {
		list-style: none;
	}

	.header {
		background: url(../../static/img/sit_bg.png) no-repeat;
		background-size: cover;
		height: 300upx;
		text-align: center;
		padding-top: var(--status-bar-height);
		font-size: 36upx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		padding: 44upx 0 0 0;
		box-sizing: border-box;

		.header_top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30upx;
			box-sizing: border-box;

			image {
				width: 44upx;
				height: 44upx;
			}

			text {
				color: rgba(255, 255, 255, 1);
			}
		}

	}

	.sit_time {
		width: 690upx;
		/* height:302upx; */
		/* background:url(../../static/img/sit_time_bg.png) no-repeat; */
		background-size: cover;
		box-shadow: 0px 22px 20px 0px rgba(240, 240, 242, 0.3);
		border-radius: 4px;
		margin: 24upx auto 120upx;
		padding: 30upx;
		box-sizing: border-box;
		position: relative;
		z-index: 99;
		background: #FFFFFF;

		.time {

			text-align: left;

			text {
				color: #E84170;
			}
		}
	}

	.sit {
		margin-top: 40upx;
		.calendar  {
			display: flex;
			justify-content: flex-start;
			margin-top: 24upx;
		}
	}
	.ysterday {
		width: 80upx;
		height: 108upx;
		background: #f3bfce;
		border-radius: 8upx;
		padding: 14upx 14upx 6upx 14upx;
		box-sizing: border-box;
		margin-right: 10upx;
		.round {
		
			width: 52upx;
			height: 52upx;
			background: #f3688f;
			text-align: center;
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			border-radius: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		
			image {
				width: 28upx;
				height: 28upx;
			}
		}
		
		text {
			font-size: 20upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			display: block;
			text-align: center;
			margin-top: 8upx;
		}
	}
	.afterday {
		width: 80upx;
		height: 108upx;
		background: rgba(246, 246, 246, 1);
		border-radius: 8upx;
		padding: 14upx 14upx 6upx 14upx;
		box-sizing: border-box;
		margin-right: 10upx;
		.round {

			width: 52upx;
			height: 52upx;
			background: rgba(226, 226, 226, 1);
			text-align: center;
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			border-radius: 100%;
			display: flex;
			justify-content: center;
			align-items: center;

		}

		text {
			font-size: 20upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			display: block;
			text-align: center;
			margin-top: 8upx;
		}
	}

	.open {
		text-align: center;

		image {
			width: 20upx;
			height: 10upx;
		}
	}

	.content {
		margin-top: 190upx;
	}

	.enrtop {
		display: flex;
		justify-content: center;

		ul {
			padding: 0;
			display: flex;
			justify-content: flex-start;
			align-items: center;

			li {
				width: 27upx;
				height: 40upx;
				border-radius: 3upx;
				border: 1px solid rgba(51, 51, 51, 1);
				margin-left: 8upx;
				font-size: 27upx;
				font-family: DINCondensed-Bold, DINCondensed;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				line-height: 40upx;
				text-align: center;
			}

			text {
				margin: 0 6upx;
			}

			.colon {
				border: none;
			}
		}
	}

	.enrtop_pic {
		width: 326upx;
		height: 329upx;
		margin: 100upx auto 126upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.start {
		width: 630upx;
		height: 88upx;
		background: rgba(232, 65, 112, 1);
		border-radius: 4upx;
		text-align: center;
		line-height: 88upx;
		margin: 0 auto;
		font-size: 36upx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}

	.mouth {
		width: 630upx;
		height: 80upx;
		background: rgba(246, 246, 246, 1);
		box-shadow: 0px 22upx 20upx 0px rgba(240, 240, 242, 0.3);
		border-radius: 50upx;
		margin: 40upx auto;
		padding: 30upx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.sit_left {
			width: 5%;

			image {
				width: 10upx;
				height: 20upx;
			}
		}

		.time {
			font-size: 32upx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: rgba(102, 102, 102, 1);
		}

		.sit_right {
			width: 5%;

			image {
				width: 10upx;
				height: 20upx;
			}
		}
	}

	.days {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.dliy {
		width: 80upx;
		height: 108upx;
		background: rgba(246, 246, 246, 1);
		border-radius: 8upx;
		padding: 14upx 14upx 6upx 14upx;
		box-sizing: border-box;
		margin-right: 10upx;
		margin-bottom: 10upx;

		.round {

			width: 52upx;
			height: 52upx;
			background: rgba(226, 226, 226, 1);
			text-align: center;
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			border-radius: 100%;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 28upx;
				height: 28upx;
			}
		}

		text {
			font-size: 20upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			display: block;
			text-align: center;
			margin-top: 8upx;
		}
	}

	.sit_pic {
		position: absolute;
		top: 10upx;
		right: 10upx;

		image {
			width: 106upx;
			height: 84upx;
		}
	}
	
	.today {
		width: 80upx;
		height: 108upx;
		background: rgba(232, 65, 112, 1);
		border-radius: 8upx;
		padding: 14upx 14upx 6upx 14upx;
		box-sizing: border-box;
		margin-right: 10upx;
		.round {
	
			width: 52upx;
			height: 52upx;
			background: #f3688f;
			text-align: center;
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			border-radius: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			
			
		}
	
		text {
			font-size: 20upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			display: block;
			text-align: center;
			margin-top: 8upx;
		}
	}
</style>
