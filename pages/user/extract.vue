<template>
	<view class="extract">
		<view class="extract_list">
			<view class="extract_num">
				<!-- <text>选择确权积分</text> -->
				<text>{{$t('extract.index1')}}</text>
				<picker @change="bindPickerChange" :value="index" :range="typevar">
					<view class="uni-input" style="color: #4399FC;">{{ typevar[index] }}</view>
				</picker>
			</view>
			<view class="extract_num">
				<text>{{$t('extract.index2')}}</text>
				<picker @change="bindPickerExtract" :value="exIndex" :range="extractType">
					<view class="uni-input" style="color: #4399FC;">{{ extractType[exIndex] }}</view>
				</picker>
			</view>
			<view class="extract_num">
				<!-- <text>提取数量</text> -->
				<text>{{$t('extract.index3')}}</text>
				<view class="num_input">
					<!-- <input type="text" v-model="num" placeholder="请输入提取数量" /> -->
					<input type="text" v-model="num" :placeholder="$t('extract.index4')" />
					<!-- <view class="whole" @click="extractall()">全部提取</view> -->
					<view class="whole" @click="extractall()">{{$t('extract.index21')}}</view>
				</view>
			</view>

			<view class="balance">{{$t('extract.index5')}}{{ balance }}{{ sysmbol }}</view>
			<view class="balance">{{$t('extract.index6')}}{{ num == 0 ? 0 :num - charge }}{{ sysmbol }}</view>

			<view class="extract_num">
				<!-- <text>提确权积分地址</text> -->
				<text>{{$t('extract.index7')}}</text>
				<view class="num_input">
					<!-- <input style="width:90%;" type="text" value="" v-model="address" placeholder="请输入提确权积分地址" /> -->
					<input style="width:90%;" type="text" value="" v-model="address" :placeholder="$t('extract.index8')" />
					<!-- #ifndef H5 -->
					<view class="whole" @click="openewm"><image src="../../static/img/btn_scan_normal.png" mode=""></image></view>
					<!-- #endif -->
				</view>
			</view>
			<view class="extract_num">
				<text>{{$t('extract.index9')}}</text>
				<view class="num_input">
					<input type="text" value="" v-model="code" :placeholder="$t('findpsd.index4')" />
					<view v-show='!btncode' class="whole" @click="getcode()">{{ text }}</view>
					<view v-show='btncode' class="whole">{{ text }}</view>
				</view>
			</view>
			<view class="extract_num">
				<text>{{$t('extract.index10')}}</text>
				<view class="num_input"><input type="password" value="" v-model="jyPassword" :placeholder="$t('extract.index20')" /></view>
			</view>
			<view class="extract_num">
				<text>{{$t('extract.index11')}}</text>
				<view class="num_input"><input type="text" disabled="diabled" value="" v-model="charge" placeholder="0.00" /></view>
			</view>
			<view class="extract_num">
				<text>{{$t('extract.index12')}}</text>
				<view class="num_input"><input type="text" value="" v-model="remark" :placeholder="$t('extract.index13')" /></view>
			</view>
			<!-- <button class="confirm" :disabled="btndisabl" @click="payment()">确认提取</button> -->
			<button class="confirm" :disabled="btndisabl" @click="payment()">{{$t('extract.index14')}}</button>
		</view>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			typevar:[],
			btndisabl: false,
			btncode:false,
			uid: '',
			balance: 0,
			num: '',
			charge: '',
			text: this.$t('findpsd.index8'),
			exIndex:0,
			extractioninfo: {},
			index: 0,
			typeArr: [],
			sysmbol: '',
			sysmbolInfo: {},
			extractList: [],
			jyPassword: '',
			fee: 0,
			address: '',
			remark: '',
			code: '',
			uType:2,
			extractType:[],
			phone:'',
			email:'',
			navTitle: this.$t('recordList.index3'),
		};
	},
	created() {},
	onShow() {
		uni.setNavigationBarTitle({
			title: this.navTitle
		})
	},
	onLoad() {
		//用户id
		var userInfo = uni.getStorageSync('userInfo');
		this.uid = userInfo.userId;
		this.phone = userInfo.mobile;
		this.email = userInfo.email;
		// console.log(this.phone,this.email,'1')
		// this.getfee()
		this.getExtract();
	},
	methods: {

		// 选择确权积分
		bindPickerChange: function(e) {
			let that = this;
			that.index = e.target.value;
			console.log(e.target.value,'21')
			that.sysmbol = that.typevar[that.index];
			console.log(that.sysmbol,'111')
			if (that.extractList) {
				that.sysmbolInfo = that.extractList.find(function(obj) {
					return obj.coin.name == that.sysmbol;
				});
			}
			that.charge = that.sysmbolInfo.coin.minTxFee;
			that.balance = that.sysmbolInfo.balance;
			this.coinChange()
		},
		// 选择通道
		bindPickerExtract:function(e){
			console.log(e, 'uu')
			
			let that=this;
			that.exIndex = e.target.value;
			let side = that.extractType[that.exIndex]
			if(side == "TRC20"){
				that.uType=2;
			}else if(side == "ERC20"){
				that.uType=0;
			}else if(side == "CSR"){
				that.uType=10;
			}


			
		},
		coinChange:function(){
			console.log(this.extractType, 'll')
			this.exIndex = 0;
			if(this.sysmbol == "CSR"){
				this.extractType = ["CSR"]
			}else if(this.sysmbol == "MSL"){
				this.extractType = ["MSL"]
			}else{
				console.log(this.sysmbol)
				this.extractType = ["ERC20","TRC20"]
			}
			let side = this.extractType[this.exIndex]
			if(side == "TRC20"){
				this.uType=2;
			}else if(side == "ERC20"){
				this.uType=0;
			}else if(side == "CSR"){
				this.uType=10;
			}
		},
		
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url: './record'
			});
		},
		openewm() {
			let that = this;
			uni.scanCode({
				success: function(res) {
					// console.log('条码类型：' + res.scanType);
					that.address = res.result;
					// console.log('条码内容：' + res.result);
				}
			});
		},
		//全部提取
		extractall() {
			this.num = this.balance;
		},
		//获取提确权积分信息
		async getExtract() {
			let that = this;
			try{
				let extract = await that.$request.post('/uc/asset/wallet', {
					header: {
						 'x-auth-token':uni.getStorageSync('token'),
						 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
					},
					data: {}
				});
				if (extract.data.code == 0) {
					let extractInfo = extract.data.data;
					that.extractList = extractInfo;
					that.typeArr = [];
					for (var i = 0; i < extractInfo.length; i++) {
						that.typeArr.push(extractInfo[i].coin.name);
						console.log(that.typeArr, 'tt')
					}
					for (var i of that.typeArr) {
						if (i === 'MSL') {
							that.typevar.push(i)
							that.extractType.push(i)
							that.sysmbol = i
						}
					}
					console.log(that.extractType, 'pp')
					// that.typevar.push(that.typeArr[1])
					// that.typevar.push(that.typeArr[2])
					// that.extractType.push(that.typeArr[0])
					console.log(that.typevar)
					
					// that.sysmbol = that.typeArr[0]

					if (that.extractList) {
						that.sysmbolInfo = that.extractList.find(function(obj) {
							return obj.coin.name == that.sysmbol;
						});
					}
					that.charge = that.sysmbolInfo.coin.minTxFee;
					that.balance = that.sysmbolInfo.balance;
					this.coinChange();
				} else {
					that.$api.msg(extract.data.message);
					uni.setStorageSync("hasLogin",false);
					uni.setStorageSync("userInfo","");
					// uni.clearStorageSync();
					setTimeout(()=>{
						uni.reLaunch({
							url:'/pages/public/login'
						})
					}, 200);
				}
			}catch(e){
				//TODO handle the exception
				console.log(e);
				// that.$api.msg('网络异常');
			}
			
		},
		//提确权积分申请
		async getextraction() {
			let that = this;
			try{
				if(that.sysmbol=='USDT'&&that.num<10){
					that.$api.msg(this.$t('extract.index15'));
					return
				}
				if(that.sysmbol=='CSR'&&that.num<0.1){
					that.$api.msg(this.$t('extract.index16'));
					return
				}
				that.$data.btndisabl = true;
				let extraction = await that.$request.post('/uc/withdraw/apply', {
					header: {
						 'x-auth-token':uni.getStorageSync('token'),
						 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
					},
					data: {
						jyPassword: that.jyPassword,
						unit: that.sysmbol,
						amount: that.num,
						fee: that.charge,
						address: that.address,
						remark: that.remark,
						code: that.code,
						uType:that.uType,
						googleCode: ''
					}
				});
				if (extraction.data.code == 0) {
					that.extractioninfo = extraction.data.data;
					that.$api.msg(extraction.data.message);
					that.$data.btndisabl = false;
					that.jyPassword = '';
					that.num = '';
					that.address = '';
					that.remark = '';
					that.code = '';
				} else if (extraction.data.message == '资金密码未设置' || extraction.data.message == 'Fund password not set') {
					that.$api.msg(extraction.data.message);
					that.$data.btndisabl = false;
					uni.navigateTo({
						url: '/pages/public/resetpaypsd'
					});
				} else {
					that.$api.msg(extraction.data.message);
					that.$data.btndisabl = false;
				}
			}catch(e){
				//TODO handle the exception
				console.log(e)
				// that.$api.msg('网络异常');
			}
			
		},
		//获取验证码
		async getcode() {
			let that = this;
			that.$data.btncode = true;
			let counter = 60;
			let timer = setInterval(() => {
				that.$data.text = counter + 's';
				counter--;
				if (counter == -1) {
					clearInterval(timer);
					that.$data.text = this.$t('findpsd.index8');
					that.$data.btncode = false;
				}
			}, 1000);
			let address = '';
			// if (!that.email){
			// 	address = '/uc/mobile/withdraw/code'
			// }else{
				
			// }
			
			let resultdata = await that.$request.post('/uc/mobile/withdraw/code', {
				header: {
					 'x-auth-token':uni.getStorageSync('token'),
					 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'en-US,en'
				},
				data: {}
			});
			if (resultdata.data.code == 0) {
				that.$api.msg(this.$t('findpsd.index9'));	
			} else {
				that.$api.msg(resultdata.data.message);
				that.$data.btncode = false;
			}
		},
		//提交
		payment() {
			if (this.num == '') {
				uni.showToast({
					title: this.$t('extract.index17'),
					duration: 1000,
					icon: 'none'
				});
				return;
			} else if (this.address == '') {
				uni.showToast({
					title: this.$t('extract.index18'),
					duration: 1000,
					icon: 'none'
				});
				return;
			} else if (this.code == '') {
				uni.showToast({
					title: this.$t('extract.index19'),
					duration: 1000,
					icon: 'none'
				});
				return;
			} else if (this.jyPassword == '') {
				uni.showToast({
					title: this.$t('extract.index20'),
					duration: 1000,
					icon: 'none'
				});
				return;
			} else {
				this.getextraction();
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background: #ffffff;
}

.extract_list {
	padding: 0 30upx;
	box-sizing: border-box;
	.balance {
		font-size: 24upx;
		color: rgba(51, 51, 51, 1);
	}
	.extract_num {
		padding: 32upx 0 4upx 0;
		box-sizing: border-box;
		border-bottom: 1px solid #e8e8e8;
		color: rgba(51, 51, 51, 1);
		font-size: 28upx;

		text {
			font-size: 32upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
		}
		.num_input {
			margin-top: 12upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.whole {
				font-size: 28upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #00a7eb;

				image {
					width: 30upx;
					height: 30upx;
				}
			}
		}
	}
}

.confirm {
	width: 630upx;
	height: 88upx;
	background: #00a7eb;
	border-radius: 4upx;
	margin: 80upx auto 0;
	font-size: 36upx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: rgba(255, 255, 255, 1);
	line-height: 88upx;
	text-align: center;
}

.input-placeholder {
	color: rgba(153, 153, 153, 1);
}
</style>
