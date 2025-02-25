<template>
	<view>
		<view class="productionTop">
			<image class="productionBg"  src="/static/user-bg.jpg"></image>
		</view>
		<view class="rechargeBox">
			<view class="recharge">
				<view class="rechargeGroup">
					<view class="recTips">转账方式</view>
					<radio-group @change="radioChange">
						<label class="labelTip" v-for="(item, index) in methoditems" :key="index"><radio class="from-radio" :value="JSON.stringify(item)" :checked="item.type === current" />{{item.name.replace("转账",'')}}</label>
	<!-- .type.toString() -->
					</radio-group>
				</view>
				<view class="rechargeGroup">
					<view class="recTips">转账金额</view>
					<view>
						<input v-model="money" class="regInput" type="number" placeholder="请输入转账金额">
					</view>
				</view>
				<button :disabled="btndis" class="rechareBtn" @click="saverecharge" :style="btndis==false?'background:#FA436A;':'background:#999;'">开始充值</button>
			</view>
			<view class="regTips">
				<jyf-parser :html="htmlNodes"></jyf-parser>
				<!-- <view class="title">*温馨提示*</view>
				<view>1.输入充值金额并点击确认充值后，请复制账号打开支付宝或网银进行转账充值;</view>
				<view>2.充值到账工作时间: 8:00-24:00充值，当天到账(3-5 分钟);其余时间充值在最近工作时间到账;</view>
				<view>3.工作时间内充值到账时间一-般为3-5分钟，超过5分钟未到账请联系在线客服或QQ客服(客服QQ:1792541759);</view>
				<view>4.周一至周日均可充值，充值限额为用户自有银行卡或支付宝限额，建议优先选用支付宝充值;</view>
				<view>5.充值成功或失败均有短信提醒，请及时关注到账信息。</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {
	    mapState 
	} from 'vuex';
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue'
	export default {
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		components:{
			jyfParser
		},
		data(){
			return{
				methoditems: [],
				current: 2,
				radiovalue:2,
				money:"",
				btndis:false,
				maxPrice:0,
				typeindex:2,
				htmlNodes:""
			}
		},
		onLoad() {
			this.onloaddata();
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
					url:"./relist"
				});
			}
		},
		methods:{
			radioChange: function(evt) {
				let that = this;
				let evtindex = JSON.parse(evt.target.value);
				
				that.$data.current = evtindex.type;
				that.$data.radiovalue = evtindex.type;
				that.$data.htmlNodes = evtindex.content;
				
				// that.$data.typeindex = that.$data.methoditems[2].type;
				that.$data.maxPrice = evtindex.maxPrice;
				if(evtindex.type==1){
					that.$api.msg("微信充值暂未开放");
					that.$data.btndis = true;
				}else{
					that.$data.btndis = false;	
				}
			},
			async onloaddata(){
				let that = this;
				let onloaddatalist = await that.$request.post('/user/recharge/method',{
					"data":{
						"uid": that.userInfo.userId
					}
				});
				that.$data.methoditems = onloaddatalist.data.data;
				that.$data.maxPrice = onloaddatalist.data.data[0].maxPrice;
				that.$data.htmlNodes = onloaddatalist.data.data[0].content;
				// that.$data.typeindex = onloaddatalist.data.data[0].type;
			},
			// 开始充值
			async saverecharge(){
				let that = this;
				// that.$data.btndis = true;
				if(that.$data.money == "" || parseFloat(that.$data.money) < 0){
					that.$api.msg("充值金额需大于0");
					// that.$data.btndis = false;
					return;
				}
				// else if(that.$data.current==2&&that.$data.maxPrice<that.$data.money){
				// 	that.$api.msg(`充值金额超过${that.$data.maxPrice}元，请使用网银充值`);
				// 	// that.$data.btndis = false;
				// 	return;
				// }
				else{
					let resultdata = await that.$request.post('/user/recharge/save',{
						"data":{
							"type": that.$data.radiovalue,
							"uid": that.userInfo.userId,
							"amount": parseFloat(that.$data.money)
						}
					});
					
					if(resultdata.data.base.code == "000000"){
						uni.redirectTo({
							url:"./rechargeInfo?type="+that.$data.radiovalue+"&amount="+parseFloat(that.$data.money)+"&id="+resultdata.data.data.id
						});
						// that.$data.btndis = false;
					}else{
						that.$api.msg(resultdata.data.base.msg);
						// that.$data.btndis = false;
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	page{background-color:#EFF3FA;}
	.productionTop{
		width:100%;
		margin:10px auto 0;
		.productionBg{
			width:100%;
			height:140px;
			// border-radius: 10px;
		}
	}
	.rechargeBox{
		width:95%;
		margin:10px auto; 
		background:#fff;
		border-radius: 5px;
		padding:2%;
		.rechargeGroup{
			width:100%;
			padding:2%;
			font-size: 15px;
			.recTips{
				margin-bottom:3%;
			}
			.labelTip{
				display: inline-block;
				margin-right: 8%;
			}
			.regInput{
				height:30px;
				border-bottom:1px solid #e8e8e8;
				font-size: 15px;
			}
			.from-radio{
				transform: scale(0.7);
			}
		}
		.rechareBtn{
			width:80%;
			margin:5% auto;
			height:35px;
			line-height:35px;
			color:#fff;
			font-size:15px;
			text-align: center;
			border-radius: 20px;
			// background:#FA436A;
		}
		.regTips{
			font-size:15px;
			color:#838383;
			line-height: 50upx;
			// text-indent: 2em;
			.title{
				padding: 15px 0 10px;
			}
		}
	}
</style>
