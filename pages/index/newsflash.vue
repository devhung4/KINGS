<template>
    <view style="padding-top: 0rpx;">
        <!-- <YSteps :lineNum='0' color='#fff' backgroundColor='#000fff' :infoList='list'></YSteps> -->
		<view class="bg">
			<view class="steps" v-if="list.length">
				<view class="steps_item" >
					<view  style='padding: 0 20rpx;'>
						<view class='lastIco' :style="{border:border,backgroundColor:'rgb(0, 87, 91)'}"></view>												
					</view>
					<view style='font-weight: 800;font-size:20px'>
						<text>今天</text>
					</view>
				</view>
				<view class="steps_item" v-for="(i, index) in list"  :key='index'>
					<view class="s_r">
						<view class="line" v-if='index==0' :style="{backgroundColor:index != list.length-1?backgroundColor:'rgba(0,0,0,0)'}"></view>
						<view class="line" v-else :style="{backgroundColor:index >0?backgroundColor:'rgba(0,0,0,0)'}"></view>
						
						<!-- <view class="index" v-if="index==0" :style="{backgroundColor:backgroundColor,color:color}"></view> -->
						<view class="index" :style="{border:border,color:color}"></view>												
						<view class="line" :style="{backgroundColor:index != list.length-1?backgroundColor:'rgba(0,0,0,0)'}"></view>
					</view>
					<view class="s_l">
						<!-- @tap="topage(index)" -->
						<view class="info_item" @click="gotoflash(i.id)">
							<text>{{ i.date }} {{ i.time }}</text>
							<view class="info_title">{{ i.title }}<text style='color:#fd852f;display: inline-block;margin-left: 10upx;'>查看全部</text></view>
							<!-- <view style="width: 100%;text-align: right;" @click.stop="shareToClick(i.title)">分享</view> -->
							<!-- <view class="" :style="{WebkitLineClamp:lineNum!=0?lineNum:''}">
									<jyf-parser  :html="i.text"></jyf-parser>
							</view> -->
						
							<!-- <view :style="{WebkitLineClamp:lineNum!=0?lineNum:''}">{{ i.info }}</view> -->
						</view>
					</view>
				</view>
				<uni-load-more :status="loadingType"></uni-load-more>
			</view>
			<view v-else>
				<empty :text="emptytext"></empty>
			</view>
		</view>
		<!-- 生成海报 -->
		<view style="display: none;">
			<image :src="canvasUrl" mode="widthFix"></image>
		</view>
		<mosowe-canvas-image ref="mosoweCanvasComponents" @canvasImage="_canvasImageClick" 
			:lists="canvasLists" height="446" width="330" showPreview />
    </view>
</template>

<script>
	import {mapState} from 'vuex';
	import empty from '@/components/empty.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue';
	import mosoweCanvasImage from '@/components/mosowe-canvas-image/mosowe-canvas-image.vue';
	export default {
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		components:{
			empty,uniLoadMore,jyfParser
		},
	    data() {
	        return {
				canvasUrl:"",//画布返回的图片路径
				canvasLists: [
					{type: 'image', content: '../../static/mycenter.png', width: 330, height: 530, x: 0, y: 0},
					{type: 'text', content: '', x: 20, y: 160, size: 15,color:'#fff'},
					{type: 'text', content: '', x: 20, y: 180, size: 15,color:'#fff'},
					{type: 'text', content: '', x: 20, y: 200, size: 15,color:'#fff'},
					{type: 'text', content: '', x: 20, y: 220, size: 15,color:'#fff'},
					{type: 'text', content: '', x: 20, y: 240, size: 15,color:'#fff'},
					{type: 'text', content: '', x: 20, y: 260, size: 15,color:'#fff'},
					{type: 'image', content: '../../static/qxxy.png',width:200,height:80, x: 20, y: 345},
					{type: 'qr', content:'sharehrefUrl', width: 80, height: 80, x: 230, y: 345}
				],//存放画布组件模块
				emptytext:"暂无相关消息",
				loadingType: 'more', //加载更多状态
				lastSequence:0,
				color:'red',
				backgroundColor:'#00575B',
				border:'2px solid #00575B',
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
			shareToClick(title){
				this.canvasLists[1].content = title.substring(0,19);
				this.canvasLists[2].content = title.substring(19,38);
				this.canvasLists[3].content = title.substring(38,58);
				this.canvasLists[4].content = title.substring(58,78);
				this.canvasLists[5].content = title.substring(78,98);
				this.canvasLists[6].content = title.substring(78,88);
				this.$refs.mosoweCanvasComponents.createCanvas();		
			},
			_canvasImageClick:function (e) {
				this.canvasUrl = e;
			},
			
			gotoflash(id){
				uni.navigateTo({
					url:'./flashdetail?id='+id
				})
			},
			async getmessagelist(type,lastsequence) {
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
					let res = await this.$request.post('/newNews/queryNewsListSort', {						
						data:{
							"base":{
								"uid":that.userInfo.userId
							},
							"param":{
								"action":0,
								"lastRecordDate":lastsequence
								 // "id":"604b3b27d0cd19b1c39c5517"  
							}
						}		
					});
					if(res.data.base.code == "000000"){
						oldList = res.data.data;
						that.lastSequence = oldList[oldList.length-1].sequence;
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
	// page {
	// 	background-color: #f2f2f2;
	// }
	
	.bg {
		// margin: 20upx 0;
		// background-color: #f2f2f2;
		display: flex;
	}
	
	.steps {
		display: flex;
		flex-direction: column;
		width: 100%;
	
		.steps_item {
			display: flex;
			.lastIco{
				width: 30rpx;
					margin-top:5px;
				height: 30rpx;
				font-size: 12px;
				text-align: center;
				line-height: 40rpx;
				border-radius: 50rpx;
			}
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
					width: 30rpx;
					height: 30rpx;
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
					padding-left: 0;
					// box-shadow: 0 10rpx 30rpx #ddd;
	
					text {
						font-size: 16px;
						font-weight: 500;
						// color: rgba(51, 51, 51, 1);
						color: #fd852f;
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
						font-size: 32upx;
						margin: 10px 0;
					}
				}			
				.info_item:active {
					background-color: #f4f4f4;
				}
			}
		}
	}

</style>