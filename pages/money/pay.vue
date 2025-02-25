<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{amount}}</text>
		</view>

		<!-- <view class="pay-type-list">
			<view class="type-item b-b"> -->
				<!-- <text class="icon yticon icon-weixinzhifu"></text> -->
				<!-- <image :src="item.image" style="width: 26px;height: 26px;margin-right: 25px;"></image>
				<view class="con">
					<text class="tit">{{item.name}}</text>
					<text v-show="type!=2">余额：{{item.balance}}</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == item.type' />
					</radio>
				</label>
			</view> -->
			
            <!-- <view class="type-item b-b">
            	<image :src="list.image" style="width: 26px;height: 26px;margin-right: 25px;"></image>
            	<view class="con">
            		<text class="tit">{{list.name}}</text>
            		<text>余额：{{list.balance}}</text>
            	</view>
            	<label class="radio">
            		<radio value="" color="#fa436a" :checked='payType == list.type' />
            		</radio>
            	</label>
            </view> -->
			
			<!-- <view class="type-item" @click="changePayType(3)">
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">预存款支付</text>
					<text>可用余额 ¥198.5</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 3' />
					</radio>
				</label>
			</view> -->
		<!-- </view> -->
		<view class="cov" v-if="showpwd">
			<view class="con">
				<view class="password">请输入支付密码</view>
				<input @input="inputchange" placeholder="请输入密码" password/>
			     <view class="buttoncss">
					 <button class="text-one" @click="sendpwd" :disabled="btndisabl">确定</button>
					 <button class="text-two" @click="cancelpwd">取消</button>
				 </view>
			</view>
		</view>
		
		<text class="mix-btn" @click="beaforconfirm">确认支付</text>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	import md5 from '../../common/md5.js';
	export default {
		data() {
			return {
				payType: -1,
				orderInfo: {},
				list:[],
				amount:0,
				orderNo:'',
				id:'',
				type:0,
				showpwd:false,
				passwordval:"",
				btndisabl:false,
				shoptype:0,
				classid:'',
				status:1,
				videoid:1,
			};
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		onLoad(options) {
			// this.amount = uni.getStorageSync("coamount");
			this.amount=options.money
			this.orderNo = uni.getStorageSync("coorderno");
			this.id = uni.getStorageSync("coorderid");
			this.shoptype = uni.getStorageSync("shoptype");
			this.classid=uni.getStorageSync("courseId");
			this.status=options.status
			this.videoid=options.videoid
			// console.log(options)
			this.getpaytype()
			// console.log(this.$data.payType)
		},
		methods: {
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			inputchange(e){
				this.passwordval = md5(e.detail.value);
			},
			// 输入支付密码
			beaforconfirm(){
				// if(this.type!=2) {
					this.showpwd = true;
				// }
				
				// if(this.payType == -1){
				// 	this.$api.msg("请选择支付方式");
				// }else{
				// that.$data.showpwd = true;
				// this.confirm();
				// }
				// for(let i=0; i<that.$data.list.length; i++){
				// 	if(that.$data.list[i].type==that.$data.payType){
				// 		if(that.$data.amount>that.$data.list[i].balance){
				// 			that.$api.msg("当前余额不足");
				// 		}else{
				// 			that.$data.showpwd = true;
				// 		}
				// 	}
				// }
				// }
			},
			// 确认支付
			sendpwd(){
				this.confirm();
			},
			// 取消支付
			cancelpwd(){
				this.$data.showpwd = false;
			},
			//确认支付
			confirm: async function() {
				let that = this;
				if(that.$data.passwordval==""){
					that.$api.msg("请输入支付密码");
					return;
				}else{
					if(this.shoptype=='1'){
						this.classid='';
					}
				// that.$data.btndisabl = true;
					// 3-余额支付
					if(that.status=='1'){				
						try {
							let res2 = await that.$request.post("media/knowledge/buyVideo", {
								data: {
									"base": {
									    
										"uid": that.userInfo.userId,										
									},
									"param": { 
										"videoId":that.videoid,//视频 id											
										"fundPassword" : that.$data.passwordval,								
									}
								}
							});
							if(res2.data.base.code == '000000'){
								that.$api.msg(res2.data.base.msg);
								that.$data.btndisabl = true;
								setTimeout(()=>{
									that.getpaytype();
									if(this.shoptype=='1'){
										uni.redirectTo({
											url: "../order/order?state=0",
										});
									}else{
										uni.redirectTo({
											url: "../set/myvideo",
										});
									}
								}, 3000);
							}else{
								that.$api.msg(res2.data.base.msg);
								that.$data.btndisabl = false;
							}
						} catch (error) {
							console.error('error:', error);
							that.$data.btndisabl = false;
						}
					}else{
						try {
							let res2 = await that.$request.post("/pay/balancePay", {
								data: {
									"base": {
									    "appId": "001",
										"channels": "001",
										"ver": "1.1.5",
										"clientVer": "1.0",
										"apn": "wifi",
										"deviceId": "1233eedds2112",
										"uid": that.userInfo.userId,
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
										"orderId":that.$data.id,
										"totalFee" : that.$data.amount,
										"type" : this.shoptype,
										"fundPassword" : that.$data.passwordval,
										"courseId" :this.classid
									}
								}
							});
							if(res2.data.base.code == '000000'){
								that.$api.msg(res2.data.base.msg);
								that.$data.btndisabl = true;
								setTimeout(()=>{
									that.getpaytype();
									if(this.shoptype=='1'){
										uni.redirectTo({
											url: "../order/order?state=0",
										});
									}else{
										uni.redirectTo({
											url: "../set/subscribe",
										});
									}
								}, 3000);
							}else{
								that.$api.msg(res2.data.base.msg);
								that.$data.btndisabl = false;
							}
						} catch (error) {
							console.error('error:', error);
							that.$data.btndisabl = false;
						}
					}
					
				}	
				
				// uni.redirectTo({
				// 	url: '/pages/money/paySuccess'
				// })
			},
			async getpaytype(){
				let that = this;
				let data = await this.$http.post('/pay/getPayMethods', {
					 "base":{
						 "uid": this.userInfo.userId,
					 },
					 "orderIds": this.id
				});
				this.list = data;
				this.type=this.list[0].type;
				for(let i=0; i<data.length; i++){
					if(data[i].name=="积分"){
						that.$data.payType = data[i].type;
					}
				}
			},
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
			/* &:before{
				content: '$';
				font-size: 40upx;
			} */
			&:after{
				content: 'USDT';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;
		
		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position:relative;
		}
		
		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	
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
	
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		/* background-color: $base-color; */
		background-color: #FD852F;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>
