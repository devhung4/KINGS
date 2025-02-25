<template>
  <view class="cont">
    <view class="hed">
      <image class="mes" src="../../static/image/message.png" />
    </view>
    <div class="lab1">完成个人信息认证</div>
    <div class="lab2">开启Kings完全用户权限(开卡、兑换等)</div>
    <div class="lab3">3步即可获得1000积分(≈$10)</div>

    <div class="lab4">
      <div class="itm">
        <div>1</div>
        <span>信息登记</span>
      </div>
      <image class="step" src="../../static/image/step.png" />
      <div class="itm">
        <div>2</div>
        <span>证件上传</span>
      </div>
      <image class="step" src="../../static/image/step.png" />
      <div class="itm">
        <div>3</div>
        <span>照片上传</span>
      </div>
    </div>

    <div class="lab5" @click="goInfore()">开始认证</div>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {},
  onLoad() {},
  methods: {
    goInfore() {
      uni.navigateTo({ url: "/pages/user/Information" });
    },
  },
};
</script>

<style lang="scss">
image {
  display: block;
}
.cont {
  padding: 0 16px;
  // min-height: 100vh;
  .hed {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 48px;
    margin-bottom: 26px;
    image {
      width: 152px;
      height: 149px;
    }
  }

  .lab1 {
    font-weight: 400;
    font-size: 14px;
    color: #999999;
    line-height: 22px;
  }
  .lab2 {
    font-weight: 400;
    font-size: 14px;
    color: #999999;
    line-height: 22px;
  }
  .lab3 {
    margin-bottom: 45px;
    margin-top: 18px;
    font-weight: bold;
    font-size: 18px;
    color: #333333;
    line-height: 35px;
  }
  .lab4 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .itm {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        background: #ebeef6;
        font-weight: 400;
        font-size: 18px;
        color: #333333;
        line-height: 24px;
        border-radius: 50%;
      }
      span {
        margin-top: 12px;
        font-weight: 400;
        font-size: 12px;
        color: #333333;
        line-height: 16px;
      }
    }

    .step {
      width: 24px;
      height: 24px;
      display: block;
    }
  }
  .lab5 {
    margin-top: 56px;
    background: linear-gradient(135deg, #8776f9 0%, #b45ae0 100%);
    border-radius: 12px;
    padding: 12px 0;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    line-height: 22px;
    text-align: center;
  }
}
</style>
