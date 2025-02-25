<template>
	<view class="content">
		
	</view>
</template> 

<script>
	import {mapState} from 'vuex';
	export default {
		components: {},
		data() {
			return {
				iteminfolist:{}
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		onLoad(options){
			let that = this;
			let iteminfo = uni.getStorageSync("orderiteminfo");
			if(iteminfo!=""){
				that.$data.iteminfolist = iteminfo;
			}
		},
		 
		methods: {
			
		},
	}
</script>

<style lang="scss">

</style>
