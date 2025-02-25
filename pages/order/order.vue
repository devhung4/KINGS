<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="tabCurrentIndex == index?'current':''"
				@click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		
		<!-- <swiper :indicator-dots="true" :autoplay="false" :duration="1000">
			<swiper-item v-for="(item,index) in 4" :key="index">
				<view class="swiper-item" >111f3333333333333333333333333333333333333</view>
			</swiper-item>
		</swiper> -->
		
		<!-- <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex" >
				
			</swiper-item>
		</swiper> -->
		
		<swiper :autoplay="false" duration="300" :current="tabCurrentIndex" @change="changeTab" class="swiper-box">
			<swiper-item v-for="(tabItem,tabIndex) in navList" :key="tabIndex" class="swiper-item">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白页 tabItem.loaded === true -->
					<empty v-if="tabItem.orderList.length === 0"></empty>
					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">
						<view class="i-top b-b">
							<text class="time">订单编号:{{item.orderNo}}</text>
							<text class="state" :style="{color: item.stateTipColor}">{{item.stateTip}}</text>
							<!-- <text 
								v-if="item.status===1" 
								class="del-btn yticon icon-iconfontshanchu1"
								@click="deleteOrder(index)"
							></text> -->
						</view>
						
						<!-- <scroll-view  class="goods-box" scroll-x>
							<view
								class="goods-item"
							>
								<image class="goods-img" :src="item.image" mode="aspectFill"></image>
							</view>
						</scroll-view> -->
						<view class="goods-box-single" @click="navToDetailPage(item.commodityId)">
							<image class="goods-img" :src="item.image" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{item.name}}</text>
								<text class="attr-box">{{item.price}}  x {{item.number}}</text>
								<text class="price">{{item.amount}}</text>
							</view>
						</view>
						
						<view class="price-box">
							共
							<text class="num">{{item.number}}</text>
							件商品 实付款
							<text class="price">{{item.amount}}</text>
						</view>
						<view class="action-box b-t" 
							v-if="item.status!==5">
							<button v-if="item.status == 1" class="action-btn" @click="navTodsk(5,item.amount,item.orderNo,item.id)">取消订单</button>
							<button v-if="item.status == 1" class="action-btn recom" @click="navTodsk(1,item.amount,item.orderNo,item.id)">付款</button>
							<button v-if="item.status == 2" class="action-btn recom" @click="navTodsk(2,item.amount,item.orderNo,item.id)">确认收货</button>
							<!-- <button v-if="item.status == 6" class="action-btn recom" @click="navTodsk(6,item.amount,item.orderNo,item.id,item)">去评价</button> -->
							<button v-if="item.status == 7" class="action-btn" @click="navTodsk(7,item.amount,item.orderNo,item.id)">已完成</button>
						</view>
					</view>
					
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					
				</scroll-view>
			</swiper-item>
			
		</swiper>
		
		<view class="cov" v-if="showpwd">
			<view class="con">
				<view class="password">请输入支付密码</view>
				<input @input="inputchange" placeholder="请输入密码" password/>
			     <view class="buttoncss">
					 <button class="text-one" @click="sendpwd">确定</button>
					 <button class="text-two" @click="cancelpwd">取消</button>
				 </view>
			</view>
		</view>
	</view>
</template> 

<script>
	var time = new Date();
	import {mapState} from 'vuex';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import md5 from '../../common/md5.js';

	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				first:true,
				lastSequence:0,
				// sceenHeight:0,
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待收货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '已完成',
						loadingType: 'more',
						orderList: []
					}
					// ,{
					// 	state: 4,
					// 	text: '待评价',
					// 	loadingType: 'more',
					// 	orderList: []
					// }
				],
				showpwd:false,
				passwordval:"",
				payorderid:"",
				state:0
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		onLoad(options){
			// this.getClientHeight();
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			// console.log(options)
			// console.log(options.state)
			// this.tabClick(options.state)
			this.state = options.state;
			this.tabClick(this.state);
			this.loadData()
			// // #ifndef MP
			// this.loadData()
			// // #endif
			// // #ifdef MP
			// if(options.state == 0){
			// 	this.loadData()
			// }
			// // #endif
			
		},
		onReady() {
			this.tabClick(this.state)	
		}, 
		methods: {
			// 获取可视角度（兼容）
			// getClientHeight(){
			// 	const res=uni.getSystemInfoSync();
			// 	console.log(res)
			// 	const system=res.platform;
			// 	if(system=='ios'){
			// 		return 0
			// 	}else if (system=="android"){
			// 		this.sceenHeight = res.windowHeight;
			// 	}else{
			// 		return 0
			// 	}
			// },
			inputchange(e){
				this.passwordval = md5(e.detail.value);
			},
			// 确认支付
			sendpwd(){
				let that = this;
				if(that.$data.passwordval==""){
					that.$api.msg("请输入支付密码");
					return;
				}
				that.updatecoStatus(that.$data.payorderid,6,that.$data.passwordval);
			},
			// 取消支付
			cancelpwd(){
				this.$data.showpwd = false;
			},
			//获取订单列表
			loadData(source){
				// let lastSequence = 0;
				let that = this;
				
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				console.log("navItem信息"+navItem)
				let state = navItem.state;
				// console.log(state)
				
				// if(that.$data.lastSequence == 0){
				// 	navItem.orderList = [];
				// }
				
				// if(source === 'tabChange' && navItem.loaded === true){
				// 	//tab切换只有第一次需要加载数据
				// 	return;
				// }
				if(navItem.loadingType == 'loaded'){
					//防止重复加载
					return;
				}
				
				navItem.loadingType = 'loading';
				
				setTimeout( async ()=>{
					let gotdata = []; let gi=0;
					if(index==0){gi=0;}
					if(index==1){gi=1;}
					if(index==2){gi=2;}
					if(index==3){gi=7;}
					// if(index==4){gi=6;}
					let data = await that.$http.post('/lanhan/shop/commodityOrderList', {
						 "base": {
						  "appId": "001",
						  "channels": "001",
						  "ver": "1.1.5",
						  "clientVer": "1.0",
						  "apn": "wifi",
						  "deviceId": "1233eedds2112",
						  "uid": that.userInfo.userId,
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
							 "status": gi,
							 "pageSize": 10,
							 "lastSequence": this.lastSequence
						 }
					},{isFactory:false});
					if(data.data.base.code == '000000' && data.data.data.length > 0){
						gotdata = data.data.data
						this.lastSequence = gotdata[gotdata.length-1].createTime
					}
					let orderList = gotdata.filter(item=>{
						//添加不同状态下订单的表现形式
						item = Object.assign(item, this.orderStateExp(item.status));
						//演示数据所以自己进行状态筛选
						if(index === 0){
							//0为全部订单
							return item;
						}
						return item.status === index
					});
					gotdata.forEach(item=>{
						if(index === 0){
							//添加不同状态下订单的表现形式
							item = Object.assign(item, this.orderStateExp(item.status));
						}
						navItem.orderList.push(item);
						this.navList[index].orderList = navItem.orderList
						// console.log(this.navList[index].orderList)
					})
					// console.log(navItem.orderList)
					if(!gotdata.length){
						that.$api.msg('加载完成')
					}
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					that.$set(navItem, 'loaded', true);
					
					//判断是否还有数据， 有改为 more， 没有改为noMore 
					navItem.loadingType  = gotdata.length < 10 ? 'nomore' : 'more';
				}, 600);	
			}, 

			//swiper 切换
			changeTab(e){
				// console.log(e.target)
				// console.log(this.navList)
				// this.lastSequence = 0
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index){
				this.lastSequence = 0
				this.tabCurrentIndex = index;
				this.navList[index].orderList=[];
				// console.log(this.navList)
			},
			//删除订单
			deleteOrder(index){
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(()=>{
					this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
					uni.hideLoading();
				}, 600);
			},
			//取消订单
			// cancelOrder(item){
			// 	uni.showLoading({
			// 		title: '请稍后'
			// 	})
			// 	setTimeout(()=>{
			// 		let {stateTip, stateTipColor} = this.orderStateExp(9);
			// 		item = Object.assign(item, {
			// 			state: 9,
			// 			stateTip, 
			// 			stateTipColor
			// 		})
					
			// 		//取消订单后删除待付款中该项
			// 		let list = this.navList[1].orderList;
			// 		let index = list.findIndex(val=>val.id === item.id);
			// 		index !== -1 && list.splice(index, 1);
					
			// 		uni.hideLoading();
			// 	}, 600);
			// },

			//订单状态文字和颜色
			orderStateExp(status){
				let stateTip = '',
					stateTipColor = '#fa436a';
					// case 6:
					// 	stateTip = '待评价'; break;
				switch(+status){
					case 1:
						stateTip = '待付款'; break;
					case 2:
						stateTip = '待收货'; break;
					case 5:
						stateTip = '已取消'; break;
					case 7:
						stateTip = '已完成'; break;
					case 9:
						stateTip = '订单已关闭'; 
						stateTipColor = '#909399';
						break;
						
					//更多自定义
				}
				return {stateTip, stateTipColor};
			},
			
			//详情
			navToDetailPage(id){
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			
			//待付款
			navTodsk(status,amount,orderno,orderid,item){
				if(status==1){
					uni.setStorageSync("shoptype",1);
					uni.setStorageSync("coamount",amount);
					uni.setStorageSync("coorderno",orderno.toString());
					uni.setStorageSync("coorderid",orderid.toString());
					uni.navigateTo({
						url: `/pages/money/pay`
					})
				}
				if(status==2){
					// this.$data.showpwd = true;
					// this.payorderid = orderid;
					
					// 已完成步骤
					this.updatecoStatus(orderid,7);
				}
				if(status==5){
					this.updatecoStatus(orderid,5);
				}
				// if(status==6){
				// 	uni.setStorageSync("orderiteminfo",item);
				// 	uni.navigateTo({
				// 		url:"./evaluation"
				// 	})
				// }
				if(status==7){
					console.log("售后");
				}
			},
			// 订单状态更新
			async updatecoStatus(orderid,status,fundpassword){
				let that = this;
				let resdata = await that.$request.post('/lanhan/shop/updateCommodityOrderStatus', {
					"data":{
						"base": {
						  "appId": "001",
						  "channels": "001",
						  "ver": "1.1.5",
						  "clientVer": "1.0",
						  "apn": "wifi",
						  "deviceId": "1233eedds2112",
						  "uid": that.userInfo.userId,
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
							"orderId": orderid,
							"status": status,
							"fundPassword": fundpassword
						}
					}
				});
				if(resdata.data.base.code == "000000"){
					if(status==5){ that.$api.msg("取消成功"); }
					if(status==7){ that.$api.msg("收货成功");that.tabCurrentIndex = 3; }
					that.$data.showpwd = false;
					that.$data.lastSequence = 0;
					that.loadData();
				}else{
					that.$api.msg(resdata.data.base.msg);
				}
			}
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		padding-top: 40px;
		height: 100vh;
	}
	// .swiper-item{
	// 	height: 1000upx;
	// }
	.list-scroll-content{
		height: 100%;
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: fixed;
		width: 100%;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				// color: $base-color;
				color: #FD852F;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					// border-bottom: 2px solid $base-color;
					border-bottom: 2px solid #FD852F;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}
				.price{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					&:before{
						content: '$';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 0 30upx 20upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '$';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__image {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
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
</style>
