<template>
  <view class="steps">
    <view class="box1">
      <view
        :class="['step', getStepStatus(index)]"
        :key="index"
        v-for="(_, index) in 3">
        {{ index + 1 }}
      </view>
    </view>
    <view class="box2">
      <text
        v-for="(t, index) in stepTexts"
        :class="getTextStatus(index)"
        :key="index">
        {{ t }}
      </text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Steps',
  props: {
    currentStep: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      stepTexts: ['信息登記', '證件上傳', '照片上傳'],
    }
  },
  methods: {
    getStepStatus(index) {
      if (this.currentStep === index || this.currentStep === 2) {
        return 'current'
      } else if (this.currentStep === index + 1) {
        return 'completed'
      } else {
        return ''
      }
    },

    getTextStatus(index) {
      if (this.currentStep === index || this.currentStep === 2) {
        return 'active'
      } else if (this.currentStep === index + 1) {
        return 'completed'
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.steps {
  position: relative;
  padding: 16px 12px 16px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 88px;
  border-radius: 18px;
  margin-top: 16px;
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
      position: relative;
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
      &.completed {
        color: #000000;
        background: #f0c473;
      }
      &:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -88px;
        width: 84px;
        height: 1px;
        border-top: 1px dashed hsla(0, 0%, 59%, 1);
      }
      // &.current::after {
      //   border-top: 1px dashed #f0c473;
      // }
      // &.completed::after {
      //   border-top: 1px dashed #f0c473;
      // }
    }
  }
  .box2 {
    display: flex;
    justify-content: space-between;
    padding: 0 2px 0 2px;
    text {
      line-height: 17px;
      color: hsla(0, 0%, 60%, 0.7);
      font-size: 12px;
      &.active {
        color: #f0c473;
      }
      &.completed {
        color: #f0c473;
      }
    }
  }
}
</style>
