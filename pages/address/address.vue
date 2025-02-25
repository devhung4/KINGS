<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList2" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.type == 1" class="tag">默认</text>
					<text class="address">
					<!-- {{item.cityName}} -->
					{{item.detail}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.name}}</text>
					<text class="mobile">{{item.phone}}</text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
			<text style="color: #909399;font-size: 40upx;padding-left: 6px;" class="yticon icon-iconfontshanchu1" @click.stop="del(item,index)"></text>
		</view>
		<!-- <text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
			重要：添加和修改地址回调仅增加了一条数据做演示，实际开发中将回调改为请求后端接口刷新一下列表即可
		</text> -->
		
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				source: 0,
				addressList: [
					{
						name: '刘晓晓',
						mobile: '18666666666',
						addressName: '贵族皇仕牛排(东城店)',
						address: '北京市东城区',
						area: 'B区',
						default: true
					},{
						name: '刘大大',
						mobile: '18667766666',
						addressName: '龙回1区12号楼',
						address: '山东省济南市历城区',
						area: '西单元302',
						default: false,
					}
				],
				addressList2:[]
			}
		},
		onShow() {
			this.getaddress()
		},
		onLoad(option){
			this.source = option.source;
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			async getaddress(){
				let data = await this.$http.post('/userAddress/list', {
					 "base": {
					  "appId": "001",
					  "channels": "001",
					  "ver": "1.1.5",
					  "clientVer": "1.0",
					  "apn": "wifi",
					  "deviceId": "1233eedds2112",
					  "uid": this.userInfo.userId,
					  "valat": 22.332112,
					  "lalong": 12.332112,
					  "platform": "IOS",
					  "platformVer": "8",
					  "resolution": "960*640",
					  "deviceType": "P6",
					  "carrier": "china mobile",
					  "city": "合肥",
					  "brand": "huawei"
					 },
				},{isFactory:false});
				this.addressList2 = data.data.data
			},
			//选择地址
			checkAddress(item){
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item){
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			del(item,index){
				let that=this
				uni.showModal({
				    title: '确定要删除吗',
				    content: '',
				    success: function (res) {
				        if (res.confirm) {
				           	that.getdel(item,index);
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			async getdel(item,index){
				let data = await this.$http.post('/userAddress/updateAddressType', {
					 "base": {
					  "appId": "001",
					  "channels": "001",
					  "ver": "1.1.5",
					  "clientVer": "1.0",
					  "apn": "wifi",
					  "deviceId": "1233eedds2112",
					  "uid": this.userInfo.userId,
					  "valat": 22.332112,
					  "lalong": 12.332112,
					  "platform": "IOS",
					  "platformVer": "8",
					  "resolution": "960*640",
					  "deviceType": "P6",
					  "carrier": "china mobile",
					  "city": "合肥",
					  "brand": "huawei"
					 },
					 "param": {
						"id": item.id,
					 		"type": 0
					 	}
				},{isFactory:false});
				
				this.$api.msg(data.data.base.msg)
				if(data.data.base.code == '000000'){
					this.addressList2.splice(index,1)
				}
			},
			//添加或修改成功之后回调
			refreshList(data, type){
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				this.addressList.unshift(data);
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			/* color: $base-color; */
			color: #fd852f;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #fd852f;
			border-radius: 4upx;
			padding: 10rpx 10rpx;
			line-height: 1;
			text-align: center;
			width: 15%;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: #fd852f;
		/* background-color: $base-color; */
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
