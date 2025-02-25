<template>
	<view class="exchangeinfo">
		<view class="content">
			<view class="energy_axis" :style="`background:${levelbg}`">
				<text>{{eneryinfo.name}}</text>
				<image :src="eneryinfo.logo" mode="widthFix"></image>
			</view>
			<view class="explain">
				<view class="audio">
					<view class="audio_title">
						<text class="audt">兑换数量</text>
					</view>
					<view class="audio_content">
						<text>共{{eneryinfo.maxNum}}个</text>
						<view class="sy">剩余可兑换
							<text class="num">{{eneryinfo.maxNum-eneryinfo.userNum}}</text>
							个</view>
						<view class="operation">
							<view class="cut" @click="cut()">
								-
							</view>
							<view class="number">
								{{num}}
							</view>
							<view class="add" @click="add()">
								+
							</view>
						</view>
					</view>
				</view>
				<view class="audio">
					<view class="audio_title">
						<text class="audt">兑换金额</text>
					</view>
					<view class="audio_content">
						<text class="golden">{{eneryinfo.price}}金丹</text>
						<view class="available">
							当前可用金丹:{{goldeninfo}}个
						</view>
					</view>
				</view>
				<view class="audio">
					<view class="audio_title">
						<text class="audt">能量奖励</text>
					</view>
					<view class="audio_content">
						<view class="introduce">
							{{eneryinfo.remarkReward}}
						</view>
					</view>
				</view>
				<view class="audio">
					<view class="audio_title">
						<text class="audt">奖励规则</text>
					</view>
					<view class="audio_content">
						<view class="introduce">
							{{eneryinfo.remarkRule}}
						</view>
					</view>
				</view>
				<view class="audio">
					<view class="audio_title">
						<text class="audt">生效时间</text>
					</view>
					<view class="audio_content">
						<view class="introduce">
							{{eneryinfo.remarkEffect}}
						</view>
					</view>
				</view>
			</view>
			<view v-if="eneryinfo.id==1" class="exchange_bot" @click="ljjhclick()">
				立即激活
			</view>
			<view v-else class="exchange_bot" @click="swap()">
				立即兑换
			</view>
		</view>
		<view class="mask" v-show="exchange">
			<view class="attestation">
				<view class="att_title">
					确认兑换初级能量轴吗？
				</view>
				<view class="card">
					<image src="../../static/img/gendel.png" mode=""></image>
					<view class="need">
						需支付<text>{{eneryinfo.price*num}}</text>金丹
					</view>
				</view>
				<view class="an">
					<view class="cancel" @click="cancel()">
						取消
					</view>
					<view class="go" @click="define()">
						确认
					</view>
				</view>
			</view>
		</view>
		<view class="cov" v-if="pay">
			<view class="con">
				<view class="password">请输入支付密码</view>
				<input v-model="passwordval" placeholder="请输入密码" password />
				<view class="buttoncss">
					<button class="text-one" @click="sendpwd">确定</button>
					<button class="text-two" @click="cancelpwd">取消</button>
				</view>
			</view>
		</view>
		<view class="mask" v-show="convert">
			<view class="convert">
				<image src="../../static/icon_selected.png" mode=""></image>
				<text>兑换成功</text>

			</view>
		</view>
	</view>
</template>

<script>
	import md5 from '../../common/md5.js';
	export default {
		data() {
			return {
				exchange: false,
				convert: false,
				title: '',
				eneryinfo: '',
				num: 1,
				eneryid: '',
				uid: '',
				pay: false,
				passwordval: '',
				goldeninfo: '',
				surplusnum: 0,
				levelbg:""
			}
		},
		created() {},
		methods: {
			// 立即激活
			async ljjhclick(){
				let buyenery = await this.$request.post('/energy/axis/buy', {
					"data": {
						"uid": this.uid,
						"energyId": this.eneryid
					}
				});
				if (buyenery.data.base.code == "000000") {
					this.$api.msg(buyenery.data.base.msg);
					uni.redirectTo({
						url:"./capacity"
					})
				} else {
					uni.showToast({
						title: buyenery.data.base.msg,
						duration: 1000,
						icon: 'none'
					});
				}
			},
			//减
			cut() {
				if (this.num == 1) {
					uni.showToast({
						title: '不能再少了',
						duration: 1000,
						icon: 'none'
					})
				} else {
					this.num = this.num - 1
				}
			},
			//加
			add() {
				if (this.num >= this.surplusnum) {
					uni.showToast({
						title: '不能再加了',
						duration: 1000,
						icon: 'none',
						passwordval: ''
					})
				} else {
					this.num = this.num + 1
				}
			},
			//兑换事件
			swap() {
				this.exchange = true
			},
			//取消
			cancel() {
				this.exchange = false
			},
			//确认
			define() {
				this.exchange = false,
				this.pay = true
			},
			//确认支付
			sendpwd() {
				if (this.passwordval == "") {
					uni.showToast({
						title: '请输入支付密码',
						duration: 1000,
						icon: 'none'
					});
				} else {
					
					this.passwordval = md5(this.passwordval)
					console.log(this.passwordval)
					this.pay = false
					this.getbuyenery()
					this.passwordval = "";
				}

			},
			//取消支付
			cancelpwd() {
				this.pay = false
			},
			//购买能量轴
			async getbuyenery() {
				let buyenery = await this.$request.post('/energy/axis/buy', {
					"data": {
						"uid": this.uid,
						"energyId": this.eneryid,
						"fundPassword": this.passwordval,
						"number":this.num
					}
				});
				if (buyenery.data.base.code == "000000") {

					console.log(buyenery.data)
					this.buyinfo = buyenery.data.data;
					uni.showToast({
						title: '兑换成功',
						duration: 1000
					});
				} else {
					uni.showToast({
						title: buyenery.data.base.msg,
						duration: 1000,
						icon: 'none'
					});
				}

			},
			//获取金丹余额
			async getgolden() {
				let golden = await this.$request.post('/task/getUserRewardInfo', {
					"data": {
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
						}


					}
				});
				this.goldeninfo = golden.data.data.balance;
				console.log(this.goldeninfo)
				// this.getnewarray()
			},
			changetitle() {
				uni.setNavigationBarTitle({
					title: this.title
				})
			}

		},
		onLoad() {
			//用户id
			var userInfo = uni.getStorageSync("userInfo");
			this.uid = userInfo.userId;
			//能量轴内容
			let eneryinfo = uni.getStorageSync("eneryinfo");
			this.eneryinfo = JSON.parse(eneryinfo);
			this.title = this.eneryinfo.name;
			//剩余兑换数
			this.surplusnum = this.eneryinfo.maxNum - this.eneryinfo.userNum
			console.log(this.surplusnum)
			this.eneryid = this.eneryinfo.id
			this.getgolden();
			this.changetitle()
			
			switch(this.eneryinfo.id){
				case '1':
					this.levelbg = 'linear-gradient(to right, #80A3CE, #D9E3F0)';
				break;
				case "2":
					this.levelbg = 'linear-gradient(to right, #73A034, #C9E0A6)';
				break;
				case "3":
					this.levelbg = 'linear-gradient(to right, #CF606F, #F3C4CA)';
				break;
				case "4":
					this.levelbg = 'linear-gradient(to right, #D8693F, #F0BCA4)';
				break;
				case "5":
					this.levelbg = 'linear-gradient(to right, #7B57A1, #D3C0DC)';
				break;
				case "6":
					this.levelbg = 'linear-gradient(to right, #F4AB2B, #FEF1CC)';
				break;
				default:
					this.levelbg = 'linear-gradient(to right, #73A034, #C9E0A6)';
				break;
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: rgba(240, 240, 240, 1);
	}

	.energy_axis {
/* 		background: url(../../static/img/exchage_info.png) no-repeat;
		background-size: cover; */
		height: 194upx;
		margin-top: 20upx;
		padding: 38upx 10%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20upx;

		image {
			width: 45px;
			/* height: 118upx; */
		}

		text {
			font-size: 42upx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: bolder;
			color: #FFFFFF;
			letter-spacing: 2px;
		}
	}

	.explain {
		height: 828upx;
		background: #FFFFFF;
	}

	.audio {
		background: rgba(255, 255, 255, 1);
		padding: 32upx 30upx 0 30upx;
		box-sizing: border-box;

		.audio_title {
			height: 56upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30upx;

			.audt {
				padding-left: 20upx;
				box-sizing: border-box;
				font-size: 36upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				color: rgba(51, 51, 51, 1);
				line-height: 50upx;
			}
		}

		.audio_content {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.num {
				font-size: 28upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #E84170;
				display: inline !important;
			}

			.sy,
			text {
				font-size: 28upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
			}

			.operation {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.golden {
				font-size: 32upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: rgba(232, 65, 112, 1);
			}

			.available {
				font-size: 24upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
			}

			.introduce {
				font-size: 28upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
			}
		}
	}

	.add,
	.cut {
		width: 40upx;
		height: 40upx;
		background: rgba(246, 246, 246, 1);
		border-radius: 4upx;
		text-align: center;
		line-height: 40upx;
		color: #333333;
	}

	.audio_title::after {
		position: absolute;
		content: "";
		height: 30upx;
		border-right: 10upx solid rgba(232, 65, 112, 1);
	}

	.number {
		width: 80upx;
		text-align: center;
		font-size: 28upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
	}

	.exchange_bot {
		width: 630upx;
		height: 88upx;
		background: rgba(232, 65, 112, 1);
		border-radius: 4upx;
		font-size: 36upx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 88upx;
		text-align: center;
		margin: 20upx auto 0;
	}

	.attestation {
		width: 580upx;
		height: 520upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 4px;
		margin: 380upx auto 0;
		padding: 60upx 30upx 40upx;
		box-sizing: border-box;

		.att_title {
			font-size: 36upx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			text-align: center;
		}

		.card {
			text-align: center;
			margin-top: 30upx;
			margin-bottom: 60upx;

			image {
				width: 130upx;
				height: 130upx;
				margin-bottom: 30upx;
			}

			text {
				font-size: 28upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
			}
		}

		.an {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.cancel {
				width: 240upx;
				height: 80upx;
				border-radius: 4upx;
				border: 2upx solid rgba(232, 65, 112, 1);
				text-align: center;
				line-height: 80upx;
				font-size: 32upx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: rgba(232, 65, 112, 1);
			}

			.go {
				width: 240upx;
				height: 80upx;
				background: rgba(232, 65, 112, 1);
				border-radius: 4upx;
				border: 2upx solid rgba(232, 65, 112, 1);
				text-align: center;
				line-height: 80upx;
				font-size: 32upx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
			}
		}
	}

	.need {
		text {
			color: #E84170 !important;
		}
	}

	.convert {
		width: 324upx;
		height: 150upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 4upx;
		margin: 480upx auto 0;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			width: 40upx;
			height: 40upx;
		}

		text {
			margin-left: 20upx;
		}
	}

	.cov {
		width: 100%;
		height: 100%;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 3;
		position: fixed;
		text-align: center;
		font-size: 16px;

		.con {
			z-index: 4;
			height: 270upx;
			width: 600upx;
			background-color: white;
			position: fixed;
			top: 30%;
			left: 10%;
			border-radius: 20upx;

			.password {
				text-align: center;
				height: 80upx;
				line-height: 80upx;
				width: 100%
			}

			input {
				border-bottom: 4upx solid #efefef;
				margin: 10upx auto;
				width: 90%;
				height: 70upx;
			}

			.buttoncss {
				width: 100%;
				height: 50upx;
				display: flex;
				margin-top: 32upx;

				.text-one,
				.text-two {
					display: block;
					text-align: center;
					height: 50upx;
					line-height: 50upx;
					width: 50%;
					background: none;
				}

				uni-button:after {
					border: none;
				}
			}
		}
	}
</style>
