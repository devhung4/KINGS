<template>
  <div class="card_box">
    <div class="navBox">
      <div class="back">
        <image
          src="../../static/image/go_back2.png"
          alt=""
          @click="goBack()" />
      </div>
      <div class="title">{{ $t('contactUs.pageTitle') }}</div>
      <div class="div"></div>
    </div>
    <view class="container">
      <div class="box">
        <!-- <div class="lab1">請選擇充值貨幣類型</div> -->
        <div class="lab1">
          {{ $t('contactUs.contactUsIfYouHaveAnyQuestions') }}
        </div>
        <div
          v-for="(item, index) in serLIst"
          :key="index"
          @click="opneewm(item)">
          <div class="itm">
            <div class="lef">
              <image
                :src="item.logo"
                alt="" />
              <div>{{ item.name }}</div>
            </div>
            <div class="rig">
              <image
                v-if="item.copy"
                src="../../static/black/copy.png"
                alt="" />
              <image
                v-else
                src="../../static/black/lx8.png"
                alt="" />
            </div>
          </div>
        </div>
      </div>

      <div class="box">
        <div class="lab1">{{ $t('contactUs.joinTheCommunity') }}</div>
        <div class="lab2">{{ $t('contactUs.followUs') }}</div>
        <div
          v-for="(item, index) in serLIst2"
          :key="index"
          @click="opneewm(item)">
          <div class="itm">
            <div class="lef">
              <image
                :src="item.logo"
                alt="" />
              <div>{{ item.name }}</div>
            </div>
            <div class="rig">
              <image
                v-if="item.copy"
                src="../../static/black/copy.png"
                alt="" />
              <image
                v-else
                src="../../static/black/lx8.png"
                alt="" />
            </div>
          </div>
        </div>
      </div>
    </view>

    <u-popup
      :show="applyShow"
      mode="bottom"
      round="20px"
      @close="close"
      class="poup">
      <view class="poup_hed">
        <view></view>
        <view>聯繫我們</view>
        <image
          src="../../static/image/clor.png"
          @click="close()" />
      </view>
      <view class="poup_bld">
        <div>{{ name }}</div>
        <image
          :src="ewm"
          alt="" />
      </view>
    </u-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      ewm: '',
      applyShow: false,
      userInfo: {},
      serLIst: [
        {
          logo: require('../../static/black/lx1.png'),
          name: 'WhatsApp',
          link: '',
          ewm: require('../../static/black/whatsapp.png'),
        },
        {
          logo: require('../../static/black/lx2.png'),
          name: 'Telegram',
          link: '',
          ewm: require('../../static/black/telegram.png'),
        },
        {
          logo: require('../../static/black/lx4.png'),
          name: 'Wechat',
          link: '',
          ewm: require('../../static/black/wechat.png'),
        },
        {
          logo: require('../../static/black/lx3.png'),
          name: 'Email: info@kingsunited.io',
          link: '',
          copy: 'info@kingsunited.io',
        },
      ],
      serLIst2: [
        {
          logo: require('../../static/black/lx5.png'),
          name: 'X',
          link: '',
          ewm: require('../../static/black/x.png'),
        },
        {
          logo: require('../../static/black/lx7.png'),
          name: 'Telegram Group',
          link: '',
          ewm: require('../../static/black/telegramGroup.png'),
        },
        {
          logo: require('../../static/black/lx6.png'),
          name: 'https://www.kingsunited.io/',
          link: '',
          copy: 'https://www.kingsunited.io/',
        },
      ],
    }
  },
  onShow() {},
  mounted() {},
  methods: {
    opneewm(item) {
      if (item.ewm) {
        this.applyShow = true
        this.ewm = item.ewm
        this.name = item.name
      } else if (item.copy) {
        uni.setClipboardData({
          data: item.copy,
          success: () => {
            uni.getClipboardData({
              success: (res) => {
                this.$api.msg('复制成功')
              },
            })
          },
        })
      }
    },
    close() {
      this.applyShow = false
    },
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      })
    },
  },
}
</script>

<style scoped lang="less">
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
.container {
  padding: 0 32rpx 32rpx;
  .box {
    margin-bottom: 30rpx;
    background: rgba(31, 32, 41, 0.6);
    border-radius: 34rpx;
    padding: 26rpx 30rpx;
    .lab1 {
      margin-bottom: 10rpx;
      font-weight: 400;
      font-size: 31rpx;
      color: #ffffff;
      line-height: 42rpx;
    }
    .lab2 {
      margin-bottom: 20rpx;
      font-weight: 400;
      font-size: 23rpx;
      color: rgba(235, 235, 245, 0.4);
      line-height: 34rpx;
    }
    .itm {
      padding: 24rpx 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .lef {
        display: flex;
        align-items: center;
        image {
          width: 46rpx;
          height: 46rpx;
          margin-right: 8rpx;
        }
        div {
          font-weight: 400;
          font-size: 29rpx;
          color: rgba(255, 255, 255, 0.8);
          line-height: 42rpx;
        }
      }

      .rig {
        image {
          width: 46rpx;
          height: 46rpx;
        }
      }
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
  padding: 20px 16px 20px;
  margin-top: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  div {
    font-weight: 600;
    font-size: 20px;
    color: #333333;
    line-height: 22px;
    margin-bottom: 24rpx;
  }
  image {
    width: 200px;
    height: 200px;
  }
}
/deep/ .u-modal__content__text {
  text-align: center;
}
/deep/ .u-transition {
  z-index: 998 !important;
}
</style>
