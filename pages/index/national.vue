<template>
  <div class="transfer_box">
    <div class="navBox">
      <div class="back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="title">权益中心</div>
      <span @click="exchange = true">兑换权益</span>
    </div>

    <div class="bld">
      <div class="bld_tit">
        <div :class="check == 0 ? 'check' : ''" @click="setTab(0)">当前权益</div>
        <div :class="check == 1 ? 'check' : ''" @click="setTab(1)">历史权益</div>
      </div>

      <div class="bld_con">
        <div v-if="waterList.length">
          <scroll-view @scrolltolower="scrolltolowerFnc">
            <div class="itm" v-for="(item, index) in waterList" :key="index">
              <div class="itm_1">
                <div class="lef">
                  <image src="../../static/image/card.png" />
                  <div>{{ item.name }}</div>
                </div>
                <div class="rig" v-if="check == 0" @click="setCard(item)">
                  <div>赠送</div>
                  <image src="../../static/image/rig.png" />
                </div>
              </div>
              <div class="itm_2">
                <div class="lef">
                  1年年费，内含
                  <span>{{ item.redEnvelopeAmount }}</span>
                  红包
                </div>
                <div class="rig">{{ check == 0 ? "长期有效" : "已赠送" }}</div>
              </div>
            </div>
          </scroll-view>
        </div>
        <div class="kong" v-else>
          <image src="../../static/image/komg.png" />
          <div>暂无记录～</div>
        </div>
      </div>
    </div>

    <u-popup :show="applyShow" mode="bottom" round="20px" @close="close" class="poup">
      <view class="poup_hed">
        <view></view>
        <view>选择赠送方式</view>
        <image src="../../static/image/clor.png" @click="close()" />
      </view>
      <view class="poup_bld">
        <div class="bld_itm">
          <div class="lef">
            <div class="lef1">
              <image src="../../static/image/copa1.png" />
              <div>复制兑换信息</div>
            </div>
            <div class="lef2">* 适用于未注册用户</div>
          </div>
          <image
            class="rig"
            @click="copyContent(redemptionCode)"
            src="../../static/image/coppy.png"
            alt=""
          />
        </div>

        <div class="bld_itm">
          <div class="lef">
            <div class="lef1">
              <image src="../../static/image/copa2.png" />
              <div>直接赠送好友</div>
            </div>
            <div class="lef2">* 适用于已注册用户</div>
          </div>
          <div class="rig2" @click="gogift()">赠送</div>
        </div>
      </view>
    </u-popup>

    <u-popup
      :show="exchange"
      mode="bottom"
      round="20px"
      @close="exchange = false"
      class="poup"
    >
      <view class="poup_hed">
        <view></view>
        <view>请输入专属兑换码</view>
        <image src="../../static/image/clor.png" @click="exchange = false" />
      </view>
      <view class="poup_bld">
        <div class="input">
          <input
            type="text"
            v-model="Code"
            placeholder="请输入专属兑换码"
            name=""
            id=""
          />
        </div>

        <view class="buy" @click="openCard()">确认</view>
      </view>
    </u-popup>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      Code: "",
      buyState: false,
      exchange: false,
      redemptionCode: "",
      applyShow: false,
      list: [],
      check: 0,
      pageNo: 1,
      waterList: [],
      fundfinished: false,
      name: "",
      id: "",
      redEnvelopeAmount: "",
    };
  },
  props: [],
  onShow() {
    this.water();
  },
  methods: {
    scrolltolowerFnc() {
      if (this.fundfinished) {
        return;
      }
      this.pageNo++;
      this.water();
    },
    setTab(index) {
      this.check = index;
      this.pageNo = 1;
      this.water();
    },

    setCard(item) {
      this.name = item.name;
      this.id = item.id;
      this.redEnvelopeAmount = item.redEnvelopeAmount;
      this.redemptionCode = item.redemptionCode;
      this.applyShow = true;
    },

    copyContent(item) {
      uni.setClipboardData({
        data: item,
        success: () => {
          uni.getClipboardData({
            success: (res) => {
              this.$api.msg("复制成功");
            },
          });
        },
      });
    },

    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },

    gogift() {
      this.applyShow = false;
      uni.navigateTo({
        url:
          "../index/gift?name=" +
          this.name +
          "&id=" +
          this.id +
          "&price=" +
          this.redEnvelopeAmount,
      });
    },

    close() {
      this.applyShow = false;
    },

    async water() {
      uni.showLoading({
        title: "Loading",
      });
      let res = await this.$request.post("/finance/card/myGiftCard", {
        data: {
          pageNo: this.pageNo,
          pageSize: 20,
          ifUse: this.check,
        },
      });
      uni.hideLoading();
      if (res.data.code == 0) {
        let obj = res.data.data.content;
        if (this.pageNo == 1) {
          this.waterList = obj;
        } else {
          this.waterList = [...this.waterList, ...obj];
        }

        if (obj.length == 0 || obj.length < 10) {
          this.fundfinished = true;
        }
      }
    },

    async openCard() {
      if (!this.Code) {
        this.$api.msg("请输入兑换码");
        return;
      }

      if (this.buyState) {
        return;
      }

      this.buyState = true;

      uni.showLoading({
        title: "Loading",
      });

      let res = await this.$request.post("/finance/card/exchangeCard", {
        data: {
          redemptionCode: this.Code,
        },
      });
      uni.hideLoading();
      if (res.data.code == 0) {
        this.buyState = false;
        this.exchange = false;
        this.$api.msg("兑换成功");
        this.pageNo = 1;
        this.water();
      } else {
        this.$api.msg(res.data.message);
        this.buyState = false;
      }
    },
  },
};
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

  .div,.rec {
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

  span {
    font-weight: 400;
    font-size: 28rpx;
    color: rgba(240, 196, 115, 1);
    line-height: 38rpx;
  }
}
.bld {
  padding: 32rpx 32rpx 0;
  .bld_tit {
    border-radius: 20rpx;
    border: 2rpx solid rgba(240, 196, 115, 1);
    padding: 4rpx;
    display: flex;
    align-items: center;
    div {
      width: 50%;
      padding: 18rpx 0;
      text-align: center;
      font-weight: 400;
      font-size: 32rpx;
      color: rgba(240, 196, 115, 1);
      line-height: 44rpx;
    }
    .check {
      background: rgba(240, 196, 115, 1);
      border-radius: 16rpx;
      color: #ffffff;
      font-weight: bold;
    }
  }
  .bld_con {
    padding-top: 8rpx;
    .itm {
      margin-top: 24rpx;
      background: rgba(71, 76, 100, 0.6);
      border-radius: 24rpx;
      padding: 24rpx 32rpx;
      .itm_1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .lef {
          display: flex;
          align-items: center;
          image {
            width: 38rpx;
            margin-right: 8rpx;
            height: 30rpx;
          }
          div {
            font-weight: bold;
            font-size: 28rpx;
            color: #fff;
            line-height: 38rpx;
          }
        }
        .rig {
          background: linear-gradient(
            135deg,
            rgba(135, 118, 249, 0.2) 0%,
            rgba(180, 90, 224, 0.2) 100%
          );
          border-radius: 12rpx;
          display: flex;
          align-items: center;
          div {
            padding: 8rpx 16rpx;
            font-weight: 400;
            font-size: 24rpx;
            color: rgba(240, 196, 115, 1);
            line-height: 32rpx;
          }
          image {
            width: 48rpx;
            height: 48rpx;
          }
        }
      }

      .itm_2 {
        margin-top: 16rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .lef {
          font-weight: 400;
          font-size: 24rpx;
          color: #fff;
          line-height: 32rpx;
          span {
            color: rgba(240, 196, 115, 1);
          }
        }
        .rig {
          font-weight: 400;
          font-size: 24rpx;
          color: #ccc;
          line-height: 32rpx;
        }
      }
    }
  }
}
.kong {
  padding: 100rpx 0;
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
    font-size: 24rpx;
    color: #666666;
    line-height: 24rpx;
  }
}

/deep/ .u-popup__content {
  background-image: url("../../static/image/poup_bg.png");
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
  padding: 8rpx 32rpx 40rpx;

  .input {
    margin-top: 64rpx;
    padding: 26rpx;
    font-size: 28rpx;
    background: #ffffff;
    border-radius: 16rpx;
    border: 1rpx solid rgba(151, 151, 151, 0.5);
    input {
      font-weight: bold;
      font-size: 28rpx;
      color: #000;
    }
  }
  .buy {
    margin-top: 100rpx;
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
  .bld_itm {
    margin-top: 32rpx;
    background: #f5f6f7;
    border-radius: 24rpx;
    border: 1rpx solid rgba(151, 151, 151, 0.5);
    padding: 24rpx 32rpx 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .lef {
      .lef1 {
        display: flex;
        align-items: center;
        image {
          width: 48rpx;
          height: 48rpx;
          margin-right: 12rpx;
        }
        div {
          font-weight: bold;
          font-size: 32rpx;
          color: #333333;
          line-height: 44rpx;
        }
      }
      .lef2 {
        margin-top: 10rpx;
        font-weight: 400;
        font-size: 22rpx;
        color: #999999;
        line-height: 28rpx;
      }
    }
    .rig {
      width: 64rpx;
      height: 64rpx;
    }
    .rig2 {
      padding: 12rpx 32rpx;
      background: linear-gradient(135deg, #8776f9 0%, #b45ae0 100%);
      font-weight: 600;
      font-size: 32rpx;
      color: #ffffff;
      line-height: 44rpx;
      border-radius: 18rpx;
    }
  }
}
</style>
