<template>
	<view class="collection">
		<view class="content">
			<view class="type_list">
				<block v-for="(item,index) in colnamelist" :key="index">
					<view class="shop" :class="index==coltypeindex?'active':''" @tap="checktypeclick(index)">
						{{item.name}}
					</view>
				</block>
			</view>
		</view>
		<view class="info">
			<view class="list" v-if="ctype==1">
				<ul>
					<li v-for="(item,index) in productlist" :key="index">
						<image :src="item.displayImg" mode=""></image>
						<view class="hot_synopsis">
							<text class="itemName">{{item.name}}</text>
							<view class="sell_wall">
								<view class="sell">
									热销2.1w{{item.unit}}
								</view>
								<view class="wall">
									<image src="../../static/img/sell.png" mode=""></image>
									<text>+400</text>
								</view>
							</view>
							<view class="hot_price">
								￥{{item.price}}
								<text>￥999.00</text>
							</view>
						</view>
						<view class="check">
							<image :src="commoditysel==0?'../../static/icon_select.png':'../../static/icon_selected.png'" mode=""></image>
						</view>
					</li>
				</ul>
				<uni-load-more :status="loadingType"></uni-load-more>
				<view v-if="!productlist.length" style="display:flex;width:100%;justify-content: center;padding:100upx 0">
					<image src="../../static/nodata.png" style="width:360upx;height:250upx"></image>
				</view>
			</view>
			<view class="video_list" v-if="ctype==2">
				<view class="videolist" v-for="(item,index) in productlist2" :key="index">
					<view class="video_subject">
						<image src="../../static/img/vedio.png" mode=""></image>
						<view class="video_volume">
							<image src="../../static/img/vedio_vumlo.png" mode=""></image>
							<text>1.2k</text>
						</view>
						<view class="video_time">
							30:00
						</view>
						<view class="video_play">
							<image src="../../static/img/vedio_play.png" mode=""></image>
						</view>
					</view>
					<text>春三月排毒改善春三月排毒改善春三月排毒改</text>
					<view class="operation ">
						<view class="pubdate" v-show="videocheck">
							<image :src="videosel==0?'../../static/icon_select.png':'../../static/icon_selected.png'" mode=""></image>
						</view>
						<view class="oper">
							5分钟前
						</view>
					</view>
				</view>
				<uni-load-more :status="loadingType"></uni-load-more>
				<view v-if="!productlist2.length" style="display:flex;width:100%;justify-content: center;padding:100upx 0">
					<image src="../../static/nodata.png" style="width:360upx;height:250upx"></image>
				</view>
			</view>
			<view class="search_list" v-if="ctype==3">
				<view class="audiolist" v-for="(item,index) in productlist3" :key="index">
					<view class="audiocheck" v-show="audiocheck">
						<image :src="audiosel==0?'../../static/icon_select.png':'../../static/icon_selected.png'" mode=""></image>
					</view>
					<view class="audt_list">
						<ul>
							<li>
								<view class="brief_left">
									<image src="../../static/img/brief.png" mode=""></image>
								</view>
								<view class="brief_right">
									<view class="brief_title">道医的养生之道吃喝拉撒睡…</view>
									<view class="brief_name">
										<view class="label">
											惊悚
										</view>
										<view class="label">
											悬疑
										</view>
									</view>
									<view class="brief_time">
										<view class="video_watch">
											<image src="../../static/img/headset.png" mode=""></image>
											<text>1.2k</text>
										</view>
									</view>
								</view>
							</li>
						</ul>
					</view>
				</view>
				<uni-load-more :status="loadingType"></uni-load-more>
				<view v-if="!productlist3.length" style="display:flex;width:100%;justify-content: center;padding:100upx 0">
					<image src="../../static/nodata.png" style="width:360upx;height:250upx"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		data() {
			return {
				uid:"",
				colnamelist:[
					{type:1, name:"商品"},
					{type:2, name:"视频"},
					// {type:3, name:"音频"},
				],
				coltypeindex:0,
				videocheck: false,
				audiocheck: true,
				ctype:1,
				productlist:[],
				productlist2:[],
				productlist3:[],
				lastsequence:0,
				loadingType: 'more', //加载更多状态
				commoditysel:0,
				videosel:0,
				audiosel:0
			}
		},
		onLoad() {
			let userInfo = uni.getStorageSync("userInfo");
			this.uid = userInfo.userId;
			this.getmyConcern('refresh',10,0,1);
		},
		//下拉刷新
		// onPullDownRefresh(){
		// 	let that = this;
		// 	that.getmyConcern(10,0,1);
		// },
		//加载更多
		onReachBottom(){
			this.getmyConcern('add',10,this.lastsequence,this.ctype);
		},
		// 点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			console.log(index)
		},
		methods: {
			// 类型选择
			checktypeclick(index){
				this.$data.coltypeindex = index;
				this.$data.ctype = index+1;
				this.getmyConcern('refresh',10,0,index+1);
			},
			//1商品，2视频 3-音频
			async getmyConcern(type,pageSize,lastsequence,ctype) {
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
				try {
					let myConcernList = await that.$request.post('/lanhan/user/myConcern', {
						"data": {
							"base": {
								"appId": "001",
								"channels": "001",
								"ver": "1.1.5",
								"clientVer": "1.0",
								"apn": "wifi",
								"deviceId": "1233eedds2112",
								"uid": that.$data.uid,
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
								"pageSize": pageSize,
								"lastSequence": lastsequence,
								"type": ctype
							}
						}
					});
					console.log(myConcernList);
					if(myConcernList.data.base.code == "000000"){
						if(myConcernList.data.data.length>0){
							oldgoodsList = myConcernList.data.data;
							that.$data.lastsequence = oldgoodsList[oldgoodsList.length-1].sequence;
						}
					}else{
						that.$api.msg(myConcernList.data.base.msg);
					}
				} catch (error) {
					console.error('error:', error);
				}
				if(type === 'refresh'){
					that.$data.goodsList = [];
				}
				
				if(that.$data.ctype==1){
					that.$data.productlist = that.$data.goodsList.concat(oldgoodsList);
				}
				if(that.$data.ctype==2){
					that.$data.productlist2 = that.$data.goodsList.concat(oldgoodsList);
				}
				if(that.$data.ctype==3){
					that.$data.productlist3 = that.$data.goodsList.concat(oldgoodsList);
				}
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				that.$data.loadingType  = oldgoodsList.length < 10 ? 'nomore' : 'more';
				
				if(type === 'refresh'){
					uni.stopPullDownRefresh();
				}else{
					uni.hideLoading();
				}
			},
		}
	}
</script>

<style lang='scss' scoped>
	page {
		background: rgba(240, 240, 240, 1);
	}
	ul {
		padding-left: 0;
	}
	li {
		list-style: none;
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
		font-weight:600;
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
		border-bottom: 10upx solid #fd852f;
		left: 50%;
		transform: translate(-50%, -50%);
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
	}
	.list {
		padding: 0 19upx 76upx 19upx;
		box-sizing: border-box;
		background:rgba(240, 240, 240, 1);
		ul {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			li {
				position: relative;
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
						display: -webkit-box;
						overflow: hidden;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
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
							color:rgba(232,65,112,1);
							line-height:28upx;
							text-align: center;
						}
						.wall {
							margin-left:10upx;
							width:78upx;
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
						color:rgba(232,65,112,1);
						line-height:44upx;
						font-weight:600;
						text {
							font-size:20upx;
							font-family:PingFangSC-Regular,PingFang SC;
							color:rgba(153,153,153,1);
							line-height:28upx;
							text-decoration: line-through;
							font-weight:600;
						}
					}
				}
				
			}
		}
	}
	.info {
		margin-top: 100upx;
	}
	.check {
		position: absolute;
		top: 20upx;
		right: 20upx;
		width: 32upx;
		height: 32upx;
		image {
			width: 100%;
			height: 32upx !important;
		}
	}
	.video_list {
		margin-top: 20upx;
		background:rgba(255,255,255,1);
		padding: 44upx 30upx 42upx 30upx;
		box-sizing: border-box;
		.videolist {
			border-bottom: 1px solid #E8E8E8;
			margin-top: 38upx;
			&:last-child {
				border-bottom: none;
			}
			.video_subject {
				height:320upx;
				position: relative;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.video_volume {
				width:68upx;
				height:28upx;
				background:rgba(255,255,255,1);
				border-radius:4upx;
				position: absolute;
				left: 20upx;
				bottom: 20upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 4upx 8upx;
				image {
					width:20upx;
					height:20upx;
				}
				text {
					font-size:20upx;
					font-family:DINCondensed-Bold,DINCondensed;
					font-weight:bold;
					color:rgba(232,65,112,1);
					line-height:24upx;
					margin-left: 8upx;
					margin-top: 0;
				}
			}
			.video_time {
				width:56upx;
				height:28upx;
				background:rgba(255,255,255,1);
				border-radius:4upx;
				font-size:20upx;
				font-family:DINCondensed-Bold,DINCondensed;
				font-weight:bold;
				color:rgba(232,65,112,1);
				line-height:28upx;
				position: absolute;
				right: 20upx;
				bottom: 20upx;
			}
			.video_play {
				width:84upx;
				height:84upx;
				background:rgba(51,51,51,1);
				opacity:0.3024;
				border-radius: 100%;
				text-align: center;
				line-height: 84upx;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%); 
				image {
					width:37upx;
					height:37upx;
				}
			}
			text {
				font-size:32upx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
				line-height:44upx;
				margin-top: 20upx;
			}
			.operation {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 30upx 0 40upx 0;
				.pubdate {
					font-size:28upx;
					font-family:PingFangSC-Regular,PingFang SC;
					color:rgba(153,153,153,1);
					image {
						width:32upx;
						height:32upx;
					}
				}
				.oper {
					font-size:28upx;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(153,153,153,1);
					
				}
				
			}
		}
		
	}
	.search_list {
		background: #FFFFFF;
		margin-top: 20upx;
		padding: 0 30upx;
		.audt_list {
	
			ul {
				li {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding: 30upx 0;
					box-sizing: border-box;
					background: #FFFFFF;
					
					.brief_left {
						width: 168upx;
						height: 168upx;
	
						image {
							width: 100%;
							height: 100%;
						}
					}
	
					.brief_right {
						margin-left: 30upx;
	
						.brief_title {
							font-size: 32upx;
							font-family: PingFangSC-Semibold, PingFang SC;
							color: rgba(51, 51, 51, 1);
							line-height: 44upx;
						}
	
						.brief_name {
							font-size: 28upx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: rgba(51, 51, 51, 1);
							line-height: 40upx;
							margin: 20upx 0 30upx 0;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.label {
								width:48upx;
								height:28upx;
								background:#f5b4c7;
								border-radius:4upx;
								font-size:20upx;
								font-family:PingFangSC-Regular,PingFang SC;
								font-weight:400;
								color:rgba(232,65,112,1);
								line-height:28upx;
								margin-right: 24upx;
								text-align: center;
							}
						}
	
						.brief_time {
							font-size: 24upx;
							font-family: PingFangSC-Regular, PingFang SC;
							color: rgba(153, 153, 153, 1);
							line-height: 34upx;
							display: flex;
							justify-content: space-between;
							.video_watch {
								
								image {
									width:20upx;
									height:20upx;
									margin-right: 6upx;
								}
							}
							.watch {
	
								image {
									width: 26upx;
									height: 18upx;
									margin-right: 10upx;
								}
							}
						}
					}
				}
			}
		}
	}
	.audiocheck {
		width: 7%;
		image {
			width:32upx;
			height:32upx;
		}
	}
	.audiolist {
		border-bottom: 1px solid #e8e8e8;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
</style>
