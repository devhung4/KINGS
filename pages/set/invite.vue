<template>
	<view class="invite">
		<view class="bg">
			<view class="header">
				<view class="left" @click="navidataBack()">
					<image src="../../static/img/btn_back_center.png" mode=""></image>
				</view>
				<view class="title">
					{{$t('invite.index1')}}
				</view>
				<view class="left">
					<image src="" mode=""></image>
				</view>
				<!-- <view class="right">
					
				</view> -->
			</view>
			<view class="invite_code">
				<view class="mycode">
					{{$t('invite.index2')}}
				</view>
				<view class="code">
					{{inviteCode}}
				</view>
				<view class="copy copy-h5" @click="paste(inviteCode)">
					{{$t('invite.index3')}}
				</view>
				<view class="qr_code">
					<canvas canvas-id="qrcode" style="width: 150px;height: 150px;" />
				</view>
				<view class="down">
					{{$t('invite.index4')}}
				</view>
			</view>
			<!-- <view class="rule">
				<view class="rule_title">
					规则说明
				</view>
				<view class="rule_list">
					<view class="list">
						<jyf-parser :html="htmlNodes.content"></jyf-parser>					
					</view> -->
					<!-- <view class="list">
						1.邀请好友一起赚钱。
					</view>
					<view class="list">
						2.好友接受邀请并产生交易后，会产生相应比例的奖励，以USDT的形式结算，立即到账。
					</view>
					<view class="list">
						3.可以获得最高31%的直推收入。
					</view>
					<view class="list">
						4.规则如有调整，以七星官方为准，最终解释权归七星所有。
					</view> -->
				<!-- </view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue';
	import uQRCode from '@/common/uqrcode.js';
	import Clipboard from 'clipboard';
	export default {
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		components: {
			jyfParser
		},
		data() {
			return {
				inviteCode:'',
				inviteQrcode:'',
			}
		},
		created() {
		},
		onLoad() {
			let that = this
			//获取用户邀请码
			var userInfo = uni.getStorageSync("userInfo");
			console.log(userInfo,'23123123')
			that.inviteCode = userInfo.bindPromotionCode;
			let qrUrl=userInfo.promotionPrefix+userInfo.bindPromotionCode;
			console.log(qrUrl,'邀请连接')
			that.make(qrUrl)
		},
		methods: {
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
			navidataBack() {
				uni.navigateBack();
			},
			//复制地址
			paste(value) {
				uni.setClipboardData({
					data: value,
					success: function() {
						console.log('success');
					}
				});
			},
		}
	}
</script>

<style lang='scss'>
	.bg {
		/* background: url(../../static/mycenter.png) no-repeat;
		background-size: cover; */
		background: linear-gradient(135deg, #3FA8E6 0%, #2840B9 100%);
		height:458upx;
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
	}
	page {
		background: rgba(240, 240, 240, 1);
	}
	li {
		list-style: none;
	}
	ul {
		padding: 0;
	}
	.header {
		height: 120.2upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 18.2upx 30upx 20upx 30upx;
		box-sizing: border-box;
		padding-top: var(--status-bar-height);
		width: 100%;
		z-index: 10;
		.left {
			image {
				width: 44upx;
				height: 44upx;
			}
		}
		.title {
			font-size:32upx;
			font-family:PingFangSC-Semibold,PingFang SC;
			font-weight:600;
			color:rgba(255,255,255,1);
		}
		.right {
			font-size:28upx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(255,255,255,1);
		}
	
	}
	
	.invite_code {
		width:630upx;
		/* height:920upx; */
		height: 836upx;
		box-shadow:0px 22upx 20upx 0px rgba(240,240,242,0.3);
		border-radius:30upx;
		/* background: url(../../static/img/invite.png) no-repeat; */
		background-color: #fff;
		background-size: cover;
		margin: 0 auto;
		text-align: center;
	}
	.mycode {
		font-size:24upx;
		font-family:PingFangSC-Semibold,'PingFang SC';
		font-weight:600;
		color:rgba(51,51,51,1);
		padding-top: 78upx;
		box-sizing: border-box;
	}
	.code {
		font-size:60upx;
		font-family:PingFangSC-Semibold,'PingFang SC';
		font-weight:600;
		color:#00a7eb;
		margin-top: 36upx;
	}
	.copy {
		width:220upx;
		height:60upx;
		background:#00a7eb;
		border-radius:44upx;
		font-size:28upx;
		font-family:PingFangSC-Semibold,'PingFang SC';
		font-weight:600;
		color:rgba(246,246,246,1);
		line-height: 60upx;
		margin: 34upx auto 60upx;
	}
	.qr_code {
		margin: 0 auto;
		width:344upx;
		height:344upx;
		border-radius:4upx;
		border: 12upx solid #00a7eb;
		display: flex;
		align-items: center;
		justify-content: center;
		image {
			width:308upx;
			height:308upx;
		}
	}
	.down {
		margin-top: 30upx;
		font-size:24upx;
		font-family:PingFangSC-Semibold,PingFang SC;
		font-weight:600;
		color:rgba(51,51,51,1);
	}
	.rule {
		padding: 40upx 30upx;
		width:630upx;
		/* height:464upx; */
		background:rgba(255,255,255,1);
		box-shadow:0upx 22upx 20upx 0upx rgba(240,240,242,0.3);
		border-radius:20upx;
		margin: 20upx auto 0;
	}
	.rule_title {
		font-size:30upx;
		font-family:PingFangSC-Semibold,PingFang SC;
		font-weight:600;
		color:rgba(51,51,51,1);
		text-align: center;
	}
	.list {
		font-size:24upx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(153,153,153,1);
		margin-top: 10upx;
	}
</style>
