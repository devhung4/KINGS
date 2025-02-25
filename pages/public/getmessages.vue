<template>
	<view class="container">
		<view class="top-status_bar"></view>
		<view class="back-btn yticon " @click="navBack">
			<image src="~@/static/btnbacknormal.png" mode=""></image>
		</view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<!-- <view class="left-top-sign"><image src="../../static/bg3x.png"></image></view> -->
		<view class="welcome" v-show="typesel">{{$t('getmessages.index1')}}</view>
		<view class="welcome" v-show="!typesel">{{$t('getmessages.index2')}}</view>
		<view class="wrapper">
			<view class="input-content">
				<view class="input-item" v-show="typesel">
					<!-- <text class="tit">手机号</text> -->
					<image src="../../static/phone.png" class="input-icon"></image>
					<input type="number" v-model="phone" 
						:placeholder="$t('getmessages.index3')"
						placeholder-class="input-empty"
						maxlength="11" />
				</view>
				<view class="input-item" v-show="!typesel">
					<!-- <text class="tit">手机号</text> -->
					<image src="../../static/mail.png" class="input-icon"></image>
					<input type="text" v-model="mail" 
						:placeholder="$t('getmessages.index4')"
						placeholder-class="input-empty"
						maxlength="30" />
				</view>
				<view class="input-item" v-show="typesel">
					<!-- <text class="tit">新密码</text>-->
					<image src="../../static/key@3x.png" class="input-icon"></image>
					<input type="password"
						v-model="password"
						:placeholder="$t('getmessages.index5')"
						placeholder-class="input-empty"
						maxlength="20"
						password
					/>
				</view>
                <view class="input-item" v-show="typesel">
                	<!-- <text class="tit">验证码</text> -->
                	<image src="../../static/code@3x.png" class="input-icon"></image>
                	<view class="phonecode"><input type="number" v-model="code" 
                		:placeholder="$t('findpsd.index4')"
                		placeholder-class="input-empty"
                		maxlength="11"/>
                	<button class="getcode" :disabled="logining"
                		@click="getcode">{{ text }}</button>
                	</view>
                </view>
				
				<!-- 邮箱 -->
				<view class="input-item" v-show="!typesel">
					<!-- <text class="tit">验证码</text> -->
					<image src="../../static/code@3x.png" class="input-icon"></image>
					<view class="phonecode"><input type="text" v-model="oldcode" 
						:placeholder="$t('getmessages.index6')"
						placeholder-class="input-empty"
						maxlength="20"/>
					<button class="getcode" :disabled="logining"
						@click="getOldcode">{{ text1 }}</button>
					</view>
				</view>
				
				<view class="input-item"  v-show="!typesel">
					<!-- <text class="tit">验证码</text> -->
					<image src="../../static/code@3x.png" class="input-icon"></image>
					<view class="phonecode"><input type="text" v-model="newcode" 
						:placeholder="$t('getmessages.index7')"
						placeholder-class="input-empty"
						maxlength="20"/>
					<button class="newgetcode" :disabled="newlogining"
						@click="getNewcode">{{ text2 }}</button>
					</view>
				</view>
				
			</view>
			<button class="confirm-btn" @click="find" :disabled="btndisabl">{{$t('findpsd.index6')}}</button>
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
			typesel:true,
			phone: '',
			mail:'',
			newmail:'',
			password: '',
			code: '',
			logining: false,
			oldlogining: false,
			newlogining: false,
			newlogining: false,
			btndisabl: false,
			text: this.$t('findpsd.index8'),
			text1: this.$t('findpsd.index8'),
			text2: this.$t('findpsd.index8'),
			newcode:'',
			oldcode:'',
			resdata:'',
		};
	},
	onLoad() {},
	computed: {
		...mapState(['hasLogin', 'userInfo'])
	},
	onShow(){
		this.getuserInfo();
	},
	methods: {
		...mapMutations(['login']),
		navBack() {
			uni.navigateBack({
				url: '/pages/set/set'
			});
		},
        getuserInfo(){
			console.log(this.userInfo,'1111')
			if(this.userInfo.email == ''){
				this.typesel = true
			}else{
				this.typesel = false
			}
		},


		async find() {
			let that = this;
			try{
				if (that.$data.phone=="" && that.$data.mail=="") {
					that.$api.msg(this.$t('getmessages.index8'));
				} else  if (that.$data.code == ''&&that.$data.oldcode == ''&&that.$data.newcode == '') {
					that.$api.msg(this.$t('findpsd.index14'));
				} else {
					console.log('222')
					that.$data.btndisabl = true;
					
					if(that.typesel){
						if (that.$data.password == '') {
							that.$api.msg(this.$t('getmessages.index9'));
							return
						} 
						let result = await that.$request.post('/uc/approve/change/phone', {
							header: {
								'x-auth-token': uni.getStorageSync('token'),
								'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
							},
							data: {
								phone: that.phone,
								password: that.password,
								code: that.code
							}
						});
						that.resdata = result
					}else{
						let result = await that.$request.post('/uc/approve/update/email', {
							header: {
								'x-auth-token': uni.getStorageSync('token'),
								'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
							},
							data: {
								oldEmailCode:that.oldcode,
								newEmailCode:that.newcode,   
								newEmail:that.mail
							}
						});
						that.resdata = result
					}			
					if (that.resdata.data.code == 0) {
						that.$data.btndisabl = false;
						setTimeout(() => {
							uni.navigateBack();
						}, 1000);
					} else {
						that.$data.btndisabl = false;
						that.$api.msg(that.resdata.data.message);
					}
				}
			}catch(e){
				console.log(e);
				that.$data.btndisabl = false;
			}
			
		},
		// 获取验证码
		async getcode() {
			let that = this;
			if (that.$data.phone=="" && that.$data.mail=="") {
				that.$api.msg(this.$t('getmessages.index10'));
			}else{
				that.$data.logining = true;
				let data = await that.$request.post('/uc/mobile/change/code', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {}
				});
				
				if (data.data.code == 0) {
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
					that.$data.logining = false;
				} else {
					that.$api.msg(data.data.message);
					that.$data.logining = false;
				}
			}
		},
		
		// 获取旧验证码
		async getOldcode() {
			let that = this;
			console.log(that.$data.phone, that.$data.mail, 123123)
			if (that.$data.phone=="" && that.$data.mail=="") {
				that.$api.msg(this.$t('getmessages.index11'));
			}else{
				that.$data.oldlogining = true;
				let data = await that.$request.post('/uc/untie/email/code', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {}
				});
				
				if (data.data.code == 0) {
					that.$api.msg(this.$t('findpsd.index9'));
					let counter = 60;
					let timer = setInterval(() => {
						that.$data.text1 = counter + 's';
						counter--;
						if (counter == -1) {
							clearInterval(timer);
							that.$data.text1 = this.$t('findpsd.index8');
						}
					}, 1000);
					that.$data.oldlogining = false;
				} else {
					that.$api.msg(data.data.message);
					that.$data.oldlogining = false;
				}
			}
		},
		
		// 获取新验证码
		async getNewcode() {
			let that = this;
			console.log('1111')
			if (that.$data.phone=="" && that.$data.mail=="") {
				that.$api.msg(this.$t('getmessages.index10'));
			}else{
				that.$data.newlogining = true;
				let data = await that.$request.post('/uc/update/email/code', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {
						email:that.mail
					}
				});
				
				if (data.data.code == 0) {
					that.$api.msg(this.$t('findpsd.index9'));
					let counter = 60;
					let timer = setInterval(() => {
						that.$data.text2 = counter + 's';
						counter--;
						if (counter == -1) {
							clearInterval(timer);
							that.$data.text2 = this.$t('findpsd.index8');
						}
					}, 1000);
					that.$data.newlogining = false;
				} else {
					that.$api.msg(data.data.message);
					that.$data.newlogining = false;
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
			flex: 1;
			// width: 82%;
			height: 60upx;
			font-size: $font-lg;
		}
		.phonecode {
			// width: 85%;
			flex: 1;
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
			margin: 0;
			&::after{
				border: none;
			}
		}
		.newgetcode {
		    font-size: $font-base;
		    font-family: PingFangSC-Medium, "PingFang SC";
		    color: #00a7eb;
		    border: none;
		    background: none;
			margin: 0;
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
