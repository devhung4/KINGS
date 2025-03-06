<template>
  <view class="page">
    <view class="page__head">
      <view
        @tap="goBack()"
        class="page__head-left">
        <image
          src="../../static/image/go_back2.png"
          mode="scaleToFill" />
      </view>
      <view class="page__head-center">
        {{ $t('airdrop.history.pageTitle') }}
      </view>
    </view>
    <view class="page__body">
      <view class="page__body-content">
        <template v-if="isEmpty">
          <view class="page__body-content-empty">
            <image
              src="../../static/image/komg.png"
              mode="scaleToFill" />
            <text>{{ $t('common.messages.empty') }}</text>
          </view>
        </template>
        <template v-else>
          <view class="page__body-content-data">
            <view
              v-for="item in list"
              class="page__body-content-data__item">
              <view class="page__body-content-data__item-detail">
                <view class="page__body-content-data__item-detail-left">
                  <view class="col1">
                    <image src="../../static/black/lv.png" />
                    <text>{{ item.name }}</text>
                    <text>{{ item.blockchainNetwork }}</text>
                  </view>
                  <text class="col2">數量: {{ item.number }} </text>
                </view>
                <view class="page__body-content-data__item-detail-right">
                  <text>
                    價值: <text>{{ item.valuation }}</text>
                  </text>
                  <text>
                    過期時間:
                    <text>{{ setTime(item.expireTime) }}</text>
                  </text>
                </view>
              </view>
              <!-- <view class="page__body-content-data__item-button"> 兌換 </view> -->
            </view>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import Empty from '../../components/empty.vue'
export default {
  components: {
    Empty,
  },
  data() {
    return {
      list: [],
      isLoading: false,
    }
  },
  created() {},
  mounted() {
    this.fetchRedeemHistoryData()
  },
  computed: {
    isEmpty() {
      return !this.isLoading && this.list.length === 0
    },
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      })
    },
    setTime(timestamp) {
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      const second = date.getSeconds().toString().padStart(2, '0')
      return `${hour}:${minute}:${second}`
    },
    async fetchRedeemHistoryData() {
      uni.showLoading({
        title: this.$t('common.messages.loading'),
        mask: true,
      })
      this.isLoading = true
      const res = await this.$request.post(
        '/zhaotoubao-server/user/getIntegralStore',
        {
          data: {
            base: {},
            param: {
              offset: 1,
              count: 10,
              type: 1, // 0：所有 1:历史兑换
            },
          },
        }
      )
      if (res.data.base.code === '000000') {
        uni.hideLoading()
        this.isLoading = false
        this.list = res.data.data
      }
      uni.hideLoading()
      this.isLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  min-width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
  background-color: #000;
  padding-top: 30px;
  &__head {
    position: relative;
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 44px;
    &-left {
      position: absolute;
      top: 50%;
      left: 24px;
      transform: translateY(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        width: 76rpx;
        height: 76rpx;
      }
    }
    &-center {
      color: #ffffff;
      font-weight: bold;
    }
  }
  &__body {
    flex: 1;
    min-height: calc(100dvh - (44px + 30px));
    height: 100%;
    display: flex;
    flex-direction: column;
    &-content {
      // flex: 1;
      // display: flex;
      // flex-direction: column;
      // gap: 20px;
      &-loading {
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &-empty {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 128px;
        text {
          color: hsla(240, 33%, 94%, 0.6);
        }
        image {
          width: 134rpx;
          height: 134rpx;
        }
      }
      &-data {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 24px 15px 24px 15px;
        &__item {
          flex-shrink: 1;
          padding: 6px 0 6px 14px;
          background: hsl(240, 14%, 9%);
          border-radius: 13px;
          display: flex;
          gap: 8px;
          &-detail {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &-left {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              gap: 8px;
              flex-shrink: 0;
              .col1 {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 5px;
                image {
                  width: 45.8rpx;
                  height: 45.8rpx;
                }
                text:nth-child(2) {
                  font-weight: bold;
                  font-size: 14px;
                  color: hsl(252, 71%, 99%);
                }
                text:nth-child(3) {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 14px;
                  border-radius: 4px;
                  padding: 0 5px 0 5px;
                  font-size: 10px;
                  font-weight: bold;
                  color: hsl(0, 0%, 0%);
                  background: hsl(240, 1%, 42%);
                }
              }
              .col2 {
                color: hsl(240, 1%, 42%);
                font-size: 12px;
              }
            }
            &-right {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 8px;
              font-size: 12px;
              text:nth-child(1) {
                text {
                  color: hsl(252, 71%, 99%);
                }
                margin-left: 5px;
                color: hsl(240, 1%, 42%);
              }
              text:nth-child(2) {
                text {
                  color: red;
                }
                color: hsl(240, 1%, 42%);
                margin-left: 5px;
              }
            }
          }

          &-button {
            border-radius: 13px;
            margin-right: 6px;
            padding: 20px 10px 20px 10px;
            background: hsl(252, 4%, 25%);
            color: hsl(39, 81%, 70%);
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
