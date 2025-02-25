<template>
	<view>
		<view class="prodDetialTop">
			{{prodInfo.name}}
		</view>
		<view class="prodDetailInfo">
			<view class="infobox">
				<view style="color:#909090">生产进度</view>
				<view>{{parseInt(prodInfo.remainCycle/prodInfo.cycle*100)||0}}%</view>
			</view>
			<view class="infobox">
				<view style="color:#909090">日生产金</view>
				<view>￥{{parseInt(prodInfo.realAmount*prodInfo.gain/prodInfo.cycle)||0}}</view>
			</view>
			<view class="infobox">
				<view style="color:#909090">商品总价</view>
				<view>￥{{parseInt(prodInfo.realAmount*prodInfo.gain)||0}}</view>
			</view>
		</view>
		<view class="prodDetailListBox">
			<view class="prodDetailList" v-for="(item,index) in freeRecords" :key="index">
				<view class="prodDetailListTop">
					<view>第{{item.num}}期</view>
					<view>{{item.status==0?'未返':'已返'}}：￥{{item.income}}</view>
				</view>
				<view class="prodDetailListBody">
					<view>生产时间：<text>{{item.createDateStr}}</text></view>
					<view>实返时间：<text>{{item.freeDateStr}}</text></view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {
	    mapState 
	} from 'vuex';
	export default {
		data(){
			return{
				loadingType: 'more', //加载更多状态
				orderId:'',
				lastsequence:0,
				freeRecords:[],
				prodInfo:''
			}
		},
		components: {
			uniLoadMore	
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		filters:{
			turn(v){
				return v.toFixed(2);
			}
		},
		onLoad(option) {
			this.orderId=option.id;
			// console.log('this.orderId'+this.orderId)
			this.getProductionDetial('refresh',0)
		},
		//下拉刷新
		onPullDownRefresh(){
			this.getProductionDetial('refresh',this.lastsequence);
		},
		//加载更多
		onReachBottom(){
			this.getProductionDetial('add',this.lastsequence);
		},
		methods:{
			navTo(url){
				if(!this.hasLogin){
					url = '/pages/public/login';
				}
				uni.navigateTo({
					url
				}) 
			}, 
			async getProductionDetial(type,lastsequence){
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
				let oldfreeRecords=[];
				try {
					let production = await this.$http.post('/lanhan/shop/investCommodityOrderInfo', {
						"base": {
							"appId": "001",
							"channels": "001",
							"ver": "1.1.5",
							"clientVer": "1.0",
							"apn": "wifi",
							"deviceId": "1233eedds2112",
							"uid":this.userInfo.userId,
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
							"orderId":this.orderId,
							"pageSize": 10,
							"lastSequence": lastsequence
						}
					});
					that.prodInfo=production;
					// this.freeRecords=production.freeRecords;
					if(production.freeRecords.length > 0){
						oldfreeRecords = production.freeRecords;
						that.$data.lastsequence = oldfreeRecords[oldfreeRecords.length-1].freedDate;
					}
					
				}catch (error){
					console.error('error:', error);
				}
				if(type === 'refresh'){
					that.$data.freeRecords = [];
				}
				
				that.$data.freeRecords = that.$data.freeRecords.concat(oldfreeRecords);
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				that.$data.loadingType  = oldfreeRecords.length < 10 ? 'nomore' : 'more';
				
				if(type === 'refresh'){
					uni.stopPullDownRefresh();
				}else{
					uni.hideLoading();
				}
				
			}
		}
	}
</script>

<style lang="scss">
	page{background-color:#EFF3FA;}
	%section{
		display:flex;
		justify-content: space-between;
		width:100%;
	}
	.prodDetialTop{
		width:100%;
		height:120px;
		line-height: 120px;
		color:#fff;
		background:#2898E5;
		padding-left:10%;
		margin-top:10px;
	}
	.prodDetailInfo{
		@extend %section;
		width:95%;
		margin:0 auto 10px;
		padding:2%;
		font-size:15px;
		text-align: center;
		background:#fff;
		.infobox{
			width:33.3333%;
		}
	}
	.prodDetailListBox{
		width:100%;
		.prodDetailList{
			width:100%;
			background:#fff;
			margin-top:10px;
			padding:3%;
			font-size:15px;
			.prodDetailListTop{
				@extend %section;
				border-bottom: 1px solid #EDF1F4;
				padding:2% 0;
			}
			.prodDetailListBody{
				padding:2% 0;
				color:#494849;
			}
		}
	}
</style>
