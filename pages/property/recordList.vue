<template>
	<view class="container">
		<view class="list-cell b-b m-t" @click="navTo('/pages/user/recharge')" hover-class="cell-hover" :hover-stay-time="50">
			<!-- <text class="cell-tit">提确权积分记录</text> -->
			<text class="cell-tit">{{$t('recordList.index2')}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('/pages/user/extract')" hover-class="cell-hover" :hover-stay-time="50">
			<!-- <text class="cell-tit">提确权积分记录</text> -->
			<text class="cell-tit">{{$t('recordList.index3')}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('/pages/property/consume')" hover-class="cell-hover" :hover-stay-time="50">
			<!-- <text class="cell-tit">提确权积分记录</text> -->
			<text class="cell-tit">{{$t('recordList.index4')}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('/pages/user/record')" hover-class="cell-hover" :hover-stay-time="50">
			<!-- <text class="cell-tit">提确权积分记录</text> -->
			<text class="cell-tit">{{$t('recordList.index5')}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('/pages/recharge/relist')" hover-class="cell-hover" :hover-stay-time="50">
			<!-- <text class="cell-tit">充确权积分记录</text> -->
			<text class="cell-tit">{{$t('recordList.index6')}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('/pages/property/assetsRecord')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">{{$t('recordList.index7')}}</text>
			<text class="cell-more yticon icon-you"></text>
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
				userinfo:{},
				showmask:false,
				newusername:"",
				headImg:'../../static/missing-face.png',
				navTitle: this.$t('recordList.index1'),
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		onShow(){
			uni.setNavigationBarTitle({
		        title: this.navTitle
		    });
		},
		onLoad() {
			// this.getData();
		},
		methods:{
			...mapMutations(['logout']),
			navTo(url){
				if(!this.hasLogin){
					url = '/pages/public/login';
				}
				uni.navigateTo({  
					url
				})
			},
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				/* color: $uni-color-primary; */
				color: #FD852F;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		.ctimage{
			display: inline-block;
			height: 80upx;
			width: 80upx;
			border-radius: 50%;
			vertical-align: middle;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
	.cov {
		width: 100%;
		height: 100%;
		top:0;bottom: 0;
		left:0;right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 3;
		position: fixed;
		text-align: center;
		font-size: 16px;
		.con {
			z-index:4;
			height:270upx;
			width:600upx;
			background-color: white;
			position: fixed;
			top: 30%;
			left:10%;
			border-radius:20upx;
			.password{
				text-align:center;
				height:80upx;
				line-height:80upx;
				width:100%
			}
			input{
				border-bottom:4upx solid #efefef;
				margin:10upx auto;
				width:90%;
				height: 70upx;
			}
			.buttoncss{
				width:100%;
				height:50upx;
				display:flex;
				margin-top:32upx;
				.text-one,.text-two{
					display:block;
					text-align:center;
					height:50upx;
					line-height:50upx;
					width:50%;
					background: none;
				}
				uni-button:after{
					border: none;
				}
			}
		}
	}
</style>
