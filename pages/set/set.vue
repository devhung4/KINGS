<template>
  <view class="container">
    <view
      class="list-cell b-b m-t userimg"
      @click="changeimg"
      hover-class="cell-hover"
      :hover-stay-time="50"
    >
      <!-- <view class="list-cell b-b m-t"> -->
      <text class="cell-tit usetitle">{{ $t("set.index1") }}</text>
      <view class="useimg">
        <image class="ctimage" :src="headImg" mode="widthFix"></image>
      </view>
      <!-- <text class="cell-more yticon icon-you"></text> -->
    </view>
    <!-- <view class="list-cell b-b" @click="updateusername" hover-class="cell-hover" :hover-stay-time="50"> -->
    <view class="list-cell b-b">
      <text class="cell-tit">{{ $t("set.index2") }}</text>
      <text class="cell-tip">{{ userInfo.username }}</text>
      <!-- <text class="cell-more yticon icon-you"></text> -->
    </view>
    <!-- <view class="list-cell b-b m-t" @click="navTo('此功能暂未来通,敬请期待')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">个人资料</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
    <!-- <view class="list-cell b-b" @click="navTo('/pages/address/address')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">收货地址</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
    <!-- <view class="list-cell" @click="navTo('此功能暂未来通,敬请期待')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">实名认证</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->

    <!-- <view class="list-cell m-t">
			<text class="cell-tit">消息推送</text>
			<switch checked color="#fa436a" @change="switchChange" />
		</view> -->
    <!-- <view class="list-cell m-t b-b" @click="navTo('此功能暂未来通,敬请期待')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除缓存</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('此功能暂未来通,敬请期待')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于Dcloud</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
    <view
      class="list-cell b-b"
      @click="navTo('/pages/public/getmessages')"
      hover-class="cell-hover"
      :hover-stay-time="50"
    >
      <text class="cell-tit" v-show="typesel">{{ $t("set.index3") }}</text>
      <text class="cell-tit" v-show="!typesel">{{ $t("set.index4") }}</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <view
      class="list-cell b-b m-t"
      @click="navTo('/pages/public/findpsd')"
      hover-class="cell-hover"
      :hover-stay-time="50"
    >
      <text class="cell-tit">{{ $t("set.index5") }}</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <view
      v-show="fundsVerified == 0"
      class="list-cell b-b"
      @click="navTo('/pages/public/resetpaypsd')"
      hover-class="cell-hover"
      :hover-stay-time="50"
    >
      <text class="cell-tit">{{ $t("set.index6") }}</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <view
      v-show="fundsVerified !== 0"
      class="list-cell b-b"
      @click="navTo('/pages/public/updatepaypsd')"
      hover-class="cell-hover"
      :hover-stay-time="50"
    >
      <text class="cell-tit">{{ $t("set.index21") }}</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <view class="list-cell m-t">
      <text class="cell-tit">{{ $t("set.index7") }}</text>
      <text class="cell-tip">{{ $t("set.index8") }} {{ version }}</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <view class="list-cell m-t" @click="$refs.popup.open()">
      <text class="cell-tit">{{ $t("set.index23") }}</text>
      <text class="cell-tip"></text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <view class="list-cell log-out-btn" @click="toLogout" v-if="hasLogin">
      <text class="cell-tit">{{ $t("set.index9") }}</text>
    </view>

    <view class="cov" v-if="showmask">
      <view class="con">
        <view class="password">{{ $t("set.index10") }}</view>
        <input v-model="newusername" :placeholder="$t('set.index11')" />
        <view class="buttoncss">
          <button class="text-one" @click="sendok">{{ $t("set.index12") }}</button>
          <button class="text-two" @click="sendcancel">{{ $t("set.index13") }}</button>
        </view>
      </view>
    </view>
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog
        mode="base"
        :title="$t('set.index23')"
        :confirmText="$t('set.index24')"
        :cancelText="$t('set.index25')"
        :duration="2000"
        :before-close="true"
        @close="$refs.popup.close()"
        @confirm="confirm"
      >
        <view class="tip_title">{{ $t("set.index26") }}</view>
        <view class="tip">{{ $t("set.index27") }}</view>
        <view class="tip">{{ $t("set.index28") }}</view>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { pathToBase64, base64ToPath } from "../../common/image-tools/index.js";
export default {
  data() {
    return {
      typesel: true,
      userinfo: {},
      showmask: false,
      newusername: "",
      version: "1.1.5",
      fundsVerified: 0,
      headImg: "../../static/missing-face.png",
      userInfos: "",
      navTitle: this.$t("pageName.index8"),
    };
  },
  computed: {
    ...mapState(["hasLogin", "userInfo"]),
  },
  async onShow() {
    uni.setNavigationBarTitle({
      title: this.navTitle,
    });
    this.getData();
    this.getuserInfo();
  },
  onLoad() {
    this.getData();
  },
  onBackPress(event) {
    uni.switchTab({
      url: "../user/user",
    });
    console.log("ccc");
    return true;
  },
  methods: {
    ...mapMutations(["logout"]),

    // 获取用户信息
    getuserInfo() {
      var userInfoa = uni.getStorageSync("userInfo");
      this.userInfos = userInfoa;
      console.log(this.userInfos);
      console.log(this.userInfo);
      if (this.userInfo.email == "") {
        this.typesel = true;
      } else {
        this.typesel = false;
      }
    },

    // 上传图片
    async fileupload(base64) {
      let that = this;
      let base = base64
        .replace(/\ +/g, "")
        .replace(/[ ]/g, "")
        .replace(/[\r\n]/g, "");
      let res1 = await that.$request.post("/uc/upload/oss/base64", {
        header: {
          "x-auth-token": uni.getStorageSync("token"),
          "Accept-Language": uni.getStorageSync("locale")
            ? uni.getStorageSync("locale")
            : "zh-CN,zh",
        },
        data: {
          base64Data: base,
        },
      });
      if (res1.data.code == 0) {
        console.log("00000");
        that.updateinfo(res1.data.data);
      } else {
        console.log(res1.data.message);
        that.$api.msg(res1.data.message);
      }
    },
    // 修改信息
    async updateinfo(content) {
      let that = this;
      let res1 = await that.$request.post("/uc/approve/change/avatar", {
        header: {
          "x-auth-token": uni.getStorageSync("token"),
          "Accept-Language": uni.getStorageSync("locale")
            ? uni.getStorageSync("locale")
            : "en-US,en",
        },
        data: {
          url: content,
        },
      });
      if (res1.data.code == 0) {
        that.showmask = false;
        that.$api.msg(res1.data.message);
        that.getData();
      } else {
        that.$api.msg(res1.data.message);
      }
    },
    // 修改用户名
    updateusername() {
      this.showmask = true;
    },
    sendok() {
      let that = this;
      that.showmask = true;
      if (that.newusername == "") {
        that.$api.msg(this.$t("set.index14"));
      } else {
        that.updateinfo(0, that.$data.newusername);
      }
    },
    sendcancel() {
      this.showmask = false;
    },
    // 修改用户头像
    changeimg() {
      let that = this;
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera "], //从相册选择、使用相机
        success: (chooseImageRes) => {
          uni.showLoading({
            title: this.$t("set.index15"),
            mask: true,
          });
          const tempFilePaths = chooseImageRes.tempFilePaths;
          that.$data.headimage = tempFilePaths[0];
          // let formData = new FormData()
          // formData.append('file', tempFilePaths[0])
          // console.log(formData, 'ppp')
          // let result = this.$request.post('uc/upload/oss/image', {
          // 	header: {
          // 		 'x-auth-token':uni.getStorageSync('token'),
          // 		 'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
          // 	},
          // 	data: formData
          // })
          // console.log(result)
          pathToBase64(tempFilePaths[0])
            .then((base64) => {
              console.log("345", base64);
              that.fileupload(base64);
            })
            .catch((error) => {
              that.$api.msg(123);
            });
          uni.hideLoading();
        },
        fail: (e) => {
          console.log("678");
          that.$api.msg(this.$t("set.index16"));
        },
      });
    },
    // 获取个人信息
    async getData() {
      let that = this;
      // try {
      let res1 = await that.$request.post("/uc/approve/security/setting", {
        header: {
          "x-auth-token": uni.getStorageSync("token"),
          "Accept-Language": uni.getStorageSync("locale")
            ? uni.getStorageSync("locale")
            : "zh-CN,zh",
        },
        data: {},
      });
      if (res1.data.code == 0) {
        if (res1.data.data.avatar) {
          that.headimage = res1.data.data.avatar;
        }
        that.userinfo = res1.data.data;
        that.newusername = res1.data.data.nickname;
        that.fundsVerified = res1.data.data.fundsVerified;
        uni.setStorageSync("fundsVerif", that.fundsVerified);
        // let fundsVerif = res1.data.data.fundsVerified;
        // console.log(typeof(fundsVerif),'666')
      } else {
        that.$api.msg(res1.data.message);
      }
      // } catch (error) {
      // 	console.log('error:', error);
      // 	that.$api.msg('网络异常');
      // }

      let forcedUpdateinfo = uni.getStorageSync("forcedUpdate");
      // console.log(forcedUpdateinfo,'000')
      // that.version=forcedUpdateinfo.data.data.version;
      console.log(forcedUpdateinfo.data.data.version, "0100");
    },

    //注销账号
    confirm() {
      let _this = this;
      _this.$request
        .post("/uc/aonProductSku/cancellationUser", {
          header: {
            "x-auth-token": uni.getStorageSync("token"),
            "Accept-Language": uni.getStorageSync("locale")
              ? uni.getStorageSync("locale")
              : "zh-CN,zh",
          },
          data: {},
        })
        .then((res) => {
          _this.$refs.popup.close();
          if (res.data.code == 0) {
            uni.removeStorage("token");
            _this.logout();
          } else {
            _this.$api.msg(res.data.message);
          }
        });
    },

    navTo(url) {
      if (!this.hasLogin) {
        url = "/pages/public/login";
      }
      uni.navigateTo({
        url,
      });
    },
    //退出登录
    toLogout() {
      uni.showModal({
        content: this.$t("set.index17"),
        success: (e) => {
          if (e.confirm) {
            this.logout();
            setTimeout(() => {
              uni.navigateTo({
                url: "../public/login",
              });
            }, 200);
          }
        },
      });
    },
    //switch
    switchChange(e) {
      let statusTip = e.detail.value ? this.$t("set.index18") : this.$t("set.index19");
      this.$api.msg(`${statusTip}` + this.$t("set.index20"));
    },
  },
};
</script>

<style lang="scss">
page {
  background: $page-color-base;
}
.list-cell {
  display: flex;
  align-items: baseline;
  align-items: center;
  padding: 20upx $page-row-spacing;
  line-height: 60upx;
  position: relative;
  background: #fff;
  justify-content: center;
  &.log-out-btn {
    margin-top: 40upx;
    .cell-tit {
      /* color: $uni-color-primary; */
      color: #fd852f;
      text-align: center;
      margin-right: 0;
    }
  }
  &.cell-hover {
    background: #fafafa;
  }
  &.b-b:after {
    left: 30upx;
  }
  &.m-t {
    margin-top: 16upx;
  }
  .cell-more {
    align-self: baseline;
    font-size: $font-lg;
    color: $font-color-light;
    margin-left: 10upx;
  }
  .cell-tit {
    flex: 1;
    font-size: $font-base + 2upx;
    color: $font-color-dark;
    margin-right: 10upx;
  }
  .cell-tip {
    font-size: $font-base;
    color: $font-color-light;
  }

  switch {
    transform: translateX(16upx) scale(0.84);
  }
}
.useimage {
  height: 80upx;
  width: 80upx;
  border-radius: 50%;
  background-color: #ccc;
  overflow: hidden;
  .ctimage {
    /* height: 80upx; */
    width: 80upx;
    /* display: inline-block;		
		 */
    /* object-fit: cover !important; */

    /* vertical-align: middle; */
  }
}
.cov {
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3;
  position: fixed;
  text-align: center;
  font-size: 16px;
  .con {
    z-index: 4;
    height: 270upx;
    width: 600upx;
    background-color: white;
    position: fixed;
    top: 30%;
    left: 10%;
    border-radius: 20upx;
    .password {
      text-align: center;
      height: 80upx;
      line-height: 80upx;
      width: 100%;
    }
    input {
      border-bottom: 4upx solid #efefef;
      margin: 10upx auto;
      width: 90%;
      height: 70upx;
    }
    .buttoncss {
      width: 100%;
      height: 50upx;
      display: flex;
      margin-top: 32upx;
      .text-one,
      .text-two {
        display: block;
        text-align: center;
        height: 50upx;
        line-height: 50upx;
        width: 50%;
        background: none;
      }
      uni-button:after {
        border: none;
      }
    }
  }
}
.tip_title {
  font-size: 32rpx;
  text-align: left;
  margin-bottom: 10rpx;
}
.tip {
  font-size: 24rpx;
}
/deep/ .uni-dialog-content {
  flex-direction: column;
  padding-top: 10rpx;
  align-items: flex-start;
}
</style>
