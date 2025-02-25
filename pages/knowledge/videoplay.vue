<template>
	<view class="videoplay">
		<view class="header">
			
		</view>
		<!-- <view class="video">
			<view class="video_play">
				<video :src="nowvideo.url"
				 controls :autoplay="videoautoplay" ref="children" :show-center-play-btn="showcplay" @play="play()"></video>
			</view>
			<view class="present">
				<view class="present_tt">
					<view class="present_title">
						{{nowvideo.title}}
					</view>
					<view class="present_time">
						{{nowvideo.id | timeStamp}}
					</view>
				</view>
				<view class="oper">
					<view class="start">
						<image src="../../static/img/start.png" mode=""></image>
						<span>{{nowvideo.collect}}</span>
					</view>
					<view class="collect">
						<image src="../../static/img/collect.png" mode=""></image>
						<span>{{nowvideo.favorites}}</span>
					</view>
					<view class="share">
						<image src="../../static/img/share.png" mode=""></image>
						<span>{{nowvideo.share}}</span>
					</view>
				</view>
			</view>
		</view> -->
		<view class="video" v-for="(item,index) in video" :key="index">
			<view class="video_play">
				<video :id="'myVideo'+index" :src="item.url" controls :poster="item.image" 
				@play="renderPage(index)">
				</video>
				<!-- @play="play()" -->
				<!-- :show-center-play-btn="showcplay" -->
			</view>
			<view class="present">
				<view class="present_tt">
					<view class="present_title">
						{{item.title}}
					</view>
					<view class="present_time">
						{{item.createSequence | timeStamp}}
					</view>
				</view>
				<view class="oper">
					<view class="start" @click="getcollectvideo(item.id)">
						<image src="../../static/img/start.png" mode="" v-if="collect"></image>
						<image src="../../static/img/start.png" mode="" v-else></image>
						<span v-if="collect">{{item.collect}}</span>
						<span v-else>{{item.collect +1}}</span>
					</view>
					<view class="collect" @click="getlikevideo(item.id)">
						<image src="../../static/img/collect.png" mode="" v-if="likevideo"></image>
						<image src="../../static/img/like.png" mode="" v-else></image>
						<span v-if="likevideo">{{item.favorites}}</span>
						<span v-else>{{item.favorites +1 }}</span>
					</view>
					<view class="share" @click="getsharevideo(item.id)">
						<image src="../../static/img/share.png" mode=""></image>
						<span v-if="share">{{item.share}}</span>
						<span v-else>{{item.share + 1}}</span>
					</view>
				</view>
			</view>
		</view>

		<!-- <view class="video_mask">
			<audio style="text-align: left" src="https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3" controls></audio>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoautoplay: true,
				nowvideo: {},
				showcplay: false,
				video: [],
				likevideo: true,
				collect: true,
				currentVideo: 0,
				videoNew: [],
				share:true
			}
		},
		onLoad() {
			let videoinfo = uni.getStorageSync("videoinfo");
			this.nowvideo = JSON.parse(videoinfo);
			console.log(this.nowvideo)
			this.getvideolist(1);

		},
		created() {
			this.video.forEach((val,index) => {
				this.videoNew.push( uni.createVideoContext(`myVideo${index}`) )
			});

		},
		mounted() {
			this.renderPage(this.currentVideo);
		},
		methods: {
			renderPage(index) {
				// console.log(index)
				this.videoNew.forEach((val, ix) => {
					if (ix == index) {
						this.videoNew[ix].play();
					} else {
						this.videoNew[ix].pause();
					}
				})
			},
			// play: function() {
			// 	console.log(111)
			// },
			//请求视频列表
			async getvideolist(type) {
				// console.log(type)
				let videol = await this.$request.post('/media/knowledge/list', {
					"data": {
						"sequence": 0,
						"type": type,
						"uid": "1",
						"title": ""
					}
				});
				this.video = videol.data.data
				this.video.unshift(this.nowvideo)
				// console.log(this.video)
				this.video.forEach((val,index) => {
					this.videoNew.push( uni.createVideoContext(`myVideo${index}`) )
				});
				console.log(this.videoNew)
			},
			// 播放报错
			// videoErrorCallback: function(e) {
			// 	uni.showModal({
			// 		content: e.target.errMsg,
			// 		showCancel: false
			// 	})
			// },
			//收藏视频
			async getcollectvideo(id) {
				if (this.collect) {
					let collectvideo = await this.$request.post('/media/knowledge/collect', {

						"data": {
							"knowledgeId": id,
							"uid": "7",
							"collect": 1
						}
					});
					this.collect = false
				} else {
					let collectvideo = await this.$request.post('/media/knowledge/collect', {

						"data": {
							"knowledgeId": id,
							"uid": "7",
							"collect": 0
						}
					});
					this.collect = true
				}

			},
			//喜欢视频请求
			async getlikevideo(id) {
				console.log(id)
				// this.currentId = index;
				if (this.likevideo) {
					let likevideo = await this.$request.post('/media/knowledge/favorite', {

						"data": {
							"knowledgeId": id,
							"uid": "7",
							"favorites": 1
						}
					});
					this.likevideo = false
				} else {
					let likevideo = await this.$request.post('/media/knowledge/favorite', {

						"data": {
							"knowledgeId": id,
							"uid": "7",
							"favorites": 2
						}
					});
					this.likevideo = true
				}

			},
			//分享视频请求
			async getsharevideo(id) {
				let sharevideo = await this.$request.post('/media/knowledge/share', {
					"data": {
						"knowledgeId": id,
						"uid": "7"
					}
				});
				if(sharevideo.data.base.code == "000000") {
					if(this.share == true) {
						this.share = false
						uni.showToast({
							title: '分享成功',
							duration: 1000,
							icon:'none'
						});
					}else {
						uni.showToast({
							title: '已分享过',
							duration: 1000,
							icon:'none'
						});
					}
				}else {
					uni.showToast({
						title: sharwvideo.data.base.msg,
						duration: 1000
					});
				}
				
			}


		},
		filters: {
			// timeStamp: function(value) {
			// 	if (!value) return '';
			// 	var now = new Date(value);
			// 	var year = now.getFullYear();
			// 	var month = now.getMonth() + 1;
			// 	if (month < 10) {
			// 		month = '0' + month
			// 	}
			// 	var date = now.getDate();
			// 	if (date < 10) {
			// 		date = '0' + date
			// 	}
			// 	return year + "-" + month + "-" + date
			// },
			timeStamp: function(value) { //具体到时分秒
				if (!value) return '';
				var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var year = date.getFullYear();
				var month = ("0" + (date.getMonth() + 1)).slice(-2);
				var sdate = ("0" + date.getDate()).slice(-2);
				var hour = ("0" + date.getHours()).slice(-2);
				var minute = ("0" + date.getMinutes()).slice(-2);
				var second = ("0" + date.getSeconds()).slice(-2);
				// 拼接
				var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second;
				// 返回
				return result;
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: rgba(246, 246, 246, 1);
	}
	.header{
		padding-top: var(--status-bar-height);
	}
	.video {
		height: 740upx;
		background: rgba(255, 255, 255, 1);
		margin-bottom: 20upx;
	}

	.video_play {
		height: 422upx;

		video {
			width: 100%;
		}

		uni-video {
			height: 100%;
		}

	}

	.present {
		height: 318upx;
		padding: 0 30upx;
		box-sizing: border-box;

		.present_tt {
			padding: 30upx 0;
			box-sizing: border-box;
			border-bottom: 1px solid #e8e8e8;

			.present_tite {
				font-size: 34upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: rgba(51, 51, 51, 1);
				height: 96upx;
				overflow-y: hidden;
			}

			.present_time {
				font-size: 28upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
				margin-top: 20upx;
			}
		}
	}

	.oper {

		font-size: 24upx;
		font-family: DINCondensed-Bold, DINCondensed;
		font-weight: bold;
		color: rgba(102, 102, 102, 1);
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 30upx 0;
		box-sizing: border-box;

		.start {
			image {
				width: 36upx;
				height: 36upx;
			}
		}

		.collect {
			border-left: 1px solid #e8e8e8;
			border-right: 1px solid #e8e8e8;
			width: 248upx;
			text-align: center;

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

	.video_mask {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 570upx;
		background-color: rgba(0, 0, 0, 0.7);
	}
</style>
