<template>
  <view class="card_box">
    <div class="navBox">
      <div class="back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="title">帮助中心</div>
      <div class="div"></div>
    </div>
    <div class="box">
      <div class="txt1">您好，{{ userInfo.email }}</div>
      <div class="txt2">我们随时为您提供帮助</div>
      <div class="txt3">
        <image src="../../static/image/hot.png" />
        <div>热门问题</div>
      </div>

      <div class="txt4">
        <div
          class="txt_itm"
          v-for="(item, index) in noticelist"
          :key="index"
          @click="godetail(item.id)"
        >
          <div>{{ item.title }}</div>
          <!-- <span>Updated on {{ item.createTime }}</span> -->
        </div>
      </div>
    </div>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {},
  data() {
    return {
      userInfo: {},
      noticelist: [],
      nlshow: "",
      pageNo: 1,
      pageSize: 10,
    };
  },
  async onShow() {
    this.setUser();
    this.setList();
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },
    godetail(id) {
      uni.setStorageSync("helpdetailid", id);
      uni.navigateTo({ url: "/pages/help/helpdetail?id=" + id });
    },
    async setUser() {
      let res = await this.$request.post("/finance/card/payInfoSummary");
      if (res.data.code == 0) {
        this.userInfo = res.data.data;
      }
    },
    async setList() {
      let res = await this.$request.post("/news/ancillary/system/help/new", {
        data: {},
      });
      if (res.data.code == 0) {
        this.noticelist = res.data.data;
      }
    },
  },
};
</script>

<style lang="scss">
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

  .rec,
  .div {
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
.box {
  padding: 0 32rpx 50rpx;
  .txt1 {
    margin-right: 16rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #fff;
    line-height: 40rpx;
  }
  .txt2 {
    font-weight: 400;
    font-size: 48rpx;
    color: #fff;
    line-height: 64rpx;
  }

  .txt3 {
    display: flex;
    align-items: center;
    margin-top: 66rpx;
    image {
      width: 40rpx;
      height: 40rpx;
    }
    div {
      margin-left: 14rpx;
      font-weight: bold;
      font-size: 32rpx;
      color: #fff;
      line-height: 44rpx;
    }
  }
  .txt4 {
    margin-top: 32rpx;
    padding: 16rpx 32rpx;
    background: rgba(46, 47, 54, 0.6);
    border-radius: 24rpx;
    .txt_itm {
      padding: 32rpx 0;
      border-bottom: 1rpx solid rgba(151, 151, 151, 0.2);
      div {
        font-weight: 400;
        font-size: 32rpx;
        color: #fff;
        line-height: 44rpx;
      }
      span {
        margin-top: 4rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #fff;
        line-height: 38rpx;
      }
    }
    .txt_itm:last-child {
      border: none;
    }
  }
}
</style>
