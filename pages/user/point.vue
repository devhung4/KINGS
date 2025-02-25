<template>
	<view>
        <!-- <view class="title">
			<view class="title_main">
				<text class="selecta" :class="{active:acss}" @click="tabsel">积分消费</text>
				<text class="selectb" :class="{active:!acss}" @click="tabsel">二维码收款</text>
			</view>
        </view> -->
		<view class="sel" v-show="acss">
				<view class="open">
					<text >{{$t('point.index1')}}</text>
					<!-- #ifndef H5 -->
					<view class="whole" @click="openewm"><image src="../../static/img/btn_scan_normal.png" mode=""></image></view>
					<!-- #endif -->
				</view>
				
				<view class="tel">
					<view class="tel_title">
						{{$t('point.index2')}}
					</view>
					<input type="text" v-model="mobile" :placeholder="$t('point.index3')" maxlength="30"/>
					<view class="tel_title">
						{{$t('point.index4')}}
					</view>
					
					<input type="number" v-model="amount" :placeholder="$t('point.index5')"/>
					<view class="tel_title" >{{$t('point.index6')}}：{{csrbanlance}}MSL</view>
			    	<textarea class="remarkcss"  :placeholder="$t('point.index7')"  v-model="remark"/>
					
					<view class="surebtn">
						<view class="btn"@click="apy">
							{{$t('point.index8')}}
						</view>
						
					</view>
					<view class="tixing">
						{{$t('point.index9')}}
					</view>
				</view>
				
				
				<view class="cov" v-if="showmask">
					<view class="con">
						<view class="password">{{$t('point.index5')}}</view>
						<!-- <view class="emial"><text>邮箱:</text>输入密码</view> -->
						<input type="number" v-model="amount" :placeholder="$t('point.index10')" style="height: 100upx;"/>
						<textarea class="remark"  :placeholder="$t('point.index7')"  v-model="remark"/>
						<view class="" style="display: flex;flex-wrap: wrap;">
							<view class="copyEmial" @click="sendcancelsure">{{$t('point.index11')}}</view>
							<view class="copyEmialb" @click="sendcancel">{{$t('point.index12')}}</view>
						</view>
						
					</view>
				</view>
				
				<view class="covb" v-if="showmasktype">
					<view class="con">
						<view class="passwordb">
							<view class="passleft">
								
							</view>
							<view class="">
								{{$t('point.index13')}}
							</view>
							<image src="../../static/img/clear.png" mode="" @click="showmasktype = false"></image>
							
						</view>
						<!-- <view class="emial"><text>邮箱:</text>输入密码</view> -->
						<input type="number" v-model="amount" :placeholder="$t('point.index14')" style="height: 100upx;" disabled/>
						
					</view>
				</view>
				
			
		</view>
		<view class="invite_code" v-show="!acss">
			<view class="mycode">
				{{$t('point.index15')}}
			</view>
			<view class="qr_code">
				<canvas canvas-id="qrcode" style="width: 150px;height: 150px;" />
			</view>
		</view>
		
	
	</view>
	
</template>

<script>
	import {mapState} from 'vuex';
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue';
	import uQRCode from '@/common/uqrcode.js';
	export default {
		computed:{
			...mapState(['userInfo'])
		},
		data() {
			return {
				showmasktype:false,
				showmask:false,
				amount:'',
				mobile:'',
				remark:'',
				inviteCode:'',
				inviteQrcode:'',
				acss:true,
				pointshow:true,
				noticelist:[],
				nlshow:"",
				pageNo:1,
				pageSize:10,
				address:'',
				title:'',
				type:'',
				openewmcode:'',
				titlecode:'chanjuan',
				typecode:'1',
				csrbanlance:',',
				navTitle: this.$t('pageName.index6'),
				
				
				
				
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.navTitle
			})
		},
		onLoad() {
			this.getWalletInfo()
			let that = this
			//生成二维码链接
			var userInfo = uni.getStorageSync("userInfo");
			console.log(userInfo)
			that.inviteCode = userInfo.mobile;
			// let qrUrl='name='+that.title+'&'+'type='+that.type+'&'+"mobile="+userInfo.mobile;
			let qrUrl='name='+that.titlecode+'&'+'type='+that.typecode+'&'+"mobile="+userInfo.mobile;
			// console.log(qrUrl,'邀请连接')
			that.address = qrUrl
			// console.log(that.getUrlParams().name,'data') 
			// that.make(qrUrl)
		},
		methods: {
			async getWalletInfo() {
				let walletList = await this.$request.post('/uc/asset/wallet', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {}
				});
				if (walletList.data.code == 0) {
					for (let i of walletList.data.data) {
						if (i.coin.name === 'MSL') {
							this.csrbanlance = i.balance
						}
					}
				} 
			},

			
			//截取Url字符串
			 getUrlParams () {
				let that = this
			    var url = that.openewmcode; //
			    var theRequest = new Object();
			    if (url.indexOf("&") != -1) {
			        var str = url.substr(0);
			        console.log(str,'str')
			        var strs = str.split("&");
			        console.log(strs,'strssssss')
			        for (var i = 0; i < strs.length; i++) {
			            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
			        }
			    }
			    return theRequest;
			},
			
			async make(text) {
			     // 回调方式
			     uQRCode.make({
			       canvasId: 'qrcode',
			       componentInstance: this,
			       text: text,
			       size: 150,
			       margin: 10,
			       backgroundColor: '#ffffff',
			       foregroundColor: '#000000',
			       fileType: 'jpg',
			       errorCorrectLevel: uQRCode.errorCorrectLevel.H,
			       success: res => {
			         // console.log(res,"二维码")
			       }
			     })
			   },
			openewm() {
				let that = this;
				uni.scanCode({
					success: function(res) {
						// console.log('条码类型：' + res.scanType);
						that.openewmcode = res.result;
						let name = that.getUrlParams().name
						if(name == "chanjuan"){
							that.type = that.getUrlParams().type
							that.mobile = that.getUrlParams().mobile
							that.showmask = true;
							
						}else{
							this.$api.msg(this.$t('point.index16'));
							
						}
					}
				});
			},
			tabsel(){
				this.acss = !this.acss
				this.make(this.address)
			},
			sendcancel(){
				this.mobile = '';
				this.amount = '';
				this.remark = '';
				this.$api.msg(this.$t('point.index17'));
				this.showmask = false;
			},
			sendcancelsure(){
				this.apy()
			},
		     	async apy(){
					let that = this
					if(that.amount < 0){	
						this.$api.msg(this.$t('point.index18'));
						return
					}else if(that.amount == 0||that.amount == ''){
						this.$api.msg(this.$t('point.index19'));
						return
					}else if(that.mobile == 0 || that.mobile ==""){
						this.$api.msg(this.$t('point.index20'));
						return
					}
					// console.log('111')
					let res = await that.$request.post('/uc/memberTransferRecord/transferToShop', {
						header: {
							'x-auth-token': uni.getStorageSync('token'),
							'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
						},
						data: {
							phone: that.mobile,
							coinName: 'MSL',
							amount: that.amount,
							remark: that.remark,
						}
					});
					if (res.data.code == 0) {
					     this.showmask = false;
						 this.mobile = '';
						 this.amount = '';
						 this.remark = '';
			             // this.$api.msg('转账成功');
						 this.showmasktype = true;
					} else {
						this.showmask = false;
						this.$api.msg(res.data.message);
					}
				},
			
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}
	.title{
		width: 100%;
		display: flex;
		margin-top:40upx ;
		justify-content: center;
		.title_main{
			width: 420upx;
			height: 72upx;
			
			opacity: 1;
			border: 1upx solid #E8B00D;
			border-radius: 122upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.selecta{
				width: 228upx;
				height: 72upx;
				line-height: 72upx;
				font-size: 32upx;
				font-family: PingFang SC;
				font-weight: 400;
				opacity: 1;
				color: rgba(232, 176, 13, 1);
				text-align: center;
				transform: translateX(-2upx);
			}
			.selectb{
				width: 228upx;
				height: 72upx;
				line-height: 72upx;
				font-size: 32upx;
				font-family: PingFang SC;
				font-weight: 400;
				opacity: 1;
				color: rgba(232, 176, 13, 1);
				text-align: center;
				transform: translateX(2upx);
			}
			.active{
				border-radius: 112upx;
				background-color:rgba(232, 176, 13, 1) ;
				color: #FFFFFF;
			}
		}
	}
	.open{
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 92upx;
		padding:0 5%;
		background: rgba(255, 255, 255, 1);
		opacity: 1;
		margin-top: 40upx;
		align-items: center;
		text{
			font-size: 32upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #333333;
		}
		image{
			width: 44upx;
			height: 44upx;
		}
	}
	.tel{
		margin-top: 40upx;
		width: 100%;
		height: 810upx;
		background: rgba(255, 255, 255, 1);
		opacity: 1;
		.tel_title{
			height: 116upx;
			font-size: 32upx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 116upx;
			color: #333333;
			margin-left: 32upx;
		}
		input{
			border: none;
			outline: none;
			margin-left: 32upx;
			height: 66upx;
			font-size: 28upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #999999;
			margin-top: 30upx;
			padding-bottom: 20upx;
			border-bottom:1upx solid  rgba(112, 112, 112, 0.2) ;
		}
	}
	.surebtn{
		width: 100%;
		display: flex;        justify-content: center;
		margin-top: 140upx;
		.btn{
			text-align: center;
			width: 322upx;
			height: 88upx;
			background: #00a7eb;
			opacity: 1;
			border-radius: 44Upx;
			font-size: 32Upx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 88upx;
			color: #FFFFFF;
		}

	}
	.invite_code {
		/* width:630upx; */
		/* height:920upx; */
		/* margin-top: 1140upx; */
		height: 588upx;
		box-shadow:0px 22upx 20upx 0px rgba(240,240,242,0.3);
		/* border-radius:30upx; */
		/* background: url(../../static/img/invite.png) no-repeat; */
		background-color: #fff;
		background-size: cover;
		margin: 40upx auto;
		text-align: center;
	}
	.mycode {
		box-sizing: border-box;
		font-size: 28upx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 128upx;
		color: #999999;
	}
	.code {
		font-size:60upx;
		font-family:PingFangSC-Semibold,'PingFang SC';
		font-weight:600;
		color:#E8B00D;
		margin-top: 36upx;
	}

	.qr_code {
		margin: 0 auto;
		width:344upx;
		height:344upx;
		border-radius:4upx;
		border: 12upx solid rgba(232, 176, 13, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		image {
			width:308upx;
			height:308upx;
		}
	}
	.remarkcss{
		width: 686upx;
		height: 158upx;
		background: rgba(246, 246, 246, 1);
		opacity: 1;
		border-radius: 10upx;
		padding: 0 10upx;
		margin-top: 32upx;
		margin-left: 32upx;
	}
	.remark{
		width: 80%;
		height: 158upx;
		background: rgba(246, 246, 246, 1);
		opacity: 1;
		border-radius: 10upx;
		margin-top: 20upx;
		margin-left: 10%;

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
			.emial{
			    font-weight: 600;
			    margin: 5% 0;
				text-align: left;
				padding-left:10%;
			}
			.copyEmial{
			    width: 40%;
			    margin: 6% auto;
			    height: 72upx;
			    line-height: 72upx;
			    text-align: center;
			    background: #E7AD05;
			    border-radius: 36upx;
			    color: #ffffff;
			    font-weight: 500;
			}
			.copyEmialb{
			    width: 40%;
			    margin: 6% auto;
			    height: 72upx;
			    line-height: 72upx;
			    text-align: center;
			    background: #CCCCCC;
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
				color: #E7AD05;
				font-weight: 600;
			}
		}
	}
	.tixing{
		width: 90%;
		margin: 6% auto;
		box-sizing: border-box;
		font-size: 24upx;
		font-family: PingFang SC;
		font-weight: 400;
		/* line-height: 128upx; */
		color: red;
		padding-bottom: 30upx;
	}
	
	.covb{
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
			.passwordb{
				text-align:center;
				height:100upx;
				line-height:100upx;
				width:100%;
				border-bottom: 1upx solid #EEEEEE;
				color: #E7AD05;
				font-weight: 600;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 40upx;
				.passleft{
					width: 32upx;
					height: 32upx;
				}
				image{
					width: 32upx;
					height: 32upx;
				}
			}
		}
	}

</style>
