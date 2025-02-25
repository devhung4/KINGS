<template>
    <view style="background-color: #f2f2f2;padding-top: 0rpx;">
        <!-- <YSteps :lineNum='0' color='#fff' backgroundColor='#000fff' :infoList='list'></YSteps> -->
		<view class="bg">
			<view class="steps" v-if="list.length">
				<view class="search_list">
					<view class="audt_list">
						<ul>
							<li class="" v-for="(item,index) in list" :key="index" @click="videoinfo(item.knowledgeId)">
								<view class="brief_left">
									<image :src="item.image" mode="aspectFill"></image>
								</view>
								<view class="brief_right">
									<view class="brief_title">{{item.title}}</view>
									<view class="brief_name">
										<view class="label" style="background: none;">
											价格：{{item.amount}}
										</view>
									</view>
									<view class="brief_name">
										<view class="label" style="background: none;">
											购买时间：{{time[index]}}
										</view>
									</view>
									<!-- <view class="brief_time">
										<view class="video_watch">
											<image src="../../static/img/headset.png" mode=""></image>
											<text>{{item.view}}</text>
											<text style="margin-left: 40px;">256</text>
											<text style="margin-left: 40px;">14456456</text>
											<text style="margin-left: 10px;
											background-color:#FD852F;color: white;padding: 2px 5px;border-radius: 5px;position: absolute;right: 20px;">{{item.amount==0?'免费':'付费'}}</text>
										</view>
									</view> -->
								</view>
							</li>
						</ul>
					</view>
				</view>			
				<uni-load-more :status="loadingType"></uni-load-more>
			</view>
			<view v-else>
				<empty :text="emptytext"></empty>
			</view>
		</view>
    </view>
</template>

<script>
	import {mapState} from 'vuex';
	import empty from '@/components/empty.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue';
	export default {
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		components:{
			empty,uniLoadMore,jyfParser
		},
	    data() {
	        return {
				time:[],
				emptytext:"暂无相关消息",
				loadingType: 'more', //加载更多状态
				lastSequence:0,
				color:'red',
				backgroundColor:'#218cff',
				lineNum:0,
	            list: [
	     //                {
	     //                    date: '2020-1-4',
						// 	title:'标题1',
	     //                    info: '的33'					
	     //                },
						// {
						//     date: '2020-1-5',
						// 	title:'标题2',
						//     info: '附近欧式金佛噢是否'
						// },
						// {
						//     date: '2020-1-6',
						// 	title:'标题3',
						//     info: '非官方颂德歌法第三方士大夫士大夫功发给官方'
						// },
						// {
						//     date: '2020-1-7',
						// 	title:'标题4',
						//     info: '懂法守法第三个个人'
						// },	
						// {
						//     date: '2020-1-8',
						// 	title:'标题5',
						//     info: '第三方都是给谁果然搞第三方都是给谁果然搞第三方都是给谁果然搞第三方都是给谁果然搞第三方都是给谁果然搞第三方都是给谁果然搞第三方都是给谁果然搞第三方都是给谁果然搞第三方都是给谁果然搞第三方都是给谁果然搞第三方都是给谁果然搞第三方都是给谁果然搞第三方都是给谁果然搞'
						// },	
						// {
						//     date: '2020-1-9',
						// 	title:'标题6',
						//     info: '的服务如果有热外国人'
						// },	
						// {
						//     date: '2020-1-8',
						// 	title:'标题7',
						//     info: '似懂非懂法第三方士大夫'
						// },	                   
	                ]
	        };
	
	    },
		onLoad() {
			// this.getmessagelist("refresh",0);		
		},
		onShow() {
			this.getmessagelist("refresh",0);			
		},
		onReachBottom() {
			this.getmessagelist("add",this.lastSequence);
		},
	    methods: {
			videoinfo(id){
				uni.navigateTo({
				    url: '../knowledge/coursevideo?vid='+id
				});
			},
			async getmessagelist(type,lastsequence) {
				let that = this;
				that.time=[]
				//没有更多直接返回
				if(type == 'add'){
					if(that.$data.loadingType == 'nomore'){
						return;
					}
					that.$data.loadingType = 'loading';
				}else{
					that.$data.loadingType = 'more';
				}
				
				let oldList = [];
				try {
					let res = await this.$request.post('/media/knowledge/record', {						
						data:{
							"base":{
								"uid":that.userInfo.userId
							},
							"param":{
								"sequence":lastsequence
								 // "id":"604b3b27d0cd19b1c39c5517"  
							}
						}		
					});
					if(res.data.base.code == "000000"){
						oldList = res.data.data;
						that.lastSequence = oldList[oldList.length-1].sequence;
						for(let i=0;i<oldList.length;i++){
							let newllist=that.$api.format(oldList[i].sequence)
							that.time.push(newllist)
							console.log(that.time)
						}
					}
					
				} catch (error) {
					console.log('error:', error);
				}
				
				if(type == 'refresh'){
					that.$data.list = [];
				}
				
				that.$data.list = that.$data.list.concat(oldList);
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				that.$data.loadingType  = oldList.length < 10 ? 'nomore' : 'more';
				
				if(type === 'refresh'){
					uni.stopPullDownRefresh();
				}else{
					uni.hideLoading();
				}
			},
	
	    }
	}
	
</script>
   

<style lang="scss" scoped>
	page {
		background-color: #f2f2f2;
	}
	
	.bg {
		margin: 20upx 0;
		background-color: #f2f2f2;
		display: flex;
	}
	
	.steps {
		display: flex;
		flex-direction: column;
		width: 100%;
	
		.steps_item {
			display: flex;
	
			.s_r {
				padding: 0 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
	
				.line {
					flex: 1;
					width: 5rpx;
					background-color: #fff;
				}
	
				.index {
					width: 40rpx;
					height: 40rpx;
					font-size: 12px;
					text-align: center;
					line-height: 40rpx;
					border-radius: 50rpx;
				}
			}
	
			.s_l {
				width: 100%;
				display: flex;
				flex-direction: column;
				padding: 20rpx 0;
	
				.info_item {
					background-color: #FFFFFF;
					margin-right: 30upx;
					border-radius: 10upx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					padding: 30upx;
					box-shadow: 0 10rpx 30rpx #ddd;
	
					text {
						font-size: 16px;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
						line-height: 25px;
					}
	
					view {
						font-size: 14px;
						font-weight: 400;
						color: rgba(102, 102, 102, 1);
						line-height: 20px;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;	
						flex-direction: column;
					}
					.info_title{
						font-weight: 600;
						font-size: 18px;
						margin: 10px 0;
					}
				}			
				.info_item:active {
					background-color: #f4f4f4;
				}
			}
		}
	}
	
	// -----------------------
	.search_list {
		/* margin-top: 38upx; */
	
		.audt_list {
			/* padding: 0 30upx 14upx; */
			box-sizing: border-box;
	
			ul {
				li {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding: 30upx;
					box-sizing: border-box;
					background: #FFFFFF;
					// margin-bottom: 20upx;
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

</style>