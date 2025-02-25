<template>
	<view class="content">
		<view class="list">
			<view v-if="list1.length">
				<view class="content-top" v-for="(item,index) in list1" :key="index">
					<view class="account">时间：{{item.createSequence | timeStamp}}</view>
					<view class="zfb-view">
						<view class="zfb-title">
							<text class="text-title">用户姓名：{{item.realName}}</text>
							<text class="text-time status">{{item.typeDesc}}&nbsp;&nbsp;&nbsp;{{item.statusDesc}}</text>
						</view>
						<view class="zfb-title">
							<text class="text-title">提现金额：{{item.amount}}元</text>
							<text class="text-time">实际到账：{{item.realAmount}}元</text>
						</view>
					</view>
					<view class="account" v-if="item.bankName!==''">银行名称：{{item.bankName}}(手续费：{{item.fee*100}}%)</view>
					<view class="account">账号：{{item.accountId}}</view>
				</view>
				<uni-load-more :status="loadingType"></uni-load-more>
			</view>
			<view v-else style="width:100%;text-align: center;">
				<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
				<view style="font-size:12px;text-align:center;color:#999;">暂无记录~</view>
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
		data() {
			return {
				list1:[],	//明细
				loadingType: 'more', //加载更多状态
				lastsequence:0,
			}
		},
		onLoad(options) {
			let that = this;
			that.loadData('refresh',0);
		},
		//下拉刷新
		onPullDownRefresh(){
			let that = this;
			that.loadData('refresh',0);
		},
		//加载更多
		onReachBottom(){
			let that = this;
			that.loadData('add',that.$data.lastsequence);
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
			async loadData(type,sequence) {
				let that = this;
				//没有更多直接返回
				if(type === 'add'){
					if(that.$data.loadingType === 'nomore'){
						this.$api.msg("已加载全部");
						return;
					}
					that.$data.loadingType = 'loading';
				}else{
					that.$data.loadingType = 'more'
				}
				let newsList = [];
				try {
					let reslist =await that.$http.post('/lanhan/user/withdraw/list', {
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
							"sequence": sequence
						}
					});
					
					if(reslist.length > 0){
						newsList = reslist;
						that.$data.lastsequence = newsList[newsList.length-1].createSequence;
					}
					
				} catch (error) {
					console.error('error:', error);
				}

				if(type === 'refresh'){
					that.$data.list1 = [];
				}
				
				that.$data.list1 = that.$data.list1.concat(newsList);
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				that.$data.loadingType  = newsList.length < 10 ? 'nomore' : 'more';
				
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
		.account{
			padding: 0 5%;
			font-size: 25upx;
			line-height: 50upx;
		}
	}
	.zfb-view {
		width: 90%;
		margin: 0upx auto 10upx;
	}
	.zfb-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.text-title {
		margin: 10upx 0;
		font-size: 24upx;
	}
	.text-time{
		font-size:24upx;
	}
	.status{
		font-size: 24upx;
		color: red;
	}
</style>
