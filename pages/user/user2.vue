 <template>  
    <view class="container">
		<view class="topbox">
			<view class="top-status_bar"></view>
			<view class="notice-box">
				<image src="~@/static/rhinoImg/messageIco.png" @click="test"></image>
			</view>
		</view>
		<!-- <image class="portraitbbb" src="../../static/title.png"></image> -->
		<view class="user-section">
			<view class="user-info-box">
				<view class="left" @tap="set">
					<view class="portrait-box">
						<image class="portrait" :src="headImg" mode="widthFix"></image>
					</view>
					<!-- <view class="portrait-box" v-else>{{memberLevelsname}}</view> -->
					<view class="info-box usernamestar">
						<view class="username">
							{{userName || $t('user.index1')}} 
							<text v-if="hasLogin">{{levelName}}</text>
							<text v-if="hasLogin" class="userlevel">{{userLevel}}</text>
						</view>
						<view class="code" v-if="hasLogin">
							<view class="code_num">
								<!-- 邀请码:<text>{{inviteCode}}</text></view> -->
								{{$t('user.index2')}}:<text>{{idnum}}</text></view>
							<view class="copy copy-h5" @click="paste(idnum)">
								{{$t('user.index3')}}
							</view>
						</view>
					</view>
				</view>
				<view>
					<navigator url="../set/set" v-if="hasLogin">
						<uni-icons color="white" type="arrowright" size="20"></uni-icons>
					</navigator>
					<navigator url="../public/login" v-else>
						<uni-icons color="white" type="arrowright" size="20"></uni-icons>
					</navigator>
				</view>
			</view>
		</view>
		
		<view class="me_type">
			<!-- <ul > -->
			<ul v-if="hasLogin">	
				<li @tap="navTo('/pages/user/myrecord')">
					<view class="type_num">{{orderNum}}</view>
					<view class="type_info">{{$t('user.index4')}}
						<!-- <image src="~@/static/img/go.png" mode=""></image> -->
					</view>
				</li>
				<!-- <li>
					<view class="type_num">{{ethInfo.totalGain | tofixedNum}}</view>
					<view class="type_info">我的收益(ETH)</view>
				</li> -->
				<li>
					<view class="type_num">{{xchInfo.totalGain | tofixedNum}}</view>
					<view class="type_info">{{$t('user.index5')}}(MSL)</view>
				</li>
			</ul>
		</view>
		<!-- 我的套餐 -->
		<view class="myComboBox">
			<view class="myComboTit">{{$t('user.index6')}}</view>
			<!-- <view class="myCombo">
				<view class="myComboTop">
					<text>ETH总中奖力</text>
					<text>{{ethInfo.effectiveNum}}个生效中</text>
				</view>
				<view class="flugerBox">
					<text class="flugerNum">{{ethInfo.computerPower}}</text>
					<text>{{ethInfo.powerUnit}}</text>
				</view>
			</view> -->
			<view class="myCombo">
				<view class="myComboTop">
					<text>{{$t('user.index7')}}</text>
					<text>{{xchInfo.effectiveNum}}{{$t('user.index8')}}</text>
				</view>
				<view class="flugerBox">
					<text class="flugerNum">{{xchInfo.computerPower}}</text>
					<text>{{xchInfo.powerUnit}}</text>
				</view>
			</view>
		</view>
			<view class="me_list">
			 	<ul>
			 		<li v-if="realAuditing==0&&realVerified==0&&kycStatus!==4" 
						@tap="navTo('/pages/user/authen')">
			 			<view class="list_left">
			 				<image style="width:50upx;" 
								src="../../static/img/icon_invite.png" mode=""></image>
			 				<text>{{$t('user.index9')}}</text>
			 			</view>
			 			<view class="list_right">
			 				<text>{{$t('user.index10')}}</text>
			 				<image src="../../static/img/icon_more_a.png" mode=""></image>
			 			</view>
			 		</li>
					<li v-else-if="realAuditing==1&&realVerified==0&&kycStatus!==4">
						<view class="list_left">
							<image style="width:50upx;" 
								src="../../static/rhinoImg/verified.png" mode=""></image>
							<text>{{$t('user.index9')}}</text>
						</view>
						<view class="list_right">
							<text>{{$t('user.index11')}}</text>
							<image src="../../static/img/icon_more_a.png" mode=""></image>
						</view>
					</li>
					<li v-else-if="realAuditing==1&&realVerified==0&&realNameRejectReason!=null" 
						@tap="navTo('/pages/user/authen')">
						<view class="list_left">
							<image style="width:50upx;" 
								src="../../static/rhinoImg/verified.png" mode=""></image>
							<text>{{$t('user.index9')}}</text>
						</view>
						<view class="list_right">
							<text>{{$t('user.index11')}}</text>
							<image src="../../static/img/icon_more_a.png" mode=""></image>
						</view>
					</li>
					<li v-else-if="realVerified==1&&kycStatus==4">
						<view class="list_left">
							<image style="width:50upx;" 
								src="../../static/rhinoImg/verified.png" mode=""></image>
							<text>{{$t('user.index9')}}</text>
						</view>
						<view class="list_right">
							<text>{{$t('user.index12')}}</text>
							<image src="../../static/img/icon_more_a.png" mode=""></image>
						</view>
					</li>
					<li @tap="navTo('/pages/user/point')" v-show='!ifshop'>
						<view class="list_left">
							<image style="width:48upx;" 
								src="../../static/rhinoImg/jf.png" mode=""></image>
							<text>{{$t('user.index13')}}</text>
						</view>
						<view class="list_right">
							<text></text>
							<image src="../../static/img/icon_more_a.png" mode=""></image>
						</view>
					</li>
					<li @tap="navTo('/pages/user/pointshop')" v-show='ifshop'>
						<view class="list_left">
							<image style="width:48upx;" 
								src="../../static/rhinoImg/ewmcode.png" mode=""></image>
							<text>{{$t('user.index14')}}</text>
						</view>
						<view class="list_right">
							<text></text>
							<image src="../../static/img/icon_more_a.png" mode=""></image>
						</view>
					</li>
					<li @tap="navTo('/pages/user/team')">
						<view class="list_left">
							<image style="width:48upx;" 
								src="../../static/rhinoImg/team.png" mode=""></image>
							<text>{{$t('user.index15')}}</text>
						</view>
						<view class="list_right">
							<text></text>
							<image src="../../static/img/icon_more_a.png" mode=""></image>
						</view>
					</li>
					<!-- <li>
						<view class="list_left" @click="alert">
							<image style="width:48upx;" 
								src="../../static/rmb.png" mode=""></image>
							<text>{{$t('user.index16')}}</text>
						</view>
						<view class="list_right">
							<text></text>
							<image src="../../static/img/icon_more_a.png" mode=""></image>
						</view>
					</li> -->
					<li @tap="navTo('/pages/set/invite')">
						<view class="list_left">
							<image src="../../static/rhinoImg/invite.png" mode=""></image>
							<text>{{$t('user.index17')}}</text>
						</view>
						<view class="list_right">
							<text></text>
							<image src="../../static/img/icon_more_a.png" mode=""></image>
						</view>
					</li>
					<li @click="showmask=true">
						<view class="list_left">
							<image src="../../static/rhinoImg/conact.png" mode=""></image>
							<text>{{$t('user.index18')}}</text>
						</view>
						<view class="list_right">
							<text></text>
							<image src="../../static/img/icon_more_a.png" mode=""></image>
						</view>
					</li>
					<li @tap="navTo('/pages/help/help')">
						<view class="list_left">
							<image src="../../static/rhinoImg/help.png" mode=""></image>
							<text>{{$t('user.index19')}}</text>
						</view>
						<view class="list_right">
							<text></text>
							<image src="../../static/img/icon_more_a.png" mode=""></image>
						</view>
					</li>
					<li @tap="navTo('/pages/set/set')">
						<view class="list_left">
							<image src="../../static/rhinoImg/set.png" mode=""></image>
							<text>{{$t('user.index20')}}</text>
						</view>
						<view class="list_right">
							<text></text>
							<image src="../../static/img/icon_more_a.png" mode=""></image>
						</view>
					</li>
			 	</ul>
			</view>
			 		
			<view v-if="hasLogin" class="list-cell log-out-btn">
				<text class="cell-tit" @click="toLogout">{{$t('user.index21')}}</text>
			</view>
			<view class="cov" v-if="showmask" style="border: 1px solid red;">
				<view class="con">
					<view class="password">{{$t('user.index22')}}</view>
					<view class="phone"><text>{{$t('user.index23')}}:</text>19177381673</view>
					<view class="emial"><text>{{$t('user.index24')}}:</text>2956230873@qq.com</view>
					<view class="emial"><text>{{$t('user.index25')}}:</text>fuchanjuan16</view>
					<view class="copyEmial copy-h5" @click="sendcancel">{{$t('user.index26')}}</view>
				</view>
			</view>
		</view>
</template>  
<script>
	import VueClipboard from 'vue-clipboard2';
	import listCell from '@/components/mix-list-cell';
	import Clipboard from 'clipboard';
    import { mapState, mapMutations } from 'vuex';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue';
	import uQRCode from '@/common/uqrcode.js';
	let startY = 0, moveY = 0, pageAtTop = true;
    export default {
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		components: {
			listCell,uniIcons,
		},
		filters:{
			tofixedNum(v){
				if(v){
					return v.toFixed(5);
				}else{
					return 0.00000;
				}
			}
		},
		data(){
			return {
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				uid:'',
				headImg:'../../static/missing-face.png',
				userName:'',
				userleveluserLevel:'',
				levelName:"",
				balance:0,
				myInfo:"",
				inviteCode:'',
				text: this.$t('user.index27'),
				memberLevelsname:"",
				userRewardInfo:"",
				year:2020,
				month:[],
				days:1,
				dates:[],
				sign:0,
				status:-1,
				computerPower:0,
				effectiveNum:0,
				orderNum:0,
				totalGain:0,
				ethInfo:'',
				xchInfo:'',
				realAuditing:'',
				realVerified:'',
				kycStatus:'',
				realNameRejectReason:'',
				showmask:false,
				emailMessage:'',
				ifshop:false,
				idnum:'',
				userLevel: '',
			}
		},
		onLoad(){
			let that = this
			//生成二维码链接
			var userInfo = uni.getStorageSync("userInfo");
			// console.log(userInfo,'sadsadsa')
			
			this.getUserInfo();
		},
		async onShow() {
			let that = this;
			if(!that.hasLogin){
				that.myInfo = "";
				that.userName = "";
			};
			this.getUserInfo();
		},
		
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			let that = this;
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			}else if(index === 1){
				// #ifdef APP-PLUS
				let noticestatus = uni.getStorageSync("havenotice");
				if(noticestatus == false){
					const pages = getCurrentPages();
					const page = pages[pages.length - 1];
					const currentWebview = page.$getAppWebview();
					currentWebview.hideTitleNViewButtonRedDot({
						index
					});
				}
				// #endif
				
				if(!this.hasLogin){
					uni.navigateTo({
						url:'/pages/public/login'
					})
				}else{
					uni.navigateTo({
						url: '/pages/notice/notice'
					})
				}
			}
		},
		// #endif
        methods: {
			...mapMutations(['logout']),

			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			//跳转到代理申请
			async activate() {
				let result = await this.$request.post('/applyAgent/canApply',{
					"data": {
						"uid": this.userInfo.userId,
					}
				});
				console.log(result)
				if(result.data.base.code=='000000'){
					uni.navigateTo({
						url: '../user/agencyapply'
					});
				}else{
					this.$api.msg(result.data.base.msg);
				}
			},
			sendcancel(){
				this.showmask = false;
			},
			copyText () {
				// #ifdef H5
				this.$copyText(this.idnum).then(
					res => {
						uni.showToast({
							title: this.$t('user.index28')
						})
					}
				)
				// #endif
				// #ifndef H5
				uni.setClipboardData({
					data: this.idnum,
					success: () => {
						uni.showToast({
							title: this.$t('user.index28')
						})
					}
				})
				// #endif
			},
			
			//复制地址
			paste(val) {
				// console.log(typeof(value),'aaa')
		        let value = val + ''
				let _this = this
				uni.setClipboardData({
					data: value,
					success: function() {
						_this.$api.msg(_this.$t('user.index28'))
					},
					fail: function(e) {
						_this.$api.msg(_this.$t('user.index29'))
					},
				});
				
			// 	// #ifdef H5
			// 	//这里是复制目标的类名
			// 	let clipboard = new Clipboard('.copy-h5', {
			// 		text: function() {
			// 			return value;
			// 		}
			// 	});
			// 	clipboard.on('success', function(e) {
			// 		console.info('Action:', e.action);
			// 		console.info('Text:', e.text); //复制的文本内容
			// 		console.info('Trigger:', e.trigger); //节点
			// 		e.clearSelection(); //清除选中的文字的选择状态
			// 		uni.showToast({
			// 			icon: 'success', // success / none / loading 3个有效参数
			// 			title: '复制成功',
			// 			duration: 2000
			// 		});
			// 	});
			
			// 	clipboard.on('error', function(e) {
			// 		console.error('Action:', e.action);
			// 		console.error('Trigger:', e.trigger);
			// 	});
			// 	// #endif
			},
			
			
			navTo(url,index){
				let that = this;
				if(!this.hasLogin){
					uni.reLaunch({
						url:'/pages/public/login'
					})
				}
				if(index==1||index==2||index==3){
					// if(that.status==1){
						if(index==1){
							that.getusertoken(url);
						}else{
							uni.navigateTo({
								url
							})
						}
						// uni.navigateTo({
						// 	url
						// })
					// }else{
					// 	that.$api.msg("请先认证")
					// }
				}else{
					uni.navigateTo({
						url
					})
				}
			}, 
			// 余额、积分
			navTosm(url,index){
				if(!this.hasLogin){
					url = '/pages/public/login';
				}
				uni.navigateTo({
					url:url+"?pageindex="+index
				})
			},
			//获取当前年份和月份
			getdate() {
				var date = new Date();
				this.year = date.getFullYear();
				this.mouth = date.getMonth() + 1;
				this.days = date.getDate(); //获取当前日期
				// console.log(this.days)
			},
			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e){
				if(pageAtTop === false){
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e){
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if(moveDistance < 0){
					this.moving = false;
					return;
				}
				this.moving = true;
				if(moveDistance >= 80 && moveDistance < 100){
					moveDistance = 80;
				}
		
				if(moveDistance > 0 && moveDistance <= 80){
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend(){
				if(this.moving === false){
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			},
			getTo(url){
			   this.$api.msg(this.$t('user.index29')+`${url}`);
			},
			set(){
				if(!this.hasLogin){
					uni.navigateTo({
						url:'/pages/public/login'
					})
				}
			},
			//退出登录
			toLogout(){
				console.log(uni.getLocale(), '123')
				let that = this;
				uni.showModal({
				  content: this.$t('user.index30'),
					confirmColor:"#00a7eb",
					success:function(res){
						if(res.confirm){
							that.$data.headimage = "../../static/rhinoImg/logo.png";
							that.$data.userName = "";
							that.$data.myInfo = "";
							that.logout();
						}
					},
					fail:function(e){
						console.log(e);
					}
				});
			},
			// 获取用户信息
			async getUserInfo() {
				let that=this;
				try{
					let result = await that.$request.post('/computer-power-api/member/myPage',{
						header: {
							 'x-auth-token':uni.getStorageSync('token'),
							 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
						},
						data: {}
					});
					if(result.data.code==0){
						// that.computerPower=result.data.data.computerPower;
						// that.effectiveNum=result.data.data.effectiveNum;
						that.orderNum=result.data.data.orderNum;
						// that.totalGain=result.data.data.totalGain;
						
						that.ethInfo = result.data.data.ETH;
						that.xchInfo = result.data.data.MSL;
					}else{
						that.$api.msg(result.data.message);
						uni.setStorageSync("hasLogin",false);
						uni.setStorageSync("userInfo","");
						that.logout();
						// uni.clearStorageSync();
						setTimeout(()=>{
							uni.reLaunch({
								url:'/pages/public/login'
							})
						}, 200);
					}
					let approveInfo = await that.$request.post('/uc/approve/security/setting',{
						header: {
							 'x-auth-token':uni.getStorageSync('token'),
							 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
						},
						data: {}
					});
					if(approveInfo.data.code==0){
						// console.log(approveInfo.data.data)
						that.realAuditing=approveInfo.data.data.realAuditing;
						that.realVerified=approveInfo.data.data.realVerified;
						that.kycStatus=approveInfo.data.data.kycStatus;
						that.realNameRejectReason=approveInfo.data.data.realNameRejectReason;
						that.inviteCode=approveInfo.data.data.bindPromotionCode;
						that.idnum=approveInfo.data.data.id;
						that.userName = approveInfo.data.data.username;
						that.userLevel = approveInfo.data.data.memberGradeName;
						if(approveInfo.data.data.ifShop == 1){
							
							that.ifshop = true
						}else{
							that.ifshop = false
						}
						if(approveInfo.data.data.avatar){
							that.headImg=approveInfo.data.data.avatar;
						}		
					}else {
						that.$api.msg(millInfo.data.message);
						uni.setStorageSync('hasLogin', false);
						uni.setStorageSync('userInfo', '');
						that.logout();
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/public/login'
							});
						}, 200);
					}
					let emialInfo = await that.$request.post('/computer-power-api/member/customerService',{
						header: {
							 'x-auth-token':uni.getStorageSync('token'),
							 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
						},
						data: {}
					});
					if(emialInfo.data.code==0){
						that.emailMessage=emialInfo.data.data;
					}else {
						that.$api.msg(millInfo.data.message);
						uni.setStorageSync('hasLogin', false);
						uni.setStorageSync('userInfo', '');
						that.logout();
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/public/login'
							});
						}, 200);
					}
				}catch(e){
					//TODO handle the exception
					console.log(e);
					// that.$api.msg('网络异常');
				}
				
			},
			// 判断是否为商家
			// async updateIfShop(){
			// 	let that = this

			// 	let res = await that.$request.post('/admin/member/updateIfShop', {
			// 		header: {
			// 			'x-auth-token': uni.getStorageSync('token'),
			// 			'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
			// 		},
			// 		data: {
			// 			phone: that.mobile,
			// 			coinName: 'CSR',
			// 			amount: that.amount,
			// 			remark: that.userInfo.memberId,
			// 		}
			// 	});
			// 	if (res.data.code == 0) {
				    
			//          this.$api.msg('转账成功');
			// 	} 
			// },
			test() {
				uni.navigateTo({
					url: '/pages/index/headlines'
				});
			},
			alert(){
				this.$api.msg(this.$t('user.index31'));
			}
        }
    }  
</script>  

<style lang='scss'>
	page {
		background: rgba(240, 240, 240, 1);
	}
	
	.userlevel{
		display: inline-block;
		text-align: center;
		color: #FFFFFF;
		/* background:#987200 ; */
		background: #00a7eb;
		height: 42upx;
		line-height: 42upx;
		font-size: 28upx;
		border-radius: 10upx;
		padding: 0 15rpx;
		box-sizing: border-box;
	}
	li {
		list-style: none;
	}
	
	ul {
		padding: 0;
	}
	
	%flex-center {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	}
	%section {
	  display:flex;
	  justify-content: space-around;
	  align-content: center;
	  /* background: #fff; */
	  border-radius: 10upx;
	}
	.portraitbbb{
		/* width: 80upx; */
		/* size: 100%; */
	}
	.topbox{
		background: #fff;
		.notice-box{
			text-align: right;
		    padding: 20upx 4% 0;
		    background: #fff;
			image{
			    height: 40upx;
			    width: 40upx;
				vertical-align: middle;
			}
		}
	}
	
	.user-section{
		background: #FFFFFF;
		padding: 0 5% 5%;
		position:relative;
	}
	.user-info-box{
		display:flex;
		justify-content: space-between;
		align-items:center;
		position:relative;
		z-index: 1;
		/* margin: 5% 0; */
		.left{
			display: flex;
			align-items: center;
		}
		.portrait-box{
			width: 130upx;
			height: 130upx;
			text-align: center;
			line-height: 130upx;
			color: #E84170;
			/* background: #FFFFFF; */
			border-radius: 50%;
			font-weight: bold;
			font-size: 36upx;
			overflow: hidden;
			.portrait{
				width: 130upx;
				height: 130upx;
				/* border:5upx solid #fff; */
				/* border-radius: 50%; */
				vertical-align: middle;
			}
		}
		.usernamestar{
			margin-left: 20upx;
			color: #FFFFFF;
			.username{
				font-size: 30upx;
				color:#333333;
				text {
					margin-left: 18upx;
				}
			}
			.star{
				font-size: 24upx;
			    background: #d88284;
			    text-align: center;
			    padding: 2px 8px;
			    border-radius: 50upx;
			    margin: 5px 0 0;
			}
		}
	}
	
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			.cell-tit{
				color:  #FD852F;
				text-align: center;
				margin-right: 0;
			}
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
	
	.icon .mix-list-cell.b-b:after{
		left: 90upx;
	}
	.mix-list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
	
		.cell-icon{
			align-self:center;
			width:56upx;
			max-height:60upx;
			font-size:38upx;
		}
		.cell-more{
			align-self: center;
			font-size:30upx;
			color:$font-color-base;
			margin-left:$uni-spacing-row-sm;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-sm+2upx;
			color: $font-color-light;
		}
	}
	
	.code {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	
		.code_num {
			font-size: 20upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			line-height: 40upx;
		}
	
		.copy {
			width: 96upx;
			height: 56upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 4upx;
			font-size: 28upx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
			line-height: 56upx;
			text-align: center;
			margin-left: 20upx;
	
		}
	}
	
	.me_type {
		background: #FFFFFF;
	    width: 92%;
	    margin: 3% auto;
	    border-radius: 10upx;
		ul {
			display: flex;
			justify-content: space-around;
			align-items: flex-end;
	
			li {
				text-align: center;
				margin: 5% 0;
				width:50%;
				.type_num {
					font-size: 36upx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #333333;
					margin-bottom: 5%;
				}
	
				.type_info {
					font-size: 12px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
					line-height: 34upx;
	
					image {
						width: 15upx;
						height: 20upx;
					}
				}
			}
		}
	}
	.myComboBox{
		width:100%;
		background:#fff;
		margin:3% 0;
		padding:2% 0;
		.myComboTit{
			width:93%;
			margin:2% auto;
			font-size: 14px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
		}
		.myCombo{
			width:93%;
			margin:3% auto 2%;
			background: linear-gradient(135deg, #3FA8E6 0%, #2840B9 100%);
			border-radius: 5px;
			padding:3% 4%;
			.myComboTop{
				width:100%;
				display: flex;
				justify-content: space-between;
				font-size: 12px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FFFFFF;
				padding-top: 1%;
			}
			.flugerBox{
				width:100%;
				font-size: 12px;
				padding: 2% 0 0 0;
				color: #FFFFFF;
				.flugerNum{
					font-size: 24px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
				}
			}
		}
	}
	
	.me_list {
		margin-top: 20upx;
		padding: 0 26upx;
		box-sizing: border-box;
		background: #FFFFFF;
		margin-bottom: 80upx;
	
		ul {
			li {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #E8E8E8;
				padding: 38upx 0 36upx;
				box-sizing: border-box;
	
				.list_left {
					font-size: 30upx;
					font-family: PingFangSC-Medium, 'PingFang SC';
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					display: flex;
					align-items: center;
	
					image {
						width: 44upx;
						height: 44upx;
					}
	
					text {
						margin-left: 20upx;
					}
				}
	
				.list_right {
					display: flex;
					align-items: center;
					font-size: 28upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
	
					text {
						margin-right: 20upx;
					}
	
					image {
						width: 24upx;
						height: 24upx;
					}
				}
			}
		}
	}
	.cov {
		width: 100%;
		height: 100%;
		top:0;bottom: 0;
		left:0;right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 3;
		position: fixed;
		text-align: center;
		font-size: 16px;
		.con {
			z-index: 4;
		    width: 522upx;
		    background-color: white;
		    position: fixed;
		    top: 30%; left: 0; right: 0;
		    border-radius: 10upx;
		    margin: 0 auto;
			.emial,.phone{
			    font-weight: 600;
			    margin: 5% 0;
				text-align: left;
				padding-left:10%;
			}
			.copyEmial{
			    width: 90%;
			    margin: 6% auto;
			    height: 72upx;
			    line-height: 72upx;
			    text-align: center;
			    background: #00a7eb;
			    border-radius: 36upx;
			    color: #ffffff;
			    font-weight: 500;
			}
			.password{
				text-align:center;
				height:100upx;
				line-height:100upx;
				width:100%;
				border-bottom: 1upx solid #EEEEEE;
				color: #00a7eb;
				font-weight: 600;
			}
		}
	}
</style>