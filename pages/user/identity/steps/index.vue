<template>
  <view class="steps-page">
    <view class="navbar">
      <image class="back" @tap="goBack" src="../../../../static/icons/icon-back-512.png" mode="scaleToFill" />
      <text class="title">信息認證</text>
    </view>
    <Steps :currentStep="currentStep" />
    <view class="content">
      <Step1 v-if="currentStep === 0" :formData.sync="dataCollection" @step-change="handleStepChange"
        @update:step="updateStep" />
      <Step2 v-else-if="currentStep === 1" :formData.sync="dataCollection" @step-change="handleStepChange"
        @update:step="updateStep" />
      <Step3 v-else="currentStep === 2" :formData.sync="dataCollection" @step-change="handleStepChange"
        @update:step="updateStep" />
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
      allData: {},
      dataCollection: {}
    }
  },
  computed: {
    currentComp() {
      return `Step${this.currentStep + 1}`
    },
  },
  mounted() {},

  watch: {
    dataCollection: {
      handler(newVal) {
        uni.setStorageSync('identity_data', JSON.stringify(newVal))
      },
      deep: true
    }
  },

  methods: {

    updateStep(step, data) {
      if (Number.isNaN(step)) return
      if (!data) this.dataCollection = {}
      this.dataCollection = { ...this.dataCollection, ...data }
      this.currentStep = step
    },

    // restoreData() {
    //   try {
    //     const savedData = uni.getStorageSync('identity_data')
    //     if (savedData) {
    //       const parsedData = JSON.parse(savedData)
    //       this.dataCollection = parsedData || {}
    //     } else {
    //       this.dataCollection = {}
    //     }
    //   } catch (error) {
    //     console.error('恢复数据失败:', error)
    //     this.allData = {}
    //   }
    // },

    goBack() {
      if (this.currentStep === 0) {
        return uni.navigateTo({ url: '/pages/user/identity/index' })
      }
      if (this.currentStep === 1 || this.currentStep === 2) {
        this.currentStep--
        return
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
