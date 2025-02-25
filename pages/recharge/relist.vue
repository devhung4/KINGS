<template>
	<view class="content">
		<view class="list">
			<view v-if="list1.length">
				<view class="content-top" v-for="(item,index) in list1" :key="index">
					<view class="zfb-view">
						<view class="zfb-title">
							<!-- <text class="flex flex-direction">订单号：{{item.orderId}}</text> -->
							<view class="text-title">{{$t('relist.index2')}}：{{item.address}}</view>
							<!-- <p>{{item.orderId}}</p> -->
							<view class="text-box">
								<text class="text-time">{{$t('relist.index1')}}：{{item.amount}}{{item.symbol}}</text>
								<text class="status">{{item.statusDesc}}</text>
							</view>
						</view>
						<!-- <view class="status"></view> -->
					</view>
					<view class="bottime">{{item.createTime}}</view>
				</view>
				<uni-load-more :status="loadingType" :content-text="contentnomore"></uni-load-more>
			</view>
			<view v-else style="width:100%;text-align: center;">
				<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
				<view style="font-size:12px;text-align:center;color:#999;">{{$t('userRecord.index6')}}~</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		components: {
			uniLoadMore	
		},
		data() {
			return {
				list1:[],	//明细
				loadingType: 'more', //加载更多状态
				lastsequence:0,
				pageNo:1,
				totalPages:null,
				navTitle: this.$t('relist.index0'),
				contentnomore: {
					contentdown: this.$t('relist.index3'),
					contentrefresh: this.$t('relist.index4'),
					contentnomore: this.$t('relist.index5'),
				},
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.navTitle
			})
		},
		onLoad(options) {
			let that = this;
			that.loadData('refresh',1);
		},
		//下拉刷新
		onPullDownRefresh(){
			let that = this;
			that.loadData('refresh',1);
		},
		//加载更多
		onReachBottom(){
			let that = this;
			if(that.pageNo<that.totalPages){
				that.pageNo++
			}else{
				this.$api.msg(this.$t('userRecord.index7'));
			}
			that.loadData('add',that.pageNo);
		},
		filters:{
			// 具体到时分秒
			timeStamp: function(value) {
				var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var year = date.getFullYear();
				var month = ("0" + (date.getMonth() + 1)).slice(-2);
				var sdate = ("0" + date.getDate()).slice(-2);
				var hour = ("0" + date.getHours()).slice(-2);
				var minute = ("0" + date.getMinutes()).slice(-2);
				var second = ("0" + date.getSeconds()).slice(-2);
				// 拼接
				var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second;
				// 返回
				return result;
			}
		},
		methods: {
			//明细
			async loadData(type,pageNo) {
				let that = this;
				//没有更多直接返回
				if(type === 'add'){
					if(that.$data.loadingType === 'nomore'){
						this.$api.msg(this.$t('userRecord.index7'));
						return;
					}
					that.$data.loadingType = 'loading';
				}else{
					that.$data.loadingType = 'more'
				}
				let newsList = [];
				try {
					let reslist =await that.$request.post('/uc/asset/transaction/all', {
						header: {
							 'x-auth-token':uni.getStorageSync('token'),
							 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
						},
						data:{
							"memberId": that.userInfo.id,
							"pageNo": pageNo,
							"pageSize":20,
							"type":0,
							"symbol":''
							
						}
					});
					
					if(reslist.data.code == 0){
						newsList = reslist.data.data.content;
						that.totalPages=reslist.data.data.totalPages;
					}else{
						that.$api.msg(reslist.data.message);
						uni.setStorageSync("hasLogin",false);
						uni.setStorageSync("userInfo","");
						// uni.clearStorageSync();
						setTimeout(()=>{
							uni.reLaunch({
								url:'/pages/public/login'
							})
						}, 200);
					}
					
				} catch (error) {
					console.error('error:', error);
				}

				if(type === 'refresh'){
					that.$data.list1 = [];
				}
				
				that.$data.list1 = that.$data.list1.concat(newsList);
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				that.$data.loadingType  = newsList.length < 20 ? 'nomore' : 'more';
				
				if(type === 'refresh'){
					uni.stopPullDownRefresh();
				}else{
					uni.hideLoading();
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	.content {
		height: 100%;
	    border-top: 1px solid #f9f9f9;
	}
	.content-top {
		border-bottom: 1px solid #f9f9f9;
	    padding: 8upx 0;
	}
	.zfb-view {
		display: flex;
		width: 90%;
		margin: 10upx auto 10upx;
		justify-content: space-between;
		align-items: center;

	}
	.zfb-title {
		display: flex;
		flex-direction: column;
	}
	.text-title {
		margin: 10upx 0;
		font-size: 24upx;
		/* overflow:hidden; */
		word-break:break-all;
	}
	.text-box{
		width:100%;
		display:flex;
		justify-content: space-between;
	}
	.text-time{
		font-size:24upx;
		font-weight: bold;
	}
	.status{
		font-size: 24upx;
	}
	.bottime{
		font-size: 12px;
		margin: 2% 5%;
	}
</style>
