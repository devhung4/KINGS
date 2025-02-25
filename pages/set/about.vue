<template>
	<view class="pagebggray">
		<view class="about-us">
			<view class="content">
				<!-- <jyf-parser :html="htmlNodes"></jyf-parser> -->
				<view class="">{{htmlNodes.content}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue';
	export default{
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		components: {
			jyfParser
		},
		data(){
			return {
				htmlNodes:""
			}
		},
		methods:{
			async aboutus(){
				let res = await this.$request.post('flash-channel/ruleDescription', {
					data:{
						"base":{
							"uid": this.userInfo.userId,
						},
						"param":{
							"id":"2" 
						}
					}
				});
				if(res.data.base.code=="000000"){
					this.htmlNodes=res.data.data;
				}else{
					console.log(res.data.base.msg);
				}
			},		
		},
		onLoad() {
			this.aboutus();
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f2f2f2;
	}
	.about-us{
		background: #FFFFFF;
		padding: 3%;
		border-radius: 10px;
		width: 95%;
		margin: 10px auto;
		.content{
			line-height: 50upx;
			font-size: $font-base;
		}
	}
</style>
