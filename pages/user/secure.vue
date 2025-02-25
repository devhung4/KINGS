<template>
  <div class="card_box">
    <div class="navBox">
      <div class="back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="title">{{ $t('user.secure.pageTitle') }}</div>
      <div class="div"></div>
    </div>
    <view class="container">
      <div class="box">
        <div class="lab1">{{ $t('user.secure.title') }}</div>
        <div class="lab2">{{ $t('user.secure.subtitle') }}</div>
        <div class="lab3">
          <div class="lab_lef">
            <image src="../../static/image/laber1.png" alt="" />
            <div>{{ $t('user.secure.option1') }}</div>
          </div>
          <image
            class="lab_rig"
            @click="godetail('modifypassword')"
            src="../../static/black/go.png"
            alt=""
          />
        </div>
        <div class="lab3" @click="godetail('setfund')">
          <div class="lab_lef">
            <image src="../../static/image/laber3.png" alt="" />
            <div>{{ $t('user.secure.option2') }}</div>
          </div>
          <image class="lab_rig" src="../../static/black/go.png" alt="" />
        </div>
        <!-- <div class="lab3">
          <div class="lab_lef">
            <image src="../../static/image/laber2.png" alt="" />
            <div>Google验证器</div>
          </div>
          <image class="lab_rig" src="../../static/black/go.png" alt="" />
        </div> -->
      </div>
    </view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
    };
  },
  onShow() {
    this.setUser();
  },
  mounted() {},
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },
    async setUser() {
      let res = await this.$request.post("/finance/card/payInfoSummary");
      if (res.data.code == 0) {
        this.userInfo = res.data.data;
      }
    },
    godetail(item) {
      if (item == "setfund") {
        if (this.userInfo.ifJyPassword == 1) {
          uni.navigateTo({ url: `/pages/user/changePassword` });
        } else {
          uni.navigateTo({ url: `/pages/user/${item}` });
        }
      } else {
        uni.navigateTo({ url: `/pages/user/${item}` });
      }
    },
  },
};
</script>

<style scoped lang="less">
.card_box {
  background: #000;
  min-height: 100vh;
  padding-top: 30px;
  box-sizing: border-box;
}
.navBox {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 15px;
  background: #000;

  .div,
  .rec {
    width: 76rpx;
    height: 76rpx;
  }

  .title {
    font-weight: bold;
  }

  .back {
    image {
      width: 76rpx;
      height: 76rpx;
      display: block;
    }
  }

  .record {
    width: 48rpx;
    height: 48rpx;
  }
}
.container {
  padding: 40rpx 32rpx;
  .box {
    background: rgba(46, 47, 54, 0.6);
    box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(0, 0, 0, 0.2);
    border-radius: 24rpx;
    border: 1rpx solid rgba(151, 151, 151, 0.2);
    padding: 24rpx 32rpx 8rpx;
    .lab1 {
      margin-bottom: 8rpx;
      font-weight: bold;
      font-size: 24rpx;
      color: #fff;
      line-height: 32rpx;
    }
    .lab2 {
      margin-bottom: 8rpx;
      font-weight: 400;
      font-size: 22rpx;
      color: #999999;
      line-height: 28rpx;
    }
    .lab3 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx 0 24rpx;
      border-bottom: 1rpx solid rgba(151, 151, 151, 0.2);
      .lab_lef {
        display: flex;
        align-items: center;
        image {
          width: 32rpx;
          height: 32rpx;
          margin-right: 8rpx;
        }
        div {
          font-weight: bold;
          font-size: 24rpx;
          color: #fff;
          line-height: 32rpx;
        }
      }
      .lab_rig {
        width: 46rpx;
        height: 46rpx;
      }
    }
    .lab3:last-child {
      border: none;
    }
  }
}
</style>
