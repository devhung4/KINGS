<template>
	<view class="container">
		<view class="pdCutbox">
			<view class="sysmbolBox">
				<scroll-view class="scroll-view_H" 
					scroll-x="true" @scroll="scroll">
					<view class="sysmbol"
						:class="{ sysmbolon: coin == '' }" 
						@click="cut('')">{{$t('product.index1')}}</view>
					<view class="sysmbol" 
						v-for="(item, index) in coinList" 
						:key="index" 
						:class="{ sysmbolon: coin == item.name }"
						@click="cut(item.name)">{{ item.name }}</view>
					<!-- <view class="sysmbol">LTC</view>
					<view class="sysmbol">BTC</view>
					<view class="sysmbol">DCR</view>
					<view class="sysmbol">ZEC</view>
					<view class="sysmbol">USDT</view> -->
				</scroll-view>
			</view>
			<view class="filtrateBox" @click="filtBtn">{{$t('product.index2')}}<image class="filtrateIco" src="../../static/rhinoImg/shaixuan.png"></image>
			</view>
		</view>
		<view class="productBox" v-if="millList.length>0">
			<view class="productList" v-for="(item, index) in millList" :key="index" @click="goDetial(item.id,item.sellPortion,item.totalPortion,item.sellendtime,item.buyStatus)">
				<view class="productInfo">
					<view class="productName">{{ item.name }}</view>
					<!-- <view class="productTime" 
						v-if="!item.sellendtime&&(item.sellPortion < item.totalPortion)"> -->
					<view class="productTime"
						v-if="item.buyStatus==0">		
						<view class="triangle"></view>
						{{$t('product.index3')}}：{{ item.effectiveTime.substring(0, 11) }}
					</view>
					<view v-else class="poroverbox">
						<image :src="lang == 'zh'? iconOver_zh : iconOver_en" @click="sel(item.id,item.sellPortion,item.totalPortion)"></image>
					</view>
				</view>
				<view class="productInfo">
					<!-- <view class="productPrice">${{ item.itemApplyList[0].amount}}{{ item.itemApplyList[0].coin}}</view> -->
					<!-- <view class="productPrice">$</view> -->
					
					<view class="productInfo_list" v-if="item.itemApplyList.length>1">
						<view class="">
							{{$t('product.index4')}}：
						</view>
						<text class="productPrice" v-for="(itemlist,index2) in resever(item.itemApplyList)" :key = "index2" :style="stylecss[index2]">
							 <text v-if="item.itemApplyList.length != index2 +1">$</text>{{  itemlist.amount}}{{ itemlist.coin}}  <text v-if="item.itemApplyList.length != index2 +1">+</text>
						</text>
					</view>
					<view class="productInfo_list" v-else>
						<view class="">
							{{$t('product.index4')}}：
						</view>
						<text class="productPrice" v-for="(itemlist,index2) in item.itemApplyList" :key = "index2" :style="stylecss[index2]">
							${{ itemlist.amount}}{{ itemlist.coin}}
						</text>
					</view>
					
					<!-- <view class="productPrice">${{ item.itemApplyList[1].amount}}{{ item.itemApplyList[1].coin}}+</view> -->
					<view class="productDeadline">
						{{$t('product.index5')}}
						<text class="deadline">{{ item.term }}{{$t('productDetial.index15')}}</text>
					</view>
				</view>
				<view class="productInfo">
					<view>{{$t('product.index6')}}：{{item.managementFee}}</view>
					<view class="productFigure">
						{{$t('product.index7')}}
						<text class="figure">{{ item.powerUnit }}</text>
					</view>
				</view>
				<view class="productInfo">
					<view class="progress-box">
						<progress
							:percent="(item.sellPortion / item.totalPortion) * 100"
							border-radius="20px"
							active
							stroke-width="5"
							activeColor="#00a7eb"
							backgroundColor="#EAEAEA"
						/>
					</view>
					<view class="progess-num">{{$t('product.index8')}}{{ ((item.sellPortion / item.totalPortion) * 100).toFixed(2)}}%</view>
				</view>
				<view class="productInfo">
					<view class="earnL">
						<view class="earnNum">{{ (item.yearRate*100).toFixed(4) }}%</view>
						<view>{{$t('product.index9')}}</view>
					</view>
					<view class="earnR">
						<view class="earnNum">${{ item.staticOutput | turn }}/100/{{ item.powerUnit }}/{{$t('index.index16')}}</view>
						<view>{{$t('product.index10')}}</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingType" :content-text="contentnomore"></uni-load-more>
			<!-- <uni-load-more :status="loadingType"></uni-load-more> -->
		</view>
		<view v-else style="width:100%;text-align: center;">
			<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
			<view style="font-size:12px;text-align:center;color:#999;">{{$t('product.index11')}}~</view>
		</view>
		<view class="pdBg" v-show="filtShow">
			<view class="filtBox">
				<view class="filtTit">{{$t('product.index12')}}</view>
				<view class="coinBox">
					<view class="sysmbol" 
						:class="{ sysmbolon: coin == '' }" 
						@click="cutCoin('')">{{$t('product.index13')}}</view>
					<view class="sysmbol" 
						v-for="(item, index) in coinList" 
						:key="index" 
						:class="{ sysmbolon: coin == item.name }" 
						@click="cutCoin(item.name)">{{ item.name }}</view>
				</view>
				<view class="filtTit">{{$t('product.index14')}}</view>
				<view class="coinBox">
					<view class="sysmbol" :class="{ sysmbolon: term == '' }" 
						@click="cutTime('')">{{$t('product.index13')}}</view>
					<view v-if="termInfoList.length>0" class="sysmbol"
						v-for="(item, index) in termInfoList"
						:key="index"
						:class="{ sysmbolon: term == item.term }"
						@click="cutTime(item.term)">{{item.term}}</view>
				</view>
				<view class="filtBtn">
					<view class="btns" @click="resetFilt">{{$t('product.index15')}}</view>
					<view class="btns btnbg" @click="affirmFilt">{{$t('product.index16')}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
	components: {
		uniLoadMore	
	},
	data() {
		return {
			navTitle: this.$t('pageName.index10'),
			filtShow: false,
			scrollTop: 0,
			old: {
				scrollTop: 0
			},
			loadingType: 'more', //加载更多状态
			coinList: [],
			coin: '',
			term: '',
			pageNo: 1,
			millList: [],
			totalPages: null,
			termInfoList:[],
			stylecss:["color:#1940b9","color:#00195A"],
			arrb:[1,2,3],
			lang: 'zh',
			iconOver_zh: require('@/static/rhinoImg/iconOver.png'),
			iconOver_en: require('@/static/rhinoImg/iconOver_en.png'),
			contentnomore: {
				contentdown: this.$t('relist.index3'),
				contentrefresh: this.$t('relist.index4'),
				contentnomore: this.$t('relist.index5'),
			},
		};
	},
	onShow(){
		let lang = uni.getStorageSync('locale')
		if(lang == 'zh-CN,zh'){
			this.lang = 'zh'
			uni.setNavigationBarTitle({
				title: '产品',
				success:function(){}
			})
		}else{
			this.lang = 'en'
			uni.setNavigationBarTitle({
				title: 'HARVESTER',
				success:function(){}
			})
		}
		this.contentnomore = {
			contentdown: this.$t('relist.index3'),
			contentrefresh: this.$t('relist.index4'),
			contentnomore: this.$t('relist.index5'),
		}
		// uni.setNavigationBarTitle({
		// 	title: this.navTitle,
		// 	success:function(){
		// 		console.log('111')
		// 	}
		// })
		
		this.getCoinList();
		this.getProductList('refresh', 1);
		this.gettermList();
		
	},
	onLoad() {
		// this.resever()
	},
	//下拉刷新
	onPullDownRefresh() {
		let that = this;
		that.getProductList('refresh', 1);
	},
	//加载更多
	onReachBottom() {
		let that = this;
		if (that.pageNo < that.totalPages) {
			that.pageNo++;
		} else {
			this.$api.msg(this.$t('product.index17'));
		}
		that.getProductList('add', that.pageNo);
	},
	
	filters: {
		turn(v) {
			if (v) {
				return v.toFixed(4);
			} else {
				return 0.0;
			}
		},
	},
	methods: {
		resever(val){
		if(val.length>1){
			let arr =  [];
			for(var i = val.length; i > 0; i--){
				arr.push(val[i-1])
			}
			console.log(arr)
			return arr
		}else{
			return val
		}
		
		},

		affirmFilt() {
			this.getProductList('refresh', 1);
			this.filtShow = false;
		},
		resetFilt() {
			this.coin = '';
			this.term = '';
		},
		filtBtn() {
			this.filtShow = true;
		},
		cutCoin(name) {
			this.coin = name;
		},
		cutTime(time) {
			this.term = time;
		},
		cut(name) {
			this.coin = name;
			this.getProductList('refresh', 1);
		},
		upper: function(e) {
			console.log(e);
		},
		lower: function(e) {
			console.log(e);
		},
		scroll: function(e) {
			console.log(e);
			this.old.scrollTop = e.detail.scrollTop;
		},
		goTop: function(e) {
			this.scrollTop = this.old.scrollTop;
			this.$nextTick(function() {
				this.scrollTop = 0;
			});
			uni.showToast({
				icon: 'none',
				title: this.$t('product.index18')
			});
		},
		sel:function(id,sellPortion,totalPortion){
			console.log(sellPortion,totalPortion,"2s")
		},
		
		goDetial: function(id,sellPortion,totalPortion,time,item) {
			console.log(item,"2s",item.buyStatus)
			if( item == 0){
				uni.navigateTo({
					url: './productDetial?id='+id
				});
			}else{
				this.$api.msg(this.$t('product.index19'));
			}
			// if(item.buyStatus !=1){
			// 	uni.navigateTo({
			// 		url: './productDetial?id='+id
			// 	});
			// }else{
			// 	this.$api.msg("已经被抢光啦~");
			// }
		},
		async getCoinList() {
			let that = this;
			let coinInfo = await that.$request.post('/computer-power-api/commonConfig/coinList', {
				data: {}
			});
			if (coinInfo.data.code == 0) {
				that.coinList = coinInfo.data.data;
			} else {
				that.$api.msg(result.data.message);
			}
		},
		async getProductList(type, pageNo) {
			let that = this;
			//没有更多直接返回
			if (type === 'add') {
				if (that.$data.loadingType === 'nomore') {
					this.$api.msg(this.$t('product.index17'));
					return;
				}
				that.$data.loadingType = 'loading';
			} else {
				that.$data.loadingType = 'more';
			}
			let newsList = [];
			try {
				// 获取产品列表
				let millInfo = await that.$request.post('/computer-power-api/chanjuan/itemList', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')? uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {
						coin: that.coin,
						term: that.term,
						pageNo: pageNo,
						pageSize: 20
					}
				});
				if (millInfo.data.code == 0) {
					console.log(uni.getStorageSync('locale'))
					newsList = millInfo.data.data.content;
					let nowtime = new Date().getTime();
					newsList.forEach((item,index)=>{
						if(new Date(item.sellEndTime).getTime() > nowtime){
							item.sellendtime = false;
						}else{
							item.sellendtime = true;
						}
					});
					that.totalPages=millInfo.data.data.totalPages;
				} else {
					that.$api.msg(millInfo.data.message);
					uni.setStorageSync('hasLogin', false);
					uni.setStorageSync('userInfo', '');
					// uni.clearStorageSync();
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/public/login'
						});
					}, 200);
				}
			} catch (error) {
				console.log('error:', error);
				// that.$api.msg('网络异常');
			}
			if (type === 'refresh') {
				that.$data.millList = [];
			}

			that.$data.millList = that.$data.millList.concat(newsList);

			//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
			that.$data.loadingType = newsList.length < 20 ? 'nomore' : 'more';

			if (type === 'refresh') {
				uni.stopPullDownRefresh();
			} else {
				uni.hideLoading();
			}
		},
		async gettermList() {
			let that = this;
			try {
				let termInfo = await that.$request.post('/computer-power-api/commonConfig/termList', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {}
				});
				if (termInfo.data.code == 0) {
					that.termInfoList = termInfo.data.data;
				} else {
					that.$api.msg(termInfo.data.message);
					uni.setStorageSync('hasLogin', false);
					uni.setStorageSync('userInfo', '');
					// uni.clearStorageSync();
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/public/login'
						});
					}, 200);
				}
			} catch (error) {
				// that.$api.msg('网络异常');
			}
		}
	}
};
</script>

<style>
	page{
		background: #f5f5f5;
	}
</style>
<style scoped lang="scss">
	page {
		background: rgba(240, 240, 240, 1);
	}
.container {
	.pdCutbox {
		// #ifndef H5
		position: fixed;
		top: 0;left: 0;
		// #endif
		justify-content: space-between;
		width: 100%;
		display: flex;
		background-color: #fff;
		padding:2% 0;
		z-index: 99;
		.sysmbolBox {
			width: 80%;
			.scroll-view_H {
				white-space: nowrap;
				.sysmbolon {
					border: 1px solid #00a7eb;
					color: #00a7eb;
				}
			}
			.sysmbol {
				display: inline-block;
				width: 104upx;
				height: 56upx;
				line-height: 56upx;
				text-align: center;
				background: #f8f8f8;
				border-radius: 28upx;
				font-size: 11px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #677691;
				margin-left: 3%;
			}
		}
		.filtrateBox {
			width: 15%;
			font-size: 11px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
			line-height: 60upx;
			text-align: center;
			.filtrateIco {
				width: 32upx;
				height: 32upx;
				vertical-align: middle;
			}
		}
	}
	// 云抽奖推荐产品
	.productBox {
		// margin-bottom: 5%;
		// width: 100%;
		margin-top:15%;
		.productList {
			padding: 3% 0;
			margin-bottom: 3%;
			width: 100%;
			background: #fff;
			.productInfo {
				width: 100%;
				display: flex;
				justify-content: space-between;
				padding: 1% 0 1% 4%;
				font-size: 12px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
				
				.productName {
					font-size: 16px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #333333;
				}
				.productTime {
					background: #1940B9;
					width: 45%;
					height: 50upx;
					line-height: 50upx;
					text-align: center;
					position: relative;
					font-size: 12px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #ffffff;
					.triangle {
						width: 0;
						height: 0;
						border-top: 26upx solid transparent;
						border-bottom: 26upx solid transparent;
						border-left: 26upx solid #fff;
						position: absolute;
						top: 0;
						left: 0;
					}
				}
				.poroverbox{
					position: relative;
				    width: 152upx;
				    height: 94upx;
				    margin: 0% 4% 0 0;
					image{
					    width: 152upx;
					    height: 94upx;
					    vertical-align: middle;
					    position: absolute;
					    right: 0;
					    top: 25%;
					}
				}
				.productPrice {
					line-height: 64upx;
					font-size: 14px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #1940b9;
					
				}
				.productDeadline {
					width: 50%;
					text-align: left;
					font-size: 12px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					line-height: 70upx;
					.deadline {
						display: inline-block;
						margin-left: 20upx;
						width: 88upx;
						height: 36upx;
						line-height: 36upx;
						text-align: center;
						background: #ACDCF7;
						border-radius: 28upx;
						font-size: 12px;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #1940b9;
					}
				}
				.productFigure {
					width: 50%;
					text-align: left;
					.figure {
						display: inline-block;
						margin-left: 20upx;
						font-size: 12px;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #333333;
					}
				}
				.progress-box {
					width: 40%;
					padding-top: 2%;
				}
				.progess-num {
					width: 50%;
					text-align: left;
				}
				.earnL {
					width: 50%;
				}
				.earnR {
					width: 50%;
					text-align: left;
				}
				.earnNum {
					color: #00a7eb;
				}
			}
		}
	}
	.pdBg {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 90upx;left: 0;
		background-color: rgba(0, 0, 0, 0.4);
		.filtBox {
			width: 100%;
			padding: 2% 4% 0;
			background: #fff;
			.filtTit {
				font-size: 15px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #333333;
				margin: 2% 0;
			}
			.coinBox {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				.sysmbol {
					display: inline-block;
					width: 104upx;
					height: 56upx;
					line-height: 56upx;
					text-align: center;
					background: #f8f8f8;
					border-radius: 28upx;
					font-size: 11px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #677691;
					margin: 3% 2%;
				}
				.sysmbol-li{
					display: inline-block;
				}
				.sysmbolon {
					border: 1px solid #00a7eb;
					color: #00a7eb;
				}
			}
			.filtBtn {
				width: 100%;
				padding: 3% 0;
				display: flex;
				justify-content: space-between;
				.btns {
					display: inline-block;
					width: 300upx;
					height: 60upx;
					line-height: 60upx;
					text-align: center;
					border-radius: 22px;
					border: 1px solid #00a7eb;
					color: #00a7eb;
				}
				.btnbg {
					background: #00a7eb;
					color: #fff;
				}
			}
		}
	}
}
</style>
