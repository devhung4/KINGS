<template>
	<view class="jindanTransfer">
		<view class="content">
			<view class="content-top">
				<view class="left">
					<view class="toptxt">{{lv?leftval:rightval}}</view>
					<view class="inputnum">
						<input v-model="amount" @input="result" placeholder="转出数量" />
					</view>
				</view>
				<view class="center">
					<image @click="changejindan" src="../../static/hz.png"></image>
				</view>
				<view class="right">
					<view class="toptxt">{{rv?rightval:leftval}}</view>
					<view class="inputnum">
						<input disabled="disabled" v-model="resultNumber" placeholder="收到数量" />
					</view>
				</view>
			</view>
			<view class="content-bottom" v-show="lv==false&&rv==false">
				<view class="left-text">可用金丹：{{exinfo.balance}}</view>
				<view class="right-text">手续费：{{fee*amount}}</view>
			</view>
			<view class="content-bottom"  v-show="lv==true&&rv==true">
				<view class="left-text">可用金丹：{{exinfo.insideBalance}}</view>
				<view class="right-text">手续费：{{insideFee*amount}}</view>
			</view>
		</view>
		<view class="cov" v-if="showpwd">
			<view class="con">
				<view class="password">请输入支付密码</view>
				<input v-model="password" placeholder="请输入密码" password/>
			     <view class="buttoncss">
					 <button class="text-one" @click="sendpwd">确定</button>
					 <button class="text-two" @click="cancelpwd">取消</button>
				 </view>
			</view>
		</view>
		<view class="btnchange">
			<button :disabled="btndisab" @click="openPw">确定</button>
		</view>
	</view>
</template>

<script>
	import md5 from "../../common/md5.js"
	export default {
		data() {
			return {
				lv:false,
				leftval:"内场金丹",
				rv:false,
				showpwd:false,
				rightval:"外场金丹",
				usejd:0,
				handlingfee:0,
				btndisab:false,
				exinfo:{},
				amount:0,
				resultNumber:0,
				fee:0,
				insideFee:0,
				password: '',
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
			openPw (){
				if(this.amount==""||this.amount==0){
					this.$api.msg("请输入数量");
					return
				}else{
					this.showpwd=true;
				}
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = md5(e.detail.value);
			},
			// 取消支付
			cancelpwd(){
				this.$data.showpwd = false;
				this.paypwd="";
			},
			sendpwd(){
				this.getextraction();
			},
			result (){
				if(this.lv){
					this.resultNumber=this.amount-this.amount*this.insideFee
				}else{
					this.resultNumber=this.amount-this.amount*this.fee
				}
			},
			onNavigationBarButtonTap(e) {
				uni.navigateTo({
					url:'./jindanTransferDetail'
				})
			},
			// 互转金丹
			changejindan(){
				let that = this;
				that.lv = !that.lv;
				that.rv = !that.rv;
				this.amount=0;
				this.resultNumber=0;
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
				this.insideFee = this.exinfo.insideFee
				// console.log(this.exinfo)
			},
			//金丹互转
			async getextraction() {
				let type;
				if(this.lv){
					type=2
				}else{
					type=1
				}
				let extraction = await this.$request.post('/transfer/trade', {
			
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
								"uid": this.uid,
								"amount": this.amount,
								"fundPassword": md5(this.password),
								"type": type
							}
			
					}
				});
				if(extraction.data.base.code == '000000') {
					this.$api.msg(extraction.data.base.msg)
					this.cancelpwd()
				}else {
					this.$api.msg(extraction.data.base.msg);
					this.cancelpwd()
				}
				
			},
		}
	}
</script>

<style lang='scss' scoped>
	.cov {
		width: 100%;
		height: 100%;
		top:0;bottom: 0;
		left:0;right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 3;
		position: fixed;
		text-align: center;
		font-size: 16px;
		.con {
			z-index:4;
			height:270upx;
			width:600upx;
			background-color: white;
			position: fixed;
			top: 30%;
			left:10%;
			border-radius:20upx;
			.password{
				text-align:center;
				height:80upx;
				line-height:80upx;
				width:100%
			}
			input{
				border-bottom:4upx solid #efefef;
				margin:10upx auto;
				width:90%;
				height: 70upx;
			}
			.buttoncss{
				width:100%;
				height:50upx;
				display:flex;
				margin-top:32upx;
				.text-one,.text-two{
					display:block;
					text-align:center;
					height:50upx;
					line-height:50upx;
					width:50%;
					background: none;
				}
				uni-button:after{
					border: none;
				}
			}
		}
	}
	.jindanTransfer{
		padding: 5%;
		.content{
			.content-top{
			    display: flex;
			    align-items: center;
			    justify-content: space-between;
				.left{
					view{
						border: 1px solid #E5E5E5;
						margin: 10% 0;
					}
					view,input{
						height: 90upx;
						line-height: 90upx;
						font-size: 15px;
						padding-left: 5px;
					}
				}
				.center{
				    height: 50upx;
				    width: 70upx;
					margin: 0 3%;
					image{
						height: 100%;
						width: 100%;
					}
				}
				.right{
					view{
						border: 1px solid #E5E5E5;
						margin: 10% 0;
					}
					view,input{
						height: 90upx;
						line-height: 90upx;
						font-size: 15px;
						padding-left: 5px;
					}
				}
			}
			.content-bottom{
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 15px;
			}
		}
		.btnchange{
			button{
			    width: 94%;
			    height: 44px;
			    background: rgba(232,65,112,1);
			    border-radius: 2px;
			    color: #fff;
			    margin: 20% auto;
			}
		}
	}
</style>
