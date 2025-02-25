<template>
	<view>
		<view class="prodDetialTop">
			<view>
				<view>推广人数</view>
				<view><text style="font-size:30px;">{{myInviteInfo.teamNum}}</text>人</view>
			</view>
		</view>
		<view class="mp-search-box">
			<view class="ser-input"><uni-icons color="red" type="search" size="20"></uni-icons><input type="search" v-model="mobile" @blur="searchMobil()" placeholder="输入手机号" placeholder-class="phclass"/></view>
		</view>
		<view class="prodDetailListBox" v-if="teamInfos.length>0">
			<view class="prodDetailList" v-for="(item,index) in teamInfos" :key="index">
				<view class="prodDetailListTop">
					<view>{{item.mobile}}</view>
					<view>个人投资金额：￥{{item.amount}}</view>
				</view>
				<view class="prodDetailListBody">
					<view>下级总人数：<text>{{item.teamNum}}</text></view>
					<view>下级购买总金额：<text>{{item.teamAmount}}</text></view>
				</view>
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
				teamInfos:[],
				mobile:''
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
				this.myInviteInfo=myInvite;
				// if(this.myInviteInfo.teamInfos>0){
					this.teamInfos=myInvite.teamInfos;
					
				// }
				
			},
			// 根据手机号搜索
			async searchMobil(){
				if(this.mobile!==""){
					let myInvite = await this.$http.post('/user/getTeamInfoByMobile', {
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
								"uid":this.userInfo.userId,
								"mobile":this.mobile
							}
						});				
						// this.myInviteInfo=myInvite;
						if(myInvite!==""){
							this.teamInfos=[];
							
							this.teamInfos.push(myInvite);
							// console.log(JSON.stringify(this.teamInfos))
							
						}else{
							this.teamInfos=[];
						}
						
					}
				}	
		}
	}
</script>

<style lang="scss">
	page{background-color:#EFF3FA;}
	%section{
		display:flex;
		justify-content: space-between;
		width:100%;
	}
	.prodDetialTop{
		width:100%;
		height:120px;
		// line-height: 120px;
		color:#fff;
		background:#2898E5;
		padding:10% 0 0 10%;
		margin-top:10px;
	}
	.mp-search-box{
		// background: #B74D26;
		margin-top:10px;
		position: relative;
		z-index: 1;
		// border-bottom: 5px solid #B74D26;
		.ser-input {
			background: #fff;
			width: 95%;
			margin: 0 auto;
			padding: 1% 3%;
			border-radius: 66upx;
			uni-text{
				color: red;
				font-size: 40upx;
				float: left;
			}
		}
		.phclass{
			font-size: 24upx;
		}
	}
	.prodDetailListBox{
		width:100%;
		.prodDetailList{
			width:100%;
			background:#fff;
			margin-top:10px;
			padding:3%;
			font-size:15px;
			.prodDetailListTop{
				@extend %section;
				border-bottom: 1px solid #EDF1F4;
				padding:2% 0;
			}
			.prodDetailListBody{
				padding:2% 0;
				color:#494849;
			}
		}
	}
</style>
