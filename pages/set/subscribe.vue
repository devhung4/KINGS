<template>
	<view class="subscribe">
		<view v-if="!courseinfo.length" style="width:100%;padding:100upx 0;text-align: center;">
			<view><image src="../../static/nodata.png" style="width:360upx;height:250upx"></image></view>
			<view style="color: #999;font-size: 30upx;">暂无报名课程</view>
		</view>
		<view v-else class="sub" v-for="(item,index) in courseinfo" :key="index" @click="gotocourse(item.id,item.level,item.signUpFlag)">
			<view class="sub_time">
				<view class="red_time">
					<view class="redd"></view>
					<view class="time">
						时间：{{item.startTime | timeStamp}}
					</view>
				</view>
				<view class="remaining" v-show="live">
					<text>剩余:&nbsp;&nbsp;&nbsp;</text>
					<uni-countdown :show-day="false" :hour="item.hour || 0" :minute="item.minute || 
					0" :second="item.second || 0" :reset="false" color="#000" background-color="#fff"></uni-countdown>
				</view>
			</view>
			<view class="sub_info">
				<view class="sub_pic">
					<image :src="item.image" mode=""></image>
				</view>
				<view class="sub_show" style="width: 100%;">
					<view class="sub_title">{{item.title}}</view>
					<view class="sub_auto">{{item.teacher}} <text class="sub_bot">{{item.signUpFlag==1?'已报名':'未报名'}}</text> </view>
					<view class="sub_day" style="width: 100%;">
						<view class="day" style="width: 100%;">{{item.remark&&item.remark!=''?item.remark:remarks}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniCountdown from '@/components/linnian-CountDown/uni-countdown.vue';
	export default {
		components:{
			uniCountdown
		},
		data() {
			return {
				live: false,
				courseinfo:[],
				uid: '',
				remarks:"暂无信息"
			}
		},
		onLoad() {
			//获取用户id
			var id = uni.getStorageSync("userInfo");
			this.uid = id.userId;
			this.getcourse()
		},
		created() {
		},
		methods: {
			gotocourse(id,level,sign){
				uni.navigateTo({
					url:'../index/video?id='+id+'&level='+level+'&sign='+sign
				})
			},
			//已报名课程
			async getcourse() {
				let that = this;
				let courselist = await that.$request.post('/home/course/list', {
					"data": {
						"uid": that.uid
					}
				});
				if(courselist.data.base.code=="000000"){
					// if(courselist.data.data.length>0){
					// 	for(let i=0; i<courselist.data.data.length; i++){
					// 		that.timeleft(courselist.data.data[i].startTime,i);
					// 	}
					// }
					that.courseinfo = courselist.data.data;
					console.log(that.courseinfo)
				}else{
					that.$api.msg(courselist.data.base.msg);
				}
			},
			// 比较时间
			timeleft(value,index){
				let that = this;
				if (!value) return '';
				let nowtime = new Date();
				let havetime = value - nowtime.getTime();
				
				if (havetime >= 0) {
					//计算出相差天数
					var days = Math.floor(havetime / (24 * 3600 * 1000));
					//计算出小时数  
					var leave1 = havetime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数  
					var hours = Math.floor(leave1 / (3600 * 1000));
					//计算相差分钟数  
					var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数  
					var minutes = Math.floor(leave2 / (60 * 1000));
					//计算相差秒数  
					var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数  
					var seconds = Math.round(leave3 / 1000);
					// console.log(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
					that.courseinfo[index].hour = hours;
					that.courseinfo[index].minute = minutes;
					that.courseinfo[index].second = seconds;
				}else{
					that.$data.live = false;
				}
			}
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
		}
	}
</script>

<style lang='scss'>
	page {
		background: rgba(240, 240, 240, 1);
	}
	.sub {
		margin-top: 20upx;
		width:750upx;
		/* height:328upx; */
		background:rgba(255,255,255,1);
	}
	.redd {
		width:10upx;
		height:10upx;
		background:rgba(232,65,112,1);
		margin-right: 10upx;
	}
	.sub_time {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx 30upx;
		box-sizing: border-box;
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(102,102,102,1);
		border-bottom: 1px solid #E8E8E8;
	}
	.sub_info {
		padding: 30upx;
		box-sizing: border-box;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.sub_pic {
			image {
				width:168upx;
				height:168upx;
			}
		}
		.sub_show {
			margin-left: 30upx;
			.sub_title {
				font-size:32upx;
				font-family:PingFangSC-Semibold,PingFang SC;
				font-weight:600;
				color:rgba(51,51,51,1);
				height: 21px;
				overflow-y: hidden;
			}
			.sub_auto {
				font-size:28upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
				margin: 20upx 0 30upx;
				.sub_bot {
					width:88upx;
					height:36upx;
					border-radius:4upx;
					border:2upx solid rgba(153,153,153,1);
					line-height: 32upx;
					text-align: center;
					position: absolute;
					right: 50upx;
					color: #999999;
				}
			}
			.sub_day {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size:24upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(153,153,153,1);
				
				
			}
		}
	}
	.red_time {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.enrtop {
		ul {
			padding: 0;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			li {
				width:27upx;
				height:40upx;
				border-radius:3upx;
				border:1px solid rgba(51,51,51,1);
				margin-left: 8upx;
				font-size:27upx;
				font-family:DINCondensed-Bold,DINCondensed;
				font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:40upx;
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
	.remaining {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
</style>
