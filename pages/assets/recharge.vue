<template>
	<view class="recharge">
		<view class="each">
			<view class="title">
				<image src="../../static/img/icon_3.png"></image>
				<view>{{$t('recharge.index1')}}</view>
			</view>
			<view class="coinList">
				<picker class="pickerList" @change="bindTypeChange" :value="reIndex" :range="rechargeType"
					:range-key="'coinName'">
					<view class="uni-input" style="color: #4399FC;">{{rechargeType[reIndex].coinName}}</view>
				</picker>
				<text></text>
				<text class="texta" style="color: #4399FC;">{{$t('recharge.index2')}}</text>
			</view>
			<view @click="record" class="btnName">{{$t('recharge.index10')}}</view>
		</view>

		<view class="each">
			<view class="title">
				<image src="../../static/img/icon_4.png"></image>
				<view>{{$t('recharge.index3')}}</view>
			</view>
			<view class="passList">
				<view v-if="active" class="pass">{{passName}}</view>
				<view @click="choose(item)" v-else :class="item.active? 'pass' : 'pass2'"
					v-for="(item,index) in passList" :key="index">{{item.name}}</view>

				<!-- @change="bindPickerChange"  :range="typeArr"-->
				<!-- <picker class="pickerList"  :value="index" > -->
				<!-- <view class="uni-input">{{ cointype }}</view> -->
				<!-- </picker> -->
				<!-- <text>确权积分</text> -->
				<!-- <text>婵娟积分</text> -->
			</view>
		</view>

		<view class="code">
			<view class="code_son">
				<view class="qr_code">
					<canvas canvas-id="qrcode" style="width: 150px;height: 150px;" />
					<!-- <image v-if="index == 0" :src="codeinfo.url" mode=""></image> -->
					<!-- <image v-else :src="codeinfo.trcAddressURL" mode=""></image> -->
					<!-- <canvas canvas-id="qrcode" style="width: 150px;height: 150px;" /> -->
					<image :src='imgurl' mode="" class="imgcss"></image>
				</view>
				<view class="keep" @click.stop="sevefn">
					<image src="../../static/img/keep_1.png"></image>
					<view>{{$t('recharge.index4')}}</view>
				</view>
			</view>
		</view>
		<view class="address_box">
			<view class="address">
				<view class="title">{{$t('recharge.index5')}}</view>
				<view class="coinAddress">{{ copyAddress }}</view>
				<view class="copy" @click="paste(copyAddress)">{{$t('recharge.index6')}}</view>
				<!-- <image class="copy-h5" src="../../static/img/btn_copy1_normal.png" mode=""></image> -->
			</view>
			<view class="warning">
				<!-- 此地址只可充值USDT，禁止此地址充值其他确权积分 -->
			</view>
		</view>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js';
	import Clipboard from 'clipboard';
	export default {
		data() {
			return {
				imgurl: '',
				recCoin: 'USDT',
				codeinfo: {},
				index: 0,
				reIndex: 0,
				rechargeType: [{
					coinName: ''
				}],
				typeArr: [],
				walletList: [],
				coinAddress: '',
				cointype: 'CSR',
				usdtimg: '',
				csrimg: '',
				address: '',
				passList: [{
						name: '',
						address: '',
						active: true
					},
					{
						name: '',
						address: '',
						active: false
					},
				],
				passName: '',
				active: true,
				codeImg: '',
				copyAddress: '',
				navTitle: this.$t('pageName.index4'),

			};
		},
		created() {
			// this.getRechargeTWO('CSR')
		},
		async onShow() {
			uni.setNavigationBarTitle({
				title: this.navTitle
			});
			this.getRecharge();
		},
		onLoad() {
			
		},
		
		methods: {
			// 充值通道
			bindTypeChange: function(e) {
				console.log(e)
				let _this = this
				_this.reIndex = e.target.value;
				let coinName = _this.rechargeType[_this.reIndex].coinName
				if (coinName != 'USDT') {
					_this.passName = coinName
					_this.make(_this.rechargeType[_this.reIndex].address)
					_this.copyAddress = _this.rechargeType[_this.reIndex].address
					_this.active = true
				} else {
					_this.passList[0].name = 'ERC20'
					_this.passList[1].name = 'TRC20'
					_this.passList[0].address = _this.rechargeType[_this.reIndex].address
					_this.passList[1].address = _this.rechargeType[_this.reIndex].trcAddress
					_this.active = false
					_this.make(_this.rechargeType[_this.reIndex].address)
					_this.copyAddress = _this.rechargeType[_this.reIndex].address
				}
				_this.imgurl = _this.rechargeType[_this.reIndex].coin.img



				// if(_this.rechargeType[_this.reIndex].address != '' && _this.rechargeType[_this.reIndex].address != null){
				// 	_this.address = _this.rechargeType[_this.reIndex].address
				// 	_this.make(_this.address)
				// }else{

				// }



				// if (that.walletList) {
				// 	that.codeinfo = that.walletList.find(function(obj) {
				// 		return obj.coin.name == that.recCoin;
				// 	});


				// 	if (that.reIndex == 1) {
				// 		that.cointype = that.typeArr[1]
				// 		that.coinAddress = that.codeinfo.trcAddress;
				// 		that.imgurl = that.usdtimg
				// 	}else  if(that.reIndex == 0){

				// 		that.cointype = that.typeArr[0]
				// 		that.coinAddress = that.walletList[0].address;
				// 		that.imgurl = that.csrimg

				// 	}else  if(that.reIndex == 2){
				// 		that.imgurl = that.usdtimg
				// 		that.cointype = that.typeArr[1]
				// 		that.coinAddress = that.walletList[1].address;			
				// 	}

				// 	that.make(that.coinAddress);
				// }
			},
			// if(that.reIndex == 1){
			// 	that.cointype = that.typeArr[1]
			// 	that.coinAddress = that.codeinfo.address;
			// }

			// 选择确权积分
			bindPickerChange: function(e) {
				let that = this;
				// console.log(e.target.value,'eeeee')
				that.index = e.target.value;
				that.recCoin = that.typeArr[that.index];
				if (that.walletList) {
					that.codeinfo = that.walletList.find(function(obj) {
						return obj.coin.name == that.recCoin;
					});
					if (that.reIndex == 0) {
						that.coinAddress = that.codeinfo.trcAddress;
					} else if (that.reIndex == 1) {
						that.coinAddress = that.codeinfo.address;
					} else {
						that.coinAddress = that.codeinfo.address;
					}
					if (that.coinAddress == '' || that.coinAddress == null) {
						that.getAddress(that.recCoin);
					}
					that.make(that.coinAddress);
				}
			},
			async make(text) {
				let _this = this
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: text,
					size: 150,
					margin: 10,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					errorCorrectLevel: uQRCode.errorCorrectLevel.H,
					success: res => {
						uni.canvasToTempFilePath({
							canvasId: 'qrcode',
							quality: 1,
							success: (ret) => {
								// console.log(ret)
								_this.codeimage = ret.tempFilePath.replace(/[\r\n]/g,'');
							}
						})
					}
				});
				// 回调方式
			},



			//获取充币信息
			async getRecharge() {
				let that = this;
				try {
					let recharge = await that.$request.post('/uc/asset/wallet', {
						header: {
							'x-auth-token': uni.getStorageSync('token'),
							'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
						},
						data: {}
					});
					if (recharge.data.code == 0) {
						// this.rechargeType.push(recharge.data.data)
						this.rechargeType = recharge.data.data
						this.imgurl = this.rechargeType[0].coin.img
						//USDT 有两条通道 这里判断数据第一条是否是USDT
						if (this.rechargeType[0].coinName != 'USDT') {
							this.passName = this.rechargeType[0].coinName
							this.make(this.rechargeType[0].address)
							this.copyAddress = this.rechargeType[0].address
						}
						// 判断数据中是否有地址为空 为空 调接口获取
						for(let i in this.rechargeType){
							if(this.rechargeType[i].address == '' || this.rechargeType[i].address == null){
								this.getAddress(this.rechargeType[i].coinName)
							}
							if(this.rechargeType[i].coinName == 'USDT'){
								if(this.rechargeType[i].trcAddress == '' || this.rechargeType[i].address == null){
									this.getAddress(this.rechargeType[i].coinName)
								}
							}
						}
						
						
						

						// console.log(recharge.data.data[1].coin.img,'------图片-----');
						// that.imgurl = recharge.data.data[0].coin.img;
						// that.usdtimage = recharge.data.data[1].coin.img;
						// that.csrimage = recharge.data.data[0].coin.img;
						// let rechargeInfo = recharge.data.data;

						// that.walletList = rechargeInfo;
						// that.typeArr = [];
						// for (var i = 0; i < rechargeInfo.length; i++) {
						// 	if (rechargeInfo[i].coin.canRecharge == 1) {
						// 		that.typeArr.push(rechargeInfo[i].coin.name);
						// 	}
						// }

						// that.codeinfo = that.walletList.find(function(obj) {

						// 	return obj.coin.name == that.recCoin;
						// });

						if (that.reIndex == 0) {
							that.coinAddress = rechargeInfo[0].address;
						} else {
							that.coinAddress = that.codeinfo.address;
						}



						// if (that.coinAddress == '' || that.coinAddress == null) {
						// 	// that.getAddress(that.recCoin);
						// }
						console.log(that.coinAddress, '123')
						that.make(that.coinAddress);
					} else {
						that.$api.msg(recharge.data.message);
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
					//TODO handle the exception
					console.log(e);
					// that.$api.msg('网络异常');
				}
			},

			//获取
			async getRechargeTWO(am) {
				let that = this;
				try {
					let recharge = await that.$request.post('/uc/asset/wallet/reset-address', {
						header: {
							'x-auth-token': uni.getStorageSync('token'),
							'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
						},
						data: {
							unit: am
						}
					});
					console.log(recharge, 'AAAAAA')
					if (recharge.data.code == 0) {
						console.log(recharge.data.data)

					} else {

					}
				} catch (e) {
					//TODO handle the exception
					console.log(e);
					// that.$api.msg('网络异常');
				}
			},


			// 重新生成地址
			async getAddress(unit) {
				let recharge = await this.$request.post('/uc/asset/wallet/reset-address', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {
						unit: unit
					}
				});
				if(recharge.data.code == 0){
					this.getRecharge();
				}else{
					this.$api.msg(unit+'地址获取失败')
				}
			},


			//复制地址
			paste(value) {
				uni.setClipboardData({
					data: value,
					success: function() {}
				});
			},

			sevefn() {
				uni.showLoading()
				let _this = this
				console.log(_this.codeImg)
				uni.saveImageToPhotosAlbum({
					filePath: _this.codeImg,
					success: (res) => {
						uni.hideLoading()
						this.$api.msg(this.$t('recharge.index8'))
					},
					fail: (res) => {
						uni.hideLoading()
						this.$api.msg(this.$t('recharge.index9'))
					}
				})


			},
			choose(item) {
				for (let i = 0; i < this.passList.length; i++) {
					this.passList[i].active = false
				}
				item.active = true
				this.make(item.address)
				this.copyAddress = item.address
			},
			record(){
				uni.navigateTo({
					url: './rechargeRecord'
				});
			},
		}
	};
</script>

<style lang="scss">
	page {
		// background: rgba(246, 246, 246, 1);
	}

	.each {
		padding: 0 32rpx;
		box-sizing: border-box;
		margin-top: 36rpx;
		position: relative;
	}

	.title {
		display: flex;
		align-items: center;

		image {
			width: 40rpx;
			height: 40rpx;
		}

		view {
			font-size: 28rpx;
			font-weight: 600;
			margin-left: 8rpx;
		}
	}

	.coinList {
		position: relative;
		background: #fff;
		display: flex;
		padding: 3% 2%;
		box-sizing: border-box;
		justify-content: space-between;
		border: 1px solid #E0E0E0;
		border-radius: 6px;
		margin-top: 20rpx;

		.pickerList {
			position: absolute;
			top: 25%;
			left: 16upx;
			width: 100%;

			// background: #000;
			.texta {
				color: #007AFF;
			}
		}

	}
	.btnName{
		position: absolute;
		right: 32rpx;
		top: 0;
		font-size: 28rpx;
		color: rgb(67, 153, 252);
	}

	.passList {
		position: relative;
		background: #fff;
		display: flex;
		box-sizing: border-box;
		border-radius: 6px;
		margin-top: 20rpx;

		.pass,
		.pass2 {
			width: 164rpx;
			height: 64rpx;
			border-radius: 6rpx;
			border: 1px solid #00a7eb;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 40rpx;
			color: #00a7eb;
		}

		.pass2 {
			border: 1px solid #E0E0E0;
			color: #333;
		}
	}

	.code {
		width: 100%;
		padding: 0 32rpx;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 1);
		margin-top: 32rpx;

		.code_son {
			padding: 45upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: #F6F6F6;
			border-radius: 20rpx 20rpx 0 0;
		}


		.addressType {
			display: flex;
			margin: 2% 0;
		}

		.qr_code {
			border: 6px solid #00a7eb;
			text-align: center;
			// background-color: #007AFF;
			position: relative;
			width: 162px;
			height: 162px;

			image {
				width: 308upx;
				height: 308upx;
			}

			.imgcss {
				position: absolute;
				top: 50%;
				left: 50%;
				margin-top: -25upx;
				margin-left: -25upx;
				width: 60upx;
				height: 60upx;
			}
		}

		.keep {
			margin-top: 40upx;
			width: 200rpx;
			height: 64rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid #00a7eb;
			border-radius: 10rpx;

			image {
				width: 24rpx;
				height: 24rpx;
			}

			view {
				font-size: 24rpx;
				color: #00a7eb;
				margin-left: 12rpx;
			}
		}

	}

	.address_box {
		padding: 0 32rpx;
		box-sizing: border-box;

		.address {
			// height: 200upx;
			padding: 44rpx 32rpx 32rpx;
			box-sizing: border-box;
			background-color: #F6F6F6;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			border-top: 2px solid #E0E0E0;
			border-radius: 0 0 20rpx 20rpx;

			.title {
				font-size: 28rpx;
				color: #999999;
				font-weight: 600;
			}

			.coinAddress {
				width: 80%;
				font-size: 28upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				word-wrap: break-word;
				color: #333;
				text-align: center;
				margin-top: 16rpx;
			}

			.copy {
				width: 200rpx;
				height: 64rpx;
				background-color: #00a7eb;
				color: #fff;
				font-size: 24rpx;
				font-weight: 600;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 10rpx;
				margin-top: 40rpx;
			}
		}
	}


	.warning {
		font-size: 22upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #ffca4d;
		text-align: center;
		margin-top: 20upx;
	}
</style>
