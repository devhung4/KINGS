<template>
  <view class="container">
    <view class="heder">
      <child-component ref="drag"> </child-component>

      <view class="bala">
        <div class="ba_hed">
          <div class="ba_itm ba_it1">
            <div class="ba_1">
              <image src="../../static/black/jf.png" />
              <div>累積獲得積分</div>
            </div>
            <div class="ba_2">{{ balance }}</div>
            <!-- <div class="ba_3">(名義價值≈$109.1)</div> -->
          </div>
          <div class="ba_itm">
            <div class="ba_4">近30日累積積分</div>
            <div class="ba_5">≈{{ totalNumber }}</div>
          </div>
        </div>

        <div class="liushui" @click="goInter()">我的積分流水 ></div>
      </view>
    </view>

    <view class="assets">
      <div class="link">
        <div class="lef">
          <span>您的專屬邀請鏈接</span>
          <div>{{ Invite }}</div>
        </div>
        <div class="rig" @click="copyContent(Invite)">複製</div>
      </div>
    </view>

    <!-- <div class="chahua">
      <image src="../../static/black/sc.png" />
    </div> -->

    <div class="guanggao">
      <div class="guan_tit">
        <div>如何获取奖励</div>
        <!-- <span>更多积分奖励 ></span> -->
      </div>
      <div v-for="(item, index) in list" :key="index">
        <div class="guo_itm">
          <div class="itm_lef">
            <image src="../../static/black/lv.png" />
            <div>{{ item.type }}</div>
          </div>
          <div class="itm_rig">
            <div>送{{ item.experience }}積分</div>
            <!-- <span>（價值≈25U）</span> -->
          </div>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
import ChildComponent from "../public/hed.vue";

export default {
  components: {
    ChildComponent,
  },
  data() {
    return {
      Invite: "",
      balance: 0,
      totalNumber: 0,
      list: [],
    };
  },
  onShow() {
    this.setUser();
    this.price();
    this.setStatic();
    this.task();
    this.$refs.drag.init();
  },
  mounted() {},
  methods: {
    goInter() {
      uni.navigateTo({
        url: "/pages/points/Integral",
      });
    },
    async setUser() {
      let res = await this.$request.post("/uc/approve/security/setting");
      if (res.data.code == 0) {
        this.Invite =
          "https://payfi.8.top/pages/register/register?invite=" +
          res.data.data.bindPromotionCode;
      }
    },
    copyContent(item) {
      uni.setClipboardData({
        data: item,
        success: () => {
          uni.getClipboardData({
            success: (res) => {
              this.$api.msg("复制成功");
            },
          });
        },
      });
    },
    async price() {
      let res = await this.$request.post("/zhaotoubao-server/user/getIntegralBalance", {
        data: { base: {}, param: {} },
      });
      if (res.data.base.code == "000000") {
        this.balance = res.data.data.balance;
      }
    },
    async setStatic() {
      let res = await this.$request.post(
        "/zhaotoubao-server/user/getUserIntegrationStatistics",
        { data: { base: {}, param: {} } }
      );
      if (res.data.base.code == "000000") {
        this.totalNumber = res.data.data;
      }
    },

    async task() {
      let res = await this.$request.post(
        "/zhaotoubao-server/user/getUserExperienceTask",
        {
          data: { base: {}, param: {} },
        }
      );
      if (res.data.base.code == "000000") {
        // this.totalNumber = res.data.data;
        this.list = res.data.data.mission;
      }
    },
  },
};
</script>

<style scoped lang="less">
// page {
//   background-color: #f4f5f6;
//   height: 100%;
//   font-size: 14px;
//   line-height: 1.8;
// }
.container {
  min-height: 100vh;

  box-sizing: border-box;
  padding-top: 30px;
  display: flex;
  background: #000;
  flex-direction: column;
  // background: RGBA(248, 248, 248, 1);
}
.uni-navbar {
  height: 100rpx;
  background: #ffffff;
  box-shadow: 0 0 5px #888;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.heder {
  background: #000;
}
.bala {
  margin: 4px 16px 20px;
  background: rgba(31, 32, 41, 0.6);
  border-radius: 34rpx;
  padding: 8rpx 8rpx 25rpx;
  box-sizing: border-box;
  .ba_hed {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .ba_itm {
      height: 202rpx;
      box-sizing: border-box;
      padding: 22rpx 28rpx 14rpx;
      width: 49%;
      background: rgba(46, 47, 54, 0.6);
      border-radius: 27rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      .ba_1 {
        display: flex;
        align-items: center;
        image {
          width: 38.17rpx;
          height: 38.17rpx;
          margin-right: 6rpx;
        }
        div {
          font-weight: 400;
          font-size: 31rpx;
          color: rgba(0, 0, 0, 0.8);
          line-height: 40rpx;
        }
      }
      .ba_2 {
        font-weight: bold;
        margin-top: 10rpx;
        font-size: 61rpx;
        color: #000000;
        line-height: 86rpx;
      }
      .ba_3 {
        font-weight: 400;
        font-size: 27rpx;
        color: rgba(0, 0, 0, 0.8);
        line-height: 38rpx;
      }
      .ba_4 {
        font-weight: 400;
        font-size: 31rpx;
        color: rgba(230, 204, 170, 0.8);
        line-height: 40rpx;
      }
      .ba_5 {
        margin-top: 10rpx;
        font-weight: bold;
        font-size: 61rpx;
        color: #e6ccaa;
        line-height: 86rpx;
      }
    }
    .ba_it1 {
      background: #f0c473;
    }
  }
  .liushui {
    margin-top: 20rpx;
    font-weight: 400;
    font-size: 25rpx;
    color: rgba(235, 235, 245, 0.6);
    line-height: 34rpx;
    text-align: right;
  }
}
.chahua {
  margin: 20px 23rpx 0;
  image {
    width: 100%;
    height: 170rpx;
  }
}
.guanggao {
  padding: 8rpx;
  background: rgba(31, 32, 41, 0.6);
  border-radius: 34rpx;
  padding: 20rpx 10rpx 10rpx;
  margin: 20px 23rpx 0;
  .guan_tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10rpx;
    margin: 0 16rpx;
    div {
      font-weight: 400;
      font-size: 31rpx;
      color: #ffffff;
      line-height: 40rpx;
    }
    span {
      font-weight: 400;
      font-size: 25rpx;
      color: rgba(235, 235, 245, 0.6);
      line-height: 34rpx;
    }
  }
  .guo_itm {
    margin-top: 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(71, 76, 100, 0.1);
    border-radius: 27rpx;
    padding: 4rpx 4rpx 4rpx 23rpx;
    .itm_lef {
      display: flex;
      align-items: center;
      image {
        width: 45.8rpx;
        height: 45.8rpx;
        margin-right: 8rpx;
      }
      div {
        font-weight: 400;
        font-size: 29rpx;
        color: rgba(255, 255, 255, 0.6);
        line-height: 38rpx;
      }
    }
    .itm_rig {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-items: center;
      background: #453c32;
      border-radius: 23rpx;
      width: 229rpx;
      padding: 25rpx 0 25rpx;
      div {
        font-weight: 400;
        font-size: 27rpx;
        color: #ffffff;
        line-height: 38rpx;
      }
      span {
        font-weight: 400;
        font-size: 23rpx;
        color: #ffffff;
        line-height: 32rpx;
      }
    }
  }
}
.assets {
  margin: 0 23rpx;
  background: rgba(31, 32, 41, 0.6);
  border-radius: 34rpx;
  padding: 8rpx;
  .link {
    background: rgba(175, 175, 224, 0.1);
    border-radius: 27rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 38rpx;
    .lef {
      padding: 8rpx 0;
      width: 80%;
      span {
        font-weight: 400;
        font-size: 27rpx;
        color: #ffe08a;
        line-height: 40rpx;
      }
      div {
        font-weight: 300;
        font-size: 23rpx;
        color: #ffe08a;
        line-height: 31rpx;
      }
    }
    .rig {
      background: rgba(240, 196, 115, 0.8);
      padding: 20rpx 30rpx;
      font-weight: 400;
      font-size: 27rpx;
      color: #000000;
      line-height: 40rpx;
      border-radius: 27rpx;
    }
  }
}
</style>
