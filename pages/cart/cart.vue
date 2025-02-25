<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登录></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view class="delclass" @click="deleteCartItem(index)"><text class="del-btn">删除</text></view>
					<!-- <text class="del-btn yticon icon-shanchu4"> -->
					<view class="car_list">
						<view class="yticon icon-xuanzhong2 checkbox" :class="{checked: item.checked}" @click="check('item', index)"></view>
						<view class="cart-item" :class="{'b-b': index!==cartList.length-1}">
							<view class="image-wrapper">
								<image :src="item.image" :class="[item.loaded]" mode="aspectFill" lazy-load @load="onImageLoad('cartList', index)"
								 @error="onImageError('cartList', index)" @click="product(item.commodityId)"></image>
								<!-- <view class="yticon icon-xuanzhong2 checkbox" :class="{checked: item.checked}" @click="check('item', index)"></view> -->
							</view>
							<view class="item-right">
								<view class="title">{{item.title}}</view>
								<view class="attr">{{item.address}}</view>
								<view class="ir-bottom">
									<view class="price">${{item.price}}</view>
									<!-- <uni-number-box 
										class="step"
										:min="1" 
										:max="item.stock"
										:value="item.number"
										:isMax="false"
										:isMin="item.number===1"
										:index="index"
										@eventChange="numberChange"
									></uni-number-box> -->
									<view class="uninumbox">
										<view class="uni-numbox-minus" @click="sub(item.number,index,item.canBuyNumber)">
											<text class="yticon icon--jianhao" :class="minDisabled?'uni-numbox-disabled': ''"></text>
										</view>
										<input class="uni-numbox-value" type="number" :value="item.number" disabled>
										<view class="uni-numbox-plus" @click="plus(item.number,index,item.canBuyNumber)">
											<text class="yticon icon-jia2" :class="item.maxDisabled?'uni-numbox-disabled': ''"></text>
										</view>
									</view>
								</view>
							</view>
						</view>
										
					</view>
					
				</block>
			</view>
			<!-- 底部菜单栏  :value="item.number>item.stock?item.stock:item.number"   item.number>=item.stock?true:-->
			<view class="action-section">
				<view class="checkbox">
					<image :src="allChecked?'/static/selected.png':'/static/select.png'" mode="aspectFit" @click="check('all')"></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<view>合计：<text class="price">${{total}}</text></view>
					<!-- <text class="coupon">
						已优惠
						<text>74.35</text>
						元
					</text> -->
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				minDisabled:false,
				maxDisabled:[],
				text:'删除'
			};
		},
		onShow() {
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
				this.loadData();
			}
		},
		onLoad() {

		},
		watch: {
			//显示空白页
			cartList(e) {
				let empty = e.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}
			}
		},
		methods: {
			onNavigationBarButtonTap(e) {
				// #ifdef APP-PLUS  
				var webView = this.$mp.page.$getAppWebview();  
				// 修改buttons  
				// index: 按钮索引, style {WebviewTitleNViewButtonStyles }  
				webView.setTitleNViewButtonStyle(0, {  
				    text: '删除',  
				});  
				// #endif
			},
			// 数量减方法
			sub(num, index, maxnum) {
				let that = this;
				if (parseInt(num) <= 1) {
					this.cartList[index].number = 1;
				} else {
					this.cartList[index].number = parseInt(this.cartList[index].number) - 1;
					if(maxnum > that.cartList[index].number){
						this.cartList[index].maxDisabled = false;
					}
				}
				this.calcTotal();
			},
			// 数量加方法
			plus(num, index, maxnum) {
				let that = this;
				if(maxnum!==undefined){
					if(maxnum > that.cartList[index].number){
						that.cartList[index].number++;
						this.calcTotal();
					}
					if(maxnum <= that.cartList[index].number){
						that.cartList[index].maxDisabled = true;
						return;
					}
				}else{
					that.cartList[index].number++;
					this.calcTotal();
				}
			},
			//请求数据
			async loadData() {
				let data = await this.$http.post('/lanhan/shop/shoppingCartInfo', {
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
				}, {
					isFactory: false
				});
				let cartList = data.data.data.map(item => {
					item.checked = true;
					item.maxDisabled = false;
					return item;
				});
				this.cartList = cartList;
				this.calcTotal(); //计算总价
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			//选中状态处理
			check(type, index) {
				if (type === 'item') {
					this.cartList[index].checked = !this.cartList[index].checked;
					// this.allChecked = this.cartList[index].checked;
				} else {
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item => {
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			numberChange(data) {
				this.cartList[data.index].number = data.number;
				this.calcTotal();
			},
			//删除
			async deleteCartItem(index) {
				let data = await this.$http.post('/lanhan/shop/removeShoppingCart', {
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
						"shoppingCartIds": [this.cartList[index].id]
					}
				}, {
					isFactory: false
				});

				this.$api.msg(data.data.base.msg)
				if (data.data.base.code == '000000') {

					let list = this.cartList;
					let row = list[index];
					let id = row.id;

					this.cartList.splice(index, 1);
					this.calcTotal();
					uni.hideLoading();
				}
			},
			//清空
			clearCart() {
				uni.showModal({
					content: '清空购物车？',
					success: async (e) => {
						if (e.confirm) {
							let arrId = [];
							this.cartList.forEach(item => {
								arrId.push(item.id)
							})
							this.cartList = [];
							let data = await this.$http.post('/lanhan/shop/removeShoppingCart', {
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
									"shoppingCartIds": arrId
								}
							}, {
								isFactory: false
							});
							this.$api.msg(data.data.base.msg)
						}
					}
				})
			},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item => {
					if (item.checked === true) {
						total += item.price * item.number;
					} else if (checked === true) {
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			//创建订单
			createOrder() {
				let list = this.cartList;
				let goodsData = [];
				list.forEach(item => {
					if (item.checked) {
						goodsData.push(item.commodityId)
					}
				})
				
				if(goodsData == ""){
					this.$api.msg("请选择购买商品");
				}else{
					uni.navigateTo({
						url: `/pages/order/createOrder?id=${goodsData.toString()}`
					})
				}
			},
			product(id) {
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background:rgba(246,246,246,1);
	}
	.container {
		padding-bottom: 134upx;

		/* 空白页 */
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}

	/* 购物车列表项 */
	.nodes{
	    color: rgb(250, 67, 106);
	    background: rgba(249, 210, 218, 0.2);
	    border-radius: 3px;
	    font-size: 12px;
	    padding: 3% 5%;
	    margin: 3% 0% 0;
	}
	.delclass{
		text-align: right;
		padding: 3% 5% 0;
		font-size: 24upx;
		
		.del-btn {
		    color: #fa436a;
		    margin-right: 8upx;
		    border: 1px solid #fa436a;
		    border-radius: 10upx;
		    padding: 1px 10upx;
		}
	}
	.cart-list {
		background: #fff;
		margin-top: 10px;
	}
	.cart-item {
		display: flex;
		position: relative;
		padding: 30upx 40upx;

		.image-wrapper {
			width: 170upx;
			height: 170upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
				opacity: 1;
			}
		}

		

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;
			width: 436upx;
			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				display: block;
				width: 350upx;
				margin-bottom: 5%;
			}
			
			.title{
				width: 100%;
				overflow: hidden;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				font-size: 30upx;
			}
			
			.ir-bottom{
				width: 100%;
				display: flex;
				justify-content: space-between;
				.price {
					color: #FA436A;
					font-size: $font-base + 4upx;
				}
			}
		}
	}
	.checkbox {

		z-index: 8;
		font-size: 44upx;
		line-height: 1;
		padding: 4upx;
		color: $font-color-disabled;
		background: #fff;
		border-radius: 50px;
	}
	/* 加减 */
	.uninumbox {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 125upx;
		height: 50upx;
		line-height: 50upx;
		background: #f5f5f5;
		border: 1rpx solid #f5f5f5;
	}

	.uni-numbox-minus,
	.uni-numbox-plus {
		margin: 0;
		/* background-color: #f5f5f5; */
		width: 40upx;
		height: 50upx;
		line-height: 40upx;
		text-align: center;
		position: relative;
	}

	.uni-numbox-minus .yticon,
	.uni-numbox-plus .yticon {
		font-size: 25upx;
		color: #555;
	}

	.uni-numbox-minus {
		border-right: 1rpx solid #f5f5f5;
		/* border-top-left-radius: 6upx;
		border-bottom-left-radius: 6upx; */
	}

	.uni-numbox-plus {
		border-left: 1rpx solid #f5f5f5;
		/* border-top-right-radius: 6upx;
		border-bottom-right-radius: 6upx; */
	}

	.uni-numbox-value {
		/* position: relative; */
		/* background-color: #f5f5f5; */
		width: 45upx;
		text-align: center;
		padding: 0;
		font-size: 28upx;
	}

	.uni-numbox-disabled.yticon {
		color: #d6d6d6;
	}

	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		/* #endif */
		position: fixed;
		left: 0;
		bottom: 0upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 100%;
		height: 120upx;
		padding-left: 30upx;
		background: rgba(255, 255, 255, .9);
		border-radius: 16upx;
		.checkbox {
			height: 52upx;
			position: relative;

			image {
				width: 52upx;
				height: 100%;
				position: relative;
				z-index: 5;
			}
		}

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			opacity: 0;
			transition: .2s;

			&.show {
				opacity: 1;
				width: 120upx;
			}
		}

		.total-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;
			font-size: 30upx;

			.price {
				color: #FA436A;
				font-size: $font-lg;
			}

			.coupon {
				font-size: $font-sm;
				color: $font-color-light;

				text {
					color: $font-color-dark;
				}
			}
		}

		.confirm-btn {
			line-height: 60px;
			height: 100%;
			width: 250upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
		}
	}

	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.checkbox.checked {
		color: $uni-color-primary;
	}
	.car_list {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
</style>
