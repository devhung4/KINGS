<template>
	<view class="live">
		<view class="header">
			
		</view>
		<view class="video_play">
			<video id="myVideo" src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4"
			 controls :autoplay="videoautoplay" :show-center-play-btn="showcplay" show-play-btn=""></video>
			 <view class="video_bot">
				 <view class="video_black">
				 	<image src="../../static/img/btn_back_normal.png" mode=""></image>
				 </view>
				 <!-- <navigator url="./class" hover-class="navigator-hover">
				 	<image src="../../static/img/btn_back_normal.png" mode=""></image>
				 </navigator> -->
					<view class="video_share">
						<image src="../../static/img/btn_share_normal.png" mode=""></image>
					</view>
			 </view>
		</view>
		<view class="suggest">
			<view class="suggest_title">
				道医养生之道，吃喝拉撒睡，事事皆有学问，攸关健康所在
			</view>
			<view class="suggest_name">
				<view class="name_left">
					讲课医师：张之仲
				</view>
				<view class="name_right">
				</view>
			</view>
			<view class="suggest_time">
				直播时间：2020-04-10 17:0
			</view>
		</view>
		<view class="countdown">
			<view class="down_title">
				直播倒计时
			</view>
			<view class="down_time">
				<ul>
					<li>0</li>
					<li>0</li>
					<text>:</text>
					<!-- <li class="colon">:</li> -->
					<li>1</li>
					<li>3</li>
					<text>:</text>
					<!-- <li class="colon">:</li> -->
					<li>4</li>
					<li>7</li>
				</ul>
			</view>
		</view>
		<view class="enroll">
			266人已预约
		</view>
		<view class="mask" v-show="subscribe">
			<view class="subscribe">
				<view class="success_enroll">
					<image src="../../static/icon_selected.png" mode=""></image>
					<text>预约成功</text>
				</view>
				<view class="success_info">
					预约详情请前往
					<text>(自在-预约报名)</text>
					查看
				</view>
				<view class="success_bot">
					我知道了
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		 data() {
					return {
							videoautoplay: false,
							showcplay: false,
							showplaybtn: false,
							subscribe: false
					}
			},
			created() {
			},
			methods: {
				
			}
	}
</script>

<style lang='scss'>
	page {
		background: rgba(240, 240, 240, 1);
	}
	
	li {
		list-style: none;
	}
	
	ul {
		padding: 0;
	}
	.header {
		padding-top: var(--status-bar-height);
	}
	.video_play {
		height:422upx;
		position: relative;
		video {
			width: 100%;
		}
		uni-video {
			height: 100%;
		}
		
	}
	.video_bot {
		position: absolute;
		top: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 9999;
		height: 88upx;
		width: 100%;
		padding: 0 30upx;
		image {
			width:88upx;
			height:88upx;
		}
	}
	.suggest {
		padding: 30upx;
		box-sizing: border-box;
		background: #FFFFFF;
		.suggest_title {
			font-size:34upx;
			font-family:PingFangSC-Semibold,PingFang SC;
			color:rgba(51,51,51,1);
			line-height:48upx;
			margin: 20upx 0 10upx 0;
		}
		.suggest_name {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size:28upx;
			font-family:PingFangSC-Regular,PingFang SC;
			color:rgba(102,102,102,1);
			line-height:40upx;
		}
		.suggest_time {
			font-size:28upx;
			font-family:PingFangSC-Regular,PingFang SC;
			color:rgba(153,153,153,1);
			line-height:40upx;
		}
	}
	.countdown {
		margin-top: 20upx;
		height:218upx;
		background:rgba(255,255,255,1);
		padding: 30upx 0 32upx;
		text-align: center;
		
			.down_title {
				font-size:32upx;
				font-family:PingFangSC-Semibold,PingFang SC;
				font-weight:600;
				color:rgba(51,51,51,1);
				line-height:44upx;
				position: relative;
				&::after {
					position: absolute;
					content: "";
					width: 30upx;
					bottom: -20upx;
					text-align: center;
					border-bottom: 10upx solid #e84170;
					left: 50%;
					-webkit-transform: translate(-50%, -50%);
					transform: translate(-50%, -50%);
					font-weight: 600;
					color: #333333;
				}
			}
		 .down_time {
			 margin-top: 26upx;
			 display: flex;
			 justify-content: center;
			 ul {
				 padding: 0;
				 	display: flex;
				 	justify-content: flex-start;
				 	align-items: center;
				 	margin-right: 48upx;
				 	li {
				 		width:49upx;
				 		height:73upx;
				 		border-radius:5upx;
				 		border:1px solid rgba(51,51,51,1);
				 		margin-left: 8upx;
				 		font-size:48upx;
				 		font-family:DINCondensed-Bold,DINCondensed;
				 		font-weight:bold;
				 		color:rgba(51,51,51,1);
				 		line-height:73upx;
						text-align: center;
				 	}
				 	text {
				 		margin: 0 6upx;
						font-size:48upx;
						margin-bottom: 10upx;
				 	}
			 }
		 }
	 }
	 
	 .enroll {
	 	position: fixed;
	 	left: 0;
	 	bottom: 0;
	 	width: 100%;
	 	height:120upx;
	 	background:rgba(232,65,112,1);
	 	font-size:36upx;
	 	font-family:PingFangSC-Medium,PingFang SC;
	 	font-weight:500;
	 	color:rgba(255,255,255,1);
	 	line-height:120upx;
	 	text-align: center;
	 }
	 .subscribe {
		 		width:582upx;
		 		height:328upx;
		 		background:rgba(255,255,255,1);
		 		border-radius:4upx;
		 		position: absolute;
		 		left: 50%; 
		 		top: 50%;   
		 		transform: translate(-50%, -50%); 
		 		padding: 70upx 30upx 36upx;
		 		box-sizing: border-box;
		 		text-align: center;
		 		
		 	 .success_enroll {
		 		 display: flex;
		 		 align-items: center;
		 		 justify-content: center;
		 		 image {
		 			 width:40upx;
		 			 height:40upx;
		 		 }
		 		 text {
		 			 font-size:36upx;
		 			 font-family:PingFangSC-Medium,PingFang SC;
		 			 font-weight:500;
		 			 color:rgba(232,65,112,1);
		 			 line-height:50upx;
		 			 margin-left: 20upx;
		 		 }
		 	 }
		 	 .success_info {
		 		 font-size:28upx;
		 		 font-family:PingFangSC-Regular,PingFang SC;
		 		 font-weight:400;
		 		 color:rgba(153,153,153,1);
		 		 line-height:40upx;
		 		 margin: 28upx 0;
		 		 text {
		 			 color: #333333;
		 		 }
		 	 }
		 	 .success_bot {
		 		 width:522upx;
		 		 height:80upx;
		 		 background:rgba(232,65,112,1);
		 		 border-radius:4upx;
		 		 font-size:32upx;
		 		 font-family:PingFangSC-Medium,PingFang SC;
		 		 font-weight:500;
		 		 color:rgba(255,255,255,1);
		 		 line-height:80upx;
		 	 }
	 }
</style>
