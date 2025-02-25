<template>
	<view class="content">
		<!-- 列表 -->
		<view class="goods-list"  v-if="goodsList.length">
			<view 
				v-for="(item, index) in goodsList" :key="index"
				class="goods-item"
				@click="navToDetailPage(item.commodityId)"
			>
				<view class="image-wrapper">
					<image :src="item.displayImg" mode="aspectFill"></image>
					<view class="tipstime"><image :src="actlab==0?'../../static/img/time.png':'../../static/img/label.png'"></image>限时{{actlab==0?'秒杀':'特卖'}}</view>
				</view>
				<view class="gl-bottom">
					<text class="title clampmore">{{item.name}}</text>
					<view class="price-box">
						<text class="price">{{item.price | turn}}/{{item.unit}}</text>
						<text class="original-price">{{item.originalPrice | turn}}</text>
					</view>
				</view>
				<view class="glb-bottom">
					<view class="glbb-left">
						<view class="progross">
							<text v-if="item.inventory==0" class="pct" style="width:0%;"></text>
							<text v-else class="pct" :style="`width:`+ ((item.remiand/item.inventory).toFixed(2) * 100) +`%;`"></text>
						</view>
						<text v-if="item.inventory==0">已售0%</text>
						<text v-else>已售{{(item.remiand/item.inventory).toFixed(2) * 100}}%</text>
					</view>
					<view class="glbb-right">去抢购</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</view>
		<view v-if="!goodsList.length" style="width:100%;text-align: center;">
			<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
			<view style="font-size:12px;text-align:center;color:#999;">暂无商品~</view>
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
				loadingType: 'more', //加载更多状态
				filterIndex: 0, 
				goodsList: [],
				list:[],
				actlab:1,
				categoryid:0,
				keyword:"",
				typeid:"",
				lastsequence:0,
			};
		},
		filters:{
			turn(v){
				return v.toFixed(2)
			}
		},
		onLoad(options){
			let that = this;
			if(options.categoryid){
				that.$data.categoryid = parseInt(options.categoryid);
			}else{
				that.$data.categoryid = 0;
			}
			// if(options.keyword != ""){
			// 	that.$data.keyword = options.keyword;
			// }else{
			// 	that.$data.keyword = "";
			// }
			if(options.typeid != ""){
				that.$data.typeid = parseInt(options.typeid);
			}else{
				that.$data.typeid = '';
			}
			that.loadData('refresh',0);
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
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type,lastsequence) {
				let that = this;
				//没有更多直接返回
				if(type === 'add'){
					if(that.loadingType === 'nomore'){
						return;
					}
					that.loadingType = 'loading';
				}else{
					that.loadingType = 'more'
				}
				
				let oldgoodsList = [];
				try {
					let res1 = await that.$request.post('lanhan/home/recommendCommoditys', {
						data: {
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
								"categoryPId": that.$data.categoryid,
								"categoryId":0,
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
								"typeId":that.$data.typeid
							}
						}
					});
					if(res1.data.base.code == "000000"){
						oldgoodsList = res1.data.data;
						that.lastsequence = oldgoodsList[oldgoodsList.length-1].sequence;
					}
					
				} catch (error) {
					console.error('error:', error);
				}
				
				if(type === 'refresh'){
					this.goodsList = [];
				}
				
				this.goodsList = this.goodsList.concat(oldgoodsList);
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				this.loadingType  = oldgoodsList.length < 10 ? 'nomore' : 'more';
				if(type === 'refresh'){
					uni.stopPullDownRefresh();
				}else{
					uni.hideLoading();
				}
			},
			//详情
			navToDetailPage(id){
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	page, .content{
		background: $page-color-base;
	}
	/* 分类 */
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

	/* 商品列表 */
	.goods-list{
		padding: 4%;
		background: #f5f5f5;
		.goods-item{
			margin-bottom: 4%;
			background: #fff;
			border-radius: 10upx;
		}
		.image-wrapper{
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			position: relative;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
				border-top-left-radius: 10upx;
				border-top-right-radius: 10upx;
			}
			.tipstime{
				background: #E61138;
			    color: #fff;
			    font-size: 24upx;
			    padding: 0 20upx 6upx;
			    position: absolute;
			    top: 0;
			    left: 5%;
			    z-index: 1;
			    border-bottom-left-radius: 18upx;
			    border-bottom-right-radius: 18upx;
				image{
					height: 25upx;
					width: 25upx;
					margin-right: 6upx;
					vertical-align: middle;
					margin-top: -4upx;
				}
			}
		}
		.gl-bottom{
			padding: 4% 4% 0%;
			.title{
				font-size: $font-base;
				color: $font-color-dark;
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
			
		}
		.glb-bottom{
		    padding: 0 4% 4%;
		    font-size: 24upx;
		    color: #999;
		    display: flex;
		    justify-content: space-between;
		    align-items: flex-end;
			.progross{
			    display: inline-block;
			    height: 20upx;
			    width: 200upx;
			    background: #eee;
			    border-radius: 30upx;
			    margin-right: 12upx;
				.pct{
					display: block;
				    background: #FFCCC8;
				    height: 20upx;
				    border-radius: 40upx;
				}
			}
			.glbb-right{
			    color: #fff;
			    background: #fa436a;
			    font-size: 24upx;
			    border-radius: 40upx;
			    padding: 8upx 20upx;
			}
		}
	}
	

</style>
