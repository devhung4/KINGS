<template>
  <view class="container">
    <div class="app_bold">
      <div class="label">赠送用户邮箱</div>
      <div class="input">
        <input v-model="email" placeholder="请输入平台内用户邮箱" />
      </div>
      <div class="label">赠送权益</div>
      <div class="div">
        {{ name }}权益<span>（1年年费，内含{{ price }}红包）</span>
      </div>

      <div class="mess">
        *平台內贈送權益無手續費，請確認用戶邮箱與權益正確，一經轉出，平台無法操作退回。
      </div>
    </div>

    <div class="submit">
      <div @click="submit()">立即赠送</div>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      id: "",
      name: "",
      price: 0,
    };
  },
  onShow() {
    this.price =  uni.getStorageSync("giftprice");
    this.name = uni.getStorageSync("giftname");
    this.id = uni.getStorageSync("giftid");
  },
  mounted() {},
  methods: {
    async submit() {
      if (!this.email) {
        this.$api.msg("请输入用户邮箱");
        return;
      }
      uni.showLoading({
        title: "loading..",
        mask: true,
      });
      let res = await this.$request.post("/finance/card/exchangeGiftCard", {
        data: {
          id: this.id,
          email: this.email,
        },
      });
      uni.hideLoading();
      if (res.data.code == 0) {
        this.$api.msg("赠送成功");
        setTimeout(() => {
          uni.switchTab({
            url: "../index/index",
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
.container {
  min-height: 90vh;
  padding: 40rpx 32rpx;
  // background: #f5f6fa;
  .app_bold {
    .label {
      font-size: 24rpx;
      margin-bottom: 24rpx;
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
        color: #999999;
        line-height: 32rpx;
      }
    }

    .div {
      margin-bottom: 20rpx;
      border-radius: 16rpx;
      background: #f5f5f5;
      padding: 26rpx 24rpx;
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      line-height: 38rpx;
      span {
        color: rgba(102, 102, 102, 1);
        font-weight: 400;
      }
    }

    .mess {
      margin-top: 30rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: #f3343c;
      line-height: 32rpx;
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
      background: linear-gradient(135deg, #8776f9 0%, #b45ae0 100%);
      border-radius: 5px;
      font-weight: 600;
      font-size: 16px;
      color: #feffff;
      line-height: 22px;
    }
  }
}
</style>
