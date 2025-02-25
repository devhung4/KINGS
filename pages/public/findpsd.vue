<template>
	<view class="container">
		<view class="top-status_bar"></view>
		<view class="back-btn yticon " @click="navBack">
			<image src="~@/static/btnbacknormal.png" mode=""></image>
		</view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<!-- <view class="left-top-sign"><image src="../../static/bg3x.png"></image></view> -->
		<view class="welcome">{{$t('findpsd.index1')}}</view>
		<view class="wrapper">
			<view class="input-content">
				<view class="input-item">
					<!-- <text class="tit">新密码</text> -->
					<image src="../../static/key@3x.png" class="input-icon"></image>
					<input type="password"
						:placeholder="$t('findpsd.index2')"
						placeholder-class="input-empty"
						maxlength="20"
						password
						data-key="oldPassword"
						@input="inputChange1"
					/>
				</view>
				<view class="input-item">
					<!-- <text class="tit">新密码</text> -->
					<image src="../../static/key@3x.png" class="input-icon"></image>
					<input type="password"
						:placeholder="$t('findpsd.index3')"
						placeholder-class="input-empty"
						maxlength="20"
						password
						data-key="newPassword"
						@input="inputChange2"
					/>
				</view>
				<!-- <view class="input-item"> -->
				<!-- <view class="" style="display: flex;width: 100%;"> -->
				<!-- <text class="tit">手机号</text> -->
				<!-- <image src="../../static/people.png" class="input-icon"></image>
						<input type="number" v-model="mobile" 
							placeholder="请输入手机号码"
							placeholder-class="input-empty"
							maxlength="11" data-key="mobile"
							@input="inputChange1" /> -->
				<!-- </view> -->

				<!-- </view> -->
				<view class="input-item" v-show="typesel">
					<!-- <text class="tit">验证码</text> -->
					<image src="../../static/code@3x.png" class="input-icon"></image>
					<view class="phonecode"><input type="number" v-model="code" 
						:placeholder="$t('findpsd.index11')"
						placeholder-class="input-empty"
						maxlength="11" />
					<button class="getcode" :disabled="logining"
						@click="getcode">{{ text }}</button>
					</view>
				</view>
				<view class="input-item" v-show="!typesel">
					<!-- <text class="tit">验证码</text> -->
					<image src="../../static/code@3x.png" class="input-icon"></image>
					<view class="phonecode"><input type="number" v-model="code" 
						:placeholder="$t('findpsd.index11')"
						placeholder-class="input-empty"
						maxlength="11" />
					<button class="getcode" :disabled="logining"
						@click="getcode">{{ text }}</button>
					</view>
				</view>
				
			</view>
			<button class="confirm-btn" @click="find" :disabled="btndisabl">{{$t('findpsd.index6')}}</button>
			<view class="forget-section" @click="findpsd">{{$t('findpsd.index7')}}?</view>
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
			mobile: '',
			oldPassword: '',
			newPassword: '',
			code: '',
			logining: false,
			btndisabl: false,
			text: this.$t('findpsd.index8'),
			codetype:'',
			type:0,
		};
	},
	onLoad() {},
	onShow() {
		this.getuserInfo();
	},
	computed: {
		...mapState(['hasLogin', 'userInfo'])
	},
	methods: {
		...mapMutations(['login','logout']),
		getuserInfo(){
			console.log(this.userInfo,'1111')
			if(this.userInfo.email == ''){
				this.typesel = true
			}else{
				this.typesel = false
			}
		},
		
		findpsd() {
			uni.navigateTo({
				url: 'forgetpsd'
			});
		},
		inputChange1(e) {
			this.oldPassword = e.detail.value;
		},
		inputChange2(e) {
			this.newPassword = e.detail.value;
		},
		navBack() {
			uni.navigateBack({
				url: '/pages/set/set'
			});
		},

		async find() {
			let that = this;
			
			
			try {
				if(!that.typesel){
				that.codetype = 1;
				}
				
				if (that.$data.oldPassword == '') {
					that.$api.msg(this.$t('findpsd.index2'));
				} else if (that.$data.newPassword == '') {
					that.$api.msg(this.$t('findpsd.index3'));
				} else if (that.$data.code == '') {
					that.$api.msg(this.$t('findpsd.index4'));
				} else {
					that.$data.btndisabl = true;
					let result = await that.$request.post('/uc/approve/update/password', {
						header: {
							'x-auth-token': uni.getStorageSync('token'),
							'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
						},
						data: {
							oldPassword: that.oldPassword,
							newPassword: that.newPassword,
							code: that.code,
							googleCode: '',
							codeMold:that.codetype,
						}
					});
					
					
					if (result.data.code == 0) {
						that.$data.btndisabl = false;
						that.$api.msg(result.data.message);
					
						that.logout();
						uni.setStorageSync('hasLogin', false);
						uni.setStorageSync('userInfo', '');
						setTimeout(()=>{
							uni.navigateTo({
								url:"../public/login"
							})
						}, 200);
					} else {
						that.$api.msg(result.data.message);
						that.$data.btndisabl = false;
					}
				}
			} catch (e) {
				console.log(e);
				that.$data.btndisabl = false;
			}
		},
		// 获取验证码
		async getcode() {
			let that = this;
			that.$data.logining = true;
			
			if(!that.typesel){
				that.type = 1;
			}
				let data = await that.$request.post('/uc/mobile/update/password/code', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {
						type:that.type
					}
				});
			
			
			
			if (data.data.code == 0) {
				that.$api.msg(this.$t('findpsd.index9')); 
				let counter = 60;
				let timer = setInterval(() => {
					that.$data.text = counter + 's';
					counter--;
					if (counter == -1) {
						clearInterval(timer);
						that.$data.text = this.$t('findpsd.index10');
					}
				}, 1000);
				that.$data.logining = false;
			} else {
				that.$api.msg(data.data.message);
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
	.forget-section {
		margin-top: 30upx;
		text-align: center;
		font-size: $font-base;
		color:#00a7eb;
	}
</style>
