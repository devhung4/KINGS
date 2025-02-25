<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.name" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.phone" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">省市区</text>
			<input class="input"  @click="showMulLinkageThreePicker" type="text" v-model="pickerText" placeholder="收货省市区" placeholder-class="placeholder" disabled="true"/>
		</view>
		<view class="row b-b">
			<text class="tit">地址</text>
			<!-- <text class="input">
				{{addressData.detail}}
			</text> -->
			<input class="input" type="text" v-model="addressData.detail" placeholder="详细地址" placeholder-class="placeholder"/>
			<!-- <text class="yticon icon-shouhuodizhi"></text> -->
		</view>
		<!-- <view class="row b-b"> 
			<text class="tit">门牌号</text>
			<input class="input" type="text" v-model="addressData.area" placeholder="楼号、门牌" placeholder-class="placeholder" />
		</view> -->
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.type | turn" color="#fd852f" @change="switchChange" />
		</view>
		<button class="add-btn" :disabled="loding" @click="confirm">提交</button>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvuePicker from '../../components/mpvue-picker/mpvuePicker.vue';
	import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'
	import cityData from '../../common/city.data.js';
	import {mapState} from 'vuex';
	export default {
		components: {
			mpvuePicker,
			mpvueCityPicker
		},
		data() {
			return {
				addressData: {
					name: '',
					phone: '',
					provinceId:'',
					provinceName:'',
					cityId:'',
					cityName:'',
					areaId:'',
					areaName:'',
					detail:'',
					type:2,
				},
				loding:false,
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#007AFF',
				pickerText: '',
			}
		},
		filters:{
			turn(val){
				if(val == 1){return true}
				else{return false}
			}
		},
		onLoad(option){
			let title = '新增收货地址';
			if(option.type==='edit'){
				title = '编辑收货地址'
				
				this.addressData = JSON.parse(option.data)
				this.pickerText = this.addressData.provinceName + '-' + this.addressData.cityName + '-' + this.addressData.areaName
				if(this.addressData.type == 1){
					
				}
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			onCancel(e) {
				console.log(e)
			},
			onConfirm(e) {
				this.pickerText = e.label
				let arr = e.label.split('-')
	
				this.addressData.provinceName = arr[0]
				this.addressData.cityName = arr[1]
				this.addressData.areaName = arr[2]
				this.addressData.provinceId = e.provinceCode
				this.addressData.cityId = e.areaCode
				this.addressData.areaId = e.cityCode
			},
			// 三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			switchChange(e){
				if(this.addressData.type == 1){
					this.addressData.type = 2;
				}else{
					this.addressData.type = 1;
				}
			},
			
			//地图选择地址
			chooseLocation(){
				uni.chooseLocation({
					success: (data)=> {
						this.addressData.detail = data.name;
					}
				})
			},
			
			//提交
			async confirm(){
				let data = this.addressData;
				if(!data.name){
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if(data.phone.length<11){
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if(data.detail == '在地图选择' || data.detail == ''){
					this.$api.msg('请在地图选择所在位置');
					return;
				}
				if(!this.pickerText){
					this.$api.msg('请选择省市区');
					return;
				}
				let dat = ''
				if(this.manageType == 'edit'){
					this.$data.loding=true;
					dat = await this.$http.post('/userAddress/update', {
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
						 "param": this.addressData
					},{isFactory:false});
				}else{
					this.$data.loding=true;
					dat = await this.$http.post('/userAddress/add', {
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
						 "param": this.addressData
					},{isFactory:false});
				}
				
				if(dat.data.base.code == '000000'){
					this.$data.loding=false;
					//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
					this.$api.prePage().refreshList(data, this.manageType);
					this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
					setTimeout(()=>{
						uni.navigateBack()
					}, 1000)
				}
				else{
					this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}失败`);
				}
			},
			
			// onBackPress() {
			//   if (this.$refs.mpvuePicker.showPicker) {
			//   	this.$refs.mpvuePicker.pickerCancel();
			//     return true;
			//   }
			//   if (this.$refs.mpvueCityPicker.showPicker) {
			//   	this.$refs.mpvueCityPicker.pickerCancel();
			//     return true;
			//   }
			// },
			// 	onUnload() {
			// 		if (this.$refs.mpvuePicker.showPicker) {
			// 			this.$refs.mpvuePicker.pickerCancel()
			// 		}
			// 		if (this.$refs.mpvueCityPicker.showPicker) {
			// 			this.$refs.mpvueCityPicker.pickerCancel()
			// 		}
			// 	}
				
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		// background-color: $base-color;
		background-color: #fd852f;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
