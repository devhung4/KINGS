<template>
	<view class="container">
		<view class="productBox">
			<view class="productList">
				<view class="productInfo">
					<view class="productName">{{ productInfo.name }}</view>
					<view class="productTime" v-if="productInfo.effectiveTime">
						<view class="triangle"></view>
						{{$t('productDetial.index1')}}：{{ productInfo.effectiveTime.substring(0, 11) }}
					</view>
				</view>
				<view class="productInfo">
					<!-- <view class="productPrice">${{ productInfo.singlePowerPrice }}</view> -->
					<view>
					<text class="productPrice" v-for="(item,index) in productInfo.itemApplyList" :key="index" :style="stylecss[index]">
						<text v-if="productInfo.itemApplyList.length != index +1">$</text>{{ item.amount}}{{ item.coin}}<text v-if="productInfo.itemApplyList.length != index +1">+</text>
					</text>
					</view>
					
					<view class="productDeadline">
						<!-- 期限
						<text class="deadline">{{ productInfo.term }}天</text> -->
					</view>
				</view>
				<view class="productInfo">
					<view>{{$t('productDetial.index2')}}：{{ productInfo.managementFee }}</view>
					<view class="productFigure">
						{{$t('productDetial.index3')}}
						<text class="figure">{{ productInfo.powerUnit }}</text>
					</view>
				</view>
				<view class="productInfo" style="margin:2% 0;">
					<view class="progress-box">
						<!-- :percent="(productInfo.sellPortion/productInfo.totalPortion) * 100" -->
						<progress
							:percent="(productInfo.sellPortion/productInfo.totalPortion) * 100" 
							border-radius="20px"
							active
							stroke-width="5"
							activeColor="#00a7eb"
							backgroundColor="#EAEAEA"
						/>
					</view>
					<view class="progess-num">{{$t('productDetial.index4')}}{{toFix(((productInfo.sellPortion / productInfo.totalPortion) * 100),2)}}%</view>
				</view>
				<view class="productInfo">
					<view class="earnL">
						<view class="earnNum">{{ toFix((productInfo.yearRate*100),4) }}%</view>
						<view>{{$t('productDetial.index5')}}</view>
					</view>
					<view class="earnR">
						<view class="earnNum">${{ productInfo.staticOutput | turn }}/100/{{ productInfo.powerUnit }}/{{$t('productDetial.index15')}}</view>
						<view>{{$t('productDetial.index6')}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="productDetial">
			<view class="pdTitle">{{$t('productDetial.index7')}}</view>
			<view class="prdInfo">
				<view class="infoNam">{{$t('productDetial.index8')}}</view>
				<view class="infoResult">{{ productInfo.coin }}</view>
			</view>
			<view class="prdInfo">
				<view class="infoNam">{{$t('productDetial.index9')}}</view>
				<view class="infoResult">{{ productInfo.name }}</view>
			</view>
			<view class="prdInfo">
				<view class="infoNam">{{$t('productDetial.index10')}}</view>
				<view class="infoResult">{{toFix( productInfo.dayPowerGain,6) }}</view>
			</view>
			<view class="prdInfo">
				<view class="infoNam">{{$t('productDetial.index11')}}</view>
				<view class="infoResult">{{toFix(productInfo.totalPowerGain,6)  }}</view>
			</view>
			<view class="prdInfo">
				<view class="infoNam">{{$t('productDetial.index12')}}</view>
				<view class="infoResult">{{toFix(productInfo.totalUsdtGain,6) }}</view>
			</view>
			<view class="prdInfo">
				<view class="infoNam">{{$t('productDetial.index13')}}</view>
				<view class="infoResult">{{ productInfo.effectiveTime }}</view>
			</view>
			<!-- <view class="prdInfo">
				<view class="infoNam">到期时间</view>
				<view class="infoResult">{{ productInfo.expirationTime }}</view>
			</view> -->
			<view class="prdInfo">
				<view class="infoNam">{{$t('productDetial.index14')}}</view>
				<view class="infoResult">{{ productInfo.term }}{{$t('productDetial.index15')}}</view>
			</view>
			<view class="prdInfo">
				<view class="infoNam">{{$t('productDetial.index16')}}
					<!-- <text class="helptxt" @click="helptxtClick">?</text> -->
					<view class="infoNameTips" v-show="infoNameTipShow">{{$t('productDetial.index17')}}</view>
				</view>
				<view class="infoResult">{{ productInfo.managementFee*100 }}%</view>
			</view>
		</view>
		<view class="buyNum">
			<text class="title">{{$t('productDetial.index18')}}</text>
			<text @click="sub">-</text>
			<input v-model="portion" @input="countInput($event)" type="digit" :placeholder="$t('productDetial.index19')"  disabled/>
			<text @click="add">+</text>
		</view>
		<view class="remak">
			<view class="remakTip">{{$t('productDetial.index20')}}</view>
			
			<view><rich-text :nodes="productInfo.remark"></rich-text></view>
			<!-- <view><jyf-parser :html="productInfo.remark"></jyf-parser></view> -->
		</view>
		<view class="cov" v-if="showpwd">
			<view class="con">
				<view class="password">{{$t('productDetial.index21')}}</view>
				<input @input="inputchange" :placeholder="$t('productDetial.index22')" password />
				<view class="buttoncss">
					<button class="text-one" @click="confirmPay" :disabled="btndisabl">{{$t('productDetial.index23')}}</button>
					<button class="text-two" @click="cancelpwd">{{$t('productDetial.index24')}}</button>
				</view>
			</view>
		</view>
		<view class="buttomBtn">
			<view class="allPrice">
				{{$t('productDetial.index25')}}：
				<!-- <text class="balance">${{ productInfo.singlePowerPrice * portion }}</text> -->
				<text class="balance"></text>
				
				<text class="balance" v-for="(item,index) in productInfo.itemApplyList" :style="stylecss[index]">
				{{ item.amount*portion}}{{ item.coin}}  <text v-if="productInfo.itemApplyList.length != index +1">+</text>
				
				</text>
				<!-- <text class="balance" :style="stylecss[0]">{{ productInfo.itemApplyList[0].amount||''}}{{ productInfo.itemApplyList[0].coin||''}}</text>
				<text class="balance" :style="stylecss[1]">{{"+"+productInfo.itemApplyList[1].amount||''}}{{ productInfo.itemApplyList[1].coin||''}}</text> -->
			</view>
			<view class="buyBtn" @click="buyBtn">{{$t('productDetial.index26')}}</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			navTitle:this.$t('pageName.index2'),
			productId: '',
			productInfo: {},
			showpwd: false,
			fundPassword: '',
			portion: 1,
			btndisabl: false,
			infoNameTipShow:false,
			stylecss:["color:#00a7eb","color:#00195A"],
			fundsVerified : 0,
		};
	},
	onShow(){
		uni.setNavigationBarTitle({
            title: this.navTitle
        });
	},
	onLoad(option) {
		// this.productInfo=uni.getStorageSync('productDetial');
		this.productId = option.id;
		// console.log(option)
		this.getProductdDetial();
		this.getData();
	},
	filters: {
		turn(v) {
			if (v) {
				return v.toFixed(4);
			} else {
				return 0.0;
			}
		},
	},
	methods: {
		toFix(n1,n2){
			if(typeof(n1) =="undefined"){
				return n1
			}else{
				return Number(n1.toFixed(n2))
			}
		},
		
		// 查看帮助详情
		helptxtClick:function(){
			this.infoNameTipShow = !this.infoNameTipShow;
		},
		countInput(e, index) {
			
			let rep = /[\.]/;
			console.log(rep.test(String(e.target.value)),'111')
			// if (String(e.target.value)) {
			// 	console.log(e,'999')
			// 	this.portion = '';
			// 	this.$api.msg('请输入正整数');
			// 	return;
			// }
			if (rep.test(String(e.target.value))) {
				this.portion = 1;
				this.$api.msg(this.$t('productDetial.index27'));
				return;
			}else if(e.target.value<= 0){
				this.portion = 1;
				this.$api.msg(this.$t('productDetial.index28'));
				return;
			}
		},
		sub() {
			if (this.portion > 1) {
				this.portion--;
			} else {
				this.$api.msg(this.$t('productDetial.index29'));
			}
		},
		add() {
			// if(this.portion>1){
		    if(this.portion>=10){
			    this.$api.msg(this.$t('productDetial.index30'));
			    return
		    }else{
			    this.portion++;
		    }
			
			// }
		},
		inputchange(e) {
			this.fundPassword = e.detail.value;
		},
		buyBtn() {
			if (this.portion == '') {
				this.$api.msg(this.$t('productDetial.index31'));
			}else if(this.fundsVerified == 0) {
				this.$api.msg(this.$t('productDetial.index32'));
				uni.navigateTo({
					url: '/pages/public/resetpaypsd'
				});
			}else{
				this.showpwd = true;
			}
		},
		// 取消支付
		cancelpwd() {
			this.$data.showpwd = false;
			this.fundPassword = '';
		},
		async getProductdDetial() {
			let that = this;
			try {
				let ProductdInfo = await that.$request.post('/computer-power-api/chanjuan/orderForm', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {
						id: that.productId,
						portion: 1
					}
				});
				if (ProductdInfo.data.code == 0) {
					let product = ProductdInfo.data.data[0];
					that.productInfo = product;
					// console.log(that.productInfo,'productInfo')
					// that.productInfo = ProductdInfo.data.data[0];
				} else {
					that.$api.msg(ProductdInfo.data.message);
				}
			} catch (e) {
				console.log(e);
				// that.$api.msg('网络异常');
			}
		},
		// 确认支付
		async confirmPay() {
			let that = this;
			// 获取产品列表
			that.$data.btndisabl = true;
			try {
				let courseInfo = await that.$request.post('/computer-power-api/chanjuan/buyConfirm', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')? uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {
						id: that.productId,
						portion: that.portion,
						fundPassword: this.fundPassword,
						coinName: '' //支付货币类型
					}
				});
				console.log(uni.getStorageSync('locale'))
				if (courseInfo.data.code == 0) {
					// console.log(courseInfo);
					that.cancelpwd();
					that.$data.btndisabl = false;
					that.$api.msg(courseInfo.data.message);
				} else if (courseInfo.data.message == '资金密码未设置' || courseInfo.data.message == 'Fund password not set') {
					that.$api.msg(courseInfo.data.message);
					that.cancelpwd();
					that.$data.btndisabl = false;
					uni.navigateTo({
						url: '/pages/public/resetpaypsd'
					});
				} else {
					// that.cancelpwd();
					// uni.setStorageSync("hasLogin",false);
					// uni.setStorageSync("userInfo","");
					// // uni.clearStorageSync();
					// setTimeout(()=>{
					// 	uni.reLaunch({
					// 		url:'/pages/public/login'
					// 	})
					// }, 200);
					that.cancelpwd();
					that.$api.msg(courseInfo.data.message);
					that.$data.btndisabl = false;
				}
			} catch (e) {
				//TODO handle the exception
				console.log(e);
				// that.$api.msg('网络异常');
			}
		},
		
		// 获取个人信息
		async getData(){
			    let that = this;
				let res1 = await that.$request.post('/uc/approve/security/setting', {
					header: {
						 'x-auth-token':uni.getStorageSync('token'),
						 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
					},
					data:{}
				});
				if(res1.data.code==0){
					that.fundsVerified=res1.data.data.fundsVerified;
						// console.log(that.fundsVerified,'that.fundsVerified')
				}else{
					that.$api.msg(res1.data.message);
				}

		},
	}
};
</script>

<style lang="scss">
	page{
		background: #f5f5f5;
	}
.container {
	background: #f5f5f5;
}
// 云抽奖推荐产品
.productBox {
	margin-top: 3%;
	margin-bottom: 3%;
	width: 100%;
	.productList {
		margin-top: 3%;
		width: 100%;
		background: #fff;
		padding:3% 0;
		.productInfo {
			width: 100%;
			display: flex;
			justify-content: space-between;
			padding: 1% 0 1% 4%;
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
			.productName {
				font-size: 16px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #333333;
			}
			.productTime {
				background: #1940b9;
				width: 45%;
				height: 50upx;
				line-height: 50upx;
				text-align: center;
				position: relative;
				font-size: 12px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #ffffff;
				.triangle {
					width: 0;
					height: 0;
					border-top: 26upx solid transparent;
					border-bottom: 26upx solid transparent;
					border-left: 26upx solid #fff;
					position: absolute;
					top: 0;
					left: 0;
				}
			}
			.productPrice {
				font-size: 16px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #e7ad05;
			}
			.productDeadline {
				width: 50%;
				text-align: left;
				font-size: 12px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
				line-height: 70upx;
				.deadline {
					display: inline-block;
					margin-left: 20upx;
					width: 88upx;
					height: 36upx;
					line-height: 36upx;
					text-align: center;
					background: rgba(231, 173, 5, 0.1);
					border-radius: 28upx;
					font-size: 12px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #e7ad05;
				}
			}
			.productFigure {
				width: 40%;
				text-align: right;
				padding-right:3%;
				.figure {
					display: inline-block;
					margin-left: 20upx;
					font-size: 12px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #333333;
				}
			}
			.progress-box {
				width: 60%;
				padding-top: 2%;
			}
			.progess-num {
				width: 40%;
				text-align: right;
				padding-right:3%;
			}
			.earnL {
				width: 50%;
			}
			.earnR {
				width: 50%;
				text-align: left;
			}
			.earnNum {
				color: #00a7eb;
			}
		}
	}
}
.productDetial {
	width: 100%;
	background: #fff;
	padding: 3%;
	.pdTitle {
		margin:2% 0 3%;
		font-size: 15px;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #333333;
		// border-left: 2px solid #e7ad05;
		padding-left: 4%;
		position: relative;
	}
	.pdTitle:after{
		content: '';
		position: absolute;
		top:15%;
		left:0;
		width:2px;
		height:15px;
		background: #d9b75d;;
	}
	.prdInfo {
		display: flex;
		align-items: center;
		.infoNam {
			position: relative;
			width: 45%;
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
			margin: 1% 0;
			.helptxt{
			    display: inline-block;
			    border: 1px solid;
			    border-radius: 50%;
			    height: 30upx;
			    line-height: 24upx;
			    width: 30upx;
			    font-size: 24upx;
			    text-align: center;
			    position: absolute;
			    right: 20upx;
			    top: -12upx;
			}
			.infoNameTips{
				font-size: 24upx;
			    position: absolute; right: 56upx; top: -80upx;
			    background: #f5f5f5; color: #999;
			    padding: 10upx 20upx;
			    border-radius: 8upx;
			    width: 75%;
			}
		}
		.infoResult {
			font-size: 12px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
		}
	}
}
.remak {
	width: 95%;
	border-radius: 10upx;
	margin: 3% auto 25%;
	padding: 4%;
	background: #fff;
	font-size: 12px;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #999999;
	.remakTip {
		width:100%;
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
	}
}
.buyNum {
	width: 100%;
	display: flex;
	background-color: #fff;
	padding: 3%;
	margin-top: 3%;
	font-size: 15px;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: #333333;
	.title {
		display: inline-block;
		margin-right: 3%;
	}
	input {
		width: 15%;
		margin: 1px 2% 0;
		font-size: 15px;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #333333;
		text-align: center;
		vertical-align: middle;
	}
}
.buttomBtn {
	position: fixed;
	bottom: 0;
	left: 0;
	background: #fff;
	display: flex;
	justify-content: space-between;
	width: 100%;
	padding: 2%;
	.allPrice {
		font-size: 12px;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #333333;
		.balance {
			font-size: 12px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #00a7eb;
		}
		line-height: 90upx;
	}
	.buyBtn {
		width: 160px;
		height: 40px;
		line-height: 38px;
		text-align: center;
		background: #00a7eb;
		border-radius: 22px;
		// border: 1px solid #e7ad05;
		color:#fff;
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
			width: 100%;
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
