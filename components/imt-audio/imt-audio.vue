<template>
	<view class="imt-audio">
		<view class="audio-wrapper">
			<view class="audio-number">{{currentTime}}</view>
			<slider class="audio-slider" :activeColor="color" block-size="16" :value="current" :max="duration" @changing="seek=true,current=$event.detail.value"
			 @change="change"></slider>
			<view class="audio-number">{{durationTime}}</view>
		</view>
		<view class="audio-control-wrapper" :style="{color:color}">
			<view class="audio-control audio-control-prev" v-if="control" :style="{borderColor:color}" @click="prev">&#xe601;</view>
			<view class="audio-control audio-control-switch" :class="{audioLoading:loading}" :style="{borderColor:color}" @click="operation">{{loading?'&#xe600;':(paused?'&#xe865;':'&#xe612;')}}</view>
			<view class="audio-control audio-control-next" v-if="control" :style="{borderColor:color}" @click="next">&#xe601;</view>
		</view>
	</view>
</template>

<script>
	const audio = uni.createInnerAudioContext(); //创建音频
	export default {
		data() {
			return {
				currentTime: '', //当前播放时间
				durationTime: '', //总时长
				current: '', //slider当前进度
				loading: false, //是否处于读取状态
				paused: true, //是否处于暂停状态
				seek: false //是否处于拖动状态
			}
		},
		props: {
			src: String, //音频链接
			autoplay: Boolean, //是否自动播放
			duration: Number, //总时长（单位：s）
			control: {
				type:Boolean,
				default:true
			}, //是否需要上一曲/下一曲按钮
			continue:Boolean,//播放完成后是否继续播放下一首，需定义@next事件
			color: {
				type:String,
				default:'#169af3'
			} //主色调
		},
		methods: {
			//返回prev事件
			prev() {
				this.$emit('prev')
			},
			//返回next事件
			next() {
				this.$emit('next')
			},
			//格式化时长
			format(num) {
				return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'.repeat(2 - String(
					Math.floor(num % 60)).length) + Math.floor(num % 60)
			},
			AudioPaused() {
				audio.pause()
			},
			AudioPlay() {
				audio.play()
			},
			//播放/暂停操作
			operation() {
				if (audio.paused) {
					audio.play()
					this.loading = true
				} else {
					audio.pause()
				}
			},
			//完成拖动事件
			change(e) {
				audio.seek(e.detail.value)
			}
		},
		created() {
			audio.src = this.src
			this.current = 0
			this.durationTime = this.format(this.duration)
			audio.obeyMuteSwitch = false
			audio.autoplay = this.autoplay
			//音频进度更新事件
			audio.onTimeUpdate(() => {
				if (!this.seek) {
					this.current = audio.currentTime
				}
			})
			//音频播放事件
			audio.onPlay(() => {
				this.paused = false
				this.loading = false
			})
			//音频暂停事件
			audio.onPause(() => {
				this.paused = true
			})
			//音频结束事件
			audio.onEnded(() => {
				if (this.continue) {
					this.next()
				} else {
					this.paused = true
					this.current = 0
				}
			})
			//音频完成更改进度事件
			audio.onSeeked(() => {
				this.seek = false
			})
		},
		watch: {
			//监听音频地址更改
			src(e) {
				audio.src = e
				this.current = 0
				audio.play()
				this.loading = true
			},
			//监听总时长改变
			duration(e) {
				this.durationTime = this.format(e)
			},
			//监听当前进度改变
			current(e) {
				this.currentTime = this.format(e)
			}
		}
	}
</script>

<style>
	@font-face {
		font-family: 'icon';
		src: url('http://at.alicdn.com/t/font_1104838_fxzimc34xw.eot');
		src: url('http://at.alicdn.com/t/font_1104838_fxzimc34xw.eot?#iefix') format('embedded-opentype'),
			url('http://at.alicdn.com/t/font_1104838_fxzimc34xw.woff2') format('woff2'),
			url('http://at.alicdn.com/t/font_1104838_fxzimc34xw.woff') format('woff'),
			url('http://at.alicdn.com/t/font_1104838_fxzimc34xw.ttf') format('truetype'),
			url('http://at.alicdn.com/t/font_1104838_fxzimc34xw.svg#iconfont') format('svg');
	}

	.imt-audio {
		padding: 30upx;
		background: #fff;
		border-radius: 20upx;
	}

	.audio-wrapper {
		display: flex;
		align-items: center;
	}

	.audio-number {
		font-size: 24upx;
		line-height: 1;
		color: #333;
	}

	.audio-slider {
		flex: 1;
		margin: 0 30upx;
	}

	.audio-control-wrapper {
		margin-top: 20upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: "icon" !important;
	}

	.audio-control {
		font-size: 32upx;
		line-height: 1;
		border: 4upx solid;
		border-radius: 50%;
		padding: 16upx;
	}

	.audio-control-next {
		transform: rotate(180deg);
	}

	.audio-control-switch {
		font-size: 40upx;
		margin: 0 80upx;
	}

	.audioLoading {
		animation: loading 2s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	@keyframes loading {
		to {
			transform: rotate(360deg);
		}
	}
</style>