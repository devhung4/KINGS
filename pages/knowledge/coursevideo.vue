<template>
	<view class="box">
		<view class="head_video">
			<view class="" style="width: 90%;border-radius: 20upx;overflow: hidden;">
				<video  :show-center-play-btn="isvip"  
				 style="width: 100%;" :src="listonlist.url" :controls="isvip"></video>		
			</view>	
		</view>
		<view class="title">
			<view class="name">{{listonlist.title}}</view>
			<view class="price">本单课程价值<text style="color: #FD852F;">{{listonlist.amount}}USDT</text>  <text class="studys">2人学习</text></view>
			<view class="teacher">{{listonlist.teacherName}} 
			<!-- <text>简介></text> -->
			</view>
		</view>
		<view class="" style="background-color: white;margin-top: 20upx;">
			<view class="header">
				<ul>
					<li :class="['tab',index === currentId?'active':'']" v-for="(item,index) in typelist" :key='index'  @click="getvideolist(index)">{{item.name}}</li>
				</ul>
			</view>
			<view class="content" v-if="currentId==0">
				<view class="search_list">
					<view class="audt_list">
						<ul>
							<!--  v-for="(item,index) in video" :key="index" @click="videoinfo" -->
							<li class="">
								<view class="brief_left">
									<image :src="listonlist.image" mode="aspectFill"></image>
								</view>
								<view class="brief_right">
									<view class="brief_title">{{listonlist.title}}</view>
									<view class="brief_name">
										<view class="label" style="background: none;">
											讲师：{{listonlist.teacherName}}
										</view>
									</view>
									<view class="brief_name">
										<view class="label" style="background: none;">
											{{listonlist.teacherInfo}}
										</view>
									</view>
									<view class="brief_time">
										<view class="video_watch">
											<image src="../../static/img/headset.png" mode=""></image>
											<text>45551</text>
											<text style="margin-left: 40px;">256</text>
											<text style="margin-left: 40px;">14456456</text>
										</view>
									</view>
								</view>
							</li>					
						</ul>
					</view>
				</view>			
			</view>
			<view class="content kcind"  v-if="currentId==1">
				<jyf-parser style="width: 100%;white-space: initial;" :html="listonlist.label"></jyf-parser>		
			</view>
			<view class="content" v-if="currentId==2">
				用户评价
			</view>
		</view>
		<view class="foot" v-if="islook">
			<button type="default" @click="buycourse">点击购买</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue';
	export default{
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		components: {
			jyfParser
		},
		data(){
			return {
				currentId: 0,
				isvip:false,
				type:1,
				typeid:0,
				vid:0,
				islook:false,
				courselist:'',
				listonlist:'',
				typelist: [
					{
						name: '听课列表',
						type: 1
					},
					{
						name: '课程介绍',
						type: 2
					},
					// {
					// 	name: '用户评价',
					// 	type: 2
					// }
				],
			}
		},
		onLoad(option) {
			this.typeid=option.typeid
			this.vid=option.vid		
			// this.getcourselist()
			// this.getislook()
			console.log(this.typeid)
		},
		onShow() {
			this.getliston(this.vid)
			this.getislook()
		},
		methods:{
			getvideolist(index){
				this.currentId=index
			},
			videoinfo(id){
				this.getliston(id)	
				this.getislook(this.vid)
			},
			buycourse(){
				uni.navigateTo({
					url:'../money/pay?status='+1+'&videoid='+this.vid+'&money='+this.listonlist.amount
				})
				uni.setStorageSync("coorderid",this.vid.toString());
			},
			async getcourselist() {
				try {
					var res1 = await this.$request.post("/media/knowledge/list", {
						data: {
							"sequence": 0,
							"type": '1',							
							"uid": this.userInfo.userId,
							"title": this.title,
							"typeId":this.typeid					
						}
					});
					this.courselist = res1.data.data			
				} catch (error) {
					console.error('error:',error);
				}
			},
			async getliston(id) {
				try {
					var res1 = await this.$request.post("/media/knowledge/list", {
						data: {
							"sequence": 0,
							"type": '1',							
							"uid": this.userInfo.userId,
							"title": this.title,
							"typeId":this.typeid,
							"knowledgeId":id
						}
					});
					this.listonlist = res1.data.data[0]			
				} catch (error) {
					console.error('error:',error);
				}
			},
			async getislook() {			
				try {
					var res1 = await this.$request.post("/media/knowledge/canWatch", {
						data: {								
							"base":{
								"uid": this.userInfo.userId,
							},
							"param":{
								"videoId":this.vid //视频 id
							}						
						}
					});
					if(res1.data.base.code == "000000"){
						this.isvip=true
						this.islook=false											
					}else if(res1.data.base.code=="111111"){
						this.$api.msg("请购买此视频")	
						this.isvip=false
						this.islook=true	
					}							
				} catch (error) {
					// console.error('error:',error);
									
				}
			},
		},
		
	}
</script>

<style lang="scss" scoped>
	page {
		background: rgba(240, 240, 240, 1);
	}
	.head_video{
		width: 100%;
		background-color: white;
		display: flex;
		justify-content: center;
		videw{
			
		}
	}
	.title{
		background-color: white;
		font-size: 32upx;
		padding: 20px;
		.name{
			font-weight: 600;
		}
		.price{
			font-size: 14px;
			color: gray;
			margin: 15upx 0;
			.studys{
				position: relative;
				left: 160px;
			}
		}
		.teacher{
			color: gray;
			font-size: 14px;
			text{
				position: relative;
				left: 180px;
			}
		}
	}
	.header {
		height: 120upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 18.2upx 30upx 20upx 30upx;
		box-sizing: border-box;
		// position: fixed;
		left: 0;
		top: 0;
		padding-top: var(--status-bar-height);
		width: 100%;
		background: #fff;
		z-index: 10;
	
		ul {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
	
			li {
				padding: 0 15upx;
				box-sizing: border-box;
				position: relative;
				font-size: 35upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 600;
				text-align: center;
				// color: rgba(102, 102, 102, 1);
			}
		}
	}
	.tab{
		width: 100%;
		text-align: left;	
		color: rgba(38, 38, 38, 1.0);
	}
	.active{
		color:  rgba(255, 170, 0, 1.0);
	}
	
	.active::after {
		position: absolute;
		content: "";
		width: 40upx;
		bottom: -20upx;
		text-align: center;
		border-bottom: 10upx solid rgba(255, 170, 0, 1.0);
		left: 50%;
		transform: translate(-50%, -50%);
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
	}
	.content{
		padding: 0upx 30upx;
	}
	.search_list {
		/* margin-top: 38upx; */
	
		.audt_list {
			/* padding: 0 30upx 14upx; */
			box-sizing: border-box;
			margin-bottom: 80px;
	
			ul {
				li {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding: 30upx;
					box-sizing: border-box;
					background: #FFFFFF;
					margin-bottom: 20upx;
					border-bottom: 1px solid  #efefef;
	
					.brief_left {
						width: 168upx;
						height: 168upx;
	
						image {
							width: 100%;
							height: 100%;
						}
					}
	
					.brief_right {
						margin-left: 30upx;
						/* height: 168upx; */
						width: 68%;
						display: flex;
						flex-direction: column;
						/* justify-content: space-around; */
						justify-content: space-between;
	
						.brief_title {
							font-size: 32upx;
							font-family: PingFangSC-Semibold, PingFang SC;
							color: rgba(51, 51, 51, 1);
							/* line-height: 44upx; */
							overflow: hidden;
							  text-overflow: ellipsis;
							  white-space: nowrap;
						}
	
						.brief_name {
							font-size: 28upx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: rgba(51, 51, 51, 1);
							/* line-height: 40upx; */
							display: flex;
							justify-content: flex-start;
							align-items: center;
							margin: 8upx 0;
	
							.label {
								padding: 0 10upx;
								background: rgba(245, 180, 199, 0.38);
								border-radius: 1px;
								font-size: 12px;
								font-weight: 400;
								color:  rgba(118, 118, 118, 1.0);
								margin-right: 22upx;
							}
						}
	
						.brief_time {
							font-size: 24upx;
							font-family: PingFangSC-Regular, PingFang SC;
							color: rgba(153, 153, 153, 1);
							/* line-height: 34upx; */
							/* display: flex;
							justify-content: space-between; */
	
							.video_watch {
	
								image {
									width: 20upx;
									height: 20upx;
									margin-right: 6upx;
								}
							}
	
						}
					}
				}
			}
		}
	}
	.foot{
		width: 100%;
		background-color: white;
		padding: 30upx;
		position: fixed;
		bottom: 0;
		button{
			width: 80%;
			margin: 0 auto;
			background-color: #FD852F;
			color: white;
			font-size: 600;
			border-radius: 100upx;
		}
	}
	.kcind{
		font-size: 16px;
		    font-family: PingFangSC-Semibold, PingFang SC;
		    color: #333333;
		    overflow: hidden;
		    text-overflow: ellipsis;
		    white-space: nowrap;
			padding: 10px 20px;
	}
</style>
