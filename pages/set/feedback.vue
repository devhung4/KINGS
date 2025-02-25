<template>
	<view class="feedback">
		<!-- <view class="contac">
			<text>联系方式</text>
			<view class="contac_input">
				<input type="number" v-model="phone" placeholder="请填写联系方式" />
			</view>
		</view> -->
		<!-- <view class="upload">
			<view class="audio_title">
				<text class="audt">上传身份证照片</text>
			</view>
			<view class="sfz">
				<!-- 身份证正反面 -->
				<!-- <view class="uni-list list-pd">
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
												<image src="../../static/img/identityfm.png" mode=""></image>
											</view>
										</block>
									</view>
									<view style="width: 48%;">
										<view class="img666" v-if="!reverseshow">
											<image :src="reverseimage" mode=""></image>
										</view>  
										<block v-if="reverseshow">
											<view class="img666" @tap="reverseClick">
												<image src="../../static/img/identityzm.png" mode=""></image>
											</view>
										</block>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view> -->
		<view class="feedbacktxt">
			<textarea placeholder="输入意见反馈内容..." v-model="backcontent"></textarea>
		</view>
		<view class="btnsubmit">
			<button @tap="submitclick" :disabled="btndisstu">提交</button>
		</view>
		<view class="showmodel" v-if="showmodel" @click="closemodel">
			<view class="modelwin">
				<view class="title">
					<image src="../../static/img/success.png"></image><text>提交成功</text>
				</view>
				<view class="modelbody">感谢您的宝贵意见，我们正在努力做得更好</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {pathToBase64, base64ToPath} from '../../common/image-tools/index.js';
	import {
	    mapState,
		mapMutations
	} from 'vuex';  
	export default {
		 data() {
			return {
				phone:"",
				positiveimage:"",
				reverseimage:"",
				positiveshow:true,
				reverseshow:true,
				faceImageBase64:"",
				backImageBase64:"",
				backcontent:"",
				showmodel:false,
				btndisstu:false
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			// 上传正面图片
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
							that.$data.faceImageBase64 = base64;
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
			// 上传反面图片
			reverseClick(){
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
							that.$data.backImageBase64 = base64;
							that.upimg(base64,2);
						}).catch(error => {
							console.log('error:', error);
							that.$api.msg("当前网络不佳");
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
					if(type==1){
						that.$data.positiveshow = false;
						that.$data.positiveimage = fileupload.data.data;
					}
					if(type==2){
						that.$data.reverseshow = false;
						that.$data.reverseimage = fileupload.data.data;
					}
				}else{
					that.$api.msg(fileupload.data.base.msg);
				}
			},
			// 提交信息
			async submitclick(){
				let that = this;
				if(that.$data.backcontent==""){
					that.$api.msg("请输入反馈内容");
					return;
				}else{
					that.$data.btndisstu = true;
					let savefeedback = await that.$request.post('/user/feedback/save', {
						"data": {
							"contract": that.$data.phone,
							"content": that.$data.backcontent,
							"uid": that.userInfo.userId,
							"faceImage": that.$data.positiveimage,
							"backImage": that.$data.reverseimage
						}
					});
					if(savefeedback.data.base.code == "000000"){
						that.$data.btndisstu = false;
						this.$data.showmodel = true;
						setTimeout(function(){
							uni.switchTab({
								url:"../user/user"
							})
						},3000);
					}else{
						that.$data.btndisstu = false;
						that.$api.msg(savefeedback.data.base.msg);
						that.$data.phone = "";
						that.$data.positiveimage = "";
						that.$data.reverseimage = "";
						that.$data.positiveshow = true;
						that.$data.reverseshow = true;
						that.$data.faceImageBase64 = "";
						that.$data.backImageBase64 = "";
						that.$data.backcontent = "";
						that.$data.showmodel = false;
						that.$data.btndisstu = false;
					}
				}
			},
			// 关闭弹窗
			closemodel(){
				// this.$data.showmodel = false;
			}
		}
	}
</script>

<style lang='scss' scoped>
	page {
		background: rgba(240, 240, 240, 1);
	}
	.contac {
		margin-top: 20upx;
		height:120upx;
		background:rgba(255,255,255,1);
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 38upx 30upx;
		font-size:32upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(51,51,51,1);
		.contac_input {
			padding-left: 40upx;
		}
		
	}
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
			padding-left: 20upx;
			box-sizing: border-box;
			font-size: 30upx;
			font-weight: bolder;
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
	/* 身份证正反面 */
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
	.audio_title:before,.feedbacktxt:before {
		position: absolute;
		content: "";
		height: 40upx;
		border-left: 10upx solid #FD852F;
	}
	.feedbacktxt{
		background: #fff;
		margin: 20upx 0;
		padding: 5%;
		textarea{
			width: 95%;
			margin: 0 0 0 3%;
			font-size: 30upx;
		}
	}
	.btnsubmit{
		button{
			/* background: rgba(232, 65, 112, 1); */
			background-color: #FD852F;
			color: #FFFFFF;
			width: 90%;
			margin: 5% auto;
		}
	}
	.showmodel{
		position: fixed;
		background: rgba(0,0,0,0.5);
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		
		.modelwin{
			background: #fff;
		    position: absolute;
		    width: 80%;
		    top: 30%;
		    left: 0;
		    right: 0;
		    text-align: center;
		    padding: 10% 5%;
		    border-radius: 5px;
		    margin: 0 auto;
			.title{
			    margin-bottom: 5%;
				image{
				    width: 60upx;
				    height: 60upx;
				    vertical-align: middle;
				    margin-right: 5%;
				}
				text{
				    color: #E84170;
				    font-weight: bolder;
				}
			}
			.modelbody{
			    color: #999999;
			    font-size: 32upx;
			    line-height: 60upx;
			}
		}
	}
</style>
