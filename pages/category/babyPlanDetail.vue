<template>
	<view class="content">
		<rich-text :nodes="htmlNodes"></rich-text>
		
		<!-- #ifdef MP-WEIXIN || MP-QQ -->
		<!-- <ad v-if="htmlNodes.length > 0" unit-id="adunit-01b7a010bf53d74e"></ad> -->
		<!-- #endif -->
	</view>
</template>
<script>
	const DETAIL_PAGE_PATH = '/pages/category/babyPlanDetail';

	function _handleShareChannels(provider) {
		let channels = [];
		for (let i = 0, len = provider.length; i < len; i++) {
			switch (provider[i]) {
				case 'weixin':
					channels.push({
						text: '分享到微信好友',
						id: 'weixin',
						sort: 0
					});
					channels.push({
						text: '分享到微信朋友圈',
						id: 'weixin',
						sort: 1
					});
					break;
				default:
					break;
			}
		}
		channels.sort(function(x, y) {
			return x.sort - y.sort;
		});
		return channels;
	}

	export default {
		components: {

		},
		data() {
			return {
				itemlist:{},
				htmlNodes: '',
			}
		},
		onLoad() {
			var that = this;
			var babyplanitem = uni.getStorageSync("babyplanitem");
			try {
				var itemlist = JSON.parse(babyplanitem);
				that.itemlist = itemlist;
				
				var itemtitle = itemlist.title.substring(0, 5)+"..."
				uni.setNavigationBarTitle({
					title:itemtitle
				})
			} catch (error) {
				
			}
			that.getDetail();
		},
		onShareAppMessage() {
			return {
				title: this.itemlist.title,
				path: DETAIL_PAGE_PATH
			}
		},
		onNavigationBarButtonTap(event) {
			const buttonIndex = event.index;
			if (buttonIndex === 0) {
				// 分享 H5 的页面
				const shareProviders = [];
				uni.getProvider({
					service: 'share',
					success: (result) => {
						// 目前仅考虑分享到微信
						if (result.provider && result.provider.length && ~result.provider.indexOf('weixin')) {
							const channels = _handleShareChannels(result.provider);
							uni.showActionSheet({
								itemList: channels.map(channel => {
									return channel.text;
								}),
								success: (result) => {
									const tapIndex = result.tapIndex;
									uni.share({
										provider: 'weixin',
										type: 0,
										title: this.itemlist.title,
										scene: tapIndex === 0 ? 'WXSceneSession' : 'WXSenceTimeline',
										href: 'https://uniapp.dcloud.io/h5' + DETAIL_PAGE_PATH,
										imageUrl: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/app/share-logo@3.png'
									});
								}
							});
						} else {
							uni.showToast({
								title: '未检测到可用的微信分享服务'
							});
						}
					},
					fail: (error) => {
						uni.showToast({
							title: '获取分享服务失败'
						});
					}
				});
			}
		},
		methods: {
			getDetail() {
				var htmlString = this.itemlist.content.replace(/\\/g, "").replace(/<img/g, "<image style=\"max-width:100%;display:inline-block;margin:10rpx auto;\"");
				this.htmlNodes = htmlString;
			}
		}
	}
</script>

<style>
	.content{
		padding: 5%;
		font-size: 30rpx;
	}
</style>
