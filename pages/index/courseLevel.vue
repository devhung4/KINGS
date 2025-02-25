<template>
    <view style="background-color: #f2f2f2;padding-top: 0rpx;">
        <!-- <YSteps :lineNum='0' color='#fff' backgroundColor='#000fff' :infoList='list'></YSteps> -->
		<view class="video_search">
			<view class="type_list">
				<ul>
					<li v-for="(item,index) in courselist" :key="index" 
					:class="{isactive: index === tabindex}" @click="getgoodlist(index,item.id)">{{item.name}}</li>
				</ul>
			</view>			
		</view>
		<view class="bg">
			<view class="course-list" v-if="list.length">
				<view class="steps" v-for="(item,index) in list" :key="index">
					<view class="course-list-center">
						<view class="center-left-img">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="center-right-txt">
							<view class="right-txt-title clamp" style="overflow: initial;white-space: initial;">{{item.title}}</view>
							<view class="right-txt-subtitle">
								<text v-html="item.remark"></text>
							</view>
						</view>
					</view>
					<view class="course-list-bottom dfaijc">
						<view class="list-bottom-li">限时活动<text>{{item.amount}}</text></view>
						<view class="list-bottom-li">{{item.number}}人已学</view>
						<view class="list-bottom-li">共{{item.view}}课时</view>
						<view class="list-bottom-li applybtn" @click="applybtnClick(item.id,item.level)">报&nbsp;&nbsp;名</view>
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
				courselist:[],//分类
				time:[],
				typeid:0,
				tabindex:0,
				emptytext:"暂无相关消息",
				loadingType: 'more', //加载更多状态
				lastSequence:0,
				color:'red',
				backgroundColor:'#218cff',
				lineNum:0,
	            list: [],
				level:1
	        };
	
	    },
		onLoad(options) {
			this.level=options.level
			if(this.level==1){
				uni.setNavigationBarTitle({// 修改头部标题
					title: '初级课程'
				});
			}else if(this.level==2){
				uni.setNavigationBarTitle({// 修改头部标题
					title: '中级课程'
				});
			}else if(this.level==2){
				uni.setNavigationBarTitle({// 修改头部标题
					title: '高级课程'
				});
			}else{
				uni.setNavigationBarTitle({// 修改头部标题
					title: '密训课程'
				});
			}
			this.getcourselist()
			// this.getmessagelist("refresh",0);		
		},
		onShow() {
			// this.getcourselist()
			// this.getmessagelist("refresh",0,this.typeid);			
		},
		onReachBottom() {
			this.getmessagelist("add",this.lastSequence);
		},
	    methods: {
			getgoodlist(index,id){
				this.tabindex=index;
				this.typeid=id
				// this.video=[];
				// this.audio=[];
				// this.sequence = 0;
				this.getmessagelist("refresh",0,this.typeid);
			},
			// 报名
			applybtnClick:function(id,level){
				uni.navigateTo({
					url:'./video?id='+id+'&level='+level
				})
			},
			// 分类
			async getcourselist() {
				try {
					var res1 = await this.$request.post("/home/course/courseTypeList", {
						data: {
							"uid": this.userInfo.userId,
						}
					});
					this.courselist = res1.data.data
					this.typeid=res1.data.data[0].id
					this.getmessagelist("refresh",0,this.typeid);
				} catch (error) {
					console.error('error:',error);
				}
			},
			async getmessagelist(type,lastsequence,typeid) {
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
					let res = await this.$request.post('/home/course/courseList', {						
						data:{																			
							"uid": this.userInfo.userId,
							"title": this.title,
							"type":typeid,
							"level": that.level,						
							sequence: lastsequence //分页时间戳
						}	
					});
					if(res.data.base.code == "000000" && res.data.data.length>0){
						oldList = res.data.data;
						that.lastSequence = oldList[oldList.length-1].sequence;
						// for(let i=0;i<oldList.length;i++){
						// 	let newllist=that.$api.format(oldList[i].sequence)
						// 	that.time.push(newllist)
						// 	console.log(that.time)
						// }
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
   

<style lang="scss">
	page {
		background-color: #f2f2f2;
	}
	
	.bg {
		// margin: 20upx 0;
		// background-color: #f2f2f2;
		display: flex;
	}
	.dfaijc{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.course-list{
		width: 100%;
		box-shadow: 0 0 20upx 1px #E7E7E7;
		border-radius: 20upx;
		margin: 3% 4% 6%;
		background-color: white;
	}
	.steps {
		display: flex;
		flex-direction: column;
		width: 100%;
		border-bottom: 1px solid #E7E7E7;
		.course-list-center{
		    margin: 7% 3% 5% 4%;
			display: flex;
			justify-content: space-between;
			.center-left-img{
			    width: 45%;
			    height: 270upx;
				image{
				    width: 100%;
				    height: 100%;
				    border-radius: 20upx;
				}
			}
			.center-right-txt{
				width: 50%;
				.right-txt-title{
				    font-size: 32upx;
				    margin-bottom: 10upx;
				}
				.right-txt-subtitle{
				    font-size: 24upx;
				    color: #9C9C9C;
				    line-height: 40upx;
				}
			}
		}
		.course-list-bottom{
		    padding: 0 4% 3%;
			.list-bottom-li{
				color: #9C9C9C;
			    font-size: 24upx;
				text{
					color: #FD852F;
				    font-size: 28upx;
					&::before{
						content: '￥';
						font-size: 24upx;
					}
				}
			}
			.applybtn{
			    color: #ffffff;
			    background: #FD852F;
			    border-radius: 10upx;
			    padding: 10upx 30upx;
			    box-shadow: 0 4upx 6upx 0.1px #AFADAC;
			}
		}
		
	}
	
	/* 分类 */
	.type_list {
		position: relative;
		box-sizing: border-box;
		overflow-x: hidden;
		z-index: 5;
		overflow-x: scroll;
		width: 100%;
		
		ul {
			display: flex;
			justify-content: space-around;
			align-items: center;
			overflow-x: hidden;
			width: 160%;
			background: #fff;
	
			li {
				white-space: nowrap;
				padding: 24upx 30upx 26upx 30upx;
				font-weight:400;
				box-sizing: border-box;
				position: relative;
				font-size:32upx;
				font-family:PingFangSC-Regular,PingFang SC;
				/* color:rgba(102,102,102,1); */
				line-height:44upx;
			}
		}
	}
	.isactive{
		color:  rgba(255, 170, 0, 1.0);
	}
	.isactive::after {
		position: absolute;
		content: "";
		width: 30upx;
		bottom: 4upx;
		text-align: center;
		border-bottom: 8upx solid rgba(255, 170, 0, 1.0);
		left: 50%;
		transform: translate(-50%, -50%);
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
	}

</style>