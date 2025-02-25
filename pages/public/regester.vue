<template>
	<view class="container">
		<view class="top-status_bar"></view>
		<view class="back-btn yticon " @click="navBack">
			<image src="~@/static/btnbacknormal.png" mode=""></image>
		</view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<!-- <view class="left-top-sign"><image src="../../static/bg3x.png"></image></view> -->
		<view class="left-top-sign"><image src=""></image></view>
		<view class="welcome">{{$t('regester.index1')}}</view>
		<view class="wrapper">
			<view class="input-content">
				<view class="input-item">
					<image class="input-icon" src="../../static/country@3x.png"></image>
					<picker class="picke" @change="bindPickerChange" :value="index" :range="array">
						<view class="uni-input">{{ array[index] }}</view>
					</picker>
				</view>
				<view class="input-item">
					<!-- <text class="tit">手机号</text> -->
					<image class="input-icon" src="../../static/user@3x.png"></image>
					<input type="text" :value="username"
						:placeholder="$t('regester.index2')" 
						placeholder-class="input-empty"
						data-key="username" 
						@input="inputChange" />
				</view>
				<view class="input-item" v-show="adtype">
					<!-- <text class="tit">手机号</text> -->
					<image class="input-icon" src="../../static/phone.png"></image>
					<input type="number" :value="phone"
						:placeholder="$t('regester.index3')"
						placeholder-class="input-empty"
						maxlength="11" 
						data-key="phone" 
						@input="inputChange" />
				</view>
				<view class="input-item" v-show="!adtype">
					<image class="input-icon" src="../../static/mail.png"></image>
					<input type="text" :value="mail"
						:placeholder="$t('regester.index4')"
						placeholder-class="input-empty"
						maxlength="40" 
						data-key="mail" 
						@input="inputChange" />
				</view>
				
				<view class="input-item">
					<!-- <text class="tit">验证码</text> -->
					<image class="input-icon" src="../../static/code@3x.png"></image>
					<view class="phonecode"><input type="number" :value="code" 
						:placeholder="$t('regester.index5')"
						placeholder-class="input-empty"
						maxlength="11" 
						data-key="code" 
						@input="inputChange" />
					<button class="getcode" :disabled="btndisabl"
						@click="getcodebefor">{{ text }}</button>
					</view>

					<tfgg-verify @result="verifyResult" ref="verifyElement"></tfgg-verify>
				</view>
				<view class="input-item">
					<!-- <text class="tit">密码</text> -->
					<image class="input-icon" src="../../static/key@3x.png"></image>
					<input
						type="password"
						:value="password"
						:placeholder="$t('regester.index6')"
						placeholder-class="input-empty"
						maxlength="20"
						password
						data-key="password"
						@input="inputChange"
					/>
				</view>
				<!-- <view class="input-item"> -->
				<!-- <text class="tit">支付密码</text> -->
				<!-- <image class="input-icon" src="../../static/pwd.png"></image>
					<input 
						type="text" 
						:value="paypassword" 
						placeholder="请输入支付密码"
						placeholder-class="input-empty"
						maxlength="20"
						password
						data-key="paypassword"
						@input="inputChange"
					/>
				</view> -->
				<view class="input-item">
					<!-- <text class="tit">邀请码</text> -->
					<image class="input-icon" src="../../static/invite@2x.png"></image>
					<input type="text" :value="promotion" 
						:placeholder="$t('regester.index7')"
						placeholder-class="input-empty"
						data-key="promotion" 
						@input="inputChange" />
				</view>
			</view>
			<view class="adtype" v-show="adtype" @click="adtypeChange">
				<view class=""><image  src="../../static/img/yjfk.png"></image></view>
				<view class="adtype_txt">{{$t('regester.index8')}}</view>
			</view>
			<view class="adtype" v-show="!adtype" @click="adtypeChange">
				<view class=""><image  src="../../static/img/yjfk.png"></image></view>
				<view class="adtype_txt">{{$t('regester.index9')}}</view>
			</view>
			<button class="confirm-btn" :disabled="loding" 
				@click="toLogin">{{$t('regester.index1')}}</button>
			<view class="login-section">{{$t('regester.index10')}}?<text 
				@click="navtoagree(2)">{{$t('regester.index11')}}</text></view>
			<!-- <view class="register-section">已阅读并同意<text 
				@click="navtoagree(17)">《用户协议》</text></view> -->
		</view>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
// import md5 from '../../common/md5.js';
import tfggVerify from '../../components/tfgg-verify/tfgg-verify.vue';
import lang from '@/i18n/index.js'

export default {
	data() {
		return {
			adtype:true,
			country: '中国',
			phone: '',
			mail:'',
			password: '',
			username: '',
			code: '',
			promotion: '',
			paypassword: '',
			text: this.$t('regester.index12'),
			index: 0,
			btndisabl: false,
			loding: false,
			array: [],
			res2:'',
		};
	},
	onLoad() {
		this.getCountry();
		
	},
	components: {
		'tfgg-verify': tfggVerify
	},
	methods: {
		...mapMutations(['login']),
		// 选择修改邮箱还是手机号
		adtypeChange(){
			this.mobile = '';
			this.adtype = !this.adtype
		},
		
		/* 校验结果回调函数 */
		verifyResult(res) {
			if (res) {
				this.$refs.verifyElement.reset(); //校验成功重置插件
				console.log('验证成功');
				this.getcode();
			}
			console.log('校验成功重置插件======' + res);
		},
		/* 显示校验弹窗 */
		verifyFasong() {
			this.$refs.verifyElement.show();
		},
		/* 校验插件重置 */
		verifyReset() {
			this.$refs.verifyElement.reset();
			console.log('校验插件重置');
		},
		bindPickerChange: function(e) {
			this.index = e.target.value;
			this.country = this.array[this.index];
		},
		inputChange(e) {
			const key = e.currentTarget.dataset.key;
			this[key] = e.detail.value;
		},
		navBack() {
			uni.navigateBack();
		},
		toRegist() {
			this.$api.msg(this.$t('regester.index13'));
		},
		// 协议
		navtoagree(type) {
			if(type==17){
				uni.navigateTo({
					url: './agremment?type=' + type
				});
			}else{
				uni.navigateTo({
					url: '/pages/public/login'
				});
			}
			
		},
		getcodebefor() {
			let that = this;
			if (that.$data.phone == ''&& that.$data.mail =='') {
				that.$api.msg(this.$t('regester.index14'));
			} else {
				that.verifyFasong();
			}
		},
		// 获取地区信息
		async getCountry() {
			let that = this;
			let resultdata = await that.$request.post('/uc/support/country', {
				data: {}
			});
			if (resultdata.data.code == 0) {
				let countryInfo = resultdata.data.data;
				for (let i = 0; i < countryInfo.length; i++) {
					if(lang.locale != 'zh'){
						this.array.push(countryInfo[i].enName);
					}else{
						this.array.push(countryInfo[i].zhName);
					}
				}
			} else {
				that.$api.msg(resultdata.data.message);
			}
		},
		async toLogin() {
			let that = this;
			if (that.$data.username == '') {
				that.$api.msg(this.$t('regester.index15'));
			} else if (that.$data.phone == ''&& that.$data.mail =='') {
				that.$api.msg(this.$t('regester.index16'));
			} else if (that.$data.code == '') {
				that.$api.msg(this.$t('regester.index17'));
			} else if (that.$data.password == '') {
				that.$api.msg(this.$t('regester.index18'));
			}
			// else if(that.$data.promotion == ""){
			// 	that.$api.msg('请填写邀请码');
			// }
			else {
				that.$data.loding = true;
                 
                   // 手机注册
                 if(that.adtype){
					 
					 let res1 = await that.$request.post('/uc/register/phone', {
					 	data: {
					 		country: that.$data.country,
					 		username: that.$data.username,
					 		code: that.$data.code,
					 		phone: that.$data.phone,
					 		password: that.$data.password,
					 		promotion: that.$data.promotion,
					 		ticket: 'fgad',
					 		randStr: 'ergwerg',
					 		userType: 0,
					 		realName: '',
							resdata:'',
					 	}
					 });
					 that.res2 = res1
				 }else{
					 //邮箱注册
					 let res1 = await that.$request.post('/uc/register/emailCode', {
					 	data: {
					 		country: that.$data.country,
					 		username: that.$data.username,
					 		code: that.$data.code,
					 		email: that.$data.mail,
					 		password: that.$data.password,
					 		promotion: that.$data.promotion,
					 		ticket: 'fgad',
					 		randStr: 'ergwerg',
					 		userType: 0,
					 		realName: ''
					 	}
					 });
					 that.res2 = res1
					 that.$data.loding = false;
					 
				 }
				
				 console.log(that.res2,"res2","mail","外")
				
				if (that.res2.data.code == 0) {
					uni.navigateTo({
						url: '/pages/public/login'
					});
					that.$data.loding = false;
				} else {
					that.$api.msg(that.res2.data.message);
					that.$data.loding = false;
				}
			}
		},
		
        // 获取验证码
		async getcode() {
			let that = this;
			that.$data.btndisabl = true;
			
              if(that.adtype){
				  // 手机验证
				  let resultdata = await that.$request.post('/uc/mobile/code', {
				  	data: {
				  		phone: this.phone,
				  		country: this.country
				  	}
				  });
				  that.resdata = resultdata
			  }else{
				  // 邮箱验证
				  let resultdata = await that.$request.post('/uc/sendVerificationCode', {
				  	data: {
				  		email:this.mail
				  	}
				  });
				  that.resdata = resultdata
			  }
			   
			if (that.resdata.data.code == 0) {
				
				that.$api.msg(this.$t('regester.index19'));
				let counter = 60;
				let timer = setInterval(() => {
					that.$data.text = counter + 's';
					counter--;
					if (counter == -1) {
						clearInterval(timer);
						that.$data.text = this.$t('regester.index20');
					}
				}, 1000);
				that.$data.btndisabl = false;
			} else {
				that.$api.msg(that.resdata.data.message);
				that.$data.btndisabl = false;
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
		margin: 56upx 0 0 7%;
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
	    margin: 10upx auto 58upx;
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
		margin-top: 50upx;
		border-radius: 44upx;
		color: #FFFFFF; 
		font-size: 36upx;
	}
	.register-section{
		position: fixed;bottom:40upx;left: 0;right: 0;
		text-align: center;
		z-index:100;
		font-size: $font-base;
		text{
			color: #00a7eb;
		}
	}
	.login-section {
		font-size: $font-base;
		text-align: center;
		margin: 30upx auto 0;
		text {
			margin-left: 12upx;
			color:#00a7eb;
		}
	}
	.adtype{
		display: flex;
		justify-content: flex-start;
		margin: 30upx 7% 0upx;	
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
