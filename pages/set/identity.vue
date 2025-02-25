<template>
	<view>
		<view class="orderlist">
			<view class="list">
				<view class="number" :style="step1==1?'background:rgba(232,65,112,1);':''">1</view>
				<view class="item">支付认证</view>
			</view>
			<div class="line"></div>
			<view class="list">
				<view class="number" :style="step2==2?'background:rgba(232,65,112,1);':''">2</view>
				<view class="item">填写信息</view>
			</view>
			<div class="line"></div>
			<view class="list">
				<view class="number" :style="step3==3?'background:rgba(232,65,112,1);':''">3</view>
				<view class="item">人脸识别</view>
			</view>
		</view>
		
		
		
		<view class="content">
			
			<view v-show="show1">
				<view class="pay">
					<view >支付金额</view>
					<view class="money">￥{{amount}}</view>
				</view>	
				<view @click="confirm()">
					<Button content="确认支付" ></Button>
				</view>
				
			</view>

			<view class="identitybox" v-show="show2">
				<view class="input">
					<view class="name">
						<view class="realname">
							真实姓名
						</view>
						<input type="text" value="" placeholder="请填写您的姓名" v-model="username"/>
					</view>
					
					<view class="middle">
						<view class="linetwo"></view>
					</view>
					
					<view class="name">
						<view class="realname">
							身份证号
						</view>
						<input type="text" value="" placeholder="请填写您的身份证件号码" v-model="idCard"/>
					</view>
					<view class="middle">
						<view class="linetwo"></view>
					</view>
					
					<view class="upload">
						<view class="audio_title">
							<text class="audt">手持身份证照</text>
						</view>
						<view class="sfz">
							<view class="uni-list list-pd">
								<view class="uni-list-cell cell-pd">
									<view class="uni-uploader">
										<view class="uni-uploader-body">
											<view class="identity">
												<view style="width: 48%;">
													<view class="img666" v-if="!positiveshow">
														<image :src="positiveimage" mode=""></image>
													</view>  
													<block v-if="positiveshow">
														<view class="img666" @tap="positiveClick">
															<image src="../../static/sf.png" mode=""></image>
														</view>
													</block>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view @click="next">
					<Button content="下一步"></Button>	
				</view>
			</view>
			
			<view class="face" v-show="show3">
				<view class="photo">
					<image src="../../static/img/img.png" mode=""></image>
				</view>
				<view @click="takephoto">
					<Button content="开始识别" ></Button>
				</view>
			</view>
			
		</view>
	
		
	</view>
</template>

<script>
	import Button from '../../components/button.vue'
	import {pathToBase64, base64ToPath} from '@/common/image-tools/index.js';
	export default {
		data() {
			return {
				step1:1,
				step2:0,
				step3:0,
				show1:true,
				show2:false,
				show3:false,
				id:'',
				username:'',
				idCard:'',
				amount:0,
				step:0,
				positiveshow:true,
				positiveimage:"",
			}
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			this.id = userInfo.userId;
			this.getRecord();
			uni.$on("handle",()=>{
				this.step2=2;
				this.show1=false;
				this.show2=true;
			})
		},
		methods:{
			async confirm(){

				let result = await this.$request.post('/uc/save',{
					"data": {
						"uid": this.id,
						"step": 1
					}
				});
				let results=result.data.data;
				console.log(results);
				if(this.amount > 0 ) {
					uni.setStorageSync("shoptype",3);
					uni.setStorageSync("coamount",this.amount);
					uni.setStorageSync("coorderno",results.orderNo.toString());
					uni.setStorageSync("coorderid",results.orderNo.toString());
					uni.navigateTo({
						url:'../money/pay'
					})
				} else {
					this.step2 = 2;
					this.show1 = false;
					this.show2 = true;
				}
				
			},
			async next(){
				if (this.username == '') {
					return uni.showToast({
						title: '请输入姓名',
						duration: 1000,
						icon: 'none'
					});
				} else if (this.idCard == '') {
					return uni.showToast({
						title: '请输入身份证号',
						duration: 1000,
						icon: 'none'
					});
				} else if (this.positiveimage == '') {
					return uni.showToast({
						title: '请上传手持身份证照',
						duration: 1000,
						icon: 'none'
					});
				} else {
					let result = await this.$request.post('/uc/save',{
						"data": {
							"uid": this.id,
							"step": 2,
							"username":this.username,
							"idCard":this.idCard,
							"handImage":this.positiveimage
						}
					});
					uni.setStorageSync("uid",this.id);
					uni.setStorageSync("username",this.username);
					uni.setStorageSync("idCard",this.idCard);
					uni.setStorageSync("handImage",this.positiveimage);
					console.log(result);
					this.step3=3;
					this.show2=false;
					this.show3=true
				}
				
			},
			takephoto() {
				uni.navigateTo({
					url:'./takephoto'
				})
			},
			async getRecord() {
				let result = await this.$request.post('/uc/get',{
					"data": {
						"uid": this.id
					}
				});
				console.log(result)
				var amount = result.data.data.config.amount;
				var step = result.data.data.records.step;
				if (step == 2) {
					this.step2 = 2;
					this.show1 = false;
					this.show2 = true;
				}else if (step == 3||step == 4) {
					this.step2 = 2
					this.step3 = 3;
					this.show1 = false;
					this.show2 = false;
					this.show3 = true;
				}
				this.amount = amount;
			},
			// 上传图片
			positiveClick(){
				let that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera '], //从相册选择、使用相机
				    success: (chooseImageRes) => {
						uni.showLoading({  
							title: "上传中",  
							mask: true  
						})
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						pathToBase64(tempFilePaths[0]).then(base64 => {
							that.upimg(base64,1);
						}).catch(error => {
							that.$api.msg(e);
						})
						uni.hideLoading();
				    },
				    fail: (e) => {
				    	console.log("error:"+e);
				    	that.$api.msg("当前网络不佳");
				    }
				});
			},
			// 上传图片
			async upimg(base64,type){
				let that = this;
				let fileupload = await that.$request.post('/file/upload', {
					"data": {
						"imageBase64":base64
					}
				});
				if(fileupload.data.base.code == "000000"){
					that.$data.positiveshow = false;
					that.$data.positiveimage = fileupload.data.data;
				}else{
					that.$api.msg(fileupload.data.base.msg);
				}
			}
		},
		components:{
			Button
		}
	}
</script>

<style lang="scss">
	page {
		background: rgba(246, 246, 246, 1);
	}
	.orderlist{
		background: #FFFFFF;
		margin-top: 20upx;
		width: 100%;
		height: 208upx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 8%;
		box-sizing: border-box;
		.number{
			width: 40upx;
			height: 40upx;
			background: rgba(232,65,112,0.505);
			border-radius: 50%;
			font-size: 32upx;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.list{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.line{
			width:170upx ;
			height: 2upx;
			background: rgba(232,65,112,0.505);
			position: relative;
			top: -20upx;
		}
		.item{
			font-size: 24upx;
			margin-top: 10upx;
		}
	}
	.pay{
		background: #FFFFFF;
		margin-top: 20upx;
		width: 748upx;
		margin-left: 2upx;
		height: 120upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 28upx;
		padding-right: 28upx;
		font-size: 32upx;
		.money{
			font-size: 48upx;
			color: #E84170;
		}
	}
	.input{
		background: #FFFFFF;
		margin-top: 20upx;
		width: 100%;
		// height: 242upx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		font-size: 32upx;
		.name{
			display: flex;
			align-items: center;
			height: 120upx;
			margin-left: 30upx;
			.realname{
				margin-right: 40upx;
			}
			
		}
		.middle{
			width: 100%;
			display: flex;
			justify-content: center;
			.linetwo{
				width: 690upx;
				height: 2upx;
				background: rgba(232,232,232,1);
			}
		}
		/* 身份证 */
		.upload {
			padding: 28upx 30upx 40upx 30upx;
			box-sizing: border-box;
			background: #FFFFFF;
			margin-top: 20upx;
			height:350upx;
		}
		.audio_title {
			height: 56upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30upx;
		
			.audt {
				box-sizing: border-box;
				font-size: 32upx;
				color: rgba(51, 51, 51, 1);
				line-height: 50upx;
			}
		
			.recommend {
				width: 32upx;
				height: 40upx;
		
				image {
					height: 100%;
					width: 100%;
				}
		
			}
		}
		.texttips{
			background: #f8f8f8;
			padding: 2% 5%;
			font-size: 24upx;
			color: #D5B58D;
		}
		.list-pd {
			border: 0;
		}
		.identity{
			display: flex;
			text-align: center;
			// padding: 4%;
			justify-content: space-between;
			align-items: center;
			.img666{
				image{
					width: 100%;
					height: 200rpx;
				}
			}
		}
	}
	.photo{
		background: #FFFFFF;
		margin-top: 20upx;
		width: 100%;
		height: 782upx;
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			width: 476upx;
			height: 476upx;
		}
	}
</style>
