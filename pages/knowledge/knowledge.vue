<template>
	<view class="knowledge ">
		<!-- :class="{active: index === currentId}" -->
		<view class="header">
			<ul>
				<li  v-for="(item,index) in typelist" :key='index'  @click="getvideolist(index)">{{item.name}}</li>
			</ul>
		</view>	
		<view class="content">
			<view class="carousel-section swiper" style="padding: 0upx 0;">
				<swiper class="carousel" circular autoplay="true"
					indicator-dots="true" 
					interval="2000" duration="500" 
					indicator-color="#ffffff" 
					indicator-active-color="#FF7D45"
					previous-margin="50rpx"
					next-margin="50rpx"
					@change="swiperClick">
					<swiper-item class="carousel-item" style="text-align: center;"
						v-for="(item, index) in carouselList" :key="index" 
						>
						<image :src="item.imgUrl" :class="swiperCurrent==index?'selimage':'noimage'" />
					</swiper-item>
					<!-- @click="navToDetailPage(item.forwardUrl,item.type)" -->
				</swiper>
			</view>
			<!-- <view class="carousel-section">
					<swiper class="carousel" circular indicator-dots="true" autoplay="true" interval="2000" duration="500" @change="swiperChange">
						<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navToDetailPage(item.forwardUrl,item.type)">
							<image :src="item.imgUrl" />
						</swiper-item>
					</swiper>
			</view> -->
			<view class="video_search">
				<view class="type_list">
					<ul>
						<li v-for="(item,index) in courselist" :key="index" 
						:class="{isactive: index === tabindex}" @click="getgoodlist(index,item.id)">{{item.name}}</li>
					</ul>
				</view>			
			</view>
			<view class="video" v-if="currentId==0">
				<view class="search_list">
					<view class="audt_list">
						<ul>
							<li class="" v-for="(item,index) in video" :key="index" @click="videoinfo(typeid,item.id)">
								<view class="brief_left">
									<image :src="item.image" mode="aspectFill"></image>
								</view>
								<view class="brief_right">
									<view class="brief_title">{{item.title}}</view>
									<view class="brief_name">
										<view class="label" style="background: none;">
											讲师：王老师
										</view>
									</view>
									<view class="brief_name">
										<view class="label" style="background: none;">
											课程介绍环境撒第三方
										</view>
									</view>
									<view class="brief_time">
										<view class="video_watch">
											<image src="../../static/img/headset.png" mode=""></image>
											<text>{{item.view}}</text>
											<text style="margin-left: 40px;">256</text>
											<text style="margin-left: 40px;">14456456</text>
											<text style="margin-left: 10px;
											background-color:#FD852F;color: white;padding: 2px 5px;border-radius: 5px;position: absolute;right: 20px;">{{item.amount==0?'免费':'付费'}}</text>
										</view>
									</view>
								</view>
							</li>
						</ul>
					</view>
				</view>			
				<!-- <view class="videolist" v-for="(item,index) in video" :key="index"> -->
					<!-- <view @click="videoinfo(item)"> -->
					<!-- <view class="video_subject"> -->
						<!-- <view class="video_item"> -->
					<!-- 	<video :id="'myVideo'+item.id" :src="item.url" controls :poster="item.image" :data-id="'myVideo'+item.id"
						@play="renderPage" objectFit="fill">
						</video> -->
							<!-- @play="play()" -->
							<!-- :show-center-play-btn="showcplay" -->
						<!-- </view> -->
						<!-- <image :src="item.image" mode=""></image>
						<view class="video_volume">
							<image src="../../static/img/vedio_vumlo.png" mode=""></image>
							<text>{{item.view}}</text>
						</view>
						<view class="video_time" v-show="false">
							30:00
						</view>
						<view class="video_play">
							<image src="../../static/img/vedio_play.png" mode=""></image>
						</view> -->
					<!-- </view> -->
					<!-- 	<div class="text">{{item.title}}</div>
					</view>
					<view class="operation ">
						<view class="pubdate" v-show="false">
							5分钟前
						</view>
						<view class="oper">
							<view class="start">
								<image :src="item.collectFlag==1?'../../static/img/startsel.png':'../../static/img/start.png'" mode="" @tap="vediocolclick(item.id,index,item.collectFlag)"></image>
								<span>{{item.collect}}</span>
							</view>
							<view class="collect">
								<image :src="item.favoriteFlag==1?'../../static/img/collectsel.png':'../../static/img/collect.png'" mode="" @tap="vediofavclick(item.id,index,item.favoriteFlag)"></image>
								<span>{{item.favorites}}</span>
							</view>
							<view class="share" @tap="share(item.id,'../set/invite')">
								<image src="../../static/img/share.png" mode=""></image>
								<span>{{item.share}}</span>
							</view>
						</view>
					</view>
				
				</view> -->
			</view>
			<view class="auto" v-else>
				<!-- <view class="audio_list">
					<view class="audio_title">
						<text class="audt">精品推荐</text>
						<view class="recommend">
							<image src="../../static/img/recommend.png" mode=""></image>
						</view>
					</view>
					<view class="audio_content">
						<ul :style="{ width: TotalWidth + 'px' }">
							<li v-for="(item,index) in recommendlist" :key="index">
								<view class="audio_pic" @click="audioinfo(item)">
									<image :src="item.image" mode=""></image>
									<view class="headset">
										<image src="../../static/img/headset.png" mode=""></image>
										<text>{{item.view}}</text>
									</view>
								</view>
								<text>{{item.title}}</text>
							</li>
						</ul>
					</view>
				</view> -->
				<view class="search_list">
					<view class="audt_list">
						<ul>
							<li v-for="(item,index) in audio" :key="index" @click="audioinfo(item.id)">
								<view class="brief_left">
									<image :src="item.image" mode="aspectFill"></image>
								</view>
								<view class="brief_right">
									<view class="brief_title">{{item.title}}</view>
									<view class="brief_name" v-if="label[index] != ''">
										<view class="label" v-for="(k,i) in label[index]" :key="i">
											{{label[index][i]}}
										</view>
									</view>
									<view class="brief_time">
										<view class="video_watch">
											<image src="../../static/img/headset.png" mode=""></image>
											<text>{{item.view}}</text>
										</view>
									</view>
								</view>
							</li>
						</ul>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		data() {
			return {
				frequent: true,
				currentId: 0,
				TotalWidth: 0,
				type: 0,
				title:'',
				tindex:0,
				typelist: [
					// {
					// 	name: '课程',
					// 	type: 1
					// },
					{
						name: '课程',
						type: 2
					}
				],
				video: [],
				audio: [],
				nowvideo: {},
				src: 'http://47.98.171.200:19999/media/test.mp4',
				uid: '',
				recommendlist: [],
				likevideo: true,
				collect:true,
				currentVideo:0,
				videoNew: [],
				label:{},
				sequence:0,
				courselist:[],//分类
				tabindex:0,
				typeid:0,
				carouselList: [],
				swiperCurrent:0, //banner index
			}
		},
		
		created() {
		
		},
		onShow(){
			this.sequence=0;
			// this.tabindex=0
			var status = uni.getStorageSync("status");
			if(status==''){
				// this.getvideolist(this.currentId)			
			}else {
				// this.currentId = status.id;
				// this.type = status.type;
				// uni.removeStorageSync("status")
				// this.getvideolist(this.currentId)		
			}
			
		},
		mounted() {
			// this.renderPage(this.currentVideo);
		},
		onReachBottom() {
			this.getvideolist(this.currentId, this.type,1)
			uni.showLoading({
				title: '加载中'
			})
		},
		onLoad() {
			this.getbanner()
			this.getcourselist()
			// var status = uni.getStorageSync("status");
			// if(status==''){
			// 	this.getvideolist(this.currentId, this.type,0)			
			// }else {
			// 	this.currentId = status.id;
			// 	this.type = status.type;
			// 	// uni.removeStorageSync("status")
			// 	this.getvideolist(this.currentId, this.type,0)		
			// }
			// this.getvideolist(this.currentId, this.type,0)	
			//获取用户id
			uni.getStorage({
			key:"userInfo",
				success(e){
					this.uid = e.data.userId
					console.log(this.uid)
				}
			}) 
		
		},
		methods: {
			searchBtn(){
				this.sequence=0;
				this.getvideolist(this.currentId)
			},
			swiperClick:function(e){
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			// 一次只能播放一个视频
			renderPage(e) {
				console.log(e)
				// console.log(index)
				// this.videoNew.forEach((val, ix) => {
				// 	if (ix == index) {
				// 		this.videoNew[ix].play();
				// 	} else {
				// 		this.videoNew[ix].pause();
				// 	}
				// })
				// 获取当前视频id
				let currentId = e.currentTarget.dataset.id
				// uni.createVideoContext获取视频上下文对象
				this.videoContent = uni.createVideoContext(currentId)
				// 获取json对象并遍历, 停止非当前视频
				let trailer = this.video
				for (let i = 0; i < trailer.length; i++) {
				  let temp = 'myVideo' + trailer[i].id
				  if (temp != currentId) {
					uni.createVideoContext(temp).pause()
				  }
				}
			},
			async getbanner(){
				let data = await this.$http.post('/lanhan/home/banner', {
					// data:{
						'base':{
							'uid':this.userInfo.userId,
						},
						"param":{
							'type':3
						}
					// }
				});
				// this.titleNViewBackground = 'rgb(203, 87, 60)';
				this.swiperLength = data.length;
				this.carouselList = data;
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				// 	let bcolor = [{
				// 		background: "rgb(203, 87, 60)"
				// 	}, {
				// 		background: "rgb(205, 215, 218)"
				// 	}, {
				// 		background: "rgb(183, 73, 69)"
				// 	}]
				const index = e.detail.current;
				this.swiperCurrent = index;
				// 	this.titleNViewBackground = bcolor[index].background;
			},
			// 视频跳转播放
			videoinfo(typeid,vid) {
				// uni.setStorage({
				// key:"videoinfo",
				// data: info
				// })
				// uni.setStorageSync("videoinfo",JSON.stringify(info));
				uni.navigateTo({
				    url: './coursevideo?typeid='+typeid+'&vid='+vid
				});
			},
			//音频跳转播放
			audioinfo(id) {
				// uni.setStorageSync("audioinfo",JSON.stringify(src));
				uni.navigateTo({
				    url: '../index/video?kcid='+id
				});
			},			
			getgoodlist(index,id){
				this.tabindex=index;
				this.typeid=id
				this.video=[];
				this.audio=[];
				this.sequence = 0;
				this.getvideolist(this.currentId)
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
								this.getvideolist(this.currentId)
				} catch (error) {
					console.error('error:',error);
				}
			},
			
			//请求视频音频列表
			async getvideolist(index) {
				// if(onType==0){
					this.title='';
					// this.video=[];
					// this.audio=[];
				// }
				
				if(this.currentId != index) {
					this.currentId = index;
					this.sequence = 0;
					
				}
				if(index==0){			
					// this.type = type;
					var videolist = await this.$request.post('/media/knowledge/list', {
						"data": {
							"sequence": this.sequence,
							"type": '1',
							// "uid": "1",
							"uid": this.userInfo.userId,
							"title": this.title,
							"typeId":this.typeid
						}
					});
					if(videolist.data.base.code == '000000'){
						if(videolist.data.data.length > 0){
							this.video=[];
							// console.log(1)
							setTimeout(function () {
							    uni.hideLoading();
							}, 500);
							
							this.video = this.video.concat(videolist.data.data);
							console.log(this.video)
							// this.video.forEach((val,index) => {
							// 	this.videoNew.push( uni.createVideoContext(`myVideo${index}`) )
							// });
							// console.log(this.video)
							this.sequence = this.video[this.video.length - 1].createSequence;
							this.frequent = true						
						}else{
							setTimeout(function () {
							    uni.hideLoading();
							}, 200);
							uni.showToast({
							    title: '暂无更多数据',
								icon:"none",
							    duration: 1000
							});
						}
					}								
				}else{
					var videolists = await this.$request.post('/home/course/courseList', {
						"data": {
							"sequence": this.sequence,
							"type": '1',
							// "uid": "1",
							"uid": this.userInfo.userId,
							"title": this.title,
							"type":this.typeid
						}
					});
					if(videolists.data.base.code == '000000'){
						if(videolists.data.data.length > 0){
							// console.log(1)
							this.audio=[];
							setTimeout(function () {
							    uni.hideLoading();
							}, 500);
							this.audio = this.audio.concat(videolists.data.data)
							// console.log(this.audio)
							for(let i = 0; i < this.audio.length; i++ ){
								if(this.audio[i].hasOwnProperty('label') == false){
									this.label[i] = "";
								}else if(this.audio[i].label.indexOf(',') == -1){
									this.label[i] = [this.audio[i].label];
								}else {
									this.label[i] = this.audio[i].label.split(',')
								}
							}
							// console.log(this.label)
							this.sequence = this.audio[this.audio.length - 1].createSequence;
							this.frequent = false
							// this.getrecommendlist(type)		
						}else{
							setTimeout(function () {
							    uni.hideLoading();
							}, 200);
							uni.showToast({
							    title: '暂无更多数据',
								icon:"none",
							    duration: 2000
							});
						}
					}									
									
				}
				
				
				
			},
			//音乐推荐列表 recommend
			async getrecommendlist(type) {
				// this.currentId = index;
				let recommend = await this.$request.post('/media/knowledge/recommends', {

					"data": {
						"type": type,
						// "uid": "1",
						"uid": this.userInfo.userId
					}
				});
				this.recommendlist = recommend.data.data;
				this.TotalWidth = this.recommendlist.length * 110;
			},
			// 音视频收藏
			async vediocolclick(id,index,collectFlag){
				let that = this;
				if(!this.hasLogin){
					this.$api.msg("请先登录");
					return;
				}else{
					let colval = collectFlag==0?1:0;
					that.$data.video[index].collectFlag = colval;
					if(colval){
						that.$data.video[index].collect ++;
					}else{
						that.$data.video[index].collect --;
					}
					let knowledgecol = await this.$request.post('/media/knowledge/collect', {
						"data": {
							"knowledgeId": id,
							"uid": that.userInfo.userId,
							"collect": colval
						}
					});
					if(knowledgecol.data.base.code == "000000"){
						that.$api.msg(knowledgecol.data.base.msg);
					}
				}
			},
			// 音视频喜欢
			async vediofavclick(id,index,favoriteFlag){
				let that = this;
				if(!this.hasLogin){
					this.$api.msg("请先登录");
					return;
				}else{
					let favval = favoriteFlag==0?1:0;
					that.$data.video[index].favoriteFlag = favval;
					if(favval){
						that.$data.video[index].favorites ++;
					}else{
						that.$data.video[index].favorites --;
					}
					let knowledgefav = await this.$request.post('/media/knowledge/favorite', {
						"data": {
							"knowledgeId": id,
							"uid": that.userInfo.userId,
							"favorites": favval
						}
					});
					if(knowledgefav.data.base.code == "000000"){
						that.$api.msg(knowledgefav.data.base.msg);
					}
				}
			},
			// 分享
			async share(id,url) {
				let that = this;
				if(!this.hasLogin){
					this.$api.msg("请先登录");
					return;
				}else{
					uni.navigateTo({
						url: url
					});
					let knowledgeshare = await this.$request.post('/media/knowledge/share', {
						"data": {
							"knowledgeId": id,
							"uid": that.userInfo.userId,
						}
					});
					if(knowledgeshare.data.base.code == "000000"){
						console.log(knowledgeshare.data.base.msg);
					}
				}
			},
		},
	
	}
</script>

<style lang='scss'>
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
		height: 120upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 18.2upx 30upx 20upx 30upx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		top: 0;
		padding-top: var(--status-bar-height);
		width: 100%;
		/* background: #fff; */
		background: #00575B;
		z-index: 10;

		ul {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;

			li {
				padding: 0 30upx;
				box-sizing: border-box;
				position: relative;
				font-size: 36upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: white;
				/* color: rgba(102, 102, 102, 1); */
			}
		}
	}

	.active::after {
		position: absolute;
		content: "";
		width: 30upx;
		bottom: -20upx;
		text-align: center;
		/* border-bottom: 10upx solid rgba(255, 170, 0, 1.0); */
		border-bottom: 10upx solid rgb(253, 133, 47);
		left: 50%;
		transform: translate(-50%, -50%);
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
	}
	.isactive{
		/* color:  rgba(255, 170, 0, 1.0); */
		color: rgb(253, 133, 47);
	}
	.isactive::after {
		position: absolute;
		content: "";
		width: 30upx;
		bottom: 4upx;
		text-align: center;
		/* border-bottom: 8upx solid rgba(255, 170, 0, 1.0); */
		border-bottom: 8upx solid rgb(253, 133, 47);
		left: 50%;
		transform: translate(-50%, -50%);
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
	}

	.content {
		margin-top: 120upx;

		.video_search {
			height: 112upx;
			background-color: rgba(240, 240, 240, 1);
			/* border-radius: 8px; */
			/* padding: 20upx 30upx; */
			box-sizing: border-box;
			/* position: fixed; */
			left: 0;
			width: 100%;
			top: 120upx;
			z-index: 20;

			.video_input {
				background: #FFFFFF;
				display: flex;
				input {
					/* background: url(../../static/img/btn_search_normal.png) no-repeat;
					background-position: 5% center; */
					height: 72upx;
					width:90%;
					text-align: center;
				}
				image{
					margin-top:1%;
					width:60upx;
					height:60upx;
				}
			}

			.audio_input {
				background: #FFFFFF;

				input {
					background: url(../../static/img/btn_search_normal.png) no-repeat;
					background-position: 33% center;
					height: 72upx;
				}
			}
		}
	}

	.input-placeholder {
		text-align: center
	}

	.video {
		background: rgba(255, 255, 255, 1);
		/* padding: 80upx 30upx 24upx 30upx; */
	}
	.auto{
		padding-top:80upx;
	}
	.videolist {
		margin-top: 38upx;
		border-bottom: 1px solid #E8E8E8;

		&:last-child {
			border-bottom: none;
		}

		.video_subject {
			/* height: 450upx; */
			video{
				display: block;
				width: 100%;
				height: 350upx;
				/* height: 87%; */
			}
			.text{
				font-size: 20px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
				line-height: 27px;
				margin-top:15upx;
			}
			/* image {
				width: 100%;
				height: 100%;
			} */
		}

		.video_volume {
			width: 68upx;
			height: 28upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 4upx;
			position: absolute;
			left: 20upx;
			bottom: 20upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 4upx 8upx;

			image {
				width: 20upx;
				height: 20upx;
			}

			text {
				font-size: 20upx;
				font-family: DINCondensed-Bold, DINCondensed;
				font-weight: bold;
				color: rgba(232, 65, 112, 1);
				line-height: 24upx;
				margin-left: 8upx;
				margin-top: 0;
			}
		}

		.video_time {
			height: 28upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 4upx;
			font-size: 20upx;
			font-family: DINCondensed-Bold, DINCondensed;
			font-weight: bold;
			color: rgba(232, 65, 112, 1);
			line-height: 28upx;
			position: absolute;
			right: 20upx;
			bottom: 20upx;
		}

		.video_play {
			width: 84upx;
			height: 84upx;
			background: rgba(51, 51, 51, 1);
			opacity: 0.3024;
			border-radius: 100%;
			text-align: center;
			line-height: 84upx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			image {
				width: 37upx;
				height: 37upx;
			}
		}

		text {
			font-size: 32upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 44upx;
			margin-top: 20upx;
		}

		.operation {
			/* display: flex;
			justify-content: space-between;
			align-items: center; */
			margin: 24upx 30upx 30upx 30upx;

			/* .pubdate {
				font-size: 28upx;
				font-family: PingFangSC-Regular, PingFang SC;
				color: rgba(153, 153, 153, 1);
				line-height: 40upx;
			} */

			.oper {
				height: 24upx;
				font-size: 24upx;
				font-family: DINCondensed-Bold, DINCondensed;
				font-weight: bold;
				color: rgba(102, 102, 102, 1);
				line-height: 28upx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.start {
					image {
						width: 36upx;
						height: 36upx;
					}
				}

				.collect {
					margin: 0 60upx 0 62upx;

					image {
						width: 34upx;
						height: 30upx;
					}
				}

				.share {
					image {
						width: 30upx;
						height: 30upx;
					}
				}
			}
		}
	}

	.audio_list {
		background: white;
	    padding: 5% 16px;
	    -webkit-box-sizing: border-box;
	    box-sizing: border-box;

		.audio_title {
			height: 56upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30upx;

			.audt {
				padding-left: 20upx;
				box-sizing: border-box;
				font-size: 36upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				color: rgba(51, 51, 51, 1);
				line-height: 50upx;
			}

			.recommend {
				width: 32upx;
				height: 40upx;

				image {
					height: 100%;
					width: 100%;
				}

			}
		}

		.audio_content {
			width: 100%;
			overflow-x: scroll;

			ul {
				display: flex;
				justify-content: flex-start;
				overflow-x: hidden;
				width: 226%;

				li {
					width: 168upx;
					margin-right: 30upx;

					&:last-child {
						margin-right: 0;
					}

					.audio_pic {
						height: 244upx;
						position: relative;

						image {
							width: 100%;
							height: 100%;
						}

						.headset {
							width: 68upx;
							height: 28upx;
							background: rgba(255, 255, 255, 1);
							border-radius: 4px;
							position: absolute;
							left: 20upx;
							bottom: 20upx;
							padding: 4upx 8upx;
							display: flex;
							justify-content: space-between;
							align-items: center;

							image {
								width: 20upx;
								height: 20upx;
							}

							text {
								font-size: 20upx;
								font-family: DINCondensed-Bold, DINCondensed;
								font-weight: bold;
								color: rgba(232, 65, 112, 1);
								line-height: 28upx;
								margin-top: 0;
								margin-left: 4upx;
							}
						}
					}

					text {
						margin-top: 20upx;
						display: block;
						font-size: 28upx;
						font-family: PingFangSC-Regular, PingFang SC;
						color: rgba(51, 51, 51, 1);
						line-height: 40upx;
					  overflow: hidden;
					  display: -webkit-box;
					  -webkit-box-orient: vertical;
					  -webkit-line-clamp: 2;
					}
				}
			}
		}
	}

	.audio_title::after {
		position: absolute;
		content: "";
		height: 30upx;
		border-right: 10upx solid rgba(232, 65, 112, 1);
	}

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
	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		/* padding-top: 120upx; */
		background-image: linear-gradient(rgba(0,87,91,1) 37%, rgba(255,255,255,0) 100%);
		.titleNview-placing {
			height: 7px;
			margin-top: 1%;
			position: relative;
			z-index: 1;
			background: #b74d26;
		}
	
		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			transition: .4s;
			background: rgb(183, 77, 38);
		}
	}
	.carousel {
		width: 100%;
		height: 300upx;
	
		.carousel-item {
			width: 100%;
			height: 100%;
			overflow: hidden;
			position: relative
		}
	
		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}
	
	.carousel-section{
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
