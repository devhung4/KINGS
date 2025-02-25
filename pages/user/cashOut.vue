<template>
	<view>
		<view class="main">
			<view class="navbar">
				<!-- :class="[currentTab==index ? 'active' : '']"-->
				<view v-for="(item, index) in navList" :key="index" class="item" @click="tabClick(index)">
					<view class="yuan1" :class="[currentTab==index ? 'active1' : '']">
						<view class="yuan2" :class="[currentTab==index ? 'active2' : '']"></view>
					</view>
					<text>{{ item.text }}</text>
				</view>
			</view>
			<view v-if="show" class="tabs-one">
				<view class="item-view">
					<text style="width:40%;">请输入支付宝账号</text>
					<input style="width:55%;" @input="zfbAccount" />
				</view>
				<view class="item-view">
					<text style="width:25%;">请输入姓名</text>
					<input style="width:70%;" @input="Name" />
				</view>
				<view class="money-title">提现红包</view>
				<view class="item-view-other">
					<text style="width:5%;">￥</text>
					<input v-model="money" style="width:90%;" @input="cashDividend" />
				</view>
				<view class="view-title">到账金额:{{(money*0.75).toFixed(2)}}</view>
				<view class="item-viewcss">
					<text>当前红包余额</text>
					<text class="text-two">{{surplus}}</text>
					<text class="text-three">全部提现</text>
				</view>
				<view class="unloadewm">
					上传收款码
				</view>
			</view>
			<view v-else class="tabs-two">
				<view style="text-align:center;">微信</view>
				<view class="money-title">提现金额</view>
				<view class="item-view-other">
					<text style="width:5%;">￥</text>
					<input style="width:90%;" @input="cashoutMoney" />
				</view>
				<view class="item-viewcss">
					<text>当前红包余额</text>
					<text class="text-two">{{surplus}}</text>
					<text class="text-three">全部提现</text>
				</view>
			</view>
		</view>
		<view class="cash-out" @click="cashOut">提现</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navList: [{
						text: '支付宝'
					},
					{
						text: '微信'
					}
				],
				currentTab: 0,
				show: true,
				surplus: '',
				uid: '',
				money: '',
				cashOutMoney: '', //微信提现金额
				account: '', //银行卡号或支付宝账号
				name: '', //姓名
				packet: '' //支付宝提现红包
			}
		},
		methods: {
			tabClick(index) {
				this.currentTab = index
				if (this.currentTab == 1) {
					this.show = false
				} else {
					this.show = true
				}
			},
			//银行卡号或支付宝账号
			zfbAccount(e) {
				this.account = e.detail.value
			},
			//姓名
			Name(e) {
				this.name = e.detail.value
			},
			//支付宝提现红包
			cashDividend(e) {
				this.packet = e.detail.value
			},
			//微信提现金额
			cashoutMoney(e) {
				this.cashOutMoney = e.detail.value
			},
			async cashOut() {
				if (this.currentTab == 1) {
					 let res4 = await this.$http.post('/lanhan/user/withdrawApply', {
						"base": {
							"appId": "001",
							"channels": "001",
							"ver": "1.1.5",
							"clientVer": "1.0",
							"apn": "wifi",
							"deviceId": "1233eedds2112",
							"uid": this.uid,
							"valat": 22.332112,
							"lalong": 12.332112,
							"platform": "IOS",
							"platformVer": "8",
							"resolution": "960*640",
							"deviceType": "P6",
							"carrier": "china mobile",
							"city": "合肥",
							"brand": "huawei"
						},
						"param": {
							"amount": that.cashOutMoney,
							"type": 1,
						}
					 })
					// if (this.cashOutMoney > this.surplus) {
					// 	uni.showToast({
					// 		title: '提现金额不得超过当前余额',
					// 		duration: 2000,
					// 		icon: 'none'
					// 	})
					// 	}
					// } else if (res1.base.code == '000000') {
					// 	uni.showToast({
					// 		title: '提现金额成功',
					// 		duration: 2000,
					// 		icon: 'none'
					// 	});
					// }
				}
			}
		},
		
		onLoad(options) {
			this.surplus = options.surplus
			this.uid = options.uid
		}
	}
</script>

<style lang="scss">
	page {
		background: #efefef;
	}

	.main {
		width: 90%;
		padding-bottom: 30upx;
		margin: 20upx auto;
		border-radius: 10upx;
		background: #fff;
		padding-top: 10upx;
	}

	.navbar {
		display: flex;
		background: #fff;
		width: 100%;
		height: 88upx;
	}

	.navbar .item {
		position: relative;
		display: flex;
		align-items: center;
		height: 88upx;
		font-size: 30upx;
		margin: 0 20upx;
	}

	.cash-out {
		width: 90%;
		height: 80upx;
		line-height: 80upx;
		margin: 30upx auto 0;
		background: #FA436A;
		color: #fff;
		text-align: center;
	}

	.tabs-one {
		width: 100%;
		height: auto;
	}

	.item-view {
		display: flex;
		align-items: center;
		font-size: 30upx;
		margin: 10upx 0 20upx 20upx;
	}

	.item-view text {
		margin-right: 15upx;
	}

	.item-view input {
		border-bottom: 4upx solid #f5f5f5;
	}

	.item-view-other {
		display: flex;
		align-items: center;
		margin-left: 20upx;
	}

	.item-view-other text {
		font-size: 35upx;
		font-weight: bold;
	}

	.item-view-other input {
		border-bottom: 4upx solid #f5f5f5;
	}

	.money-title {
		margin: 20upx 0 20upx 20upx;
		font-size: 35upx;
	}

	.view-title {
		margin: 15upx 0 30upx 20upx;
		color: #949494;
	}

	.item-viewcss {
		display: flex;
		align-items: center;
		font-size: 30upx;
		margin: 10upx 0 20upx 20upx;
		color: #949494;
	}

	.text-two {
		margin: 0 25upx 0 15upx;
	}

	.text-three {
		color: #1ba5ff;
	}

	.unloadewm {
		width: 85%;
		height: 250upx;
		line-height: 250upx;
		text-align: center;
		margin: 10upx auto;
		background: #eeeeee;
		border-radius: 15upx;
		color: #707070
	}

	.yuan1 {
		width: 40upx;
		height: 40upx;
		display: flex;
		margin-right: 10upx;
		justify-content: center;
		align-items: center;
		border: 5upx solid #7d7d7d;
		border-radius: 50%;
	}

	.yuan2 {
		width: 25upx;
		height: 25upx;
		border-radius: 50%;
	}

	.active1 {
		border: 5upx solid #1f94f1;
	}

	.active2 {
		background: #1f94f1;
	}
</style>
