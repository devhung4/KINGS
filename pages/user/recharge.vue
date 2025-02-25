<template>
	<view class="recharge">
		<view class="coinList">
			<picker class="pickerList" @change="bindTypeChange" :value="reIndex" :range="typeArr">
				<view class="uni-input" style="color: #4399FC;">{{ typeArr[reIndex] }}</view>
			</picker>
			<text></text>
			<text class="texta" style="color: #4399FC;">{{$t('userRecharge.index1')}}</text>
		</view>
		<view class="coinList">
			<!-- @change="bindPickerChange"  :range="typeArr"-->
			<!-- <picker class="pickerList"  :value="index" > -->
				<view class="uni-input">{{ chainType }}</view>
			<!-- </picker> -->
			<!-- <text>确权积分</text> -->
			<text>{{typeArr[reIndex] === 'MSL'? $t('userRecharge.index4') : $t('userRecharge.index2')}}</text>
		</view>
		<view class="code">
			<view class="">
				<view class="qr_code">
					<canvas canvas-id="qrcode" style="width: 150px;height: 150px;" />
					<image v-if="index == 0" :src="codeinfo.url" mode=""></image>
					<image v-else :src="codeinfo.trcAddressURL" mode=""></image>
					<!-- <canvas canvas-id="qrcode" style="width: 150px;height: 150px;" /> -->
					<image :src='imgurl' mode="" class="imgcss"></image>
				</view>
				<view class="show">{{$t('userRecharge.index3')}}</view>
			</view>
		</view>
		<view class="address">
			<text>{{ coinAddress }}</text>
			<image class="copy-h5" src="../../static/img/btn_copy1_normal.png" mode="" @click="paste(coinAddress)"></image>
		</view>
		<view class="warning"><!-- 此地址只可充值USDT，禁止此地址充值其他确权积分 --></view>
	</view>
</template>

<script>
import uQRCode from '@/common/uqrcode.js';
import Clipboard from 'clipboard';
export default {
	data() {
		return {
			imgurl:'',
			recCoin: '',
			codeinfo: {},
			index: 0,
			reIndex: 0,
			typeArr: [],
			walletList: null,
			coinAddress: null,
			chainType:'',
			usdtimg:'',
			csrimg:'',
			navTitle: this.$t('recordList.index2'),
			mslimg: '',
		};
	},
	created() {
		// this.getRechargeTWO('CSR')
	},
	async onShow() {
		uni.setNavigationBarTitle({
			title: this.navTitle
		})
		this.getRecharge();

	},
	onLoad() {
	},
	onNavigationBarButtonTap() {
		uni.navigateTo({
			url: '../recharge/relist'
		});
	},
	methods: {
		// 充值通道
		bindTypeChange: function(e) {

			let that = this;
			that.reIndex = e.target.value;
			that.recCoin =  that.typeArr[that.reIndex]

			if (that.walletList) {
				that.codeinfo = that.walletList.find(function(obj) {
					return obj.coin.name == that.recCoin;
				});
				that.chainType = that.typeArr[that.reIndex]
				that.coinAddress = that.walletList[that.reIndex].address;			
				if (that.reIndex == 1) {
					that.imgurl = that.mslimg
				}else  if(that.reIndex == 0){
					that.imgurl = that.csrimg
				}
				// else if(that.reIndex == 2){
				// 	that.imgurl = that.usdtimg
				// 	that.coinAddress = that.walletList[1].address;			
				// }
				if (that.coinAddress === '' || that.coinAddress === null) {
					that.getAddress(that.recCoin);
				}
				
				that.make(that.coinAddress);
			}
		},
		// if(that.reIndex == 1){
		// 	that.coinAddress = that.codeinfo.address;
		// }
		
		// 选择确权积分
		bindPickerChange: function(e) {
			// let that = this;
			// // console.log(e.target.value,'eeeee')
			// that.index = e.target.value;
			// that.recCoin = that.typeArr[that.index];
			// if (that.walletList) {
			// 	that.codeinfo = that.walletList.find(function(obj) {
			// 		return obj.coin.name == that.recCoin;
			// 	});
			// 	if (that.reIndex == 0) {
			// 		that.coinAddress = that.codeinfo.trcAddress;
			// 	} else if(that.reIndex == 1){
			// 		that.coinAddress = that.codeinfo.address;
			// 	}else{
			// 		that.coinAddress = that.codeinfo.address;
			// 	}
			// 	if (that.coinAddress == '' || that.coinAddress == null) {
			// 		that.getAddress(that.recCoin);
			// 	}
			// 	that.make(that.coinAddress);
			// }
		},
		async make(text) {
			// 回调方式
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
					
				}
			});
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
					that.imgurl = recharge.data.data[0].coin.img;
					// that.usdtimage = recharge.data.data[1].coin.img;
					that.csrimage = recharge.data.data[0].coin.img;
					that.mslimage = recharge.data.data[1].coin.img;
					let rechargeInfo = recharge.data.data;
					
					that.walletList = rechargeInfo;
					that.typeArr = [];
					for (var i = 0; i < rechargeInfo.length; i++) {
						if (rechargeInfo[i].coin.canRecharge == 1) {
							that.typeArr.push(rechargeInfo[i].coin.name);
						}
					}


					that.codeinfo = that.walletList[that.reIndex]
					that.recCoin = that.typeArr[that.reIndex]
					that.chainType = that.typeArr[that.reIndex]
					that.coinAddress = that.codeinfo.address;


				
					
					
				
					if (that.coinAddress == '' || that.coinAddress == null) {
						that.getAddress(that.recCoin);
					}
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
		//  async getRechargeTWO(am) {
		// 	let that = this;
		// 	try {
		// 		let recharge = await that.$request.post('/uc/asset/wallet/reset-address', {
		// 			header: {
		// 				'x-auth-token': uni.getStorageSync('token'),
		// 				'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
		// 			},
		// 			data: {
		// 				unit:am
		// 			}
		// 		});
		// 		console.log(recharge,'AAAAAA')
		// 		if (recharge.data.code == 0) {
		// 			console.log(recharge.data)
		// 		} else {
					
		// 		}
		// 	} catch (e) {
		// 		//TODO handle the exception
		// 		console.log(e);
		// 		// that.$api.msg('网络异常');
		// 	}
		// },
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
			this.getRecharge();
		},
		//复制地址
		paste(value) {
			// console.log('复制前')
			// #ifdef APP-PLUS
			uni.setClipboardData({
				data: value,
				success: function() {
					console.log('success');
				}
			});
			// #endif
			// #ifdef H5
			//这里是复制目标的类名
			let clipboard = new Clipboard('.copy-h5', {
				text: function() {
					return value;
				}
			});
			clipboard.on('success', function(e) {
				console.info('Action:', e.action);
				console.info('Text:', e.text); //复制的文本内容
				console.info('Trigger:', e.trigger); //节点
				e.clearSelection(); //清除选中的文字的选择状态
				uni.showToast({
					icon: 'success', // success / none / loading 3个有效参数
					title: '复制成功',
					duration: 2000
				});
			});

			clipboard.on('error', function(e) {
				console.error('Action:', e.action);
				console.error('Trigger:', e.trigger);
			});
			// #endif
		}
	}
};
</script>

<style lang="scss">
page {
	background: rgba(246, 246, 246, 1);
}
.coinList {
	position:relative;
	width: 90%;
	background: #fff;
	margin: 5% auto;
	display: flex;
	padding: 3% 2%;
	justify-content: space-between;
	.pickerList {
		position: absolute;
		top: 25%;
		left: 16upx;
		width: 100%;
		// background: #000;
		.texta{
			color: #007AFF !important;
		}
	}
}
.code {
	width: 90%;
	height: 722upx;
	background: rgba(255, 255, 255, 1);
	margin: 20upx auto 60upx;
	padding: 120upx ;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	
	
	.addressType {
		display: flex;
		margin: 2% 0;
	}
	.qr_code {
		border: 6px solid #00a7eb;
		text-align: center;
		// background-color: #007AFF;
		position: relative;
		width:162px;
		height:162px;
		// image {
		// 	width: 308upx;
		// 	height: 308upx;
		// }
		.imgcss{
			position: absolute;
			top: 50%;
			left: 50%;
			margin-top: -25upx;
			margin-left: -25upx;
			width: 60upx;
			height: 60upx;
		}
	}
	.show {
		margin-top: 120upx;
		font-size: 28upx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
		text-align: center;
	}
	
}
.address {
	width: 690upx;
	height: 200upx;
	background: rgba(255, 255, 255, 1);
	border-radius: 4upx;
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	text {
		width: 80%;
		font-size: 26upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		word-wrap:break-word;
		color: rgba(64, 67, 72, 1);
		margin-right: 26upx;
	}
	image {
		width: 28upx;
		height: 28upx;
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
