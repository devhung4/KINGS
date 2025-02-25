<template>
	<view class="content">
		<view class="header">
			<view class="" style="color: white;width: 100%;text-align: center;">
				商城
			</view>
			<!-- <view class="header_left">
				<image src="../../static/img/tab_mine.png" mode=""></image>
				<span>分类</span>
				
			</view>
			<view class="header_right" @tap="navetosearch">
				<view class="ser-input"><uni-icons color="red" type="search" size="20"></uni-icons><input type="search" placeholder="输入关键字搜索" placeholder-class="phclass" disabled /></view>
					<input type="text" value="" placeholder="大家都在搜春季好物" />
			</view>
			<view class="header_left" @click="cart">
				<image src="../../static/tab-cart.png" mode=""></image>
			</view> -->
		</view>
		<view class="cont">
			<!-- <view class="banner" v-for="(item,index) in shoppic" :key='index'>
				<image :src="item.imgUrl" mode=""></image>
			</view> -->
			<view class="carousel-section">
				<swiper class="carousel" circular indicator-dots="true" autoplay="true" interval="2000" duration="500">
					<!-- @click="navToDetailPage(item.forwardUrl, item.type)" -->
					<swiper-item v-for="(item, index) in shoppic" :key="index" class="carousel-item" >
						<image :src="item.imgUrl" />
					</swiper-item>
				</swiper>
			</view>
			<view class="explain">
				<ul>
					<li>
						<image src="../../static/img/ball.png" style="width: 32upx;box-shadow: 32upx;" mode="" class="ball"></image>
						<text>全球直采</text>
					</li>
					<li>
						<image src="../../static/img/good.png" mode="" class="good"></image>
						<text>正品保证</text>
					</li>
					<li>
						<image src="../../static/img/pay.png" style="width: 32upx;height: 32upx;" mode="" class="good"></image>
						<text>售后无忧</text>
					</li>
					<li>
						<image src="../../static/img/service.png" style="width: 28upx;box-shadow: 32upx;" mode="" class="ball"></image>
						<text>假一赔十</text>
					</li>
				</ul>
			</view>
			<view class="type_list">
				<ul>
					<li v-for="(item,index) in list" :key="index" :class="{active: index === currentId}" @click="getgoodlist(index,item.id,0,0)">{{item.name}}</li>
				</ul>
			</view>
			<view class="hot">
				<view class="hot_list">
					<ul v-if="goodsList.length">
						<li v-for="(item,index) in goodsList" :key="index" @click="navToDetailPage(item.commodityId)">
							<image :src="item.displayImg" mode=""></image>
							<view class="hot_synopsis">
								<text>{{item.name}}</text>
								<view class="sell_wall">
									<view class="sell">
										热销{{item.turnover}}件
									</view>
									<view class="wall" v-show="false">
										<image src="../../static/img/sell.png" mode=""></image>
										<text>+400</text>
									</view>
								</view>
								<view class="hot_price">
									${{item.price | turn}}
									<text>${{item.originalPrice | turn}}</text>
								</view>
							</view>
							
						</li>	
					</ul>
					
					<view class="v-else" v-else style="display:flex;width:100%;justify-content: center;padding:100upx 0;height: 800upx;">
						<view>
							<image src="../../static/nodata.png" style="width:360upx;height:250upx"></image>
						</view>
						
						<view>暂无相关商品</view>
					</view>
				</view>
			</view>
		</view>
		
		
		<!-- <scroll-view scroll-y class="left-aside">
			<view v-for="(item,index) in list" :key="index" class="f-item b-b" :class="{active: index === currentId}" @click="getgoodlist(index,item.id,0,0)">
				{{item.name}}
			</view>
		</scroll-view> -->
		<!-- <scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop"> -->
		<!-- <view class="s-list">>
			<view class="t-list" v-if="goodsList.length">
				<view v-for="(item,index) in goodsList" :key="index" class="t-item" @click="navToDetailPage(item.commodityId)">
					<image :src="item.displayImg"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
			<view v-else style="margin-left: 35px;margin-top: 21%;text-align: center;">
				<image src="../../static/nodata.png" style="width:360upx;height:250upx"></image>
			</view>
		</view> -->
		<!-- </scroll-view> -->
		<!-- <view class="v-else" style="display:flex;width:100%;justify-content: center;padding:100upx 0;height: 800upx;">
			<view>
				<image src="../../static/nodata.png" style="width:360upx;height:250upx"></image>
			</view>
			
			<view>敬请期待</view>
		</view> -->
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				indicatorDots: true,
				autoplay: false,
				interval: 2000,
				duration: 500,
				autop:  true,
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 0,
				categorypId:0,
				// flist: [],
				slist: [],
				tlist: [],
				list: [],
				goodsList: [],
				lastsequence:0,
				shoppic: []
				
			}
		},
		filters: {
			turn(v) {
				return v.toFixed(2)
			}
		},
		onLoad() {
			this.loadData(0,0,0,1);
			this.getgoodlist(0,0,0,1);
			this.getshoppic();
		},
		// onTabItemTap(e){
		// 	this.$api.msg("敬请期待");
		// },
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
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
					url:"../search/search"
				});
			}
		},
		// 点击导航栏 buttons 时触发
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
					url:"../user/invitecode"
				});
			}
		},
		
		//下拉刷新
		onPullDownRefresh(){
			let that = this;
			that.getgoodlist(this.currentId,this.categorypId,0,0);
		},
		//加载更多
		onReachBottom(){
			this.getgoodlist(this.currentId,this.categorypId,this.lastsequence,1);
		},
		methods: {
			//跳转购物车
			cart() {
				uni.navigateTo({
					url:'../cart/cart'
				})
			},
			//获取banner图
			async getshoppic() {
				let shoppic = await this.$request.post('/lanhan/home/banner', {
					"data": {
						"base": {
							"appId": "001",
							"channels": "001",
							"ver": "1.1.5",
							"clientVer": "1.0",
							"apn": "wifi",
							"deviceId": "1233eedds2112",
							"uid": "12332112",
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
							"type": 4
						}
					}
				});
				this.shoppic = shoppic.data.data;
			},
			async getgoodlist(index, id, lastsequence,type) {
				this.currentId = index;
				this.categorypId = id;
				if(type==0){
					this.goodsList = [];
				}
				uni.showLoading({
					title:"加载中"
				})
				let category2 = await this.$request.post('/lanhan/home/recommendCommoditys', {
					"data":{
						"base": {
							"appId": "001",
							"channels": "001",
							"ver": "1.1.5",
							"clientVer": "1.0",
							"apn": "wifi",
							"deviceId": "1233eedds2112",
							"uid": "12332112",
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
							"categoryPId": id,
							// "categoryId": id,
							"keyWord": "",
							"pageSize": 10,
							"lastSequence": lastsequence,
							"province": "",
							"city": "",
							"county": "",
							"town": "",
							"marketId": "",
							"isHot": 0,
							"isDiscount": 0
						}
					}
				});
				uni.hideLoading();
				uni.stopPullDownRefresh();
				let newgoodslist = category2.data.data;
				if(category2.data.base.code !== "000000"){
					this.$api.msg("没有更多数据了");
					return;
				}
				
				if(newgoodslist.length!==0){
					this.goodsList = this.goodsList.concat(newgoodslist);
					this.lastsequence = category2.data.data[category2.data.data.length-1].sequence;
				}
			},
			async loadData() {
				try {
					var res1 = await this.$request.post("/lanhan/home/getCategoryV1List", {
						data: {}
					});
					this.list = res1.data.data
					// let category2 = await this.$http.post('/lanhan/home/recommendCommoditys', {
					// 	"base": {
					// 		"appId": "001",
					// 		"channels": "001",
					// 		"ver": "1.1.5",
					// 		"clientVer": "1.0",
					// 		"apn": "wifi",
					// 		"deviceId": "1233eedds2112",
					// 		"uid": "12332112",
					// 		"valat": 22.332112,
					// 		"lalong": 12.332112,
					// 		"platform": "IOS",
					// 		"platformVer": "8",
					// 		"resolution": "960*640",
					// 		"deviceType": "P6",
					// 		"carrier": "china mobile",
					// 		"city": "合肥",
					// 		"brand": "huawei"
					// 	},
					// 	"param": {
					// 		"categoryPId": 0,
					// 		"keyWord": "",
					// 		"pageSize": 10,
					// 		"lastSequence": 0,
					// 		"province": "",
					// 		"city": "",
					// 		"county": "",
					// 		"town": "",
					// 		"marketId": "",
					// 		"isHot": 0,
					// 		"isDiscount": 0
					// 	}
					// });

					// this.goodsList = category2
				} catch (error) {
					console.error('error:',error);
				}
			},
			//一级分类点击
			tabtap(item) {
				if (!this.sizeCalcState) {
					this.calcSize();
				}

				this.currentId = item.id;
				let index = this.slist.findIndex(sitem => sitem.pid === item.id);
				this.tabScrollTop = this.slist[index].top;
			},
			// 搜索
			navetosearch(){
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
						url:"../search/search"
					})
				}
			},
			//右侧栏滚动
			// asideScroll(e) {
			// 	if (!this.sizeCalcState) {
			// 		this.calcSize();
			// 	}
			// 	let scrollTop = e.detail.scrollTop;
			// 	let tabs = this.slist.filter(item => item.top <= scrollTop).reverse();
			// 	if (tabs.length > 0) {
			// 		this.currentId = tabs[0].pid;
			// 	}
			// },
			// //计算右侧栏每个tab的高度等信息
			// calcSize() {
			// 	let h = 0;
			// 	this.slist.forEach(item => {
			// 		let view = uni.createSelectorQuery().select("#main-" + item.id);
			// 		view.fields({
			// 			size: true
			// 		}, data => {
			// 			item.top = h;
			// 			h += data.height;
			// 			item.bottom = h;
			// 		}).exec();
			// 	})
			// 	this.sizeCalcState = true;
			// },
			navToList(tid) {
				uni.navigateTo({
					url: `/pages/product/list?tid=${tid}`
				})
			},
			navToDetailPage(id) {
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
		}
	}
</script>

<style lang='scss' scoped>
	page {
		background-color: #f2f2f2;
	}

	li {
		list-style: none;
	}
	
	ul {
		padding: 0;
	}
		
	.v-else{
		font-size: 30upx;
		color: #c6c6c6;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.header {
		height: 120upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 28upx 30upx 26upx 30upx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		top: 0;
		padding-top: var(--status-bar-height);
		width: 100%;
		/* background: #fff; */
		background: #00575b;
		z-index: 10;
		.header_right{
			position: relative;
			margin-right: 30upx;
			background: rgba(240, 240, 240, 1);
			width: 100%;
	
			input {
				width: 100%;
				height: 60upx;
				borderRadius: 30px;
				background: url(../../static/img/btn_search_normal.png) no-repeat;
				background-position: 20% center;
			}
	
			
		}
	
		.header_left {
		
			image {
				margin-top: 10upx;
				width: 54upx;
				height: 54upx;
			}
	
			span {
				display: block;
				white-space: nowrap;
				font-size: 24upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				color: rgba(51, 51, 51, 1);
				margin-top: -15upx;
			}
		}
	}
	.input-placeholder {
		text-align: center
	}
	.cont {
		margin-top: 120upx;
		.banner {
			width:750upx;
			height:300upx;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	
	.explain {
		height:100upx;
		background:rgba(255,255,255,1);
		border-bottom: 10upx solid rgba(240, 240, 240, 1);
		ul {
			height: 100%;
			display: flex;
			justify-content: space-around;
			align-items: center;
			li {
				display: flex;
				align-items: center;
				
				text {
					font-size:20upx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:#DA4529;
					line-height:28upx;
					margin-left: 10upx;
				}
				.ball {
					width: 32upx;
					height: 32upx;
				}
				.good {
					width:28upx;
					height:32upx;
				}
			}
		}
	}
	
	.type_list {
		position: relative;
		box-sizing: border-box;
		overflow-x: hidden;
		z-index: 5;
		overflow-x: scroll;
		width: 100%;
		
		ul {
			display: flex;
			justify-content: space-around;
			align-items: center;
			overflow-x: hidden;
			width: 110%;
			background: #fff;
	
			li {
				white-space: nowrap;
				padding: 24upx 30upx 26upx 30upx;
				font-weight:400;
				box-sizing: border-box;
				position: relative;
				font-size:32upx;
				font-family:PingFangSC-Regular,PingFang SC;
				/* color:rgba(102,102,102,1); */
				line-height:44upx;
			}
		}
	}
	.active{
		color: rgb(253, 133, 47);
	}
	.active:after {
		position: absolute;
		content: "";
		width: 30upx;
		bottom: 6upx;
		text-align: center;
		/* border-bottom: 10upx solid rgba(232, 65, 112, 1); */
		border-bottom: 8upx solid rgb(253, 133, 47);
		left: 50%;
		transform: translate(-50%, -50%);
		font-size:36upx;
		font-family:PingFangSC-Semibold,PingFang SC;
		font-weight:600;
		/* color:#333333; */
		
	}
	
	.hot_title::after {
		position: absolute;
			content:"";
			height: 30upx;
			border-right: 10upx solid rgba(232,65,112,1);		
	}
	.hot {
		
		.hot_list {
			padding: 0 19upx 76upx 19upx;
			box-sizing: border-box;
			background:rgba(240, 240, 240, 1);
			ul {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				li {
					width:334upx;
					height:552upx;
					background:rgba(255,255,255,1);
					border-radius:4upx;
					margin: 20upx 11upx 0 11upx;
					image {
						width: 100%;
						height:324upx;
					}
					.hot_synopsis {
						padding: 0 24upx 0upx 20upx;
						box-sizing: border-box;
						
						text {
							height:80upx;
							font-size:28upx;
							font-family:PingFangSC-Semibold,PingFang SC;
							font-weight:600;
							color:rgba(51,51,51,1);
							line-height:40upx;
							display: block;
							overflow-y: hidden;
						}
						
						.sell_wall {
							display: flex;
							justify-content: flex-start;
							align-items: center;
							margin: 6upx 0 10upx 0;
							.sell {
								/* width:110upx; */
								height:28upx;
								background:#FCECEF;
								border-radius:4upx;
								font-size:20upx;
								font-family:PingFangSC-Regular,PingFang SC;
								color:#DA4529;
								line-height:28upx;
								text-align: center;
							}
							.wall {
								margin-left:10upx;
								/* width:78upx; */
								height:28upx;
								background:#FCECEF;
								border-radius:4upx;
								display: flex;
								padding: 5upx;
								vertical-align: text-bottom;
								image {
									width:16upx;
									height:20upx;
								}
								text {
									font-size:20upx;
									font-family:PingFangSC-Regular,PingFang SC;
									color:rgba(232,65,112,1);
									line-height:20upx;
									
								}
							}
						}
						
						.hot_price {
							font-size:32upx;
							font-family:PingFangSC-Semibold,PingFang SC;
							color:#DA4529;
							line-height:44upx;
							font-weight:600;
							text {
								font-size:20upx;
								font-family:PingFangSC-Regular,PingFang SC;
								color:rgba(153,153,153,1);
								line-height:28upx;
								text-decoration: line-through;
								font-weight:600;
								display: inline;
							}
						}
					}
					
				}
			}
		}
	}
	
	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 0upx;
		padding-bottom: 5%;
		// background: #ffffff;
		background-image: linear-gradient(rgba(0,87,91,1) 37%, rgba(255,255,255,0) 100%);
		
		border-bottom: 20upx solid #f7f7f7;
		.carousel {
			height: 320upx;
			width: 90%;
			margin: 0 5%;
			border-radius: 10upx;
			box-shadow: 0 5px 5px 0 #a6c6ee;
			.carousel-item {
				image {
					width: 100%;
					height: 100%;
					border-radius: 10upx;
				}
			}
		}
	}
</style>
