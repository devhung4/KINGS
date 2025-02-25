<template>
	<view class="container">
		<view class="inviteTop">
			<image class="invitBg" src="/static/user-bg.jpg"></image>
			<view class="sharebtnBox">
				 <view class="btnshare" @click="navTo('/pages/user/invitecode')">立即分享</view>
			</view>
		</view>
		<view class="inviteNav">
			<view class="navItem" @click="navTo('/pages/user/invitecode')">
				<view style="color:#F4446C;margin:10% 0 5%;">
					<text style="font-size:40px;" class="nwicon icon-erweima"></text>
				</view> 
				<text style="font-size:15px;">推广二维码</text>
			</view>
			<view class="navItem" @click="navTo('/pages/user/myinviteInfo')">
				<view style="color:#F4446C;margin:10% 0 5%;">
					<text style="font-size:40px;" class="nwicon icon-tongji"></text>
				</view>
				<text style="font-size:15px;">推荐好友统计</text>
			</view>
		</view>
		<!-- <view class="inviteBody icon">
			<list-cell title="团队总业绩" tips="0" icon="icon-erjiye-yucunkuan" iconColor="#9789f7"></list-cell>
			<list-cell title="直推人数" tips="0" icon="icon-iconfontweixin" iconColor="#e07472" ></list-cell>
			<list-cell title="今日业绩" tips="0" icon="icon-dizhi" iconColor="#5fcda2" ></list-cell>
			<list-cell title="总积分" tips="0" icon="icon-share" iconColor="#9789f7"></list-cell>
			<list-cell title="今日积分" tips="0" icon="icon-shoucang_xuanzhongzhuangtai" iconColor="#54b4ef"></list-cell>
		</view> -->
		<view class="inviteBody">
			<view class="inviteTitle"><text class="nwicon icon-tongji1"></text>今日数据统计</view>
			<view class="invitList">
				<view>
					<text class="nwicon icon-tongji"></text>
					今日团队业绩
				</view>
				<view>{{myInviteInfo.todayTeamAmount}}</view>
			</view>
			<view class="invitList">
				<view>
					<text class="nwicon icon-yejiguanli"></text>
					今日个人业绩
				</view>
				<view>{{myInviteInfo.todayAmount}}</view>
			</view>
			<view class="invitList">
				<view>
					<text class="nwicon icon-tongji"></text>
					团队总业绩
				</view>
				<view>{{myInviteInfo.teamAmount}}</view>
			</view>
			<view class="invitList">
				<view>
					<text class="nwicon icon-yejiguanli"></text>
					个人总业绩
				</view>
				<view>{{myInviteInfo.amount}}</view>
			</view>
			<view class="invitList">
				<view>
					<text class="nwicon icon-iconfonttuijianren"></text>
					直推人数
				</view>
				<view>{{myInviteInfo.directNum}}</view>
			</view>
			<view class="invitList">
				<view>
					<text class="nwicon icon-jifen"></text>
					总积分
				</view>
				<view>{{myInviteInfo.score}}</view>
			</view>
			<view class="invitList">
				<view>
					<text class="nwicon icon-shijian"></text>
					今日积分
				</view>
				<view>{{myInviteInfo.todayScore}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	    mapState,
		mapMutations
	} from 'vuex';
	export default {
		data(){
			return{
				myInviteInfo:'',
			}
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		onLoad() {
			this.getmyInvite()
		},
		methods:{
			...mapMutations(['logout']),
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				if(!this.hasLogin){
					url = '/pages/public/login';
				}
				uni.navigateTo({  
					url
				})  
			}, 
			//获取团队信息
			async getmyInvite(){
				let myInvite = await this.$http.post('/user/getTeamInfoByUid', {
					"base": {
						"appId": "001",
						"channels": "001",
						"ver": "1.1.5",
						"clientVer": "1.0",
						"apn": "wifi",
						"deviceId": "1233eedds2112",
						"uid":"1212123",
						"valat": 22.332112,
						"lalong": 12.332112,
						"platform": "IOS",
						"platformVer": "8",
						"resolution": "960*640",
						"deviceType": "P6",
						"carrier": "china mobile",
						"city": "合肥",
						"brand": "huawei"
					},
					"param": {
						"uid":this.userInfo.userId
					}
				});				
				this.myInviteInfo=myInvite
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background-color:#EFF3FA;
	}
	%section{
		display:flex;
		justify-content: space-between;
		width:100%;
	}
	.container{
		background:#EFF3FA;
		.inviteTop{
			position: relative;
			width:100%;
			margin-top:10px;
			.invitBg{
				width:100%;
				height:160px;
			}
			.sharebtnBox{
				position: absolute;
				bottom: -10px;
				left:0;
				width:100%;
				.btnshare{
					width:150px;
					height:35px;
					line-height: 35px;
					border-radius: 20px;
					font-size:15px;
					background:#269AE7;
					margin:0 auto;
					text-align: center;
					color:#fff;
				}
			}
		}
		.inviteNav{
			@extend %section;
			width:95%;
			margin:10% auto 0;
			.navItem{
				width:48%;
				height:130px;
				background:#fff;
				border-radius: 10px;
				text-align: center;
			}
		}
		.inviteBody{
			width:95%;
			margin:10px auto 0;
			border-radius: 5px;
			padding:2%;
			background:#fff;
			.inviteTitle{
				width:100%;
				font-size:18px;
				text-align: center;
				margin:2% 0 5%;
			}
			.invitList{
				@extend %section;
				font-size: 15px;
				padding:3% 2%;
				border-bottom: 1px solid #eee;
				
			}
			.nwicon{
				color:#F4446C;
				font-size:18px;
				vertical-align: middle;
				margin-right: 10upx;
			}
		}
	}
	
</style>
