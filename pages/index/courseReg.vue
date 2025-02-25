<template>
	<view class="knowledge">
		<!-- banner -->
		<view class="carousel-section swiper">
			<swiper class="carousel" circular autoplay="true"
				indicator-dots="true" 
				interval="2000" duration="500" 
				indicator-color="#ffffff" 
				indicator-active-color="#FF7D45"
				previous-margin="50rpx"
				next-margin="50rpx"
				@change="swiperClick">
				<swiper-item class="carousel-item" style="text-align: center;"
					v-for="(item, index) in bannerList" :key="index" 
					@click="navToDetailPage(item.forwardUrl,item.type)">
					<image :src="item.imgUrl" :class="swiperCurrent==index?'selimage':'noimage'" />
				</swiper-item>
			</swiper>
		</view>
		<!-- 列表 -->
		<view class="course-box">
			<view class="course-item">
				<view class="course-list" v-if="cjcourseList.length>0">
					<view class="course-list-top dfaijc">
						<view class="top-left-title">初级课程</view>
						<view class="top-right-all"  @click="gotolevel(1)">
							<text class="top-right-alltxt">全部课程</text>
							<uni-icons type="arrowright" color="#FC7F22" size="18"></uni-icons>
						</view>
					</view>
					<view class="course-list-center">
						<view class="center-left-img">
							<image :src="cjcourseList[0].image" mode="aspectFill"></image>
						</view>
						<view class="center-right-txt">
							<view class="right-txt-title clamp" style="overflow: initial;white-space: initial;">{{cjcourseList[0].title}}</view>
							<view class="right-txt-subtitle">
								<text v-html="cjcourseList[0].remark"></text>
							</view>
						</view>
					</view>
					<view class="course-list-bottom dfaijc">
						<view class="list-bottom-li">限时活动<text>{{cjcourseList[0].amount}}USDT</text></view>
						<view class="list-bottom-li">{{cjcourseList[0].signUpCount}}人已学</view>
						<view class="list-bottom-li">共{{cjcourseList[0].view}}课时</view>
						<view class="list-bottom-li applybtn" @click="applybtnClick(cjcourseList[0].id,cjcourseList[0].level)">报&nbsp;&nbsp;名</view>
					</view>
				</view>
				<view class="course-list" v-if="zjcourseList.length>0">
					<view class="course-list-top dfaijc">
						<view class="top-left-title">中级课程</view>
						<view class="top-right-all"  @click="gotolevel(2)">
							<text class="top-right-alltxt">全部课程</text>
							<uni-icons type="arrowright" color="#FC7F22" size="18"></uni-icons>
						</view>
					</view>
					<view class="course-list-center">
						<view class="center-left-img">
							<image :src="zjcourseList[0].image" mode="aspectFill"></image>
						</view>
						<view class="center-right-txt">
							<view class="right-txt-title clamp">{{zjcourseList[0].title}}</view>
							<view class="right-txt-subtitle">
								<text v-html="zjcourseList[0].remark"></text>
							</view>
						</view>
					</view>
					<view class="course-list-bottom dfaijc">
						<view class="list-bottom-li">限时活动<text>{{zjcourseList[0].amount}}USDT</text></view>
						<view class="list-bottom-li">{{zjcourseList[0].signUpCount}}人已学</view>
						<view class="list-bottom-li">共{{zjcourseList[0].view}}课时</view>
						<view class="list-bottom-li applybtn" @click="applybtnClick(zjcourseList[0].id,zjcourseList[0].level)">报&nbsp;&nbsp;名</view>
					</view>
				</view>
				<view class="course-list" v-if="gjcourseList.length>0">
					<view class="course-list-top dfaijc">
						<view class="top-left-title">高级课程</view>
						<view class="top-right-all" @click="gotolevel(3)">
							<text class="top-right-alltxt">全部课程</text>
							<uni-icons type="arrowright" color="#FC7F22" size="18"></uni-icons>
						</view>
					</view>
					<view class="course-list-center">
						<view class="center-left-img">
							<image :src="gjcourseList[0].image" mode="aspectFill"></image>
						</view>
						<view class="center-right-txt">
							<view class="right-txt-title clamp">{{gjcourseList[0].title}}</view>
							<view class="right-txt-subtitle">
								<text v-html="gjcourseList[0].remark"></text>
							</view>
						</view>
					</view>
					<view class="course-list-bottom dfaijc">
						<view class="list-bottom-li">限时活动<text>{{gjcourseList[0].amount}}USDT</text></view>
						<view class="list-bottom-li">{{gjcourseList[0].signUpCount}}人已学</view>
						<view class="list-bottom-li">共{{gjcourseList[0].view}}课时</view>
						<view class="list-bottom-li applybtn" @click="applybtnClick(gjcourseList[0].id,gjcourseList[0].level)">报&nbsp;&nbsp;名</view>
					</view>
				</view>
				<view class="course-list" v-if="mxcourseList.length>0">
					<view class="course-list-top dfaijc">
						<view class="top-left-title">密训课程</view>
						<view class="top-right-all" @click="gotolevel(4)">
							<text class="top-right-alltxt">全部课程</text>
							<uni-icons type="arrowright" color="#FC7F22" size="18"></uni-icons>
						</view>
					</view>
					<view class="course-list-center">
						<view class="center-left-img">
							<image :src="mxcourseList[0].image" mode="aspectFill"></image>
						</view>
						<view class="center-right-txt">
							<view class="right-txt-title clamp">{{mxcourseList[0].title}}</view>
							<view class="right-txt-subtitle">
								<text v-html="mxcourseList[0].remark"></text>
							</view>
						</view>
					</view>
					<view class="course-list-bottom dfaijc">
						<view class="list-bottom-li">限时活动<text>{{mxcourseList[0].amount}}USDT</text></view>
						<view class="list-bottom-li">{{mxcourseList[0].signUpCount}}人已学</view>
						<view class="list-bottom-li">共{{mxcourseList[0].view}}课时</view>
						<view class="list-bottom-li applybtn" @click="applybtnClick(mxcourseList[0].id,mxcourseList[0].level)">报&nbsp;&nbsp;名</view>
					</view>
				</view>
				
				<!-- <uni-load-more :status="loadingType"></uni-load-more> -->
			</view>
			<!-- <view v-else style="margin-left: 0px;margin-top: 21%;text-align: center;">
				<image src="~@/static/nodata.png" style="width:360upx;height:250upx"></image>
				<view style="font-size: 12px;color: #999999;">暂无课程~</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components:{
			uniIcons, uniLoadMore
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		data() {
			return {
				// --------课程 start--------------------
				sequence:0,
				loadingType: 'more', //加载更多状态
				cjcourseList:[],zjcourseList:[],gjcourseList:[],mxcourseList:[],
				// --------课程 end--------------------
				// --------banner start--------------------
				bannerList: [], //banner图标
				swiperCurrent:0, //banner index
				// --------banner end--------------------
			}
		},
		onReachBottom() {
			// this.courseListClick('add',this.sequence);
		},
		onLoad() {
			this.getbanner();
			this.courseListClick('refresh',0,1);
			this.courseListClick('refresh',0,2);
			this.courseListClick('refresh',0,3);
			this.courseListClick('refresh',0,4);
		},
		methods: {
			gotolevel(level){
				uni.navigateTo({
					url:'./courseLevel?level='+level
				})
			},
			// 报名
			applybtnClick:function(id,level){
				uni.navigateTo({
					url:'./video?id='+id+'&level='+level
				})
			},
			// --------------------课程接口 start--------------------
			// 获取课程列表
			async courseListClick(type,lastsequence,level){
				let that = this;
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
							level: level,
							uid: that.userInfo.userId, 
							sequence: lastsequence //分页时间戳
						}		
					});
					if(res.data.base.code == "000000"&&res.data.data.length>0){
						oldList = res.data.data;
						that.sequence = oldList[oldList.length-1].startTime;
					}
				} catch (error) {
					console.log('error:', error);
				}
				
				if(type == 'refresh'){
					if(level == 1){
						that.$data.cjcourseList = [];
					}else if(level == 2){
						that.$data.zjcourseList = [];
					}else if(level == 3){
						that.$data.gjcourseList = [];
					}else if(level == 4){
						that.$data.mxcourseList = [];
					}
				}
				
				if(level == 1){
					that.$data.cjcourseList = that.$data.cjcourseList.concat(oldList);
				}else if(level == 2){
					that.$data.zjcourseList = that.$data.zjcourseList.concat(oldList);
				}else if(level == 3){
					that.$data.gjcourseList = that.$data.gjcourseList.concat(oldList);
				}else if(level == 4){
					that.$data.mxcourseList = that.$data.mxcourseList.concat(oldList);
				}
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				that.$data.loadingType  = oldList.length < 10 ? 'nomore' : 'more';
				
				if(type === 'refresh'){
					uni.stopPullDownRefresh();
				}else{
					uni.hideLoading();
				}
			},
			// --------------------课程接口 end--------------------
			// --------------------banner start--------------------
			// banner点击事件
			swiperClick:function(e){
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			// 获取banner列表
			async getbanner(){
				let data = await this.$http.post('/lanhan/home/banner', {
					// type: 2
					'base':{
						'uid':this.userInfo.userId,
					},
					"param":{
						'type':2
					}
				});
				if(data.length>0){
					this.bannerList = data;
				}else{
					this.bannerList = [];
				}
			},
			// --------------------banner end--------------------
		}
	}
</script>

<style lang='scss' scoped>
	.dfaijc{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.course-item{
		margin-top: 8%;
		.course-list{
		    box-shadow: 0 0 20upx 1px #E7E7E7;
		    border-radius: 20upx;
		    margin: 3% 5% 6%;
			.course-list-top{
			    background: #00575B;
			    font-weight: bolder;
				font-size: 30upx;
			    border-radius: 20upx;
			    padding: 3% 3% 3% 6%;
			    box-shadow: 0px 10upx 20upx 0.1px #A6C6EE;
				.top-left-title,.top-right-alltxt{
					background-image: -webkit-linear-gradient(to bottom, #FD852F, #FCD5B4); 
					-webkit-background-clip: text; 
					-webkit-text-fill-color: transparent; 
				}
			}
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
						/* &::before{
							content: '￥';
							font-size: 24upx;
						} */
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
	}
	.carousel-section{
		/* padding: 20upx 0; */
		background-image: linear-gradient(rgba(0,87,91,1) 37%, rgba(255,255,255,0) 100%);
		.carousel{
			height: 320upx;
			.carousel-item{
				.noimage{
				    width: 96%;
				    height: 90%;
				    border-radius: 20upx;
				    margin-top: 2%;
				}
				.selimage{
				    width: 100%;
				    height: 100%;
				    margin-top: 0;
					border-radius: 20upx;
				}
			}
		}
	}
</style>
