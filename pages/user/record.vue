<template>
	<view class="record">
		<view class="record_list" v-if="withdrawinfo.length">
			<view class="extract" v-for="(item, index) in withdrawinfo" :key="index">
				<view class="state_num">
					<!-- <view class="num">{{ item.arrivedAmount }}{{item.coin.name}}</view> -->
					<view class="num">{{ item.arrivedAmount }}MSL</view>
					<view class="state" v-if="item.status == 1">{{$t('userRecord.index1')}}</view>
					<view class="state active" v-else-if="item.status == 2">{{$t('userRecord.index2')}}</view>
					<view class="state active" v-else-if="item.status == 0">{{$t('userRecord.index3')}}</view>
				</view>
				<!-- <view class="address">提确权积分地址：{{ item.address }}</view> -->
				<view class="address">{{$t('userRecord.index4')}}：{{ item.address }}</view>
				<!-- <view class="time">提取时间：{{ item.createTime }}</view> -->
				<view class="time">{{$t('userRecord.index5')}}：{{ item.createTime }}</view>
			</view>
			<uni-load-more :status="loadingType" :content-text="contentnomore"></uni-load-more>
		</view>
		<view v-else style="width:100%;text-align: center;">
			<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
			<view style="font-size:12px;text-align:center;color:#999;">{{$t('userRecord.index6')}}~</view>
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
	computed: {
		...mapState(['hasLogin', 'userInfo'])
	},
	data() {
		return {
			pageNo: 1,
			loadingType: 'more', //加载更多状态
			withdrawinfo: [],
			uid: '',
			totalPages: null,
			navTitle: this.$t('recordList.index5'),
			contentnomore: {
				contentdown: this.$t('relist.index3'),
				contentrefresh: this.$t('relist.index4'),
				contentnomore: this.$t('relist.index5'),
			},
		};
	},
	onShow() {
		uni.setNavigationBarTitle({
			title: this.navTitle,
		})
	},
	created() {},
	onLoad() {
		var userInfo = uni.getStorageSync('userInfo');
		this.uid = userInfo.userId;
		this.getwithdraw('refresh', 1);
	},
	//下拉刷新
	onPullDownRefresh() {
		let that = this;
		that.getwithdraw('refresh', 1);
	},
	//加载更多
	onReachBottom(){
		let that = this;
		if (that.pageNo <that.totalPages) {
			that.pageNo++;
		} else {
			this.$api.msg(this.$t('userRecord.index7'));
		}
		that.getwithdraw('add', that.pageNo);
	},
	methods: {
		//提取记录
		async getwithdraw(type, pageNo) {
			let that = this;
			//没有更多直接返回
			if (type === 'add') {
				if (that.$data.loadingType === 'nomore') {
					this.$api.msg(this.$t('userRecord.index7'));
					return;
				}
				that.$data.loadingType = 'loading';
			} else {
				that.$data.loadingType = 'more';
			}
			let newsList = [];
			try {
				let withdraw = await this.$request.post('/uc/withdraw/record', {
					header: {
						'x-auth-token':uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {
						page: pageNo,
						pageSize: 20
					}
				});
				if (withdraw.data.code == 0) {
					newsList = withdraw.data.data.content;
					that.totalPages = withdraw.data.data.totalPages;
				} else {
					that.$api.msg(withdraw.data.message);
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
				console.error('error:', error);
			}
			if (type === 'refresh') {
				that.$data.withdrawinfo = [];
			}

			that.$data.withdrawinfo = that.$data.withdrawinfo.concat(newsList);

			//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
			that.$data.loadingType = newsList.length < 20 ? 'nomore' : 'more';

			if (type === 'refresh') {
				uni.stopPullDownRefresh();
			} else {
				uni.hideLoading();
			}
		}
	},
	filters: {
		// timeStamp: function(value) {
		// 	if (!value) return '';
		// 	var now = new Date(value);
		// 	var year = now.getFullYear();
		// 	var month = now.getMonth() + 1;
		// 	if (month < 10) {
		// 		month = '0' + month
		// 	}
		// 	var date = now.getDate();
		// 	if (date < 10) {
		// 		date = '0' + date
		// 	}
		// 	return year + "-" + month + "-" + date
		// },
		timeStamp: function(value) {
			//具体到时分秒
			var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			var year = date.getFullYear();
			var month = ('0' + (date.getMonth() + 1)).slice(-2);
			var sdate = ('0' + date.getDate()).slice(-2);
			var hour = ('0' + date.getHours()).slice(-2);
			var minute = ('0' + date.getMinutes()).slice(-2);
			var second = ('0' + date.getSeconds()).slice(-2);
			// 拼接
			var result = year + '-' + month + '-' + sdate + ' ' + hour + ':' + minute + ':' + second;
			// 返回
			return result;
		}
	}
};
</script>

<style lang="scss">
page {
	background: rgba(246, 246, 246, 1);
}
.record_list {
	.extract {
		// height: 234upx;
		background: rgba(255, 255, 255, 1);
		padding: 40upx 24upx 40upx 30upx;
		box-sizing: border-box;
		background: #ffffff;
		margin-top: 20upx;
		.state_num {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.state {
				font-size: 32upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: rgba(69, 201, 158, 1);
			}
			.num {
				font-size: 40upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: rgba(51, 51, 51, 1);
			}
		}
		.address {
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			margin-top: 20upx;
			margin-bottom: 10upx;
			width: 100%;
			word-wrap:break-word;
		}
		.time {
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
		}
	}
}
.active {
	color: rgba(232, 65, 112, 1) !important;
}
</style>
