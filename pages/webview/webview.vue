<template>
    <view>
        <web-view :src="vediourl"></web-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                vediourl: ''
            }
        },
        onLoad(e) {
             // 获取传递过来的链接
            this.vediourl = e.url;
        }
    }
</script>

<style lang='scss'>
	
</style>
