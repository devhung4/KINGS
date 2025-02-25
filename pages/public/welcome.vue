<template>
  <view class="container" :style="lang == 'zh' ? zhbg : enbg">
    <view class="closetime" @tap="navtoindex">跳过{{ time }}</view>
    <!-- <image class="bgimg" :src="image[0]"></image> -->
    <view class="welcomeimg">
      <view>
        <!-- <image src="../../static/start_img.png" mode="widthFix"></image> -->
      </view>
      <!-- <view class="welname">颗粒云矿</view> -->
    </view>

    <!-- 版本弹窗通知 -->
    <!-- <view class="nodesmask" v-show="updatemask">
			<view class="nodesbox">
				<view class="boxcontent">
					<view class="topimg">
						<image src="~@/static/images/home_update.png" mode="widthFix"></image>
					</view>
					<view class="updatediv">
						<view class="title">发现新版本</view>
						<view class="update-content">
							<view v-for="(item,index) in fuinfotxt" :key="index">{{item}}</view>
						</view>
						<view class="btndiv">
							<button class="upbdbtn" @tap="comupdateclick">立即升级</button>
						</view>
					</view>
				</view>
				<uni-icons v-if="optional" class="trtxt" @tap="optionalclick" color="white" type="closefill" size="15"></uni-icons>
			</view>
		</view> -->
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import app from "../../App.vue";
import md5 from "@/common/md5.js";
import lang from "@/i18n/index.js";

export default {
  data() {
    return {
      time: 2,
      image: [],
      countdown: "",
      //升级
      updatemask: false,
      fuinfo: "",
      fuinfotxt: [],
      optional: true,
      zhbg: "background-image: url('../../static/black/start_img_zh_1.png');",
      enbg: "background-image: url('../../static/black/start_img_zh_1.png');",
      lang: "",
    };
  },
  computed: {
    ...mapState(["hasLogin", "userInfo"]),
  },
  onLoad() {
    this.countdownclick();
    /*
			    获取手机型号
			 */
    let _this = this;
    uni.removeStorageSync("locale");
    console.log(uni.getSystemInfoSync().language, "111");
    let language = uni.getSystemInfoSync().language;
    uni.getSystemInfo({
      success: function (res) {
        if (language != "zh-Hans-CN" && language != "zh-CN") {
          lang.locale = "en";
          _this.lang = "en";
          uni.setStorageSync("locale", "en-US,en");
          _this.refresh();
        } else {
          lang.locale = "zh";
          _this.lang = "zh";
          uni.setStorageSync("locale", "zh-CN,zh");
          _this.refresh();
        }
      },
    });
  },
  methods: {
    ...mapMutations(["setConfigClick"]),

    refresh() {
      console.log(uni.getStorageSync("locale"));
      uni.redirectTo({
        url: "/pages/public/welcome",
      });
    },

    navtoindex() {
      let that = this;
      clearTimeout(that.countdown);
      uni.navigateTo({
        url: "/pages/public/login",
      });
    },
    countdownclick() {
      let that = this;
      that.countdown = setTimeout(function () {
        that.time--;
        that.countdownclick();
        if (that.time == 0) {
          clearTimeout(that.countdown);
          uni.navigateTo({
            url: "/pages/public/login",
          });
        }
      }, 1000);
    },

    // 升级弹窗---------------start
    async forcedUpdateClick() {
      let that = this;
      uni.getSystemInfo({
        success: (resp) => {
          //检测当前平台，如果是安卓则启动安卓更新
          let platformP = resp.platform == "android" ? "a" : "i";
          let nonce = Math.floor(Math.random() * 1000 + 1);
          let timestamp = new Date().getTime();
          let sign = md5(
            nonce.toString() +
              timestamp.toString() +
              "$2a$10$yZauvUeqqSVhgVrnIp.aTO2QfkHm1WexOw39rTZ.MelNC3cFJfdHS"
          ).toUpperCase();
          uni.request({
            url: that.$baseUrl + "/upgrade/queryUpgradeInfo",
            data: {
              base: {
                appId: platformP,
                channels: "001",
                ver: "1.3.5",
                clientVer: "1.3.5",
                apn: "wifi",
                deviceId: "1233eedds2112",
                uid: "12332112",
                valat: 22.332112,
                lalong: 12.332112,
                platform: "IOS",
                platformVer: "8",
                resolution: "960*640",
                deviceType: "P6",
                carrier: "china mobile",
                city: "合肥",
                brand: "huawei",
              },
            },
            dataType: "json",
            method: "POST",
            header: {
              "content-type": "application/json;charset=UTF-8",
              uid: uni.getStorageSync("userInfo").userId,
              token: uni.getStorageSync("userInfo").token,
              nonce: nonce,
              timestamp: timestamp,
              sign: sign,
            },
            success: function (forcedUpdateinfo) {
              // if (resData && resData.type==1) {
              // 	let openUrl = resData.downloadU

              // 	// 提醒用户更新
              // 	this.$uniShowModal(
              // 		resData.upgradeDesc ? resData.upgradeDesc : "是否选择更新", () => {
              // 			// 最核心的地方,自动打开下载安装【且覆盖之前的安装】
              // 			plus.runtime.openURL(openUrl);
              // 		}, "true", "更新提示");
              // }
              if (forcedUpdateinfo.data.base.code == "000000") {
                that.$data.fuinfo = forcedUpdateinfo.data.data;
                let fuinfotxtlist = forcedUpdateinfo.data.data.upgradeDesc.split("\n");
                that.$data.fuinfotxt = fuinfotxtlist;
                // plus.runtime.version当前系统的版本号

                let verval = that.versionStringCompare(
                  "1.3.5",
                  forcedUpdateinfo.data.data.version
                );
                if (verval == -1 && resp.platform == "android") {
                  that.$data.updatemask = true;
                  if (1 == parseInt(forcedUpdateinfo.data.data.type)) {
                    that.$data.optional = false;
                  } else {
                    that.$data.optional = true;
                  }
                } else {
                  that.$data.updatemask = false;
                  that.countdownclick();
                }
              } else {
                that.$data.updatemask = false;
                that.$data.optional = true;
                that.countdownclick();
              }
            },
            fail: function (e) {
              that.countdownclick();
            },
          });
        },
      });
    },
    //版本号比较
    versionStringCompare(preVersion, lastVersion) {
      var sources = preVersion.split(".");
      var dests = lastVersion.split(".");
      var maxL = Math.max(sources.length, dests.length);
      var result = 0;
      for (let i = 0; i < maxL; i++) {
        let preValue = sources.length > i ? sources[i] : 0;
        let preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
        let lastValue = dests.length > i ? dests[i] : 0;
        let lastNum = isNaN(Number(lastValue))
          ? lastValue.charCodeAt()
          : Number(lastValue);
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
    // 关闭升级弹窗
    optionalclick() {
      this.$data.updatemask = false;
      this.countdownclick();
    },
    // xiazai
    comupdateclick() {
      let that = this;
      // plus.runtime.openURL(this.$data.fuinfo.downloadUrl); //打开web下载安装
      //apple id  在 app conection 上传的位置可以看到  https://appstoreconnect.apple.com/
      // let appleId= 146691123123
      // plus.runtime.launchApplication({
      // 	action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`
      // }, function(e) {
      // 	console.log('Open system default browser failed: ' + e.message);
      // });

      uni.showLoading({
        title: "更新中……",
      });
      uni.downloadFile({
        //执行下载
        url: that.$data.fuinfo.downloadUrl, //下载地址
        success: (downloadResult) => {
          //下载成功
          uni.hideLoading();
          if (downloadResult.statusCode == 200) {
            //安装
            plus.runtime.install(
              downloadResult.tempFilePath,
              { force: true },
              function (res) {
                that.$api.msg("更新成功，重启中");
                plus.runtime.restart();
              }
            );
          }
        },
        fail: (e) => {
          console.log(e);
        },
      });
    },
    // 升级弹窗---------------end
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100vw;
  text-align: center;
  background-image: url("../../static/black/start_img_zh_1.png");
  background-size: 100% 100%;
  background-position: -1px, -1px;
  .closetime {
    color: #ffffff;
    font-size: 28upx;
    background: #c2cad7;
    width: 132upx;
    height: 56upx;
    line-height: 56upx;
    text-align: center;
    border-radius: 100upx;
    position: absolute;
    top: 6%;
    right: 5%;
  }
  .bgimage {
    height: 398upx;
    width: 462upx;
    margin: 40% auto 15%;
  }
  .welcomeimage {
    width: 20rem;
    margin: 0 auto;
    position: absolute;
    top: 10rem;
    left: 0;
    right: 0;
    image {
      width: 85%;
    }
    .welname {
      font-size: 40upx;
      font-weight: bolder;
      text-align: center;
      margin-top: 3%;
    }
  }
  /* 弹窗 */
  .nodesmask {
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 9999;

    .nodesbox {
      width: 75%;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 16%;
      margin: 0 auto;
      .boxcontent {
        border-radius: 20upx;
        .topimage {
          height: 428upx;
          overflow: hidden;
          image {
            width: 100%;
          }
        }
        .updatediv {
          background: #ffffff;
          padding: 40upx 0 30upx;
          margin-top: -160upx;
          border-radius: 20upx;
          .title {
            text-align: center;
            font-weight: bolder;
            font-size: 36upx;
            position: relative;
            z-index: 2;
          }
          .update-content {
            margin-top: 20upx;
            padding: 0 5%;
            height: 260upx;
            overflow: hidden;
            overflow-y: auto;
            font-size: $font-base;
          }
          .btndiv {
            .upbdbtn {
              height: 70upx;
              line-height: 70upx;
              width: 55%;
              background-color: #b88e55;
              color: #ffffff;
              border-radius: 72upx;
              font-size: $font-base;
              margin: 30upx auto 0;
            }
          }
        }
      }
      .trtxt {
        /* position: absolute;
					right: 0;left: 0;bottom: 100upx; */
        border: 1px solid #fff;
        border-radius: 50%;
        display: inline-block;
        margin: 40upx auto 0;
        height: 60upx;
        width: 60upx;
      }
    }
  }
}
</style>
