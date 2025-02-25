<template>
  <div class="transfer_box">
    <div class="navBox">
      <div class="back">
        <image
          src="../../static/image/go_back2.png"
          alt=""
          @click="goBack()" />
      </div>
      <div class="title">{{ $t('giftCard.pageTitle') }}</div>
      <image
        class="rec"
        src="../../static/image/zk.png"
        alt=""
        @click="goqy()" />
    </div>

    <div class="bld">
      <div v-if="!success">
        <!-- <div class="conduct">
          <div class="lef">
            <div>给好友赠卡，可获得最高21000积分奖励</div>
          </div>
        </div> -->

        <div class="card_box">
          <div class="hed_1">1、選擇你想送的卡片</div>
          <div class="hed_2">
            <div
              :class="select == index ? 'select' : ''"
              v-for="(item, index) in list"
              :key="index"
              @click="setCheck(item, index)">
              {{ item.name }}
            </div>
          </div>
          <image
            class="hed_9"
            :src="list[select].imgMax"
            alt=""
            @click="goBack()" />

          <div></div>
          <div class="hed_3">2、额外给好友加个红包</div>
          <div class="hed_4">好友激活卡片後，紅包將自動充值到好友帳戶</div>
          <div class="hed_5">
            <input
              type="number"
              inputmode="numeric"
              v-model="amount"
              placeholder="请自行输入想赠送的金额" />
          </div>

          <div class="hed_6">*購買後權益未送出不會過期、不可退款。</div>
          <div class="hed_6">
            *購卡後您將獲得一個兌換碼，好友自行兌換即可激活
          </div>
        </div>

        <view class="apply_btn">
          <div class="shenqin">
            <div class="lef">
              <div>预计支付金额</div>
              <div>{{ buyPrice }} USDT</div>
            </div>
            <div
              class="rig"
              @click="applyShow = true">
              立即购买
            </div>
          </div>
        </view>
      </div>

      <div
        v-else
        class="succe">
        <div class="succ_1">
          恭喜获得-
          <span>{{ succItem.name }}</span>
          权益
        </div>
        <div class="succ_2">
          （1年年费，内含{{ succItem.redEnvelopeAmount }}红包）
        </div>
        <image
          class="succ_3"
          :src="succItem.card.img"
          alt="" />
        <div class="succ_4">
          <div>兌換碼：{{ succItem.redemptionCode }}</div>
          <image
            @click="copyContent(succItem.redemptionCode)"
            src="../../static/image/coppy.png"
            alt="" />
        </div>
        <div class="succ_5">
          【好友兌換流程】
          下載App-登入帳號-完成個人信息認證-進入開卡頁面-點擊兌換開卡-輸入兌換碼-激活成功
        </div>
        <div
          class="succ_6"
          @click="gogift()">
          赠送好友
        </div>
        <div class="succ_7">后续可在 <span>权益」- 赠卡权益中</span> 查看</div>
      </div>
    </div>

    <u-popup
      :show="applyShow"
      mode="bottom"
      round="20px"
      @close="close"
      class="poup">
      <view class="poup_hed">
        <view></view>
        <view>确认支付</view>
        <image
          src="../../static/image/clor.png"
          @click="close()" />
      </view>
      <view class="poup_bld">
        <div class="laber">卡片类型</div>
        <div class="input">
          {{ cardName }}
        </div>
        <div class="laber">红包金额</div>
        <div class="input">
          {{ amount }}
        </div>
        <div class="laber">支付金额</div>
        <div class="input">
          {{ Number(amount) + Number(buyPrice) }}
        </div>
        <div class="laber">
          <div>账户余额</div>
          <span>{{ price }}</span>
        </div>

        <view
          class="buy"
          @click="buy()"
          mode="bottom">
          确认支付
        </view>
      </view>
    </u-popup>

    <!-- 输入支付密码 -->
    <u-popup
      :show="pasPoup"
      mode="center"
      round="20px"
      @close="pasPoup = false"
      class="pas_pop">
      <view class="poup_hed">
        <view></view>
        <view>资金密码</view>
        <image
          src="../../static/image/clor.png"
          @click="pasPoup = false" />
      </view>
      <view class="poup_bld">
        <div class="poup_tex">
          <div>为了保障您的账号安全，需要您输入资金密码</div>
        </div>
        <div class="input">
          <input
            type="password"
            placeholder="请输入资金密码"
            v-model="password" />
        </div>
        <view
          class="buy"
          @click="openCard()">
          确认
        </view>
      </view>
    </u-popup>

    <!-- 立即购买模态框 -->
    <!-- <custom-modal
      title="确认支付"
      ref="buyNowRef"
      mode="bottom"
      confirmText="确认支付"
      cancelText="取消"
      showCancelButton
      showConfirmButton
      @confirm="buy">
      <view class="buy-now-info">
        <view class="buy-now-info__item">
          <text class="buy-now-info__item__left-area">卡片類型</text>
          <text class="buy-now-info__item__right-area">{{ cardName }}</text>
        </view>
        <view class="buy-now-info__item">
          <text class="buy-now-info__item__left-area">紅包金額</text>
          <text>{{ amount }}</text>
        </view>
        <view class="buy-now-info__item">
          <text class="buy-now-info__item__left-area">支付金額</text>
          <text class="buy-now-info__item__right-area">
            {{ Number(amount) + Number(buyPrice) }}
          </text>
        </view>
        <view class="buy-now-info__item">
          <text class="buy-now-info__item__left-area">賬戶餘額</text>
          <text class="buy-now-info__item__right-area">{{ price }}</text>
        </view>
      </view>
    </custom-modal> -->
  </div>
</template>

<script>
import CustomModal from '../../components/custom-modal.vue'
export default {
  components: {
    CustomModal,
  },
  data() {
    return {
      succItem: {
        card: {},
      },
      success: false,
      password: '',
      amount: 0,
      price: 0,
      applyShow: false,
      pasPoup: false,
      select: 0,
      list: [],
      cardID: '',
      cardName: '',
      buyPrice: 0,
      buyState: false,
      payInfoSummary: {},
    }
  },
  props: [],
  onShow() {
    this.getPrice()
    this.setCard()
    this.getPayInfoSummary()
  },
  methods: {
    setCheck(item, index) {
      this.select = index
      this.cardID = item.id
      this.buyPrice = item.annualFee
      this.cardName = item.name
    },

    // 获取用户的支付信息
    async getPayInfoSummary() {
      const res = await this.$request.post('/finance/card/payInfoSummary')
      const code = res.data.code
      if (!Number.isNaN(code) && code === 0) {
        const data = res.data.data
        Object.assign(this.payInfoSummary, data)
      }
    },

    async getPrice() {
      let res = await this.$request.post('/uc/wallet/walletTotalData', {
        data: { accountType: 7, coinId: 'USDT' },
      })
      if (res.data.code == 0) {
        this.price = res.data.data.walletList[0].balance
      }
    },
    async setCard() {
      let res = await this.$request.post('/finance/card/physicalCardAll', {
        data: { memberId: '' },
      })
      if (res.data.code == 0) {
        this.list = res.data.data.content
        this.buyPrice = res.data.data.content[0].annualFee
        this.cardID = res.data.data.content[0].id
        this.cardName = res.data.data.content[0].name
      }
    },

    async buy() {
      if (this.payInfoSummary && this.payInfoSummary.ifJyPassword === 0) {
        this.applyShow = false
        uni.showModal({
          title: '请先设置支付密码',
          content: '',
          showCancel: true,
          success: ({ confirm, cancel }) => {
            if (confirm) {
              uni.navigateTo({ url: '/pages/user/setfund' })
            }
          },
        })
        return
      }
      if (!this.amount + this.buyPrice > this.price) {
        this.$api.msg('余额不足')
        return
      }
      this.applyShow = false
      this.pasPoup = true
    },

    copyContent(item) {
      uni.setClipboardData({
        data: item,
        success: () => {
          uni.getClipboardData({
            success: (res) => {
              this.$api.msg('复制成功')
            },
          })
        },
      })
    },

    async openCard() {
      if (!this.password) {
        this.$api.msg('请输入支付密码')
        return
      }

      if (this.buyState) {
        return
      }

      this.buyState = true

      uni.showLoading({
        title: 'Loading',
      })

      let res = await this.$request.post('/finance/card/buyGiftCard', {
        data: {
          cardId: this.cardID,
          redEnvelopeAmount: this.amount,
          fundPassword: this.password,
        },
      })
      uni.hideLoading()
      if (res.data.code == 0) {
        this.buyState = false
        this.pasPoup = false
        this.$api.msg('购买成功')
        this.getPrice()
        this.success = true
        this.succItem = res.data.data
      } else {
        this.$api.msg(res.data.message)
        this.buyState = false
      }
    },

    gogift() {
      uni.setStorageSync('giftprice', this.succItem.redEnvelopeAmount)
      uni.setStorageSync('giftname', this.succItem.name)
      uni.setStorageSync('giftid', this.succItem.id)

      uni.navigateTo({
        url: '../index/gift',
      })
    },

    close() {
      this.applyShow = false
    },
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      })
    },
    goqy() {
      uni.navigateTo({ url: '/pages/index/national' })
    },
  },
}
</script>

<style scoped lang="scss">
.buy-now-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 18px;
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    &__left-area {
      color: #cecece;
    }
    &__right-area {
      color: #ffffff;
    }
  }
}

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

.bld {
  padding: 0 32rpx 0;
  .conduct {
    background: rgba(240, 196, 115, 0.3);
    border-radius: 31rpx;

    padding: 24rpx 36rpx 24rpx 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .lef {
      display: flex;
      align-items: center;
      image {
        width: 78rpx;
        height: 78rpx;
        margin-right: 22rpx;
      }
      div {
        font-weight: 400;
        font-size: 25rpx;
        color: #ffffff;
        line-height: 34rpx;
      }
    }
  }

  .card_box {
    // margin-top: 20rpx;
    // background: #ffffff;
    box-shadow: 0rpx 2rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 16rpx;
    padding: 36rpx 32rpx 24rpx;
    .hed_1 {
      margin-bottom: 20rpx;
      font-size: 27rpx;
      color: #ffffff;
      line-height: 42rpx;
    }
    .hed_2 {
      display: flex;
      align-items: center;
      div {
        width: 160rpx;
        height: 56rpx;
        border-radius: 8rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 24rpx;
        border: 2rpx solid rgba(178, 198, 222, 0.4);
        color: #86909e;
        line-height: 32rpx;
        margin-right: 24rpx;
      }
      .select {
        background: #f0c473;
        border: none;
        color: #000;
      }
    }
    .hed_3 {
      margin-top: 48rpx;
      font-size: 27rpx;
      color: #ffffff;
      line-height: 42rpx;
    }
    .hed_4 {
      margin-top: 16rpx;
      font-weight: 400;
      font-size: 20rpx;
      color: #999999;
      line-height: 26rpx;
    }
    .hed_5 {
      margin-top: 24rpx;
      margin-bottom: 32rpx;
      padding: 20rpx;
      border: 1px solid #ccc;
      border-radius: 10rpx;
      font-size: 24rpx;
      input {
        color: #fff;
        font-size: 24rpx;
      }
    }
    .hed_6 {
      font-weight: 400;
      font-size: 24rpx;
      color: #f3343c;
      line-height: 40rpx;
    }
    .hed_9 {
      width: 100%;
      margin-top: 20rpx;
      padding: 0 10rpx;
      height: 350rpx;
    }
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
        color: #999;
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
/deep/ .u-popup__content {
  background-image: url('../../static/image/poup_bg.png');
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
  .poup_tex {
    margin-top: 24rpx;
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
    margin-top: 20rpx;
    padding: 20rpx;
    border-radius: 10rpx;
    font-size: 28rpx;
    background: RGBA(245, 246, 247, 1);
    input {
      font-weight: bold;
      font-size: 28rpx;
      color: #000;
    }
  }
  .laber {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;
    font-size: 28rpx;
    color: #666;
    line-height: 19px;
    span {
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
      line-height: 38rpx;
    }
    image {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
    div {
      font-weight: 400;
      font-size: 28rpx;
      color: #666;
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

.succe {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .succ_1 {
    margin-top: 200rpx;
    font-weight: bold;
    font-size: 36rpx;
    color: #fff;
    line-height: 48rpx;
    span {
      color: rgba(240, 196, 115, 1);
    }
  }
  .succ_2 {
    margin-top: 8rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #999999;
    line-height: 38rpx;
  }
  .succ_3 {
    margin-top: 32rpx;
    margin-bottom: 48rpx;
    height: 290rpx;
  }
  .succ_4 {
    display: flex;
    align-items: center;
    div {
      font-weight: 600;
      font-size: 36rpx;
      color: #ccc;
      line-height: 48rpx;
    }
    image {
      margin-left: 8rpx;
      width: 48rpx;
      height: 48rpx;
    }
  }

  .succ_5 {
    width: 70%;
    margin-top: 66rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #999999;
    line-height: 38rpx;
    text-align: center;
  }

  .succ_6 {
    width: 90%;
    text-align: center;
    margin-top: 64rpx;
    padding: 20rpx 0;
    background: rgba(240, 196, 115, 1);
    font-weight: 600;
    font-size: 32rpx;
    color: #000;
    line-height: 44rpx;
    border-radius: 18rpx;
  }
  .succ_7 {
    margin-top: 32rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #999999;
    line-height: 38rpx;
    span {
      color: rgba(240, 196, 115, 1);
    }
  }
}
</style>
