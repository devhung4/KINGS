<template>
  <view class="login">
    <view class="login_heard">
      <image src="../../static/image/close.png" alt="" class="close" @click="goLogin()" />
      <view class="log_txt">註冊<span>帳戶，享受全球便捷消費</span></view>
      <view class="email">
        <input
          type="text"
          name="email"
          :placeholder="$t('register.form.emailPlaceholder')"
          v-model="form.email"
        />
      </view>
      <view class="password">
        <input type="text" name="code" :placeholder="$t('register.form.validationCodePlaceholder')" v-model="form.code" />
        <view class="view" @click="setCode()">{{ text }}</view>
      </view>
      <view class="password">
        <input
          class="input"
          :type="eyeState ? 'text' : 'password'"
          name="email"
          :placeholder="$t('register.form.passwordPlaceholder')"
          v-model="form.password"
        />
        <image :src="eyeState ? open : close" @click="eyeState = !eyeState" />
      </view>
      <view class="password">
        <input
          class="input"
          :type="eyeState2 ? 'text' : 'password'"
          name="email"
          :placeholder="$t('register.form.confirmPasswordPlaceholder')"
          v-model="form.repassword"
        />
        <image :src="eyeState2 ? open : close" @click="eyeState2 = !eyeState2" />
      </view>
      <view class="code">
        <input type="text" v-model="invite" name="code" :placeholder="$t('register.form.referrerIdPlaceholder')" />
      </view>
      <view class="agreement">
        <image
          v-if="re_check"
          src="../../static/image/re_check.png"
          @click="re_check = !re_check"
        />
        <view v-else class="check" @click="re_check = !re_check"></view>

        <view class="ty"
          >{{ $t('register.agreement.prefix') }}<span @click="applyShow = true">{{ $t('register.agreement.suffix') }}</span></view
        >
      </view>
      <view class="btn" @click="register()">{{$t('register.buttons.submit')}}</view>
    </view>

    <u-popup :show="applyShow" mode="bottom" round="20px" @close="close2" class="poup">
      <view class="poup_hed">
        <view></view>
        <view>使用协议</view>
        <image src="../../static/image/clor.png" @click="close2()" />
      </view>
      <view class="poup_bld">
        <div class="cont">
          <rich-text class="introduce" :nodes="content"></rich-text>
        </div>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      content: "",
      applyShow: false,
      loginState: false,
      re_check: false,
      select: false,
      codeState: false,
      text: this.$t('register.form.getCode'),
      eyeState: false,
      eyeState2: false,
      open: require("../../static/image/open.png"),
      close: require("../../static/image/clo.png"),
      form: {
        email: "",
        password: "",
        repassword: "",
        code: "",
        country: "中国",
        realName: "",
        username: "",
        ticket: "effef",
        randStr: "fefer",
      },
      invite: "",
    };
  },
  onshow() {},
  mounted() {
    this.getXY();
  },
  computed: {},
  onLoad() {
    if (this.$route.query.invite) {
      this.invite = this.$route.query.invite;
    }
  },
  methods: {
    async getXY() {
      let res = await this.$request.post("/news/ancillary/more/help/detail", {
        data: { id: 17 },
      });
      if (res.data.code == 0) {
        this.content = res.data.data.content;
      }
    },
    close2() {
      this.applyShow = false;
    },
    async register() {
      if (!this.form.email) {
        this.$api.msg("请输入邮箱地址");
        return;
      }
      if (!this.form.code) {
        this.$api.msg("请输入验证码");
        return;
      }
      if (!this.form.password || !this.form.repassword) {
        this.$api.msg("请输入密码");
        return;
      }
      if (this.form.password != this.form.repassword) {
        this.$api.msg("两次密码输入不相同");
        return;
      }
      if (!this.re_check) {
        this.$api.msg("请先阅读并同意使用协议");
        return;
      }
      if (this.loginState) {
        return;
      }
      this.loginState = true;
      uni.showLoading({
        title: "Loading",
      });

      this.form.realName = this.form.email;
      this.form.username = this.form.email;
      this.form.promotion = this.invite;
      let res = await this.$request.post("/uc/register/emailCode", {
        data: this.form,
      });
      if (res.data.code == 0) {
        uni.hideLoading();
        this.loginState = false;
        uni.showModal({
          content: "注册成功,是否去登录",
          confirmText: "确定",
          cancelText: "取消",
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({ url: "/pages/public/login" });
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          },
        });
      } else {
        this.$api.msg(res.data.message);
        uni.hideLoading();
        this.loginState = false;
      }
    },

    async setCode() {
      if (!this.form.email) {
        this.$api.msg("请输入邮箱地址");
        return;
      }
      if (this.codeState) {
        return;
      }
      this.codeState = true;

      uni.showLoading({
        title: "Loading",
      });

      let res = await this.$request.post("/uc/captcha/noAuth/sendCode", {
        data: {
          codeType: 1,
          type: 1,
          phoneOrEmail: this.form.email,
        },
      });
      if (res.data.code == 0) {
        this.$api.msg("发送成功");
        uni.hideLoading();
        let counter = 60;
        let timer = setInterval(() => {
          this.text = counter + "s";
          counter--;
          if (counter == -1) {
            clearInterval(timer);
            this.text = "获取验证码";
            this.codeState = false;
          }
        }, 1000);
      } else {
        this.$api.msg(res.data.message);
        uni.hideLoading();
        this.codeState = false;
      }
    },
    goLogin() {
      uni.navigateTo({ url: "/pages/public/login" });
    },
  },
};
</script>

<style scoped lang="less">
.login {
  padding: 0 20px;
  background: #000000;
  min-height: 100vh;
  .login_bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 378px;
  }
  .login_heard {
    padding-top: 60rpx;
    position: relative;
    z-index: 2;
    .logo {
      padding-top: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      image {
        width: 194rpx;
        height: 212rpx;
        display: block;
      }
    }
  }
  .close {
    margin-top: 14px;
    width: 24px;
    height: 24px;
  }
  .log_txt {
    margin-top: 100rpx;
    font-weight: 600;
    font-size: 65rpx;
    color: #ffffff;
    line-height: 78rpx;
    display: flex;
    align-items: flex-end;
    span {
      font-weight: 400;
      font-size: 32rpx;
      color: rgba(235, 235, 245, 0.6);
      line-height: 42rpx;
      margin-left: 10rpx;
    }
  }
  .email {
    margin-top: 40px;
    padding: 13px 12px;
    background: rgba(71, 76, 100, 0.3);
    border-radius: 20rpx;
    input {
      font-weight: 300;
      font-size: 14px;
      color: rgba(235, 235, 245, 0.6);
      line-height: 18px;
    }
  }
  .password {
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding: 13px 12px;
    background: rgba(71, 76, 100, 0.3);
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    input,
    .input {
      flex: 1;
      border: none;
      background: none;
      font-weight: 300;
      font-size: 14px;
      color: rgba(235, 235, 245, 0.6);
      line-height: 18px;
    }
    image {
      width: 20px;
      height: 20px;
    }
    .view {
      font-weight: bold;
      font-size: 14px;
      color: rgba(240, 196, 115, 1);
      line-height: 18px;
    }
  }
  .code {
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding: 13px 12px;
    background: rgba(71, 76, 100, 0.3);
    border-radius: 20rpx;
    input {
      flex: 1;
      font-weight: 300;
      font-size: 14px;
      color: rgba(235, 235, 245, 0.6);
      line-height: 18px;
    }
    image {
      width: 20px;
      height: 20px;
    }
  }
  .agreement {
    display: flex;
    align-items: center;
    margin-top: 20px;
    image {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
    .check {
      width: 16px;
      height: 16px;
      margin-right: 6px;
      border-radius: 2px;
      border: 1px solid #979797;
    }
    .ty {
      font-weight: 400;
      font-size: 14px;
      color: rgba(235, 235, 245, 0.6);
      line-height: 18px;
      span {
        color: rgba(240, 196, 115, 0.65);
      }
    }
  }
  .forget {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    view:nth-child(1) {
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      line-height: 19px;
    }
    view:nth-child(2) {
      font-weight: 400;
      font-size: 14px;
      color: #e9001a;
      line-height: 19px;
    }
  }
  .btn {
    margin-top: 32px;
    padding: 11px 0;
    text-align: center;
    background: #f0c473;
    border-radius: 27rpx;
    font-weight: 600;
    font-size: 16px;
    color: #000000;
    line-height: 22px;
  }
}

.poup_hed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 15px 11px;
  border-bottom: 1px solid rgba(151, 151, 151, 0.15);
  view {
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    line-height: 22px;
  }
  image {
    width: 20px;
    height: 20px;
  }
}
.poup_bld {
  padding: 0 16px 20px;
  margin-top: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .cont {
    height: 50vh;
    overflow-y: scroll;
  }
  .introduce {
    font-size: 28upx;
    color: #000;
    line-height: 50upx;
    /deep/ p {
      color: #000 !important;
    }
  }
}
/deep/ .u-modal__content__text {
  text-align: center;
}
/deep/ .u-transition {
  z-index: 998 !important;
}
</style>
