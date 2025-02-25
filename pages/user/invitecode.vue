<template>
	<view class="content">
		<image class="pageimage" src="../../static/invite.png"></image>
		<view class="con-text">
			<view class="userinfo">
				<view class="left">
					<image :src="userInfo.headimage || '/static/missing-face.png'"></image>
				</view>
				<text class="right" v-if="userInfo.userName">{{userInfo.userName.substring(0,5)}}***{{userInfo.userName.substring(userInfo.userName.length-4,userInfo.userName.length)}}</text>
				<text class="right" v-else>{{userInfo.mobile.substring(0,5)}}***{{userInfo.mobile.substring(userInfo.mobile.length-4,userInfo.mobile.length)}}</text>
			</view>
			<view class="codeimg">
				<view class="img-code">
					<image :src="userInfo.inviteQrcode || '/static/qrcode.png'"></image>
				</view>
				<view class="text-code">
					<text class="code">{{userInfo.inviteCode}}</text><text class="copy" @click="copy">复制</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	    mapState 
	} from 'vuex';
	
	export default {
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		data(){
			return {
				userInfos:{}
			}
		},
		onLoad(){
			// this.$data.userInfos = uni.getStorageSync('userInfo');
		},
		methods: {
			copy(){
				uni.setClipboardData({
					data:this.userInfo.inviteCode,
					success:function(){
						uni.showToast({
							icon:"none",
							title:"复制成功"
						})
					}
				})
				uni.getClipboardData({
					success: (res) => {
						console.log(res.data);
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.pageimage{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}
	.con-text{
		position: absolute;
		top:10%;
		left:10%;
	    z-index: 5;
	    width: 80%;
	    margin: 0 auto;
	    // border: 1px solid #eee;
	    color: #fff;
	}
	.userinfo{
		display: flex;
		align-items: center;
		margin-left: 10%;
		.left{
			height: 120rpx;
			width: 120rpx;
			margin-right: 5%;
			image{
				height: 100%;width: 100%;
			    border: 1px solid #fff;
			    border-radius: 50%;
			}
		}
	}
	.img-code{
	    width: 300upx;
	    height: 300upx;
	    margin: 20% auto 0;
		image{
			height: 100%;width: 100%;
		}
	}
	.text-code{
		text-align: center;
		margin-top: 32%;

		.code{
			margin-right: 5%;
		}
		.copy{
			color: #FFFFFF;
		    text-decoration: underline;
		    font-size: 16px;
		}
	}
</style>
