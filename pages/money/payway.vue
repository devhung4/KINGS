<template>
	<!-- <web-view> :src='"/hybrid/html/updPayWay.html?pagetype=1&&accessToken="+accessToken' @message="getMessage"></web-view> -->
</template>

<script>
	import {
	    mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		data(){
			return{
				accessToken:""
			}
		},
		onLoad() {
			this.accessToken = uni.getStorageSync("accessToken");
		},
		methods: {
			getMessage(e) {
				uni.switchTab({
					url:"../user/user"
				})
			}
		}
	}
</script>

<style>
</style>
