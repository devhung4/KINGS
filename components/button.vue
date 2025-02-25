<template>
	<view class="next">
		<view>{{content}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			content:{
				type:String
			}
		}
	}
</script>

<style lang="scss" scoped>
	.next{
		width: 630upx;
		height: 88upx;
		background: rgba(232,65,112,1);
		font-size: 36upx;
		color: #FFFFFF;
		margin-left: 60upx;
		margin-right: 60upx;
		position: fixed;
		bottom: 40upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
