<template>
	<view class="audioplay">
		<view class="header">
			<view class="back" @click="navidataBack()">
				<image src="../../static/img/btn_back.png" mode=""></image>
			</view>
			<view class="title">
				{{audioTitle}}
			</view>
			<view class="share">
				<!-- <image src="../../static/img/btn_back_share.png" mode="" @tap="share('../set/invite')"></image> -->
			</view>
		</view>
		<view class="content">
			<view class="play_info">
				<view class="play_pic">
					<image src="../../static/img/audio_play.jpg" mode=""></image>
				</view>
				<view class="det_play" style="text-align: center;">
					<image src="../../static/img/audioplay.png" mode=""></image>
					<text>当前播放</text>:
					<text>{{audioTitle}}</text>
				</view>
				<view class="audo-video">
					<video id="myVideo" :src="srcBase" class="hidden" @timeupdate="timeupdate" ref="video" @loadedmetadata="loadedmetadata" ></video>
					<view class="slider-box">
						<text class="mm">{{timer}}</text>
						<slider 
							style="width: 50%"
							@change="sliderChange"
							@changing="sliderChanging"
							class="audio-slider" 
							block-size="12" 
							:min="0"
							:max="duration"
							:value="currentTime"
							activeColor="#ff7400"
							@touchstart="lock= true"
							@touchend="lock = false"
							/>
						<text class="ss">{{overTimer}}</text>
					</view>
					<view class="btn-box">
						<view class="videoBtn">
							<image class="cutImg" @tap="prev" src="../../static/img/icon_previous.png" mode=""></image>
						</view>
						<view class="videoBtn" @tap="play" v-if="status==1">
							<image class="playImg" src="../../static/img/icon_play.png" mode=""></image>
						</view>
						<view class="videoBtn" @tap="stop" v-else>
							<image class="playImg" src="../../static/img/icon_timeout.png" mode=""></image>
						</view>
						<view class="videoBtn">
							<image class="cutImg" @tap="next" src="../../static/img/icon_next.png" mode=""></image>
						</view>
					</view>
					<!-- <button @tap="setRate(0.5)">0.5倍</button>
					<button @tap="setRate(0.75)">0.75倍</button>
					<button @tap="setRate(1)">1倍</button>
					<button @tap="setRate(1.5)">1.5倍</button>
					<button @tap="setRate(2)">2倍</button> -->
				</view>
			</view>
			
			<view class="detailed">
				<view class="video">
					<view class="video_title">
						<text class="audt">音频目录</text>
					</view>
				</view>
				<view class="det">
					<view class="detailed_list" v-for="(item,index) in audio" :key="index" @click="onPlay(index)">
						<view class="det_title">
							{{item.title}}
						</view>
						<view class="det_bot">
							<view class="det_time">
								<image src="../../static/img/headset.png" mode=""></image>
								<text>{{item.view}}</text>
							</view>
							<!-- <view class="det_play">
								<image src="../../static/img/audioplay.png" mode=""></image>
								<text>当前播放</text>
							</view> -->
						</view>
					</view>
					<!-- <view class="detailed_list">
						<view class="det_top">
							<view class="det_title">
								2.添传统易经学习_第一课
							</view>
						</view>
						<view class="det_bot">
							<view class="det_time">
								<image src="../../static/img/headset.png" mode=""></image>
								<text>25:23</text>
							</view>
							<view class="det_play" v-show="!play">
								<image src="../../static/img/audioplay.png" mode=""></image>
								<text>当前播放</text>
							</view>
						</view>
					</view> -->
				</view>

			</view>
			<view class="last">
				已经到底啦~
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	const innerAudioContext = uni.createInnerAudioContext()
	// import imtAudio from '@/components/imt-audio/imt-audio.vue';
	export default {
		components:{
			// imtAudio
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']),
			timer() {
				return calcTimer(this.currentTime)
			},
			overTimer() {
				return calcTimer(this.duration)
			}
		},
		data() {
			return {
				srcBase:'',
				lock: false, // 锁
				status: 1, // 1暂停 2播放
				currentTime: 0,  //当前进度
				duration: 0, // 总进度
				videoContext: '',
				type:2,
				audio:[],
				audioTitle:'',
				audioIndex:0
			}
		},
		created() {
			this.videoContext = uni.createVideoContext('myVideo')
			
		},
		onLoad(){
			this.getvideolist(this.currentId, this.type)
			let audioURL=JSON.parse(uni.getStorageSync("audioinfo"));
			this.srcBase =audioURL.url;
			this.audioTitle=audioURL.title;
		},
		mounted() {
			// this.createdAudio()
		},
		onUnload() {
			// this.innerAudioContext.stop()

			// this.$refs.myAudio.AudioPaused()
			// this.Mp3Audio 
		},
		methods: {
		
			navidataBack() {
				// this.$refs.myAudio.AudioPaused()
				uni.navigateBack();
			},

			// 分享
			async share(url) {
				let that = this;
				uni.navigateTo({
					url: url
				});
				// let knowledgeshare = await this.$request.post('/media/knowledge/share', {
				// 	"data": {
				// 		"knowledgeId": id,
				// 		"uid": that.userInfo.userId,
				// 	}
				// });
				// if(knowledgeshare.data.base.code == "000000"){
				// 	console.log(knowledgeshare.data.base.msg);
				// }
			},
			//请求视频音频列表
			async getvideolist(index, type) {
				this.currentId = index;
				var videolist = await this.$request.post('/media/knowledge/list', {
					"data": {
						"sequence": 0,
						"type": type,
						"uid": "1",
						"title": ""
					}
				});
					this.audio = videolist.data.data
					// this.src=this.audio[0].url
			},
			// 倍速
			// setRate(num) {
			// 	this.videoContext.playbackRate(num)
			// },
			
			// 播放
			play() {
				this.status = 2
				this.videoContext.play()
			},
			
			// 暂停
			stop() {
				this.videoContext.pause()
				this.status = 1
			},
			//上一页
			prev(){
				let prevNum=this.audioIndex;
				if(prevNum>0){
					prevNum--;
				}
				console.log("prevNum"+prevNum)
				if(prevNum==0){
					prevNum=0;
				}
				this.onPlay(prevNum)
				console.log("prevNum"+prevNum)
				this.status = 1
				
			},
			next(){
				let nextNum=this.audioIndex;
				if(nextNum<this.audio.length-1){
					nextNum++;
				}
				
				if(nextNum==this.audio.length){
					nextNum=this.audio.length;
				}
				this.onPlay(nextNum)
				console.log("nextNum"+nextNum)
				this.status = 1
			},
			//选中播放
			onPlay(index){
				console.log(index)
				this.audioIndex=index;
				this.srcBase=this.audio[index].url;
				this.audioTitle=this.audio[index].title;
				this.status = 1
				// this.play();
			},
			// 更新进度条
			timeupdate(event) {
				if(this.lock) return; // 锁
				var currentTime,duration;
				if(event.detail.detail) {
					currentTime = event.detail.detail.currentTime
					duration = event.detail.detail.duration
				}else {
					currentTime = event.detail.currentTime
					duration = event.detail.duration
				}
				this.currentTime = currentTime
				this.duration = duration
			},
			
			// 拖动进度条
			sliderChange(data) {
				this.videoContext.seek(data.detail.value)
			},
			
			//拖动中
			sliderChanging(data) {
				this.currentTime = data.detail.value
			},
			
			// 视频加载完成
			loadedmetadata(data) {
				this.duration = data.detail.duration
			}
		},
	}
	function calcTimer(timer) {
		if(timer === 0 || typeof timer !== 'number') {
			return '00:00'
		}
		let mm = Math.floor(timer / 60)
		let ss = Math.floor(timer % 60)
		if(mm < 10) {
			mm = '0' + mm
		}
		if(ss < 10) {
			ss = '0' + ss
		}
		return mm + ':' + ss
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

	/* 头部 */
	.header {
		height: 120.2upx;
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
		background: #fff;
		z-index: 10;

		.back {
			width: 44upx;
			height: 44upx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.title {
			font-size: 36upx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: rgba(51, 51, 51, 1);
		}

		.share {
			width: 44upx;
			height: 44upx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.content {
		margin-top: 120upx;
	}

	.play_info {
		background: #FFFFFF;
		height: 862upx;
		padding-top: 80upx;
		box-sizing: border-box;

		.play_pic {
			width: 400upx;
			height: 400upx;
			border-radius: 8upx;
			margin: 0 auto 60upx;

			image {
				width: 100%;
				height: 100%;
			}
		}
		.audo-video {
				padding: 40upx;
			}
			.slider-box {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 26upx;
				color: #999;
			}
			.btn-box{
				margin:0 auto;
				display: flex;
				width:70%;
				justify-content: space-between;
				.videoBtn {
					width: 150upx;
					height:150upx;
					text-align: center;
					line-height: 150upx;
					padding: 0;
					.playImg{
						width: 150upx;
						height:150upx;
					}
					.cutImg{
						margin-top:40upx;
						width: 60upx;
						height:60upx;
						
					}
				}
			}
			.hidden {
				position: fixed;
				z-index: -1;
				width: 1upx;height: 1upx;
			}
	}

	uni-slider .uni-slider-handle,
	uni-slider .uni-slider-thumb {
		border-radius: 0;
		background-color: #E84170;
	}

	html,
	body {
		height: auto;
	}

	.detailed {
		margin-top: 20upx;
		background: rgba(255, 255, 255, 1);

		.video {
			border-bottom: 1px solid #e8e8e8;
			height: 100upx;
			padding: 28upx 30upx;
			box-sizing: border-box;

			.video_title {
				height: 56upx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.audt {
					padding-left: 20upx;
					box-sizing: border-box;
					font-size: 32upx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: rgba(51, 51, 51, 1);
				}
			}
		}


		.detailed_list {
			padding: 40upx 0;
			box-sizing: border-box;
			border-bottom: 1px solid #e8e8e8;
			color: rgba(51, 51, 51, 1);

			.det_title {
				font-size: 32upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;

			}

			.det_bot {
				font-size: 28upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20upx;
			}
		}
	}

	.det {
		padding: 0 30upx;
		box-sizing: border-box;

	}

	.video_title::after {
		position: absolute;
		content: "";
		height: 30upx;
		border-right: 10upx solid rgba(232, 65, 112, 1);
	}

	.det_time {
		display: flex;
		align-items: center;

		image {
			width: 30upx;
			height: 30upx;
		}

		text {
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			margin-left: 10upx;
		}
	}

	.det_play {
		/* display: flex; */
		align-items: center;

		image {
			width: 30upx;
			height: 30upx;
		}

		text {
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(232, 65, 112, 1);
			margin-left: 10upx;
		}
	}

	.active {
		color: #E84170 !important;
	}

	.last {
		height: 104upx;
		text-align: center;
		line-height: 104upx;
		font-size: 24upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
	}

	.line {
		width: 690upx;
	}

	.operation {
		padding: 0 150upx;
		display: flex;
		justify-content: space-around;
		align-items: center;

		.last_song {
			image {
				width: 45upx;
				height: 45upx;
			}
		}

		.play {
			width: 180upx;
			height: 180upx;

			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.nex_song {

			image {
				width: 45upx;
				height: 45upx;
			}
		}
	}

	.slider {
		width: 690upx;
		position: relative;
		height: 8upx;
		display: flex;
		align-items: center;
		cursor: default;
		border-radius: 4upx;
		user-select: none;
		outline: none;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.silderNone {
		position: absolute;
		height: 8upx;
		width: 100%;
		background-color: #ccc;
		left: 0;
		border-radius: 4upx;
		top: 50%;
		margin-top: -1px;
	}

	.slider-track {
		position: absolute;
		height: 8upx;
		left: 0;
		right: 0;
		border-radius: 4upx;
		top: 50%;
		background-color: #e4e4e4;
	}

	.slider-fill {
		position: absolute;
		height: 8upx;
		width: 100%;
		background-color: #E84170;
		left: 0;
		border-radius: 4upx;
		top: 50%;
		margin-top: -1px;
	}

	.slider-thumb {
		position: absolute;
		width: 20upx;
		top: 65%;
		height: 40upx;
		background: rgba(232, 65, 112, 1);
		border-radius: 4upx;
		color: #E84170;
		transform: translate(-50%, -50%);
		cursor: pointer;
	}
</style>
