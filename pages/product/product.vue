<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in commodityInfo.images" :key="index">
					<view class="image-wrapper">
						<image
							:src="item.image"
							class="loaded" 
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="introduce-section" v-if="commodityInfo">
			<text class="title">{{commodityInfo.name || '商品名称'}}</text>
			<view class="price-box">
				<text class="price-tip">$</text>
				<text class="price">{{commodityInfo.price | turn}}/{{commodityInfo.unit}}</text>
				<text class="m-price">${{commodityInfo.originalPrice | turn}}</text>
				<text class="coupon-tip">{{commodityInfo.firstDiscount*10||0}}折</text>
			</view>
			<view class="bot-row">
				<text>销量: {{commodityInfo.turnover || 0}}</text>
				<text>库存: {{commodityInfo.inventory || 0}}</text>
				<text>浏览量: {{commodityInfo.viewCnt || 0}}</text>
			</view>
		</view>
		
		<!--  分享 -->
		<!-- <view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				 惠
			</view>
			<text class="tit">分享有惊喜，快快行动吧~</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				<button open-type="share" class="aidbbottom-left">立即分享</button>
				<text class="yticon icon-you"></text>
			</view>
			
		</view> -->

		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec" v-if="showspec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem.name}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">支付方式</text>
				<text class="con t-r red">{{commodityInfo.markDesc}}</text>
				<!-- <text class="yticon icon-you"></text> -->
			</view>
			<!-- <view class="c-row b-b">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text>新人首单送20元无门槛代金券</text>
					<text>订单满50减10</text>
					<text>订单满100减30</text>
					<text>单笔购买满两件免邮费</text>
				</view>
			</view> -->
			<!-- <view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text>7天无理由退换货 ·</text>
					<text>假一赔十 ·</text>
				</view>
			</view> -->
		</view>
		
		<!-- 评价 -->
		<!-- <view class="eva-section">
			<view class="e-header" @click="gotocommentlist">
				<text class="tit">评价</text>
				<text>({{commodityInfo.commentCnt}})</text>
				<text class="tip">好评 {{commodityInfo.score}}分</text>
				<text class="yticon icon-you"></text>
			</view> 
			<view class="eva-box" v-for="(item,index) in commentList" :key="index">
				<image class="portrait" :src="item.userImage"></image>
				<view class="right">
					<text class="name">{{item.userName}}</text>
					<text class="con">{{item.comment}}</text>
					<view class="comment-img" v-for="(imgitem,imgindex) in item.images" :key="imgindex">
						<image :src="imgitem.image"></image>
					</view>
					<view class="bot">
						<text class="attr">购买类型：{{item.commentedContent}}</text>
						<text class="time">{{item.createdTime}}</text>
					</view>
				</view>
			</view>
		</view> -->
		
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<jyf-parser :html="htmlNodes"></jyf-parser>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="[favorite==true?'active':'']" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>
			
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="addcarbefor">加入购物车</button>
			</view>
		</view>
		
		
		<!-- 规格-模态层弹窗 -->
		<view 
			class="popup spec" 
			:class="specClass"
			@touchmove.stop.prevent="stopPrevent"
			@click="toggleSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t" v-if="commodityInfo">
					<image v-if="commodityInfo.images" :src="commodityInfo.images[0].image || 'https://gd3.alicdn.com/imgextra/i3/0/O1CN01IiyFQI1UGShoFKt1O_!!0-item_pic.jpg_400x400.jpg'"></image>
					<view class="right">
						<text class="price">¥{{commodityInfo.price | turn}}</text>
						<text class="stock">库存：{{commodityInfo.inventory || 1}}{{commodityInfo.unit}}</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem.name}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in specList" :key="index" class="attr-list">
					<text>{{item.name}}</text>
					<view class="item-list">
						<text 
							v-for="(childItem, childIndex) in specChildList" 
							v-if="childItem.pid === item.id"
							:key="childIndex" class="tit"
							:class="{selected: childItem.selected}"
							@click="selectSpec(childIndex, childItem.pid)"
						>
							{{childItem.name}}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
		<!-- 分享 -->
		<share 
			ref="share" 
			:contentHeight="580"
			:shareList="shareList"
		></share>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	import share from '@/components/share';
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue'
	export default{
		components: {
			share,jyfParser
		},
		data() {
			return {
				commentList:[],
				commodityInfo:'',
				commodityId:'',
				specClass: 'none',
				specSelected:[],
				htmlNodes:"",
				favorite: false,
				shareList: [],
				desc: `
					<div style="width:100%">
						<image style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i4/479184430/O1CN01nCpuLc1iaz4bcSN17_!!479184430.jpg_400x400.jpg" />
						<image style="width:100%;display:block;" src="https://gd2.alicdn.com/imgextra/i2/479184430/O1CN01gwbN931iaz4TzqzmG_!!479184430.jpg_400x400.jpg" />
						<image style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i3/479184430/O1CN018wVjQh1iaz4aupv1A_!!479184430.jpg_400x400.jpg" />
						<image style="width:100%;display:block;" src="https://gd4.alicdn.com/imgextra/i4/479184430/O1CN01tWg4Us1iaz4auqelt_!!479184430.jpg_400x400.jpg" />
						<image style="width:100%;display:block;" src="https://gd1.alicdn.com/imgextra/i1/479184430/O1CN01Tnm1rU1iaz4aVKcwP_!!479184430.jpg_400x400.jpg" />
					</div>
				`,
				specList: [
					{
						id: 1,
						name: '尺寸',
					},
					{	
						id: 2,
						name: '颜色',
					},
				],
				specChildList: [
					{
						id: 1,
						pid: 1,
						name: 'XS',
					},
					{
						id: 2,
						pid: 1,
						name: 'S',
					},
					{
						id: 3,
						pid: 1,
						name: 'M',
					},
					{
						id: 4,
						pid: 1,
						name: 'L',
					},
					{
						id: 5,
						pid: 1,
						name: 'XL',
					},
					{
						id: 6,
						pid: 1,
						name: 'XXL',
					},
					{
						id: 7,
						pid: 2,
						name: '白色',
					},
					{
						id: 8,
						pid: 2,
						name: '珊瑚粉',
					},
					{
						id: 9,
						pid: 2,
						name: '草木绿',
					},
				],
				showspec:false,
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		filters:{
			turn(v){
				return v.toFixed(2)
			}
		},
		async onLoad(options){
			let that = this;
			//接收传值,id里面放的是标题，因为测试数据并没写id 
			if(!options.id){
				that.$api.msg(`id获取失败`);
				uni.navigateBack({
					delta:1
				});
				return;
			}
			that.$data.commodityId = options.id;
			let data = await that.$http.post('/lanhan/shop/commodityInfo', {
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
					"commodityId": that.$data.commodityId,
				}
			});
			that.$data.commodityInfo = data;
			if(data.isConcern==1){that.$data.favorite =true;}else{that.$data.favorite = false;}
			if(data.categoryV1Name=="网红女装"){that.$data.showspec = true;}else{that.$data.showspec = false;}
			that.$data.htmlNodes = data.content;
			
			uni.setStorageSync("pcommentlist",data.commentList);
			if(data.commentList.length > 2){
				for(let i=0; i<2; i++){
					that.$data.commentList.push(data.commentList[i]);
				}
			}else{
				for(let i=0; i<data.commentList.length; i++){
					that.$data.commentList.push(data.commentList[i]);
				}
			}
			
			//规格 默认选中第一条
			that.$data.specList.forEach(item=>{
				for(let cItem of that.$data.specChildList){
					if(cItem.pid === item.id){
						that.$set(cItem, 'selected', true);
						that.$data.specSelected.push(cItem);
						break; //forEach不能使用break
					}
				}
			})
			that.$data.shareList = await that.$api.json('shareList');
		},
		/**
		   * 用户点击右上角分享
		   */
		  onShareAppMessage: function (res) {
			let that = this;
			if(res.from === 'button'){
			  let titlename = that.$data.commodityInfo.name;
			  return {
				title: titlename,
				path: that.$data.commodityInfo.shareUrl,
				imageUrl: that.$data.commodityInfo.images[0],
				success: function (ress) {
				  // 转发成功
				  var shareTickets = ress.shareTickets;
				  // if (shareTickets.length == 0) {
				  //   return false;
				  // }
				  // //可以获取群组信息
				  // wx.getShareInfo({
				  //   shareTicket: shareTickets[0],
				  //   success: function (res) {
				  //     console.log(res)
				  //   }
				  // })
				},
				fail: function (resss) {
				  // 转发失败
				  console.log("转发失败:" + JSON.stringify(resss));
				}
			  }
			}
		  },
		methods:{
			//规格弹窗开关
			toggleSpec() {
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
			},
			//选择规格
			selectSpec(index, pid){
				let list = this.specChildList;
				list.forEach(item=>{
					if(item.pid === pid){
						this.$set(item, 'selected', false);
					}
				})

				this.$set(list[index], 'selected', true);
				//存储已选择
				/**
				 * 修复选择规格存储错误
				 * 将这几行代码替换即可
				 * 选择的规格存放在specSelected中
				 */
				this.specSelected = []; 
				list.forEach(item=>{ 
					if(item.selected === true){ 
						this.specSelected.push(item); 
					} 
				})
				
			},
			// 评论
			gotocommentlist(){
				uni.navigateTo({
					url:"/pages/product/commentlist"
				})
			},
			//分享
			share(){
				this.$refs.share.toggleMask();	
			},
			//收藏
			toFavorite:async function(){
				let status = 0;
				this.favorite = !this.favorite;
				if(this.favorite==true){
					status = 1;
				}else{
					status = 0;
				}
				let favoriteproduct = await this.$http.post('/lanhan/hall/collect', {
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
						"objectId": this.commodityId,
						"status": status,
						"type": 1
					}
				})
			},
			buy(){
				let that = this;
				if(!this.hasLogin){
					uni.showModal({
						content:"您还没登录，请登录后再购买",
						cancelText:"取消",
						confirmText:"去登录",
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url:"../public/login"
								})
							}else if(res.cancel){
								console.log('用户点击取消');
							}
						}
					})
				}else{
					if(that.$data.commodityInfo.type==2){
						if(that.$data.commodityInfo.canBuyNumber==0){
							that.$api.msg("您的购买份额已达上限！看看其他商品吧！");
						}else{
							uni.navigateTo({
								url: `/pages/order/createOrder?id=${that.commodityId}`
							})
						}
					}else{
						uni.navigateTo({
							url: `/pages/order/createOrder?id=${that.commodityId}`
						})
					}
				}
			},
			stopPrevent(){},
			addcarbefor(){
				let that = this;
				if(that.$data.commodityInfo.type==2){
					if(that.$data.commodityInfo.canBuyNumber==0){
						that.$api.msg("您的购买份额已达上限！看看其他商品吧！");
					}else{
						that.addcar();
					}
				}else{
					that.addcar();
				}
			},
			addcar:async function(){
				let that = this;
				let data = await that.$http.post('/lanhan/shop/addShoppingCart', {
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
						"commodityId": that.commodityId,
						"number": 1
					}
				},{isFactory:false});
				if(data.data.base.code == '000000'){
					that.$api.msg(data.data.base.msg);
				}else{
					that.$api.msg(data.data.base.msg);
				}
			}
		},

	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(to left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position:relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10upx;
		}
		.icon-bangzhu1{
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
			display: flex;
			align-items: center;
			margin-left: 10%;
		}
		.aidbbottom-left{
			color: #fa436a;
			font-size: 24upx;
			padding: 0;
			margin: 0;
			line-height: 40upx;
			height: 40upx;
			width: 124upx;
			display: inline-block;
			background: rgba(0,0,0,0);
			border: 1upx solid #fa436a;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}
	
	.c-list{
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		border-top: 2px solid #f5f5f5;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10upx;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20upx 0;
		.portrait{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		padding: 5%;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10upx 30upx;
		.a-t{
			display: flex;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}
		.item-list{
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.btn{
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			.yticon{
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
</style>
