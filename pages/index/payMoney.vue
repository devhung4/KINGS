<template>
	<view>
		<view class="title-view">
			<image :src="headImg"></image>
		</view>
		<view class="titlecss">{{userName}}</view>
		<view class="title-money">转账金额</view>
		<view class="paymoney">
			<text>￥</text>
			<input @input="getMoney" v-model="transferAmount"/>
		</view>
		<view class="content">
			<input placeholder="添加备注(50字以内)" maxlength="50" />
		</view>
		<view class="submitcss" @click="submit">确认转账</view>
		<view class="cov" v-if="show">
			<view class="con">
				<view class="password">请输入密码</view>
				<input @input="inputchange" placeholder="请输入密码" password/>
			     <view class="buttoncss">
					 <text class="text-one" @click="send">确定</text>
					 <text class="text-two" @click="cancel">取消</text>
				 </view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import md5 from "../../common/md5.js";
	export default {
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		data() {
			return {
				payerId: '',
				payeeId: '',
				show: false,
				value:'',
				transferAmount:'',
				headImg:"",
				userName:""
			}
		},
		onLoad(options) {
			let that = this;
			let scanuserinfo = uni.getStorageSync("scanuserinfo");
			// console.log("++++++++++++++"+options);
			// console.log(options);
			// console.log(scanuserinfo);
			that.payeeId = options.payeeId;
			that.payerId = that.userInfo.userId;
			
			if(scanuserinfo.headImg){
				that.$data.headimage = scanuserinfo.headImg;
			}else{
				that.$data.headimage = "../../static/missing-face.png";
			}
			that.$data.userName= scanuserinfo.nickname;
		},
		methods: {
			getMoney(e) {
				// console.log(e.detail.value)
			},
			submit() {
				this.show = true
			},
			cancel(){
				this.show = false
			},
		    inputchange(e){
				this.value=md5(e.detail.value)
			},
			async send(){
				let res1=await this.$request.post('/transfer/amount',{
					"data":{
					  "base": {
					         "appId": "001",
					         "channels": "001",
					         "ver": "1.1.5",
					         "clientVer": "1.0",
					         "apn": "wifi",
					         "deviceId": "1233eedds2112",
					         "uid": this.payerId,
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
					         "payerId": this.payerId,
					         "payeeId": this.payeeId,
					         "paymentPassword": this.value,
					         "transferAmount": this.transferAmount,
					         "remarks": ""
					     },
					}
				})
				this.show = false
				let message=res1
				// console.log("res1"+this.message)
				if(message.data.base.code=="000000"){
					 this.$api.msg(message.data.base.msg);
					 uni.navigateTo({
					 	url:"../user/surplusMoney?pageindex=1"
					 })
					 // url:"../user/surplusMoney"
				}else{
					 this.$api.msg(message.data.base.msg);
				}
			}
		}
	}
</script>

<style lang="scss">
	.title-view {
		color: #000;
		font-size: 24upx;
		width: 150upx;
		height: 150upx;
		text-align: center;
		margin: 90upx auto 20upx;
		image{
			height: 100%;
			width: 100%;
			border-radius: 50%;
		}
	}

	.titlecss {
		text-align: center;
		font-size: 40upx;
	}

	.title-money {
		font-size: 30upx;
		margin: 100upx 0 40upx 30upx;
	}

	.paymoney {
		display: flex;
		width: 90%;
		margin: 0 auto;
		font-size: 40upx;
		font-weight: bold;
		border-bottom: 4upx solid #e1e1e1;
	}

	.content {
		width: 90%;
		margin: 30upx auto;
	}

	.submitcss {
		background-color: #FA436A;
		color: #fff;
		width: 90%;
		margin: 20upx auto;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
	}
    .password{
		text-align:center;
		height:80upx;
		line-height:80upx;
		width:100%
	}
	.cov {
		width: 100%;
		height: 100%;
		top:0;
		left:0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
		position: absolute;
		text-align: center;
		font-size: 16px;
	}
	.con input{
		border-bottom:4upx solid #efefef;
		margin:20upx auto;
		width:90%;
	}
	.con {
		z-index:1100;
		height:270upx;
		width:600upx;
		background-color: white;
		position: fixed;
		top: 30%;
		left:10%;
		border-radius:20upx;
	}
    .buttoncss{
		width:100%;
		height:50upx;
		display:flex;
		margin-top:45upx;
	}
	.text-one,.text-two{
		display:block;
		text-align:center;
		height:50upx;
		line-height:50upx;
		width:50%;
	}
	.ptitle {
		width: 100%;
		height: 35px;
		background-color: #3daae9;
		color: white;
		line-height: 35px;
	}

	.dbt {
		border-radius: 5px;
		width: 70px;
		height: 30px;
		background-color: #3daae9;
		right: 20px;
		bottom: 20px;
		position: absolute;
		line-height: 30px;
		color: white;
	}
</style>
