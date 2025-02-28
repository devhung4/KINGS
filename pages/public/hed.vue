<template>
  <view>
    <view class="homeme_had">
      <view
        class="lef"
        @click="pasPoup = true">
        <image :src="userInfo.avatar || '../../static/black/authon.png'" />
      </view>
      <div class="rig">
        <!-- <image src="../../static/black/bx.png" /> -->
        <image
          @click="gomessage()"
          src="../../static/black/kf.png" />
        <!-- <image src="../../static/black/xx.png" /> -->
      </div>
    </view>

    <u-popup
      :show="pasPoup"
      mode="left"
      @close="pasPoup = false"
      class="pas_pop">
      <div
        class="hed"
        @click="gorenzhe()">
        <image
          class="authon"
          :src="userInfo.avatar || '../../static/black/authon.png'" />
        <div>
          {{
            userInfo.realNameStatus == 0
              ? $t('common.drawer.certifyStatus.uncertified')
              : userInfo.realNameStatus == 1
              ? $t('common.drawer.certifyStatus.certifying')
              : $t('common.drawer.certifyStatus.certified')
          }}
        </div>
      </div>
      <view class="poup_hed">
        <div class="lab1">{{ $t('common.drawer.myAccount') }}</div>
        <div class="lab2">{{ userInfo.email }}</div>
        <div class="lab3">{{ $t('common.drawer.userId') }}</div>
        <div class="lab4">
          <div>{{ userInfo.memberId }}</div>
          <image
            @click="copyContent(userInfo.memberId)"
            src="../../static/black/copy.png" />
        </div>
      </view>
      <div class="list">
        <div
          class="itm"
          v-for="(item, index) in list"
          :key="index"
          @click="godetail(item.path)">
          <div class="itm_lef">
            <image :src="item.logo" />
            <div>{{ item.name }}</div>
          </div>
          <div
            class="version"
            v-if="item.version">
            {{ version }}
          </div>
          <image
            v-else
            class="itm_rig"
            src="../../static/black/go.png" />
        </div>
      </div>

      <div
        class="quit"
        @click="quit()">
        {{ this.$t('common.drawer.logout') }}
      </div>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          name: this.$t('common.drawer.accountSafety'),
          logo: require('../../static/black/user1.png'),
          path: '/pages/user/secure',
        },
        {
          name: this.$t('common.drawer.teamManage'),
          logo: require('../../static/black/user3.png'),
          path: '/pages/user/team2',
        },
        {
          name: this.$t('common.drawer.contactUs'),
          logo: require('../../static/black/user6.png'),
          path: '/pages/user/service',
        },
        {
          name: this.$t('common.drawer.aboutUs'),
          logo: require('../../static/black/user5.png'),
          path: 'helpdetail',
        },
        {
          name: this.$t('common.drawer.helpCenter'),
          logo: require('../../static/black/user5.png'),
          path: '/pages/help/help',
        },
        {
          name: 'version',
          logo: require('../../static/black/user5.png'),
          path: '',
          version: '1',
        },
      ],
      userInfo: {},
      pasPoup: false,
      langShow: false,
      eyeState: false,
      open: require('../../static/image/open.png'),
      close: require('../../static/image/clo.png'),
      coinList: [],
      price: 0,
      coinName: '',
      coinImg: '',
      langArr: [[]],
      waterList: [],
      version: '',
    }
  },
  computed: {},
  onLoad() {},
  onShow() {},
  mounted() {
    this.setUser()
    // this.setversion();

    const systemInfo = uni.getSystemInfoSync()
    this.version = systemInfo.appWgtVersion
      ? systemInfo.appWgtVersion
      : systemInfo.appVersion
    console.log(systemInfo)
  },
  methods: {
    init() {
      this.setUser()
    },
    async setversion() {
      // uni.getSystemInfoSync().platform === "ios"
      let number = ''
      if (uni.getSystemInfoSync().platform === 'ios') {
        number = 1
      } else {
        number = 0
      }
      let res = await this.$request.get(
        `/news/ancillary/system/app/version/${number}`
      )
      if (res.data.code == 0) {
        this.version = res.data.data.version
      }
    },
    copyContent(item) {
      uni.setClipboardData({
        data: item,
        success: () => {
          uni.getClipboardData({
            success: (res) => {
              this.$api.msg(this.$t('common.messages.copySucceed'))
            },
          })
        },
      })
    },

    gomessage() {
      uni.navigateTo({ url: '/pages/user/service' })
    },
    gorenzhe() {
      if (this.userInfo.realNameStatus == 0) {
        uni.navigateTo({ url: '/pages/user/identity/index' })
      }
    },
    godetail(url) {
      this.pasPoup = false
      if (url == 'helpdetail') {
        uni.setStorageSync('helpdetailid', 210)
        uni.navigateTo({ url: '/pages/help/helpdetail' })
      } else {
        uni.navigateTo({ url: url })
      }
    },
    async setUser() {
      let res = await this.$request.post('/finance/card/payInfoSummary')
      if (res.data.code == 0) {
        this.userInfo = res.data.data
      }
    },

    quit() {
      let that = this
      uni.showModal({
        content: this.$t('common.messages.confirmLogout'),
        confirmText: this.$t('common.buttons.confirm'),
        cancelText: this.$t('common.buttons.cancel'),
        success: function (res) {
          if (res.confirm) {
            uni.removeStorageSync('token')
            setTimeout(() => {
              that.pasPoup = false
              uni.navigateTo({
                url: '../public/login',
              })
            }, 1000)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
    },
  },
}
</script>

<style scoped lang="less">
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
/deep/ .u-slide-left-enter-active {
  width: 75%;
  z-index: 998 !important;
}

/deep/ .u-fade-enter-active {
  z-index: 998 !important;
}

/deep/ .u-popup__content {
  background: #1f2029;
  // border-radius: 0rpx 61rpx 61rpx 0rpx;
}
/deep/ .u-popup__content {
  padding: 30rpx;
}
.pas_pop {
  background: #000;
  .hed {
    padding-right: 40rpx;
    margin-top: 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .authon {
      width: 137.4rpx;
      height: 137.4rpx;
    }

    div {
      // margin-left: 30rpx;
      font-weight: 400;
      font-size: 31rpx;
      color: rgba(255, 255, 255, 0.8);
      line-height: 40rpx;
    }
  }
  .poup_hed {
    padding: 23rpx 30rpx;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 31rpx;
    margin-top: 30rpx;
    .lab1 {
      font-weight: 400;
      font-size: 29rpx;
      color: rgba(235, 235, 245, 0.4);
      line-height: 38rpx;
    }
    .lab2 {
      font-weight: 400;
      font-size: 32rpx;
      color: #e6ccaa;
      margin-top: 20rpx;
      line-height: 42rpx;
    }
    .lab3 {
      margin-top: 20rpx;
      font-weight: 400;
      font-size: 29rpx;
      color: rgba(235, 235, 245, 0.4);
      line-height: 38rpx;
    }
    .lab4 {
      display: flex;
      align-items: center;
      margin-top: 8rpx;
      div {
        font-weight: 400;
        font-size: 32rpx;
        color: rgba(235, 235, 245, 0.8);
        line-height: 42rpx;
        margin-right: 6rpx;
      }
      image {
        width: 45.8rpx;
        height: 45.8rpx;
      }
    }
  }

  .list {
    padding: 4rpx 0;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 31rpx;
    margin-top: 30rpx;
    .itm {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28rpx 0 28rpx 32rpx;
      border-bottom: 4rpx solid RGBA(31, 32, 41, 1);
      .itm_lef {
        display: flex;
        align-items: center;
        div {
          font-weight: 400;
          font-size: 31rpx;
          color: rgba(255, 255, 255, 0.8);
          line-height: 40rpx;
        }
        image {
          width: 34.35rpx;
          height: 34.35rpx;
          margin-right: 30rpx;
        }
      }

      .version {
        color: #fff;
        font-size: 24rpx;
        padding-right: 20rpx;
      }
      .itm_rig {
        width: 45.8rpx;
        height: 45.8rpx;
      }
    }
    .itm:last-child {
      border: none;
    }
  }

  .quit {
    margin-top: 80rpx;
    border-radius: 31rpx;
    border: 2rpx solid rgba(230, 204, 170, 0.4);
    padding: 24rpx 0;
    font-weight: 400;
    font-size: 32rpx;
    color: rgba(230, 204, 170, 0.8);
    line-height: 42rpx;
    text-align: center;
  }
}

/deep/ uni-modal {
  z-index: 10000000 !important;
}
</style>
