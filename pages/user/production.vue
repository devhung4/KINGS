<template>
	<view>
		<view class="productionTop">
			<image class="productionBg"  src="/static/user-bg.jpg"></image>
		</view>
		<view class="productionBody">
			<view class="paoductTab">
				<view class="tabList" @click="cutTab(0)" :class="classType==0 ?'on':''">
					<text>生产中</text>
				</view>
				<view class="tabList" @click="cutTab(1)" :class="classType==1 ?'on':''">
					<text>已完成</text>
				</view>
			</view>
			<view class="productionBox">
				<view class="listHeader">
					<view>我的商品</view>
					<view>数量</view>
					<view>商品总价</view>
				</view>
				<view class="listBody" v-if="prodInfo">
					<view class="list" @click="navTo('/pages/user/productionDetial?id='+item.id)" v-for="(item,index) in prodInfo" :key="index">
						<view class="listMain">
							<view>{{item.title}}</view>
							<view>X{{item.number}}{{item.unit}}</view>
							<view>{{item.realAmount||0}}</view>
						</view>
						<view class="listFoot">
							<text>生产进度</text>
							<text>{{parseInt(item.remainCycle/item.cycle*100)}}%</text>
						</view>
						<view class="progress-box">
						    <progress :percent="item.remainCycle/item.cycle*100" border-radius="10px" active stroke-width="10" activeColor="#3A64FF" backgroundColor="#C7DAFA"/>
						</view>
					</view>
					<uni-load-more :status="loadingType"></uni-load-more>
				</view>
			</view>
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
				classType:0,
				lastsequence:0,
				prodInfo:[]
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
		onLoad() {
			this.getProduction('refresh',this.classType,0)
		},
		//下拉刷新
		onPullDownRefresh(){
			this.getProduction('refresh',this.classType,this.lastsequence);
		},
		//加载更多
		onReachBottom(){
			this.getProduction('add',this.classType,this.lastsequence);
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
			cutTab(type){
				this.classType=type;
				this.getProduction('refresh',type,0)
			},
			async getProduction(category,type,lastsequence){
				let that = this;
				//没有更多直接返回
				if(category === 'add'){
					if(that.$data.loadingType === 'nomore'){
						return;
					}
					that.$data.loadingType = 'loading';
				}else{
					that.$data.loadingType = 'more'
				}
				let oldprodInfo=[];
				try {
					let production = await this.$http.post('/lanhan/shop/investCommodityOrderList', {
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
							"state": Number(type),
							"pageSize": 10,
							"lastSequence":lastsequence
						}
					});
					if(production.length>0){
						oldprodInfo = production;
						that.$data.lastsequence = oldprodInfo[oldprodInfo.length-1].createTime;
					}
					
				} catch (error) {
					console.error('error:', error);
				}
				if(category === 'refresh'){
					that.$data.prodInfo = [];
				}
				
				that.$data.prodInfo = that.$data.prodInfo.concat(oldprodInfo);
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				that.$data.loadingType  = oldprodInfo.length < 10 ? 'nomore' : 'more';
				
				if(category === 'refresh'){
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
	.productionTop{
		width:95%;
		margin:10px auto 0;
		.productionBg{
			width:100%;
			height:140px;
			border-radius: 10px;
		}
	}
	.productionBody{
		width:100%;
		.paoductTab{
			@extend %section;
			width:100%;
			background:#fff;
			.tabList{
				width:50%;
				height:40px;
				line-height: 40px;
				text-align: center;
				font-size:15px;
			}
			.on{
				border-bottom: 3px solid #e4393c;
			}
		}
		.productionBox{
			width:95%;
			margin:0 auto;
			.listHeader{
				@extend %section;
				margin-top:10px;
				background:#fff;
				border-radius: 5px;
				font-size:15px;
				& view{
					padding:2%;
				}
			}
			.listBody{
				width:100%;
				.list{
					width:100%;
					margin-top:10px;
					background:#fff;
					border-radius: 5px;
					font-size:14px;
					padding:2%;
					.listMain{
						@extend %section;
						margin:2% 0;
					}
					.listFoot{
						@extend %section;
						font-size:12px;
						margin-top:5px;
						color:#878787;
					}
				}
			}
		}
	}
</style>
