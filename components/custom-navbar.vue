<template>
  <view class="custom-navbar">
    <view class="custom-navbar__left-area">
      <slot name="left"></slot>
    </view>
    <view class="custom-navbar__center-area">
      <slot name="center">
        <text>{{ title }}</text>
      </slot>
    </view>
    <view class="custom-navbar__right-area">
      <slot name="right"></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'custom-navbar',
  props: {
    title: {
      type: String,
      default: '页面标题',
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  background-color: #000000;
  height: 44px;

  &__center-area {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
  }
}
</style>
