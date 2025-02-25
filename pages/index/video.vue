<template>
	<view class="video">
		<view class="header">
			<view class="headimg"><image  :src="typeinfo.image" mode=""></image></view>
			<view class="hright">
				<view class="htitle">	{{typeinfo.title}}</view>
				<view class="hcontent">{{typeinfo.remark}}</view>
				<view class="hfoot">
					<view class="himg"><image style="width: 20px;height: 20px;" src="../../static/120.png" mode=""> </image>七星学院</view>
					<view class="htime">两天一夜</view>
				</view>
			</view>
		</view>
		<!-- <view class="courseTabBox">
			<view  class="courseTab">{{typeinfo.level==1?'初级课程':typeinfo.level==2?'中级课程':'高级课程'}}</view> -->
			<!-- <view class="courseTab" :class="{onTab: courseType =='1'}" @click="cutType(1)">高级课程</view> -->
		<!-- </view> -->
		<view class="video_play">
			<!-- <video id="myVideo" src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4"
			 controls :autoplay="videoautoplay" :show-center-play-btn="showcplay"></video> -->
			<!-- <view class="video_pic">
				<image :src="typeinfo.image" mode=""></image>
			</view> -->
			<view class="" style="display: flex;font-size: 32upx;">
				<view class="" style="width: 50%;text-align: center;">报名费：{{typeinfo.amount}}USDT</view>				
					<view class="" style="width: 50%;text-align: center;color: gray;text-decoration: line-through;">原价：{{typeinfo.originalPrice}}USDT</view>		
			</view>
			<!-- <view class="video_bot">
				<view class="video_black" @click="navidataBack()">
					<image src="../../static/img/btn_back_normal.png" mode=""></image>
				</view> -->
				<!-- <navigator url="../set/invite" hover-class="navigator-hover">
					 	<image src="../../static/img/btn_back_normal.png" mode=""></image>
					 </navigator> -->
				<!-- <view class="video_share" @click="share('../set/subscribe')"> -->
					<!-- <web-view :src="typeinfo.shareUrl"></web-view> -->
			<!-- 		报名记录
				</view>
			</view> -->

		</view>
		
		<view class="suggest">
			<view class="suggest_title">
				上课时间：
			</view>
			<view class="suggest_name">
				<view class="name_left">
					{{typeinfo.startTime | timeStamp}} - {{typeinfo.endTime | timeStamp}}
				</view>
				<!-- <view class="name_right">
					{{typeinfo.endTime | timeStamp}}
				</view> -->
			</view>
		<!-- 	<view class="suggest_time">
				{{endtime}}
			</view> -->
			<!-- <view class="suggest_time" v-else>
				开课时间：
			</view> -->

		</view>
		
		<view class="suggest" style="margin-top: 20upx;">
			<view class="suggest_title">
				初级班课程内容：
			</view>
			<view class="suggest_name">
				<view class="name_left">
					<jyf-parser :html="typeinfo.content"></jyf-parser>
				</view>			
			</view>			
			<view class="suggest_title">
				课程报名表：
			</view>
			<view class="suggest_name">
				<view class="name_left" style="font-size: 12px;">
					以下信息为必填项，请填写真实信息以免导致报名不成功。
				</view>			
			</view>
			<view class="news">
				<!-- <view class="news_title">
					报名信息
				</view> -->
				<ul>
					<li style="border-top: none;">
						<view class="news_name">
							姓名
						</view>
						<view class="news_input">
							<input type="text" v-model="username" value="" placeholder="请输入您的姓名" />
						</view>
					</li>
					<li>
						<view class="news_name">
							手机号
						</view>
						<view class="news_input">
							<input type="mobile" v-model="mobile" value="" placeholder="请输入您的手机号" />
						</view>
					</li>
					<li>
						<view class="news_name">
							身份证
						</view>
						<view class="news_input">
							<input type="number" v-model="wechart" value="" placeholder="请输入您的身份证" />
						</view>
					</li>
					<li>
						<view class="news_name">
							邮箱
						</view>
						<view class="news_input">
							<input type="text" v-model="email" value="" placeholder="请输入您的邮箱" />
						</view>
					</li>
					<li style="border-top: none;">
						<view class="news_name">
							推荐人
						</view>
						<view class="news_input">
							<input type="number" maxlength="11" v-model="tuipeople" value="" placeholder="请输入推荐人手机号" />
						</view>
					</li>
					<!-- <li>
						<view class="news_name">
							金额
						</view>
						<view class="news_input">
							<text>${{typeinfo.amount}}</text>
						</view>
					</li> -->
				</ul>
				<view class="suggest_title">
					课程须知：
				</view>
				<view class="suggest_name">
					<view class="name_left" style="font-size: 12px;">
						<jyf-parser :html="htmlNodes.content"></jyf-parser>
					</view>			
				</view>
				<view class="" style="margin-bottom: 100px;">
					<view class="" style="display: flex;justify-content: center;width: 100%;">
							<image style="width: 300px;height: 124px;margin: 0 auto;" src="../../static/qxxy.png" mode=""></image>
					</view>
				
					<view class="register-section">	<radio @click="checkradio"	
								style="transform: scale(0.7);" value="" :checked="ischeched" /><text></text>  我已阅读知晓并同意全部内容						
						<text @click="navtoagree(3)">《免责声明》</text>
						<text @click="navtoagree(4)">《学员风险告知书》</text>
					</view>	
				</view>
				<!-- <view class="payment" @click="payment()">
					确认支付报名
				</view> -->
				
			</view>
		</view>
		
		<view class="" style="background-color: white;position: fixed;bottom: 0;border-top: 1px solid  #f0f0f0;width: 100%;padding: 20px;">
			<button v-if="typeinfo.signUpFlag==0" type="default" style="background-color: #FD852F;border-radius: 40px;color: white;font-weight: 600;" @click="payment()">确定</button>
			<button v-else type="default" style="background-color: #c8c8c8;border-radius: 40px;color: white;font-weight: 600;">已报名</button>
		</view>
		<!-- <view class="course"> -->
			<!-- <jyf-parser :html="htmlNodes"></jyf-parser> -->
			<!-- 			<view class="course_type">
				<ul>
					<li class="active">课程介绍</li>
					<li>课程列表</li>
				</ul>
			</view>
			<view class="course_content">
				<ul>
					<li>
						<view class="course_title">
							1.添加道医老师领取「祝由术入门」课程
						</view>
						<view class="course_tipl">
							<view class="course_time">
								<image src="../../static/img/shichang.png" mode=""></image>
								<text>47:19</text>
							</view>
							<view class="course_play">
								<image src="../../static/img/play.png" mode=""></image>
								<text>正在播放</text>
							</view>
						</view>
					</li>
					<li>
						<view class="course_title">
							1.添加道医老师领取「祝由术入门」课程
						</view>
						<view class="course_tipl">
							<view class="course_time">
								<image src="../../static/img/shichang.png" mode=""></image>
								<text>47:19</text>
							</view>
							<view class="course_play">
								<image src="../../static/img/play.png" mode=""></image>
								<text>正在播放</text>
							</view>
						</view>
					</li>
					<li>
						<view class="course_title">
							1.添加道医老师领取「祝由术入门」课程
						</view>
						<view class="course_tipl">
							<view class="course_time">
								<image src="../../static/img/shichang.png" mode=""></image>
								<text>47:19</text>
							</view>
							<view class="course_play">
								未上线
							</view>
						</view>
					</li>
					<li>
						<view class="course_title">
							1.添加道医老师领取「祝由术入门」课程
						</view>
						<view class="course_tipl">
							<view class="course_time">
								<image src="../../static/img/shichang.png" mode=""></image>
								<text>47:19</text>
							</view>
							<view class="course_play">
							</view>
						</view>
					</li>
				</ul>
			</view>
 -->
		<!-- </view>	 -->
		<!-- <view class="enroll" :class="typeinfo.signUpFlag!=0?'light':'dark'">
			
			<view class="go_enroll" v-show="typeinfo.signUpFlag==0" @click="enroll()">
				我要报名
			</view>
			<view class="go_enroll" v-show="typeinfo.signUpFlag!=0" >
				已报名
			</view>
			<view class="enro">
				（{{typeinfo.signUpCount}}人已报名）
			</view>
		</view> -->

		<!-- 支付报名 newpopus控制是否开启弹窗 -->
		<view class="mask" v-show="newpopus">
			<view class="area" @click="downmask">
				
			</view>
			<view class="news">
				<view class="news_title">
					报名信息
				</view>
				<ul>
					<li>
						<view class="news_name">
							姓名
						</view>
						<view class="news_input">
							<input type="text" v-model="username" value="" placeholder="请输入您的姓名" />
						</view>
					</li>
					<li>
						<view class="news_name">
							手机号
						</view>
						<view class="news_input">
							<input type="mobile" v-model="mobile" value="" placeholder="请输入您的手机号" />
						</view>
					</li>
					<li>
						<view class="news_name">
							微信
						</view>
						<view class="news_input">
							<input type="text" v-model="wechart" value="" placeholder="请输入您的微信" />
						</view>
					</li>
					<li>
						<view class="news_name">
							邮箱
						</view>
						<view class="news_input">
							<input type="text" v-model="email" value="" placeholder="请输入您的邮箱" />
						</view>
					</li>
					<li>
						<view class="news_name">
							金额
						</view>
						<view class="news_input">
							<text>${{typeinfo.amount}}</text>
						</view>
					</li>
				</ul>
				<view class="payment" @click="payment()">
					确认支付报名
				</view>
			</view>
		</view>


		<!-- 报名成功 success控制是否开启弹窗-->
		<view class="mask" v-show="success">
			<view class="success">
				<view class="success_enroll">
					<image src="../../static/icon_selected.png" mode=""></image>
					<text>报名成功</text>
				</view>
				<view class="success_info">
					预约详情请前往
					<text>(自在-预约报名)</text>
					查看
				</view>
				<view class="success_bot" @click="close">
					我知道了
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue'
	export default {
		data() {
			return {
				sign:1,
				videoautoplay: false,
				showcplay: false,
				newpopus: false,
				success: false,
				typeinfo: {},
				username: '',
				mobile: '',
				wechart: '',
				tuipeople:'',
				email:'',
				htmlNodes: '',
				uid: '',
				classid: '',
				courseType:0,
				courseId:'1255704338238164992',
				moduleId:'',
				level:1,
				times:'',
				endtime:'',
				ischeched:false,
				money:'',
				sublist:["初级课程","高级课程"]//课程分类
			}
		},
		components: {
			jyfParser
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		created() {
			
		},
		mounted() {
			

		},
		onLoad(option) {
			//获取用户id
			var id = uni.getStorageSync("userInfo");
			this.uid = id.userId;
			this.courseId=option.id
			this.level=option.level
			this.sign=option.sign
			// this.getclassinfo(1);
			// this.moduleId=option.moduleId;
			uni.$on("notice",()=>{
				this.success=true
			})
			this.aboutus()
		},
		onShow() {
			this.getclassinfo(1);
		},
		methods: {
			// cutType(cutType){
			// 	this.courseType=cutType;
			// 	if(cutType=='0'){
			// 		this.courseId='1255704338238164992';
			// 	}else{
			// 		this.courseId='1354355009129717760';
			// 	}
			// 	this.getclassinfo(this.moduleId);
			// },
			checkradio(){
				this.ischeched=!this.ischeched			
			},
			navtoagree(type){
				uni.navigateTo({				
					url:'../public/agremment?type='+type
				})
			},
			downmask(){
				this.newpopus = false
			},
			navidataBack() {
				uni.navigateBack();
			},
			async aboutus(){
				let res = await this.$request.post('flash-channel/ruleDescription', {
					data:{
						"base":{
							"uid": this.userInfo.userId,
						},
						"param":{
							"id":7 
						}
					}
				});
				if(res.data.base.code=="000000"){
					this.htmlNodes=res.data.data;
				}else{
					console.log(res.data.base.msg);
				}
			},		
			// 分享
			async share(url) {
				let that = this;
				uni.navigateTo({
					url: url
				});
				let knowledgeshare = await this.$request.post('/media/knowledge/share', {
					"data": {
						"knowledgeId": id,
						"uid": that.userInfo.userId,
					}
				});
				if(knowledgeshare.data.base.code == "000000"){
					console.log(knowledgeshare.data.base.msg);
				}
			},
			//课程详情模块
			async getclassinfo(id) {
				console.log(id)
				let classinfo = await this.$request.post('/home/course/courseList', {
					"data": {
						// "type": 1,//分类 id
						"uid": this.uid,
						"sequence":0,//分页时间戳
						"level":this.level ,//课程等级
						"courseId": this.courseId,
						// "type": id,
						// "courseId": this.courseId,
						// // "courseId": '1369605371285499904',
					}
				});
				this.typeinfo = classinfo.data.data[0];
				this.times=this.$api.format(classinfo.data.data[0].startTime)
				this.classid = this.typeinfo.id
				this.htmlNodes = this.typeinfo.content;
				console.log(this.classid)
			},

			//控制报名信息弹窗
			enroll() {

				this.newpopus = true


			},
			//确认支付
			payment() {
				if (this.username == '') {
					uni.showToast({
						title: '请输入姓名',
						duration: 1000,
						icon: 'none'
					});
				} else if (this.mobile == '') {
					uni.showToast({
						title: '请输入手机号',
						duration: 1000,
						icon: 'none'
					});
				} else if (this.wechart == '') {
					uni.showToast({
						title: '请输入微信号',
						duration: 1000,
						icon: 'none'
					});
				}else if (this.tuipeople == '') {
					uni.showToast({
						title: '请输入推荐人',
						duration: 1000,
						icon: 'none'
					});
				}else if (this.email == '') {
					uni.showToast({
						title: '请输入邮箱号',
						duration: 1000,
						icon: 'none'
					});
				}else if (this.ischeched == false) {
					uni.showToast({
						title: '请勾选已阅读',
						duration: 1000,
						icon: 'none'
					});
				} else {
					let that=this
					uni.showModal({
					    title: '',
					    content: '报名您已确认内容符合自身需求，自愿购买课程服务，暂不支持退款',
					    success: function (res) {
					        if (res.confirm) {
					           	that.getbuyclass();
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				
					this.newpopus = false,
					this.signedup = false
				}

			},
			//购买课程
			async getbuyclass() {
				let buyinfo = await this.$request.post('/home/course/save', {
					"data": {
						"uid": this.uid,
						"courseId": this.classid,
						"username": this.username,
						"mobile": this.mobile,
						"email":this.email,
						"wechart": this.wechart,
						"upUser":this.tuipeople

					}
				});
				if (buyinfo.data.base.code == '000000') {
					this.buyclass = buyinfo.data.data;
					// console.log(this.buyclass)
					// var Info={
					// 	amount:this.buyclass.amount,
					// 	orderNo:this.buyclass.orderNo,
					// 	id:this.buyclass.id
					// };
					if(this.typeinfo.amount > 0) {
						uni.setStorageSync("shoptype",2);
						// uni.setStorageSync("coamount",this.buyclass.amount);						
						uni.setStorageSync("coorderno",this.buyclass.orderNo.toString());
						uni.setStorageSync("coorderid",this.buyclass.orderNo.toString());
						uni.setStorageSync("courseId",this.classid);
						this.money=this.buyclass.amount
						uni.navigateTo({
							url:'../money/pay?money='+this.money
						})
						// uni.$emit('notice')
						// console.log(Info)
						this.newpopus = false;
					} else {
						this.success = true;
					}
					
					
				} else {
					uni.showToast({
						title: buyinfo.data.base.msg,
						duration: 1000,
						icon: 'none'
					})
				}

			},
			//关闭报名成功
			close() {
				this.success = false
			},


		},
		filters: {
			// timeStamp: function(value) {
			// 	if (!value) return '';
			// 	var now = new Date(value);
			// 	var year = now.getFullYear();
			// 	var month = now.getMonth() + 1;
			// 	if (month < 10) {
			// 		month = '0' + month
			// 	}
			// 	var date = now.getDate();
			// 	if (date < 10) {
			// 		date = '0' + date
			// 	}
			// 	return year + "-" + month + "-" + date
			// },
			timeStamp: function(value) { //具体到时分秒
				var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var year = date.getFullYear();
				var month = ("0" + (date.getMonth() + 1)).slice(-2);
				var sdate = ("0" + date.getDate()).slice(-2);
				var hour = ("0" + date.getHours()).slice(-2);
				var minute = ("0" + date.getMinutes()).slice(-2);
				var second = ("0" + date.getSeconds()).slice(-2);
				// 拼接
				var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second;
				// 返回
				return result;
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: rgba(240, 240, 240, 1);
	}

	li {
		list-style: none;
	}

	ul {
		padding: 0;
	}

	.header {
		display: flex;
		padding-top: var(--status-bar-height);
		background-color: white;
		padding: 20upx;
		.headimg{
			width:110px;
			height: 84px;
			image{
				width: 100%;
				height: 100%;
				border-radius: 15upx;
			}
		}
		.hright{
			width: 100%;
			font-size: 16px;
			padding: 0 10px;
			.htitle{
				font-weight: 600;
			}
			.hcontent{
				color: gray;
				margin: 15upx 0;
				
			}
			.hfoot{
				width: 100%;
				display: flex;
				font-size: 14px;
				color: #444444;
				.himg{
					width: 80%;
					font-size: 10px;
					image{
						position: relative;
						top: 10upx;
					}
				}
				.htime{
					font-size: 10px;
					position: relative;
					top: 10upx;
				}
			}
		}
		
	}

	.video_play {
		/* height: 422upx; */
		position: relative;
		background-color: white;
		margin: 20upx 0;
		padding: 20upx;

		video {
			width: 100%;
		}

		uni-video {
			height: 100%;
		}

	}
	
	.courseTabBox{
		margin-top:12%;
		display:flex;
		.courseTab{
			width:100%;
			height:80upx;
			line-height: 80upx;
			text-align: center;
			margin-bottom:2%;
			background-color: #fff;
			font-weight: 600;
			/* border-bottom: 4px solid rgba(255, 202, 77, 1); */
		}
		.onTab {
			border-bottom: 6upx solid rgba(255, 202, 77, 1);
			color:rgba(255, 202, 77, 1)
		}
	}
	
	.video_bot {
		position: fixed;
		top: 0upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 88upx;
		width: 100%;
		padding: 0 30upx;
		background-color: #fff;
		border-bottom:1px solid #eee;
		image {
			width: 60upx;
			height: 60upx;
		}
		.video_share{
			color: rgb(51, 51, 51);
			font-size: 26upx;
		}
	}

	.suggest {
		padding: 10upx 30upx;
		box-sizing: border-box;
		background: #FFFFFF;

		.suggest_title {
			font-size: 30upx;
			font-family: PingFangSC-Semibold, PingFang SC;
			/* color: rgba(51, 51, 51, 1); */
			font-weight: 600;
			line-height: 48upx;
			margin: 20upx 0 10upx 0;
		}

		.suggest_name {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			color: rgba(102, 102, 102, 1);
			line-height: 40upx;
		}

		.suggest_time {
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			color: rgba(153, 153, 153, 1);
			line-height: 40upx;
		}
	}

	.course {
	    margin-top: 18upx;
	    margin-bottom: 132upx;
	    background: #fff;
	    text-indent: 2em;
	    padding: 5%;
	    font-size: 15px;
	    line-height: 50upx;
	}

	.course_type {
		height: 100upx;
		background: #FFFFFF;
		border: 1px solid #e8e8e8;

		ul {
			display: flex;
			justify-content: space-around;
			align-items: center;
			height: 100%;
			text-align: center;

			li {
				font-size: 32upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
				line-height: 44upx;
				width: 50%;
				border-right: 2upx solid #E8E8E8;
				position: relative;
			}
		}
	}

	.light{
		background: rgba(255, 202, 77, 0.3);
	}
	.dark{
		background: rgba(255, 202, 77, 1);
	}
	.course_content {
		ul {
			li {
				position: relative;
				background: #FFFFFF;
				padding: 40upx 30upx;
				box-sizing: border-box;

				&::after {
					content: '';
					position: absolute;
					top: auto;
					bottom: 0;
					right: auto;
					height: 1px;
					width: 690upx;
					;
					background-color: #E8E8E8;
				}

				.course_title {
					font-size: 32upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
					line-height: 44upx;
				}

				.course_tipl {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 20upx;

					.course_time {
						display: flex;
						align-items: center;

						image {
							width: 30upx;
							height: 30upx;
						}

						text {
							font-size: 28upx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: rgba(153, 153, 153, 1);
							line-height: 40upx;
							margin-left: 10upx;
						}
					}

					.course_play {
						display: flex;
						align-items: center;
						color: rgba(153, 153, 153, 1);
						font-size: 28upx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;

						image {
							width: 30upx;
							height: 30upx;
						}

						text {
							font-size: 28upx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: rgba(232, 65, 112, 1);
							line-height: 40upx;
							margin-left: 10upx;
						}
					}
				}
			}
		}
	}

	.active:after {
		position: absolute;
		content: "";
		width: 30upx;
		bottom: -20upx;
		text-align: center;
		border-bottom: 10upx solid rgba(232, 65, 112, 1);
		left: 50%;
		transform: translate(-50%, -50%);
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
	}

	.enroll {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 120upx;
		font-size: 36upx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		padding: 20upx 0;
		box-sizing: border-box;
		text-align: center;

		.enro {
			font-size: 20upx;
		}
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.7);
	}

	.news {
		/* position: fixed; */
		bottom: 0;
		left: 0;
		width: 100%;
		/* height: 724upx; */
		background: rgba(255, 255, 255, 1);
		/* padding: 0 30upx; */

		.news_title {
			height: 120upx;
			line-height: 120upx;
			font-size: 36upx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: rgba(51, 51, 51, 1);
			position: relative;
			padding-left: 20upx;
		}

		ul {
			font-size: 32upx;

			li {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding: 36upx 0 38upx;
				box-sizing: border-box;
				border-top: 1px solid #E8E8E8;

				.news_name {
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
					line-height: 44upx;
					width: 25%;
				}

				.news_input {
					width: 100%;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
					line-height: 44upx;

					text {
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: rgba(232, 65, 112, 1);

					}
				}
			}
		}

		.payment {
			height: 120upx;
			background: #FFCA4D;
			font-size: 36upx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			line-height: 120upx;
			text-align: center;
			/* margin: 0 -40upx; */
		}
	}

	.news_title::after {
		position: absolute;
		content: "";
		height: 30upx;
		top: 46upx;
		left: 0;
		border-right: 10upx solid rgba(232, 65, 112, 1);
	}

	.success {
		width: 582upx;
		height: 328upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 4upx;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		padding: 70upx 30upx 36upx;
		box-sizing: border-box;
		text-align: center;

		.success_enroll {
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 40upx;
				height: 40upx;
			}

			text {
				font-size: 36upx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: rgba(232, 65, 112, 1);
				line-height: 50upx;
				margin-left: 20upx;
			}
		}

		.success_info {
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			line-height: 40upx;
			margin: 28upx 0;

			text {
				color: #333333;
			}
		}

		.success_bot {
			width: 522upx;
			height: 80upx;
			background: rgba(232, 65, 112, 1);
			border-radius: 4upx;
			font-size: 32upx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			line-height: 80upx;
		}
	}

	.video_pic {
		width: 750upx;
		height: 422upx;

		image {
			width: 100%;
			height: 100%;
		}
	}
	.area {
		height: 55%;
	}
	.register-section {
	 /*   position: fixed;
	    left: 0;
	    bottom: 134upx; */
	    width: 100%;
	    font-size: 24upx;
	    color: #666;
	    /* text-align: center; */
		text {
			color: #295C8E;
		}
	}
</style>
