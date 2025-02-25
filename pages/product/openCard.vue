<template>
  <view class="card_box">
    <view>
      <view class="card_hed">
        <div class="navBox">
          <div class="back">
            <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
          </div>
          <div class="title">{{ $t('product.openCard.pageTitle') }}</div>
          <div class="div"></div>
        </div>

        <view class="name">
          <div class="na_tit">
            <div
              @click="gocheck(index)"
              :class="check_index == index ? 'check' : ''"
              v-for="(item, index) in list"
              :key="index"
            >
              {{ item.name }}
            </div>
          </div>

          <swiper class="swip" :current="current" @change="swiperChange">
            <swiper-item v-for="(item, index) in list" :key="index">
              <view class="itm">
                <image :src="item.imgMax" />
              </view>

              <div class="itm_name">{{ item.name }}</div>
              <div class="itm_txt">{{ $t('product.openCard.attentions.text1') }}</div>
              <div class="itm_txt">
                {{ $t('product.openCard.attentions.text2', { point:  current == 0?'1-6%':current == 1?'2-12%':'4-24%'}) }}
              </div>
              <div class="itm_txt">{{ $t('product.openCard.attentions.text3') }}</div>
              <div class="itm_tit">
                {{ $t('product.openCard.attentions.text4') }}
              </div>
            </swiper-item>
          </swiper>
        </view>

        <view class="apply_btn">
          <div class="rz" v-if="realNameStatus == 0">
            <div class="lef">
              <div class="top">
                <image src="../../static/black/rz.png" alt="" />
                <div>KYC用户认证</div>
              </div>
              <div class="bottom">完成KYC，獲得100積分獎勵，開啟更多用户權限</div>
            </div>
            <image
              class="rig"
              @click="gorenzhe()"
              src="../../static/black/rig.png"
              alt=""
            />
          </div>
          <div class="shenqin">
            <div class="lef">
              <div>{{ $t('product.openCard.bottom.openCardAnnualFee') }}</div>
              <div>{{ buyPrice }} USDT</div>
              <div>
                {{ $t('product.openCard.bottom.originPrice') }}：<span>{{ rundPrice }} USDT</span>
              </div>
            </div>
            <div class="rig" @click="shenqin()">{{ $t('product.openCard.bottom.applyNow') }}</div>
          </div>
        </view>
      </view>

      <!-- <view class="btn">
        <view class="apply" @click="apply()">
          <view>立即申请</view>
          <image src="../../static/image/go.png" />
        </view>
      </view> -->
    </view>

    <u-popup :show="applyShow" mode="bottom" round="20px" @close="close" class="poup">
      <view class="poup_hed">
        <view></view>
        <view>{{ $t('product.openCard.forms.title') }}</view>
        <image src="../../static/image/clor.png" @click="close()" />
      </view>
      <view class="poup_bld">
        <div class="laber">{{ $t('product.openCard.forms.payAmount') }}</div>
        <div class="price2">
          <div>{{ buyPrice }}</div>
          <span>USDT</span>
        </div>

        <div class="invite">
          <div>{{ $t('product.openCard.forms.openCardInterests.title') }}</div>
          <div>{{ $t('product.openCard.forms.openCardInterests.text1') }}</div>
          <div>{{ $t('product.openCard.forms.openCardInterests.text2', { point:current == 0?'1-6%':current == 1?'2-12%':'4-24%' }) }}</div>
          <div>{{ $t('product.openCard.forms.openCardInterests.text3') }}</div>
          <div>{{ $t('product.openCard.forms.openCardInterests.text4') }}</div>
        </div>

        <div class="xieyi">
          <div class="bd" v-if="!checkImg" @click="checkImg = true"></div>
          <image
            v-else
            src="../../static/image/ok2.png"
            @click="checkImg = false"
            alt=""
          />
          <div class="sp">{{ $t('product.openCard.forms.agreement.prefix') }}<span>{{ $t('product.openCard.forms.agreement.suffix') }}</span></div>
        </div>

        <view class="buy" @click="buy()">{{ $t('product.openCard.forms.confirmPay') }}</view>
      </view>
    </u-popup>

    <u-popup
      :show="pasPoup"
      mode="center"
      round="20px"
      @close="pasPoup = false"
      class="pas_pop"
    >
      <view class="poup_hed">
        <view></view>
        <view>支付密码</view>
        <image src="../../static/image/clor.png" @click="pasPoup = false" />
      </view>
      <view class="poup_bld">
        <div class="poup_tex">
          <div>为了保障您的账号安全，需要您输入支付密码</div>
        </div>
        <div class="input">
          <input type="password" placeholder="请输入支付密码" v-model="password" />
        </div>
        <view class="buy" @click="openCard()">确认</view>
      </view>
    </u-popup>

    <u-modal
      :show="signOutShow"
      showCancelButton
      confirmColor="#FF5B13"
      title="温馨提示"
      content="您暂未设置资金密码,是否去设置"
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
      visaNumber: 1,
      selectedValue: "已持有签证",
      visa: ["已持有签证", "未持有签证"],
      check_index: 0,
      buyState: false,
      cardID: "",
      password: "",
      pasPoup: false,
      checkImg: false,
      buyPrice: 0,
      rundPrice: 0,
      current: 0,
      pageNo: 1,
      fundfinished: false,
      list: [],
      price: "",
      signOutShow: false,
      cardPrice: 0,
      checkIndex: 0,
      applyShow: false,
      ifBuyPay: 0,
      ifActivePay: 0,
      ifVisa: 0,
      ifJyPassword: 0,
      realNameStatus: 0,
    };
  },
  onShow() {
    this.signOutShow = false;
    this.applyShow = false;
    this.getPrice();

    this.setCard();
    this.setUser();
  },
  created() {},
  mounted() {},
  methods: {
    async setUser() {
      let res = await this.$request.post("/finance/card/payInfoSummary");
      if (res.data.code == 0) {
        this.ifVisa = res.data.data.ifVisa;
        this.ifJyPassword = res.data.data.ifJyPassword;
        this.ifJyPassword = res.data.data.ifJyPassword;
        this.realNameStatus = res.data.data.realNameStatus;
      }
    },
    gorenzhe() {
      uni.navigateTo({ url: "/pages/user/identity" });
    },

    shenqin() {
      if (this.realNameStatus == 0) {
        this.$api.msg("请先进行KYC认证");
        return;
      }
      this.applyShow = true;
    },
    signOut() {
      uni.navigateTo({
        url: "/pages/user/setfund",
      });
    },

    gocheck(index) {
      this.check_index = index;
      this.current = index;
    },

    onChange(e) {
      if (e.detail.value == 0) {
        this.visaNumber = 1;
      } else {
        this.visaNumber = 2;
      }
      this.selectedValue = this.visa[e.detail.value];
    },

    swiperChange(e) {
      this.current = e.detail.current;
      this.check_index = e.detail.current;
      this.buyPrice = this.list[e.detail.current].annualFee;
      this.rundPrice = this.list[e.detail.current].originalPrice;
      this.cardID = this.list[e.detail.current].id;
    },

    async setCard() {
      let res = await this.$request.post("/finance/card/physicalCardAll", {
        data: { memberId: "" },
      });
      if (res.data.code == 0) {
        this.list = res.data.data.content;
        this.buyPrice = res.data.data.content[0].annualFee;
        this.rundPrice = res.data.data.content[0].originalPrice;
        this.cardID = res.data.data.content[0].id;
      }
    },
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },
    async apply() {
      if (this.ifBuyPay == 1 && this.ifActivePay == 0) {
        this.signOutShow = true;
      } else {
        this.applyShow = true;
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
      if (!this.checkImg) {
        this.$api.msg("请先阅读并同意开卡协议");
        return;
      }
      if (this.ifJyPassword == 0) {
        this.signOutShow = true;
      } else {
        this.applyShow = false;
        this.pasPoup = true;
      }
    },

    async openCard() {
      if (!this.password) {
        this.$api.msg("请输入支付密码");
        return;
      }

      if (this.buyState) {
        return;
      }

      this.buyState = true;

      uni.showLoading({
        title: "Loading",
      });

      let res = await this.$request.post("/finance/card/buyPhysicalCard", {
        data: {
          ifVisa: this.visaNumber == 1 ? 1 : 2,
          cardId: this.cardID,
          fundPassword: this.password,
        },
      });
      uni.hideLoading();
      if (res.data.code == 0) {
        this.buyState = false;
        this.$api.msg("购买成功");
        setTimeout(() => {
          uni.navigateBack({
            delta: 1, // 默认值是1，表示返回的页面层数
          });
        }, 1000);
      } else {
        this.$api.msg(res.data.message);
        this.buyState = false;
      }
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
.card_hed {
  // min-height: 100vh;
  display: flex;
  flex-direction: column;
  .name {
    display: flex;
    position: relative;
    flex: 1;
    box-sizing: border-box;
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
    .na_tit {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 32rpx;
      justify-content: space-between;
      padding: 4rpx;
      border-radius: 24rpx;
      border: 2rpx solid #f0c473;
      div {
        width: 50%;
        padding: 16rpx 0;
        text-align: center;
        font-weight: 400;
        font-size: 28rpx;
        color: #f0c473;
        box-sizing: border-box;
        line-height: 36rpx;
      }
      .check {
        background: #f0c473;
        border-radius: 20rpx;
        color: #000;
        font-weight: bold;
      }
    }
  }
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
  margin-top: 32rpx;
  .laber2 {
    font-weight: 400;
    font-size: 28rpx;
    color: rgba(51, 51, 51, 1);
    line-height: 36rpx;
  }
  .laber3 {
    margin-top: 12rpx;
    font-weight: 400;
    font-size: 20rpx;
    color: #e9001a;
    line-height: 26rpx;
  }
  .price2 {
    margin-top: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f5f6f7;
    border-radius: 16rpx;
    border: 1rpx solid rgba(151, 151, 151, 0.5);
    padding: 24rpx;
    margin-bottom: 32rpx;
    div {
      font-weight: bold;
      font-size: 24rpx;
      color: #222222;
      line-height: 32rpx;
    }
    span {
      font-weight: bold;
      font-size: 24rpx;
      color: #222222;
      line-height: 32rpx;
    }
  }
  .xiala {
    margin-top: 20rpx;
    background: rgba(245, 245, 245, 0);
    border-radius: 16rpx;
    border: 1rpx solid rgba(151, 151, 151, 0.5);
    padding: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      font-weight: bold;
      font-size: 24rpx;
      color: #222222;
      line-height: 32rpx;
    }
    image {
      width: 28rpx;
      height: 28rpx;
    }
  }
  .poup_tex {
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      width: 100%;
      text-align: center;
      font-weight: 400;
      font-size: 28rpx;
      color: #444444;
      line-height: 40rpx;
    }
  }
  .input {
    margin-top: 20px;
    padding: 20rpx;
    border: 1px solid #ccc;
    border-radius: 10rpx;
    font-size: 24rpx;
    input {
      font-size: 24rpx;
    }
  }
  .invite {
    background: #f5f6f7;
    border-radius: 24rpx;
    border: 1rpx solid rgba(151, 151, 151, 0.5);
    padding: 24rpx;
    div {
      font-weight: 400;
      font-size: 28rpx;
      line-height: 40rpx;
      color: #999999;
    }

    div:nth-child(1) {
      margin-bottom: 40rpx;
    }
  }

  .xieyi {
    display: flex;
    align-items: center;
    margin-top: 20rpx;
    .bd {
      width: 32rpx;
      height: 32rpx;
      margin-right: 12rpx;
      border-radius: 4rpx;
      box-sizing: border-box;
      border: 2rpx solid #979797;
    }
    image {
      width: 32rpx;
      height: 32rpx;
      margin-right: 12rpx;
    }
    .sp {
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
      line-height: 36rpx;
      span {
        color: rgba(24, 74, 242, 1);
      }
    }
  }
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
    background: #f0c473;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    color: #000;
    line-height: 22px;
  }
}
/deep/ .u-modal__content__text {
  text-align: center;
}
/deep/ .u-transition {
  z-index: 998 !important;
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

.swip {
  width: 100%;
  height: 500px;
  .itm {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 40rpx;
    image {
      display: block;
      width: 100%;
      height: 350rpx;
    }
  }

  .itm_name {
    padding-top: 9px;
    font-weight: 600;
    font-size: 18px;
    color: #fff;
    line-height: 24px;
    margin-bottom: 5px;
  }

  .itm_txt {
    font-weight: 400;
    font-size: 12px;
    color: #86909e;
    line-height: 22px;
  }
  .itm_tit {
    margin-top: 20px;
    font-weight: 400;
    font-size: 12px;
    color: #86909e;
    line-height: 22px;
  }
}

.apply_btn {
  width: 100%;
  box-sizing: border-box;
  position: fixed;
  padding: 0 16px;
  bottom: 50rpx;
  left: 0;

  .rz {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(71, 76, 100, 0.7);
    border-radius: 34rpx;
    padding: 20rpx 12rpx 20rpx 30rpx;
    margin-bottom: 20rpx;
    .lef {
      .top {
        display: flex;
        align-items: center;
        image {
          width: 45.8rpx;
          height: 45.8rpx;
        }
        div {
          margin-left: 4rpx;
          font-weight: 600;
          font-size: 29rpx;
          color: #ffffff;
          line-height: 38rpx;
        }
      }
      .bottom {
        font-weight: 300;
        font-size: 23rpx;
        color: rgba(255, 255, 255, 0.6);
        line-height: 31rpx;
      }
    }
    .rig {
      width: 61.07rpx;
      height: 61.07rpx;
    }
  }
  .shenqin {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .lef {
      display: flex;
      flex-direction: column;
      text-align: left;
      div:nth-child(1) {
        font-weight: 400;
        font-size: 18rpx;
        color: #86909e;
        line-height: 24rpx;
      }
      div:nth-child(2) {
        padding: 4px 0;
        font-weight: 600;
        font-size: 28rpx;
        color: #fff;
        line-height: 38rpx;
      }
      div:nth-child(3) {
        font-weight: 400;
        font-size: 18rpx;
        color: #86909e;
        line-height: 24rpx;
        span {
          text-decoration: line-through;
        }
      }
    }
    .rig {
      padding: 20rpx 116rpx;
      background: #f0c473;
      font-weight: 600;
      font-size: 32rpx;
      color: #000;
      line-height: 44rpx;
      border-radius: 18rpx;
    }
  }
}

.pas_pop {
  width: 90%;
}
</style>
