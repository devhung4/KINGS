<template>
	<view class="pagebggray">
		<view class="introduce"><jyf-parser :html="htmlNodes.content"></jyf-parser></view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import jyfParser from '@/components/jyf-parser/jyf-parser.vue';
export default {
	computed: {
		...mapState(['hasLogin', 'userInfo'])
	},
	data() {
		return {
			contenthtml: '',
			htmlNodes: '',
			htmltext: true
		};
	},
	onLoad(option) {
		this.aboutus(option.type);
	},
	methods: {
		// 说明
		async aboutus(type) {
			let res = await this.$request.post('/uc/ancillary/more/help/detail', {
				data: {
					id: type
				}
			});
			if (res.data.code == 0) {
				this.htmlNodes = res.data.data;
			} else {
				console.log(res.data.message);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.pagebggray {
	.introduce {
		font-size: 28upx;
		line-height: 50upx;
		padding: 5%;
		background: #ffffff;
		border-radius: 20upx;
		min-height: 100%;
	}
}
</style>
