<template>
	<view class="container">
		<view class="">
			<view class="list" v-for="(item, index) in csrlist" :key="index">
				<view class="title">
					<view class="num">
						{{item.amount}}MSL
					</view>
					<view class="state">
						成功
					</view>
				</view>
				<view class="tip">
					积分消费接受地址:
				</view>
				<view class="tip">
					{{item.transferMember.mobilePhone||item.transferMember.email}}
				</view>
				<view class="time">
					<text></text>
					<text>提取时间:{{item.createTime}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		
		<view v-if="!csrlist.length" style="width:100%;text-align: center;">
			<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
			<view style="font-size:12px;text-align:center;color:#999;">暂无记录~</view>
		</view>
	</view>
</template>

<script>
	import {  
	    mapMutations,mapState  
	} from 'vuex';
	import {pathToBase64, base64ToPath} from '../../common/image-tools/index.js';
	export default {
		data() {
			return {
				pageNo: 1,
				showmore:true,
				userinfo:{},
				pageSize:10,
				csrlist:[],
				totalPages: null,
				loadingType: 'more', //加载更多状态
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		onLoad() {
			this.getRecord('refresh', 1);
		},
		
		//加载更多
		onReachBottom(){
			let that = this;
			if (that.pageNo <that.totalPages) {
				that.pageNo++;
				
			} else {
				this.$api.msg('已加载全部');
				// return
			}
			console.log(that.pageNo,'yyy')
			that.getRecord('add', that.pageNo);
		},
		methods:{
			...mapMutations(['logout']),
			//获取资产信息
			async getRecord(type,pageNO) {
				let that = this
				
				//没有更多直接返回
				if (type === 'add') {
					if (that.$data.loadingType === 'nomore') {
						that.$api.msg('已加载全部');
						return;
					}
					that.$data.loadingType = 'loading';
				} else {
					that.$data.loadingType = 'more';
				}
				console.log(that.$data.loadingType,'type')
				let newsList = [];
				try {
					let walletList = await this.$request.post('/uc/memberTransferRecord/record', {
						header: {
							'x-auth-token': uni.getStorageSync('token'),
							'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
						},
						data: {
							"pageNo":pageNO,
							"pageSize":that.pageSize,
							"coinId":"CSR",
						}
					});
					if (walletList.data.code == 0) {
						newsList = walletList.data.data.content;
						that.totalPages = walletList.data.data.totalPages;
						
					} else {
						uni.setStorageSync('hasLogin', false);
						uni.setStorageSync('userInfo', '');
						// uni.clearStorageSync();
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/public/login'
							});
						}, 200);
					}
				} catch (e) {
					console.log(e);
					// that.$api.msg('网络异常');
				}
				
				that.$data.csrlist = that.$data.csrlist.concat(newsList);
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				that.$data.loadingType = newsList.length < 10 ? 'nomore' : 'more';
				console.log(newsList.length,that.$data.loadingType,'下面')
				
			},
			
			
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.list{
		width: 100%;
		margin-top: 20upx;
		height: 236upx;
		background: rgba(255, 255, 255, 1);
		opacity: 1;
		padding: 24upx 4%;
	    .title{
			display: flex;
			justify-content: space-between;
			.num{
				height: 50upx;
				font-size: 32upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #000000;
				opacity: 1;
				line-height: 50upx;
			}
			.state{
				width: 88upx;
				height: 50upx;
				border: 1upx solid #E8B00D;
				opacity: 1;
				border-radius: 10upx;
				text-align: center;
				font-size: 24upx;
				font-family: PingFang SC;
				font-weight: 400;
				line-height: 50upx;
				color: #E8B00D;
			}
			.active{
				border: 1upx solid rgba(232, 13, 13, 1);
				color: rgba(232, 13, 13, 1);
			}
		}
		.tip{
			font-size: 24upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #666666;
			opacity: 1;
			margin-top: 12upx;
		}
		.time{

			font-size: 20upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #999999;
			opacity: 1;
			display: flex;
			justify-content: space-between;
			margin-top: 24upx;
		}
	}
	.addmore{
		display: flex;
		justify-content: center;
		margin-top: 16upx;
		font-size: 20upx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #999999;
		opacity: 1
	}

</style>
