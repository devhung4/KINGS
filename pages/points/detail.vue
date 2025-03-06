<template>
  <div class="transfer_box">
    <div class="navBox">
      <div class="left back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="center">兑换列表</div>
      <!-- <div class="right" @tap="toHistoryPage">歷史兌換</div> -->
    </div>

    <div class="transfer_center">
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
            <div class="lab2" @click="duihuan(item.id)">兌換</div>
          </div>
        </div>
      </div>
    </div>

    <CustomModal
      @cancel="clean"
      title="請先選擇地址"
      ref="addressPicker"
      mode="bottom"
    >
      <view class="address-list">
        <view
          :key="item.id"
          v-for="item in $store.state.userAddress"
          class="address-list__item">
          <view
            @tap="onChecked(item)"
            :class="[
              'address-list__item-checkbox',
              address !== null && address.id === item.id ? 'checked' : '' ]">
            <text v-if="address">&#10003;</text>
          </view>
          <text class="address-list__item-text">{{ item.address }}</text>
        </view>
      </view>
      <view @tap="confirm" class="confirm-btn">确认兑换</view>
    </CustomModal>
  </div>
</template>

<script>
import UQRCode from "uqrcodejs";
import CustomModal from "../../components/custom-modal.vue";

export default {
  components: {
    CustomModal,
  },
  data() {
    return {
      list: [],
      shopId: "",
      address: null,
    };
  },
  props: [],
  mounted() {
    this.task();
    this.$store.dispatch("fetchUserCardList", this.$request);
    this.$store.dispatch("fetchUserAddress", this.$request);
  },
  methods: {
    toHistoryPage() {
      uni.navigateTo({
        url: "/pages/points/history",
      });
    },
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },
    onChecked(address) {
      if (this.address) {
        this.address = null;
        return;
      }
      this.address = address;
    },
    updateAddress(address) {
      console.log(address);
    },
    async task() {
      let res = await this.$request.post(
        "/zhaotoubao-server/user/getIntegralStore",
        {
          data: {
            base: {},
            param: {
              offset: 1,
              count: 10,
            },
          },
        }
      );
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
    async duihuan(id) {
      if (!id) return;
      // 1. 需要查询用户账号下是否有开卡
      const hasCards = this.$store.state.userHasCards;
      // 2. 无开卡，提示用户是否要去开卡
      if (!hasCards) {
        return uni.showModal({
          title: "開卡即可兌換空頭",
          // content: '開卡即可兌換空頭',
          showCancel: true,
          success: ({ confirm, cancel }) => {
            if (confirm) {
              uni.navigateTo({ url: "/pages/product/openCard" });
            }
          },
        });
      } else {
        // 3. 有开卡，执行兑换逻辑
        this.shopId = id;
        // 打开选择地址模态框
        this.$refs.addressPicker.open();
      }
    },
    async confirm() {
      if (!this.address) {
        return uni.showToast({
          title: "请选择地址",
          icon: "none",
          mask: true,
        });
      } else {
        uni.showLoading({
          title: "加載中...",
          mask: true,
        });
        const resp = await this.$request.post(
          "/zhaotoubao-server/exchange/exchangeAdd",
          {
            data: {
              base: {},
              param: {
                id: this.shopId,
                address: this.address.address,
              },
            },
          }
        );

        if (resp.data.base.code === "0000") {
          this.clean();
          uni.hideLoading();
          uni.showToast({
            title: "兌換成功",
            icon: "success",
            mask: true,
          });
        } else {
          this.clean();
          uni.hideLoading();
          uni.showToast({
            title: "兌換失敗",
            icon: "error",
            mask: true,
          });
        }
      }
    },
    clean() {
      this.shopId = null;
      this.address = null;
      this.$refs.addressPicker.close();
    },
  },
};
</script>

<style scoped lang="scss">
.transfer_box {
  box-sizing: border-box;
  padding-top: 30px;
  min-height: 100vh;
  background: #000;
}

.qrcode {
  display: inline-block;
  width: 140px;
  height: 140px;
  background-color: #fff;
  padding: 6px;
  box-sizing: border-box;
}

.navBox {
  color: #fff;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 11px 15px;
  background: #000;

  .left {
    justify-self: start;
  }

  .right {
    justify-self: end;
    color: #8b8b8f;
  }

  .center {
    grid-column: 2;
    text-align: center;
    margin: 0 auto;
    font-weight: bold;
  }

  .back {
    image {
      width: 76rpx;
      height: 76rpx;
      display: block;
    }
  }

  span {
    font-weight: 400;
    font-size: 28rpx;
    color: #f0c473;
    line-height: 38rpx;
  }
}

.transfer_box {
  position: relative;

  .transfer_center {
    padding: 0 30rpx 20rpx;

    .guo_itm {
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(31, 32, 41, 0.6);
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

  .address-list {
    display: flex;
    gap: 15px;

    // padding: 24px;
    &__item {
      gap: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: row-reverse;

      &-checkbox {
        width: 28px;
        height: 28px;
        border-radius: 4px;
        background: transparent;
        border: 1px solid #f9f9f9;
        display: flex;
        justify-content: center;
        align-items: flex-start;

        &.checked {
          background: #f0c473;
          border: none;

          text {
            color: #000;
          }
        }

        text {
          font-size: 20px;
          line-height: 20px;
        }
      }

      &-text {
        width: 100%;
        font-size: 16px;
        line-height: 16px;
        word-wrap: break-word;
        word-break: break-all;
        // text-align: center;
      }
    }
  }

  .confirm-btn {
    width: 100%;
    height: 48px;
    border-radius: 8px;
    background: #f0c473;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 36px;
    font-size: 16px;
    font-weight: 600;
    color: #000;
  }
}
</style>
