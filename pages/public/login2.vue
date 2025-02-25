<template>
  <view class="container">
    <view class="top-status_bar"></view>
    <!-- <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view> -->
    <!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
    <view class="wrapper">
      <view v-if="!iszh" class="left-top-sign"
        ><image src="../../static/img/logo_2.png"></image
      ></view>
      <view v-else class="left-top-sign1"
        ><image src="../../static/img/logo_1.png"></image
      ></view>
      <view class="input-content">
        <!-- 手机号登陆 -->
        <view class="input-item" v-show="adtype">
          <!-- <text class="tit">手机号</text> -->
          <image class="input-icon" src="../../static/phone.png"></image>
          <input
            type="mobile"
            v-model="mobile"
            :placeholder="$t('login.index1')"
            placeholder-class="input-empty"
            maxlength="11"
          />
        </view>
        <!-- 邮箱登陆 -->
        <view class="input-item" v-show="!adtype">
          <!-- <text class="tit">手机号</text> -->
          <image class="input-icon" src="../../static/mail.png"></image>
          <input
            type="mobile"
            v-model="mobile"
            :placeholder="$t('login.index2')"
            placeholder-class="input-empty"
            style="width: 90%"
            maxlength="50"
          />
        </view>
        <view class="input-item" style="">
          <!-- <text class="tit">密码</text> -->
          <view style="display: flex; justify-content: space-around; align-items: center">
            <image class="input-icon" src="../../static/key@3x.png"></image>
            <input
              v-model="password"
              :placeholder="$t('login.index3')"
              placeholder-class="input-empty"
              maxlength="20"
              :type="rememberLook ? 'text' : 'password'"
              data-key="password"
              style="
                background-color: transparent;
                border: 0;
                outline: none;
                font-size: 30upx;
              "
            />
          </view>
          <view class="RememberLook">
            <image
              class="check-look"
              @tap="rememberLook = !rememberLook"
              :src="rememberLook ? '../../static/see.png' : '../../static/nosee.png'"
            ></image>
          </view>
          <!-- @confirm="toLogin"-->
          <tfgg-verify @result="verifyResult" ref="verifyElement"></tfgg-verify>
        </view>
        <view class="RememberCheck">
          <image
            class="check-icon"
            @tap="rememberPsw = !rememberPsw"
            :src="
              rememberPsw
                ? '../../static/selected_1.png'
                : '../../static/unselected2x.png'
            "
          ></image
          >{{ $t("login.index4") }}
        </view>
        <!-- <checkbox-group @change="checkboxChange" class="RememberCheck">
					<checkbox  id="chkRem" type="checkbox" :checked="rememberPsw" 
						@tap="rememberPsw = !rememberPsw" >记住密码</checkbox>
				</checkbox-group> -->
        <view class="forget-section" @click="findpsd">{{ $t("login.index5") }}？</view>
      </view>
      <view class="adtype" v-show="adtype" @click="adtypeChange">
        <view class=""><image src="../../static/img/yjfk.png"></image></view>
        <view class="adtype_txt">{{ $t("login.index6") }}</view>
      </view>
      <view class="adtype" v-show="!adtype" @click="adtypeChange">
        <view class=""><image src="../../static/img/yjfk.png"></image></view>
        <view class="adtype_txt">{{ $t("login.index7") }}</view>
      </view>
      <view>
        <!-- <button class="confirm-btn" @click="getPaddword()">{{$t('login.index8')}}</button> -->
        <button class="confirm-btn" @click="toLogin()">{{ $t("login.index8") }}</button>
      </view>
      <view class="register-sections"
        >{{ $t("login.index9") }}？<text @click="toRegist">{{
          $t("login.index10")
        }}</text></view
      >
    </view>
    <view class="register-section">
      {{ $t("login.index11") }}
      <text class="userState" @click="navtoagree(17)">《{{ $t("login.index12") }}》</text>
    </view>
    <view class="login-bgc">
      <!-- <image src="../../static/bg@3x.png" mode=""></image> -->
    </view>
    <view class="otherlogin">
      <!-- #ifndef MP -->
      <!-- <image @click="loginbywx" 
				src="../../static/temp/share_wechat.png" 
				style="width: 40px;height: 40px;"></image> -->
      <!-- #endif -->
      <!-- #ifdef MP -->
      <!-- <button class="buttoncss" open-type="getUserInfo" 
				@getuserinfo="loginbywx"></button> -->
      <!-- #endif -->
      <!-- <text style="font-size: 12px;opacity: 0.8;padding-top: 3px;">微信登录</text> -->
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import app from "../../App.vue";
import tfggVerify from "../../components/tfgg-verify/tfgg-verify.vue";
export default {
  data() {
    return {
      rememberLook: false,
      adtype: true, //登陆方式，true为手机号，false为邮箱
      mobile: "",
      password: "",
      btndisabl: false,
      rememberPsw: true,
      unionId: "",
      modes: 1,
      iszh: true,
    };
  },
  onLoad() {
    if (this.userInfo !== "") {
      uni.switchTab({
        url: "../index/index",
      });
    }
    if (uni.getStorageSync("locale") === "zh-CN,zh") {
      this.iszh = true;
    } else {
      this.iszh = false;
    }
  },
  components: {
    "tfgg-verify": tfggVerify,
  },
  computed: {
    ...mapState(["hasLogin", "userInfo"]),
  },
  //页面初始加载
  mounted() {
    let that = this; //缓存的账号

    const HCuname = uni.getStorageSync("HCuname"); //缓存的密码
    const HCpassw = uni.getStorageSync("HCpassw"); //有缓存就赋值给文本没有就清空
    if (HCuname && HCpassw) {
      that.mobile = HCuname;
      that.password = HCpassw;
    } else {
      that.mobile = "";
      that.password = "";
    }
  },
  methods: {
    ...mapMutations(["login"]),
    adtypeChange() {
      this.mobile = "";
      this.adtype = !this.adtype;
    },

    /* 校验结果回调函数 */
    verifyResult(res) {
      if (res) {
        this.$refs.verifyElement.reset(); //校验成功重置插件
        this.toLogin();
      }
      // console.log("校验成功重置插件======"+res);
    },
    /* 显示校验弹窗 */
    verifyFasong() {
      this.$refs.verifyElement.show();
    },
    /* 校验插件重置 */
    verifyReset() {
      this.$refs.verifyElement.reset();
      console.log("校验插件重置");
    },
    navBack() {
      uni.navigateBack();
    },
    toRegist() {
      uni.navigateTo({
        url: "regester",
      });
    },
    findpsd() {
      uni.navigateTo({
        url: "forgetpsd",
      });
    },
    // 判断用户是否需要重设密码
    async getPaddword() {
      let that = this;
      if (that.$data.phone == "" && that.$data.mail == "") {
        that.$api.msg(this.$t("login.index13"));
        that.$data.btndisabl = false;
        return;
      }
      if (that.adtype) {
        let res2 = await that.$request.post("/uc/get/ifRestartPwd", {
          data: {
            mobile: that.$data.mobile,
          },
        });
        if (res2.data.code == 500) {
          // console.log('22')
          console.log("500");
          that.onLogin();
        } else if (res2.data.code == 0) {
          that.$api.msg(this.$t("login.index14"));
          setTimeout(function () {
            uni.navigateTo({
              url: "/pages/public/forgetpsd",
            });
          }, 2000);
        }
      } else {
        that.onLogin();
      }
    },

    onLogin() {
      let that = this;
      if (that.$data.phone == "" && that.$data.mail == "") {
        that.$api.msg(this.$t("login.index13"));
        that.$data.btndisabl = false;
        return;
      } else if (that.$data.password == "") {
        that.$api.msg(this.$t("login.index15"));
        that.$data.btndisabl = false;
        return;
      } else {
        that.verifyFasong();
      }
    },
    navtoagree(type) {
      uni.navigateTo({
        url: "./agremment?type=" + type,
      });
    },
    async toLogin() {
      let that = this;
      // let deviceId = uni.getStorageSync("deviceid");
      // let deviceuId = uni.getStorageSync("deviceuId");
      if (that.adtype) {
        that.modes = 0;
      } else {
        that.modes = 2;
      }
      console.log(that.modes);
      try {
        that.$data.btndisabl = true;
        if (that.$data.phone == "" && that.$data.mail == "") {
          that.$api.msg(this.$t("login.index13"));
          that.$data.btndisabl = false;
          return;
        } else if (that.$data.password == "") {
          that.$api.msg(this.$t("login.index15"));
          that.$data.btndisabl = false;
          return;
        }
        // else if(deviceuId&&deviceId&&(deviceuId+that.$data.mobile)!==deviceId){
        // 	uni.showModal({
        // 		title:"提示",
        // 		content:"与上次登录账号不一致",
        // 		success(e) {},
        // 	})
        // }
        else {
          // 手机号登陆
          let data = {
            email: that.$data.mobile,
            password: that.$data.password,
            code: "",
            mode: that.modes,
            ticket: "",
            randStr: "",
          };
          let res1 = await that.$request.post("/user/api/users/email/login", data);

          if (res1.data.code == "000000") {
            that.login(res1.data.data);
            uni.setStorageSync("token", res1.data.data.token);
            //缓存账号和密码
            if (that.rememberPsw) {
              uni.setStorageSync("HCuname", that.$data.mobile);
              uni.setStorageSync("HCpassw", that.$data.password);
            } else {
              uni.removeStorageSync("HCuname");
              uni.removeStorageSync("HCpassw");
              //that.uname = '';
              //that.passw = '';
            }
            // uni.setStorageSync('deviceid', res1.data.data.userId+res1.data.data.mobile);
            that.$data.btndisabl = false;
            uni.switchTab({
              url: "../index/index",
            });
          } else {
            that.$api.msg(res1.data.message);
            that.$data.btndisabl = false;
          }
        }
      } catch (error) {
        that.$data.btndisabl = false;
        console.log(error);
      }
    },

    //复选框
    checkboxChange: function (e) {
      if (this.rememberPsw) {
        //获取缓存的账号
        uni.getStorageSync("HCuname", this.mobile);
        uni.getStorageSync("HCpassw", this.password);
      } else {
        uni.removeStorageSync("HCuname");
        uni.removeStorageSync("HCpassw");
      }
    },
  },
};
</script>

<style lang="scss">
.wrapper {
  position: relative;
  z-index: 90;
  padding-bottom: 40upx;
}

.back-btn {
  position: absolute;
  left: 40upx;
  z-index: 9999;
  padding-top: var(--status-bar-height);
  top: 40upx;
  font-size: 40upx;
  color: white;
}
.left-top-sign {
  width: 268upx;
  height: 246upx;
  margin: 15% auto;
  image {
    width: 100%;
    height: 100%;
  }
}

.left-top-sign1 {
  width: 320upx;
  height: 116upx;
  margin: 15% auto;
  image {
    width: 100%;
    height: 100%;
  }
}

.buttoncss {
  background: url("../../static/temp/share_wechat.png");
  background-size: 100% 100%;
  width: 80upx;
  height: 80upx;
  display: block;
  border-radius: 50%;
}

.input-content {
  margin: 0 8%;
  .RememberCheck {
    display: inline-block;
    font-size: $font-base;
    .check-icon {
      width: 32upx;
      height: 32upx;
      margin: 0 7px 0px 0px;
      vertical-align: middle;
    }
  }
}

.input-item {
  display: flex;
  align-items: center;
  border-bottom: 1upx solid #eeeeee;
  margin: 8% 0 3%;
  padding-bottom: 3%;
  .input-icon {
    width: 20px;
    height: 20px;
    margin-right: 3%;
  }
  .tit {
    height: 40%;
    line-height: 56upx;
    font-size: $font-sm + 2upx;
    color: $font-color-base;
  }
  input {
    height: 60upx;
    font-size: $font-lg;
  }
  .RememberLook {
    display: inline-block;
    font-size: $font-base;
    width: 48upx;
    .check-look {
      width: 48upx;
      height: 48upx;
      margin: 0 7px 0upx 200upx;
      vertical-align: middle;
      outline: none;
    }
  }
}

.confirm-btn {
  height: 88upx;
  width: 84%;
  line-height: 88upx;
  background-color: #00a7eb;
  border: none;
  margin-top: 60upx;
  border-radius: 44upx;
  color: #ffffff;
  font-size: 36upx;
}

.forget-section {
  display: inline-block;
  float: right;
  font-size: $font-base;
  color: #00a7eb;
  margin-top: 10upx;
}

.register-sections {
  margin-top: 30upx;
  text-align: center;
  font-size: $font-base;
  text {
    color: #00a7eb;
    margin-left: 6upx;
  }
}
.register-section {
  position: fixed;
  bottom: 40upx;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 100;
  font-size: $font-base;
  .userState {
    color: #00a7eb;
  }
}
.login-bgc {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 0;
  image {
    width: 410upx;
    height: 293upx;
    vertical-align: middle;
  }
}
.otherlogin {
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.adtype {
  display: flex;
  justify-content: flex-start;
  margin: 30upx 7% 0upx;
  .adtype_txt {
    margin-left: 8upx;
    height: 50upx;
    line-height: 50upx;
    font-size: 28upx;
  }
  image {
    width: 50upx;
    height: 50upx;
  }
}
</style>
