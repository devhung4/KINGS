<template>
	<view class="content">
		<!-- 分类 -->
		<view class="titleNview-background">
			 <!-- :style="{backgroundColor:titleNViewBackground}" -->
			<scroll-view class="scroll-view_H" scroll-x="true"  scroll-left="120" style="white-space: nowrap;">
				<view @click="getgoodlist(index,item.id)" v-for="(item,index) in category" :key="index" class="scroll-view-item_H">
					<view class="svih-title" :class="scrindex == index ? 'uni-bg-red' : ''">{{item.name}}</view>
				</view>
			</scroll-view>
			<view class="categorytype"><!-- @click="toggleCateMask('show')" -->
				<uni-icons color="black" type="arrowdown" size="20"></uni-icons>
			</view>
		</view>
		
		<!-- 排序 -->
		<!-- <view class="navbar">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				综合
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				销量
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
			<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
		</view> -->
		
		<!-- 列表 -->
		<view v-if="goodsList.length">
			<view class="goods-list">
				<view
					v-for="(item, index) in goodsList" :key="index"
					class="goods-item"
					@click="navToDetailPage(item.commodityId)"
				>
					<view class="image-wrapper">
						<image :src="item.displayImg" mode="aspectFill"></image>
					</view>
					<view class="gl-bottom">
						<text class="title clampmore">{{item.name}}</text>
						<view class="price-box">
							<text class="price">{{item.price | turn}}</text><!-- /{{item.unit}} -->
							<text class="original-price">{{item.originalPrice | turn}}</text>
						</view>
						<view class="glb-host">热销{{item.turnover}}{{item.unit}}</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</view>
		<view v-if="!goodsList.length" style="width:100%;text-align: center;">
			<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
			<view style="font-size:12px;text-align:center;color:#999;">暂无商品~</view>
		</view>
		
		<view class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''" @click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b two">{{item.name}}</view>
						<view 
							v-for="tItem in item.child" :key="tItem.id" 
							class="cate-item b-b" 
							:class="{active: tItem.id==cateId}"
							@click="changeCate(tItem)">
							{{tItem.name}}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore	
		},
		data() {
			return {
				cateMaskState: 0, //分类面板展开状态
				// headerPosition:"fixed",
				// headerTop:"0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0, 
				cateId: 0, //已选三级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
				list:[],
				category:[],
				scrid:0,
				scrindex:0,
				lastsequence:0
			};
		},
		filters:{
			turn(v){
				return v.toFixed(2);
			}
		},
		onLoad(options){
			// this.cateId = 0; //options.tid
			// this.loadCateList(0, 0);//options.fid,options.sid
			if(options){
				this.scrindex = parseInt(options.index);
				this.scrid = options.id;
				this.getgoodlist(options.index,options.id);
			}else{
				this.loadData('refresh',0);
			}
			this.getscrollview();
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			this.loadData('refresh',0);
		},
		//加载更多
		onReachBottom(){
			this.loadData('add',this.lastsequence);
		},
		methods: {
			//加载分类
			async loadCateList(fid, sid){
				let list = await this.$api.json('cateList');
				let cateList = list.filter(item=>item.pid == fid);
				
				cateList.forEach(item=>{
					let tempList = list.filter(val=>val.pid == item.id);
					item.child = tempList;
				})
				this.cateList = cateList;
			},
			
			// 一级分类列表
			async getscrollview() {
				try {
					let categorylist = await this.$request.post("/lanhan/home/getCategoryV1List", { data: {} });
					this.category = categorylist.data.data;
				} catch (error) {
					console.error('error:', error);
				}
			},
			
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type,lastsequence) {
				//没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
					this.loadingType = 'loading';
				}else{
					this.loadingType = 'more'
				}
				let oldgoodsList = [];
				try {
					let res1 = await this.$http.post('/lanhan/home/recommendCommoditys', {
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
							"categoryPId": this.scrid,
							"keyWord": "",
							"pageSize": 10,
							"lastSequence": lastsequence,
							"province": "",
							"city": "",
							"county": "",
							"town": "",
							"marketId": "",
							"isHot": 0,
							"isDiscount": 0,
							"typeId":""
						}
					});
					
					if(res1.length > 0){
						oldgoodsList = res1;
						this.lastsequence = oldgoodsList[oldgoodsList.length-1].sequence;
					}
					
				} catch (error) {
					console.error('error:', error);
				}
				
				if(type === 'refresh'){
					this.goodsList = [];
				}
				
				//筛选，测试数据直接前端筛选了
				// if(this.filterIndex === 1){
				// 	goodsList.sort((a,b)=>b.sales - a.sales)
				// }
				// if(this.filterIndex === 2){
				// 	goodsList.sort((a,b)=>{
				// 		if(this.priceOrder == 1){
				// 			return a.price - b.price;
				// 		}
				// 		return b.price - a.price;
				// 	})
				// }
				
				this.goodsList = this.goodsList.concat(oldgoodsList);
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				this.loadingType  = oldgoodsList.length < 10 ? 'nomore' : 'more';
				
				if(type === 'refresh'){
					uni.stopPullDownRefresh();
				}else{
					uni.hideLoading();
				}
			},
			// 一级分类查询
			async getgoodlist(index, id) {
				this.scrindex = parseInt(index);
				this.scrid = parseInt(id);
				let category2 = await this.$http.post('/lanhan/home/recommendCommoditys', {
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
						"categoryPId": parseInt(id),
						// "categoryId": id,
						"keyWord": "",
						"pageSize": 10,
						"lastSequence": 0,
						"province": "",
						"city": "",
						"county": "",
						"town": "",
						"marketId": "",
						"isHot": 0,
						"isDiscount": 0,
						"typeId":""
					}
				});
				if(category2 != undefined){
					this.goodsList = category2;
					this.lastsequence = category2[category2.length-1].sequence;
				}
			},
			//筛选点击
			tabClick(index){
				if(this.filterIndex === index && index !== 2){
					return;
				}
				this.filterIndex = index;
				if(index === 2){
					this.priceOrder = this.priceOrder === 1 ? 2: 1;
				}else{
					this.priceOrder = 0;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
				uni.hideLoading();
			},
			//显示分类面板
			toggleCateMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(()=>{
					this.cateMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item){
				this.cateId = item.id;
				this.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
				uni.hideLoading();
			},
			//详情
			navToDetailPage(id){
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent(){}
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
	}
	/* 分类 */
	.content{
		.titleNview-background {
			height: 80upx;
			transition: .4s;
			background: #FFFFFF;
			padding: 0 3%;
			.scroll-view_H{
			    padding: 0px 0px;
				width: 90%;
			    float: left;
			}
			.categorytype{
			    float: right;
			    text-align: center;
			    padding: 1%;
			}
			.scroll-view-item_H{
				display: inline-block;
				padding: 0 20upx;
				
				.svih-title{
					font-size: 32upx;
					padding: 16upx 0;
				}
				.uni-bg-red{
				    border-bottom: 3px solid #fa436a;
				}
			}
		}
	}

	.navbar{
		// position: fixed;
		// left: 0;
		// top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0,0,0,.06);
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				// &:after{
				// 	content: '';
				// 	position: absolute;
				// 	left: 50%;
				// 	bottom: 0;
				// 	transform: translateX(-50%);
				// 	width: 120upx;
				// 	height: 0;
				// 	border-bottom: 4upx solid $base-color;
				// }
			}
		}
		.p-box{
			display: flex;
			flex-direction: column;
			.yticon{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;
				&.active{
					color: $base-color;
				}
			}
			.xia{
				transform: scaleY(-1);
			}
		}
		.cate-item{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;
			&:after{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	.cate-mask{
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 95;
		transition: .3s;
		
		.cate-content{
			width: 630upx;
			height: 100%;
			background: #fff;
			float:right;
			transform: translateX(100%);
			transition: .3s;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.cate-content{
				transform: translateX(0);
			}
		}
	}
	.cate-list{
		display: flex;
		flex-direction: column;
		height: 100%;
		.cate-item{
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
 			font-size: 28upx;
			color: #555;
			position: relative;
		}
		.two{
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}
		.active{
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list{
		width: 100%;
		// position: absolute;
		display:flex;
		flex-wrap:wrap;
		padding: 3%;
		background: #f5f5f5;
		.goods-item{
			display:flex;
			flex-direction: column;
			width: 48%;
			margin-bottom: 3%;
			background: #fff;
			border-radius: 10upx;
			&:nth-child(2n+1){
				margin-right: 3%;
			}
		}
		.image-wrapper{
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
				border-top-left-radius: 10upx;
				border-top-right-radius: 10upx;
			}
		}
		.gl-bottom{
			padding: 4%;
			.title{
				height: 80upx;
				font-size: $font-base;
				color: $font-color-dark;
				line-height: 40upx;
				margin-bottom: 5%;
			}
			.price-box{
				display: flex;
				align-items: center;
				padding-right: 10upx;
				font-size: 24upx;
				color: $font-color-light;
			}
			.price{
				font-size: $font-lg;
				color: $uni-color-primary;
				line-height: 1.5;
				font-weight: bolder;
				margin-right: 10upx;
				&:before{
					content: '￥';
					font-size: 26upx;
				}
			}
			.original-price{
				text-decoration: line-through;
				&:before{
					content: '￥';
					font-size: 26upx;
				}
			}
			.glb-host{
				font-size: $font-base;
				color: #909399;
			}
		}
	}
	

</style>
