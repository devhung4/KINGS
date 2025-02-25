<template>
	<view class="interturn">
		<view class="extract_list">
			<view class="extract_num">
				<view class="available">
					<text>转账数量</text>
					<text class="available_num">当前可用数量:{{balance}}个</text>
				</view>
				
				<view class="num_input">
					<input type="text" v-model="num" value="" placeholder="请输入转账数量" @input="onInput" />
				</view>
			</view>
			<view class="extract_num">
				<text>收款账号</text>
				<view class="num_input">
					<input type="text" v-model="account" value="" placeholder="请输入收款账号" />
				</view>
			</view>
			<view class="extract_num">
				<text>手机号</text>
				<view class="num_input">
					<input type="text" v-model="phone" value="" placeholder="请输入手机号" />

				</view>
			</view>
			<view class="extract_num">
				<text>验证码</text>
				<view class="num_input">
					<input type="text" v-model="code" value="" placeholder="请输入验证码" />
					<view class="whole" @click="getcode()">
						{{text}}
					</view>
				</view>
			</view>
			<view class="extract_num">
				<text>支付密码</text>
				<view class="num_input">
					<input type="text" v-model="paypwd" value="" placeholder="请输入支付密码" />
			
				</view>
			</view>
			<view class="extract_num">
				<text>备注</text>
				<view class="num_input">
					<input type="text" v-model="remarks" value="" placeholder="请输入备注" />
			
				</view>
			</view>
			
			<view class="extract_num">
				<text>手续费</text>
				<view class="num_input">
					<input type="text" v-model="charge" value="" placeholder="0.00" />
				</view>
			</view>
			
			<view class="confirm" @click="payment">
				确认提取
			</view>
		</view>
	</view>
</template>

<script>
	import md5 from "../../common/md5.js"
	export default {
		 data() {
					return {
							uid:'',
							balance:0,
							fee:0,
							extractioninfo:{},
							num:'',
							account :'',
							phone:'',
							code:'',
							paypwd:'',
							remarks:'',
							charge:'',
							text:'获取验证码'
							
							
					}
			},
			created() {
				
			},
			onLoad() {
				var userInfo = uni.getStorageSync("userInfo");
				this.uid = userInfo.userId;
				this.getfee()
			},
			methods: {
				onNavigationBarButtonTap(e) {
					uni.navigateTo({
						url:'./notes'
					})
				},
				//获取输入的提取数量
				onInput(e) {
					// 【不用v-model绑定表单,直接时间获取值】这种方式是uni-app官方的方式,测试结果正确！
					this.num = e.detail.value;
					this.charge = this.num * this.fee
					console.log(this.num)
				},
				//获取手续费利率
				async getfee() {
					let fee = await this.$request.post('/lanhan/user/withdrawConfig', {
				
						"data": {
							"uid": this.uid,
							"type": 2
						}
					});
					this.exinfo = fee.data.data;
					this.fee = this.exinfo.fee;
					this.balance = this.exinfo.balance
					console.log(this.exinfo)
				},
				//金丹互转
				async getextraction() {
					let extraction = await this.$request.post('/transfer/save', {
				
						"data": {
							 "base": {
							        "appId": "001",
							        "channels": "001",
							        "ver": "1.1.5",
							        "clientVer": "1.0",
							        "apn": "wifi",
							        "deviceId": "1233eedds2112",
							        "uid": "",
							        "valat": 22.332112,
							        "lalong": 12.332112,
							        "platform": "IOS",
							        "platformVer": "8",
							        "resolution":"960*640",
							        "deviceType":"P6",
							        "carrier":"china mobile",
							        "city":"合肥",
							        "brand": "huawei"
							    },
							    "param": {
							        "payerId": this.uid,
							        "payeeAccount": this.account,
							        "paymentPassword": md5(this.paypwd),
							        "transferAmount": this.num,
							        "mobile": this.phone,
							        "validCode": this.code,
							        "remarks": this.remarks
							    }
				
						}
					});
					if(extraction.data.base.code == '000000') {
						this.extractioninfo = extraction.data.data;
						console.log(this.extractioninfo)
						this.$api.msg(extraction.data.base.msg)
					}else {
						this.$api.msg(extraction.data.base.msg)
					}
					
				},
				//获取验证码
				async getcode() {
					let that = this;
					if (that.phone == "") {
						that.$api.msg('请填写手机号');
						return;
					} else {
						that.$data.btndisabl = true;
						let resultdata = await that.$request.post('/user/queryValidCode', {
							data: {
								"base": {
									"appId": "001",
									"channels": "001",
									"ver": "1.1.5",
									"clientVer": "1.0",
									"apn": "wifi",
									"deviceId": "1233eedds2112",
									"uid": "12332112",
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
									"phone": this.phone,
									"type": 'transfer',
								}
							}
						});
				
						if (resultdata.data.base.code == "000000") {
							that.$api.msg("验证码已发送，请注意查收");
							let counter = 60;
							let timer = setInterval(() => {
								that.$data.text = counter + 's';
								counter--;
								if (counter == -1) {
									clearInterval(timer);
									that.$data.text = "获取验证码";
								}
							}, 1000);
							that.$data.btndisabl = false;
						} else {
							that.$api.msg(resultdata.data.base.msg);
							that.$data.btndisabl = false;
						}
					}
				},
				//提交
				payment() {
					if (this.num == '') {
						uni.showToast({
							title: '请输入提取数量',
							duration: 1000,
							icon: 'none'
						});
					} else if (this.account == '') {
						uni.showToast({
							title: '请输入收款账号',
							duration: 1000,
							icon: 'none'
						});
					} else if (this.phone == '') {
						uni.showToast({
							title: '请输入手机号',
							duration: 1000,
							icon: 'none'
						});
					} else if (this.code == '') {
						uni.showToast({
							title: '请输入验证码',
							duration: 1000,
							icon: 'none'
						});
					} else if (this.paypwd == '') {
						uni.showToast({
							title: '请输入支付密码',
							duration: 1000,
							icon: 'none'
						});
					} else { 
						this.getextraction();
				
					}
				
				}
			}
	}
</script>

<style lang='scss'>
	page {
		background: #FFFFFF;
	}
	.extract_list {
		padding: 0 30upx;
		box-sizing: border-box;
		margin-bottom: 40upx;
		.extract_num {
			padding: 32upx 0 30upx 0;
			box-sizing: border-box;
			border-bottom: 1px solid #e8e8e8;
			color:rgba(51,51,51,1);
			font-size:32upx;
			text {
				font-size:24upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
			}
			.num_input {
				margin-top: 12upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.whole {
					font-size:28upx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(232,65,112,1);
					
					image {
						width: 30upx;
						height: 30upx;
					}
				}
			}
		}
	}
	.confirm {
		width:630upx;
		height:88upx;
		background:rgba(232,65,112,1);
		border-radius:4upx;
		margin: 80upx auto 0;
		font-size:36upx;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color:rgba(255,255,255,1);
		line-height:88upx;
		text-align: center;
	}
	.input-placeholder {
		color:rgba(153,153,153,1);
	}
	.available {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.available_num{
			color:rgba(153,153,153,1) !important;
		}
	}
</style>
