<template>
	<view>
		<view class="regInfo">
			<view class="regType"><!-- <text class="nwicon" :class="methodinfo.type == 1? 'icon-weixinzhifu':methodinfo.type == 2?'icon-zhifubao':'icon-yinxingqia'"></text>&nbsp;{{methodinfo.type == 1? '微信':methodinfo.type == 2?'支付宝':'网银'}} -->{{methodinfo.name}}转账</view>
			<view class="qrcode" v-if="methodinfo.qrcode">
				<image :src="methodinfo.qrcode"></image>
			</view>
			<!-- <view>充值用户:<text>{{userInfo.userName}}</text></view> -->
		</view>
		<view class="withdrawInfo">
			<view class="inputGrop">
				<view class="tips">收款户名</view>
				<!-- <input :value="userInfo.userName" class="inputTxt" type="text" placeholder="充值用户" disabled> -->
				<view class="inputTxt">{{methodinfo.account}}</view>
				<view class="copytext" @tap="txtcopy(methodinfo.account)">复制</view>
			</view>
			<view class="inputGrop" v-if="methodinfo.type == 3">
				<view class="tips">银行名称</view>
				<!-- <input :value="methodinfo.bankName" class="inputTxt" type="text" placeholder="持卡人姓名" disabled> -->
				<view class="inputTxt">{{methodinfo.bankName}}</view>
			</view>
			<!-- <view class="inputGrop" v-else>
				<view class="tips">银行名称</view>
				<input :value="methodinfo.bankName" class="inputTxt" type="text" placeholder="银行名称" disabled>
			</view> -->
			<view class="inputGrop">
				<!-- {{methodinfo.type == 1? '微信':methodinfo.type == 2?'支付宝':'银行卡'}} -->
				<view class="tips">{{methodinfo.name}}账号</view>
				<!-- <input v-if="methodinfo.type == 3" :value="methodinfo.bankNo" class="inputTxt" type="text" placeholder="银行卡号" disabled>
				<input v-else :value="methodinfo.account" class="inputTxt" type="text" placeholder="微信支付账号" disabled> -->
				<view class="inputTxt">{{methodinfo.bankNo}}</view>
				<view class="copytext" @tap="txtcopy(methodinfo.bankNo)">复制</view>
			</view>
			<view class="inputGrop">
				<view class="tips">充值金额</view>
				<!-- <input :value="money" class="inputTxt" type="text" placeholder="充值金额" disabled> -->
				<view class="inputTxt">{{money}}</view>
			</view>
		</view>
		
		<!-- 已充值，取消充值 -->
		<view class="bottombtn">
			<button class="right" @click="rechargeconfirm(2)">取消充值</button>
			<button class="left" @click="rechargeconfirm(1)">我已充值</button>
		</view>
	</view>
</template>

<script>
	import {
	    mapState 
	} from 'vuex';
	export default {
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		data(){
			return{
				type:0,
				money:0,
				methodinfo:{},
				infoid:""
			}
		},
		onLoad(options) {
			let that = this;
			if(options){
				that.$data.type = parseInt(options.type);
				that.$data.money = parseFloat(options.amount).toFixed(2);
				that.$data.infoid = options.id;
				this.onloaddata();
			}
		},
		methods:{
			// 充值信息展示
			async onloaddata(){
				let that = this;
				let onloaddatalist = await that.$request.post('/user/recharge/method',{
					"data":{
						"type": that.$data.type,
						"uid": that.userInfo.userId
					}
				});
				that.$data.methodinfo = onloaddatalist.data.data[0];
			},
			// 复制
			txtcopy(content){
				let that = this;
				uni.setClipboardData({
					data:content,
					success:function(){
						uni.showToast({
							icon:"none",
							title:"复制成功"
						})
					}
				})
				uni.getClipboardData({
					success: (res) => {
						console.log(res.data);
					}
				})
			},
			// 充值
			async rechargeconfirm(type){
				let that = this;
				let resultconfirm = await that.$request.post('/user/recharge/confirm',{
					"data":{
						"type": type,
						"uid": that.userInfo.userId,
						"rechargeId": that.$data.infoid
					}
				});
				console.log(resultconfirm)
				if(resultconfirm.data.base.code=="000000"){
					that.$api.msg(resultconfirm.data.data);
				}else{
					that.$api.msg(resultconfirm.data.base.msg);
				}
			},
		}
	}
</script>

<style lang="scss">
	page{background-color:#EFF3FA;}
	%section{
		display:flex;
		// justify-content: space-between;
		width:100%;
	}
	.regInfo{
		width:95%;
		margin:10px auto;
		background:#fff;
		border-top:4px solid #FA436A;
		font-size: 15px;
		text-align: center;
		padding:2%;
		.qrcode{
			width:150px;
			height:150px;
			border:1px solid #888888;
			margin:5% auto;
			image{
				height: 100%;
				width: 100%;
			}
		}
	}
	.withdrawInfo{
		width:95%;
		margin:0 auto;
		font-size:15px;
		padding:0 2px 4%;
		background:#fff;
		.inputGrop{
			@extend %section;
			padding:4% 0;
			border-bottom: 1px solid #E8E8E8;
			// height:40px;
			// line-height:40px;
			.tips{
				width:95px;
				padding-left:2%;
			}
			.inputTxt{
				width:60%;
				// height:40px;
			}
			.copytext{
				width: 15%;
				color: #366092;
				text-align: right;
			}
		}
	}
	.bottombtn{
		@extend %section;
		padding: 5%;
		.left,.right{
			width: 49%;
		}
		.left{
			background: #FA436A;
			color: #FFFFFF;
		}
	}
</style>
