<template>
  <view class="container">
    <child-component ref="drag"> </child-component>
    <view class="heder">
      <view class="bala">
        <div class="tit_box">
          <view class="bala_tit">
            <view class="tit_lef">
              <!-- <view>账户余额</view> -->
              <view>{{ $t('index.static.text1') }}</view>
              <!-- <image :src="eyeState ? open : close" @click="eyeState = !eyeState" /> -->
            </view>
            <view
              class="tit_rig"
              @click="recharge()">
              <image src="../../static/black/wallet2.png" />
              <!-- <view>钱包地址</view> -->
              <view>{{ $t('index.static.text2') }}</view>
            </view>
          </view>
          <view class="bala_price">
            <view class="price_lef">
              $
              <!-- <span>{{ eyeState ? price : "****" }}</span> -->
              <span>{{ price }}</span>

              <!-- <view class="coin_box" @click="langShow = true"> -->
              <view class="coin_box">
                <view class="coin">
                  <!-- <image :src="coinimage" /> -->
                  <view>{{ coinName }}</view>
                </view>
                <!-- <image src="../../static/image/drop.png" class="drop" /> -->
              </view>
            </view>
            <!-- <view class="price_rig">查看详情 ></view> -->
          </view>
        </div>
        <view class="bala_btn">
          <view
            class="btn_lef"
            @click="recharge()">
            <image src="../../static/black/lab11.png" />
            <!-- <view>充值</view> -->
            <view>{{ $t('index.static.text3') }}</view>
          </view>
          <view
            class="btn_lef"
            @click="accounts()">
            <image src="../../static/black/lab22.png" />
            <view>{{ $t('index.static.text4') }}</view>
          </view>
          <view
            class="btn_lef"
            @click="extract()">
            <image src="../../static/black/lab33.png" />
            <view>{{ $t('index.static.text5') }}</view>
          </view>
          <view
            class="btn_lef"
            @click="giftcard()">
            <image src="../../static/black/lab4.png" />
            <view>{{ $t('index.static.text6') }}</view>
          </view>
        </view>

        <div
          class="open"
          @click="openList()">
          {{ userInfo.ifBuyPay ? '卡片管理' : '立即開卡' }}
        </div>
      </view>
    </view>

    <view class="assets">
      <view class="assets_tit">
        <div class="tit_lef">
          <!-- <image src="../../static/image/assets.png" /> -->
          <!-- <view>资金流水</view> -->
          <view>{{ $t('index.static.text7') }}</view>
        </div>
        <div
          class="tit_rig"
          @click="goallWater()">
          {{ $t('index.static.text8') }} >
        </div>
      </view>
      <view class="coinList">
        <div v-if="waterList.length">
          <view
            v-for="(item, index) in waterList"
            :key="index"
            class="coin_itm">
            <view class="itm_lef">
              <view class="coin_nmae">
                <view>{{ setType(item.type) }}</view>
                <view>{{ item.createTime }}</view>
              </view>
            </view>
            <view class="itm_rig">
              <view :class="item.amount > 0 ? 'green' : 'red'">
                {{ item.amount }}
              </view>
            </view>
          </view>
        </div>
        <div
          class="kong"
          v-else>
          <image src="../../static/image/komg.png" />
          <!-- <div>暫無紀錄，請先充值開卡</div> -->
          <div>{{ $t('index.static.text9') }}</div>
        </div>
      </view>
    </view>
  </view>
</template>

<script>
import ChildComponent from '../public/hed.vue'
export default {
  data() {
    return {
      langShow: false,
      eyeState: false,
      open: require('../../static/image/open.png'),
      close: require('../../static/image/clo.png'),
      coinList: [],
      price: 0,
      coinName: '',
      coinimage: '',
      langArr: [[]],
      waterList: [],
      userInfo: {},
    }
  },
  components: {
    ChildComponent,
  },
  onShow() {
    this.coin()
    this.water()
    this.setUser()
    this.$refs.drag.init()
  },
  mounted() {},
  methods: {
    openList() {
      uni.navigateTo({ url: '/pages/product/index' })
    },
    async setUser() {
      let res = await this.$request.post('/finance/card/payInfoSummary')
      if (res.data.code == 0) {
        this.userInfo = res.data.data
      }
    },

    async water() {
      let res = await this.$request.post('/uc/asset/wallet/financeRecord', {
        data: {
          pageNo: 1,
          pageSize: 10,
        },
      })
      if (res.data.code == 0) {
        this.waterList = res.data.data.content
      }
    },
    async coin() {
      let res = await this.$request.post('/uc/wallet/walletTotalData', {
        data: { accountType: 7 },
      })
      if (res.data.code == 0) {
        this.langArr = [[]]
        res.data.data.walletList.forEach((item, index) => {
          if (index == 0) {
            this.coinimage = item.coinimage
            this.price = Number(item.balance.toFixed(4))
            this.coinName = item.coinId
          }
          this.langArr[0].push({
            label: item.coinId,
            coinimage: item.coinimage,
            price: Number(item.balance.toFixed(4)),
            coinName: item.coinId,
          })
        })
        this.coinList = res.data.data.walletList
      }
    },

    confirmLang(item) {
      this.coinName = item.value[0].coinName
      this.price = item.value[0].price
      this.coinimage = item.value[0].coinimage
      this.langShow = false
    },

    setType(type) {
      let name = ''
      if (type == 39) {
        name = '开卡年费'
      } else if (type == 40) {
        name = '充值'
      } else if (type == 41) {
        name = '提币'
      } else if (type == 42) {
        name = '充值手续费团队收益'
      } else if (type == 43) {
        name = '赠卡花费'
      } else if (type == 44) {
        name = '开卡直推奖'
      } else if (type == 45) {
        name = '开卡团队收益'
      } else if (type == 47) {
        name = '充值卡片'
      } else if (type == 48) {
        name = '签证费用'
      }

      return name
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

    gotoInfo() {
      uni.navigateTo({
        url: '../userInfo/userInfo',
      })
    },

    recharge() {
      uni.navigateTo({
        url: '../index/depositCoins',
      })
    },

    extract() {
      uni.navigateTo({
        url: '../index/extract',
      })
    },

    accounts() {
      uni.navigateTo({
        url: '../index/transfer',
      })
    },

    giftcard() {
      uni.navigateTo({
        url: '../index/giftCard',
      })
    },

    goallWater() {
      uni.navigateTo({
        url: '../index/allWater',
      })
    },

    transfer() {
      uni.navigateTo({
        url: '../index/transfer',
      })
    },
  },
}
</script>

<style scoped lang="less">
page {
  background-color: #f4f5f6;
  height: 100%;
  font-size: 14px;
  line-height: 1.8;
}
.container {
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: 30px;
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
.homeme_had {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  .lef {
    display: flex;
    align-items: center;
    image {
      width: 83.97rpx;
      height: 83.97rpx;
      margin-right: 8px;
    }
    view {
      font-weight: bold;
      font-size: 18px;
      color: #333333;
      line-height: 24px;
    }
  }
  .rig {
    display: flex;
    align-items: center;
    image {
      width: 76.34rpx;
      height: 76.34rpx;
    }
  }
}
.bala {
  margin: 4px 16px 20px;
  background: linear-gradient(
    180deg,
    rgba(46, 47, 54, 0.8) 0%,
    rgba(94, 97, 109, 0.8) 100%
  );
  border-radius: 34rpx;
  padding: 8rpx 8rpx 10rpx 8rpx;
  box-sizing: border-box;
  .tit_box {
    background-image: url('../../static/black/beijin.png');
    // background: rgba(0, 0, 0, 0.8);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border-radius: 30rpx;
    padding: 30rpx 38rpx 40rpx 30rpx;
  }
  .bala_tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .tit_lef {
      display: flex;
      align-items: center;
      view {
        font-weight: 400;
        font-size: 31rpx;
        color: #999999;
        line-height: 40rpx;
        margin-right: 6px;
      }
      image {
        width: 16px;
        height: 16px;
      }
    }
    .tit_rig {
      right: -38rpx;
      top: -25rpx;
      position: absolute;
      display: flex;
      align-items: center;
      padding: 15rpx 38rpx 15rpx 32rpx;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 27px;
      image {
        width: 47rpx;
        height: 47rpx;
        margin-right: 17rpx;
      }
      view {
        font-weight: 400;
        font-size: 12px;
        color: rgba(235, 235, 245, 0.4);
        line-height: 16px;
      }
    }
  }
  .bala_price {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24rpx;
    .price_lef {
      font-weight: 400;
      font-size: 61rpx;
      color: #ffffff;
      line-height: 73rpx;
      display: flex;
      align-items: flex-end;
      span {
        font-size: 28px;
        margin-left: 4px;
      }
      .set_font {
        font-size: inherit;
      }
      .coin_box {
        display: flex;
        align-items: center;
        padding: 0 8px 4px;
        border-radius: 16px;
        .coin {
          display: flex;
          align-items: center;
          image {
            width: 14px;
            height: 14px;
            margin-right: 4px;
            border-radius: 50%;
          }
          view {
            font-weight: 400;
            font-size: 23rpx;
            color: #ffffff;
            line-height: 28rpx;
          }
        }
        .drop {
          width: 10px;
          height: 10px;
          margin-left: 4px;
        }
      }
    }
    .price_rig {
      font-weight: 400;
      font-size: 12px;
      color: #9c47e3;
      line-height: 16px;
    }
  }
  .open {
    margin-top: 38rpx;
    background: #f0c473;
    border-radius: 31rpx;
    padding: 24rpx 0;
    font-weight: 600;
    font-size: 32rpx;
    color: #000000;
    line-height: 42rpx;
    text-align: center;
  }
  .bala_btn {
    margin-top: 18rpx;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .btn_lef,
    .btn_rig {
      display: flex;
      align-items: center;
      flex-direction: column;
      border-radius: 16px;
      justify-content: center;
      image {
        width: 76.34rpx;
        height: 76.34rpx;
      }
      view {
        font-weight: 400;
        font-size: 31rpx;
        color: rgba(235, 235, 245, 0.8);
        line-height: 40rpx;
      }
    }
    .btn_rig {
      background: rgba(156, 71, 227, 0.1);
      view {
        color: #9c47e3;
      }
    }
  }
}

.assets {
  margin: 0 23rpx;
  display: flex;
  flex-direction: column;
  background: rgba(46, 47, 54, 0.4);
  border-radius: 34rpx;
  padding-bottom: 8rpx;
  .assets_tit {
    padding: 22.9rpx 17rpx 19.08rpx 38rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tit_lef {
      display: flex;
      align-items: center;
      image {
        width: 20px;
        height: 20px;
        margin-right: 6px;
      }
      view {
        font-weight: 600;
        font-size: 32rpx;
        color: rgba(235, 235, 245, 0.8);
        line-height: 42rpx;
      }
    }

    .tit_rig {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 25rpx;
      color: rgba(235, 235, 245, 0.3);
      line-height: 34rpx;
    }
  }
  .coinList {
    margin: 0 8rpx;
    height: 38vh;
    padding-bottom: 20px;
    padding-top: 10rpx;
    overflow-y: scroll;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 31rpx;
    .kong {
      padding: 100rpx 0;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      image {
        width: 139.31rpx;
        height: 134rpx;
      }
      div {
        margin-top: 30rpx;
        font-weight: 400;
        font-size: 25rpx;
        color: rgba(235, 235, 245, 0.6);
        line-height: 34rpx;
      }
    }
    .coin_itm {
      // padding: 20px 0 16px;
      margin: 26.72rpx 16px 0;
      // border-bottom: 1px solid rgba(151, 151, 151, 0.2);
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
            font-weight: 400;
            font-size: 29rpx;
            color: rgba(255, 255, 255, 0.8);
            line-height: 38rpx;
            margin-bottom: 4px;
          }
          view:nth-child(2) {
            font-weight: 300;
            font-size: 23rpx;
            color: rgba(235, 235, 245, 0.3);
            line-height: 31rpx;
          }
        }
      }
      .itm_rig {
        .green {
          font-weight: 400;
          font-size: 27rpx;
          color: #72ef93;
          line-height: 31rpx;
        }
        .red {
          font-weight: 400;
          font-size: 27rpx;
          color: #ff5b5c;
          line-height: 31rpx;
          text-align: right;
        }
      }
    }
  }
}
</style>
