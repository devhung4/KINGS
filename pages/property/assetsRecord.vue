<template>
	<view class="record">
		<view class="filterRecord">
			<text>{{$t('assetsRecord.index2')}}</text>
			<view class="rightbox">
				<picker class="pickerRecord" @change="bindPickerChange" :value="index" :range="typeArr">
					<view class="uni-input">{{ typeArr[index] }}</view>
				</picker>
				<image src="~@/static/img/open.png"></image>
			</view>
		</view>
		<view class="record_list" v-if="assetsinfo.length">
			<view class="extract" v-for="(item, index) in assetsinfo" :key="index">
				<view class="state_num">
					<view class="num">{{ item.amount }}{{ item.symbol }}</view>
					<view class="state">{{ item.typeName }}</view>
				</view>
				<view class="address">{{$t('assetsRecord.index3')}}：{{ item.id }}</view>
				<view class="time">{{$t('assetsRecord.index4')}}：{{ item.createTime }}</view>
			</view>
			<uni-load-more :status="loadingType" :content-text="contentnomore"></uni-load-more>
			<!-- <view class="extract" v-for="i in 5">
				<view class="state_num">
					<view class="state">
						提取成功
					</view>
					<view class="num">
						200
					</view>
				</view>
				<view class="address">
					提起地址：47238473wt8e7r8
				</view>
				<view class="time">
					提取时间：2020-04-10 10:1
				</view>
			</view> -->
		</view>
		<view v-else style="width:100%;text-align: center;">
			<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
			<view style="font-size:12px;text-align:center;color:#999;">{{$t('assetsRecord.index5')}}~</view>
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
			pageNo: 1,
			assetsinfo: [],
			loadingType: 'more', //加载更多状态
			memberId: '',
			typeList: [],
			totalPages: null,
			typeArr: [this.$t('assetsRecord.index6'),this.$t('assetsRecord.index7'),this.$t('assetsRecord.index8'),this.$t('assetsRecord.index9'),this.$t('assetsRecord.index10'),this.$t('assetsRecord.index11'),this.$t('assetsRecord.index12'),this.$t('assetsRecord.index13')],
			index:0,
			type:'',
			navTitle: this.$t('assetsRecord.index1'),
			contentnomore: {
				contentdown: this.$t('relist.index3'),
				contentrefresh: this.$t('relist.index4'),
				contentnomore: this.$t('relist.index5'),
			},
		};
	},
	computed: {
		...mapState(['hasLogin', 'userInfo'])
	},
	onLoad() {
		var userInfo = uni.getStorageSync('userInfo');
		this.memberId = userInfo.id;
		this.getAssetsType();
	},
	async onShow(){
		uni.setNavigationBarTitle({
			title: this.navTitle
		})
		this.getAssetsType();
	},
	//下拉刷新
	onPullDownRefresh() {
		let that = this;
		that.getAssets('refresh', 1);
	},
	//加载更多
	onReachBottom() {
		let that = this;
		if (that.pageNo < that.totalPages) {
			that.pageNo++;
		} else {
			this.$api.msg('已加载全部');
		}
		that.getAssets('add', that.pageNo);
	},
	methods: {
		bindPickerChange: function(e) {
			let that = this;
			that.index = e.target.value;
			if(that.index==0){
				that.type='';
			}else if(that.index==1){
				that.type=10;
			}else if(that.index==2){
				that.type=146;
			}else if(that.index==3){
				that.type=147;
			}else if(that.index==4){
				that.type=148;
			}else if(that.index==5){
				that.type=149;
			}else if(that.index==6){
				that.type=152;
			}else if(that.index==7){
				that.type=153;
			}
			
			
			that.getAssets('refresh', 1);
		},
		//提取记录
		async getAssets(type, pageNo) {
			let that = this;
			//没有更多直接返回
			if (type === 'add') {
				if (that.$data.loadingType === 'nomore') {
					that.$api.msg(this.$t('userRecord.index7'));
					return;
				}
				that.$data.loadingType = 'loading';
			} else {
				that.$data.loadingType = 'more';
			}
			let newsList = [];
			try {
				let assets = await that.$request.post('/uc/asset/transaction/all', {
					header: {
						'x-auth-token':uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
					},
					data: {
						pageNo: pageNo,
						pageSize: 20,
						memberId: that.memberId,
						startTime: '',
						endTime: '',
						symbol: '',
						type: that.type,
					}
				});
				if (assets.data.code == 0) {
					newsList = assets.data.data.content;
					that.totalPages = assets.data.data.totalPages;
					for (var i = 0; i < newsList.length; i++) {
						let type = newsList[i].type;
						let text;
						text = that.typeList.find(function(obj) {
							return obj.code == type;
						});
						// for(var j=0;j<this.typeList.length;j++){

						// }
						newsList[i].typeName = text.name;
						// console.log(text);
					}
				} else {
					that.$api.msg(assets.data.message);
					// uni.setStorageSync('hasLogin', false);
					// uni.setStorageSync('userInfo', '');
					// // uni.clearStorageSync();
					// setTimeout(() => {
					// 	uni.reLaunch({
					// 		url: '/pages/public/login'
					// 	});
					// }, 200);
				}
			} catch (error) {
				console.error('error:', error);
			}
			if (type === 'refresh') {
				that.$data.assetsinfo = [];
			}

			that.$data.assetsinfo = that.$data.assetsinfo.concat(newsList);

			//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
			that.$data.loadingType = newsList.length < 20 ? 'nomore' : 'more';

			if (type === 'refresh') {
				uni.stopPullDownRefresh();
			} else {
				uni.hideLoading();
			}
		},
		// 获取记录类型
		async getAssetsType() {
			let types = await this.$request.post('/uc/memberTransaction/transactionTypeList', {
				header: {
					'x-auth-token':uni.getStorageSync('token'),
					'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
				},
				data: {}
			});
			if (types.data.code == 0) {
				this.typeList = types.data.data;
				// console.log(this.typeList)
				this.getAssets('refresh', 1);
			}
		}
	},
	filters: {
		// typeText:function(value){
		// 	console.log(this.typeList)
		// },
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
.filterRecord{
	width:100%;
	background:#fff;
	display:flex;
	align-items: center;
	justify-content: space-between;
	padding:2% 4%;
	position: relative;
	.rightbox{
		display:flex;
		align-items: center;
		width: 65%;
	}
	.pickerRecord{
		width:100%;
		text-align: right;
	    padding-right: 10%;
	    position: relative;
	    z-index: 1000;
	    margin-left: 8%;
	}
	image{
	    width: 36upx;
	    height: 20upx;
	    vertical-align: middle;
	    position: absolute;
	    right: 28upx;
	}
}
.record_list {
	.extract {
		height: 234upx;
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
