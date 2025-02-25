<template>
	<view class="container">
		<view class="top-status_bar"></view>
		<view class="back-btn yticon " @click="navBack">
			<image src="~@/static/btnbacknormal.png" mode=""></image>
		</view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<!-- <view class="left-top-sign"><image src="../../static/bg3x.png"></image></view> -->
		<view class="left-top-sign"><image src=""></image></view>
		<view class="welcome">{{$t('forgetpsd.index1')}}</view>
		<view class="wrapper">
			<view class="input-content">
				<view class="input-item" v-show="adtype">
					<!-- <text class="tit">手机号</text> -->
					<image src="../../static/phone.png" class="input-icon"></image>
					<input type="number" v-model="account" 
						:placeholder="$t('forgetpsd.index2')"
						placeholder-class="input-empty"
						maxlength="11"/>
				</view>
				<view class="input-item" v-show="!adtype">
					<!-- <text class="tit">手机号</text> -->
					<image src="../../static/mail.png" class="input-icon"></image>
					<input type="text" v-model="mail" 
						:placeholder="$t('forgetpsd.index3')"
						placeholder-class="input-empty"
						maxlength="40"/>
				</view>
				
				
				<view class="input-item">
					<image src="../../static/code@3x.png" class="input-icon"></image>
					<view class="phonecode"><input type="number" v-model="code" 
						:placeholder="$t('forgetpsd.index4')"
						placeholder-class="input-empty"
						maxlength="11" />
					<button class="getcode" :disabled="btndisabl"
						@click="getcode">{{ text }}</button></view>
				</view>
				<view class="input-item">
					<!-- <text class="tit">新密码</text> -->
					<view style="display: flex;justify-content: space-around;align-items: center;">		
					<image src="../../static/key@3x.png" class="input-icon"></image>
					<input
					    :type='rememberLook?"text":"password"'
						:placeholder="$t('forgetpsd.index5')"
						placeholder-class="input-empty"
						maxlength="20"
						style= "background-color:transparent;border:0;outline: none;font-size: 30upx;"
						data-key="newPassword"
						@input="inputChange1"
					/>
					</view>
					<view class="RememberLook">
							<image class="check-look"  @tap="rememberLook = !rememberLook" 
								:src="rememberLook?'../../static/see.png':'../../static/nosee.png'"></image>
					</view>
				</view>
				<view class="input-item">
					<!-- <text class="tit">新密码</text> -->
					<image src="../../static/key@3x.png" class="input-icon"></image>
					<input type="password"
						:placeholder="$t('forgetpsd.index6')"
						placeholder-class="input-empty"
						maxlength="20"
						password
						data-key="oldPassword"
						@input="inputChange2"
					/>
				</view>
				
			</view>
			<view class="adtype" v-show="adtype" @click="adtypeChange">
				<view class=""><image  src="../../static/img/yjfk.png"></image></view>
				<view class="adtype_txt">{{$t('forgetpsd.index7')}}</view>
			</view>
			<view class="adtype" v-show="!adtype" @click="adtypeChange">
				<view class=""><image  src="../../static/img/yjfk.png"></image></view>
				<view class="adtype_txt">{{$t('forgetpsd.index8')}}</view>
			</view>
			<button class="confirm-btn" :disabled="logining" @click="find">{{$t('forgetpsd.index9')}}</button>
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
			rememberLook:false,
			adtype:true,
			account: '',
			mail:'',
			oldPassword: '',
			newPassword: '',
			code: '',
			logining: false,
			btndisabl: false,
			text: this.$t('forgetpsd.index10'),
			codedata:'',
			passwordata:'',
			modes:0,
		};
	},
	onLoad() {},
	computed: {
		...mapState(['hasLogin', 'userInfo'])
	},
	methods: {
		...mapMutations(['login','logout']),
		
		// 选择修改邮箱还是手机号
		adtypeChange(){
			this.mobile = '';
			this.adtype = !this.adtype
		},
		
		
		
		inputChange1(e) {
			this.newPassword = e.detail.value;
		},
		inputChange2(e) {
			this.oldPassword = e.detail.value;
		},
		navBack() {
			uni.navigateBack();
		},

		async find() {
			let that = this;
			let account = '';
			try{
				if (that.$data.newPassword == '') {
					that.$api.msg(this.$t('findpsd.index13'));
				} else if (that.$data.oldPassword !== that.$data.newPassword) {
					that.$api.msg(this.$t('forgetpsd.index11'));
				} else if (that.$data.code == '') {
					that.$api.msg(this.$t('findpsd.index14'));
				} else {
					that.$data.logining = true;
					if(that.adtype){
						that.modes = 0
						account = that.account
					}else{
						that.modes = 1
						account = that.mail
					}
					
					let result = await that.$request.post('/uc/reset/login/password', {
						data: {
							account: account,
							password: that.newPassword,
							code: that.code,
							mode: that.modes //0--手机号，1--邮箱
						}
					});
					if (result.data.code == 0) {
						that.$data.logining = false;
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/public/login'
							});
						}, 1000);
					} else {
						that.$api.msg(result.data.message);
						that.$data.logining = false;
					}
				}
			}catch(e){
				console.log(e);
				that.$api.msg(this.$t('forgetpsd.index12'));
				that.$data.logining = false;
			}
			
		},
		// 获取验证码
		async getcode() {
			let that = this;
			if (that.$data.account == ''&&that.$data.mail == '') {
				that.$api.msg(this.$t('forgetpsd.index13'));
			}else{
				that.$data.btndisabl = true;
				if(that.adtype){
					let data = await that.$request.post('/uc/mobile/reset/code', {
						data: {
							account: that.account,
							challenge: '',
							validate: '',
							seccode: ''
						}
					});
				that.codedata = data
				}else{
					let data = await that.$request.post('/uc/reset/email/code', {
						data: {
							account: that.mail,
							challenge: '',
							validate: '',
							seccode: ''
						}
					});
					that.codedata = data
				}				
				if (that.codedata.data.code == 0) {
					that.$api.msg(this.$t('findpsd.index9'));
					let counter = 60;
					let timer = setInterval(() => {
						that.$data.text = counter + 's';
						counter--;
						if (counter == -1) {
							clearInterval(timer);
							that.$data.text = this.$t('findpsd.index8');
						}
					}, 1000);
					that.$data.btndisabl = false;
				} else {
					that.$api.msg(that.codedata.data.message);
					that.$data.btndisabl = false;
				}
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
		.RememberLook{
					display: inline-block;
					font-size:$font-base;
					width:48upx;
					.check-look{
						width: 48upx;
						height: 48upx;
						margin: 0 7px 0upx 200upx;
						vertical-align: middle;
						outline: none;
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
	.adtype{
		display: flex;
		justify-content: flex-start;
		margin: 20upx 7% 0upx;	
		.adtype_txt{
			margin-left: 12upx;
			height: 56upx;
			line-height: 56upx;
			font-size: 30upx;	
			color: #666666;
		}
		image{
			width: 56upx;
			height: 56upx;
		}
	}
</style>
