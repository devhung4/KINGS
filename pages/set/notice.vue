<template>
	<view class="notice">
		<navigator url="./details" hover-class="navigator-hover">
			<view class="notice_info">
				<view class="notice_title">
					<text class="title">神农记消息通知</text>
					<text class="time">5分钟前</text>
				</view>
				<view class="info">
					<image src="../../static/img/maker_banner.png" mode="" v-show="noticepic"></image>
					<text>显示公告详情显示最多一行公告详情显示公告</text>
				</view>
			</view>
		</navigator>
		<navigator url="./details" hover-class="navigator-hover">
			<view class="notice_info">
				<view class="notice_title">
					<text class="title">神农公告</text>
					<text class="time">01.31 15:00</text>
				</view>
				<view class="info">
					<image src="../../static/img/maker_banner.png" mode="" v-show="!noticepic"></image>
					<text>显示公告详情显示最多一行公告详情显示公告</text>
				</view>
			</view>
		</navigator>
		
	</view>
</template>

<script>
	export default {
		 data() {
					return {
							noticepic: false
					}
			},
			created() {
			},
			methods: {
				
			}
	}
</script>

<style lang='scss'>

	li {
		list-style: none;
	}

	ul {
		padding: 0;
	}
	.notice {
		padding: 0 30upx;
		box-sizing: border-box;
		 
	}
	.notice_info {
		padding: 40upx 0;
		box-sizing: border-box;
		border-bottom: 1px solid #e8e8e8;
		.notice_title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title {
				font-size:30upx;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:500;
				color:rgba(51,51,51,1);
			}
			.time {
				font-size:24upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(153,153,153,1);
			}
		}
		.info {
			font-size:26upx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(153,153,153,1);
			margin-top: 12upx;
			image {
				margin: 20upx 0;
				width: 100%;
				height:300upx;
			}
		}
	}
</style>
