<template>
	<view class="extract">
		<view class="extract_list">
			<view class="extract_num">
				<!-- <text>选择确权积分</text> -->
				<view class="title">
					<image src="../../static/img/icon_3.png"></image>
					<view>{{$t('withdrawalRecord.index1')}}</view>
				</view>
				<view class="coinList">
					<picker class="picker" @change="bindPickerChange" :value="index" :range="typevar"
						:range-key="'coinName'">
						<view class="uni-input">{{ typevar[index].coinName }}</view>
					</picker>
					<image src="../../static/img/icon_5.png"></image>
				</view>
				<view @click="record" class="btnName">{{$t('withdrawalRecord.index16')}}</view>

			</view>
			<view class="extract_num">
				<view class="title">
					<image src="../../static/img/icon_4.png"></image>
					<view>{{$t('withdrawalRecord.index2')}}</view>
				</view>
				<view class="passList">
					<view v-if="active" class="pass">{{passName}}</view>
					<view @click="choose(item)" v-else :class="item.active? 'pass' : 'pass2'"
						v-for="(item,index) in passList" :key="index">{{item.name}}</view>

				</view>

			</view>
		</view>
		<view class="extract_list">
			<view class="extract_num">
				<!-- <text>提取数量</text> -->
				<view class="title">
					<image src="../../static/img/icon_7.png"></image>
					<view>{{$t('withdrawalRecord.index3')}}</view>
				</view>
				<view class="num_input">
					<!-- <input type="text" v-model="num" placeholder="请输入提取数量" /> -->
					<input style="width:90%;" type="text" value="" v-model="address"
						:placeholder="$t('withdrawalRecord.index15')" />
					<!-- <view class="whole" @click="extractall()">全部提取</view> -->
					<!-- <view class="whole" @click="extractall()">全部支付</view> -->
					<!-- <image src="../../static/img/icon_8.png"></image> -->
				</view>
			</view>



			<view class="extract_num">
				<!-- <text>提确权积分地址</text> -->
				<!-- <text>对方收积分地址</text> -->
				<view class="title">
					<image src="../../static/img/icon_9.png"></image>
					<view>{{$t('withdrawalRecord.index4')}}</view>
				</view>
				<view class="num_input">
					<!-- <input style="width:90%;" type="text" value="" v-model="address" placeholder="请输入提确权积分地址" /> -->
					<input @input="changeinp()" type="text" v-model="num"
						:placeholder="$t('withdrawalRecord.index5')" />

					<view class="wholeText" @click="extractall()">{{$t('withdrawalRecord.index6')}}</view>
					<!-- #ifndef H5 -->
					<view class="whole" @click="openewm">
						<image src="../../static/img/btn_scan_normal.png" mode=""></image>
					</view>
					<!-- #endif -->
				</view>
			</view>
			<view class="balance_box">
				<view class="balance">{{$t('withdrawalRecord.index7')}}{{ balance }}{{ sysmbol }}</view>
				<view class="balance">
					{{$t('withdrawalRecord.index8')}}{{ num == 0 ? 0 :num - charge - fee }}{{ sysmbol }}</view>
			</view>
		</view>
		<view class="extract_list">
			<view class="extract_num">
				<view class="title">
					<image src="../../static/img/icon_10.png"></image>
					<view>{{$t('withdrawalRecord.index9')}}</view>
				</view>
				<view class="num_input"><input type="password" value="" v-model="jyPassword"
						:placeholder="$t('withdrawalRecord.index10')" /></view>
			</view>
			<view class="extract_num">
				<view class="title">
					<image src="../../static/img/icon_11.png"></image>
					<view>{{$t('withdrawalRecord.index11')}}</view>
				</view>
				<view class="num_input">
					<input type="text" value="" v-model="code" :placeholder="$t('withdrawalRecord.index12')" />
					<view v-show='!btncode' class="whole" @click="getcode()">{{ text }}</view>
					<view v-show='btncode' class="whole">{{ text }}</view>
				</view>
			</view>
			<view class="extract_num">
				<view class="title">
					<image src="../../static/img/icon_12.png"></image>
					<view>{{$t('withdrawalRecord.index13')}}</view>
				</view>
				<view class="num_input"><input type="text" disabled="diabled" value="" v-model="fee"
						placeholder="0.00" /></view>
			</view>
			<!-- <view class="extract_num">
				<text>备注</text>
				<view class="num_input"><input type="text" value="" v-model="remark" placeholder="请输入备注" /></view>
			</view> -->
			<!-- <button class="confirm" :disabled="btndisabl" @click="payment()">确认提取</button> -->
		</view>
		<view class="btn">
			<button class="confirm" :disabled="btndisabl" @click="payment()">{{$t('withdrawalRecord.index14')}}</button>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				navTitle: this.$t('assets.index4'),
				typevar: [{
					coinName: ''
				}],
				btndisabl: false,
				btncode: false,
				uid: '',
				balance: 0,
				num: '',
				charge: '',
				text: this.$t('forgetpsd.index10'),
				exIndex: 0,
				extractioninfo: {},
				index: 0,
				typeArr: [],
				sysmbol: '',
				sysmbolInfo: {},
				extractList: [],
				jyPassword: '',
				fee: 0,
				address: '',
				remark: '',
				code: '',
				uType: 10,
				extractType: ['TRC20', 'ERC20', 'CSR'],
				phone: '',
				email: '',
				passName: '',
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
				active: true,
				//最小提币值
				minWithdrawAmount: '',
				//最大提币值
				maxWithdrawAmount: '',
				//最小提币手续费
				minTxFee: '',
				//最大提币手续费
				maxTxFee: '',
				//手续费比例
				withdrawFeeRate: '',
			};
		},
		created() {},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.navTitle
			});
		},
		onLoad() {
			//用户id
			var userInfo = uni.getStorageSync('userInfo');
			this.uid = userInfo.userId;
			this.phone = userInfo.mobile;
			this.email = userInfo.email;
			// console.log(this.phone,this.email,'1')
			// this.getfee()
			this.getExtract();
		},
		methods: {
			// 选择确权积分
			bindPickerChange: function(e) {
				let _this = this;
				_this.index = e.target.value;
				let coinName = _this.typevar[_this.index].coinName
				_this.sysmbol = coinName
				if (coinName != 'USDT') {
					_this.passName = coinName
					_this.active = true
					_this.uType = 10
				} else {
					_this.passList[0].name = 'ERC20'
					_this.passList[1].name = 'TRC20'
					_this.active = false
					_this.uType = 0
				}
				//获取该币种最大和最小提币数
				_this.minWithdrawAmount = _this.typevar[_this.index].coin.minWithdrawAmount
				_this.maxWithdrawAmount = _this.typevar[_this.index].coin.maxWithdrawAmount
				//获取该币种最大和最小提币手续费
				_this.minTxFee = _this.typevar[_this.index].coin.minTxFee
				_this.maxTxFee = _this.typevar[_this.index].coin.maxTxFee
				_this.withdrawFeeRate = _this.typevar[_this.index].coin.withdrawFeeRate


				// that.sysmbol = that.typeArr[that.index];
				// if (_this.extractList) {
				// 	_this.sysmbolInfo = _this.extractList.find(function(obj) {
				// 		return obj.coin.name == _this.sysmbol;
				// 	});
				// }
				// _this.charge = _this.sysmbolInfo.coin.minTxFee;
				_this.balance = _this.typevar[_this.index].balance
				// this.coinChange()
			},
			// 选择通道
			bindPickerExtract: function(e) {

				let that = this;
				that.exIndex = e.target.value;
				let side = that.extractType[that.exIndex]
				if (side == "TRC20") {
					that.uType = 2;
				} else if (side == "ERC20") {
					that.uType = 0;
				} else if (side == "CSR") {
					that.uType = 10;
				}



			},
			//监听币钟数量 计算手续费
			changeinp() {
				this.fee = this.num * this.withdrawFeeRate
				if (this.fee < this.minTxFee) {
					this.fee = this.minTxFee
				} else if (this.fee > this.maxTxFee) {
					this.fee = this.maxTxFee
				}
				console.log(this.fee)
			},


			coinChange: function() {
				this.exIndex = 0;
				if (this.sysmbol == "CSR") {
					this.extractType = ["CSR"]
				} else {
					this.extractType = ["ERC20", "TRC20"]
				}
				let side = this.extractType[this.exIndex]
				if (side == "TRC20") {
					this.uType = 2;
				} else if (side == "ERC20") {
					this.uType = 0;
				} else if (side == "CSR") {
					this.uType = 10;
				}
			},
			openewm() {
				let that = this;
				uni.scanCode({
					success: function(res) {
						// console.log('条码类型：' + res.scanType);
						that.address = res.result;
						// console.log('条码内容：' + res.result);
					}
				});
			},
			//全部提取
			extractall() {
				this.num = this.balance;
			},
			//获取提确权积分信息
			async getExtract() {
				let that = this;
				try {
					let extract = await that.$request.post('/uc/asset/wallet', {
						header: {
							'x-auth-token': uni.getStorageSync('token'),
							'Accept-Language': uni.getStorageSync('locale') ? uni.getStorageSync('locale') :
								'en-US,en'
						},
						data: {}
					});
					if (extract.data.code == 0) {
						this.typevar = extract.data.data
						//获取第一条最大和最小提币数
						this.minWithdrawAmount = this.typevar[0].coin.minWithdrawAmount
						this.maxWithdrawAmount = this.typevar[0].coin.maxWithdrawAmount
						//获取第一条最大和最小提币手续费
						this.minTxFee = this.typevar[0].coin.minTxFee
						this.maxTxFee = this.typevar[0].coin.maxTxFee

						this.withdrawFeeRate = this.typevar[0].coin.withdrawFeeRate

						if (this.typevar[0].coinName != 'USDT') {
							this.passName = this.typevar[0].coinName
							this.sysmbol = this.typevar[0].coinName
							this.balance = this.typevar[0].balance
						}

						// let extractInfo = extract.data.data;
						// that.extractList = extractInfo;
						// that.typeArr=[];
						// for (var i = 0; i < extractInfo.length; i++) {
						// 	that.typeArr.push(extractInfo[i].coin.name);

						// }
						// that.typevar.push(that.typeArr[0])
						// console.log(that.typevar)
						// that.sysmbol = that.typeArr[0]

						// if (that.extractList) {
						// 	that.sysmbolInfo = that.extractList.find(function(obj) {
						// 		return obj.coin.name == that.sysmbol;
						// 	});
						// }
						// that.charge = that.sysmbolInfo.coin.minTxFee;
						// that.balance = that.sysmbolInfo.balance;
						// this.coinChange();
					} else {
						that.$api.msg(extract.data.message);
						uni.setStorageSync("hasLogin", false);
						uni.setStorageSync("userInfo", "");
						// uni.clearStorageSync();
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/public/login'
							})
						}, 200);
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e);
					// that.$api.msg('网络异常');
				}

			},
			//提确权积分申请
			async getextraction() {
				let that = this;
				try {

					// if(that.sysmbol=='USDT'&&that.num<10){
					// 	that.$api.msg('USDT提确权积分数量大于10');
					// 	return
					// }
					// if(that.sysmbol=='CSR'&&that.num<0.1){
					// 	that.$api.msg('CSR提确权积分数量大于0.1');
					// 	return
					// }
					that.$data.btndisabl = true;
					let extraction = await that.$request.post('/uc/withdraw/apply', {
						header: {
							'x-auth-token': uni.getStorageSync('token'),
							'Accept-Language': uni.getStorageSync('locale') ? uni.getStorageSync('locale') :
								'en-US,en'
						},
						data: {
							jyPassword: that.jyPassword,
							unit: that.sysmbol,
							amount: that.num,
							fee: that.fee,
							address: that.address,
							remark: that.remark,
							code: that.code,
							uType: that.uType,
							googleCode: ''
						}
					});
					if (extraction.data.code == 0) {
						that.extractioninfo = extraction.data.data;
						that.$api.msg(extraction.data.message);
						that.$data.btndisabl = false;
						that.jyPassword = '';
						that.num = '';
						that.address = '';
						that.remark = '';
						that.code = '';
					} else if (extraction.data.message == '资金密码未设置' || extraction.data.message ==
						'Fund password not set') {
						that.$api.msg(extraction.data.message);
						that.$data.btndisabl = false;
						uni.navigateTo({
							url: '/pages/public/resetpaypsd'
						});
					} else {
						that.$api.msg(extraction.data.message);
						that.$data.btndisabl = false;
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e)
					// that.$api.msg('网络异常');
				}

			},
			//获取验证码
			async getcode() {
				let that = this;
				that.$data.btncode = true;
				let counter = 60;
				let timer = setInterval(() => {
					that.$data.text = counter + 's';
					counter--;
					if (counter == -1) {
						clearInterval(timer);
						that.$data.text = this.$t('forgetpsd.index10');
						that.$data.btncode = false;
					}
				}, 1000);
				let address = '';
				// if (!that.email){
				// 	address = '/uc/mobile/withdraw/code'
				// }else{

				// }
				let resultdata = await that.$request.post('/uc/mobile/withdraw/code', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale') ? uni.getStorageSync('locale') :
							'en-US,en'
					},
					data: {}
				});
				if (resultdata.data.code == 0) {
					that.$api.msg(this.$t('findpsd.index9'));
				} else {
					that.$api.msg(resultdata.data.message);
					that.$data.btncode = false;
				}
			},
			//提交
			payment() {
				if (this.address == '') {
					this.$api.msg(this.$t('withdrawalRecord.index27'))
					return;
				} else if (this.num == '') {
					this.$api.msg(this.$t('withdrawalRecord.index28'))
					return;
				} else if (this.num < this.minWithdrawAmount) {
					this.$api.msg(this.$t('withdrawalRecord.index29'))
					return;
				} else if (this.num > this.maxWithdrawAmount) {
					console.log(this.maxWithdrawAmount)
					this.$api.msg(this.$t('withdrawalRecord.index30'))
					return;
				} else if (this.num > this.balance) {
					this.$api.msg(this.$t('withdrawalRecord.index31'))
					return;
				} else if (this.code == '') {
					this.$api.msg(this.$t('withdrawalRecord.index32'))
					return;
				} else if (this.jyPassword == '') {
					this.$api.msg(this.$t('withdrawalRecord.index33'))
					return;
				} else {
					this.getextraction();
				}
			},
			choose(item) {
				for (let i = 0; i < this.passList.length; i++) {
					this.passList[i].active = false
				}
				item.active = true
				this.sysmbol = 'USDT'
				if (item.name == 'TRC20') {
					this.uType = 2;
				} else {
					this.uType = 0;
				}
			},
			record() {
				uni.navigateTo({
					url: './carryRecord',
				});
			},
		}
	};
</script>

<style lang="scss">
	page {
		background: #F6F6F6;
	}
	.extract{
		margin-bottom: 100px;
	}

	.extract_list {
		padding: 0 30upx 32upx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		background-color: #fff;

		.extract_num {
			padding: 32upx 0 4upx 0;
			box-sizing: border-box;
			// border-bottom: 1px solid #e8e8e8;
			color: rgba(51, 51, 51, 1);
			font-size: 28upx;
			position: relative;

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
				height: 86rpx;
				padding: 0 24rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border: 1px solid #E0E0E0;
				border-radius: 6rpx;
				margin-top: 20rpx;

				.picker {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: space-between;

				}

				image {
					width: 32rpx;
					height: 32rpx;
				}

			}

			.btnName {
				position: absolute;
				right: 0;
				top: 32rpx;
				font-size: 28rpx;
				color: rgb(67, 153, 252);
			}

			.passList {
				margin-top: 20rpx;
				display: flex;
				align-items: center;

				.pass,
				.pass2 {
					width: 164rpx;
					height: 64rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 1px solid #00a7eb;
					border-radius: 6rpx;
					margin-right: 40rpx;
					color: #00a7eb;
				}

				.pass2 {
					border: 1px solid #E0E0E0;
					color: #333;
				}
			}

			text {
				font-size: 32upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
			}

			.num_input {
				margin-top: 12upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #F2F2F2;
				padding: 16rpx 0;
				box-sizing: border-box;

				image {
					width: 38rpx;
					height: 38rpx;
				}

				.wholeText {
					color: #00a7eb;
				}

				.whole {
					font-size: 28upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #00a7eb;

					image {
						width: 30upx;
						height: 30upx;
					}
				}
			}
		}

		.balance_box {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.balance {
				font-size: 24upx;
				color: #333;
			}
		}
	}

	.btn {
		width: 100vw;
		position: fixed;
		padding: 0 32rpx;
		box-sizing: border-box;
		left: 0;
		bottom: 75rpx;

		.confirm {
			height: 88upx;
			background: #00a7eb;
			border-radius: 4upx;
			font-size: 36upx;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			border-radius: 44rpx;
		}
	}


	.input-placeholder {
		color: rgba(153, 153, 153, 1);
	}
</style>
