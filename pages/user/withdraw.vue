<template>
	<view>
		<view class="withdrawBody">
			<view class="cutTab">
				<!-- <view class="tab" style="color:#4399FC">					
					<view class="nwicon icon-yinxingqia"></view>
					银行卡
				</view>
				<view class="tab">					
					<view class="nwicon icon-zhifubao"></view>
					支付宝
				</view>
				<view class="tab">
					<view class="nwicon icon-weixinzhifu"></view>
					微信
				</view> -->
				<block v-for="(item, index) in methoditems" :key="index">
					<view class="tab" :style="index==current?'color:'+item.color:'color:#999'" 
						@tap="typeChange(index)">
						<view class="nwicon" :class="item.iconimg"></view>
						{{item.name}}
					</view>
				</block>
			</view>
			<view class="withdrawInfo">
				<view class="inputGrop">
					<view class="tips">用户姓名</view>
					<input v-model="username" class="inputTxt" type="text" placeholder="请输入用户姓名">
				</view>
				<view class="inputGrop" v-if="current==0">
					<view class="tips">开户行名称</view>
					<input v-model="bankname" class="inputTxt" type="text" placeholder="请输入开户行名称">
				</view>
				<view class="inputGrop">
					<view class="tips">提现账号</view>
					<input v-model="account" class="inputTxt" type="text" placeholder="请输入提现账号">
				</view>
				<view class="inputGrop">
					<view class="tips">提现金额</view>
					<input v-model="amount" class="inputTxt" type="number" placeholder="请输入提现金额">
				</view>
			</view>
			<!-- 二维码图 -->
			<view class="uni-list list-pd" v-if="current!==0">
				<view class="uni-list-cell cell-pd">
					<view class="uni-uploader">
						<view class="uni-uploader-body">
							<view class="upcode">
								<view class="positive">上传收款码</view>
								<view class="img666" v-if="!positiveshow">
									<image :src="codeimage" mode=""></image>
									<text class="del-btn yticon icon-shanchu4" @click="clearimg"></text>
								</view>
								<view class="img666" v-if="positiveshow" @tap="upcodeClick">
									<image src="../../static/sf.png" mode=""></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 支付密码 -->
			<view class="cov" v-if="showpwd">
				<view class="con">
					<view class="password">请输入支付密码</view>
					<input @input="inputchange" placeholder="请输入密码" password/>
				     <view class="buttoncss">
						 <button class="text-one" @click="sendpwd" :disabled="disab">确定</button>
						 <button class="text-two" @click="cancelpwd">取消</button>
					 </view>
				</view>
			</view>
			<view class="explainInfo">
				<view style="margin:4% 0;">当前可提现金额：<text>{{withdrawConfiginfo.balance}}元</text></view>
				<view style="margin:4% 0;">提现手续费收取：<text>{{fee}}%</text></view>
				<button class="withdrawBtn" @tap="beaforconfirm" :disabled="disabtwo" :style="disabtwo==false?'background:#FA436A;':'background:#999;'">提现</button>
				<view>
					<jyf-parser :html="withdrawConfiginfo.content"></jyf-parser>
					<!-- <view>提示：</view>
					<view>
						1.提现支持银行卡提现、支付宝提现或微信提现，仅支持在平台绑定的银行卡、支付宝或微信进行提现
					</view>
					<view>
						2.提现支持银行卡提现、支付宝提现或微信提现，仅支持在平台绑定的银行卡、支付宝或微信进行提现
					</view>
					<view>
						3.提现支持银行卡提现、支付宝提现或微信提现，仅支持在平台绑定的银行卡、支付宝或微信进行提现
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	    mapState 
	} from 'vuex';
	import md5 from '../../common/md5.js';
	import {pathToBase64, base64ToPath} from '../../common/image-tools/index.js';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue';
	export default {
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		components:{
			jyfParser
		},
		data(){
			return{
				current:1,
				methoditems:[
					{id:0,color:"orange",iconimg:'icon-yinxingqia',name:'网银'},
					{id:1,color:"#4399FC",iconimg:'icon-zhifubao',name:'支付宝'},
					{id:2,color:"green",iconimg:'icon-weixinzhifu',name:'微信'}
				],
				username:"",
				bankname:"",
				account:"",
				amount:"",
				showpwd:false,
				passwordval:"",
				disab:false,
				withdrawConfiginfo:{},
				fee:0,
				minamount:0,
				maxamount:0,
				positiveshow:true,
				codeimage:"",
				disabtwo:false
			}
		},
		async onLoad() {
			let that = this;
			// 获取提现配置信息
			let wcInfo = await that.$request.post('/lanhan/user/withdrawConfig', {data: {
				"base": {
					"appId": "001",
					"channels": "001",
					"ver": "1.1.5",
					"clientVer": "1.0",
					"apn": "wifi",
					"deviceId": "1233eedds2112",
					"uid": this.userInfo.userId,
					"valat": 22.332112,
					"lalong": 12.332112,
					"platform": "IOS",
					"platformVer": "8",
					"resolution": "960*640",
					"deviceType": "P6",
					"carrier": "china mobile",
					"city": "合肥",
					"brand": "huawei"
				}
			}});

			if(wcInfo.data.base.code=="000000"){
				that.$data.withdrawConfiginfo = wcInfo.data.data;
				that.$data.fee = that.$data.withdrawConfiginfo.config[1].fee*100;
				that.$data.minamount = that.$data.withdrawConfiginfo.config[1].minAmount;
				that.$data.maxamount = that.$data.withdrawConfiginfo.config[1].maxAmount;
				
				that.$data.username = that.$data.withdrawConfiginfo.config[1].name || "";
				that.$data.bankname = that.$data.withdrawConfiginfo.config[1].bankName || "";
				that.$data.account = that.$data.withdrawConfiginfo.config[1].account || "";
				that.$data.codeimage = that.$data.withdrawConfiginfo.config[1].qrCode || "";
				if(that.$data.codeimage!==""){
					that.$data.positiveshow = false;
				}else{
					that.$data.positiveshow = true;
				}
			}else{
				this.$api.msg(wcInfo.data.base.msg);
			}
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if(!this.hasLogin){
				uni.showModal({
					content: "您还未登录，现在去登录",
					confirmText: "确定",
					cancelText: "取消",
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url:"../public/login"
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			}else{
				uni.navigateTo({
					url:"./withdrawlist"
				});
			}
		},
		methods:{
			typeChange: function(evt) {
				let that = this;
				let evtindex = parseInt(evt);
				console.log(evtindex);
				that.$data.current = evtindex;
				let configarray = that.$data.withdrawConfiginfo.config;
				for(let i=0; i<configarray.length; i++){
					if(evtindex==(configarray[i].type-1)){
						that.$data.fee = configarray[i].fee*100;
						that.$data.minamount = configarray[i].minAmount;
						that.$data.maxamount = configarray[i].maxAmount;
						
						that.$data.username = configarray[i].name || "";
						that.$data.bankname = configarray[i].bankName || "";
						that.$data.account = configarray[i].account || "";
						that.$data.codeimage = configarray[i].qrCode || "";
						if(that.$data.codeimage!==""){
							that.$data.positiveshow = false;
						}else{
							that.$data.positiveshow = true;
						}
					}
				}
				if(configarray[evtindex].type==3){
					that.$api.msg("微信提现暂未开放");
					that.$data.disabtwo = true;
				}else{
					that.$data.disabtwo = false;
				}
			},
			inputchange(e){
				this.passwordval = md5(e.detail.value);
			},
			// 输入支付密码
			beaforconfirm(){
				let that = this;
				if(that.$data.current == 0&&that.$data.bankname==""){
					that.$api.msg("请输入开户行名称");
					return;
				}
				if(that.$data.username==""){
					that.$api.msg("请输入用户姓名");
					return;
				}
				if(that.$data.account==""){
					that.$api.msg("请输入提现账号");
					return;
				}
				if(that.$data.amount==""||parseFloat(that.$data.amount)<0){
					that.$api.msg("请输入提现金额");
					return;
				}
				if(that.$data.minamount>that.$data.withdrawConfiginfo.balance){
					that.$api.msg(`最小提现金额为:${that.$data.minamount}元,当前金额不足`);
					return;
				}
				if(parseFloat(that.$data.amount)>that.$data.maxamount){
					that.$api.msg(`最大提现金额为:${that.$data.maxamount}元`);
					return;
				}
				if(parseFloat(that.$data.amount)>that.$data.withdrawConfiginfo.balance){
					that.$api.msg(`当前金额不足`);
					return;
				}
				if(parseFloat(that.$data.amount)<that.$data.minamount){
					that.$api.msg(`最小提现金额为:${that.$data.minamount}元`);
					return;
				}
				if(that.$data.current == 1&&3000<parseFloat(that.$data.amount)){
					that.$api.msg(`提现金额超过3000元，请使用网银提现`);
					that.$data.disabtwo = true;
					return;
				}else{
					that.$data.disabtwo = false;
				}
				
				that.$data.showpwd = true;
			},
			// 确认提现
			sendpwd(){
				this.withdrawapply();
			},
			// 取消提现
			cancelpwd(){
				this.$data.showpwd = false;
			},
			// 提交提现申请信息
			async withdrawapply(){
				let that = this;

				if(that.$data.passwordval==""){
					that.$api.msg("请输入支付密码");
					return;
				}
				that.$data.disab = true;
				let onloaddatalist = await that.$request.post('/lanhan/user/withdrawApply',{
					"data":{
						"base": {
						    "appId": "001",
						    "channels": "001",
						    "ver": "1.1.5",
						    "clientVer": "1.0",
						    "apn": "wifi",
						    "deviceId": "1233eedds2112",
						    "uid": this.userInfo.userId,
						    "valat": 22.332112,
						    "lalong": 12.332112,
						    "platform": "IOS",
						    "platformVer": "8",
						    "resolution": "960*640",
						    "deviceType": "P6",
						    "carrier": "china mobile",
						    "city": "合肥",
						    "brand": "huawei"
						},
						"param": {
							"amount": that.$data.amount,
							"type": that.$data.current+1,
							"accountId": that.$data.account,
							"realName":that.$data.username,
							"qrCode":that.$data.codeimage,
							"bankName":that.$data.bankname,
							"fundPassword":that.$data.passwordval
						}
					}
				});
				if(onloaddatalist.data.base.code=="000000"){
					that.$api.msg("提现成功");
					uni.redirectTo({
						url:"./surplusMoney?pageindex=1"
					});
					that.$data.disab = false;
				}else{
					that.$api.msg(onloaddatalist.data.base.msg);
					that.$data.disab = false;
				}
			},
			// 上传二维码图片
			upcodeClick(){
				let that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera '], //从相册选择、使用相机
				    success: (chooseImageRes) => {
						uni.showLoading({  
							title: "上传中",  
							mask: true  
						})
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						that.$data.codeimage = tempFilePaths[0];
						pathToBase64(tempFilePaths[0]).then(base64 => {
							that.fileupload(base64);
						}).catch(error => {
							that.$api.msg(e);
						})
						uni.hideLoading();
				    },
				    fail: (e) => {
				    	console.log("error:"+e);
				    	that.$api.msg("当前网络不佳");
				    }
				});
			},
			// 上传图片
			async fileupload(base64){
				let that = this;
				let res1 = await that.$request.post('/file/upload', {
					"data":{
						"imageBase64": base64
					}
				});
				if(res1.data.base.code=="000000"){
					that.$data.codeimage = res1.data.data;
					that.$data.positiveshow = false;
				}else{
					that.$api.msg(res1.data.base.msg);
				}
			},
			// 删除图片
			clearimg(){
				let that = this;
				that.$data.positiveshow = true;
				that.$data.codeimage = "";
			}
		}
	}
</script>

<style lang="scss">
	page{background-color:#EFF3FA;}
	%section{
		display:flex;
		justify-content: space-between;
		width:100%;
	}
	.withdrawBody{
		background:#fff;
		border-radius: 5px;
		width:95%;
		margin: 10px auto;
		padding-bottom:5%;
		.cutTab{
			@extend %section;
			width:100%;
			font-size:15px;
			padding:3% 0;
			// height:40px;
			text-align: center;
			.tab{
				width:33.333%;
				.nwicon{
					font-size:35px;
				}
			}
			.selectcolor{
				color:#4399FC;
			}
		}
		.withdrawInfo{
			width:95%;
			margin:0 auto;
			font-size:15px;
			.inputGrop{
				@extend %section;
				margin:4% 0;
				border: 1px solid #E8E8E8;
				height:40px;
				line-height:40px;
				border-radius: 5px;
				.tips{
					width:40%;
					padding-left:2%;
				}
				.inputTxt{
					width:60%;
					height:40px;
					
				}
			}
			
		}
		
		/* 上传二维码 */
		.list-pd {
			border: 0;
			
			.cell-pd {
				margin: 0 3%;
			}
			.upcode{
				padding: 2%;
				border: 1px solid #E8E8E8;
				border-radius: 5px;
				display: flex;
				align-items: center;
				.img666{
				    height: 260upx;
				    width: 260upx;
				    margin: 30upx auto;
					image{
						width: 100%;
						height: 100%;
					}
					.del-btn{
						position: absolute;
					    margin-top: -10px;
					}
				}
				.positive{
					font-size: 30upx;
					margin: 0 0 40upx;
				}
			}
		}
		
		.cov {
			width: 100%;
			height: 100%;
			top: 0;bottom: 0;
			right:0;
			left:0;
			background-color: rgba(0, 0, 0, 0.5);
			z-index: 3;
			position: fixed;
			text-align: center;
			font-size: 16px;
			.con {
				z-index:4;
				height:270upx;
				width:600upx;
				background-color: white;
				position: fixed;
				top: 30%;
				left:10%;
				border-radius:20upx;
				.password{
					text-align:center;
					height:80upx;
					line-height:80upx;
					width:100%
				}
				input{
					border-bottom:4upx solid #efefef;
					margin:10upx auto;
					width:90%;
					height: 70upx;
				}
				.buttoncss{
					width:100%;
					height:50upx;
					display:flex;
					margin-top:32upx;
					.text-one,.text-two{
						display:block;
						text-align:center;
						height:50upx;
						line-height:50upx;
						width:50%;
						background: none;
					}
					uni-button:after{
						border: none;
					}
				}
			}
		}
		.explainInfo{
			width:95%;
			margin:10px auto;
			font-size:16px;
			color:#8B8B8B;
		}
		.withdrawBtn{
			width:80%;
			margin:5% auto;
			height:35px;
			line-height:35px;
			border-radius: 20px;
			color:#fff;
			text-align: center;
		}
	}
</style>
