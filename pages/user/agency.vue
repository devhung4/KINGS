<template>
	<view>
		<view class="agencyTop">
			<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-left="120">
				<view class="scroll-view-item_H" v-for="(item,index) in memberLevels" :key="index">
					<view class="scrollItemBox">
						<image class="scorllBg" src="../../static/agencyBg.png"></image>
						<view class="leftimg">
							<image v-if="item.level==2" src="../../static/img/t0.png"></image>
							<image v-if="item.level==3" src="../../static/img/t1.png"></image>
							<image v-if="item.level==4" src="../../static/img/t2.png"></image>
							<image v-if="item.level==5" src="../../static/img/t3.png"></image>
							<image v-if="item.level==6" src="../../static/img/t4.png"></image>
							<image v-if="item.level==7" src="../../static/img/t5.png"></image>
						</view>
						<view class="scrollItemTop">
							<view style="font-size: 21px;font-weight: bolder;">{{item.name}}</view>
						</view>
						<view class="scrollItemBody">
							<block v-for="(iitemt,index1) in item.introducation" :key="index1">
								<view class="scrollTxt">{{iitemt}}</view>
							</block>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="agencyBody">
			<view class="angecyTips">
				<image src="../../static/dl.png"></image>代理升级要求
			</view>
			<view class="angecyMain">
				<text class="rightLine"></text><text>{{myInfo.requirement}}</text>
				<!-- <text>3人</text> -->
			</view>
		</view>
		<view class="myangecy">
			<view class="angecyList">
				<view><image src="../../static/dlsj.png"></image>我的代理等级</view>
				<text style="color:#F4446C">{{myInfo.name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';  
	export default {
	    data() {
	        return {
	            scrollTop: 0,
	            old: {
	                scrollTop: 0
	            },
				angeyInfo:'',
				memberLevels:[],
				myInfo:'',
	        }
	    },
		computed: {
		   ...mapState(['hasLogin', 'userInfo'])
		  },
		onLoad(){
			this.getAgency();
		},
	    methods: {
	        scroll: function(e) {
	            // console.log(e)
	            this.old.scrollTop = e.detail.scrollTop
	        },
			// 获取代理页面信息
			async getAgency(){
				let that = this;
				// uni.showLoading({
				// 	title: '加载中',
				// 	mask: true
				// });
				let agencyInfo = await that.$request.post('/user/getUserInfoByUid', {data: {
					"base": {
						"appId": "001",
						"channels": "001",
						"ver": "1.1.5",
						"clientVer": "1.0",
						"apn": "wifi",
						"deviceId": "1233eedds2112",
						"uid": "12332112",
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
						"uid": this.userInfo.userId,
					}
				}});
				if(agencyInfo.data.base.code=="000000"){
					// uni.hideLoading();
					this.angeyInfo=agencyInfo.data.data;
					this.memberLevels=agencyInfo.data.data.memberLevels;
					let memberLlist = agencyInfo.data.data.memberLevels;
					if(memberLlist.length > 0){
						let mLlarray = [];
						for(let i=0; i<memberLlist.length; i++){
							mLlarray = memberLlist[i].introducation.split("|");
							memberLlist[i].introducation = mLlarray;
						}
					}
					
					let levelId=this.angeyInfo.levelId;
					this.myInfo=this.memberLevels.find(function (obj) {
							return obj.level ==levelId;//取出this.studentL里的id为1的那条数据所有的信息
					});
					// console.log("this.angeyInfo"+JSON.stringify(this.myInfo))
				}else{
					this.$api.msg(agencyInfo.data.base.msg);
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
	.agencyTop{
		width:100%;
		.scroll-view_H{
			margin-top:10px;
			white-space: nowrap; // 滚动必须加的属性
			width:100%;
			.scroll-view-item_H{
				display:inline-block;
				width:100%;
				text-align: center;
				.scrollItemBox{
					width:95%;
					margin:0 auto;
					border-radius: 5px;
					color:#fff;
					font-size:15px;
					font-weight: bolder;
					padding:3%;
					height:350upx;
					position:relative;
					// white-space: normal;
					.scorllBg{
						width:100%;
						height:100%;
						position: absolute;
						top:0;
						left:0;
						border-radius: 5px;
					}
					.scrollItemTop{
						position: absolute;
					    top: 15%;
					    left: 13%;
					    width: 100%;
					    text-align: left;
					}
					.scrollItemBody{
						position: absolute;
						top:35%;
						left:0;
						width:100%;
						padding:2%;
						.scrollTxt{
							 // 滚动必须加的属性
							 white-space: normal;
							 line-height: 27px;
						}
					}
					.leftimg{
					    height: 50px;
					    width: 50px;
					    position: absolute;
					    right: 10%;
						image{
							height: 100%;
							width: 100%;
						}
					}
				}
			}
		}
	}
	.agencyBody{
		width:100%;
		margin-top:10px;
		background:#fff;
		font-size:14px;
		padding:3%;
		font-weight: bolder;
		.angecyTips{
			width:100%;
			image{
				width: 25px;
				height: 25px;
				vertical-align: middle;
				margin-right: 5px;
			}
		}
		.angecyMain{
			// @extend %section;
			width:100%;
			margin:2% 0;
			height:40px;
			line-height:40px;
			background:#F9F9F9;
			border-radius: 5px;
			padding:0 5px;
			.rightLine{
				display:inline-block;
				vertical-align: middle;
				width:4px;
				height:30px;
				margin-right:5px;
				background:#FFB004;
			}
		}
	}
	.myangecy{
		width:100%;
		margin-top:10px;
		padding:3%;
		background:#fff;
		font-size:15px;
		font-weight: bolder;
		.angecyList{
			@extend %section;
			width:100%;
			image{
				width: 25px;
				height: 25px;
				vertical-align: middle;
				margin-right: 5px;
			}
		}
	}
</style>
