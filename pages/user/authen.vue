<template>
	<view class="box">
		<view class="boxone">
			<view class="name inputli">
				<view class="nameone">{{$t('authen.index1')}}：</view>
				<input type="text" v-model="username" :placeholder="$t('authen.index2')"/>
			</view>
			<view class="idcard inputli">
				<view class="nameone">{{$t('authen.index3')}}：</view>
				<input type="text" v-model="idcount" :placeholder="$t('authen.index4')" />
			</view>
		</view>
		<view class="info">
			<view class="video">
				<view class="video_title">
					<text class="audt">{{$t('authen.index5')}}</text>
				</view>
			</view>
			<view class="upimg">
				<!-- <view class="imgtitle">身份证正面 :</view> -->
				<view class="imgbox">
					<image class="huiyuan_img" mode="aspectFit" :src="imagezhen" @click="changeimg(0)"></image>
					<view class="text">{{$t('authen.index14')}}</view>
				</view>
			</view>		
		</view>
		<view class="info">			
			<view class="upimg">
				<!-- <view class="imgtitle">身份证反面 :</view> -->
				<view class="imgbox">
					<image class="huiyuan_img" mode="aspectFit" :src="imagefan" @click="changeimg(1)"></image>
					<view class="text">{{$t('authen.index15')}}</view>
				</view>
			</view>		
		</view>
		<view class="info">
			<view class="upimg">
				<!-- <view class="imgtitle">手持身份证 :</view> -->
				<view class="imgbox">
					<image class="huiyuan_img" mode="aspectFit" :src="imageshou" @click="changeimg(2)"></image>
					<view class="text">{{$t('authen.index16')}}</view>
				</view>
			</view>		
		</view>
		<view class="btn">
			<button type="default" :disabled="flag" @click="subinfo">{{$t('authen.index6')}}</button>
			<view class="authentips">{{$t('authen.index7')}}</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import { pathToBase64, base64ToPath } from '@/common/image-tools/index.js';
	export default {
		computed:{
			...mapState(['hasLogin','userInfo'])
		},	
		data() {
			return {
				imagezhen:'../../static/rhinoImg/icon_id_card_front.png',
				imagefan:'../../static/rhinoImg/icon_id_card_back.png',
				imageshou:'../../static/rhinoImg/icon_people_and_card.png',
				flag:false,
				idcount:'',
				username:'',
				navTitle: this.$t('pageName.index9'),
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
			    title: this.navTitle
			});
		},
		created() {
		},
		onLoad() {
			
		},
		methods: {
			subinfo(){
				if(this.username==''){
					this.$api.msg(this.$t('authen.index8'));
				}else if(this.idcount==''){
					this.$api.msg(this.$t('authen.index9'));
				}else if(this.imagezhen=='../../static/rhinoImg/icon_id_card_front.png'){
					this.$api.msg(this.$t('authen.index10'));
				}else if(this.imagefan=='../../static/rhinoImg/icon_id_card_back.png'){
					this.$api.msg(this.$t('authen.index11'));
				}else if(this.imageshou=='../../static/rhinoImg/icon_people_and_card.png'){
					this.$api.msg(this.$t('authen.index12'));
				}else{
					this.getStatus()
				}
			},
			// 单图片上传
			changeimg(index) {
				let that = this;				
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album', 'camera'], //从相册选择、使用相机
						success: (chooseImageRes) => {							
							const tempFilePaths = chooseImageRes.tempFilePaths;
							pathToBase64(tempFilePaths[0]).then(base64 => {
								// uni.showLoading({
								// 	title: "上传中",
								// 	mask: true
								// })
								that.fileupload(index,base64);
							}).catch(error => {
								that.$api.msg(e);
							})
						},	
						fail: (e) => {
							// that.$api.msg("当前网络不佳");
							console.log(e);
						}
					});				
			},
			
			// 上传图片
			async fileupload(index,base64) {
				let that = this;
				let base = base64.replace(/\ +/g, "").replace(/[ ]/g, "").replace(/[\r\n]/g, "")
				let res1 = await that.$request.post('/uc/upload/oss/base64', {
					header: {
						 'x-auth-token':uni.getStorageSync('token'),
						 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
					},
					"data": {
						"base64Data": base
					}
				});
				if (res1.data.code == 0) {
					// uni.hideLoading();
					if(index==0){
						that.imagezhen=res1.data.data
					}else if(index==1){
						that.imagefan= res1.data.data
					}else if(index==2){
						that.imageshou=res1.data.data
					}
				that.$api.msg(res1.data.message);
				} else {
					that.$api.msg(res1.data.message);
					uni.hideLoading();
				}
			},		
			// 提交
			async getStatus(){
				this.flag=true
				let res = await this.$request.post('/uc/approve/real/name', {
					header: {
						 'x-auth-token':uni.getStorageSync('token'),
						 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
					},
					data:{
						 "uid":this.userInfo.userId,
						 "realName":this.username,//姓名
						 "idCardFront":this.imagezhen, //正面
						 "idCardBack":this.imagefan,//反面
						 "handHeldIdCard":this.imageshou,//手持
						 "idCard":this.idcount,//身份证号
					}										
				});
				if(res.data.code==0){
					this.flag=false
					this.$api.msg(this.$t('authen.index13'));
					setTimeout(function () {
					   uni.reLaunch({
					   	url:'./user'
					   })
					}, 2000);								
				}else{
					this.flag=false
					this.$api.msg(res.data.message);									
				}
			}	
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F6F6F6;
	}
	.box{
		padding-bottom: 200upx;
		background: #FFFFFF;
	}
	.boxone{
		background-color: white;
		font-size: 30upx;
	    padding: 0 5%;
	    margin-top: 20upx;
		border-bottom: 20upx solid #f6f6f6;
		.inputli{
			display: flex;
			align-items: center;
			padding: 3% 0;
		}
		.name{
			border-bottom: 1px solid #E2E2E2;
		}
		input{
			flex: 1;
			height: 70upx;
			font-size: 14px;
			padding-left: 10upx;
		}
	}
	.nameone{
		font-weight: 600;
	}
	.info{
		background-color: white;
	}
	.video {
		// border-bottom: 1px solid #e8e8e8;
		
		padding: 28upx 30upx;
		box-sizing: border-box;
		.video_title {
			height: 56upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.audt {
				padding-left: 20upx;
				box-sizing: border-box;
				font-size:30upx;
				font-family:PingFangSC-Semibold,PingFang SC;
				font-weight:600;
				color:rgba(51,51,51,1);
			}
		}
	}
	.video_title::after {
		position: absolute;
		content:"";
		height: 30upx;
		border-right: 4upx solid #E7AD05;		
	}
	.upimg{
		padding: 3% 0;
		.imgtitle{
			width: 40%;
			height: 102px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32upx;
			font-weight: 600;
		}
		.imgbox{
			width: 75%;
			height: 360upx;
			margin: 0 auto;
			position: relative;
			image{
				width: 100%;
				height: 100%;
			}
			.text{
				width: 100%;
				text-align: center;
				position: absolute;
				top: 70%;
				left: 50%;
				transform: translate(-50%,-50%);
				color: #d9b75d;
			}
		}		
	}
	.btn{
		width: 100%;
		padding: 3% 0;
		background-color: #FFFFFF;
	    border-top: 1px solid #E2E2E2;
	    position: fixed;
	    bottom: 0;
	    left: 0;
	    right: 0;
		button{
			width: 90%;
			color: #FFFFFF;
			font-weight: 600;
			border: none;
			margin: 0 auto;
			background: #E7AD05;
			border-radius: 44upx;
			font-size: 28upx;
		}
		.authentips{
			width: 70%;
			margin: 0 auto;
			color: #999999;
			font-size: 12px;
			text-align: center;
			padding-top: 20upx;
			word-wrap: break-word;
		}
	}
</style>
