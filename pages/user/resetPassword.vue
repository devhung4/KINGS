<template>
  <view class="container">
    <div class="navBox">
      <div class="back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="title">重置资金密码</div>
      <div class="div"></div>
    </div>
    <div class="app_bold">
      <div class="label">验证码</div>
      <div class="code">
        <div class="input">
          <input type="text" v-model="msgCode" placeholder="验证码" />
        </div>
        <div class="jsq" @click="setCode" v-if="setStatte">{{ label }}</div>
        <div class="jsq" v-else>{{ label }}</div>
      </div>
      <div class="label">新资金密码</div>
      <div class="input">
        <input type="password" v-model="newPassword" placeholder="新资金密码" />
      </div>
    </div>

    <div class="submit">
      <div @click="submit()">重置</div>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      jsp: "",
      submitState: true,
      setStatte: true,
      label: "发送验证码",
      msgCode: "",
      oldPassword: "",
      newPassword: "",
    };
  },
  onShow() {},
  mounted() {},
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },
    async setCode() {
      if (!this.setStatte) {
        return;
      }
      this.setStatte = false;
      uni.showLoading({
        title: "Loading",
      });
      let res = await this.$request.post("/uc/captchaAuth/sendCode", {
        data: {
          codeType: "11",
          type: "1",
        },
      });
      uni.hideLoading();
      if (res.data.code == 0) {
        this.label = 60;
        this.jsp = setInterval(() => {
          if (this.label <= 0) {
            this.label = "发送验证码";
            this.setStatte = true;
            clearInterval(this.jsp);
          } else {
            this.label = this.label - 1;
          }
        }, 1000);
      } else {
        this.setStatte = true;
        this.$api.msg(res.data.message);
      }
    },
    async submit() {
      if (!this.newPassword) {
        this.$api.msg("请输入密码");
        return;
      }
      if (!this.msgCode) {
        this.$api.msg("请输入验证码");
        return;
      }
      uni.showLoading({
        title: "loading..",
        mask: true,
      });
      let res = await this.$request.post("/uc/approve/reset/transaction/password", {
        data: {
          newPassword: this.newPassword,
          type: 1,
          code: this.msgCode,
          googleCode: "",
          codeType: 1,
        },
      });
      uni.hideLoading();
      if (res.data.code == 0) {
        this.$api.msg("重置成功");
        setTimeout(() => {
          uni.navigateBack({
            delta: 1, // 默认值是1，表示返回的页面层数
          });
        }, 1000);
      } else {
        this.$api.msg(res.data.message);
      }
    },
  },
};
</script>

<style scoped lang="less">
.navBox {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 15px;
  background: #000;

  .div,
  .rec {
    width: 76rpx;
    height: 76rpx;
  }

  .title {
    font-weight: bold;
  }

  .back {
    image {
      width: 76rpx;
      height: 76rpx;
      display: block;
    }
  }

  .record {
    width: 48rpx;
    height: 48rpx;
  }
}
.container {
  min-height: 100vh;
  padding: 40rpx 32rpx;
  background: #000;
  .app_bold {
    .label {
      font-size: 24rpx;
      margin-bottom: 24rpx;
    }
    .cz {
      margin-top: 10px;
      font-weight: 400;
      font-size: 28rpx;
      color: #f3343c;
      text-align: center;
    }
    .input {
      margin-bottom: 20rpx;
      border-radius: 16rpx;
      border: 1rpx solid rgba(151, 151, 151, 0.5);
      padding: 26rpx 24rpx;
      font-size: 24rpx;
      input {
        border: none;
        background: none;
        flex: 1;
        font-size: 24rpx;
        width: 100%;
        font-weight: 400;
        color: #fff;
        line-height: 32rpx;
      }
    }
  }

  .submit {
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    bottom: 40rpx;
    left: 0;
    padding: 0 32rpx;
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      background: #f0c473;
      border-radius: 5px;
      font-weight: 600;
      font-size: 16px;
      color: #000;
      line-height: 22px;
    }
  }
}
.code {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .input {
    width: 50%;
    margin-bottom: 0;
  }
  .jsq {
    width: 100px;
    padding: 5px 0;
    text-align: center;
    border: 1px solid #f0c473;
    color: #f0c473;
    border-radius: 10px;
  }
}
</style>
