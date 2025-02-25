<template>
	<view>
		<view class="topflex">
			<view class="view-top" @click="cashOut">
				<view v-if="pageindex==1">
					<view class="red-packet">
						<view class="leftcss">
							<text>我的余额</text>
							<text>￥{{balance}}</text>
						</view>
						<view class="rightcss">
							<text>生产金总额</text>
							<text>￥{{balanceinfo.productIncome}}</text>
						</view>
					</view>
					<view class="red-packet">
						<view class="leftcss">
							<text>累计充值</text>
							<text>￥{{balanceinfo.totalRecharge}}</text>
						</view>
						<view class="rightcss">
							<text>累计消费</text>
							<text>￥{{balanceinfo.totalBuy}}</text>
						</view>
					</view>
				</view>
				<view v-else>
					<view class="title">{{pageindex==1?'我的':'积分'}}余额</view>
					<view class="money">￥{{balance}}</view>
				</view>
			</view>
			<view class="navbar">
				<view v-for="(item, index) in navList" :key="index" 
					class="nav-item" 
					:class="{ current: tabCurrentIndex === index }"
					@click="tabClick(index)">
					{{ item.text }}
				</view>
			</view>
		</view>
		<view class="content" :style="{paddingTop: pageindex==1?'65%':'50%'}">
			<!-- 余额 -->
			<view class="balance-view" v-if="balanceshow">
				<!-- 余额明细 -->
				<!-- <scroll-view class="list" scroll-y="true"> -->
				<!-- v-if="tabCurrentIndex === 0" -->
				<view class="list">
					<view v-if="list1.length">
						<view class="content-top"
							v-for="(item,index) in list1" :key="index">
							<view class="zfb-view">
								<view class="zfb-title">
									<text class="text-title">{{item.note}}</text>
									<text class="text-time">{{item.createTime}}</text>
								</view>
								<view class="zfb-money" :style="{'color':((item.changeBalance.replace('+',''))>0?'#FA436A':'#000')}">
									{{item.changeBalance}}
								</view>
							</view>
						</view>
						<uni-load-more :status="loadingTypeb"></uni-load-more>
					</view>
					<view v-else style="width:100%;text-align: center;">
						<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
						<view style="font-size:12px;text-align:center;color:#999;">暂无记录~</view>
					</view>
				</view>
				<!-- </scroll-view> -->
			</view>
			
			<!-- 积分 -->
			<view class="integral-view" v-else>
				<!-- 积分明细 -->
				<!-- <scroll-view class="list" scroll-y="true"> -->
				<view class="list">
					<!-- v-if="tabCurrentIndex === 0" -->
					<view v-if="list4.length">
						<view class="content-top"
							v-for="(item,index) in list4" :key="index">
							<view class="zfb-view">
								<view class="zfb-title">
									<text class="text-title">{{item.note}}</text>
									<text class="text-time">{{item.createTime}}</text>
								</view>
								<view class="zfb-money" :style="{'color':((item.changeScore.replace('+',''))>0?'#FA436A':'#000')}">
									{{item.changeScore}}
								</view>
							</view>
						</view>
						<uni-load-more :status="loadingTypec"></uni-load-more>
					</view>
					<view v-else style="width:100%;text-align: center;">
						<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
						<view style="font-size:12px;text-align:center;color:#999;">暂无明细列表~</view>
					</view>
				</view>
				<!-- </scroll-view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import app from "../../App.vue";
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		data() {
			return {
				balanceshow:true,
				uid: '',
				balance:0, //余额
				// differentialRedPacketBalance:0,
				// prefixRedPacketBalance:0,
				tabCurrentIndex: 0,
				navList: [],
				show: true,
				list1:[],	//余额明细
				// list2:[],	//静态收益
				// list3:[],	//动态收益
				list4:[],	//积分明细
				pageindex:1,
				loadingTypeb: 'more', //加载更多状态
				loadingTypec: 'more', //加载更多状态
				lastrecorddateb:0,
				lastrecorddatec:0,
				balanceinfo:""
			}
		},
		created() {
			
		},
		onLoad(options) {
			let that = this;
			if(options){
				that.$data.pageindex = options.pageindex;
				if(options.pageindex == 1){
					that.$data.navList = [
						{text: '余额明细'},
						{text: '生产收益'},
						{text: '社区收益'}
					]
				}else{
					that.$data.navList = [{text: '积分明细'}];
				}
			}
			that.loadData();
			if(this.$data.pageindex == 1){
				that.$data.balanceshow = true;
				uni.setNavigationBarTitle({
				    title: "余额"
				});
				that.loadDatabalance('refresh',0,0); //余额
			}else{
				that.$data.balanceshow = false;
				uni.setNavigationBarTitle({
				    title: "积分"
				});
				that.loadDatascore('refresh',0); //积分
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			let that = this;
			let index = that.$data.tabCurrentIndex;
			if (index == 1) {
				that.loadDatabalance('refresh',14,0);
			} else if (index == 2) {
				that.loadDatabalance('refresh',13,0);
			}else{
				if(that.$data.pageindex == 1){
					that.loadDatabalance('refresh',0,0); //余额
				}else{
					that.loadDatascore('refresh',0); //积分
				}
			}
		},
		//加载更多
		onReachBottom(){
			let that = this;
			let index = that.$data.tabCurrentIndex;
			if (index == 1) {
				that.loadDatabalance('add',14,that.$data.lastrecorddateb);
			} else if (index == 2) {
				that.loadDatabalance('add',13,that.$data.lastrecorddateb);
			}else{
				if(that.$data.pageindex == 1){
					that.loadDatabalance('add',0,that.$data.lastrecorddateb); //余额
				}else{
					that.loadDatascore('add',that.$data.lastrecorddatec); //积分
				}
			}
		},
		methods: {
			//跳转至提现页面
			cashOut() {
				let that=this;
				uni.navigateTo({
					url:"./withdraw"
				})
			},
			//顶部tab点击
			async tabClick(index) {
				let that = this;
				that.tabCurrentIndex = index;
				if (index == 1) {
					that.loadDatabalance('refresh',14,0);
				} else if (index == 2) {
					that.loadDatabalance('refresh',13,0);
				}else{
					if(that.$data.pageindex == 1){
						that.loadDatabalance('refresh',0,0); //余额
					}else{
						that.loadDatascore('refresh',0); //积分
					}
				}
			},
			//余额
			async loadData() {
				let resbalance = await this.$http.post('/task/getUserRewardInfo', {
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
				})
				
				if(this.$data.pageindex == 1){
					this.balance = resbalance.balance;
				}else{
					this.balance = resbalance.score;
				}
				this.$data.balanceinfo = resbalance;
				// this.differentialRedPacketBalance = res1.balanceDetail.differentialRedPacketBalance
				// this.prefixRedPacketBalance = res1.balanceDetail.prefixRedPacketBalance
			},
			
			//余额明细
			async loadDatabalance(atype,type,lastrecorddate) {
				let that = this;
				//没有更多直接返回
				if(atype === 'add'){
					if(that.$data.loadingTypeb === 'nomore'){
						return;
					}
					that.$data.loadingTypeb = 'loading';
				}else{
					that.$data.loadingTypeb = 'more'
				}
				let oldgoodsList = [];
				try {
					let resbalancedetail =await that.$http.post('/user/queryUserBalanRecoList', {
						"base": {
							"appId": "001",
							"channels": "001",
							"ver": "1.1.5",
							"clientVer": "1.0",
							"apn": "wifi",
							"deviceId": "1233eedds2112",
							"uid": that.userInfo.userId,
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
							"lastRecordDate":lastrecorddate,
							"type":type
						}
					});
					
					if(resbalancedetail.length > 0){
						oldgoodsList = resbalancedetail;
						that.$data.lastrecorddateb = oldgoodsList[oldgoodsList.length-1].sequence;
					}
					
				} catch (error) {
					console.error('error:', error);
				}
				
				if(atype === 'refresh'){
					that.$data.list1 = [];
				}
				
				that.$data.list1 = that.$data.list1.concat(oldgoodsList);
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				that.$data.loadingTypeb  = oldgoodsList.length < 10 ? 'nomore' : 'more';
				
				if(atype === 'refresh'){
					uni.stopPullDownRefresh();
				}else{
					uni.hideLoading();
				}
				
				// if(that.tabCurrentIndex==0){
				// 	that.list1 = resbalancedetail;
				// }else if(that.tabCurrentIndex==1){
				// 	that.list2 = resbalancedetail;
				// }else{
				// 	that.list3 = resbalancedetail;
				// }
			},
		
			//积分
			async loadDatascore(atype,lastrecorddate) {
				let that = this;
				//没有更多直接返回
				if(atype === 'add'){
					if(that.$data.loadingTypec === 'nomore'){
						return;
					}
					that.$data.loadingTypec = 'loading';
				}else{
					that.$data.loadingTypec = 'more'
				}
				let oldgoodsList = [];
				try {
					let resscore = await that.$http.post('/user/queryUserScoreRecoList', {
						"base": {
							"appId": "001",
							"channels": "001",
							"ver": "1.1.5",
							"clientVer": "1.0",
							"apn": "wifi",
							"deviceId": "1233eedds2112",
							"uid": that.userInfo.userId,
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
							"lastRecordDate":lastrecorddate
						}
					})
					if(resscore.length > 0){
						oldgoodsList = resscore;
						that.$data.lastrecorddatec = oldgoodsList[oldgoodsList.length-1].sequence;
					}
					
				} catch (error) {
					console.error('error:', error);
				}
				
				if(atype === 'refresh'){
					that.$data.list4 = [];
				}
				
				that.$data.list4 = that.$data.list4.concat(oldgoodsList);
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				that.$data.loadingTypec  = oldgoodsList.length < 10 ? 'nomore' : 'more';
				
				if(atype === 'refresh'){
					uni.stopPullDownRefresh();
				}else{
					uni.hideLoading();
				}
			},
		}
	}
</script>

<style lang='scss'>
	.content {
		height: 100%;
		/* padding-top: 360upx; */
	}
	.topflex{
	    position: fixed;
	    width: 100%;
	    left: 0;
	    right: 0;
	}

	.navbar {
		display: flex;
		height: 80upx;
	    padding: 16upx 10upx 0;
	    background: #fff;
	    box-shadow: 0 1px 10upx rgba(0, 0, 0, 0.06);
	    position: relative;
	    z-index: 10;
	    /* justify-content: space-around; */
	    align-items: center;

		.nav-item {
		    height: 100%;
		    font-size: 15px;
		    position: relative;
			width: 30%;
			text-align: center;

			&.current {
				color: #FA436A;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid #FA436A;
				}
			}
		}
	}

	.list {
		background: #fff;
		width:100%;
		/* height:880upx; */
	}

	.view-top {
	    background: #FA436A;
	    color: #FFFFFF;
	    padding: 8% 0;
		margin-bottom: 6upx;
	}

	.title {
		/* font-size: 24px; */
		text-align: center;
	}

	.money {
	    font-size: 60upx;
	    font-weight: bold;
	    width: 100%;
	    text-align: center;
	    line-height: 100upx;
	}

	.red-packet {
		display: flex;
		justify-content: space-between;
		width: 70%;
		margin: 30upx auto 0;
	}

	.leftcss,
	.rightcss {
		display: flex;
		font-weight: bold;
		font-size: 35upx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.content-top {
	    border-bottom: 2px solid #f9f9f9;
	    padding: 8upx 0;
	}

	.zfb-view {
		display: flex;
		width: 90%;
		margin: 5upx auto 0;
		justify-content: space-between;
		align-items: center;

	}

	.zfb-title {
		display: flex;
		flex-direction: column;
	}

	.text-title {
		font-weight: bold;
		margin: 10upx 0;
		font-size: 30upx;
	}
	.text-time{
		color: #878787;
		font-size:24upx;
	}
</style>
