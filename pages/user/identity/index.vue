<template>
  <view class="page">
    <view class="navbar">
      <image
        @tap="goBack"
        class="back"
        src="../../../static/icons/icon-back-512.png"
        mode="scaleToFill"
      />
      <text class="title">信息認證</text>
    </view>

    <view class="content">
      <view class="box-wrapper">
        <view class="box1">
          <image
            class="logo"
            src="../../../static/image/identity-logo.png"
            mode="scaleToFill"
          />
          <view class="texts">
            <view>完成您的信息認證</view>
            <view>開啟Kings完全用戶權限</view>
          </view>
        </view>
        <view class="box2">
          <view class="title">轻松3步，即可獲得1000積分（≈$10）</view>
          <view class="steps">
            <view class="steps__box1">
              <view class="step">1</view>
              <view class="step">2</view>
              <view class="step">3</view>
            </view>
            <view class="steps__box2">
              <view>信息登記</view>
              <view>證件上傳</view>
              <view>照片上傳</view>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom">
        <view class="btn" @tap="$toPage('/pages/user/identity/steps/index')">
          <text>開始認證</text>
        </view>
        <text class="time">預計用時: 3分鐘</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    goBack() {
      uni.switchTab({ url: "/pages/index/index" });
    },
    async getRealNameStatus() {
      const resp = await this.$request.post("/finance/card/payInfoSummary");
      if (resp.data.code === 0) {
        const { realNameStatus } = resp.data.data;
        if (realNameStatus && realNameStatus !== 0) {
          uni.removeStorageSync("identity_data");
          return uni.switchTab({ url: "/pages/index/index" });
        }
      }
    },
  },
  watch: {},

  mounted() {},

  // 页面周期函数--监听页面加载
  onLoad() {
    this.getRealNameStatus();
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {},
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
};
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  padding: 56px 24px 0 24px;
  background: #000000;
  color: #fff;
  overflow-y: auto;

  .navbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 44px;

    .back {
      width: 20px;
      height: 20px;
    }

    .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-weight: 600;
      font-size: 18px;
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    min-height: calc(100vh - (56px + 44px));
    height: 100%;
    overflow-y: auto;

    .box-wrapper {
      display: flex;
      flex-direction: column;
      gap: 40px;

      .box1 {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
        height: 210px;
        background-color: #1f2029;
        border-radius: 18px;
        padding: 21px 24px 21px 0;

        .logo {
          width: 200px;
          height: 40px;
          margin-left: 24px;
        }

        .texts {
          margin-left: 30px;
          color: #e6ccaa;
          font-size: 20px;
          font-weight: 500;
          line-height: 28px;
        }
      }

      .box2 {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 14px;
        padding: 12px 16px 12px 16px;
        width: 100%;
        height: 132px;
        background-color: rgba(71, 76, 100, 0.15);
        border-radius: 18px;

        .title {
          text-align: center;
          font-size: 16px;
          color: #999;
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: 4px;

          &__box1 {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            height: 48px;
            border-radius: 49px;
            background: hsla(234, 20%, 60%, 0.2);
            padding: 4px;

            .step {
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 18px;
              color: #999;
              width: 40px;
              height: 40px;
              background-color: hsla(0, 0%, 0%, 0.5);
              border-radius: 50%;

              &:not(:last-child)::after {
                content: "";
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: -88px;
                width: 84px;
                height: 1px;
                border-top: 1px dashed hsla(0, 0%, 59%, 1);
              }
            }
          }

          &__box2 {
            display: flex;
            justify-content: space-between;
            color: hsla(0, 0%, 60%, 0.7);
            font-size: 12px;
            line-height: 17px;
            padding: 0 2px 0 2px;
          }

          // .step:nth-child(2) {
          //   position: relative;
          //   &::after {
          //     content: '';
          //     position: absolute;
          //     top: 50%;
          //     transform: translateY(-50%);
          //     left: -88px;
          //     width: 84px;
          //     height: 1px;
          //     border-top: 1px dashed hsla(0, 0%, 59%, 1);
          //   }
          //   &::before {
          //     content: '';
          //     position: absolute;
          //     top: 50%;
          //     transform: translateY(-50%);
          //     right: -88px;
          //     width: 84px;
          //     height: 1px;
          //     border-top: 1px dashed hsla(0, 0%, 59%, 1);
          //   }
          // }
        }
      }
    }

    .bottom {
      // flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-top: 192px;
      padding-bottom: env(safe-area-inset-bottom); // 底部安全区
      margin-bottom: env(safe-area-inset-bottom);

      .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 48px;
        border-radius: 14px;
        background: #f0c473;

        text {
          font-size: 17px;
          font-weight: 600;
          color: #000;
        }
      }

      .time {
        font-size: 14px;
        color: #999;
      }
    }
  }
}
</style>
