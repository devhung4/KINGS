<template>
	<view class="uni-countdown">
		<view v-if="showDay" class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{d}}</view>
		<view v-if="showDay" class="uni-countdown__splitor" :style="{color:splitorColor}">天</view>
		<view class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{h}}</view>
		<view class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '时'}}</view>
		<view class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{i}}</view>
		<view class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '分'}}</view>
		<view class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{s}}</view>
		<view v-if="!showColon" class="uni-countdown__splitor" :style="{color:splitorColor}">秒</view>
	</view>
</template>
<script>
	export default {
		name: "uni-countdown",
		props: {
			showDay: {
				type: Boolean,
				default: true
			},
			showColon: {
				type: Boolean,
				default: true
			},
			backgroundColor: {
				type: String,
				default: "#FFFFFF"
			},
			borderColor: {
				type: String,
				default: "#000000"
			},
			color: {
				type: String,
				value: "#000000"
			},
			splitorColor: {
				type: String,
				default: "#000000"
			},
			day: {
				type: Number,
				default: 0
			},
			hour: {
				type: Number,
				default: 0
			},
			minute: {
				type: Number,
				default: 0
			},
			second: {
				type: Number,
				default: 0
			},
			reset: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				timer: null,
				d: '00',
				h: '00',
				i: '00',
				s: '00',
				leftTime: 0,
				seconds: 0
			}
		},
		watch: {
			reset(val) {
				clearInterval(this.timer)	
				this.startData();
			}
		},
		created: function(e) {
			this.startData()
		},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		methods: {
			startData() {
				this.seconds = this.toSeconds(this.day, this.hour, this.minute, this.second)
				if (this.seconds <= 0) {
					return
				}
				this.countDown()
				this.timer = setInterval(() => {
					this.seconds--
					if (this.seconds < 0) {
						this.timeUp()
						return
					}
					this.countDown()
				}, 1000)
			},
			toSeconds(day, hours, minutes, seconds) {
				return (day * 60 * 60 * 24) + (hours * 60 * 60) + (minutes * 60) + seconds
			},
			timeUp() {
				clearInterval(this.timer)
				this.$emit('timeup')
			},
			countDown() {
				let seconds = this.seconds
				let [day, hour, minute, second] = [0, 0, 0, 0]
				if (seconds > 0) {
					day = Math.floor(seconds / (60 * 60 * 24))
					hour = Math.floor(seconds / (60 * 60)) - (day * 24)
					minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
					second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
				} else {
					this.timeUp()
				}
				if (day < 10) {
					day = '0' + day
				}
				if (hour < 10) {
					hour = '0' + hour
				}
				if (minute < 10) {
					minute = '0' + minute
				}
				if (second < 10) {
					second = '0' + second
				}
				this.d = day
				this.h = hour
				this.i = minute
				this.s = second
			}
		}
	}
</script>
<style lang="scss">
	$countdown-height:50upx;

	.uni-countdown {
		padding: 2upx 0;
		display: inline-flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;

		&__splitor {
			justify-content: center;
			line-height: $countdown-height;
			padding: 0 2upx;
			font-size: $uni-font-size-base;
		}

		&__number {
			line-height: $countdown-height;
			justify-content: center;
			height: $countdown-height;
			border-radius: $uni-border-radius-base;
			margin: 0 2upx;
			font-size: $uni-font-size-base;
			border: 1px solid #000000;
			padding: 0 2upx;
		}
	}
</style>
