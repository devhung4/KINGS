<template>
	<view class="taskcenter">
		<view class="bg">
			<view class="header">
				<view class="left" @click="navidataBack()">
					<image src="../../static/img/btn_back_center.png" mode=""></image>
				</view>
				<view class="title">任务中心</view>
				<view class="right"></view>
			</view>
			<view class="me_type">
				<ul>
					<navigator url="./golden" hover-class="navigator-hover">
						<li>
							<view class="type_num">{{Number(taskconfiginfo.amount).toFixed(4)}}</view>
							<view class="type_info">今日金丹</view>
						</li>
					</navigator>
					<li>
						<view class="type_num">{{taskconfiginfo.invite}}</view>
						<view class="type_info">邀请好友</view>
					</li>
				</ul>
			</view>
			<block v-for="(item,index) in taskconfiginfo.configList" :key="index">
				<view class="daysit">
					<view class="sit_pic">
						<image :src="item.logo" mode=""></image>
					</view>
					<view class="sit_cot">
						<view class="sit_title">{{item.name}}</view>
						<view class="sit_explain">奖励金丹</view>
					</view>
					<view @click="navtopage(item.type)" :class="`sit_bot ${item.mark==0?'':'active'}`">{{item.mark==1?'已完成':'去完成'}}</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {
	    mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				taskconfiginfo:{},
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		onLoad() {
			this.taskconfig();
		},
		methods: {
			async taskconfig(){
				let that = this;
				let configinfo = await that.$request.post('/user/task/config', {
					"data": {
						"uid": that.userInfo.userId
					}
				});
				if(configinfo.data.base.code == "000000"){
					that.$data.taskconfiginfo = configinfo.data.data;
					// console.log(this.taskconfiginfo.configList)
					console.log(this.taskconfiginfo)
				}else{
					that.$api.msg(configinfo.data.base.msg);
				}
			},
			navidataBack() {
				uni.navigateBack();
			},
			navtopage(type){
				switch(type){
					case 1:
						uni.navigateTo({
							url:"../sit/sit"
						})
					break;
					case 2:
						uni.switchTab({
							url:"../knowledge/knowledge"
						})
					break;
					case 3:
						uni.navigateTo({
							url:"./invite"
						})
					break;
					case 4:
						uni.switchTab({
							url:"../category/category"
						})
					break;
				}
			}
		}
	}
</script>

<style lang='scss'>
	.bg {
		background: url(../../static/img/center_bg.png) no-repeat;
		background-size: cover;
		height:462upx;
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
	}
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
		justify-content: space-between;
		align-items: center;
		padding: 18.2upx 30upx 20upx 30upx;
		box-sizing: border-box;
		padding-top: var(--status-bar-height);
		width: 100%;
		z-index: 10;
		.left {
			image {
				width: 44upx;
				height: 44upx;
			}
		}
		.title {
			font-size:32upx;
			font-family:PingFangSC-Semibold,PingFang SC;
			font-weight:600;
			color:rgba(255,255,255,1);
		}
		.right {
			font-size:28upx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(255,255,255,1);
		}
	
	}
	.me_type {
		margin: 60upx 0;
		text-align: center;
		ul {
			display: flex;
			justify-content: space-around;
			align-items: center;
	
			li {
				text-align: center;
				.type_num {
					font-size:60upx;
					font-family:DINAlternate-Bold,DINAlternate;
					font-weight:bold;
					color:rgba(246,246,246,1);
				}
	
				.type_info {
					font-size:24upx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(246,246,246,1);
				}
			}
		}
	}
	.daysit {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width:690upx;
		height:168upx;
		background:rgba(255,255,255,1);
		box-shadow:0px 22px 20px 0px rgba(240,240,242,0.3);
		border-radius:4upx;
		margin: 0 auto 20upx;
		z-index: 10;
		padding: 48upx 30upx 48upx 32upx;
		box-sizing: border-box;
		.sit_pic {
			image {
				width:71upx;
				height:71upx;
			}
		}
		.sit_cot {
			margin-left: 30upx;
			width: 90%;
			.sit_title {
				font-size:32upx;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:500;
				color:rgba(51,51,51,1);
			}
			.sit_explain {
				font-size:24upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(102,102,102,1);
				margin-top: 10upx;
			}
		}
		.sit_bot {
			width:200upx;
			height:56upx;
			background:rgba(232,65,112,1);
			border-radius:4upx;
			font-size:28upx;
			font-family:PingFangSC-Semibold,PingFang SC;
			font-weight:600;
			color:rgba(246,246,246,1);
			line-height: 56upx;
			text-align: center;
		}
		
	}
	.active {
		background: #ec7798 !important;
	}
</style>
