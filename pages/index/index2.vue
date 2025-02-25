<template>
	<view class="container">
		<view class="mp-search-box">
			<view class="top-status_bar"></view>
			<view class="toptitle">
				<view @click="switchfn()" class="box-left-menu">
					<image :src="lang == 'zh'? icon_en : icon_zh"></image>
				</view>
				<view class="box-leftimg">
					<image :src="lang == 'zh'? logo_zh : logo_en" mode="widthFix"></image>
					<!-- <view class="box-txt">
							<view class="box-txta">
								{{$t('index.index1')}}
							</view>
							<view class="box-txtb">
								CONEYS
							</view>
						</view> -->
				</view>
				<view class="box-right-menu" @click="test">
					<image src="~@/static/rhinoImg/messageIco.png"></image>
				</view>
			</view>
		</view>

		<!-- 头部轮播 -->
		<view class="carousel-section">
			<swiper class="carousel" circular indicator-dots="true" interval="2000" duration="500" autoplay="true">
				<swiper-item style="border-radius: 20upx;" v-for="(item, index) in carouselList" :key="index"
					class="carousel-item" @click="navToDetailPage(item.linkUrl, item.status)">
					<image :src="item.url" />
				</swiper-item>
			</swiper>
			<view class="notice-box">
				<view class="stories" @tap="test">
					<view class="box-left-title">
						<image class="noticeIco" src="~@/static/rhinoImg/notice.png"></image>
					</view>
					<view class="notices">
						<view class="uni-padding-wrap">
							<view class="uni-swiper-msg">
								<view class="uni-swiper-msg-icon">
									<!-- <image class="ggimg" src="~@/static/images/noticex.png" mode="widthFix"></image> -->
								</view>
								<swiper class="gongdong" vertical="true" autoplay="true" circular="true"
									interval="3000">
									<swiper-item v-for="(item, index) in noticeList" :key="index">
										<view class="clamp">{{ item }}</view>
									</swiper-item>
								</swiper>
							</view>
						</view>
						<!-- <image class="notic_right" src="~@/static/images/ggright.png"></image> -->
					</view>
					<view class="box-right-more">{{$t('index.index2')}}&gt;&gt;</view>
				</view>
			</view>
		</view>

		<!-- 分类 -->
		<view class="typebox">
			<scroll-view scroll-x="true" class="scroll-view">
				<!-- <view class="typelist" @tap="navTo('/pages/property/index', 1)">
					<view class="typename">总投入(USDT)</view>
					<view class="typeNum">{{ totalBuyPirce | turn }}</view>	
				</view>
				<view class="typelist" @tap="navTo('/pages/property/index', 1)">
					<view class="typename">累计产出价值(USDT)</view>
					<view class="typeNum">{{ totalUsdtGain | turn }}</view>
				</view> -->
			</scroll-view>
			<scroll-view scroll-x="true" class="scroll-view">
				<view class="typelist" @tap="navTo('/pages/property/index', 1)">
					<view class="typename">{{$t('index.index3')}}</view>
					<!-- <view class="typeNum">
						{{ ethInfo.todayGain | tofixedNum }}
						<text>ETH</text>
					</view> -->
					<view class="typeNum">
						{{ xchInfo.todayGain | tofixedNum }}
						<text>MSL</text>
					</view>
				</view>
				<view class="typelist">
					<view class="typename">{{$t('index.index4')}}</view>
					<!-- <view class="typeNum">
						{{ ethInfo.yesterdayGain | tofixedNum }}
						<text>ETH</text>
					</view> -->
					<view class="typeNum">
						{{ xchInfo.yesterdayGain | tofixedNum }}
						<text>MSL</text>
					</view>
				</view>
			</scroll-view>
			<scroll-view scroll-x="true" class="scroll-view">
				<view class="typelist" @tap="navTo('/pages/user/myrecord', 0)">
					<view class="typename">{{$t('index.index5')}}</view>
					<!-- <view class="typeNum">
						{{ ethInfo.computerPower }}
						<text>ETH(M)</text>
					</view> -->
					<view class="typeNum">
						{{ xchInfo.computerPower }}
						<text>MSL(T)</text>
					</view>
				</view>
				<view class="typelist" @tap="navTo('/pages/property/index', 1)">
					<view class="typename">{{$t('index.index6')}}</view>
					<!-- <view class="typeNum">
						{{ ethInfo.totalGain | tofixedNum }}
						<text>ETH</text>
					</view> -->
					<view class="typeNum">
						{{ xchInfo.totalGain | tofixedNum }}
						<text>MSL</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 广告位 -->
		<view class="advertising">
			<!-- <image class="advertBg" src="~@/static/title.png"></image> -->
			<image class="advertBg" :src="lang == 'zh'? middle_zh : middle_en"></image>
		</view>
		<view class="productTitle">
			<image src="~@/static/img/titleL.png"></image>
			<text>{{$t('index.index7')}}</text>
			<image src="~@/static/img/titleR.png"></image>
		</view>
		<view class="productBox">
			<view class="productList" v-for="(item, index) in millList.slice(0, 1)" :key="index"
				@click="goDetial(item.id, item.sellPortion, item.totalPortion,item.sellendtime,item)">
				<view class="productInfo">
					<view class="productName">{{ item.name }}</view>
					<view class="productTime" v-if="item.buyStatus==0">
						<view class="triangle"></view>
						{{$t('index.index8')}}：{{ item.effectiveTime.substring(0, 11) }}
					</view>
					<view v-else class="poroverbox">
						<image :src="lang == 'zh'? iconOver_zh : iconOver_en"></image>
					</view>
				</view>
				<view class="productInfo">
					<view class="productInfo_list" v-if="item.itemApplyList.length>1">
						<view class="">
							{{$t('index.index9')}}：
						</view>
						<text class="productPrice" v-for="(itemlist,index2) in item.itemApplyList" :key="index2"
							:style="stylecss[index2]">
							<text
								v-if="item.itemApplyList.length != index2 +1">$</text>{{ itemlist.amount}}{{ itemlist.coin}}
							<text v-if="item.itemApplyList.length != index2 +1">+</text>

						</text>
					</view>
					<view class="productInfo_list" v-else>
						<view class="">
							{{$t('index.index9')}}：
						</view>
						<text class="productPrice" v-for="(itemlist,index2) in item.itemApplyList" :key="index2"
							:style="stylecss[index2]">
							${{ itemlist.amount}}{{ itemlist.coin}}
						</text>
					</view>

					<view class="productDeadline">
						{{$t('index.index10')}}
						<text class="deadline">{{ item.term }}{{$t('index.index16')}}</text>
					</view>
				</view>
				<view class="productInfo">
					<view>{{$t('index.index11')}}：{{item.managementFee}}</view>
					<view class="productFigure">
						{{$t('index.index12')}}
						<text class="figure">{{ item.powerUnit }}</text>
					</view>
				</view>
				<view class="productInfo">
					<view class="progress-box">
						<progress :percent="(item.sellPortion / item.totalPortion) * 100" border-radius="20px" active
							stroke-width="5" activeColor="#00a7eb" backgroundColor="#EAEAEA" />
					</view>
					<view class="progess-num">{{$t('index.index13')}}{{ (item.sellPortion / item.totalPortion) * 100 }}%
					</view>
				</view>
				<view class="productInfo">
					<view class="earnL">
						<view class="earnNum">{{ (item.yearRate * 100).toFixed(4) }}%</view>
						<view>{{$t('index.index14')}}</view>
					</view>
					<view class="earnR">
						<view class="earnNum">
							${{ item.staticOutput | turn }}/100/{{ item.powerUnit }}/{{$t('index.index16')}}</view>
						<view>{{$t('index.index15')}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="linebt"></view>
		<!-- 消息弹窗通知 -->
		<view class="nodesmask" v-show="nodemask">
			<view class="nodesbox">
				<view class="title">{{ sysmsg.title }}</view>
				<view class="content">{{ sysmsg.content }}</view>
				<view class="btndiv">
					<button class="btndivbutton" @tap="knowclick(sysmsg.noticeid)">{{$t('index.index17')}}</button>
				</view>
			</view>
		</view>
		<!-- 版本弹窗通知 -->
		<view class="nodesmask" v-show="updatemask">
			<view class="nodesbox">
				<view class="title">
					<text>{{$t('index.index18')}}</text>
					<uni-icons v-if="optional" class="trtxt" @tap="optionalclick" color="white" type="closefill"
						size="20"></uni-icons>
				</view>
				<view class="content">
					<view class="uptitle">{{$t('index.index19')}}：{{ fuinfo.version }}</view>
					<view class="uptitle">{{$t('index.index20')}}：</view>
					<view class="uptext">
						<!-- <view v-for="(item, index) in fuinfotxt" :key="index">{{ item }}</view> -->
						<view>{{ fuinfotxt }}</view>
					</view>
				</view>
				<view class="btndiv upbottomdiv">
					<button class="upbdright" @tap="comupdateclick">{{$t('index.index21')}}</button>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog :title="$t('index.index27')" :confirmText="$t('index.index28')"
				:cancelText="$t('index.index29')" mode="base" :content="content" :duration="2000" :before-close="true"
				@close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	import uniCountdown from '@/components/linnian-CountDown/uni-countdown.vue';
	import sum from '@/common/number.js';
	import lang from '@/i18n/index.js'
	export default {
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		components: {
			uniIcons,
			uniCountdown
		},
		data() {
			return {
				stylecss: ["color:#1940b9", "color:#00195A"],
				noticeList: [],
				indicatorDots: true,
				autoplay: false,
				interval: 2000,
				duration: 500,
				swiperCurrent: 0,
				carouselList: [],
				modules: [],
				hour: 0,
				minute: 0,
				second: 0,
				sysmsg: {},
				nodemask: false,
				updatemask: false,
				fuinfo: '',
				fuinfotxt: '',
				optional: true,
				typemodules: [],
				location: '',
				uid: '',
				id: '',
				timecount: 0,
				hourcount: 0,
				minutecount: 0,
				palystatus: true,
				ethInfo: '',
				xchInfo: '',
				yesterdayGain: 0,
				todayGain: 0,
				totalGain: 0,
				totalBuyPirce: 0,
				totalUsdtGain: 0,
				computerPower: 0,
				millList: [],
				content: '',
				icon_zh: require('@/static/img/icon_cn_1.png'),
				icon_en: require('@/static/img/icon_en_1.png'),
				logo_zh: require('@/static/img/top_logo_zh_1.png'),
				logo_en: require('@/static/img/top_logo_en_1.png'),
				middle_zh: require('@/static/img/middle_zh_1.png'),
				middle_en: require('@/static/img/middle_en_1.png'),
				iconOver_zh: require('@/static/rhinoImg/iconOver.png'),
				iconOver_en: require('@/static/rhinoImg/iconOver_en.png'),
				lang: 'zh',
			};
		},
		filters: {
			turn(v) {
				if (v) {
					return v.toFixed(4);
				} else {
					return 0.0;
				}
			},
			priceClose(v) {
				var m = v.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
				return v.toFixed(Math.max(0, (m[1] || '').length - m[2]));
			},
			timeStamp: function(value) {
				具体到时分秒;
				var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var year = date.getFullYear();
				var month = ('0' + (date.getMonth() + 1)).slice(-2);
				var sdate = ('0' + date.getDate()).slice(-2);
				var hour = ('0' + date.getHours()).slice(-2);
				var minute = ('0' + date.getMinutes()).slice(-2);
				var second = ('0' + date.getSeconds()).slice(-2);
				// 拼接
				var result = year + '-' + month + '-' + sdate + ' ' + hour + ':' + minute + ':' + second;
				// 返回
				return result;
			},
			tofixedNum(v) {
				if (v) {
					return v.toFixed(5);
				} else {
					return 0.0;
				}
			}
		},
		mounted() {
			let _this = this
			console.log(uni.getStorageSync('locale'))
			let language = uni.getSystemInfoSync().language
			//获取当前语言环境 判断当前语言是否与手机语言环境匹配
			uni.getSystemInfo({
				success: function(res) {
					if (language != 'zh-Hans-CN' && language != 'zh-CN') {
						if (lang.locale != 'en') {
							_this.content = _this.$t('index.index25'),
								_this.$refs.popup.open()
								uni.setLocale('zh-Hans');
						}
					} else {
						if (lang.locale != 'zh') {
							_this.content = _this.$t('index.index26'),
								_this.$refs.popup.open()
								
						}
					}
				}
			})
		},
		onLoad() {
			this.loadData();
			this.getmillList();

			var userInfo = uni.getStorageSync('userInfo');
			this.uid = userInfo.userId;
			let locale = uni.getStorageSync('locale')
			console.log(locale)
			//判断是否已获取系统语言
			if (locale) {
				if (locale == 'zh-CN,zh') {
					this.lang = 'zh'
					uni.setLocale('zh-Hans');
				} else {
					this.lang = 'en'
					uni.setLocale('en');
				}
			}

			// uni.getLocation({
			//默认wgs84返回gps坐标
			//gcj02返回国测局坐标,可以用于uni.openLocation的坐标
			// type: 'wgs84',
			//解析地址
			// geocode: true, //中文
			// success: data => {
			// 	if (data.address) {
			// 		this.location = data.address.city;
			// 		console.log(this.location);
			// 	}
			// },
			// fail: err => {
			// console.log(err);
			// this.$api.msg('获取位置失败!')
			// }
			// });


		},
		onShow() {
			this.tabLang()

		},
		onPullDownRefresh() {
			let that = this;
			that.loadData();
			that.getmillList();
		},
		methods: {
			...mapMutations(['logout']),
			navTo(url, index) {
				if (index == 0) {
					uni.navigateTo({
						url
					});
				} else {
					uni.switchTab({
						url
					});
				}
			},
			goDetial: function(id, sellPortion, totalPortion, time, item) {
				console.log(id, )
				if (item.buyStatus == 0) {
					uni.navigateTo({
						url: '/pages/product/productDetial?id=' + id
					});
				} else {
					this.$api.msg(this.$t('index.index22'));
				}
			},
			// 科学计数法转普通数字
			toNonExponential(num) {
				var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
				return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
			},
			// 分享
			async share(id, url) {
				let that = this;
				if (!this.hasLogin) {
					this.$api.msg(this.$t('index.index23'));
					return;
				} else {
					uni.navigateTo({
						url: url
					});
					let knowledgeshare = await this.$request.post('/media/knowledge/share', {
						data: {
							knowledgeId: id,
							uid: that.userInfo.userId
						}
					});
					if (knowledgeshare.data.base.code == '000000') {
						console.log(knowledgeshare.data.base.msg);
					}
				}
			},
			// 时间换算
			timecomputed(t) {
				this.hourcount = Math.floor(t / 3600);
				this.minutecount = Math.floor((t - this.hourcount * 3600) / 60);
				this.timecount = t - (this.hourcount * 60 + this.minutecount) * 60;
			},

			// 停止定时器
			async stoptime() {
				let result = await this.$request.post('/user/meditate/end', {
					data: {
						uid: this.uid,
						meditateId: this.id
					}
				});
				clearInterval(this.intervalId); //清除计时器
				this.intervalId = null; //设置为null
				this.palystatus = true;
			},

			itemClick(data) {
				// 跳转到内部窗口并且传递链接
				uni.navigateTo({
					url: `/pages/webview/webview?url=${data.forwardUrl}`
				});
			},
			//跳转到课程详情页
			classinfo(id, index) {
				uni.navigateTo({
					url: './courseReg'
				});
			},
			//能量提升跳转
			getcapacity() {
				uni.navigateTo({
					// ? 后面加要传的参数， 多个参数用 & 隔开
					url: './capacity'
				});
			},
			// 下载
			comupdateclick() {
				plus.runtime.openURL(this.$data.fuinfo.downloadUrl); //打开web下载安装
			},
			// 关闭升级弹窗
			optionalclick() {
				this.$data.updatemask = false;
			},
			// 关闭弹窗
			async knowclick(id) {
				let that = this;
				if (that.hasLogin) {
					let resdata = await this.$request.post('/user/updateSystemNoticeIsRead', {
						data: {
							base: {
								appId: '001',
								channels: '001',
								ver: '1.1.5',
								clientVer: '1.0',
								apn: 'wifi',
								deviceId: '1233eedds2112',
								uid: that.userInfo.userId,
								valat: 22.332112,
								lalong: 12.332112,
								platform: 'IOS',
								platformVer: '8',
								resolution: '960*640',
								deviceType: 'P6',
								carrier: 'china mobile',
								city: '合肥',
								brand: 'huawei'
							},
							param: {
								noticeId: id
							}
						}
					});
					if (resdata.data.base.code == '000000') {
						that.$data.nodemask = false;
					} else {
						that.$api.msg(resdata.data.base.msg);
					}
				}
			},
			// 头部分类
			gocatelist(index, id) {
				uni.navigateTo({
					url: `../product/list?index=${index}&id=${id}`
				});
			},
			// 获取首页盲盒列表
			async getmillList() {

				// 获取banner轮播
				let millInfo = await this.$request.post('/computer-power-api/chanjuan/itemList', {
					header: {
						'x-auth-token': uni.getStorageSync('token'),
						'Accept-Language': uni.getStorageSync('locale') ? uni.getStorageSync('locale') :
							'zh-CN,zh',
					},
					data: {
						coin: '',
						term: '',
						pageNo: 1,
						pageSize: 10
					}
				});
				console.log(millInfo);
				if (millInfo.data.code == 0) {
					this.millList = millInfo.data.data.content;
					let nowtime = new Date().getTime();
					this.millList.forEach((item, index) => {
						if (new Date(item.sellEndTime).getTime() > nowtime) {
							item.sellendtime = false;
						} else {
							item.sellendtime = true;
						}
					});
				} else {
					this.$api.msg(millInfo.data.message);
				}
			},
			async loadData() {
				// console.log(uni.getStorageSync('locale'),'111')
				let that = this;
				try {
					uni.showLoading({
						title: this.$t('index.index24'),
						mask: true
					});
					// 获取banner轮播
					let bannerData = await this.$request.post('/uc/ancillary/system/advertise', {
						header: {
							'x-auth-token': uni.getStorageSync('token'),
							'Accept-Language': uni.getStorageSync('locale') ? uni.getStorageSync('locale') :
								'zh-CN,zh',
						},
						data: {
							sysAdvertiseLocation: 0
						}
					});
					that.carouselList = bannerData.data.data;
					// 获取公告列表
					let noticeData = await that.$request.post('/uc/announcement/page', {
						header: {
							'x-auth-token': uni.getStorageSync('token'),
							'Accept-Language': uni.getStorageSync('locale') ? uni.getStorageSync('locale') :
								'zh-CN,zh',
						},
						data: {
							pageNo: 1,
							pageSize: 5
						}
					});
					that.noticeList = []

					let noticeInfo = noticeData.data.data.content;
					for (let i = 0; i < noticeInfo.length; i++) {
						that.noticeList.push(noticeInfo[i].title);
					}
					// 获取首页数据统计
					let indexInfo = await that.$request.post('/computer-power-api/chanjuan/index', {
						header: {
							'x-auth-token': uni.getStorageSync('token'),
							'Accept-Language': uni.getStorageSync('locale') ? uni.getStorageSync('locale') :
								'zh-CN,zh',
						},
						data: {}
					});
					if (indexInfo.data.code == 0) {
						// that.yesterdayGain = indexInfo.data.data.yesterdayGain;
						// that.todayGain = indexInfo.data.data.todayGain;
						// that.computerPower = indexInfo.data.data.computerPower;
						// that.totalGain = indexInfo.data.data.totalGain;

						that.totalBuyPirce = indexInfo.data.data.all_totalBuyPirce;
						that.totalUsdtGain = indexInfo.data.data.all_totalUsdtGain;
						that.ethInfo = indexInfo.data.data.ETH;
						that.xchInfo = indexInfo.data.data.MSL;
					} else {
						that.$api.msg(indexInfo.data.message);
						that.logout();
						uni.setStorageSync('hasLogin', false);
						uni.setStorageSync('userInfo', '');
						// uni.clearStorageSync();
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/public/login'
							});
						}, 200);
					}
					uni.hideLoading();

					// 版本更新
					console.log('更新')
					let forcedUpdateinfo = uni.getStorageSync('forcedUpdate');
					if (forcedUpdateinfo.data.code == 0) {
						that.$data.fuinfo = forcedUpdateinfo.data.data;
						// let fuinfotxtlist = forcedUpdateinfo.data.data.upgradeDesc.split('\n');
						that.$data.fuinfotxt = forcedUpdateinfo.data.data.remark;

						// console.log(plus.runtime.version);
						let verval = that.versionStringCompare('1.1.5', forcedUpdateinfo.data.data.version);
						console.log(verval, 'verval')
						if (verval == -1) {
							that.$data.updatemask = true;
							// if (1 == parseInt(forcedUpdateinfo.data.data.type)) {
							that.$data.optional = true;
							console.log(that.$data.fuinfotxt)
							// } else {
							// 	that.$data.optional = false;
							// }
						} else {
							that.$data.updatemask = false;
						}
					} else {
						console.log(forcedUpdateinfo.data.message);
						that.$data.updatemask = false;
						that.$data.optional = false;
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e);
					// that.$api.msg('网络异常');
				}
			},
			//版本号比较
			versionStringCompare(preVersion, lastVersion) {
				var sources = preVersion.split('.');
				var dests = lastVersion.split('.');
				var maxL = Math.max(sources.length, dests.length);
				var result = 0;
				for (let i = 0; i < maxL; i++) {
					let preValue = sources.length > i ? sources[i] : 0;
					let preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
					let lastValue = dests.length > i ? dests[i] : 0;
					let lastNum = isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue);
					if (preNum < lastNum) {
						result = -1;
						break;
					} else if (preNum > lastNum) {
						result = 1;
						break;
					}
				}
				return result;
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},

			//底部导航栏语言切换
			tabLang() {
				uni.setTabBarItem({
					index: 0,
					text: this.$t('tab.index1'),
				})
				uni.setTabBarItem({
					index: 1,
					text: this.$t('tab.index2'),
				})
				uni.setTabBarItem({
					index: 2,
					text: this.$t('tab.index3'),
				})
				uni.setTabBarItem({
					index: 3,
					text: this.$t('tab.index4'),
				})
			},

			//事件切换中英文
			switchfn() {
				uni.removeStorageSync('locale')
				if (this.lang == 'zh') {
					lang.locale = 'en'
					uni.setStorageSync('locale', 'en-US,en')
					this.lang = 'en'
				} else {
					lang.locale = 'zh'
					uni.setStorageSync('locale', 'zh-CN,zh')
					this.lang = 'zh'
				}
				this.tabLang()
				this.loadData();
				this.getmillList();
			},


			//弹窗切换语言
			confirm() {
				uni.removeStorageSync('locale')
				if (this.content == this.$t('index.index25')) {
					lang.locale = 'en'
					this.lang = 'en'
					uni.setStorageSync('locale', 'en-US,en')
				} else {
					lang.locale = 'zh'
					this.lang = 'zh'
					uni.setStorageSync('locale', 'zh-CN,zh')
				}
				this.$refs.popup.close()
				//切换语言清除数据 刷新数据
				this.tabLang()
				this.loadData();
				this.getmillList();
			},

			//关闭多语言提示弹框
			close() {
				this.$refs.popup.close()
			},
			//详情页
			navToDetailPage(id, type) {
				console.log(id, type, '数据')
				if (type === 1 || type === -1) {
					uni.navigateTo({
						url: `/pages/product/product?id=${id}`
					});
				}
			},
			test() {
				uni.navigateTo({
					url: './headlines'
				});
			}
		}
	};

</script>

<style scoped lang="scss">
	.container {
		background: #f5f5f5;
	}

	.mp-search-box {
		background: #ffffff;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		box-sizing: border-box;

		.toptitle {
			display: flex;
			// align-items: center;
			justify-content: space-between;
			margin: 10upx 4% 20upx;
		}

		.box-leftimage {
			padding-top: 10rpx;
			box-sizing: border-box;
			// width: 95%;
			// width: 200upx;
			// text-align: center;
			// display: flex;
			// justify-content: space-around;
			// .box-txt{
			// 	// padding-left: 22upx;

			// 	.box-txta{
			// 		color: #987200;
			// 		text-align: center;
			// 		font-size: 32upx;
			// 	}
			// 	.box-txtb{
			// 		color: #C29C2A;
			// 		font-size: 16upx;
			// 	}
			// }



			image {
				width: 140upx;
				// vertical-align: middle;
			}
		}

		.box-left-menu {
			padding-top: 10rpx;
			box-sizing: border-box;

			image {
				width: 50rpx;
				height: 50rpx;
			}
		}

		.box-right-menu {
			padding-top: 10rpx;
			box-sizing: border-box;

			image {
				width: 40upx;
				height: 40upx;
			}
		}
	}

	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: var(--status-bar-height);
		margin-top: 108upx;
		background: #ffffff;
		border-bottom: 20upx solid #f7f7f7;
		border-bottom-left-radius: 60upx;
		border-bottom-right-radius: 60upx;

		.carousel {
			height: 300upx;
			width: 92%;
			margin: 0 4%;
			border-radius: 20upx;

			// box-shadow: 0 5px 5px 0 #a6c6ee;
			.carousel-item {
				border-radius: 20upx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 20upx;
				}
			}
		}
	}

	//分类
	.typebox {
		background-color: #fff;
		border-bottom: 20upx solid #f7f7f7;
		padding: 2% 4%;

		.scroll-view {
			margin: 3% 0;
			white-space: nowrap;
		}

		scroll-view [style*='overflow']::-webkit-scrollbar {
			display: none;
		}

		.typelist {
			text-align: center;
			padding: 3% 0;
			display: inline-block;
			width: 48%;
			background: #F8F8F8;
			border-radius: 20upx;

			image {
				width: 90upx;
				height: 90upx;
				margin-bottom: 2upx;
			}

			.typename {
				margin-bottom: 10upx;
				font-size: 24upx;
				font-weight: 600;
			}

			.typeNum {
				font-size: 32upx;
				font-weight: 600;
				color: #00a7eb;
			}

			text {
				margin-left: 8upx;
				font-size: 28upx;
			}

			&:first-child {
				margin-right: 4%;
			}
		}
	}

	// 广告位
	.advertising {
		width: 92%;
		margin: 0 auto 2%;

		.advertBg {
			width: 100%;
			height: 140rpx;
		}
	}

	// 头条、行情排名
	.stories {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 2% 4%;
		position: relative;
		border-bottom-left-radius: 40rpx;
		border-bottom-right-radius: 40rpx;

		.box-left-title {
			font-size: 30upx;
			font-weight: bolder;
			position: relative;
			padding-left: 1%;
			padding-top: 4upx;

			// &::before {
			// 	content: '';
			// 	position: absolute;
			// 	left: 0;
			// 	bottom: 0;
			// 	width: 6upx;
			// 	height: 30upx;
			// 	background: linear-gradient(to bottom, #fcd5b4, #fd852f);
			// }
			.noticeIco {
				margin-top: 10%;
				width: 40upx;
				height: 40upx;
			}
		}

		.box-right-more {
			font-size: 24upx;
			color: #cdcdcd;
		}
	}

	//头条
	.notice-box {
		background: #ffffff;
		border-bottom-left-radius: 40rpx;
		border-bottom-right-radius: 40rpx;

		//说明
		.live {
			padding: 0 4% 6%;
			position: relative;

			image {
				width: 100%;
				height: 100%;
				border-radius: 10upx;
			}

			.right-doc {
				position: absolute;
				right: 9%;
				bottom: 20%;
				background: #ffffff;
				border-radius: 20upx;
				padding: 0 2%;
			}
		}
	}

	.productTitle {
		width: 100%;
		background-color: #fff;
		text-align: center;
		padding: 3% 0;

		image {
			width: 44rpx;
			height: 8rpx;
			margin: 0 3%;
			vertical-align: middle;
		}
	}

	// 云抽奖推荐产品
	.productBox {
		margin-top: 3%;
		margin-bottom: 5%;
		width: 100%;

		.productList {
			margin-top: 3%;
			width: 100%;
			background: #fff;
			padding: 3% 0;

			.productInfo {
				width: 100%;
				display: flex;
				justify-content: space-between;
				padding: 1% 0 1% 4%;
				font-size: 12px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;

				.productName {
					font-size: 16px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #333333;
				}

				.productTime {
					background: #1940b9;
					width: 45%;
					height: 50upx;
					line-height: 50upx;
					text-align: center;
					position: relative;
					font-size: 12px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #ffffff;

					.triangle {
						width: 0;
						height: 0;
						border-top: 26upx solid transparent;
						border-bottom: 26upx solid transparent;
						border-left: 26upx solid #fff;
						position: absolute;
						top: 0;
						left: -1px;
					}
				}

				.poroverbox {
					position: relative;
					width: 152upx;
					height: 94upx;
					margin: 0% 4% 0 0;

					image {
						width: 152upx;
						height: 94upx;
						vertical-align: middle;
						position: absolute;
						right: 0;
						top: 25%;
					}
				}

				.productPrice {
					font-size: 14px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #e7ad05;
				}

				.productDeadline {
					width: 50%;
					text-align: left;
					font-size: 12px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					line-height: 70upx;

					.deadline {
						display: inline-block;
						margin-left: 20upx;
						width: 88upx;
						height: 36upx;
						line-height: 36upx;
						text-align: center;
						background: #ACDCF7;
						border-radius: 28upx;
						font-size: 12px;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #0050C1;
					}
				}

				.productFigure {
					width: 50%;
					text-align: left;

					.figure {
						display: inline-block;
						margin-left: 20upx;
						font-size: 12px;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #333333;
					}
				}

				.progress-box {
					width: 40%;
					padding-top: 2%;
				}

				.progess-num {
					width: 50%;
					text-align: left;
				}

				.earnL {
					width: 50%;
				}

				.earnR {
					width: 50%;
					text-align: left;
				}

				.earnNum {
					color: #00a7eb;
				}
			}
		}
	}

	.linebt {
		width: 100%;
		height: 20upx;
		background-color: #f5f5f5;
	}

	/* 弹窗 */
	.nodesmask {
		position: fixed;
		background: rgba(0, 0, 0, 0.5);
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		z-index: 10;

		.nodesbox {
			background-color: #ffffff;
			width: 85%;
			border-radius: 25upx;
			position: relative;
			left: 8%;
			top: 20%;
			height: 600upx;

			.title {
				height: 100upx;
				text-align: center;
				line-height: 100upx;
				font-weight: bolder;
				color: #fff;
				background-color: #e7ad05;
				border-top-left-radius: 25upx;
				border-top-right-radius: 25upx;

				.trtxt {
					position: absolute;
					right: 5%;
				}
			}

			.content {
				padding: 5% 5%;
				height: 350px;
				overflow: hidden;
				overflow-y: auto;
				font-size: 30upx;
				text-indent: 2em;
				line-height: 44upx;
			}

			.btndiv {
				width: 100%;
				text-align: center;
				position: absolute;
				bottom: 5%;

				.btndivbutton {
					height: 80upx;
					width: 50%;
					background-color: #e7ad05;
					color: #fff;
					border: 1px solid;
					border-radius: 60upx;
					padding: 0 5%;
				}
			}
		}

		.uptitle {
			line-height: 60upx;
			text-indent: 1rem;
		}

		.upbottomdiv {
			display: flex;
			padding: 5%;

			.upbdleft {
				height: 40px;
				width: 45%;
				border-radius: 30px;
				padding: 0 5%;
				font-size: 30upx;
				background: #fff;
				color: #000;
				border: 1px solid #eee;
			}

			.upbdright {
				height: 40px;
				width: 85%;
				background-color: #e7ad05;
				color: #fff;
				border: 1px solid;
				border-radius: 30px;
				padding: 0 5%;
				font-size: 30upx;
			}
		}
	}

	// 公告
	.notices {
		width: 75%;
		position: absolute;
		left: 11%;
		top: 26upx;
		color: #666666;

		// z-index: 99;
		.gongdong {
			height: 20px;

			.clamp {
				width: 90%;
				font-size: 13px;
				color: #999;
			}
		}
	}

</style>