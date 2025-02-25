<template>
  <div class="transfer_box">
    <div class="navBox">
      <div class="back">
        <image
          src="../../static/image/go_back2.png"
          alt=""
          @click="goBack()" />
      </div>
      <div class="title">{{ $t('index.transfer.pageTitle') }}</div>
      <div class="div"></div>
    </div>

    <div class="bld">
      <div class="bld_itm">
        <div class="lab">
          <div>{{ $t('index.transfer.card') }}</div>
        </div>
        <div class="selsect">
          <picker
            mode="selector"
            :range="country"
            @change="onChange">
            <div class="down">
              <view class="picker"> {{ mailCountry }} </view>
              <image
                class="step"
                src="../../static/image/down.png" />
            </div>
          </picker>
        </div>

        <div class="lab">
          <div>{{ $t('index.transfer.depositAmount') }}</div>
          <div>
            <span>{{ $t('index.transfer.availableBalance') }}：</span>
            {{ price }} USDT
          </div>
        </div>
        <div class="selsect">
          <input
            @input="checkInput"
            type="number"
            :placeholder="$t('index.transfer.inputs.inputDepositAmount')"
            v-model="amount" />
          <span>USD</span>
          <div
            class="max"
            @click="setMax()">
            {{ $t('index.transfer.max') }}
          </div>
        </div>
      </div>

      <div class="zhuyi">{{ $t('index.transfer.attention.title') }}</div>
      <div class="cont">
        {{ $t('index.transfer.attention.description') }}
      </div>
    </div>

    <view class="apply_btn">
      <div class="shenqin">
        <div class="lef">
          <div>{{ $t('index.transfer.amountDue') }}</div>
          <div>{{ amount }} USDT</div>
          <div>{{ $t('index.transfer.handlingFee') }}：0.00USDT</div>
        </div>
        <div
          class="rig"
          @click="openPoup()">
          {{ $t('index.transfer.buttons.transferNow') }}
        </div>
      </div>
    </view>

    <u-popup
      :show="pasPoup"
      mode="center"
      round="20px"
      @close="pasPoup = false"
      class="pas_pop">
      <view class="poup_hed">
        <view></view>
        <view>支付密码</view>
        <image
          src="../../static/image/clor.png"
          @click="pasPoup = false" />
      </view>
      <view class="poup_bld">
        <div class="poup_tex">
          <div>为了保障您的账号安全，需要您输入支付密码</div>
        </div>
        <div class="input">
          <input
            type="password"
            placeholder="请输入支付密码"
            v-model="password" />
        </div>
        <view
          class="buy"
          @click="openCard()"
          >确认</view
        >
      </view>
    </u-popup>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      country: [],
      mailCountry: this.$t('index.transfer.inputs.choiceCard'),
      id: '',
      amount: '',
      price: 0,
      password: '',
      pasPoup: false,
      buyPrice: 0,
      buyState: false,
      cardLisd: [],
    }
  },
  props: [],
  mounted() {
    this.id = uni.getStorageSync('transferid')
    this.setprice()
    this.card()
  },
  methods: {
    checkInput(e) {
      // let value = e.target.value;
      // // 移除非数字字符和小数点，允许出现一个小数点，但不允许第一位是小数点
      // value = value.replace(/[^\d.]/g, "");
      // value = value.replace(/^(\d)\./g, "$1"); // 不允许首位是小数点
      // value = value.replace(/\.{2,}/g, "."); // 不允许出现多个小数点
      // value = value.replace(/^(\d+)\.(\d\d).*$/, "$1.$2"); // 限制小数点后最多两位数
      // this.$set(this, "amount", value);
      // this.amount = value;
    },
    async card() {
      this.country = []
      let res = await this.$request.post('/finance/card/findPhysicalCards', {
        data: {
          pageNo: 1,
          pageSize: 20,
          state: 3,
        },
      })
      if (res.data.code == 0) {
        this.cardLisd = res.data.data.content
        res.data.data.content.forEach((item) => {
          if (item.state == 3) {
            if (this.id == item.id) {
              this.mailCountry = item.payCardNo
            }
            let type =
              item.card.type == 1
                ? 'UnionPay'
                : item.card.type == 2
                ? 'MasterCard'
                : 'VISA'
            let payCarItem =
              type + ' | ' + item.card.name + ' | ' + item.payCardNo
            this.country.push(payCarItem)
          }
        })
      }
    },

    onChange(e) {
      let str = this.country[e.detail.value]
      let parts = str.split('| ')
      let lastPart = parts.pop()
      this.mailCountry = lastPart
    },

    async setprice() {
      let res = await this.$request.post('/uc/wallet/walletTotalData', {
        data: { coinId: 'USDT', accountType: 7 },
      })
      if (res.data.code == 0) {
        if (res.data.data.walletList)
          this.price = res.data.data.walletList[0].balance
      }
    },
    setMax() {
      this.amount = Number(this.price)
    },

    async openCard() {
      this.buyState = true

      uni.showLoading({
        title: 'Loading',
      })

      let res = await this.$request.post('/finance/card/cardRecharge', {
        data: {
          id: this.id,
          rechargeAmount: this.amount,
        },
      })
      uni.hideLoading()
      if (res.data.code == 0) {
        this.buyState = false
        this.pasPoup = false
        this.$api.msg('充值成功')
        this.setprice()
      } else {
        this.$api.msg(res.data.message)
        this.buyState = false
      }
    },
    goBack() {
      uni.navigateBack({
        delta: 1,
      })
    },
    openPoup() {
      if (!this.amount) {
        this.$api.msg('请输入充值金额')
        return
      }
      if (this.amount > this.price) {
        this.$api.msg('余额不足')
        return
      }
      this.cardLisd.forEach((item) => {
        if (item.state == 3) {
          if (this.mailCountry == item.payCardNo) {
            this.id = item.id
          }
        }
      })
      this.pasPoup = true
    },
    record() {
      uni.navigateTo({
        url: '../index/depositCoinsrecord',
      })
    },
  },
}
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

.bld {
  padding: 0 32rpx 24rpx;
  .bld_itm {
    box-shadow: 0rpx 2rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 16rpx;
    padding: 8rpx 0 48rpx;
    .lab {
      margin-top: 32rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      div {
        font-weight: 500;
        font-size: 24rpx;
        color: #fff;
        line-height: 32rpx;
      }
      span {
        color: rgba(153, 153, 153, 1);
      }
    }

    .input {
      margin-top: 20rpx;
      border-radius: 16rpx;
      border: 1rpx solid rgba(151, 151, 151, 0.5);
      padding: 26rpx 24rpx;
      font-size: 24rpx;
      input {
        border: none;
        background: none;
        flex: 1;
        font-size: 24rpx;
        width: 100%;
        font-weight: 400;
        color: #999999;
        line-height: 32rpx;
      }
    }

    .selsect {
      margin-top: 20rpx;
      border-radius: 16rpx;
      border: 1rpx solid rgba(151, 151, 151, 0.5);
      padding: 26rpx 24rpx;
      font-size: 24rpx;
      display: flex;
      align-items: center;
      .down {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .picker {
          font-weight: 400;
          font-size: 14px;
          color: #ccc;
          line-height: 19px;
        }
        image {
          width: 16px;
          height: 16px;
        }
      }
      .che {
        font-weight: 500;
        font-size: 24rpx;
        color: #ccc;
        line-height: 32rpx;
      }
      input {
        border: none;
        background: none;
        flex: 1;
        font-size: 24rpx;
        width: 100%;
        font-weight: 400;
        color: #fff;
        line-height: 32rpx;
      }

      span {
        display: block;
        padding: 0 20rpx;
        border-right: 1rpx solid rgba(151, 151, 151, 1);
        font-weight: bold;
        font-size: 28rpx;
        color: #999;
        line-height: 38rpx;
      }

      .max {
        padding-left: 20rpx;
        font-weight: 500;
        font-size: 28rpx;
        color: #f0c473;
        line-height: 38rpx;
      }
    }
  }

  .zhuyi {
    margin-top: 40rpx;
    font-weight: bold;
    font-size: 32rpx;
    color: #fff;
    line-height: 44rpx;
  }
  .cont {
    margin-top: 16rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #999999;
    line-height: 32rpx;
  }
}
.apply_btn {
  width: 100%;
  box-sizing: border-box;
  position: fixed;
  padding: 0 16px;
  bottom: 50rpx;
  left: 0;
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
</style>
