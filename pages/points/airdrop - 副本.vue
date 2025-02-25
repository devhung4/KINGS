<template>
  <view class="container">
    <view class="heder">
      <child-component ref="drag"> </child-component>

      <view class="bala">
        <div class="ba_hed">
          <div class="ba_itm ba_it1">
            <div class="ba_1">
              <div>累積獲得空投價值</div>
            </div>
            <div class="ba_2">≈0</div>
          </div>
          <div class="ba_itm">
            <div class="ba_4">平台算力排名</div>
            <div class="ba_5">0</div>
          </div>
        </div>

        <div class="liushui">近30天領取的免費空投價值≈0</div>
      </view>
    </view>

    <!-- <div class="guanggao">
      <div class="guan_tit">
        <div>積分兌換空投權益</div>
        <span @click="godetail()">查看全部 ></span>
      </div>
      <div v-for="(item, index) in list" :key="index">
        <div class="guo_itm">
          <div class="itm_lef">
            <image src="../../static/black/lv.png" />
            <div>{{ item.name }}</div>
            <span>{{ item.blockchainNetwork }}</span>
          </div>
          <div class="itm_rig">
            <div class="lab1">
              <div class="div1">
                價值：<span>{{ item.valuation }}</span>
              </div>
              <div class="div2">
                {{ setTime(item.expireTime) }} <span>後權益過期</span>
              </div>
            </div>
            <div class="lab2" @click="duihuan()">兌換</div>
          </div>
        </div>
      </div>
    </div> -->

    <div class="chahua" @click="goqy()">
      <image src="../../static/black/sc.png" />
      <div>权益中心</div>
      <span>給好友贈送權益或兌換權益</span>
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
    this.task();
    this.$refs.drag.init();
  },
  mounted() {},
  methods: {
    goqy() {
      uni.navigateTo({
        url: "/pages/index/national",
      });
    },
    godetail() {
      uni.navigateTo({
        url: "/pages/points/detail",
      });
    },
    async task() {
      let res = await this.$request.post("/zhaotoubao-server/user/getIntegralStore", {
        data: {
          base: {},
          param: {
            offset: 1,
            count: 10,
          },
        },
      });
      if (res.data.base.code == "000000") {
        this.list = res.data.data;
      }
    },

    setTime(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hour = date.getHours().toString().padStart(2, "0");
      const minute = date.getMinutes().toString().padStart(2, "0");
      const second = date.getSeconds().toString().padStart(2, "0");
      return `${hour}:${minute}:${second}`;
    },
    duihuan() {},
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
  box-sizing: border-box;
  padding-top: 30px;
  min-height: 100vh;
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
  background: linear-gradient(
    180deg,
    rgba(71, 76, 100, 0.8) 0%,
    rgba(230, 204, 170, 0.8) 100%
  );
  border-radius: 34rpx;
  padding: 8rpx 8rpx 32rpx;
  box-sizing: border-box;
  .ba_hed {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .ba_itm {
      box-sizing: border-box;
      padding: 22rpx 28rpx 14rpx;
      width: 40%;
      background: #141418;
      border-radius: 27rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      .ba_1 {
        display: flex;
        align-items: center;
        div {
          font-weight: 400;
          font-size: 31rpx;
          color: rgba(235, 235, 245, 0.6);
          line-height: 40rpx;
        }
      }
      .ba_2 {
        margin-top: 20rpx;
        font-weight: 400;
        font-size: 61rpx;
        color: #f0c473;
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
        color: rgba(235, 235, 245, 0.6);
        line-height: 40rpx;
      }
      .ba_5 {
        margin-top: 20rpx;
        font-weight: 400;
        font-size: 53rpx;
        color: #18ce8b;
        line-height: 86rpx;
      }
    }
    .ba_it1 {
      width: 59%;
    }
  }
  .liushui {
    margin: 20rpx 0 0 20rpx;
    font-weight: 400;
    font-size: 27rpx;
    color: #000000;
    line-height: 38rpx;
  }
}
.chahua {
  position: relative;
  margin: 20px 23rpx 0;
  image {
    width: 100%;
    height: 170rpx;
  }
  div {
    position: absolute;
    top: 23rpx;
    left: 36rpx;
    font-weight: 600;
    font-size: 38rpx;
    color: #ffffff;
    line-height: 53rpx;
  }
  span {
    position: absolute;
    top: 90rpx;
    left: 36rpx;
    font-weight: 300;
    font-size: 23rpx;
    color: rgba(235, 235, 245, 0.6);
    line-height: 31rpx;
  }
}
.guanggao {
  padding: 20rpx 8rpx 8rpx 8rpx;
  background: rgba(31, 32, 41, 0.6);
  border-radius: 34rpx;
  padding: 20rpx 10rpx 10rpx;
  margin: 0 23rpx 0;
  .guan_tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10rpx;
    margin: 0 16rpx;
    div {
      font-weight: 600;
      font-size: 32rpx;
      color: rgba(235, 235, 245, 0.8);
      line-height: 42rpx;
    }
    span {
      font-weight: 400;
      font-size: 25rpx;
      color: rgba(235, 235, 245, 0.6);
      line-height: 34rpx;
    }
  }
  .guo_itm {
    margin-top: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(71, 76, 100, 0.1);
    border-radius: 27rpx;
    padding: 24rpx 16rpx 32rpx 24rpx;
    .itm_lef {
      display: flex;
      align-items: center;
      image {
        width: 45.8rpx;
        height: 45.8rpx;
        margin-right: 8rpx;
      }
      div {
        margin-right: 18rpx;
        font-weight: bold;
        font-size: 29rpx;
        color: #ffffff;
        line-height: 38rpx;
      }
      span {
        padding: 0 10rpx;
        display: block;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 8rpx;
        font-weight: bold;
        font-size: 21rpx;
        color: #000000;
        line-height: 31rpx;
        text-align: left;
      }
    }
    .itm_rig {
      display: flex;
      align-items: center;
      .lab1 {
        text-align: right;
        .div1 {
          font-weight: 400;
          font-size: 23rpx;
          color: rgba(255, 255, 255, 0.4);
          line-height: 31rpx;
          span {
            color: #fff;
          }
        }
        .div2 {
          margin-top: 5rpx;
          font-weight: 400;
          font-size: 23rpx;
          line-height: 31rpx;
          color: rgba(255, 91, 92, 1);

          span {
            margin-left: 4rpx;
            color: rgba(255, 255, 255, 0.4);
          }
        }
      }
      .lab2 {
        padding: 12rpx 30rpx;
        background: rgba(240, 196, 115, 0.8);
        border-radius: 19rpx;
        font-weight: 400;
        font-size: 27rpx;
        color: #000000;
        line-height: 38rpx;
        margin-left: 20rpx;
      }
    }
  }
}
</style>
