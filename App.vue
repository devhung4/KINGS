<script>
/**
 * vuex管理登陆状态，具体可以参考官方登陆模板示例
 */
import { mapMutations, mapState } from "vuex";
export default {
  globalData: {
    unionid: "",
  },
  methods: {
    ...mapMutations(["login"]),

    // 强制更新
    async checkVersionUpdate() {
      // console.log("进入强制更新");
      let that = this;
      try {
        let platform = uni.getSystemInfoSync().platform;
        let typeNum;
        if (platform == "ios") {
          console.log("我是iOS");
          typeNum = 1;
        } else if (platform == "android") {
          typeNum = 0;
          console.log("我是安卓");
        } else {
          typeNum = 0;
        }
        let forcedUpdate = await this.$request.post(
          "/uc/ancillary/system/app/version/" + typeNum,
          {
            header: {
              "x-auth-token": uni.getStorageSync("token"),
              "Accept-Language": uni.getStorageSync("locale")
                ? uni.getStorageSync("locale")
                : "en-US,en",
            },
            data: {},
          }
        );
        let resData = forcedUpdate.data.data;
        uni.setStorageSync("forcedUpdate", forcedUpdate);
        // if (resData && resData.type==1) {
        // 	let openUrl = resData.downloadU

        // 	// 提醒用户更新
        // 	this.$uniShowModal(
        // 		resData.upgradeDesc ? resData.upgradeDesc : "是否选择更新", () => {
        // 			// 最核心的地方,自动打开下载安装【且覆盖之前的安装】
        // 			plus.runtime.openURL(openUrl);
        // 			console.log(111)
        // 		}, "true", "更新提示");
        // }
      } catch (e) {
        //TODO handle the exception
        console.log(e);
        // that.$api.msg('网络异常');
      }
    },
  },
  computed: {
    ...mapState(["hasLogin", "userInfo"]),
  },
  onLaunch: function () {
    let that = this;
    if (that.userInfo !== "") {
      //更新登陆状态
      uni.getStorage({
        key: "userInfo",
        success: (res) => {
          that.login(res.data);
        },
      });
    }
    uni.onTabBarMidButtonTap(function (e) {
      if (that.userInfo !== "") {
        uni.navigateTo({
          url: "/pages/user/invitecode",
        });
      } else {
        uni.navigateTo({
          url: "/pages/public/login",
        });
      }
    });
    // 强制更新
    // that.checkVersionUpdate();
  },
  onShow: function () {
    console.log("App Show");
    // uni.setTabBarItem({
    //   index: 1,
    //   text: '商城',
    //   iconPath: 'static/Tab_game.png',
    //   selectedIconPath: 'static/Tab_game_current.png'
    // })
  },
  onTabItemTap(e) {
    console.log(e);
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";

/deep/ .uni-tabbar {
  box-shadow: 0px -1px 3px 0px rgba(0, 0, 0, 0.1);
}

.uni-tabbar .uni-tabbar-border {
  height: 0 !important;
}
@import "./common/iconfont.css";
.uni-slider-handle {
  width: 15px !important;
  height: 15px !important;
  border-radius: 100% !important;
  opacity: 0;
}
.uni-slider-thumb {
  border-radius: 100% !important;
}
/*
		全局公共样式和字体图标
	*/
@font-face {
  font-family: yticon;
  font-weight: normal;
  font-style: normal;
  src: url("https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf") format("truetype");
}

.yticon {
  font-family: "yticon" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-yiguoqi1:before {
  content: "\e700";
}

.icon-iconfontshanchu1:before {
  content: "\e619";
}

.icon-iconfontweixin:before {
  content: "\e611";
}

.icon-alipay:before {
  content: "\e636";
}

.icon-shang:before {
  content: "\e624";
}

.icon-shouye:before {
  content: "\e626";
}

.icon-shanchu4:before {
  content: "\e622";
}

.icon-xiaoxi:before {
  content: "\e618";
}

.icon-jiantour-copy:before {
  content: "\e600";
}

.icon-fenxiang2:before {
  content: "\e61e";
}

.icon-pingjia:before {
  content: "\e67b";
}

.icon-daifukuan:before {
  content: "\e68f";
}

.icon-pinglun-copy:before {
  content: "\e612";
}

.icon-dianhua-copy:before {
  content: "\e621";
}

.icon-shoucang:before {
  content: "\e645";
}

.icon-xuanzhong2:before {
  content: "\e62f";
}

.icon-gouwuche_:before {
  content: "\e630";
}

.icon-icon-test:before {
  content: "\e60c";
}

.icon-icon-test1:before {
  content: "\e632";
}

.icon-bianji:before {
  content: "\e646";
}

.icon-jiazailoading-A:before {
  content: "\e8fc";
}

.icon-zuoshang:before {
  content: "\e613";
}

.icon-jia2:before {
  content: "\e60a";
}

.icon-huifu:before {
  content: "\e68b";
}

.icon-sousuo:before {
  content: "\e7ce";
}

.icon-arrow-fine-up:before {
  content: "\e601";
}

.icon-hot:before {
  content: "\e60e";
}

.icon-lishijilu:before {
  content: "\e6b9";
}

.icon-zhengxinchaxun-zhifubaoceping-:before {
  content: "\e616";
}

.icon-naozhong:before {
  content: "\e64a";
}

.icon-xiatubiao--copy:before {
  content: "\e608";
}

.icon-shoucang_xuanzhongzhuangtai:before {
  content: "\e6a9";
}

.icon-jia1:before {
  content: "\e61c";
}

.icon-bangzhu1:before {
  content: "\e63d";
}

.icon-arrow-left-bottom:before {
  content: "\e602";
}

.icon-arrow-right-bottom:before {
  content: "\e603";
}

.icon-arrow-left-top:before {
  content: "\e604";
}

.icon-icon--:before {
  content: "\e744";
}

.icon-zuojiantou-up:before {
  content: "\e605";
}

.icon-xia:before {
  content: "\e62d";
}

.icon--jianhao:before {
  content: "\e60b";
}

.icon-weixinzhifu:before {
  content: "\e61a";
}

.icon-comment:before {
  content: "\e64f";
}

.icon-weixin:before {
  content: "\e61f";
}

.icon-fenlei1:before {
  content: "\e620";
}

.icon-erjiye-yucunkuan:before {
  content: "\e623";
}

.icon-Group-:before {
  content: "\e688";
}

.icon-you:before {
  content: "\e606";
}

.icon-forward:before {
  content: "\e607";
}

.icon-tuijian:before {
  content: "\e610";
}

.icon-bangzhu:before {
  content: "\e679";
}

.icon-share:before {
  content: "\e656";
}

.icon-yiguoqi:before {
  content: "\e997";
}

.icon-shezhi1:before {
  content: "\e61d";
}

.icon-fork:before {
  content: "\e61b";
}

.icon-kafei:before {
  content: "\e66a";
}

.icon-iLinkapp-:before {
  content: "\e654";
}

.icon-saomiao:before {
  content: "\e60d";
}

.icon-shezhi:before {
  content: "\e60f";
}

.icon-shouhoutuikuan:before {
  content: "\e631";
}

.icon-gouwuche:before {
  content: "\e609";
}

.icon-dizhi:before {
  content: "\e614";
}

.icon-fenlei:before {
  content: "\e706";
}

.icon-xingxing:before {
  content: "\e70b";
}

.icon-tuandui:before {
  content: "\e633";
}

.icon-zuanshi:before {
  content: "\e615";
}

.icon-zuo:before {
  content: "\e63c";
}

.icon-shoucang2:before {
  content: "\e62e";
}

.icon-shouhuodizhi:before {
  content: "\e712";
}

.icon-yishouhuo:before {
  content: "\e71a";
}

.icon-dianzan-ash:before {
  content: "\e617";
}

@font-face {
  font-family: nwicon;
  font-weight: normal;
  font-style: normal;
  src: url("~@/static/font/iconfont.ttf") format("truetype");
}
.nwicon {
  font-family: "nwicon" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-iconfonttuijianren:before {
  content: "\e60d";
}

.icon-jifen:before {
  content: "\e631";
}

.icon-yejiguanli:before {
  content: "\e637";
}

.icon-shijian:before {
  content: "\e72d";
}

.icon-fl-zuzhi:before {
  content: "\e62b";
}

.icon-tongji1:before {
  content: "\e62a";
}

.icon-tongji:before {
  content: "\e64d";
}

.icon-erweima:before {
  content: "\e600";
}

.icon-chongzhi:before {
  content: "\e60e";
}

.icon-weixinzhifu:before {
  content: "\e61e";
}

.icon-yinxingqia:before {
  content: "\e61c";
}

.icon-zhifubao:before {
  content: "\e64e";
}

view,
scroll-view,
swiper,
swiper-item,
cover-view,
cover-image,
icon,
text,
rich-text,
progress,
button,
checkbox,
form,
input,
label,
radio,
slider,
switch,
textarea,
navigator,
audio,
camera,
image,
video {
  box-sizing: border-box;
}
/* 骨架屏替代方案 */
.Skeleton {
  background: #f3f3f3;
  padding: 20upx 0;
  border-radius: 8upx;
}

/* 图片载入替代方案 */
.image-wrapper {
  font-size: 0;
  background: #f3f3f3;
  border-radius: 4px;

  image {
    width: 100%;
    height: 100%;
    transition: 0.6s;
    opacity: 0;

    &.loaded {
      opacity: 1;
    }
  }
}
/* 这里是状态栏高度 */
.top-status_bar {
  height: var(--status-bar-height);
  width: 100%;
}
.clamp {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
.clampmore {
  width: 100%;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.common-hover {
  background: #f5f5f5;
}

/*边框*/
.b-b:after,
.b-t:after {
  position: absolute;
  z-index: 3;
  left: 0;
  right: 0;
  height: 0;
  content: "";
  transform: scaleY(0.5);
  border-bottom: 1px solid $border-color-base;
}

.b-b:after {
  bottom: 0;
}

.b-t:after {
  top: 0;
}

/* button样式改写 */
uni-button,
button {
  height: 80upx;
  line-height: 80upx;
  font-size: $font-lg + 2upx;
  font-weight: normal;

  &.no-border:before,
  &.no-border:after {
    border: 0;
  }
}

uni-button[type="default"],
button[type="default"] {
  color: $font-color-dark;
}

/* input 样式 */
.input-placeholder {
  color: #999999;
}

.placeholder {
  color: #999999;
}

uni-rich-text image {
  max-width: 100% !important;
}

uni-swiper .uni-swiper-dot-active {
  background-color: #ff7d45;
}
uni-swiper .uni-swiper-dots-horizontal .uni-swiper-dot {
  margin-right: 10upx;
  width: 20upx;
  border-radius: inherit;
  height: 4upx;
}
uni-swiper .uni-swiper-dots-horizontal {
  bottom: 10upx;
}
uni-swiper .uni-swiper-dots-horizontal {
  bottom: 18upx;
}
.uni-swiper-wrapper {
  border-radius: 20upx !important;
}
.uni-picker-action.uni-picker-action-confirm {
  color: #00a7eb !important;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
}
html {
  height: auto !important;
}
ul {
  padding-left: 0;
}
li {
  list-style: none;
}
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
</style>
