<template>
	<view class="takephoto">
		<view class="photo"></view>
		<view class="text">请保持光线充足角度端正</view>
		<view class="buttons">
			<view class="retake" :class="fitst==0?'disabled':''">重拍</view>
			<view class="confirm" @click="takeph">确认拍照</view>
		</view>
	</view>
</template>

<script>
	import {pathToBase64, base64ToPath} from '../../common/image-tools/index.js';
	export default {
		data() {
			return {
				fitst:0,
				id:'',
				username:'',
				idCard:'',
				photoBase64:"",
				handImage:""
			}
		},
		onLoad() {
			
			this.id = uni.getStorageSync("uid");
			this.username = uni.getStorageSync("username");
			this.idCard = uni.getStorageSync("idCard");
			this.handImage = uni.getStorageSync("handImage");
		},
		methods:{
			takeph() {
				uni.chooseImage({
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['camera'], //从相机选择
				    success: res=> {
				        console.log(res.tempFilePaths[0]);
						
						var image = res.tempFilePaths[0];
						 
						pathToBase64(img).then(base64 => {
							this.photoBase64 = base64;
							// console.log(this.photoBase64)
							uni.showLoading({
								title:"实名认证中"
							})
							this.$request.post('/uc/save',{
									"data": {
										"uid": this.id,
										"step": 3,
										"username": this.username,
										"idCard": this.idCard,
										"faceImage": this.photoBase64
									}
								}).then(res =>{
									console.log(res)
									if(res.data.base.code ===  "000000") {
										
										uni.hideLoading();
										uni.$emit("tishi")
										uni.switchTab({
											url:'../user/user'
										})
									}
							
								}).catch(error => {
									console.log(error)
									uni.showToast({
										title:"图片错误",
										icon:"none"
									})
								});				
						
							})						
				    },
				});
				

			}
		}
	}
</script>

<style scoped lang="scss">
	.takephoto{
		background: rgba(0, 0, 0, 0.5);
		width: 100vw;
		height: 100vh;
		text-align: center;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.photo{
		width: 500upx;
		height: 500upx;
		border-radius: 50%;
		background-color: #FFFFFF;
		border: 4upx solid #E84170;
		position: absolute;
		margin: 0 auto;
		top: 256upx;
	}
	.text{
		width: 252upx;
		height: 100upx;
		position: absolute;
		top: 816upx;
		bottom: 418upx;
		color: #FFFFFF;
		font-size: 36upx;
	}
	.buttons{
		display: flex;
		justify-content: space-between;
		position: absolute;
		bottom: 40upx;
		color: #FFFFFF;
		width: 100%;
		padding: 0 60upx 0 60upx;
		.retake{
			border:2upx solid #FFFFFF;
			border-radius: 4upx;
			width: 296upx;
			height: 88upx;
			display: flex;
			justify-content: center;
			align-items: center;
			box-sizing: border-box;
			
		}
		.confirm{
			// border:2upx solid #FFFFFF;
			border-radius: 4upx;
			width: 296upx;
			height: 88upx;
			background: #E84170;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	.disabled{
		background: #CCCCCC;
	}
</style>
