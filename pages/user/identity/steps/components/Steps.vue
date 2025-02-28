<template>
  <view class="steps">
    <view class="box1">
      <view class="step current">1</view>
      <view class="step">2</view>
      <view class="step">3</view>
    </view>
    <view class="box2">
      <text>信息登記</text>
      <text>證件上傳</text>
      <text>照片上傳</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Steps',
  props: {
    currentStep: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.steps {
  padding: 16px 12px 16px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 88px;
  border-radius: 18px;
  background: hsla(230, 17%, 34%, 0.15);
  .box1 {
    display: flex;
    justify-content: space-between;
    padding: 4px;
    width: 100%;
    height: 48px;
    background: hsla(234, 20%, 60%, 0.2);
    border-radius: 29px;
    .step {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #000000;
      color: #ffffff;
      font-weight: 500;
      font-size: 18px;
      &.current {
        color: #000000;
        background: #f0c473;
      }
    }
  }
  .box2 {
    display: flex;
    justify-content: space-between;
    color: hsla(0, 0%, 60%, 0.7);
    font-size: 12px;
    line-height: 17px;
    padding: 0 2px 0 2px;
  }
}
</style>
