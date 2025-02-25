<template>
	<view class="class">
		<view class="header">
			<view class="header_left">
				<navigator url="./search" hover-class="navigator-hover">
					<input type="text" value="" placeholder="请输入关键字" />
				</navigator>
			</view>
			<view class="header_right">
				<image src="../../static/img/order.png" mode=""></image>
				<span>预约</span>
				<!-- <image src="../../static/img/btn_search_normal.png" mode=""></image> -->
			</view>
		</view>

		<view class="content">
			<view class="type_list">
				<ul>
					<li class="active">精选</li>
					<li>道医传承</li>
					<li>易经风水</li>
					<li>奇门遁甲</li>
					<li>道医传承</li>
					<li>易经风水</li>
					<li>奇门遁甲</li>
				</ul>
			</view>
			<view class="type_content">
				<view class="carousel">
					<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autop" :interval="interval" :duration="duration">
						<swiper-item>
							<view class="swiper-item">
								<image src="../../static/img/yszd.png" mode=""></image>
							</view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item">
								<image src="../../static/img/yszd.png" mode=""></image>
							</view>
						</swiper-item>
					</swiper>
				</view>
				<view class="type_brief">
					<ul>
						<li>
							<view class="brief_left">
								<image src="../../static/img/brief.png" mode=""></image>
							</view>
							<view class="brief_right">
								<view class="brief_title">道医的养生之道吃喝拉撒睡…</view>
								<view class="brief_name">张之仲</view>
								<view class="brief_time">
									<text>已更新1期/共3期</text>
									<view class="watch">
										<image src="../../static/img/watch.png" mode=""></image>
										<text>1.2w人</text>
									</view>
								</view>
							</view>
						</li>
						<li>
							<view class="brief_left">
								<image src="../../static/img/brief.png" mode=""></image>
							</view>
							<view class="brief_right">
								<view class="brief_title">道医的养生之道吃喝拉撒睡…</view>
								<view class="brief_name">张之仲</view>
								<view class="brief_time">
									<text>已更新1期/共3期</text>
									<view class="watch">
										<image src="../../static/img/watch.png" mode=""></image>
										<text>1.2w人</text>
									</view>
								</view>
							</view>
						</li>
						<li>
							<view class="brief_left">
								<image src="../../static/img/brief.png" mode=""></image>
							</view>
							<view class="brief_right">
								<view class="brief_title">道医的养生之道吃喝拉撒睡…</view>
								<view class="brief_name">张之仲</view>
								<view class="brief_time">
									<text>已更新1期/共3期</text>
									<view class="watch">
										<image src="../../static/img/watch.png" mode=""></image>
										<text>1.2w人</text>
									</view>
								</view>
							</view>
						</li>
						<li>
							<view class="brief_left">
								<image src="../../static/img/brief.png" mode=""></image>
							</view>
							<view class="brief_right">
								<view class="brief_title">道医的养生之道吃喝拉撒睡…</view>
								<view class="brief_name">张之仲</view>
								<view class="brief_time">
									<text>已更新1期/共3期</text>
									<view class="watch">
										<image src="../../static/img/watch.png" mode=""></image>
										<text>1.2w人</text>
									</view>
								</view>
							</view>
						</li>
						<li>
							<view class="brief_left">
								<image src="../../static/img/brief.png" mode=""></image>
							</view>
							<view class="brief_right">
								<view class="brief_title">道医的养生之道吃喝拉撒睡…</view>
								<view class="brief_name">张之仲</view>
								<view class="brief_time">
									<text>已更新1期/共3期</text>
									<view class="watch">
										<image src="../../static/img/watch.png" mode=""></image>
										<text>1.2w人</text>
									</view>
								</view>
							</view>
						</li>
						<li>
							<view class="brief_left">
								<image src="../../static/img/brief.png" mode=""></image>
							</view>
							<view class="brief_right">
								<view class="brief_title">道医的养生之道吃喝拉撒睡…</view>
								<view class="brief_name">张之仲</view>
								<view class="brief_time">
									<text>已更新1期/共3期</text>
									<view class="watch">
										<image src="../../static/img/start.png" mode=""></image>
										<text>1.2w人</text>
									</view>
								</view>
							</view>
						</li>
					</ul>
				</view>
			</view>


		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indicatorDots: true,
				interval: 2000,
				duration: 500,
				autop: true
			}
		},
		created() {
			console.log(uni.getSystemInfoSync())
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
		height: 120.2upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 18.2upx 30upx 20upx 30upx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		top: 0;
		padding-top: var(--status-bar-height);
		width: 100%;
		background: #fff;
		z-index: 10;
		border-bottom: 20upx solid rgba(240, 240, 240, 1);
		.header_left {
			position: relative;
			margin-right: 30upx;
			background: rgba(240, 240, 240, 1);
			width: 100%;

			input {
				width: 100%;
				height: 60upx;
				border-radius: 8upx;
				background: url(../../static/img/btn_search_normal.png) no-repeat;
				background-position: 25% center;

			}

			image {
				width: 40upx;
				height: 40upx;
				position: absolute;
				top: 14upx;
				left: 25%;

			}

		}

		.header_right {
			text-align: center;
			margin-top: 10upx;

			image {
				width: 40upx;
				height: 40upx;
			}

			span {
				display: block;
				white-space: nowrap;
				font-size: 24upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				color: rgba(51, 51, 51, 1);
				margin-top: -15upx;
			}
		}
	}

	.input-placeholder {
		text-align: center
	}

	.content {
		margin-top: 120.2upx;
	}

	.type_list {
		position: fixed;
		box-sizing: border-box;
		overflow-x: hidden;
		width: 100%;
		top: 120.2upx;
		left: 0;
		z-index: 20;
		ul {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			overflow-x: scroll;
			width: 100%;
			background: #fff;

			li {
				white-space: nowrap;
				padding: 24upx 30upx 26upx 30upx;
				font-weight:400;
				box-sizing: border-box;
				position: relative;

			}
		}
	}

	.active:after {
		position: absolute;
		content: "";
		width: 30upx;
		bottom: 6upx;
		text-align: center;
		border-bottom: 10upx solid rgba(232, 65, 112, 1);
		left: 50%;
		transform: translate(-50%, -50%);
		font-weight:600;
		color:rgba(51,51,51,1);
	}

	.type_content {
		margin-top: 220upx;
		.carousel {
			height:300upx;
			margin-bottom: 30upx;
			.swiper-item {
				height: 100%;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		.type_brief {
			padding: 0 30upx 14upx;
			box-sizing: border-box;
			ul {
				li {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding: 30upx;
					box-sizing: border-box;
					background: #FFFFFF;
					margin-bottom: 20upx;
					.brief_left {
						width:168upx;
						height:168upx;
						image {
							width: 100%;
							height: 100%;
						}
					}
					.brief_right {
						margin-left: 30upx;
						.brief_title {
							font-size:32upx;
							font-family:PingFangSC-Semibold,PingFang SC;
							color:rgba(51,51,51,1);
							line-height:44upx;
						}
						.brief_name {
							font-size:28upx;
							font-family:PingFangSC-Regular,PingFang SC;
							font-weight:400;
							color:rgba(51,51,51,1);
							line-height:40upx;
							margin: 20upx 0 30upx 0;
						}
						.brief_time {
							font-size:24upx;
							font-family:PingFangSC-Regular,PingFang SC;
							color:rgba(153,153,153,1);
							line-height:34upx;
							display: flex;
							justify-content: space-between;
							
							.watch {
								
								image {
									width:26upx;
									height:18upx;
									margin-right: 10upx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
