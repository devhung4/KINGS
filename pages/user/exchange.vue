<template>
	<view class="exchange">
			<view class="change">
				<view class="change_title">
					<text>兑换初级能量轴</text>
					<view class="num">
						-400
					</view>
				</view>
				<view class="change_time">
					兑换时间：2020-04-10 10:12:23
				</view>
			</view>
	</view>
</template>

<script>
	export default {
		 data() {
					return {
							
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
	
	.change {
		height:180upx;
		background:rgba(255,255,255,1);
		padding: 40upx 24upx 36upx 30upx;
		box-sizing: border-box;
		margin-top: 20upx;
	}
	.change_title {
		font-size:32upx;
		font-family:PingFangSC-Semibold,PingFang SC;
		font-weight:600;
		color:rgba(51,51,51,1);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.change_time {
		font-size:28upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(153,153,153,1);
		margin-top: 20upx;
	}
</style>
