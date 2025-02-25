<template>
  <view class="card_box">
    <view>
      <view class="card_hed">
        <div class="navBox">
          <div class="back">
            <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
          </div>
          <div class="title">{{ $t('index.cardManage.pageTitle') }}</div>
          <div class="div"></div>
        </div>
        <div class="conduct">
          <div class="lef">
            <image src="../../static/image/conduct1.png" alt="" />
            <div>{{ $t('index.cardManage.openNewCard') }}</div>
          </div>
          <div class="rig" @click="goBard()">
            <div>{{ $t('index.cardManage.openCardNow') }}</div>
            <image src="../../static/image/conduct2.png" alt="" />
          </div>
        </div>

        <div class="box">
          <div v-if="cardList.length">
            <div class="item" v-for="(item, index) in cardList" :key="index">
              <div class="itm_lef">
                <image
                  :src="
                    userInfo.realNameStatus == 0 ? card2 : item.state == 3 ? card : card2
                  "
                  alt=""
                />
                <div>
                  <div>
                    {{
                      userInfo.realNameStatus == 0
                        ? item.card.name
                        : item.payCardNo
                        ? item.payCardNo
                        : item.card.name
                    }}
                  </div>
                  <span v-if="userInfo.realNameStatus == 0">{{ $t('index.cardManage.noRealName') }}</span>
                  <span v-else-if="item.state == 3">
                    {{ $t('index.cardManage.validDate', { date1: item.activeDate, date2: item.expirationDate } ) }}
                    <!-- 有效期：{{ item.activeDate }} 至 {{ item.expirationDate }} -->
                  </span>
                  <!-- <span v-else-if="item.state == 2">购买日期：{{ item.createTime }}</span> -->
                  <span v-else-if="item.state == 2">{{ $t('index.cardManage.buyAt', { buyAt: item.createTime }) }}</span>
                  <span v-else-if="item.state == -2">{{ $t('index.cardManage.expired') }}</span>
                  <span v-else>{{ $t('index.cardManage.審核中') }}</span>
                </div>
              </div>

              <div
                class="itm_rig2"
                v-if="userInfo.realNameStatus == 0"
                @click="gorouter()"
              >
                实名认证
              </div>
              <div
                class="itm_rig2"
                v-else-if="item.state == 1 && item.ifAddress != 1"
                @click="goaddress(item.id)"
              >
                填写地址
              </div>
              <div
                class="itm_rig2"
                v-else-if="item.state == 1 && item.ifAddress == 1"
                @click="goaddress(item.id)"
              >
                修改地址
              </div>
              <image
                @click="godetail(item.id)"
                class="itm_rig"
                v-else-if="item.state == 3"
                src="../../static/image/conduct3.png"
                alt=""
              />
              <div class="itm_rig2" v-else-if="item.state == -2">续费</div>
            </div>
          </div>

          <div class="kong" v-else>
            <image src="../../static/image/komg.png" />
            <div>無更多卡片</div>
          </div>
        </div>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cardList: [],
      card: require("../../static/image/conduct4.png"),
      card2: require("../../static/image/conduct5.png"),
      userInfo: {},
    };
  },
  onShow() {
    this.setCardList();
    this.setUser();
  },
  created() {},
  mounted() {},
  methods: {
    async setCardList() {
      let res = await this.$request.post("/finance/card/findPhysicalCards", {
        data: {
          pageNo: 1,
          pageSize: 20,
        },
      });
      if (res.data.code == 0) {
        this.cardList = res.data.data.content;
      }
    },

    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },

    gorouter() {
      uni.navigateTo({ url: "/pages/user/identity" });
    },

    goaddress(id) {
      uni.setStorageSync("addressid", id);
      uni.navigateTo({ url: "/pages/product/address2?id=" + id });
    },

    async setUser() {
      let res = await this.$request.post("/finance/card/payInfoSummary");
      if (res.data.code == 0) {
        this.userInfo = res.data.data;
      }
    },

    godetail(item) {
      uni.setStorageSync("cardDetailid", item);

      uni.navigateTo({
        url: "../product/cardDetail?id=" + item,
      });
    },
    goBard() {
      uni.navigateTo({
        url: "../product/openCard",
      });
    },
  },
};
</script>

<style lang="less" scope>
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
.card_hed {
  display: flex;
  flex-direction: column;

  .conduct {
    margin: 30rpx;
    padding: 30rpx 36rpx 32rpx 32rpx;
    display: flex;
    align-items: center;
    background: #474c64;
    border-radius: 34rpx;
    justify-content: space-between;
    .lef {
      display: flex;
      align-items: center;
      image {
        width: 78rpx;
        height: 78rpx;
        margin-right: 22rpx;
      }
      div {
        font-weight: 500;
        font-size: 32rpx;
        color: #ffffff;
        line-height: 44rpx;
      }
    }

    .rig {
      padding: 12rpx 24rpx;
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 28rpx;
      div {
        font-weight: 400;
        font-size: 24rpx;
        color: #451200;
        line-height: 32rpx;
        margin-right: 4rpx;
      }
      image {
        width: 24rpx;
        height: 24rpx;
      }
    }
  }
}

.box {
  margin: 0 32rpx;
  box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(0, 0, 0, 0.2);
  border-radius: 24rpx;
  padding: 8rpx 0 2rpx;
  box-sizing: border-box;
  .kong {
    padding: 60rpx 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    image {
      width: 165rpx;
      height: 134rpx;
    }
    div {
      margin-top: 10rpx;
      font-weight: 300;
      font-size: 23rpx;
      color: rgba(255, 255, 255, 0.6);
      line-height: 32rpx;
    }
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 14rpx;
    background: rgba(71, 76, 100, 0.25);
    border-radius: 27rpx;
    margin-bottom: 24rpx;

    .itm_lef {
      display: flex;
      align-items: center;
      image {
        width: 78rpx;
        height: 58rpx;
        margin-right: 16rpx;
      }
      div {
        font-weight: 600;
        font-size: 28rpx;
        color: #fff;
        line-height: 36rpx;
      }
      span {
        display: block;
        margin-top: 8rpx;
        font-family: MiSans, MiSans;
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        line-height: 36rpx;
      }
    }
    .itm_rig {
      width: 40rpx;
      height: 40rpx;
    }
    .itm_rig2 {
      padding: 12rpx 40rpx;
      border: 1px solid rgba(240, 196, 115, 0.8);
      border-radius: 30rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: rgba(240, 196, 115, 0.8);
      line-height: 32rpx;
    }
  }

  .item:last-child {
    border: none;
  }
}
</style>
