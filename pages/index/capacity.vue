<template>
  <view class="capacity">
    <view class="header">
      <view class="header_left" @click="navidataBack()">
        <image src="../../static/btn_back_normal.png" mode=""></image>
      </view>
      <view class="header_tabs">
        <ul>
          <li :class="{ active: 0 === currentId }" @click="getenergylist(0)">
            能量升值轴
          </li>
          <li :class="{ active: 1 === currentId }" @click="getmyenery(1)">我的能量轴</li>
        </ul>
      </view>
      <view class="header_right"> </view>
    </view>
    <view class="content">
      <view class="energy_list" v-if="energy">
        <view class="energy" v-for="(item, index) in energyinfo" :key="index">
          <view class="energy_pic">
            <image :src="item.logo" mode=""></image>
          </view>
          <view class="energy_info">
            <view class="energy_title">
              <text>{{ item.name }}</text>
              <view class="energy_act">
                <view class="num">
                  <text class="sl">{{ item.userNum }}</text
                  >/{{ item.maxNum }}
                </view>
                <view
                  class="act"
                  v-if="index == 0"
                  v-show="energyactive"
                  @click="getbuyenery(item)"
                  >免费激活</view
                >
                <view
                  class="act energyactive"
                  v-if="index == 0"
                  v-show="!energyactive"
                  @click="getbuyenery(item)"
                  >已激活</view
                >
                <view class="act" v-else @click="convert(item)">立即兑换</view>
              </view>
            </view>
            <view class="show">
              <view class="show_title">
                <text>{{ item.remarkReward | introduceqian }}</text>
                <text>{{ item.remarkReward | introducehou }}</text>
              </view>
              <view class="golden_num">
                <image src="../../static/img/sell.png" mode=""></image>
                <text>{{ item.price }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="records" @click="exchange()" v-show="false">
          <text>查看兑换记录</text>

          <image src="../../static/img/icon_more_a.png" mode=""></image>
        </view>
      </view>

      <view class="me_energy" v-else>
        <view class="survey">
          <text>能量等级</text>
          <text>今日奖励(个)</text>
          <text>累计奖励(个)</text>
        </view>
        <view class="fire" v-for="(item, index) in userinfo" :key="index">
          <view class="fire_top">
            <view class="fire_left">
              <image :src="item.logo" mode=""></image>
              <text>{{ item.name }}</text>
            </view>
            <view class="fire_right">
              {{ item.amount }}
            </view>
            <view class="fire_right">
              {{ item.releaseAmount }}
            </view>
          </view>
          <view class="day">
            <text>{{ item.releaseDays }}天</text>
            <text>{{ item.days }}天</text>
          </view>
          <view class="slid">
            <progress :percent="percent" activeColor="#E84170" active stroke-width="8" />
          </view>
          <view class="fire_time"> 兑换时间：{{ item.sequence | timeStamp }} </view>
        </view>
      </view>
    </view>

    <view class="mask" v-show="attestation">
      <view class="attestation">
        <view class="att_title"> 实名认证后可激活试炼能量轴 </view>
        <view class="card">
          <image src="../../static/img/card.png" mode=""></image>
          <text>实名认证</text>
        </view>
        <view class="an">
          <view class="cancel" @tap="closeattestation"> 取消 </view>
          <view class="go" @tap="openeattestation"> 去认证 </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      energy: true,
      energyactive: true,
      percent: 0,
      attestation: false,
      energyinfo: [],
      refine: {},
      typelist: [
        {
          name: "能量升值轴",
        },
        {
          name: "我的能量轴",
        },
      ],
      currentId: 0,
      uid: "",
      userinfo: [],
      yonrz: 0,
    };
  },
  created() {},
  onLoad() {
    var userInfo = uni.getStorageSync("userInfo");
    this.uid = userInfo.userId;
    console.log(this.uid);
    this.getenergylist(0);
    this.getbuyenerya();
  },
  methods: {
    closeattestation() {
      this.attestation = false;
    },
    openeattestation() {
      uni.navigateTo({
        url: "../set/identity",
      });
    },
    navidataBack() {
      uni.navigateBack();
    },
    //查看兑换记录
    exchange() {
      uni.navigateTo({
        url: "../user/exchange",
      });
    },
    //能量轴列表
    async getenergylist(index) {
      this.currentId = index;
      let energylist = await this.$request.post("/energy/axis/list", {
        data: {
          uid: this.uid,
        },
      });
      console.log(energylist.data.data);
      this.energyinfo = energylist.data.data;
      if (this.energyinfo[0].userNum == this.energyinfo[0].maxNum) {
        this.energyactive = false;
      } else {
        this.energyactive = true;
      }
      this.energy = true;
      // var m = this.refine.remarkReward.split("，")
      // console.log(m[0])
    },
    //获取我的能量轴
    async getmyenery(index) {
      this.currentId = index;
      let energyuser = await this.$request.post("/energy/axis/user/list", {
        data: {
          uid: this.uid,
        },
      });
      console.log(energyuser.data.data);
      this.userinfo = energyuser.data.data;
      this.percent = energyuser.data.data.releaseDays;
      this.energy = false;
    },
    //购买能量轴
    async getbuyenerya() {
      let buyenery = await this.$request.post("/uc/info", {
        data: {
          uid: this.uid,
        },
      });
      if (buyenery.data.base.code == "000000") {
        this.yonrz = buyenery.data.data;
      }
    },
    async getbuyenery(eneryinfo) {
      if (this.yonrz == 0) {
        this.attestation = true;
      } else {
        uni.setStorageSync("eneryinfo", JSON.stringify(eneryinfo));
        uni.navigateTo({
          url: "./exchangeinfo",
        });
      }
    },
    //跳转兑换页面
    convert(eneryinfo) {
      uni.setStorageSync("eneryinfo", JSON.stringify(eneryinfo));
      uni.navigateTo({
        url: "./exchangeinfo",
      });
    },
  },
  filters: {
    introduceqian: function (value) {
      if (!value) return "";
      var m = value.split("，");
      var result = m[0];
      return result;
    },
    introducehou: function (value) {
      if (!value) return "";
      var m = value.split("，");
      var result = m[1];
      return result;
    },
    timeStamp: function (value) {
      //具体到时分秒
      if (!value) return "";
      var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var year = date.getFullYear();
      var month = ("0" + (date.getMonth() + 1)).slice(-2);
      var sdate = ("0" + date.getDate()).slice(-2);
      var hour = ("0" + date.getHours()).slice(-2);
      var minute = ("0" + date.getMinutes()).slice(-2);
      var second = ("0" + date.getSeconds()).slice(-2);
      // 拼接
      var result =
        year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second;
      // 返回
      return result;
    },
  },
};
</script>

<style lang="scss">
page {
  background: rgba(240, 240, 240, 1);
}

li {
  list-style: none;
}

ul {
  padding: 0;
}

.header {
  height: 120.2upx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18.2upx 30upx 20upx 30upx;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  top: 0;
  padding-top: var(--status-bar-height);
  width: 100%;
  background: #fff;
  z-index: 10;

  .header_left {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 30upx;

    image {
      width: 40upx;
      height: 40upx;
    }
  }

  .header_tabs {
    width: 80%;
    color: rgba(102, 102, 102, 1);

    ul {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;

      li {
        padding: 0 30upx;
        box-sizing: border-box;
        position: relative;
        font-size: 36upx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
  }

  .header_right {
  }
}

.active {
  color: rgba(51, 51, 51, 1);
}

.active::after {
  position: absolute;
  content: "";
  width: 30upx;
  bottom: -20upx;
  text-align: center;
  border-bottom: 10upx solid rgba(232, 65, 112, 1);
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
}

.content {
  margin-top: 120upx;
}

.energy_list {
  padding-top: 20upx;
}

.energy {
  padding: 40upx 30upx 40upx 40upx;
  box-sizing: border-box;
  background: #ffffff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20upx;

  .energy_pic {
    width: 45px;
    height: 57px;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .energy_info {
    margin-left: 38upx;
    width: 82%;

    .energy_title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      text {
        font-size: 32upx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }

      .energy_act {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .num {
          font-size: 24upx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(232, 65, 112, 1);

          .sl {
            color: #e84170;
            font-size: 24upx;
          }
        }

        .act {
          width: 152upx;
          height: 56upx;
          background: rgba(232, 65, 112, 1);
          border-radius: 4upx;
          text-align: center;
          line-height: 56upx;
          font-size: 28upx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(246, 246, 246, 1);
          margin-left: 10upx;
        }
      }
    }

    .show {
      font-size: 24upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .show_title {
        color: rgba(102, 102, 102, 1);

        text {
          display: block;
        }
      }

      .golden_num {
        color: rgba(232, 65, 112, 1);

        image {
          width: 18upx;
          height: 20upx;
        }
      }
    }
  }
}

.records {
  height: 106upx;
  font-size: 24upx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  text-align: center;
  line-height: 106upx;

  image {
    width: 10upx;
    height: 20upx;
    margin-left: 10upx;
  }
}

.energyactive {
  background: #f17c9d !important;
}

.me_energy {
  .survey {
    padding: 20upx 30upx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24upx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }

  .fire {
    background: #ffffff;
    padding: 30upx;
    box-sizing: border-box;

    .fire_top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .fire_left {
        font-size: 32upx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        display: flex;
        align-items: center;

        image {
          margin-right: 20upx;
          width: 46upx;
          height: 58upx;
        }
      }

      .fire_right {
        font-size: 40upx;
        font-family: DINCondensed-Bold, DINCondensed;
        font-weight: bold;
        color: rgba(232, 65, 112, 1);
      }
    }

    .day {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 24upx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
      margin-top: 30upx;
    }

    .slid {
      margin-top: 10upx;
      margin-bottom: 30upx;
    }

    .fire_time {
      font-size: 24upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
  }
}

.attestation {
  width: 580upx;
  height: 520upx;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  margin: 380upx auto 0;
  padding: 60upx 30upx 40upx;
  box-sizing: border-box;

  .att_title {
    font-size: 36upx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    text-align: center;
  }

  .card {
    text-align: center;
    margin-top: 30upx;
    margin-bottom: 60upx;

    image {
      width: 130upx;
      height: 130upx;
      margin-bottom: 30upx;
    }

    text {
      display: block;
      font-size: 28upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }

  .an {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .cancel {
      width: 240upx;
      height: 80upx;
      border-radius: 4upx;
      border: 2upx solid rgba(232, 65, 112, 1);
      text-align: center;
      line-height: 80upx;
      font-size: 32upx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(232, 65, 112, 1);
    }

    .go {
      width: 240upx;
      height: 80upx;
      background: rgba(232, 65, 112, 1);
      border-radius: 4upx;
      border: 2upx solid rgba(232, 65, 112, 1);
      text-align: center;
      line-height: 80upx;
      font-size: 32upx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>
