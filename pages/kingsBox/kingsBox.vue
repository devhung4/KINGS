<template>
  <view>
    <!-- 主页面 START -->
    <view class="page">
      <!-- navbar Start -->
      <view class="page__navbar">
        <text class="page__navbar-left">Back</text>
        <text class="page__navbar-title">國王寶箱</text>
        <text
          @tap="$refs.rulesDescRef.open()"
          class="page__navbar-right">
          規則説明
        </text>
      </view>
      <!-- navbar END -->

      <!-- 页面内容 START -->
      <view class="page__content">
        <!-- item1 START -->
        <view class="page__content-item item1">
          <view class="item1__head">
            <text class="title">王國寶箱海量好禮</text>
            <text class="subtitle">居民每日享免費抽取機會</text>
          </view>
          <view class="item1__body">
            <image
              src="../../static/image/kingsbox-banner.png"
              mode="scaleToFill" />
          </view>
        </view>
        <!-- item1 END -->

        <!-- item2 START -->
        <view class="page__content-item item2">
          <view class="head">
            <text class="head__left">寶物總價值</text>
            <text
              @tap="$toPage('/pages/kingsBox/history')"
              class="head__right">
              抽籤歷史&nbsp;&gt;
            </text>
          </view>

          <!-- 奖品池 START -->
          <!-- <view class="container">
            <view
              class="scroll-container"
              @touchstart="handleTouchStart"
              @touchend="handleTouchEnd">
              <view
                class="prize-wrapper"
                :style="scrollStyle">
                <view
                  v-for="(item, index) in prizes"
                  :key="index"
                  class="prize-item">
                  {{ item.name }}
                </view>
                <view
                  v-for="(item, index) in prizes"
                  :key="index + '_copy'"
                  class="prize-item">
                  {{ item.name }}
                </view>
              </view>
            </view>
          </view> -->
          <prizes-pool />
          <!-- <prize-pool :prizes="prizes" /> -->
          <!-- 奖品池 END -->

          <view class="price">
            <text class="price__value">$1090000.92</text>
            <text class="price__label">(價值持續增長中...)</text>
          </view>

          <view class="desc">
            內含平台空投代幣、平台積分、年費減免、USDT現金、iPhone16、iPad、Applewatch等多種大獎
          </view>
        </view>
        <!-- item2 END -->

        <!-- item3 START -->
        <view class="page__content-item item3">
          <view class="head">
            <text class="head__left">如何獲得抽取機會</text>
          </view>
          <view class="label">
            <view>
              <image
                src="../../static/icons/kingsbox-icon-one.png"
                mode="scaleToFill" />
              <text>每日登入即可獲得1次機會</text>
            </view>
            <view>
              <image
                src="../../static/icons/kingsbox-icon-two.png"
                mode="scaleToFill" />
              <text>
                生成個人寶箱後發送給好友抽簽
                每有一個好友注冊或開卡即可獲得1次機會
              </text>
            </view>
            <view>
              <image
                src="../../static/icons/kingsbox-icon-three.png"
                mode="scaleToFill" />
              <text>當日消費每滿10U獲得1次機會 (上限10次/日) </text>
            </view>
          </view>
        </view>
        <!-- item3 END -->

        <!-- item4 START -->
        <!-- <view class="page__content-item item4">
        <view class="head">
          <text class="head__left">活動背景</text>
        </view>
      </view> -->
        <!-- item4 END -->
      </view>
      <!-- 页面内容 END -->
    </view>
    <!-- 主页面 END -->

    <!-- 底部按钮 START -->
    <view class="page__bottom">
      <view class="page__bottom-button-group">
        <text class="line">個人寶箱</text>
        <text
          @tap="$refs.lotteryModalRef.open()"
          class="fill">
          開箱 (1/1)
        </text>
      </view>
    </view>
    <!-- 底部按钮 END -->

    <!-- 抽奖模态框 START -->
    <uni-popup
      ref="lotteryModalRef"
      type="center"
      :is-mask-click="false">
      <view class="lottery-container">
        <view class="lottery-container__main">
          <image
            class="bg"
            src="../../static/image/lottery-bg.png"
            mode="scaleToFill" />
          <image
            class="ball"
            src="../../static/image/lottery-ball.png"
            mode="scaleToFill" />
        </view>
        <text class="lottery-container__text">
          <text style="flex-shrink: 0">抽奖中</text>{{ dots }}
          <!-- <text style="opacity: 0;">...</text>   -->
        </text>
      </view>
    </uni-popup>
    <!-- 抽奖模态框 END -->

    <!-- 规则说明模态框 START -->
    <custom-modal
      ref="rulesDescRef"
      mode="bottom"
      title="規則説明">
    </custom-modal>
    <!-- 规则说明模态框 END -->
  </view>
</template>

<script>
import CustomModal from '../../components/custom-modal.vue'
import PrizePool from './components/prize-pool.vue'
import PrizesPool from './components/prizes-pool.vue'
export default {
  components: {
    CustomModal,
    PrizePool,
    PrizesPool,
  },
  data() {
    return {
      // 奖品
      prizes: [],
      isTouching: false,
      animation: null,
      isScrolled: false,
      isLoading: false,
      isLoaded: false,
      isSticky: false,
      lastScrollTop: 0,
      dots: '',
      timer: null,
      isLottering: false,
    }
  },
  computed: {
    scrollStyle() {
      return {
        animationPlayState: this.isTouching ? 'paused' : 'running',
        animationDuration: `${this.prizes.length * 2}s`, // 根据奖品数量调整速度
      }
    },
  },
  methods: {
    onPrizeTap(prize) {
      console.log(prize)
    },
    handleTouchStart() {
      this.isTouching = true
    },
    handleTouchEnd() {
      this.isTouching = false
    },
    async getDrawsNumber() {
      const response = await this.$request.post(
        '/zhaotoubao-server/user/getExtractNumber',
        {
          data: {
            base: {},
            param: {},
          },
        }
      )
      console.log(response)
    },
    startLottery() {
      if (this.isLottering) return
      this.$refs.lotteryModalRef.open()
      this.isLottering = true
      this.timer = setInterval(() => {
        this.dots = this.dots.length >= 3 ? '' : this.dots + '.'
      }, 500)
      // 模拟抽奖接口
      setTimeout(() => {
        this.stopAnimation()
        this.$refs.lotteryModalRef.close()
        uni.showToast({ title: '抽奖完成' })
      }, 5000)
    },
    stopAnimation() {
      clearInterval(this.timer)
      this.dots = ''
      this.isLottering = false
    },
  },
  beforeDestroy() {
    this.stopAnimation()
  },
  mounted() {
    // this.$refs.lotteryModalRef.open()
    // 动态生成奖品数据（权重与库存成反比）
    this.prizes = new Array(10).fill(0).map((_, i) => {
      // 权重按倒序排列（索引0权重最高）
      const weight = 10 - i
      // 库存与权重正相关（权重越高库存越多）
      const stock = Math.floor(weight * 2.5 + 5)

      return {
        id: i + 1,
        name: `獎品${i + 1}`,
        weight: weight,
        stock: stock,
        baseStock: stock, // 保留初始库存用于重置
        // 添加概率显示字段（演示用）
        probability: ((weight / 55) * 100).toFixed(1) + '%', // 总权重为55（10+9+...+1）
      }
    })

    // 带权重和库存的抽奖算法
    this.drawPrize = () => {
      // 过滤有库存的奖品并计算总权重
      const availablePrizes = this.prizes.filter((p) => p.stock > 0)
      if (availablePrizes.length === 0) {
        uni.showToast({
          title: '所有奖品已抽完，请稍后再试',
          icon: 'none',
        })
        return null
      }

      const totalWeight = availablePrizes.reduce((sum, p) => sum + p.weight, 0)
      const random = Math.random() * totalWeight

      // 轮盘赌算法选择奖品
      let currentWeight = 0
      for (const prize of availablePrizes) {
        currentWeight += prize.weight
        if (random < currentWeight) {
          // 记录抽奖前库存
          const originalStock = prize.stock

          // 原子操作：减少库存并返回副本
          const selected = {
            ...prize,
            stock: --prize.stock,
          }

          // 当库存归零时，60秒后自动重置（演示用）
          if (prize.stock === 0) {
            setTimeout(() => {
              prize.stock = prize.baseStock
              this.$forceUpdate() // 触发视图更新
              console.log(`奖品${prize.id}库存已重置为${prize.baseStock}`)
            }, 60000)
          }

          // 打印抽奖日志
          console.log(
            `抽中奖品：${selected.name} | 权重：${selected.weight} | ` +
              `剩余库存：${originalStock}→${selected.stock} | 中奖概率：${selected.probability}`
          )

          return selected
        }
      }

      // 理论上不会执行到这里
      console.error('抽奖算法异常，未找到合适奖品')
      return null
    }
  },
}
</script>

<style scoped lang="scss">
$primary-color: #f0c474;

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.page {
  width: 100%;
  height: 100%;
  // height: 1000px;
  min-height: 100vh;
  padding: 56px 0 56px 0;
  background: #070708 url(../../static/image/kingsbox-bg.png) no-repeat center
    center fixed;
  background-size: calc(100% + 20px) calc(100% + 20px);
  background-attachment: scroll;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  overflow-y: auto;
  overflow: hidden;

  &__navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    height: 40px;
    padding: 0 15px 0 15px;
    &-title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 17px;
      font-weight: 600;
      line-height: 22px;
      color: #ffffff;
    }
    &-right {
      color: rgba(235, 235, 245, 0.6);
      font-size: 15px;
      line-height: 20px;
    }
  }

  &__content {
    margin-top: 12px;
    padding: 0 15px 0 15px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    &-item {
      // padding: 8px 16px 8px 16px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 18px;
      border: 1px solid rgba(240, 196, 115, 0.6);
      .head {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        &__left {
          font-size: 18px;
          line-height: 25px;
          font-weight: 600;
          color: rgba($color: #ffffff, $alpha: 0.9);
        }
        &__right {
          color: rgba(235, 235, 245, 0.8);
          font-size: smaller;
        }
      }
    }

    .item1 {
      &__head {
        display: flex;
        flex-direction: column;
        .title {
          font-weight: 600;
          font-size: 24px;
          color: #ffe08a;
          line-height: 33px;
          text-align: center;
          font-style: normal;
        }
        .subtitle {
          margin-top: 4px;
          font-weight: 500;
          font-size: 16px;
          color: #ffffff;
          line-height: 22px;
          text-align: center;
          font-style: normal;
        }
      }
      &__body {
        margin-top: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 329px;
        height: 210px;
        // background: url(../../static/image/kingsbox-banner.png) no-repeat center
        //   center fixed;
        // background-size: cover;
        image {
          -webkit-mask-mode: alpha;
          mask-mode: alpha;
          mask-repeat: no-repeat;
          mask-size: 100% 100%;
          width: 345px;
          height: 210px;
        }
      }
    }

    .item2 {
      .price {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        &__value {
          display: flex;
          min-width: min-content;
          justify-content: center;
          align-items: center;
          padding: 4px 12px 4px 12px;
          font-size: 16px;
          font-weight: 600;
          background: linear-gradient(
            180deg,
            rgba(115, 85, 53, 0.8) 0%,
            rgba(92, 68, 42, 0.2) 50%,
            rgba(115, 85, 53, 0.8) 100%
          );
          color: #f0c473;
          border-radius: 14px;
        }
        &__label {
          font-size: 14px;
          color: rgba(235, 235, 245, 0.6);
        }
      }

      .container {
        margin-top: 12px;
        width: 100%;
        height: 84px;
        overflow: hidden;
        // background-color: #f5f5f5;
        .scroll-container {
          width: 100%;
          height: 100%;
          overflow: hidden;
          .prize-wrapper {
            display: inline-flex;
            gap: 8px;
            height: 100%;
            animation: scroll linear infinite;
            .prize-item {
              flex-shrink: 0;
              width: 96px;
              height: 84px;
              background: #2e2f36;
              border-radius: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: #fff;
              // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
          }
        }
      }

      .desc {
        margin-top: 12px;
        color: rgba(235, 235, 245, 0.8);
        font-size: smaller;
        line-height: 18px;
        text-align: justify;
      }
    }

    .item3 {
      .label {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
        view {
          display: flex;
          align-items: flex-start;
          flex-direction: row;
          gap: 4px;
          image {
            flex-shrink: 0;
            width: 20px;
            height: 20px;
          }
          text {
            color: rgba(235, 235, 245, 0.8);
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
  }
}

.page__bottom {
  @mixin base {
    bottom: env(safe-area-inset-bottom);
    left: 0;
    right: 0;
    width: 100%;
    height: 90px;
    padding: 0 15px 0 15px;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  position: fixed;
  bottom: env(safe-area-inset-bottom);
  left: 0;
  right: 0;
  width: 100%;
  height: 90px;
  padding: 0 15px 0 15px;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;

  &-button-group {
    display: flex;
    gap: 16px;
    text {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 20px;
      min-width: min-content;
      height: 44px;
      padding: 0 20px 0 20px;

      box-sizing: border-box;
    }
    .line {
      border: 1px solid #f0c473;
      color: #f0c473;
    }
    .fill {
      background: #f0c473;
    }
  }

  &.fixed {
    @include base;
    position: fixed;
  }

  &.sticky {
    @include base;
    position: -webkit-sticky;
    position: sticky;

    // 小程序条件编译
    /* #ifdef MP-WEIXIN */
    position: fixed;
    /* #endif */
  }
}

.lottery-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 14px;
  &__main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 256px;
    height: 256px;
    font-size: 17px;
    line-height: 24px;
    font-weight: 500;
    background: #1f2029;
    border-radius: 18px;
    overflow: hidden;
    position: relative;
    .bg {
      width: 256px;
      height: 256px;
    }
    .ball {
      position: absolute;
      top: 50%;
      left: 83px;
      right: 79px;
      transform: translateY(-50%);
      width: 94px;
      height: 94px;
    }
  }
  &__text {
    // margin-right: 48rpx;
    display: inline-flex;
    color: #ffffff;

    text {
      flex-shrink: 0;
    }
  }
}
</style>
