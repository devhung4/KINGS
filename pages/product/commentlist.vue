<template>
	<!-- 评价 -->
	<view class="content eva-section">
		<view class="imgview" v-if="showemply">
			<image src="../../static/nodata.png"></image>
			<view class="nodata">暂无评论列表</view>
		</view>
		<view class="eva-box" v-else v-for="(item,index) in commentList" :key="index">
			<image class="portrait" :src="item.userImage"></image>
			<view class="right">
				<text class="name">{{item.userName}}</text>
				<text class="con">{{item.comment}}</text>
				<view class="comment-img" v-for="(imgitem,imgindex) in item.images" :key="imgindex">
					<image :src="imgitem.image"></image>
				</view>
				<view class="bot">
					<!-- <text class="attr">购买类型：{{item.commentedContent}}</text> -->
					<text class="time">{{item.createdTime}}</text>
				</view>
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
				headerPosition:"fixed",
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				cateList: [],
				goodsList: [],
				
				showemply:true,
				commentList:[]
			};
		},
		
		onLoad(options){
			let commentlist = uni.getStorageSync("pcommentlist");
			this.commentList = commentlist;
			if(commentlist !=="" && commentlist.length > 0){
				this.showemply = false;
			}
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
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom(){
			this.loadData();
		},
		methods: {
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type='add', loading) {
				
				// //没有更多直接返回
				// if(type === 'add'){
				// 	if(this.loadingType === 'nomore'){
				// 		return;
				// 	}
				// 	this.loadingType = 'loading';
				// }else{
				// 	this.loadingType = 'more'
				// }
				
				// let goodsList = await this.$api.json('goodsList');
				// if(type === 'refresh'){
				// 	this.goodsList = [];
				// }
				
				// this.goodsList = this.goodsList.concat(goodsList);
				
				// //判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				// this.loadingType  = this.goodsList.length > 20 ? 'nomore' : 'more';
				// if(type === 'refresh'){
				// 	if(loading == 1){
				// 		uni.hideLoading()
				// 	}else{
				// 		uni.stopPullDownRefresh();
				// 	}
				// }
			},
		},
	}
</script>

<style lang="scss">
	/* 评价 */
	.imgview{
		text-align: center;
		font-size: 12px;
		color: #999;
		image{
			width: 55%;
			height: 150px;
			margin-top: 30%;
		}
	}
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
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
</style>
