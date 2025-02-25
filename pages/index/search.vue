<template>
	<view class="search">
		<view class="header">
			<view class="search_case">
				<image src="../../static/img/btn_search_normal.png" mode=""></image>
				<view class="uni-input-wrapper search_input">
					<input maxlength="140" step="" autocomplete="off" type=""
					 class="uni-input-input" placeholder="输入关键词"
					 :is-focus="true" :theme="themeClass" :show-want="true"
					 :hot-list="hotList" :search-list="searchList" @getSearchText="getSearchText">
					<view class="cancel" v-show="clear">
						<image src="../../static/img/clear.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="search_cancel">
				取消
			</view>
		</view>
		<view class="content">
			<view class="search_title">
				<ul>
					<li class="searchactive">课程</li>
					<li>视频</li>
					<li>音频</li>
					<li>商品</li>
				</ul>
			</view>
			<view class="search_cont">
				<!-- 课程 -->
				<view class="search_list">
					<view class="list_title">
						<text class="audt">课程</text>
					</view>
					<view class="audt_list">
						<ul>
							<li>
								<view class="brief_left">
									<image src="../../static/img/brief.png" mode=""></image>
								</view>
								<view class="brief_right">
									<view class="brief_title">道医的养生之道吃喝拉撒睡…</view>
									<view class="brief_name">张之仲</view>
									<view class="brief_time">
										<text>已更新1期/共3期</text>
										<view class="watch">
											<image src="../../static/img/watch.png" mode=""></image>
											<text>1.2w人</text>
										</view>
									</view>
								</view>
							</li>
						</ul>
					</view>
				</view>

				<!-- 音频 -->
				<view class="search_list">
					<view class="list_title">
						<text class="audt">音频</text>
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

				<!-- 视频 -->
				<view class="search_list">
					<view class="list_title">
						<text class="audt">视频</text>
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
											<image src="../../static/img/play.png" mode=""></image>
											<text>1.2k</text>
										</view>
									</view>
								</view>
							</li>
						</ul>
					</view>
				</view>
				
				<!-- 商品 -->
				<view class="search_list">
					<view class="list_title">
						<text class="audt">商品</text>
					</view>
					<view class="hot_list">
						<ul>
							<li>
								<image src="../../static/img/hot.png" mode=""></image>
								<view class="hot_synopsis">
									<text>清代青花瓷绝迹真品清代青花瓷绝迹真品</text>
									<view class="sell_wall">
										<view class="sell">
											热销2.1w件
										</view>
										<view class="wall">
											<image src="../../static/img/sell.png" mode=""></image>
											<text>+400</text>
										</view>
									</view>
									<view class="hot_price">
										￥789.00
										<text>￥999.00</text>
									</view>
								</view>
							</li>
							<li>
								<image src="../../static/img/hot.png" mode=""></image>
								<view class="hot_synopsis">
									<text>清代青花瓷绝迹真品清代青花瓷绝迹真品</text>
									<view class="sell_wall">
										<view class="sell">
											热销2.1w件
										</view>
										<view class="wall">
											<image src="../../static/img/sell.png" mode=""></image>
											<text>+400</text>
										</view>
									</view>
									<view class="hot_price">
										￥789.00
										<text>￥999.00</text>
									</view>
								</view>
							</li>
						</ul>
					</view>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import zySearch from '@/components/zy-search/zy-search.vue';
	export default {
			components: {
				zySearch
			},
			data() {
				return {
					themeClass: 'block',
					// speechEngine: 'baidu', //语音识别引擎
					hotList: []	,//初始化推荐列表
					searchList:[],
				}
			},
			onLoad(){
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
					this.loaddata();
				}
			},
			computed: {
				...mapState(['hasLogin', 'userInfo'])
			},
			methods: {
				async loaddata(){
					let that = this;
					let searchdata = await that.$http.post('/lanhan/user/hotSearchInfo', {
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
					});
					for(let i=0; i<5; i++){
						that.$data.hotList.push(searchdata[i].keyWord);
					}
					for(let y=0; y<searchdata.length; y++){
						that.$data.searchList.push(searchdata[y].keyWord);
					}
				},
				getSearchText(e) {
					// uni.showToast({
					// 	title:'回调的搜索信息: ' + e,
					// 	icon:"none"
					// })
					uni.navigateTo({
						url:"../product/productlist?categoryid=0&typeid="+''+"&name="+'为您推荐'+"&keyword="+e
					})
				}
			},
		}
	</script>

<style lang='scss'>
	page {
		background: rgba(240, 240, 240, 1);
	}

	li {
		list-style: none;
	}

	ul {
		padding: 0;
	}

	.header {
		height: 120upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 18upx 30upx 20upx 30upx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		top: 0;
		padding-top: var(--status-bar-height);
		width: 100%;
		background: #fff;
		z-index: 10;
		border-bottom: 1px solid #E8E8E8;

		.search_case {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			background: rgba(240, 240, 240, 1);
			border-radius: 8upx;
			height: 60upx;
			width: 85%;
			padding: 10upx 20upx;
			box-sizing: border-box;

			image {
				width: 40upx;
				height: 40upx;
			}

			input {
				margin-left: 10upx;
				font-size: 28upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				line-height: 40upx;
			}
		}

		.search_cancel {
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 40upx;
			margin-left: 30upx;
		}
	}

	.content {
		margin-top: 120upx;

		.search_title {
			height: 100upx;
			background: rgba(255, 255, 255, 1);
			position: fixed;
			left: 0;
			top: 120upx;
			width: 100%;
			line-height: 100upx;
			z-index: 20;

			ul {
				display: flex;
				justify-content: space-around;
				align-items: center;

				li {
					position: relative;
					height: 100%;


				}
			}
		}
	}

	.searchactive::after {
		position: absolute;
		content: "";
		width: 30upx;
		bottom: 6upx;
		text-align: center;
		border-bottom: 10upx solid #e84170;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		font-weight: 600;
		color: #333333;
	}

	.list_title::after {
		position: absolute;
		content: "";
		height: 30upx;
		border-right: 10upx solid rgba(232, 65, 112, 1);
	}

	.search_cont {

		margin-top: 220upx;
	}

	.search_list {

		.list_title {
			height: 100upx;
			display: flex;
			padding: 24upx 30upx 26upx 30upx;
			justify-content: space-between;
			align-items: center;

			.audt {
				padding-left: 20upx;
				box-sizing: border-box;
				font-size: 36upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: rgba(51, 51, 51, 1);
				line-height: 50upx;
			}
		}

		.audt_list {
			padding: 0 30upx 14upx;
			box-sizing: border-box;

			ul {
				li {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding: 30upx;
					box-sizing: border-box;
					background: #FFFFFF;
					margin-bottom: 20upx;

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
					}
					
					.sell_wall {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						margin: 6upx 0 10upx 0;
						.sell {
							width:110upx;
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
	
	.search_input {
		position: relative;
	}
	.cancel {
		position: absolute;
		right: 20upx;
		top: 0;
		width: 28upx;
		height: 28upx;
		
		image {
			width: 100%;
			height: 100%;
		}
	}

</style>
