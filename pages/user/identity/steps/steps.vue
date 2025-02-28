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

    <Steps style="margin-top: 16px" />

    <view class="content">

      <component
        :is="currentComp"
        @step-change="handleStepChange" />


      <view
        @tap="handleStepChange({ type: 'next'})"
        class="next-btn">
        <text>{{ currentStep === 2 ? '完成' : '下一步' }}</text>
      </view>

    </view>
  </view>
</template>

<script>
import Steps from './components/Steps.vue'
import Step1 from './components/Step1.vue'
import Step2 from './components/Step2.vue'
import Step3 from './components/Step3.vue'
export default {
  components: {
    Steps,
    Step1,
    Step2,
    Step3,
  },
  data() {
    return {
      currentStep: 0, // 當前認證步驟
    }
  },
  methods: {
    async handleStep() {
      const jsonData = JSON.stringify({
        Step1: {},
      })
      await uni.setStorageSync('stepsData', jsonData)
    },
  },
  computed: {
    currentComp() {
      return `Step${this.currentStep + 1}`
    },
  },
  methods: {
    async handleStepChange({ type, data }) {
      if (type === 'next') {
        // this.$set(this.formData, `step${this.currentStep + 1}`, data)
        if (this.currentStep < 2) {
          this.currentStep++
        } else {
          // this.submitAllData()
          console.log('步驟結束')
        }
      } else {
        this.currentStep--
      }
    },
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

  .next-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 48px;
    border-radius: 14px;
    background: #f0c473;
    margin-top: 40px;
    text {
      font-size: 17px;
      font-weight: 600;
      color: #000;
    }
  }
}
</style>
