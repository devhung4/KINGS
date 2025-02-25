<template>
  <view class="card_box">
    <view v-if="ifBuyPay == 1 && ifActivePay == 1">
      <view class="have">
        <view class="have_tit">Card 👋</view>
        <view class="back_box">
          <view class="bank_card">
            <image src="../../static/image/have2.png" class="have2" />
            <view class="bank_mess">
              <view>{{ cardMessage.payCardNo }}</view>
              <view>EXP.END：{{ cardMessage.expirationDate }}</view>
              <image src="../../static/image/have3.png" />
            </view>
            <view class="bank_btn">
              <view>C**</view>
              <view>{{ cardMessage.balance }} USD</view>
            </view>
          </view>
        </view>
      </view>
      <div class="tab_box">
        <div class="tab">
          <div class="tab_itm" @click="activated()">
            <image src="../../static/image/tab1.png" />
            <div>CVC</div>
          </div>
          <div class="tab_itm" @click="activated()">
            <image src="../../static/image/tab2.png" />
            <div>限额</div>
          </div>
          <div class="tab_itm" @click="bill()">
            <image src="../../static/image/tab3.png" />
            <div>账单</div>
          </div>
          <!-- <div class="tab_itm" @click="frozen()"> -->
          <div class="tab_itm" @click="activated()">
            <image src="../../static/image/tab4.png" />
            <div>冻结</div>
          </div>
        </div>
      </div>

      <div class="record">
        <div class="re_tit">
          <div class="re_lef">账单</div>
          <div class="re_rig">
            <div>2024年8月</div>
            <image src="../../static/image/down2.png" />
          </div>
        </div>

        <scroll-view style="height: 30vh" scroll-y @scrolltolower="scrolltolowerFnc">
          <div class="list_box" v-for="(item, index) in list" :key="index">
            <div class="itm">
              <div class="itm_le">
                <image src="../../static/image/bill1.png" />
                <div class="le_tit">
                  <div>消费</div>
                  <div>{{ item.createTime }}</div>
                </div>
              </div>
              <div class="itm_ri">
                <div>{{ item.amount }} {{ item.coinId }}</div>
                <div>成功</div>
              </div>
            </div>
          </div>
        </scroll-view>
      </div>
    </view>

    <view v-else>
      <view class="card_hed">
        <view class="card_tit">Card 👋</view>
        <view class="name">
          <view>卡片申请</view>
          <view>申请您的 Visa 卡，可在全球4400多万支持 Visa 的商家使用</view>
        </view>
      </view>
      <view class="card">
        <view
          :class="['card_itm', index == checkIndex ? 'check_card' : '']"
          v-for="(item, index) in cardList"
          :key="index"
          @click="checkIndex = index"
        >
          <view class="itm_hed">
            <image :src="item.logo" />
            <view class="itm_brice">
              <view>卡片费用</view>
              <view>
                <span>{{ cardPrice }}</span>
                .00 USDT
              </view>
            </view>
          </view>
          <view class="itm_name">{{ item.name }}</view>
          <view class="itm_span">{{ item.introduce }}</view>
          <view class="itm_support">
            <image :src="lab.image" v-for="(lab, inx) in item.support" :key="inx" />
          </view>

          <image :src="checkSign" class="checkSign" v-if="index == checkIndex" />
        </view>
      </view>

      <view class="btn">
        <view class="apply" @click="apply()">
          <view>立即申请</view>
          <image src="../../static/image/go.png" />
        </view>
      </view>
    </view>

    <u-popup :show="applyShow" mode="bottom" round="20px" @close="close" class="poup">
      <view class="poup_hed">
        <view></view>
        <view>立即购买</view>
        <image src="../../static/image/clor.png" @click="close()" />
      </view>
      <view class="poup_bld">
        <view class="laber">
          <image src="../../static/image/lab3.png" />
          <view>您需要支付</view>
        </view>
        <view class="sele3">
          <view>{{ cardPrice }}</view>
          <view>U</view>
        </view>

        <view class="price">
          <view>U余额：{{ price }}</view>
        </view>

        <view class="buy" @click="buy()">立即购买</view>
      </view>
    </u-popup>

    <u-modal
      :show="signOutShow"
      showCancelButton
      confirmColor="#FF5B13"
      title="温馨提示"
      content="您已购买卡片,是否去填写信息"
      confirmText="确认"
      cancelText="取消"
      @cancel="signOutShow = false"
      @confirm="signOut"
    >
    </u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pageNo: 1,
      fundfinished: false,
      list: [],
      price: "",
      email: "",
      cardMessage: {},
      signOutShow: false,
      cardPrice: 0,
      checkIndex: 0,
      applyShow: false,
      ifBuyPay: 0,
      ifActivePay: 0,
      checkCard: require("../../static/image/virtual_card.png"),
      checkSign: require("../../static/image/check_card.png"),
      cardList: [
        {
          name: "虚拟卡",
          logo: require("../../static/image/logo1.png"),
          introduce: "消费",
          support: [
            { image: require("../../static/image/support1.png") },
            { image: require("../../static/image/support2.png") },
            { image: require("../../static/image/support3.png") },
          ],
        },
        {
          name: "实体卡",
          logo: require("../../static/image/logo2.png"),
          introduce: "消费和取款",
          support: [
            { image: require("../../static/image/support1.png") },
            { image: require("../../static/image/support2.png") },
            { image: require("../../static/image/support3.png") },
            { image: require("../../static/image/support4.png") },
          ],
        },
      ],
    };
  },
  onShow() {
    this.signOutShow = false;
    this.applyShow = false;
    this.setPrice();
    this.cardInfo();
    this.getPrice();
    this.financeRecord();
  },
  created() {},
  mounted() {},
  methods: {
    async financeRecord() {
      let res = await this.$request.post("/uc/asset/wallet/financeRecord", {
        data: {
          pageNo: this.pageNo,
          pageSize: 10,
        },
      });
      if (res.data.code == 0) {
        let obj = res.data.data.content;
        if (this.pageNo == 1) {
          this.list = obj;
        } else {
          this.list = [...this.list, ...obj];
        }

        if (obj.length == 0 || obj.length < 10) {
          this.fundfinished = true;
        }
      }
    },
    signOut() {
      uni.navigateTo({
        url: "/pages/product/information",
      });
    },
    async apply() {
      if (this.ifBuyPay == 1 && this.ifActivePay == 0) {
        this.signOutShow = true;
      } else {
        this.applyShow = true;
      }
    },
    async setPrice() {
      let res = await this.$request.post("/uc/otc365/payInfoSummary");
      if (res.data.code == 0) {
        this.cardPrice = res.data.data.buyCardPayAmount;
        this.ifBuyPay = res.data.data.ifBuyPay;
        this.ifActivePay = res.data.data.ifActivePay;
        this.email = res.data.data.email;
      }
    },
    async cardInfo() {
      let res = await this.$request.post("/uc/otc365/cardInfo");
      if (res.data.code == 0) {
        this.cardMessage = res.data.data;
      }
    },
    async getPrice() {
      let res = await this.$request.post("/uc/wallet/walletTotalData", {
        data: { accountType: 7, coinId: "USDT" },
      });
      if (res.data.code == 0) {
        this.price = res.data.data.walletList[0].balance;
      }
    },
    close() {
      this.applyShow = false;
    },
    async buy() {
      let res = await this.$request.post("/uc/otc365/buyCard", {
        data: {
          amountA: this.cardPrice,
          coinA: "USDT",
        },
      });
      if (res.data.code == 0) {
        uni.navigateTo({
          url: "/pages/product/information",
        });
      } else {
        this.$api.msg(res.data.message);
      }
    },

    frozen() {},

    bill() {
      uni.navigateTo({
        url: "/pages/product/bill",
      });
    },

    activated() {
      this.$api.msg("暂未开通");
    },

    scrolltolowerFnc() {
      if (this.fundfinished) {
        return;
      }
      this.pageNo++;
      this.financeRecord();
    },
  },
};
</script>

<style lang="less" scope>
.card_box {
  background: #fff;
  min-height: 100%;
  padding-top: 30px;
  box-sizing: border-box;
}
.card_hed {
  background-image: url("../../static/image/card_hed.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-height: 378px;
  .name {
    display: flex;
    flex-direction: column;
    padding: 20px 16px 0;
    align-items: center;
    view:nth-child(1) {
      font-weight: 600;
      font-size: 24px;
      color: #333333;
      line-height: 32px;
      margin-bottom: 12px;
    }
    view:nth-child(2) {
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      line-height: 22px;
      letter-spacing: 2px;
      text-align: center;
    }
  }
}
.card_tit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(151, 151, 151, 0.2);
}
.card {
  margin-top: -200px;
  padding: 0 6px;
  .card_itm {
    position: relative;
    padding: 26px;
    background-image: url("../../static/image/physical_card.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .itm_hed {
      display: flex;
      align-items: center;
      justify-content: space-between;
      image {
        width: 56px;
        height: 56px;
      }
      .itm_brice {
        view:nth-child(1) {
          margin-bottom: 6px;
          font-weight: 400;
          font-size: 12px;
          color: #999999;
          line-height: 16px;
          text-align: right;
        }
        view:nth-child(2) {
          text-align: right;
          font-weight: 600;
          font-size: 14px;
          color: #9c47e3;
          line-height: 24px;
          span {
            font-size: 18px;
          }
        }
      }
    }
    .itm_name {
      margin: 10px 0 6px;
      font-weight: 600;
      font-size: 18px;
      color: #333333;
      line-height: 24px;
    }
    .itm_span {
      font-weight: 400;
      font-size: 12px;
      color: #999999;
      line-height: 16px;
    }
    .itm_support {
      margin-top: 16px;
      display: flex;
      align-items: center;
      image {
        width: 42px;
        height: 24px;
        margin-right: 12px;
      }
    }
  }
  .check_card {
    background-image: url("../../static/image/virtual_card.png");
    .checkSign {
      width: 58px;
      height: 40px;
      position: absolute;
      right: 2.8%;
      bottom: 10px;
    }
  }
}
.btn {
  padding: 50px 16px 20px;
  .apply {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background: linear-gradient(135deg, #8776f9 0%, #b45ae0 100%);
    border-radius: 5px;
    view {
      font-weight: 600;
      font-size: 16px;
      color: #feffff;
      line-height: 22px;
    }
    image {
      margin-left: 6px;
      width: 20px;
      height: 20px;
    }
  }
}
/deep/ .u-popup__content {
  background-image: url("../../static/image/poup_bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.poup_hed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 15px 11px;
  border-bottom: 1px solid rgba(151, 151, 151, 0.15);
  view {
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    line-height: 22px;
  }
  image {
    width: 20px;
    height: 20px;
  }
}
.poup_bld {
  padding: 0 16px 20px;
  .laber {
    margin-top: 16px;
    display: flex;
    align-items: center;
    image {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
    view {
      font-weight: 400;
      font-size: 14px;
      color: #999999;
      line-height: 19px;
    }
  }
  .sele,
  .sele3 {
    margin-top: 11px;
    display: flex;
    align-items: center;
    padding: 11px 14px 11px 16px;
    border: 1px solid RGBA(203, 203, 202, 1);
    border-radius: 20px;
    justify-content: space-between;
    view {
      font-weight: bold;
      font-size: 14px;
      color: #333333;
      line-height: 19px;
    }
    image {
      width: 20px;
      height: 20px;
    }
  }
  .sele3 {
    background: #f5f6f7;
    border-radius: 20px;
  }
  .sele2 {
    margin-top: 11px;
    display: flex;
    align-items: center;
    padding: 4px 4px 4px 16px;
    border: 1px solid RGBA(203, 203, 202, 1);
    border-radius: 20px;
    input {
      flex: 1;
      font-weight: 400;
      font-size: 14px;
      color: #999999;
      line-height: 19px;
    }
    .setcode {
      padding: 9px 11px;
      font-weight: 400;
      font-size: 12px;
      color: #ffffff;
      line-height: 16px;
      background: RGBA(156, 71, 227, 1);
      border-radius: 20px;
    }
  }
  .price {
    margin-top: 6px;
    display: flex;
    align-items: center;
    view:nth-child(1) {
      margin-right: 6px;
      font-weight: 400;
      font-size: 10px;
      color: #666666;
      line-height: 12px;
    }
    view:nth-child(2) {
      font-weight: 400;
      font-size: 10px;
      color: #9c47e3;
      line-height: 12px;
    }
  }

  .buy {
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background: linear-gradient(135deg, #8776f9 0%, #b45ae0 100%);
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    color: #feffff;
    line-height: 22px;
  }
}
/deep/ .u-modal__content__text {
  text-align: center;
}
.have {
  background-image: url("../../static/image/card_hed.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-height: 378px;
  .have_tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
  }
  .back_box {
    padding: 16px;
  }
  .bank_card {
    background-image: url("../../static/image/have1.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 19px 14px 25px 18px;
    .have2 {
      width: 68px;
      height: 21px;
    }
    .bank_mess {
      margin-top: 27px;
      position: relative;
      view:nth-child(1) {
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 20px;
        color: #ffffff;
        line-height: 27px;
      }
      view:nth-child(2) {
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        line-height: 19px;
      }
      image {
        width: 38px;
        height: 33px;
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    .bank_btn {
      margin-top: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      view:nth-child(1) {
        font-weight: 400;
        font-size: 12px;
        color: #ffffff;
        line-height: 16px;
      }
      view:nth-child(2) {
        font-weight: bold;
        font-size: 18px;
        color: #ffffff;
        line-height: 24px;
      }
    }
  }
}
.tab_box {
  margin-top: -110px;
  position: relative;
  z-index: 2;
  padding: 16px;
  .tab {
    background: #ffffff;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 10px 25px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .tab_itm {
      display: flex;
      flex-direction: column;
      align-items: center;
      image {
        width: 36px;
        height: 36px;
      }
      div {
        margin-top: 4px;
        font-weight: 400;
        font-size: 12px;
        color: #333333;
        line-height: 18px;
      }
    }
  }
}
.record {
  padding: 0 16px;
  .re_tit {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .re_lef {
      font-weight: bold;
      font-size: 16px;
      color: #333333;
      line-height: 22px;
    }
    .re_rig {
      display: flex;
      align-items: center;
      div {
        margin-right: 2px;
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        line-height: 20px;
      }
      image {
        width: 16px;
        height: 16px;
      }
    }
  }
  .list_box {
    padding: 2px;
    .itm {
      margin-bottom: 12px;
      background: #ffffff;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.15);
      border-radius: 5px;
      padding: 16px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .itm_le {
        display: flex;
        align-items: center;
        image {
          width: 36px;
          height: 36px;
          margin-right: 8px;
        }
        .le_tit {
          div:nth-child(1) {
            font-weight: bold;
            font-size: 14px;
            color: #000000;
            line-height: 20px;
          }
          div:nth-child(2) {
            margin-top: 6px;
            font-weight: 400;
            font-size: 11px;
            color: #999999;
            line-height: 14px;
          }
        }
      }
      .itm_ri {
        div:nth-child(1) {
          text-align: right;
          font-weight: bold;
          font-size: 16px;
          color: #000000;
          line-height: 19px;
          margin-bottom: 6px;
        }
        div:nth-child(2) {
          text-align: right;
          font-weight: 400;
          font-size: 11px;
          color: #10c300;
          line-height: 14px;
        }
      }
    }
  }
}
</style>
