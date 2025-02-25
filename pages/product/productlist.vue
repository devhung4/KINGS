<template>
	<view class="content">
		<view class="type_list">
			<block v-for="(item,index) in colnamelist" :key="index">
				<view class="shop" :class="index==coltypeindex?'active':''" @tap="checktypeclick(index)">
					{{item.name}}
				</view>
			</block>
		</view>
		<!-- 商品列表 -->
		<view v-show="type[0]">
			<view class="cont-item" v-if="goodsList.length">
				<view class="goods-list">
					<view
						v-for="(item, index) in goodsList" :key="index"
						class="goods-item"
						@click="navToDetailPage(item.commodityId)">
						<view class="image-wrapper">
							<image :src="item.displayImg" mode="aspectFill"></image>
						</view>
						<view class="gl-bottom">
							<text class="title clampmore">{{item.name}}</text>
							<view class="price-box">
								<text class="price">{{item.price | turn}}</text>
								<text class="original-price">{{item.originalPrice | turn}}</text>
							</view>
							<view class="glb-host">热销{{item.turnover}}{{item.unit}}</view>
						</view>
					</view>
				</view>
				<uni-load-more :status="loadingType"></uni-load-more>
			</view>
			<view v-else style="width:100%;text-align: center;margin-top: 100upx;">
				<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
				<view style="font-size:12px;text-align:center;color:#999;">暂无相关商品~</view>
			</view>
		</view>
		<!-- 课程列表 -->
		<view v-show="type[1]" class="other">
			<view class="course" v-if="courseList.length>0">
				<view class="course_item" v-for="(item,index) in courseList" :key="index">
					<view class="c_img">
						<image :src="item.image" mode="" ></image>
					</view>
					<view class="c_content">
						<view class="title">{{item.title}}</view>
						<view class="teacher">{{item.teacher}}</view>
						<view class="details">
							<view>
								<text>{{item.remark}}</text>
							</view>
							<view >
								<image src="../../static/img/icon_watch@3x.png" mode=""></image>
								<text>{{item.view}}人</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else style="width:100%;text-align: center;margin-top: 100upx;">
				<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
				<view style="font-size:12px;text-align:center;color:#999;">暂无相关课程~</view>
			</view>
		</view>
		<!-- 视频列表 -->
		<view v-show="type[2]" class="other">
			<view class="course" v-if="videoList.length>0">
				<view class="course_item" v-for="(item,index) in videoList" :key="index">
					<view class="c_img">
						<image :src="item.image" mode="" ></image>
					</view>
					<view class="c_content">
						<view class="title">{{item.title}}</view>
						<view class="teacher">惊悚</view>
						<view class="details">
							<view >
								<image src="../../static/img/icon_play@3x.png" style="width: 20upx;height: 20upx;margin-right: 4upx;" mode=""></image>
								<text>{{item.view}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else style="width:100%;text-align: center;margin-top: 100upx;">
				<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
				<view style="font-size:12px;text-align:center;color:#999;">暂无相关视频~</view>
			</view>
		</view>
		<!-- 音频列表 -->
		<view v-show="type[3]" class="other">
			<view class="course" v-if="audioList.length>0">
				<view class="course_item" v-for="(item,index) in audioList" :key="index">
					<view class="c_img">
						<image :src="item.image" mode="" ></image>
					</view>
					<view class="c_content">
						<view class="title">{{item.title}}</view>
						<view class="teacher">惊悚</view>
						<view class="details">
							<view >
								<image src="../../static/img/icon_listen@3x.png" style="width: 20upx;height: 20upx;margin-right: 4upx;" mode=""></image>
								<text>{{item.view}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else style="width:100%;text-align: center;margin-top: 100upx;">
				<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
				<view style="font-size:12px;text-align:center;color:#999;">暂无相关音频~</view>
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
				loadingType: 'more', //加载更多状态
				goodsList: [],
				courseList:[],
				videoList:[],
				audioList:[],
				list:[],
				name:"",keyword:"",
				categoryid:0,
				typeid:"",
				lastsequence:0,
				coltypeindex:0,
				type:[true,false,false,false],
				colnamelist:[
					{type:0, name:"商品"},
					{type:1, name:"课程"},
					{type:2, name:"视频"},
					{type:3, name:"音频"},
				],
			};
		},
		filters:{
			turn(v){
				return v.toFixed(2)
			}
		},
		onLoad(options){
			
			let that = this;
			if(options.name){
				that.$data.name = options.name;
			}else{
				that.$data.name = '';
			}
			if(options.keyword != ""){
				that.$data.keyword = options.keyword;
			}else{
				that.$data.keyword = "";
			}
			if(options.categoryid){
				that.$data.categoryid = parseInt(options.categoryid);
			}else{
				that.$data.categoryid = 0;
			}
			if(options.typeid != ""){
				that.$data.typeid = parseInt(options.typeid);
			}else{
				that.$data.typeid = '';
			}
			uni.setNavigationBarTitle({
			    title: that.name
			});
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
					if(that.$data.loadingType === 'nomore'){
						return;
					}
					that.$data.loadingType = 'loading';
				}else{
					that.$data.loadingType = 'more'
				}
				
				let oldgoodsList = [];
				console.log(that.$data.keyword)
				try {
					let res1 = await that.$request.post('lanhan/home/recommendCommoditys', {data: {
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
						// "categoryPId": that.$data.categoryid,
						"categoryId":0,
						"keyWord": that.$data.keyword,
						"pageSize": 10,
						"lastSequence": lastsequence,
						"type":0
						// "province": "",
						// "city": "",
						// "county": "",
						// "town": "",
						// "marketId": "",
						// "isHot": 0,
						// "isDiscount": 0,
						// "typeId":that.$data.typeid
					}
				}});
				
					if(res1.data.base.code == "000000"&&res1.data.data.length>0){
						oldgoodsList = res1.data.data;
						that.$data.lastsequence = oldgoodsList[oldgoodsList.length-1].sequence;
						
					}
					
				} catch (error) {
					console.error('error:', error);
				}
				
				if(type === 'refresh'){
					that.$data.goodsList = [];
				}
				
				that.$data.goodsList = that.$data.goodsList.concat(oldgoodsList);
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				that.$data.loadingType  = oldgoodsList.length < 10 ? 'nomore' : 'more';
				
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
			// 类型选择
			checktypeclick(index){
				
				if(this.$data.coltypeindex == index){
					return
				}
				this.$data.type = [false,false,false,false]
				this.$data.type[index] = true;
				this.$data.coltypeindex = index;
				if(index == 0) {
					this.loadData('refresh',0);
				}else {
					this.$request.post('lanhan/home/recommendCommoditys', {data: {
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
							// "categoryPId": that.$data.categoryid,
							"categoryId":0,
							"keyWord": this.$data.keyword,
							"pageSize": 10,
							"lastSequence": 0,
							"type":index
						}
					}}).then(res=>{
						if(index == 1) {
							this.courseList = res.data.data;
						}else if (index == 2){
							console.log(res)
							this.videoList = res.data.data;
						}else {
							this.audioList = res.data.data;
						}
						
					})
				}
			},
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
	}
	.type_list {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height:100upx;
		background:rgba(255,255,255,1);
		border-top: 1px solid #e8e8e8;
		position: fixed;
		width: 100%;
		top: 5%;
		z-index: 10;
		font-size: 32upx;
	}
	.shop {
		position: relative;
		font-weight:500;
	}
	.active {
		color:rgba(51,51,51,1);
	}
	.active::after {
		position: absolute;
		content: "";
		width: 30upx;
		bottom: -20upx;
		text-align: center;
		border-bottom: 10upx solid rgba(232, 65, 112, 1);
		left: 50%;
		transform: translate(-50%, -50%);
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
	}
	.cont-item{
		height: 100px;
		margin-top: 100upx;
	}
	.other{
		margin-top: 100upx;
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
	.course{
		width: 100;
		padding: 20upx 30upx 0 30upx;
		.course_item{
			width: 690upx;
			height: 228upx;
			background: #fff;
			padding: 30upx;
			display: flex;
			margin-bottom: 20upx;
			.c_img{
				width: 168upx;
				height: 168upx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.c_content{
				width: 432upx;
				height: 168upx;
				margin-left: 30upx;
				.title{
					font-size: 32upx;
					color: rgba(51, 51, 51, 1);
					display: -webkit-box;
					overflow: hidden;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					font-weight: bold;
				}
				.teacher{
					font-size: 28upx;
					margin-top: 20upx;
				}
				.details{
					margin-top: 30upx;
					font-size: 24upx;
					color: rgba(153, 153, 153, 1);
					display: flex;
					justify-content: space-between;
					image{
						width: 30upx;
						height: 22upx;
					}
				}
			}
		}
	}
	
</style>
