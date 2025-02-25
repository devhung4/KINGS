<template>
	<view class="pagebggray">
		<view class="about-us">
			<view class="content">
				<!-- <jyf-parser :html="htmlNodes"></jyf-parser> -->
				<view class="" style="font-size: 18px;font-weight: 600;">{{htmlNodes.title}}</view>
			<jyf-parser style="margin: 10upx 0;" :html="htmlNodes.text"></jyf-parser> 
			<view class="" >{{htmlNodes.date}} {{htmlNodes.time}}</view>
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
				htmlNodes:"",
				id:''
			}
		},
		onLoad(option) {
			this.id=option.id
			this.aboutus();
		},
		methods:{
			async aboutus(){
				let res = await this.$request.post('/newNews/queryNewsListSort', {
					data:{
						"base":{
							"uid": this.userInfo.userId,
						},
						"param":{
							"id": this.id
						}
					}
				});
				if(res.data.base.code=="000000"){
					this.htmlNodes=res.data.data[0];
				}else{
					console.log(res.data.base.msg);
				}
			},		
		},		
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
