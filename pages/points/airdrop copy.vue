<!-- 此页面正在开发中，误删 -->
<template>
  <view class="container">
    <view class="heder">
      <child-component ref="drag"> </child-component>

      <view class="bala">
        <div class="ba_hed">
          <div class="ba_itm ba_it1">
            <div class="ba_1">
              <div>累積獲得空投價值</div>
            </div>
            <div class="ba_2">≈0</div>
          </div>
          <div class="ba_itm">
            <div class="ba_4">平台算力排名</div>
            <div class="ba_5">0</div>
          </div>
        </div>

        <div class="liushui">近30天領取的免費空投價值≈0</div>
      </view>
    </view>

    <!-- 如果用户没有开卡，显示开发选项 -->
    <template v-if="!userHasCard">
      <view
        class="openCard"
        @click="openCard()"
      >
        <text
          >{{ $t('airdrop.common.openCardToRedeemAirdrop') }}&nbsp;&gt;</text
        >
        <div class="rightIcon">
          <img
            src="/static/img/card222.png"
            alt=""
          />
        </div>
      </view>
    </template>

    <div class="guanggao">
      <div class="guan_tit">
        <div>積分兌換空投權益</div>
        <span @click="godetail()">查看全部 ></span>
      </div>
      <div
        v-for="(item, index) in list"
        :key="index"
      >
        <div class="guo_itm">
          <div class="itm_lef">
            <image src="../../static/black/lv.png" />
            <div>{{ item.name }}</div>
            <span>{{ item.blockchainNetwork }}</span>
          </div>
          <div class="itm_rig">
            <div class="lab1">
              <div class="div1">
                價值：<span>{{ item.valuation }}</span>
              </div>
              <div class="div2">
                {{ setTime(item.expireTime) }} <span>後權益過期</span>
              </div>
            </div>
            <div
              class="lab2"
              @click="duihuan(item.id)"
            >
              兌換
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="chahua"
      @click="goqy()"
    >
      <image src="../../static/black/sc.png" />
      <div>权益中心</div>
      <span>給好友贈送權益或兌換權益</span>
    </div>

    <!-- <template>
      <u-picker
        :show="showAddressList"
        :columns="addressList"
        @cancel="showAddressList = false"
        keyName="address"
        @confirm="selectAddress"
        confirmColor="#FF5B13"
        confirmText="确认"
        cancelText="取消"
      >
      </u-picker>
    </template> -->

    <!-- 循环是否确认兑换Modal -->
    <!-- <template>
      <u-popup
        :show="showRedeemConfirm"
        model="bottom"
        :round="10"
        @close="showRedeemConfirm = false"
      >
        <view class="redeemConfirm">
          <h2 class="title">是否確認兌換HQRD?</h2>
          <view class="infoFormBox">
            <div class="infoForm">
              <span>預計價值</span>
              <u-input />
            </div>
            <div class="infoForm">
              <span>需要消耗積分</span>
              <u-input />
            </div>
          </view>
          <view style="margin-top: 24px">
            <u-button
              @click="onClickConfirmRedeem"
              :custom-style="customButtonStyle"
              >確認兌換</u-button
            >
          </view>
        </view>
      </u-popup>
    </template> -->

    <template>
      <custom-modal
        ref="modal2"
        mode="bottom"
        title="请选择地址"
        showCancelButton
        showConfirmButton
        cancelText="取消"
        confirmText="下一步"
      >
        <view
          class="address-list"
          v-if="addressList[0].length > 0"
        >
          <text
            class="address-list__item"
            v-for="{ address } in addressList[0]"
          >
            {{ address }}
          </text>
        </view>
        <view v-else>请先添加地址</view>
      </custom-modal>
    </template>

    <!-- 提示未开卡Modal -->
    <template>
      <custom-modal
        ref="modalRef"
        mode="center"
        title="开卡即可兑换空投"
        confirmText="去开卡"
        showCancelButton
        showConfirmButton
        @confirm="openCard"
      />
    </template>
  </view>
</template>

<script>
import ChildComponent from '../public/hed.vue'
import CustomModal from '../../components/custom-modal.vue'

export default {
  components: {
    ChildComponent,
    CustomModal,
  },
  data() {
    return {
      popupVisible: true,
      Invite: '',
      balance: 0,
      totalNumber: 0,
      list: [],
      userHasCard: false,
      showAddressList: false,
      showRedeemConfirm: false,
      modalVisible: true,
      addressList: [[]],
      selectedPointId: '',
      redeemPointObj: {
        pointId: '',
        address: '',
      },
      customButtonStyle: {
        color: '#000000',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '14px',
        backgroundColor: '#f0c474',
      },
    }
  },
  onShow() {
    this.task()
    this.$refs.drag.init()
    this.getUserIntegrationStatistics()
    this.getUserHasCard()
    this.getUserAddress()
  },
  created() {},
  mounted() {},
  methods: {
    goqy() {
      uni.navigateTo({
        url: '/pages/index/national',
      })
    },
    godetail() {
      uni.navigateTo({
        url: '/pages/points/detail',
      })
    },
    openCard() {
      uni.navigateTo({
        url: '/pages/product/index',
      })
    },

    // 获取用户的地址
    async getUserAddress() {
      const res = await this.$request.post('/uc/withdraw/address/page')
      if (res.data.code === 0) {
        const content = res.data.data.content
        if (Array.isArray(content) && content.length > 0) {
          this.addressList = new Array(
            content.map((item) => ({
              address: item.address,
              pointId: this.selectedPointId,
            }))
          )
        } else {
          this.addressList = [[]]
        }
      }
    },
    // 点击确认兑换
    async onClickConfirmRedeem() {
      this.showRedeemConfirm = false

      uni.showLoading({
        title: this.$t('airdrop.loading.loading'),
        mask: true,
      })
      const { pointId: id, address } = this.redeemPointObj
      const res = await this.$request.post(
        '/zhaotoubao-server/exchange/exchangeAdd',
        {
          data: {
            base: {},
            param: {
              id,
              address,
            },
          },
        }
      )
      if (res.data.base.code === '0000') {
        uni.hideLoading()
        uni.showToast({
          title: this.$t('airdrop.loading.success'),
          icon: 'success',
        })
      } else {
        uni.hideLoading()
        uni.showToast({
          title: this.$t('airdrop.loading.fail'),
          icon: 'error',
        })
      }
    },
    // 查询用户是否有开卡
    async getUserHasCard() {
      // const authToken = uni.getStorageSync('token')
      // const res = await this.$request.post("/finance/card/findPhysicalCards", {
      // 	header: {
      // 		"x-auth-token": authToken,
      // 	}
      // });
      const res = await this.$request.post('/finance/card/findPhysicalCards')
      if (res.data.code === 0) {
        const content = res.data.data.content
        const hasCard = Array.isArray(content) && content.length > 0
        this.userHasCard = hasCard
      }
    },
    // 获取用户积分统计
    async getUserIntegrationStatistics() {
      const res = await this.$request.post(
        '/zhaotoubao-server/user/getUserIntegrationStatistics',
        {
          data: {
            base: {},
            param: {},
          },
        }
      )
      console.log(res)
    },
    // 选择地址
    selectAddress(action) {
      this.showAddressList = false
      this.showRedeemConfirm = true
      if (!action.value) return
      Object.assign(this.redeemPointObj, action.value[0])
    },

    async task() {
      let res = await this.$request.post(
        '/zhaotoubao-server/user/getIntegralStore',
        {
          data: {
            base: {},
            param: {
              offset: 1,
              count: 10,
            },
          },
        }
      )
      if (res.data.base.code == '000000') {
        this.list = res.data.data
      }
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
    duihuan(pointId) {
      if (!pointId) return
      if (this.userHasCard) {
        this.$refs.modalRef.open()
        return
      } else {
        // this.showAddressList = true
        this.$refs.modal2.open()
        this.selectedPointId = pointId
        this.getUserAddress()
      }
    },
  },
}
</script>

<style scoped lang="less">
// page {
//   background-color: #f4f5f6;
//   height: 100%;
//   font-size: 14px;
//   line-height: 1.8;
// }

.address-list {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
  margin-bottom: 24px;
  &__item {
    padding: 8px;
    width: 100%;
    white-space: normal;
    word-wrap: break-word;
    border-radius: 8px;
    border: 2px solid #f0c474;
  }
}

.container {
  box-sizing: border-box;
  padding-top: 30px;
  min-height: 100vh;
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

.openCard {
  border-radius: 18px;
  background-color: #e7ccaa;
  margin: 0 17px 17px 17px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: 48px;

  .rightIcon {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 5px 8px 5px;
    border-radius: 10px;
    background-color: #595043;

    img {
      width: 75%;
    }
  }
}

.redeemConfirm {
  padding: 48px 48px 56px 48px;

  .title {
    text-align: center;
    font-weight: 600;
  }

  .infoFormBox {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    margin-top: 24px;

    .infoForm {
      display: grid;
      grid-row-gap: 20px;
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
  }
}

.bala {
  margin: 4px 16px 20px;
  background: linear-gradient(
    180deg,
    rgba(71, 76, 100, 0.8) 0%,
    rgba(230, 204, 170, 0.8) 100%
  );
  border-radius: 34rpx;
  padding: 8rpx 8rpx 32rpx;
  box-sizing: border-box;

  .ba_hed {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .ba_itm {
      box-sizing: border-box;
      padding: 22rpx 28rpx 14rpx;
      width: 40%;
      background: #141418;
      border-radius: 27rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .ba_1 {
        display: flex;
        align-items: center;

        div {
          font-weight: 400;
          font-size: 31rpx;
          color: rgba(235, 235, 245, 0.6);
          line-height: 40rpx;
        }
      }

      .ba_2 {
        margin-top: 20rpx;
        font-weight: 400;
        font-size: 61rpx;
        color: #f0c473;
        line-height: 86rpx;
      }

      .ba_3 {
        font-weight: 400;
        font-size: 27rpx;
        color: rgba(0, 0, 0, 0.8);
        line-height: 38rpx;
      }

      .ba_4 {
        font-weight: 400;
        font-size: 31rpx;
        color: rgba(235, 235, 245, 0.6);
        line-height: 40rpx;
      }

      .ba_5 {
        margin-top: 20rpx;
        font-weight: 400;
        font-size: 53rpx;
        color: #18ce8b;
        line-height: 86rpx;
      }
    }

    .ba_it1 {
      width: 59%;
    }
  }

  .liushui {
    margin: 20rpx 0 0 20rpx;
    font-weight: 400;
    font-size: 27rpx;
    color: #000000;
    line-height: 38rpx;
  }
}

.chahua {
  position: relative;
  margin: 20px 23rpx 0;

  image {
    width: 100%;
    height: 170rpx;
  }

  div {
    position: absolute;
    top: 23rpx;
    left: 36rpx;
    font-weight: 600;
    font-size: 38rpx;
    color: #ffffff;
    line-height: 53rpx;
  }

  span {
    position: absolute;
    top: 90rpx;
    left: 36rpx;
    font-weight: 300;
    font-size: 23rpx;
    color: rgba(235, 235, 245, 0.6);
    line-height: 31rpx;
  }
}

.guanggao {
  padding: 20rpx 8rpx 8rpx 8rpx;
  background: rgba(31, 32, 41, 0.6);
  border-radius: 34rpx;
  padding: 20rpx 10rpx 10rpx;
  margin: 0 23rpx 0;

  .guan_tit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10rpx;
    margin: 0 16rpx;

    div {
      font-weight: 600;
      font-size: 32rpx;
      color: rgba(235, 235, 245, 0.8);
      line-height: 42rpx;
    }

    span {
      font-weight: 400;
      font-size: 25rpx;
      color: rgba(235, 235, 245, 0.6);
      line-height: 34rpx;
    }
  }

  .guo_itm {
    margin-top: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(71, 76, 100, 0.1);
    border-radius: 27rpx;
    padding: 24rpx 16rpx 32rpx 24rpx;

    .itm_lef {
      display: flex;
      align-items: center;

      image {
        width: 45.8rpx;
        height: 45.8rpx;
        margin-right: 8rpx;
      }

      div {
        margin-right: 18rpx;
        font-weight: bold;
        font-size: 29rpx;
        color: #ffffff;
        line-height: 38rpx;
      }

      span {
        padding: 0 10rpx;
        display: block;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 8rpx;
        font-weight: bold;
        font-size: 21rpx;
        color: #000000;
        line-height: 31rpx;
        text-align: left;
      }
    }

    .itm_rig {
      display: flex;
      align-items: center;

      .lab1 {
        text-align: right;

        .div1 {
          font-weight: 400;
          font-size: 23rpx;
          color: rgba(255, 255, 255, 0.4);
          line-height: 31rpx;

          span {
            color: #fff;
          }
        }

        .div2 {
          margin-top: 5rpx;
          font-weight: 400;
          font-size: 23rpx;
          line-height: 31rpx;
          color: rgba(255, 91, 92, 1);

          span {
            margin-left: 4rpx;
            color: rgba(255, 255, 255, 0.4);
          }
        }
      }

      .lab2 {
        padding: 12rpx 30rpx;
        background: rgba(240, 196, 115, 0.8);
        border-radius: 19rpx;
        font-weight: 400;
        font-size: 27rpx;
        color: #000000;
        line-height: 38rpx;
        margin-left: 20rpx;
      }
    }
  }
}
</style>
