<template name="zy-search">
	<view>
		<view class="search">
			<!-- #ifdef APP-PLUS -->
				<!-- <image src="../../static/zy-search/voice.svg" mode="aspectFit" @click="startRecognize()" class="voice-icon"></image> -->
			<!-- #endif -->
			<template v-if="isFocus">
				<input maxlength="20" focus type="text" value="" confirm-type="search" @confirm="searchStart()" placeholder="请输入关键词搜索" v-model.trim="searchText" @input="inputclick"/>
			</template>
			<template v-else>
				<input maxlength="20" type="text" value="" confirm-type="search" @confirm="searchStart()" placeholder="请输入关键词搜索" v-model.trim="searchText" @input="inputclick"/>
			</template>
			<!-- <image src="../../static/zy-search/search.svg" mode="aspectFit" @click="searchStart()" class="search-icon"></image> -->
			<uni-icons color="grey" type="search" size="20" @click="searchStart()" class="search-icon"></uni-icons>
		</view>
		<view :class="'s-' + theme" v-if="hList.length > 0" :style="dishis==1?'display:block':'display:none'">
			<view class="header">
				历史记录
				<!-- <image src="../../static/zy-search/delete.svg" mode="aspectFit" @click="delhistory"></image> -->
				<uni-icons color="grey" type="trash" size="20" @click="delhistory" style="float: right;"></uni-icons>
			</view>
			<view class="list">
				<view v-for="(item,index) in hList" :key="index" @click="keywordsClick(item)">{{item}}</view>
			</view>
		</view>
		<view :class="'wanted-' + theme" v-if="showWant" :style="dishost==1?'display:block':'display:none'">
			<view class="header">热门搜索</view>
			<view class="list">
				<view v-for="(item,index) in hotList" :key="index" @click="keywordsClick(item)">{{item}}</view>
			</view>
		</view>
		<!-- 搜索列表 -->
		<view class="search-item" v-show="showlist">
			<view v-for="(item,index) in searchList" :key="index" class="search-list" @click="listClick(item)">{{item}}</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	export default{
		name:"zy-search",
		components:{
			uniIcons
		},
		props:{
			isFocus:{	//是否自动获取焦点
				type: Boolean,
				default: false
			},
			theme:{	//选择块级显示还是圆形显示
				type: String,
				default: 'block'
			},
			showWant:{	//是否展示推荐菜单
				type: Boolean,
				default: false
			},
			hotList: { //推荐列表数据
				type: Array,
				default () {
					return []
				}
			},
			searchList: { //查询列表数据
				type: Array,
				default () {
					return []
				}
			},
			// speechEngine: { //语音引擎=>讯飞:iFly,百度:'baidu'
			// 	type: String,
			// 	default: 'baidu'
			// }
		},
		data() {
			return {
				searchText:'',								//搜索关键词
				hList:uni.getStorageSync('search_cache'),		//历史记录
				showlist:false,
				dishost:1,
				dishis:1,
			};
		},
		methods: {
			searchStart: function() {	//触发搜索
				let _this = this;
				if (_this.searchText == '') {
					uni.showToast({
						title: '请输入关键字',
						icon: 'none',
						duration: 1000
					});
				}else{
					_this.$emit('getSearchText', _this.searchText);
					uni.getStorage({
						key:'search_cache',
						success(res){
							let list = res.data;
							if(list.length > 5){
								for(let item of list){
									if(item == _this.searchText){
										return;
									}
								}
								list.pop();
								list.unshift(_this.searchText);
							}else{
								for(let item of list){
									if(item == _this.searchText){
										return;
									}
								}
								list.unshift(_this.searchText);
							}
							_this.hList = list;
							uni.setStorage({
								key: 'search_cache',
								data: _this.hList
							});
						},
						fail() {
							_this.hList = [];
							_this.hList.push(_this.searchText);
							uni.setStorage({
								key: 'search_cache',
								data: _this.hList
							});
							_this.$emit('getSearchText', _this.searchText);
						}
					})
				}
			},
			keywordsClick (item) {	//关键词搜索与历史搜索
				this.searchText = item;
				this.searchStart();
			},
			delhistory () {		//清空历史记录
				this.hList = [];
				uni.setStorage({
					key: 'search_cache',
					data: []
				});
			},
			// startRecognize: function() {	//语音输入
			// 	let _this = this;
			// 	let options = {};
			// 	options.engine = _this.speechEngine;
			// 	options.punctuation = false; // 是否需要标点符号 
			// 	options.timeout = 10 * 1000;
			// 	plus.speech.startRecognize(options, function(s) {
			// 		_this.searchText = _this.searchText + s;
			// 	});
			// },
			
			// 搜索列表
			inputclick:function(e){
				let _this = this;
				let inputvalue = e.detail.value;
				if(inputvalue.length > 0){
					for(let i=0; i<_this.searchList.length; i++){
						if(_this.searchList[i] == inputvalue){
							_this.showlist = true;
							_this.$data.dishost = 0;
							_this.$data.dishis = 0;
						}
					}
				}else{
					_this.showlist = false;
					_this.$data.dishost = 1;
					_this.$data.dishis = 1;
				}
			},
			listClick:function(item){
				let _this = this;
				_this.searchText = item;
				uni.redirectTo({
					url:"../../pages/product/list"
				});
			},
		}
	}
</script>

<style lang="less" scoped>
	.search{
		width: 640upx;
		margin: 30upx auto 0;
		position: relative;
		input{
			background-color: #F7F7F7;
			padding: 10upx 74upx;
			font-size: 28upx;
			border-radius: 50upx;
			height: 80upx;
		}
		.voice-icon{
			width: 70upx;
			height: 70upx;
			padding: 5upx 30upx 0px 0;
			position: absolute;
			left: 16upx;
			top: 4upx;
			z-index: 10;
		}
		.search-icon{
			width: 70upx;
			height: 70upx;
			line-height: 70upx;
			padding: 5upx 30upx 0px 0;
			position: absolute;
			right: 0;
			top: -2upx;
			z-index: 10;
		}
	}
	.s-block{
		margin-top: 30upx;
		.header{
			font-size: 32upx;
			padding: 30upx;
			position: relative;
			image{
				width: 50upx;
				height: 50upx;
				padding: 10upx;
				position: absolute;
				right: 40upx;
				top: 24upx;
			}
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			padding: 0 3%;
			view{
				// width: 50%;
				color: #8A8A8A;
				font-size: 28upx;
				box-sizing: border-box;
				text-align: center;
				// padding: 20upx 0;
				padding: 2% 5%;
				border-top: 2upx solid #FFF;
    			border-left: 2upx solid #FFF;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				background-color: #F7F7F7;
			}
		}
	}
	.s-circle{
		margin-top: 30upx;
		.header{
			font-size: 32upx;
			padding: 30upx;
			border-bottom: 2upx solid #F9F9F9;
			position: relative;
			image{
				width: 36upx;
				height: 36upx;
				padding: 10upx;
				position: absolute;
				right: 40upx;
				top: 24upx;
			}
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			padding: 0 30upx 20upx;
			view{
				padding: 8upx 30upx;
				margin: 20upx 30upx 0 0;
				font-size: 28upx;
				color: #8A8A8A;
				background-color: #F7F7F7;
				box-sizing: border-box;
				text-align: center;
				border-radius: 20upx;
			}
		}
	}
	.wanted-block{
		margin-top: 30upx;
		.header{
			font-size: 32upx;
			padding: 30upx;
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			padding: 0 3%;
			view{
				// width: 50%;
				color: #8A8A8A;
				font-size: 28upx;
				box-sizing: border-box;
				text-align: center;
				padding: 2% 5%;
				border-top: 2upx solid #FFF;
				border-left: 2upx solid #FFF;
				background-color: #F7F7F7;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
	.wanted-circle{
		margin-top: 30upx;
		.header{
			font-size: 32upx;
			padding: 30upx;
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			padding: 0 30upx 20upx;
			view{
				padding: 8upx 30upx;
				margin: 20upx 30upx 0 0;
				font-size: 28upx;
				color: #8A8A8A;
				background-color: #F7F7F7;
				box-sizing: border-box;
				text-align: center;
				border-radius: 20upx;
			}
		}
	}
	
	// 搜索列表
	.search-item{
		padding: 3% 0;
	}
	.search-list{
		border-bottom: 2upx solid #eee;
		padding: 3% 5%;
		font-size: 30upx;
	}
</style>
