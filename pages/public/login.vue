<template>
  <view class="login">
    <view class="login_heard">
      <view class="log_txt">登入<span>帳戶，享受全球便捷消費</span></view>
      <view class="email">
        <input
          type="text"
          name="email"
          v-model="email"
          :placeholder="$t('login.form.emailPlaceholder')"
        />
      </view>
      <view class="password">
        <input
          class="input"
          name="email"
          v-model="password"
          :type="eyeState ? 'text' : 'password'"
          :placeholder="$t('login.form.passwordPlaceholder')"
        />
        <image
          :src="eyeState ? open : close"
          @click="eyeState = !eyeState"
        />
      </view>
      <view class="forget">
        <view @click="goRegister()">{{ $t('login.links.noAccountYet') }}</view>
        <view @click="goforget()">{{ $t('login.links.forgetPassword') }}</view>
      </view>
      <view class="agreement">
        <image
          v-if="re_check"
          src="../../static/image/re_check.png"
          @click="re_check = !re_check"
        />
        <view
          v-else
          class="check"
          @click="re_check = !re_check"
        ></view>
        <view class="ty">
          {{ $t('login.agreement.prefix')
          }}<span @click="setxieyi(211)">{{
            $t('login.agreement.terms')
          }}</span>
          {{ $t('login.agreement.and') }}
          <span @click="setxieyi(212)">{{
            $t('login.agreement.privacy')
          }}</span>
        </view>
      </view>
      <view
        class="btn"
        @click="login()"
      >
        {{ $t('login.buttons.submit') }}
      </view>
      <div class="down" @click="godown()">下载客户端app</div>
    </view>

    <u-popup
      :show="applyShow"
      mode="bottom"
      round="20px"
      @close="close2"
      class="poup"
    >
      <view class="poup_hed">
        <view></view>
        <view>{{ title }}</view>
        <image
          src="../../static/image/clor.png"
          @click="close2()"
        />
      </view>
      <view class="poup_bld">
        <div class="cont">
          <rich-text
            class="introduce"
            :nodes="content"
          ></rich-text>
        </div>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      content: '',
      applyShow: false,
      re_check: false,
      eyeState: false,
      open: require('../../static/image/open.png'),
      close: require('../../static/image/clo.png'),
      password: '',
      email: '',
      btndisabl: false,
    }
  },
  computed: {},
  onLoad() {},
  mounted() {
    const HCuname = uni.getStorageSync('HCuname') //缓存的密码
    const HCpassw = uni.getStorageSync('HCpassw') //有缓存就赋值给文本没有就清空
    if (HCuname && HCpassw) {
      this.email = HCuname
      this.password = HCpassw
    }
  },
  methods: {
    goRegister() {
      uni.navigateTo({ url: '/pages/register/register' })
    },
    goforget() {
      uni.navigateTo({ url: '/pages/user/forget' })
    },
    gohome() {
      uni.switchTab({
        url: '../index/index',
      })
    },
    godown() {
      uni.navigateTo({ url: '/pages/public/down' })
    },
    close2() {
      this.applyShow = false
    },

    async setxieyi(id) {
      if (id == 211) {
        this.title = '服务协议'
      } else {
        this.title = '隐私协议'
      }
      this.getXY(id)
      this.applyShow = true
    },

    async getXY(id) {
      let res = await this.$request.post('/news/ancillary/more/help/detail', {
        data: { id: id },
      })
      console.log(res)
      if (res.data.code == 0) {
        this.content = res.data.data.content
      }
    },

    async login() {
      if (!this.email) {
        this.$api.msg('请输入邮箱地址')
        return
      }
      if (!this.password) {
        this.$api.msg('请输入密码')
        return
      }
      if (!this.re_check) {
        this.$api.msg('请先阅读并同意使用协议')
        return
      }
      if (this.btndisabl) {
        return
      }
      this.btndisabl = true
      uni.showLoading({
        title: this.$t("common.loading"),
      })

      let data = {
        username: this.email,
        password: this.password,
      }
      let res = await this.$request.post('/uc/login', { data: data })
      if (res.data.code == 0) {
        uni.setStorageSync('token', res.data.data.token)

        await this.$request.post('/zhaotoubao-server/user/getIntegralBalance', {
          data: {
            base: {},
            param: {},
          },
        })

        uni.setStorageSync('HCuname', this.email)
        uni.setStorageSync('HCpassw', this.password)
        this.btndisabl = false
        uni.hideLoading()
        uni.switchTab({
          url: '../index/index',
        })
      } else {
        this.$api.msg(res.data.message)
        uni.hideLoading()

        this.btndisabl = false
      }
    },
  },
}
</script>

<style scoped lang="less">
.login {
  padding: 0 20px;
  background: #000000;
  min-height: 100vh;
  .login_heard {
    position: relative;
    z-index: 2;
  }
  .close {
    margin-top: 14px;
    width: 24px;
    height: 24px;
  }
  .log_txt {
    padding-top: 180rpx;
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
      color: #999999;
      line-height: 18px;
    }
  }
  .password {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    padding: 13px 12px;
    background: rgba(71, 76, 100, 0.3);
    border-radius: 20rpx;
    .input {
      flex: 1;
      font-weight: 300;
      font-size: 14px;
      color: #999999;
      line-height: 18px;
      border: none;
      background: none;
    }
    image {
      width: 20px;
      height: 20px;
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
      color: rgba(235, 235, 245, 0.4);
      line-height: 19px;
    }
    view:nth-child(2) {
      font-weight: 400;
      font-size: 14px;
      color: rgba(240, 196, 115, 1);
      line-height: 19px;
    }
  }
  .btn {
    margin-top: 86px;
    padding: 11px 0;
    text-align: center;
    background: rgba(240, 196, 115, 1);
    border-radius: 5px;
    font-weight: 600;
    font-size: 16px;
    color: #000000;
    line-height: 22px;
  }
  .down {
    text-align: center;
    margin-top: 20rpx;
    font-weight: 600;
    font-size: 14px;
    color: rgba(240, 196, 115, 1);
    line-height: 22px;
    display: flex;
    justify-content: center;
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
