<template>
	<view>
		<view v-if="noticelist.length">
			<block v-for="(item,index) in noticelist" :key="index">
				<view class="notice-item" @tap="todetail(JSON.stringify(item))">
					<text class="time">{{item.createTime}}</text>
					<view class="content">
						<view class="top">
							<text class="title">{{item.title}}</text>
							<!-- <text class="redround greycolor">{{item.createTime}}</text> -->
						</view>
						<!-- <view class="img-wrapper">
							<image class="pic" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556465765776&di=57bb5ff70dc4f67dcdb856e5d123c9e7&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01fd015aa4d95fa801206d96069229.jpg%401280w_1l_2o_100sh.jpg"></image>
						</view> -->
						<!-- <view class="introduce clamp">{{item.content}}</view> -->
						<view class="bot b-t">
							<text>查看详情</text>
							<text class="more-icon yticon icon-you"></text>
						</view>
					</view>
				</view>
			</block>
		</view>
		<view v-else style="width:100%;text-align: center;">
			<view><image src="../../static/nodata.png" style="width:360upx;height:250upx;margin:20% 0 5%;"></image></view>
			<view style="font-size:12px;text-align:center;color:#999;">{{nlshow}}</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		data() {
			return {
				noticelist:[],
				nlshow:"",
				pageNo:1,
				pageSize:10,
			}
		},
		async onShow() {
			let that = this;
			if(that.hasLogin){
				let sysmsglist = await this.$request.post('/uc/ancillary/system/help', {
					data:{}	
				});
				if(sysmsglist.data.data.length > 0){
					that.$data.noticelist = sysmsglist.data.data;
					that.$data.nlshow = "";
				}else{
					that.$data.nlshow = "暂无公告~";
				}
			}
		},
		methods: {
			todetail(item){
				uni.setStorageSync("noticelist",item);
				uni.navigateTo({
					url:"../notice/noticedetail"
				})
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}

	.notice-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		padding-top: 10upx;
		font-size: 26upx;
		color: #7d7d7d;
	}

	.content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
		.top{
			height: 90upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.redround{
				font-size: 24upx;
			}
			.redcolor{
				color: #FA436A;
			}
			.greycolor{
				color: #DCDFE6;
			}
			.title {
				width: 90%;
				font-size: 32upx;
				color: #303133;
			}
		}
	}

	.img-wrapper {
		width: 100%;
		height: 260upx;
		position: relative;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36upx;
		color: #fff;
	}

	.introduce {
		padding: 20upx 0;
		font-size: 28upx;
		color: #606266;
		line-height: 38upx;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		font-size: 24upx;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: 32upx;
	}
</style>
