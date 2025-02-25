<template>
  <div class="card_box">
    <div class="navBox">
      <div class="back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="title">资金密码</div>
      <div class="div"></div>
    </div>
    <view class="container">
      <div class="app_bold">
        <div class="label">资金密码</div>
        <div class="input">
          <input type="password" v-model="jyPassword" placeholder="资金密码" />
        </div>
        <div class="label">重复密码</div>
        <div class="input">
          <input type="password" v-model="upPawword" placeholder="重复密码" />
        </div>
      </div>

      <div class="submit">
        <div @click="submit()">保存</div>
      </div>
    </view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jyPassword: "",
      upPawword: "",
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
    async submit() {
      if (!this.jyPassword || !this.upPawword) {
        this.$api.msg("请输入密码");
        return;
      }
      if (this.jyPassword != this.upPawword) {
        this.$api.msg("两次密码不一致");
        return;
      }
      uni.showLoading({
        title: "loading..",
        mask: true,
      });
      let res = await this.$request.post("/uc/approve/transaction/password", {
        data: {
          jyPassword: this.jyPassword,
        },
      });
      uni.hideLoading();
      if (res.data.code == 0) {
        this.$api.msg("设置成功");
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
.card_box {
  background: #000;
  min-height: 100vh;
  padding-top: 30px;
  box-sizing: border-box;
}
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
  padding: 40rpx 32rpx;
  // background: #f5f6fa;
  .app_bold {
    .label {
      font-size: 24rpx;
      margin-bottom: 24rpx;
      color: #fff;
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
</style>
