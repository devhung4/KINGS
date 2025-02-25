<template>
	<view class="golden">
		<view class="content">
			<view class="golden_info">
				<view class="golden_title">
					总资产
					<image class="cutImg"  :src="pwdtype?'../../static/rhinoImg/show.png':'../../static/rhinoImg/hide.png'" @tap="pwdseeClick"></image>
				</view>
				<!-- <view class="golden_num">
					<text v-show='pwdtype'>{{ usdtSum }}</text>
					<text v-show='!pwdtype'>*****</text>
					<text style="font-size:24upx;">USDT</text>
				</view> -->
				<view class="profit">
					<!-- <text>今日收益(USDT)</text> -->
					<text style="font-size: 15px;" v-show='pwdtype' class="add">≈{{ cnySum }}CNY</text>
					<text style="font-size: 15px;" v-show='!pwdtype' class="add">≈*****CNY</text>
				</view>
			</view>
			<view class="propertyNav">
				
				<view class="pList" @click="navTo('/pages/property/consume')" hover-class="common-hover" :hover-stay-time="50">
					<image src="../../static/csr.png"></image>
					<!-- <view>CSR消费</view> -->
					<view>积分消费</view>
				</view>
				<view class="pList" @click="navTo('/pages/user/recharge')" hover-class="common-hover" :hover-stay-time="50">
					<image src="../../static/rhinoImg/rechargepng.png"></image>
					<!-- <view>充值</view> -->
					<view>收积分</view>
				</view>
				<view class="pList" @click="navTo('/pages/user/extract')" hover-class="common-hover" :hover-stay-time="50">
					<image src="../../static/rhinoImg/withdrawalpng.png"></image>
					<!-- <view>提确权积分</view> -->
					<view>付积分</view>
				</view>
				<view class="pList" @click="navTo('/pages/property/recordList')">
					<image src="../../static/rhinoImg/recording.png"></image>
					<view>记录</view>
				</view>
			</view>
			<view class="detailed">
				<!-- <view class="propertyList" v-for="(item, index) in balanInfo" :key="index"> -->
				<view class="propertyList" >
					<!-- <view class="proName">{{ item.coin.name }}</view> -->
					<view class="proName">{{ name }}</view>
					<view class="proNum">
						<view class="proNumli">
							<view>可用</view>
							<!-- <view v-show='pwdtype' class="proBalance">{{ item.balance.toFixed(5) }}</view>
							<view v-show='!pwdtype' class="proBalance">*****</view> -->
							<view>{{balance}}</view>
						</view>
						<view class="proNumli">
							<view>冻结</view>
							<!-- <view v-show='pwdtype' class="proBalance">{{ item.frozenBalance}}</view>
							<view v-show='!pwdtype' class="proBalance">*****</view> -->
							<view>{{frozenBalance}}</view>
						</view>
					</view>
				</view>
				<!-- <view class="propertyList">
					<view class="proName">ETH</view>
					<view class="proNum">
						<view>
							<view>可用</view>
							<view class="proBalance">0</view>
						</view>
						<view>
							<view>冻结</view>
							<view class="proBalance">0</view>
						</view>
					</view>
				</view>	 -->
			</view>
			<!-- <view class="handle">
				<view class="extract" @click="extract">
					提取
				</view>
				<view class="exchange" @click="exchange">
					互转
				</view>
				<view class="recharge" @click="charge">
					充值
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	computed: {
		...mapState(['hasLogin'])
	},
	data() {
		return {
			uid: '',
			goldeninfo: '',
			balanInfo: [],
			lastRecordDate: 0,
			pwdtype: true, //隐藏
			// time:[]
			name:'',
			balance:'',
			frozenBalance:'',
		};
	},
	onLoad() {
		var userInfo = uni.getStorageSync('userInfo');
		this.getWalletInfo();
	},
	async onShow() {
		this.getWalletInfo();
	},
	filters: {
		timeStamp: function(value) {
			//具体到时分秒
			if (!value) return '';
			var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			var year = date.getFullYear();
			var month = ('0' + (date.getMonth() + 1)).slice(-2);
			var sdate = ('0' + date.getDate()).slice(-2);
			var hour = ('0' + date.getHours()).slice(-2);
			var minute = ('0' + date.getMinutes()).slice(-2);
			var second = ('0' + date.getSeconds()).slice(-2);

			// 拼接
			var result = year + '-' + month + '-' + sdate + ' ' + hour + ':' + minute + ':' + second;
			return result;
		}
	},
	computed: {
		usdtSum: function() {
			var usdtAll = 0;
			for (var i = 0; i < this.balanInfo.length; i++) {
				usdtAll += parseInt(this.balanInfo[i].balance * this.balanInfo[i].coin.usdRate);
			}
			return usdtAll;
		},
		cnySum: function() {
			var cnyAll = 0;
			for (var i = 0; i < this.balanInfo.length; i++) {
				cnyAll += parseInt(this.balanInfo[i].balance * this.balanInfo[i].coin.cnyRate);
			}
			return cnyAll;
		}
	},
	methods: {
		// 资产是否可见
		pwdseeClick:function(){
			this.pwdtype = !this.pwdtype;
		},
		//获取资产信息
		async getWalletInfo() {
			try {
				let walletList = await this.$request.post('/uc/asset/wallet', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {}
				});
				if (walletList.data.code == 0) {
					console.log(walletList)
					this.name = walletList.data.data[0].coin.name
					this.balance = walletList.data.data[0].balance
					this.frozenBalance = walletList.data.data[0].frozenBalance
					this.balanInfo = walletList.data.data;
				} else {
					uni.setStorageSync('hasLogin', false);
					uni.setStorageSync('userInfo', '');
					// uni.clearStorageSync();
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/public/login'
						});
					}, 200);
				}
			} catch (e) {
				console.log(e);
				// that.$api.msg('网络异常');
			}
		},
		navTo(url) {
			let that = this;
			// if(!that.hasLogin){
			// 	uni.reLaunch({
			// 		url:'/pages/public/login'
			// 	})
			// }else{
			uni.navigateTo({
				url
			});
			// }
		}
	}
};
</script>

<style lang="scss">
page {
	background: rgba(240, 240, 240, 1);
}
.notice {
	padding-top: 200upx;
	background: rgba(240, 240, 240, 1);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 30upx;
	color: #c6c6c6;
	image {
		width: 180upx;
		height: 180upx;
	}
}
li {
	list-style: none;
}

ul {
	padding: 0;
}

.golden_info {
	width: 92%;
	border-radius: 30upx;
	margin: 30upx auto;
	background: url(../../static/rhinoImg/propertyBg.png) no-repeat;
	background-size: cover;
	padding: 8% 5%;
	.golden_title {
		font-size: 28upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		.cutImg{
			width:42upx;
			height:26upx;
			vertical-align: middle;
			margin-left:2%;
		}
	}
	.golden_num {
		font-size: 60upx;
		font-family: PingFangSC-Semibold, 'PingFang SC';
		// font-weight: 600;
		color: rgba(255, 255, 255, 1);
		margin:4% 0;
		text {
			font-family: DINAlternate-Bold, DINAlternate;
			color: rgba(255, 255, 255, 1);
			margin-right: 10upx;
		}
	}
	.profit {
		font-size: 30upx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: rgba(255, 255, 255, 1);
		.add {
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #ffffff;
		}
	}
}
.propertyNav {
	width: 92%;
	margin: 0 auto;
	border-radius: 30upx;
	background: #fff;
	padding: 4% 0;
	display: flex;
	.pList {
		width: 33.3333%;
		text-align: center;
		font-size: 12px;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #333333;
		image {
		    width: 60upx;
		    height: 48upx;
		    margin-bottom: 6%;
		}
	}
}
.detailed {
    width: 92%;
    background: white;
    border-radius: 30upx;
    margin: 3% auto;
	.propertyList {
		width: 90%;
		margin: 0 auto;
		border-bottom: 1px solid #eeeeee;
		padding: 5% 0 3%;
		.proName {
			font-size: 16px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #fda806;
		}
		.proNum {
			display: flex;
			margin: 2% 0;
				font-size: 12px;
			.proNumli {
				width: 40%;
			}
			.proBalance {
				font-family: PingFangSC-Regular, "PingFang SC";
				font-weight: 400;
				color: #999999;
				    margin-top: 3%;
			}
		}
	}
}
</style>
