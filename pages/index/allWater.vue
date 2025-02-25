<template>
  <div class="transfer_box">
    <div class="navBox">
      <div class="back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="title">{{ $t("index.allWater.pageTitle") }}</div>
      <div class="div"></div>
    </div>
    <view class="container">
      <div class="team_box">
        <div v-if="waterList.length">
          <scroll-view @scrolltolower="scrolltolowerFnc">
            <view v-for="(item, index) in waterList" :key="index" class="coin_itm">
              <view class="itm_lef">
                <view class="coin_nmae">
                  <view>{{ setType(item.type) }}</view>
                  <view>{{ item.createTime }}</view>
                </view>
              </view>
              <view class="itm_rig">
                <view>{{ item.amount }}</view>
              </view>
            </view>
          </scroll-view>
        </div>
        <div class="kong" v-else>
          <image src="../../static/image/komg.png" />
          <div>{{ $t("index.allWater.empty") }}</div>
        </div>
      </div>
    </view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageNo: 1,
      waterList: [],
      fundfinished: false,
    };
  },
  onShow() {},
  mounted() {
    this.water();
  },
  methods: {
    scrolltolowerFnc() {
      if (this.fundfinished) {
        return;
      }
      this.pageNo++;
      this.water();
    },
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },
    async water() {
      let res = await this.$request.post("/uc/asset/wallet/financeRecord", {
        data: {
          pageNo: this.pageNo,
          pageSize: 20,
        },
      });
      if (res.data.code == 0) {
        let obj = res.data.data.content;
        if (this.pageNo == 1) {
          this.waterList = obj;
        } else {
          this.waterList = [...this.waterList, ...obj];
        }

        if (obj.length == 0 || obj.length < 10) {
          this.fundfinished = true;
        }
      }
    },
    setType(type) {
      let name = "";
      if (type == 39) {
        name = "开卡年费";
      } else if (type == 40) {
        name = "充值";
      } else if (type == 41) {
        name = "提币";
      } else if (type == 42) {
        name = "充值手续费团队收益";
      } else if (type == 43) {
        name = "赠卡花费";
      } else if (type == 44) {
        name = "开卡直推奖";
      } else if (type == 45) {
        name = "开卡团队收益";
      } else if (type == 47) {
        name = "充值卡片";
      } else if (type == 48) {
        name = "签证费用";
      }

      return name;
    },
  },
};
</script>

<style scoped lang="less">
.transfer_box {
  box-sizing: border-box;
  padding-top: 30px;
  min-height: 100vh;
  background: #000;
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
    width: 48rpx;
    height: 48rpx;
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
  padding: 12rpx 32rpx 32rpx;

  .team_box {
    margin-top: 24rpx;
    background: rgba(31, 32, 41, 0.6);
    box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(0, 0, 0, 0.2);
    border-radius: 24rpx;
    padding: 0 32rpx;
    .kong {
      padding: 100rpx 0;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      image {
        width: 165rpx;
        height: 150rpx;
      }
      div {
        margin-top: 10rpx;
        font-weight: 400;
        font-size: 24rpx;
        color: #fff;
        line-height: 24rpx;
      }
    }
    .coin_itm {
      padding: 32rpx 0 26rpx;
      border-bottom: 1px solid rgba(151, 151, 151, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      .itm_lef {
        display: flex;
        align-items: center;
        .coin_image {
          width: 32px;
          height: 32px;
          margin-right: 12px;
          border-radius: 50%;
        }
        .coin_nmae {
          view:nth-child(1) {
            font-weight: bold;
            font-size: 14px;
            color: #fff;
            line-height: 19px;
            margin-bottom: 4px;
          }
          view:nth-child(2) {
            font-weight: 300;
            font-size: 12px;
            color: #999;
            line-height: 16px;
          }
        }
      }
      .itm_rig {
        view:nth-child(1) {
          font-weight: bold;
          font-size: 14px;
          color: #fff;
          line-height: 19px;
          margin-bottom: 4px;
          text-align: right;
        }
        view:nth-child(2) {
          text-align: right;
          font-weight: 300;
          font-size: 12px;
          color: #999;
          line-height: 16px;
        }
      }
    }

    .coin_itm:last-child {
      border: none;
    }
  }
}
</style>
