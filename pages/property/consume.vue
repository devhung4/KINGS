<template>
	<view class="container">
		<view class="main">
			<view class="main_top">
				<view class="title">
					<view>{{$t('consume.index1')}}</view>
					<!-- <view @click="record()">{{$t('consume.index2')}}</view> -->
				</view>
				<input type="number" v-model="amount" :placeholder="$t('consume.index3')" maxlength="10" />
			</view>
			<view class="main_bottom">
				<view class="title">
					{{$t('consume.index4')}}
				</view>
				<view class="title">
					<input type="text" v-model="mobile" :placeholder="$t('consume.index5')" />
					<!-- #ifndef H5 -->
					<view class="whole" @click="openewm">
						<image src="../../static/img/btn_scan_normal.png" mode=""></image>
					</view>
					<!-- #endif -->
				</view>
			</view>
			<view class="overnum">
				{{$t('consume.index6')}}:<text>{{ csrbanlance }}</text>
			</view>
		</view>
		<view class="btn" @click="apy">
			{{$t('consume.index7')}}
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex';
	import {
		pathToBase64,
		base64ToPath
	} from '../../common/image-tools/index.js';
	export default {
		data() {
			return {
				amount: '',
				userinfo: {},
				openewmcode: '',
				mobile: '',
				type: '1',
				csrbanlance: '',
				navTitle: this.$t('consume.index0')
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.navTitle
			})
		},
		onLoad() {
			// this.getData();
			this.getWalletInfo();
		},
		methods: {
			...mapMutations(['logout']),

			//获取资产信息
			async getWalletInfo() {
				try {
					let walletList = await this.$request.post('/uc/asset/wallet', {
						header: {
							'x-auth-token': uni.getStorageSync('token'),
							'Accept-Language': uni.getStorageSync('locale') ? uni.getStorageSync('locale') :
								'en-US,en'
						},
						data: {}
					});
					if (walletList.data.code == 0) {
						for (let i of walletList.data.data) {
							if (i.coinName === 'MSL') {
								this.csrbanlance = i.balance;
							}
						}
					} else {
						uni.setStorageSync('hasLogin', false);
						uni.setStorageSync('userInfo', '');
						// uni.clearStorageSync();
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/public/login'
							});
						}, 200);
					}
				} catch (e) {
					console.log(e);
					// that.$api.msg('网络异常');
				}
			},

			async apy() {
				let that = this
				if (that.amount == 0 || that.amount == '') {
					this.$api.msg(this.$t('consume.index8'));
					return
				} else if (that.amount > that.csrbanlance) {
					this.$api.msg(this.$t('consume.index9'));
					return
				} else if (that.mobile == 0 || that.mobile == "") {
					this.$api.msg(this.$t('consume.index10'));
					return
				}
				// console.log('111')
				let res = await that.$request.post('/uc/memberTransferRecord/transferToShop', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale') ? uni.getStorageSync('locale') :
							'en-US,en'
					},
					data: {
						phone: that.mobile,
						coinName: 'CSR',
						amount: that.amount,
						remark: '',
					}
				});
				if (res.data.code == 0) {
					this.mobile = '';
					this.amount = '';
					this.$api.msg(this.$t('consume.index11'));
					this.getWalletInfo();
				} else {
					this.showmask = false;
					this.$api.msg(res.data.message);
				}
			},
			navTo(url) {
				if (!this.hasLogin) {
					url = '/pages/public/login';
				}
				uni.navigateTo({
					url
				})
			},
			record() {
				uni.navigateTo({
					url: './consumerecord'
				});
			},
			openewm() {
				let that = this;

				uni.scanCode({
					success: function(res) {
						// console.log('条码类型：' + res.scanType);
						that.openewmcode = res.result;
						let name = that.getUrlParams().name
						if (name == "chanjuan") {
							// that.type = that.getUrlParams().type
							that.mobile = that.getUrlParams().mobile


						} else {
							this.$api.msg(this.$t('consume.index12'));
						}

					}
				});
			},

			//截取Url字符串
			getUrlParams() {
				let that = this
				var url = that.openewmcode; //
				var theRequest = new Object();
				if (url.indexOf("&") != -1) {
					var str = url.substr(0);
					console.log(str, 'str')
					var strs = str.split("&");
					console.log(strs, 'strssssss')
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
					}
				}
				return theRequest;
			},
		}
	}

</script>

<style lang='scss'>
	page {
		background: $page-color-base;
	}

	.main {
		width: 100%;
		height: 352upx;
		background: rgba(255, 255, 255, 1);
		opacity: 1;
		margin-top: 24upx;
	}

	.main_top {
		width: 92%;
		margin: 0 4%;
		padding: 32upx 0 14upx;
		border-bottom: 1upx solid rgba(112, 112, 112, 0.1);

		input {
			border: none;
			outline: none;
			font-size: 24upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #B5B5B5;
			opacity: 1;
		}
	}

	.title {
		font-size: 32upx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #333333;
		opacity: 1;
		padding-bottom: 16upx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		image {
			width: 44upx;
			height: 44upx;
		}
	}

	.main_bottom {
		width: 92%;
		height: 140upx;
		margin: 0 4%;
		padding: 32upx 0 14upx;
		border-bottom: 1upx solid rgba(112, 112, 112, 0.1);

		input {
			border: none;
			outline: none;
			font-size: 24upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #B5B5B5;
			opacity: 1;
		}
	}

	.overnum {
		width: 92%;
		margin: 0 4%;
		font-size: 20upx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #333333;
		opacity: 1;
		margin-top: 12upx;

		text {
			margin-left: 6upx;
		}
	}

	.btn {
		width: 686upx;
		height: 88upx;
		background: #00a7eb;
		opacity: 1;
		border-radius: 22px;
		text-align: center;
		line-height: 88upx;
		font-size: 18px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 88upx;
		color: #FFFFFF;
		position: fixed;
		bottom: 72upx;
		left: 32upx;
	}

</style>

