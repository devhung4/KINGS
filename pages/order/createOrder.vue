<template>
	<view>
		<!-- 地址 -->
		<navigator url="/pages/address/address?source=1" class="address-section">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen" v-if="addressData">
					<view class="top">
						<text class="name">{{addressData.name}}</text>
						<text class="mobile">{{addressData.phone}}</text>
					</view>
					<text class="address">{{addressData.detail}}</text>
				</view>
				<view class="cen" v-else>
					<text class="address" style="font-size: 12px;height: 98upx;line-height: 98upx;">暂无收货地址，请前往个人中心添加收货地址</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>

			<image class="a-bg" src="../../static/img/orderfgx.png"></image>
		</navigator>

		<view class="goods-section">
			<!-- <view class="g-header b-b">
				<image class="logo" src="http://duoduo.qibukj.cn/./Upload/Images/20190321/201903211727515.png"></image>
				<text class="name">西城小店铺</text>
			</view> -->
			<!-- 商品列表 -->
			<view class="g-item" v-for="(item,index) in commodityInfo" :key="index">
				<image :src="item.images[0].image || 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1620020012,789258862&fm=26&gp=0.jpg'"></image>
				<view class="right">
					<text class="title clamp">{{item.name}}</text>
					<!-- <text class="spec" 
					v-for="(itemm,indexm) in (item.markDesc.split(','))"
					:key="indexm">{{itemm}}</text> -->
					<view class="price-box">
						<text class="price">${{item.price}}/{{item.unit}}</text>
						<text class="number">x {{item.num}}</text>
					</view>
					<view class="price-box">
						<text class="price" style="font-size: 12px;margin-right: 2%;">购买数量</text>
						<view class="example-body">
							<!--  :disabled="item.inputdis" -->
							<uni-number-box :min="1" :max="item.maxnum" :index="index" :value="item.num"  @change="change" />
						</view>
					</view>
					<textarea :value="buyRemark" placeholder="请输入备注" style="height: 100upx;width: 100%;margin: 5% 0 0;padding: 2%;font-size: 12px;border: 1px solid #f5f5f5;"/>
				</view>
			</view>
		</view>

		<!-- 优惠明细 -->
		<!-- <view class="yt-list">
			<view class="yt-list-cell b-b" @click="toggleMask('show')">
				<view class="cell-icon">
					券
				</view>
				<text class="cell-tit clamp">优惠券</text>
				<text class="cell-tip active">
					选择优惠券
				</text>
				<text class="cell-more wanjia wanjia-gengduo-d"></text>
			</view>
			<view class="yt-list-cell b-b">
				<view class="cell-icon hb">
					减
				</view>
				<text class="cell-tit clamp">商家促销</text>
				<text class="cell-tip disabled">暂无可用优惠</text>
			</view>
		</view> -->
		<!-- 金额明细 -->
		<!-- <view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品金额</text>
				<text class="cell-tip">￥179.88</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额</text>
				<text class="cell-tip red">-￥35</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">免运费</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">备注</text>
				<input class="desc" type="text" v-model="desc" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view>
		</view> -->
		
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">$</text>
				<text class="price">{{totalamount}}</text>
			</view>
			<text class="submit" @click="submit">提交订单</text>
		</view>
		
		<!-- 优惠券面板 -->
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<!-- 优惠券页面，仿mt -->
				<view class="coupon-item" v-for="(item,index) in couponList" :key="index">
					<view class="con">
						<view class="left">
							<text class="title">{{item.title}}</text>
							<text class="time">有效期至2019-06-30</text>
						</view>
						<view class="right">
							<text class="price">{{item.price}}</text>
							<text>满30可用</text>
						</view>
						
						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">限新用户使用</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				// totalamount:0,
				maskState: 0, //优惠券面板显示状态
				desc: '', //备注
				payType: 1, //1微信 2支付宝
				couponList: [
					{
						title: '新用户专享优惠券',
						price: 5,
					},
					{
						title: '庆五一发一波优惠券',
						price: 10,
					},
					{
						title: '优惠券优惠券优惠券优惠券',
						price: 15,
					}
				],
				addressData: false,
				commodityInfo:[],
				// commodityId:'',
				buyRemark:'',
				orderiofo:[],
				maxnum:100000
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo']),
			totalamount:function(){
				let amount = 0
				this.commodityInfo.forEach(item=>{
					amount += item.price * item.num
				})
				return amount
			}
		},
		async onLoad(option){
			let arrid = option.id.split(',')
			// console.log("arrid"+arrid)
			this.getaddress();
			let that = this;
			arrid.forEach(async (item)=>{
				let data = await this.$http.post('/lanhan/shop/commodityInfo', {
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
					"commodityId": item,
					}
				});
				data.num = 1;
				if(data.type==2){
					data.maxnum = data.canBuyNumber;
					// data.inputdis = true;
				}else{
					data.maxnum = 1000000;
					// data.inputdis = false;
				}
				that.commodityInfo.push(data);
			})
		},
		methods: {
			async getaddress(){
				var _this = this;
				let data = await this.$http.post('/userAddress/list', {
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
				},{isFactory:false});
				if(data.data.base.code=="000000"){
					for(var i=0; i<data.data.data.length;i++){
						if(data.data.data[i].type == 1){
							_this.addressData = data.data.data[i]
							return
						}
					}
				}
			},
			change(value) {
				this.commodityInfo[value.index].num = value.number
			},
			//显示优惠券面板
			toggleMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(()=>{
					this.maskState = state;
				}, timer)
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type){
				this.payType = type;
			},
			async submit(){
				let that = this
				let arr = [];
				if(that.$data.addressData==false){
					that.$api.msg("请选择收货地址");
					return;
				}
				this.commodityInfo.forEach(async (item,index)=>{
					let sign = 'data'+ index
					arr.push(sign)
					sign = await this.$http.post('/lanhan/shop/commodityOrderSave', {
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
						 		"commodityId": item.commodityId,
								"address": item.detailAddress,
						 		"title": item.name,
						 		"image": item.images[0].image,
						 		"storekeeperUserId": item.shopInfo.shopUserId,
						 		"number": item.num,
						 		"price": item.price,
						 		"unit": item.unit,
						 		"amount": item.price*item.num,
						 		"realAmount": item.price*item.num,
						 		"addressId": this.addressData.id,
						 		"buyRemark": this.buyRemark,
								"type":item.type
						 	}
					});
					
					this.orderiofo.push(sign)
					
					Promise.all(arr).then(function (results) {
						if(that.orderiofo.length){
							let amount = 0;
							let orderNo = [];
							let orderId = [];
							for(let i = 0;i<that.orderiofo.length;i++){
								amount += Number(that.orderiofo[i].amount);
								orderNo.push(that.orderiofo[i].orderNo);
								orderId.push(that.orderiofo[i].id);
							}
							uni.setStorageSync("shoptype",1);
							uni.setStorageSync("coamount",amount);
							uni.setStorageSync("coorderno",orderNo.toString());
							uni.setStorageSync("coorderid",orderId.toString());
							uni.redirectTo({
								url: `/pages/money/pay`
							})
						}
					});
					
				})
				
				
				
			},
			stopPrevent(){}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			padding: 20upx 30upx;
			border-bottom: 5px solid #f5f5f5;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
			    font-size: 12px;
			    border: 1px solid #fa436a;
			    color: #fa436a;
			    padding: 1px 3px;
			    border-radius: 3px;
				margin-right: 10upx;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;

				.price {
					margin-bottom: 4upx;
					margin-top: 20upx;
				}
				.number{
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}
	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}
			&.red{
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}
	
	/* 支付列表 */
	.pay-list{
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;
		.pay-item{
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;	
			position: relative;
		}
		.icon-weixinzhifu{
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}
		.icon-alipay{
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}
		.icon-xuanzhong2{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}
		.tit{
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}
	
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0,0,0,.1);
		.price-content{
			padding-left: 30upx;
		}
		.price-tip{
			color: $base-color;
			margin-left: 8upx;
		}
		.price{
			font-size: 36upx;
			color: $base-color;
		}
		.submit{
			display:flex;
			align-items:center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $base-color;
		}
	}
	
	/* 优惠券面板 */
	.mask{
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 9995;
		transition: .3s;
		
		.mask-content{
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y:scroll;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.mask-content{
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item{
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;
		.con{
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;
			&:after{
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
		.left{
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}
		.time{
			font-size: 24upx;
			color: $font-color-light;
		}
		.right{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}
		.price{
			font-size: 44upx;
			color: $base-color;
			&:before{
				content: '￥';
				font-size: 34upx;
			}
		}
		.tips{
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}
		.circle{
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;
			&.r{
				left: auto;
				right: -6upx;
			}
		}
	}

</style>
