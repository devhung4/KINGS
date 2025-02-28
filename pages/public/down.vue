<template>
  <view class="card_box">
    <image
      class="down_logo"
      src="../../static/black/down_logo.png"
      alt="" />
    <!-- <div class="btn" @click="download()">
      <image src="../../static/black/android.png" alt="" />
      <div>Android下载</div>
    </div> -->
    <view class="btn-group">
      <view
        class="android btn"
        @tap="download('android')">
        <image
          src="../../static/black/android.png"
          alt="" />
        <text>Android下載</text>
      </view>
      <view
        class="ios btn"
        @tap="download('ios')">
        <image
          src="../../static/black/apple.png"
          alt="" />
        <text>IOS下載</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  computed: {},
  data() {
    return {}
  },
  async onShow() {},
  methods: {
    download(os = 'android') {
      if (os === 'android') {
        window.open('https://r2.8.top/app/kings.apk')
      } else {
        window.open(
          'itms-services://?action=download-manifest&url=https://payfi.8.top/file/kings.plist'
        )
      }
    },
  },
}
</script>

<style lang="scss">
.card_box {
  background: #000;
  min-height: 100vh;
  padding-top: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .down_logo {
    width: 290.08rpx;
    height: 290.08rpx;
  }

  .btn-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 370rpx;
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 458rpx;
      padding: 24rpx;
      background: #f0c473;
      border-radius: 27rpx;
      text {
        font-weight: bold;
        font-size: 32rpx;
        color: #000000;
        line-height: 42rpx;
      }
      image {
        margin-right: 8rpx;
        width: 45.8rpx;
        height: 45.8rpx;
      }
    }
    .android {
    }
    .ios {
    }
  }
  // .btn {
  //   display: flex;
  //   align-items: center;
  //   margin-top: 370rpx;
  //   justify-content: center;
  //   width: 458rpx;
  //   padding: 24rpx;
  //   background: #f0c473;
  //   border-radius: 27rpx;
  //   div {
  //     font-weight: bold;
  //     font-size: 32rpx;
  //     color: #000000;
  //     line-height: 42rpx;
  //   }
  //   image {
  //     margin-right: 8rpx;
  //     width: 45.8rpx;
  //     height: 45.8rpx;
  //   }
  // }
}
</style>
