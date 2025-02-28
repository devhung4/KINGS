<template>
  <view class="steps-page">
    <view class="navbar">
      <image
        class="back"
        @tap="$goBack"
        src="../../../../static/icons/icon-back-512.png"
        mode="scaleToFill" />
      <text class="title">信息認證</text>
    </view>
    <view class="content"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.steps-page {
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
  }
}
</style>
