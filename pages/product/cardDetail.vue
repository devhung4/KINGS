<template>
  <div class="transfer_box">
    <div class="navBox">
      <div class="back">
        <image
          src="../../static/image/go_back2.png"
          alt=""
          @click="goBack()" />
      </div>
      <div class="title">{{ $t('product.cardDetail.pageTitle') }}</div>
      <div class="div"></div>
    </div>

    <div class="bld">
      <div class="hed">
        <div class="card">
          <image
            :src="cardItm.card.imgMax"
            alt="" />
          <div
            class="transt"
            @click="gotranst()">
            {{ $t('product.cardDetail.depositEntry') }}
          </div>
        </div>
        <div class="cont">
          <div class="laber">
            <div class="lab_lef">{{ $t('product.cardDetail.cardChannel') }}：</div>
            <div class="lab_rig">
              {{
                cardItm.card.type == 1
                  ? 'UnionPay'
                  : cardItm.card.type == 2
                  ? 'MasterCard'
                  : 'VISA'
              }}
            </div>
          </div>

          <div class="laber">
            <div class="lab_lef">{{ $t('product.cardDetail.cardCreatedBy') }}：</div>
            <div class="lab_rig">{{ cardItm.realName }}</div>
          </div>

          <div class="laber">
            <div class="lab_lef">{{ $t('product.cardDetail.cardNo') }}：</div>
            <div class="lab_rig">{{ cardItm.payCardNo }}</div>
          </div>

          <div class="laber">
            <div class="lab_lef">
              {{ $t('product.cardDetail.validDate') }}：{{ cardItm.activeDate }} - {{ cardItm.expirationDate }}
            </div>
            <!-- <div class="lab_rig">延长有效期></div> -->
          </div>
          <!-- <div class="laber">
            <div class="lab_lef">CVC：</div>
            <div class="lab_rig">{{ cardItm.safeCode }}</div>
          </div> -->
        </div>
      </div>
    </div>

    <div class="con_bld">
      <div
        class="address"
        v-if="cardItm.ifReceive == 0">
        <div class="add_lef">
          <image
            src="../../static/image/add.png"
            alt="" />
          <div>查看實體卡片郵寄進度</div>
        </div>
        <image
          class="add_rig"
          src="../../static/image/go4.png" />
      </div>

      <div class="liushui">
        <div class="liu_lef">
          <image src="../../static/image/zijin.png" />
          <div>{{ $t('product.cardDetail.fundsFlow') }}</div>
        </div>
        <!-- <div class="liu_rig">查看全部 ></div> -->
      </div>

      <div class="record_box">
        <div v-if="list.length">
          <div
            class="record_itm"
            v-for="(item, index) in list"
            :key="index">
            <div class="itm_lef">
              <div>
                {{
                  Number.isInteger(item.type) && item.type === 0
                    ? '充值'
                    : '法币汇款'
                }}
              </div>
              <span>{{ item.createTime }}</span>
            </div>
            <div class="itm_rig">{{ item.amount }}</div>
          </div>
        </div>

        <div
          class="kong"
          v-else>
          <image src="../../static/image/komg.png" />
          <div>{{ $t('product.cardDetail.empty') }}～</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      list: [],
      id: '',
      cardItm: {
        card: {},
      },
    }
  },
  props: [],
  onShow() {
    this.id = uni.getStorageSync('cardDetailid')

    // this.id = this.$route.query.id;
    this.setCard()
    this.setRecord()
  },
  methods: {
    gotranst() {
      uni.setStorageSync('transferid', this.id)

      uni.navigateTo({
        url: '../index/transfer?id=' + this.id,
      })
    },
    async setCard() {
      let res = await this.$request.post('/finance/card/findPhysicalCard', {
        data: { id: this.id },
      })
      if (res.data.code == 0) {
        this.cardItm = res.data.data
      }
    },
    async setRecord() {
      let res = await this.$request.post('/finance/card/cardRechargeRecord', {
        data: { id: this.id, pageNo: 1, pageSize: 30 },
      })
      if (res.data.code == 0) {
        this.list = res.data.data.content
      }
    },
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      })
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
  padding: 0 32rpx 0;
  .hed {
    background: rgba(71, 76, 100, 0.2);
    border-radius: 34rpx;
    padding: 32rpx 40rpx 0;
    .card {
      position: relative;
      image {
        width: 100%;
        height: 350rpx;
        display: block;
      }

      .transt {
        position: absolute;
        right: 10%;
        top: 15%;
        padding: 14rpx 28rpx;
        font-size: 28rpx;
        font-size: 24rpx;
        display: flex;
        align-items: center;
        background: #ffffff;
        border-radius: 24rpx;
      }
    }
  }
  .cont {
    padding: 0 0 36rpx;
    .laber {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      margin-top: 22rpx;
      .lab_lef {
        font-weight: 400;
        font-size: 28rpx;
        color: rgba(255, 255, 255, 0.8);
        line-height: 38rpx;
      }
      .lab_rig {
        font-weight: 500;
        font-size: 28rpx;
        color: rgba(255, 255, 255, 0.8);
        line-height: 38rpx;
      }
    }
  }
}

.con_bld {
  padding: 0 34rpx;
}
.address {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32rpx;
  background: rgba(71, 76, 100, 0.72);
  border-radius: 24rpx;
  padding: 20rpx 24rpx;
  .add_lef {
    display: flex;
    align-items: center;
    image {
      width: 36rpx;
      height: 36rpx;
      margin-right: 8px;
    }
    div {
      font-weight: 400;
      font-size: 24rpx;
      color: #fff;
      line-height: 32rpx;
    }
  }

  .add_rig {
    width: 28rpx;
    height: 28rpx;
  }
}

.liushui {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 44rpx;
  padding-bottom: 26rpx;
  border-bottom: 1rpx solid rgba(151, 151, 151, 0.2);
  .liu_lef {
    display: flex;
    align-items: center;
    div {
      margin-left: 12rpx;
      font-weight: 500;
      font-size: 36rpx;
      color: #fff;
      line-height: 48rpx;
    }
    image {
      width: 40rpx;
      height: 40rpx;
    }
  }

  .liu_rig {
    font-weight: 400;
    font-size: 24rpx;
    color: #9c47e3;
    line-height: 32rpx;
  }
}
.record_box {
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
      font-weight: 400;
      font-size: 18rpx;
      color: #ccc;
      line-height: 24rpx;
    }
  }
  .record_itm {
    padding: 32rpx 0 26rpx;
    border-bottom: 1rpx solid rgba(151, 151, 151, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .itm_lef {
      div {
        margin-bottom: 8rpx;
        font-weight: bold;
        font-size: 28rpx;
        color: #fff;
        line-height: 38rpx;
      }
      span {
        font-weight: 300;
        font-size: 24rpx;
        color: #fff;
        line-height: 32rpx;
      }
    }
    .itm_rig {
      font-weight: bold;
      font-size: 28rpx;
      color: #fff;
      line-height: 38rpx;
    }
  }
}
</style>
