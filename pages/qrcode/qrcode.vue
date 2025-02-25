<template>
	<view class="content b-t">
		<image :src="userInfo.inviteQrcode" style="width: 200px;height: 200px;display: block;margin: 20px auto;"></image>
		<text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
			二维码二维码二维码二维码二维码二维码二维码
		</text>
		<text @click="voice">语音输入</text>
		<text>语音输入结果为：{{text}}</text>
		<button class="add-btn" @click="save3" style="bottom: 130px;">从相册选择图片</button>
		<button class="add-btn" @click="save2" style="bottom: 70px;">保存二维码</button>
		<button class="add-btn" @click="save">拍照并保存</button>
	</view>
</template>

<script>
	import {
	    mapState 
	} from 'vuex';  
	export default {
		data() {
			return {
				text:''
			}
		},
		onLoad(option){
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			voice(){
				
				var me = this;
				
				var options = {};
				
				options.engine = 'iFly';
				
				options.punctuation = false; // 是否需要标点符号
				
				options.timeout = 10 * 1000;
				
				plus.speech.startRecognize(options, function(s) {
				
				me.searchText = me.searchText + s;
				this.text = me.searchText
				
				// uni.navigateTo({
				
				// url: '../search/search?searchdata=' + me.searchText
				
				// });
				
				me.searchText = ""
				
				plus.speech.stopRecognize();
				
				});
				
			},
			save(){
				uni.chooseImage({
				    count: 1,
				    sourceType: ['camera'],
				    success: function (res) {
				        uni.saveImageToPhotosAlbum({
				            filePath: res.tempFilePaths[0],
				            success: function () {
				                console.log('save success');
				            }
				        });
				    }
				});
			},
			save3(){
				uni.chooseImage({
				    count: 1,
				    sourceType: ['album'],
				    success: function (res) {
				        uni.saveImageToPhotosAlbum({
				            filePath: res.tempFilePaths[0],
				            success: function () {
				                console.log('save success');
				            }
				        });
				    }
				});
			},
			save2(){
				uni.downloadFile({
				    url: this.userInfo.inviteQrcode, //仅为示例，并非真实的资源
				    success: (res) => {
				        if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.showToast({
										title: "保存成功",
										icon: "none"
									});
								},
								fail: function() {
									uni.showToast({
										title: "保存失败，请稍后重试",
										icon: "none"
									});
								}
							});
				        }
				    }
				});
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
