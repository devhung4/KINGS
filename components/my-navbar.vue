<template>
	<view class="navbar">
		<view class="left">
			<slot name="left">
				<view @click="handleBack()">
					<image src="/static/image/go_back2.png" mode="aspectFill"></image>
				</view>
			</slot>
		</view>
		<view class="title">
			<slot name="title">
				<text class="">{{title}}</text>
			</slot>
		</view>
		<view class="right">
			<slot name="right">
				Right
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-navbar",
		props: {
			title: {
				type: String,
				default: ''
			},
		},
		mounted() {
			this.initSystemInfo()
			this.checkBackable()
		},
		data() {
			return {
				statusBarHeight: 20, // 默认状态栏高度 
				showBack: false
			};
		},
		methods: {
			initSystemInfo() {
				const systemInfo = uni.getSystemInfoSync()
				this.statusBarHeight = systemInfo.statusBarHeight || 20
			},
			checkBackable() {
				const pages = getCurrentPages()
				this.showBack = pages.length > 1
			},
			handleBack() {
				uni.navigateBack({
					delta: 1,
				});
			}
		}
	}
</script>

<style lang="scss">
	.navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		width: 100%;
		padding: 11px 15px;
		min-height: 48px;
		background-color: #000;

		.title {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;
			color: #ffffff;
			font-weight: bold;
		}

		.left {
			image {
				width: 76rpx;
				height: 76rpx;
				display: block;
			}
		}
	}
</style>