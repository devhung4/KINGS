<template>
	<view class="extract">
		<view class="extract_list">
			<view class="extract_num">
				<text>所需资金</text>
				<view class="num_input">
					<text class="applyNum">{{balance}}USDT</text>
				</view>
				
			</view>
			<view style='color:#999;font-size:26upx;'>可用余额：{{userRewardInfo.balance&&userRewardInfo.balance!=0?Number(userRewardInfo.balance).toFixed(4):0}}USDT</view>
			<view class="extract_num">
				<text>支付密码</text>
				<view class="num_input">
					<!-- <input type="password" value="" v-model="charge" placeholder="请输入支付密码" /> -->
					<input @input="inputchange" v-model="showpwd" placeholder="请输入支付密码" password/>
				</view>
			</view>
		</view>
		<button class="confirm" :disabled='btndisabl' @click="payment()">
			申请
		</button>
		<view class="explain">
			<view class="tips">说明</view>
			<view class="tipsBox">
				<jyf-parser :html="htmlNodes.content"></jyf-parser>
				<!-- 1.成为代理获得更高收益。</view>
				<view class="tipsBox">2.可以获得最高49%的直推返佣和18%的间推返佣。</view>
				<view class="tipsBox">3.享受下级代理推广业绩的3%返佣。</view>
				<view class="tipsBox">4.更多权益抢先体验。</view>
				<view class="tipsBox">5.规则如有调整，以七星官方为准，最终解释权归七星所有。 -->
			</view>
			
		</view>
	</view>
</template>

<script>
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import md5 from '../../common/md5.js';
	export default {
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		components: {
			jyfParser
		},
		data() {
			return {
				btndisabl:false,
				uid: '',
				balance: 0,
				password:'',
				extractioninfo: {},
				userRewardInfo:"",
				index: 0,
				type:4,
				timer: null,
				showpwd:'',
				htmlNodes:''
			}
		},
		created() {

		},		
		async onShow() {
			let that = this;
		
				let resbalance = await that.$http.post('/task/getUserRewardInfo', {
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
						"brand": "huawei",
						inviteCode:''
					}
				})
				if(resbalance){
					that.$data.userRewardInfo = resbalance;
					// console.log(this.userRewardInfo)
				}
			
		},
		onLoad() {
			//用户id
			var userInfo = uni.getStorageSync("userInfo");
			this.uid = userInfo.userId;
			this.getapplyInfo();
			this.aboutus()
		},
		methods: {
			onNavigationBarButtonTap(e) {
				uni.navigateTo({
					url:'./agencyapplyRecord'
				})
			},
			async aboutus(){
				let res = await this.$request.post('flash-channel/ruleDescription', {
					data:{
						"base":{
							"uid": this.userInfo.userId,
						},
						"param":{
							"id":6 
						}
					}
				});
				if(res.data.base.code=="000000"){
					this.htmlNodes=res.data.data;
				}else{
					console.log(res.data.base.msg);
				}
			},		
			//获取代理配置信息
			async getapplyInfo() {
				let fee = await this.$request.post('/applyAgent/getConfig', {
					"data": {
						
					}
				});
				this.exinfo = fee.data.data;
				// this.fee = this.exinfo.fee;
				this.balance = this.exinfo.amount
				// console.log(this.exinfo)
			},
			inputchange(e){
				this.password = md5(e.detail.value);
				console.log(this.password)
			},
			//提交申请
			async getextraction() {
				this.$data.btndisabl = true;
				let extraction = await this.$request.post('/applyAgent/apply', {

					"data": {
							"uid": this.uid,
							"password": this.password,
					}
				});
				if(extraction.data.base.code == '000000') {
					// this.password='';
					// this.showpwd='';
					this.extractioninfo = extraction.data.data;
					this.$api.msg(extraction.data.base.msg)
					this.$data.btndisabl = false;
					setTimeout(()=>{
						uni.reLaunch({
							url: "./user",
						});
					}, 2000);
				}else{
					// this.password=''
					// this.showpwd=''				
					console.log(this.password)
					this.$api.msg(extraction.data.base.msg)
					this.$data.btndisabl = false;
					// setTimeout(()=>{
					// 	uni.reLaunch({
					// 		url: "./user",
					// 	});
					// }, 2000);
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
								"type": 'withdraw',
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
				if (this.password == '') {
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
		background: #F6F6F6;
	}

	.extract_list {
		background-color: #ffffff;
		padding: 0 30upx 40upx;
		box-sizing: border-box;

		.extract_num {
			padding: 32upx 0 30upx 0;
			box-sizing: border-box;
			border-bottom: 1px solid #e8e8e8;
			color: rgba(51, 51, 51, 1);
			font-size: 32upx;

			text {
				font-size: 24upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
			}

			.num_input {
				margin-top: 12upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.applyNum{
					font-size:60upx;
					font-weight:bold;
				}

				.whole {
					font-size: 28upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFCA4D;

					image {
						width: 30upx;
						height: 30upx;
					}
				}
			}
		}
	}

	.confirm {
		width: 630upx;
		height: 88upx;
		/* background: #FFCA4D; */
		background: #FD852F;
		border-radius: 40upx;
		margin: 80upx auto 0;
		font-size: 36upx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 88upx;
		text-align: center;
	}
	.explain{
		background-color: #fff;
		border-radius: 10upx;
		width:90%;
		margin: 5% auto 0;
		padding:20upx;
		.tips{
			font-weight: bold;
		}
		.tipsBox{
			margin-top:2%;
			font-size: 13px;
			color:#999;
		}
	}

	.input-placeholder {
		color: rgba(153, 153, 153, 1);
	}
</style>
