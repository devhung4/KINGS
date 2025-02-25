<template>
	<view class="container">
		<view class="top-status_bar"></view>
		<view class="back-btn yticon " @click="navBack">
			<image src="~@/static/btnbacknormal.png" mode=""></image>
		</view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<!-- <view class="left-top-sign">
			<image src="../../static/bg3x.png"></image>
		</view> -->
		<view class="welcome" v-show="gettype">{{$t('resetpaypsd.index1')}}</view>
		<view class="welcome" v-show="!gettype">{{$t('resetpaypsd.index2')}}</view>
		<view class="wrapper">
			<view class="input-content">
				<view class="input-item">
					<!-- <text class="tit">新密码</text> -->
					<image src="../../static/key@3x.png" class="input-icon"></image>
					<input
						type="number"
						v-model="newPassword"
						:placeholder="$t('resetpaypsd.index3')"
						placeholder-class="input-empty"
						maxlength="20"
						password
					/>
				</view>
				<view class="input-item" v-show="typesel">
					<!-- <text class="tit">验证码</text> -->
					<image src="../../static/code@3x.png" class="input-icon"></image>
					<view class="phonecode"><input type="number" v-model="code" 
						:placeholder="$t('resetpaypsd.index4')"
						placeholder-class="input-empty"
						maxlength="11" />
					<button class="getcode" :disabled="logining"
						@click="getcode">{{ text }}</button></view>
				</view>
				<view class="input-item" v-show="!typesel">
					<!-- <text class="tit">验证码</text> -->
					<image src="../../static/code@3x.png" class="input-icon"></image>
					<view class="phonecode"><input type="number" v-model="code" 
						:placeholder="$t('resetpaypsd.index5')"
						placeholder-class="input-empty"
						maxlength="11" />
					<button class="getcode" :disabled="logining"
						@click="getcode">{{ text }}</button></view>
				</view>
				
				
			</view>
			<button class="confirm-btn" @click="find" :disabled="btndisabl">{{$t('resetpaypsd.index6')}}</button>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import app from '../../App.vue';
import md5 from '../../common/md5.js';
export default {
	data() {
		return {
			typesel : true,
			mobile: '',
			newPassword: '',
			code: '',
			logining: false,
			btndisabl: false,
			text: this.$t('resetpaypsd.index7'),
			resdataCode:'',
			codeType:'',
			gettype:true,
		};
	},
	onLoad() {},
	computed: {
		...mapState(['hasLogin', 'userInfo'])
	},
	onShow() {
		this.getuserInfo();
	},
	methods: {
		...mapMutations(['login']),
		
		// 获取用户信息
		getuserInfo(){
			console.log(this.userInfo,'1111')
			if(this.userInfo.email == ''){
				this.typesel = true
			}else{
				this.typesel = false
			}
			let fundsVerif = uni.getStorageSync("fundsVerif")
			if(fundsVerif == 0){
				this.gettype = true
			}else{
				this.gettype = false
			}
			// if(this.userInfo.)
		},
		
		navBack() {
			uni.navigateBack();
		},

		async find() {
			let that = this;	
			if(!that.typesel){
				that.codeType = 1
			};
			if (that.$data.newPassword == '') {
				that.$api.msg(this.$t('resetpaypsd.index3'));
			} else if (that.$data.code == '') {
				that.$api.msg(this.$t('resetpaypsd.index4'));
			} else {
				that.$data.btndisabl = true;	
				let result = await that.$request.post('/uc/approve/reset/transaction/password',{
					header: {
						 'x-auth-token':uni.getStorageSync('token'),
						 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
					},
					"data": {
						"newPassword": that.newPassword,
						"code": that.code,
						"codeType":that.codeType,
					}
				});
				if(result.data.code==0){
					setTimeout(()=>{
						uni.navigateTo({
							url: '/pages/set/set'
						});
					}, 1000);
					that.$data.btndisabl = false;
				}else{
					that.$api.msg(result.data.message);
					that.$data.btndisabl = false;
				}
			}
		},

        // 获取验证码
		async getcode() {
			let that = this;
			that.$data.logining = true;
			if(that.typesel){
				let data = await that.$request.post('/uc/mobile/transaction/code', {
					header: {
						 'x-auth-token':uni.getStorageSync('token'),
						 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
					},
					 data:{}
				});
				that.resdataCode = data
			}else{
				let data = await that.$request.post('/uc/mobile/update/password/code', {
					header: {
						 'x-auth-token':uni.getStorageSync('token'),
						 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
					},
					 data:{
						 type: 1,
					 }
				});
				that.resdataCode = data
			}
			
			if (that.resdataCode.data.code == 0) {
				that.$api.msg(this.$t('resetpaypsd.index8'));
				let counter = 60;
				let timer = setInterval(() => {
					that.$data.text = counter + 's';
					counter--;
					if (counter == -1) {
						clearInterval(timer);
						that.$data.text = this.$t('resetpaypsd.index7');
					}
				}, 1000);
				that.$data.logining = false;
			} else {
				that.$api.msg(that.resdataCode.data.message);
				that.$data.logining = false;
			}
		}
	}
};
</script>

<style lang="scss">
.wrapper {
		position: relative;
		z-index: 90;
		padding-bottom: 40upx;
	}
	.back-btn {
		margin: 66upx 0 0 7%;
		image{
			width: 44upx;
			height: 44upx;
		}
	}
	.left-top-sign {
		display: inline-block;
		font-size: 100upx;
	    position: fixed;
	    top: 0;
	    right: 0;
		width: 340upx;
		height: 208upx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.welcome {
		width: 630upx;
	    margin: 40upx auto 58upx;
	    font-size: 50upx;
	    color: #00a7eb;
	    border-bottom: 1px solid #00a7eb;
	    padding-bottom: 40upx;
	}
	.input-content {
		padding: 0 60upx;
	}
	.input-item {
		display: flex;
		align-items: center;
		border-bottom: 1upx solid #EEEEEE;
		margin: 6% 0 3%;
		padding-bottom: 3%;
		.input-icon{
			width: 20px;height: 20px;margin-right: 3%;
		}
		.picke{
		    width: 85%;
		}
		.tit {
			height: 40%;
			line-height: 56upx;
			font-size: $font-sm + 2upx;
			color: $font-color-base;
		}
		input {
			width: 82%;
			height: 60upx;
			font-size: $font-lg;
		}
		.phonecode {
			width: 85%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			input {
				width: 60%;
			}
		}
		.getcode {
		    font-size: $font-base;
		    font-family: PingFangSC-Medium, "PingFang SC";
		    color: #00a7eb;
		    border: none;
		    background: none;
			&::after{
				border: none;
			}
		}
	}

	.confirm-btn {
		height: 88upx;
		width: 84%;
		line-height: 88upx;
		background-color: #00a7eb;
		border: none;
		margin-top: 80upx;
		border-radius: 44upx;
		color: #FFFFFF; 
		font-size: 36upx;
	}
</style>
