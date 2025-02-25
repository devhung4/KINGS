<template>
	<view class="team">
		<view class="bg">
				<view class="header">
					<view class="left" @click="navidataBack()">
						<image src="../../static/img/btn_back_center.png" mode=""></image>
					</view>
					<view class="title">{{$t('team.index1')}}</view>
					<!-- <view class="right"></view> -->
					<view class="left">
						<image src="" mode=""></image>
					</view>
				</view>
				<view class="me_type">
					
					<ul>
						<li>
							<view class="type_num">{{teamlistinfo.totalElements}}</view>
							<view class="type_info">{{$t('team.index2')}}</view>
						</li>
						
						<!-- <li>
							<view class="type_num">{{teamlistinfo.communityAmount}}</view>
							<view class="type_info">小区活跃度</view>
						</li> -->
					</ul>
					
				</view>
		</view>	
		
				<view v-if="teamlistinfo.totalElements==0" style="display:flex;width:100%;justify-content: center;padding:100upx 0;margin-top: 450upx;">
					<image src="../../static/nodata.png" style="width:360upx;height:250upx"></image>
				</view>
				<view v-else class="content">
					<view class="titlelist">
						<view class="titlelist_top">
							{{$t('team.index3')}}
						</view>
						<view class="titlelist_top">
							{{$t('team.index4')}}
						</view>
						<view class="titlelist_top">
							{{$t('team.index5')}}
						</view>
						<view class="titlelist_top">
							{{$t('team.index6')}}
						</view>
					</view>
					
					<view class="titlelist" v-for="(item,index) in teamlistinfo.content" :key="index">
						<view class="titlelist_information">
							{{item.username}}
						</view>
						<view class="titlelist_information">
							{{item.mobilePhone.substring(0,8)}}***
						</view>
						<view class="titlelist_information">
							{{item.memberGradeName}}
						</view>
						<view class="titlelist_information">
							{{item.generation}}
						</view>
					</view>
					
					
					<!-- <view class="service_info" v-for="(item,index) in teamlistinfo.content" :key="index">
						
						<view class="service_pic">
							<image src="../../static/img/service_pic.png" mode=""></image>
						</view>
						
						<view class="extract">
							<view class="state_num">
								<view class="state">{{item.mobilePhone.substring(0,8)}}***</view>
							</view>
							<view class="address">
								<text>用户名：{{item.username}}</text>
							</view>
						</view>
						
					</view> -->
				</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				teamlistinfo:[],
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		created() {},
		onLoad() {
			this.onload();
		},
		methods: {
			async onload() {
				let teamlist = await this.$request.post('/uc/promotion/record', {
					header: {
						 'x-auth-token':uni.getStorageSync('token'),
						 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {
						"pageNo":1,
						"pageSize":50
					}
				});
				if(teamlist.data.code==0){
					this.teamlistinfo = teamlist.data.data;
					console.log(teamlist.data.data,'teamlist.data.data')
				}else{
					this.$api.msg(teamlist.data.message);
				}
			},
			navidataBack() {
				uni.navigateBack();
			},
		}
	}
</script>

<style lang='scss'>
	page {
		background: rgba(246, 246, 246, 1);
	}
	.bg {
		background: url(../../static/rhinoImg/propertyBg_1.png) no-repeat;
		background-size: cover;
		height:462upx;
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 999;
	}
	.header {
		height: 120.2upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 18.2upx 10upx 20upx 10upx;
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
		/* display: flex; */
		padding: 0 10upx;
		/* justify-content: space-between; */
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
	.content{
		margin-top: 480upx;
	}
	.extract {
		background:rgba(255,255,255,1);
		padding: 40upx 24upx 40upx 30upx;
		box-sizing: border-box;
		background: #FFFFFF;
		width: 90%;
		.state_num {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.state {
				font-size:32upx;
				font-family:PingFangSC-Semibold,PingFang SC;
				font-weight:600;
				color:rgba(64,67,72,1);
				
			}
			.num {
				font-size:24upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(153,153,153,1);
			}
		}
		.address {
			font-size:28upx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(51,51,51,1);
			margin-top: 20upx;
			margin-bottom: 10upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.time {
			font-size:28upx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(153,153,153,1);
		}
	}

	.phone {
		color:rgba(51,51,51,1);
		margin-left: 20upx;
	}
	.service_info {
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		background: #FFFFFF;
		padding-left: 30upx;
		box-sizing: border-box;
		margin-top: 20upx;
		.service_pic {
			padding-top: 40upx;
			image {
				width: 60upx;
				height: 60upx;
				
			}
		}
		
	}
	.titlelist{
	   /* margin-top:30upx; */
		display: flex;
		justify-content: space-around;
		/* color: #999999; */
	}
	.titlelist_top{
		color: #999999;
		width: 25%;
		height: 60upx;
		text-align: center;
	}
	.titlelist_information{
		background: #FFFFFF;
		border-bottom: 1upx solid #707070;
		width: 25%;
		height: 96upx;
		font-size: 32upx;
		line-height: 96upx;
		text-align: center;
		
	}
	
</style>
