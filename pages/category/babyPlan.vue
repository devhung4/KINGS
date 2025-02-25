<template>
	<view class="container">
		<scroll-view class="scroll-view_H" scroll-x="true"  scroll-left="120" style="white-space: nowrap;">
			<view @click="getgoodlist(item.id,index)" v-for="(item,index) in category" :key="index" :class="ids == index ? 'active' : ''" class="scroll-view-item_H uni-bg-red">{{item.name}}</view>
		</scroll-view> 

		<view class="guess-section">
			<view v-if="goodsList.length" v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.displayImg" mode="aspectFill"></image>
				</view>
				<view class="right-text">
					<view class="title twoclamp">{{item.title}}</view>
					<view class="price">{{item.description}}</view>
					<view class="gs-adress">讲解:{{item.author}}</view>
				</view>
			</view>
			<view v-if="!goodsList.length" style="display:flex;width:100%;justify-content: center;padding:100upx 0">
				<image src="../../static/nodata.png" style="width:360upx;height:250upx"></image>
			</view>
		</view>


	</view>
</template>

<script>
	export default {

		data() {
			return {
				goodsList: [],
				category: [],
				id:0,
				ids:0,
			};
		},
		filters:{
			turn(v){
				return v.toFixed(2)
			}
		},
		onLoad() {
			this.loadData();
		},
		mounted() {
		},
		methods: {
			// 分类跳转
			navto(e){
				if(e==4){
					uni.showToast({
						icon:"none",
						title:"暂未开放"
					})
				}
			},
			
			async getgoodlist(id,ids){
				this.ids = ids
				let category2 = await this.$http.post('/lanhan/home/questionAnswers', {
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
							"keyWord": "",
							"lastSequence": 0,
							"limit": 10,
							"type": id
						}
				},{isFactory:false});
				if(category2.data.base.code == '000000'){
					this.goodsList = category2.data.data
				}else{
					this.goodsList = []
				}
			},
			async loadData() {
				let category = await this.$http.post('/lanhan/home/questionAnswersTypes', {
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
					"param": {}
				});
				this.category = category
				// this.goodsList = category[0].categoryV2List || [];       &&getCategoryV1List&&
				let category2 = await this.$http.post('/lanhan/home/questionAnswers', {
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
						"keyWord": "",
						"lastSequence": 0,
						"limit": 10,
						"type": ""
					}
				},{isFactory:false});
				if(category2.data.base.code == '000000'){
					this.goodsList = category2.data.data
				}else{
					this.goodsList = []
				}

			},
			
			//详情页
			navToDetailPage(item) {
				uni.navigateTo({
					url: "/pages/category/babyPlanDetail"
				})
				uni.setStorageSync("babyplanitem",JSON.stringify(item));
			},
		},
	}
</script>

<style lang="scss">
	.scroll-view_H{
		background: #fff;
		color: #303313;
		padding: 20upx 30upx;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}
	.active{
		color: rgb(250, 67, 106);
	}
	.scroll-view-item_H{
		padding:10upx 20upx;
		display: inline-block;
		text-align: center;
		font-size: 14px;
	}

	page {
		background: #f5f5f5;
	}

	/* 猜你喜欢 */
	.guess-section {
		padding: 0 25upx;
		margin: 15% 0 0;

		.guess-item {
			display: flex;
		    background: #fff;
			margin: 3% 0;
			border-radius: 20upx;
		}

		.image-wrapper {
			width: 35%;
			height: 180rpx;
			overflow: hidden;
			border-top-left-radius: 20rpx;
			border-bottom-left-radius: 20rpx;
			margin-right: 3%;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		
		.right-text{
			width: 50%;
		}

		.title {
			font-size: $font-base;
			color: $font-color-dark;
			margin: 5% 0 0;
			font-weight: bold;
		}
		
		.twoclamp{overflow: hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;}

		.price{
			width: 90%;
			font-size: $font-base;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			margin: 5% 0;
		}
		
		.gs-adress{
			width: 90%;
			font-size: $font-base;
		}
	}
</style>
