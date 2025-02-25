<template>
  <view class="container">
    <div class="heder">
      <view class="homeme_had">
        <view class="lef">
          <image src="../../static/image/wallet.png" />
          <view>账户</view>
        </view>
        <!-- <image class="rig" src="../../static/image/service2.png" /> -->
      </view>

      <div class="user">
        <image :src="userInfo.avatar || '../../static/image/avater.png'" />
        <div class="name">
          <div>{{ userInfo.email }}</div>
          <div>UID:{{ userInfo.memberId }}</div>
        </div>
      </div>

      <div class="invite_box">
        <div class="invite">
          <div class="in_lef">
            <image src="../../static/image/invite2.png" />
            <div class="tit">
              <div>邀请好友</div>
              <div>邀请好友获取好礼</div>
            </div>
          </div>
          <div class="in_rig" @click="goInvite()">
            <div>立即邀请</div>
            <image src="../../static/image/go5.png" />
          </div>
        </div>
      </div>
    </div>

    <div class="ability_box">
      <div class="ability">
        <div class="ab_item" @click="gorouter()">
          <div class="itm_le">
            <image src="../../static/image/ic1.png" />
            <div>身份认证</div>
          </div>
          <div class="itm_ri">
            <div>
              {{
                userInfo.realNameStatus == 0
                  ? "未认证"
                  : userInfo.realNameStatus == 1
                  ? "审核中"
                  : "已认证"
              }}
            </div>
            <image v-if="userInfo.realNameStatus == 0" src="../../static/image/go4.png" />
          </div>
        </div>
        <div class="ab_item" @click="gotem()">
          <div class="itm_le">
            <image src="../../static/image/ic2.png" />
            <div>团队管理</div>
          </div>
          <div class="itm_ri">
            <image src="../../static/image/go4.png" />
          </div>
        </div>
        <div class="ab_item" @click="gosecure()">
          <div class="itm_le">
            <image src="../../static/image/ic3.png" />
            <div>账号安全</div>
          </div>
          <div class="itm_ri">
            <image src="../../static/image/go4.png" />
          </div>
        </div>
        <div class="ab_item" @click="goservice()">
          <div class="itm_le">
            <image src="../../static/image/ic5.png" />
            <div>聯繫我們</div>
          </div>
          <div class="itm_ri">
            <image src="../../static/image/go4.png" />
          </div>
        </div>
        <div class="ab_item" @click="gohelp()">
          <div class="itm_le">
            <image src="../../static/image/ic6.png" />
            <div>帮助中心</div>
          </div>
          <div class="itm_ri">
            <image src="../../static/image/go4.png" />
          </div>
        </div>
      </div>
    </div>

    <div class="out">
      <div @click="outLogin()">退出登录</div>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
    };
  },
  onShow() {
    this.setUser();
  },
  mounted() {},
  methods: {
    async setUser() {
      let res = await this.$request.post("/finance/card/payInfoSummary");
      if (res.data.code == 0) {
        this.userInfo = res.data.data;
      }
    },

    gotem() {
      uni.navigateTo({ url: "/pages/user/team2" });
    },

    gosecure() {
      uni.navigateTo({ url: "/pages/user/secure" });
    },

    goservice() {
      uni.navigateTo({ url: "/pages/user/service" });
    },

    gohelp() {
      uni.navigateTo({ url: "/pages/help/help" });
    },

    goInvite() {
      uni.navigateTo({ url: "/pages/user/team2" });
    },

    gorouter() {
      if (this.userInfo.realNameStatus == 0) {
        uni.navigateTo({ url: "/pages/user/identity" });
      }
    },

    async outLogin() {
      uni.showModal({
        content: "是否确认退出",
        confirmText: "确定",
        cancelText: "取消",
        success: function (res) {
          if (res.confirm) {
            uni.removeStorageSync("token");
            setTimeout(() => {
              uni.navigateTo({
                url: "../public/login",
              });
            }, 1000);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
page {
  height: 100%;
  font-size: 14px;
  line-height: 1.8;
}
.container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: RGBA(248, 248, 248, 1);
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
  background-image: url("../../static/image/card_hed.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-height: 378px;
  .user {
    padding: 16px 16px 0;
    display: flex;
    align-items: center;
    image {
      width: 56px;
      height: 56px;
      margin-right: 6px;
      border-radius: 50%;
    }
    .name {
      div:nth-child(1) {
        font-weight: 600;
        margin-bottom: 8px;
        font-size: 18px;
        color: #333333;
        line-height: 24px;
      }
      div:nth-child(2) {
        font-weight: 400;
        font-size: 12px;
        color: #999999;
        line-height: 16px;
      }
    }
  }

  .invite_box {
    padding: 25px 16px 0;
    .invite {
      background-image: url("../../static/image/invite.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 13px 15px 15px 11px;
      .in_lef {
        display: flex;
        align-items: center;
        image {
          width: 58px;
          height: 50px;
          margin-right: 9px;
        }
        .tit {
          div:nth-child(1) {
            font-weight: bold;
            font-size: 18px;
            color: #ffffff;
            line-height: 24px;
          }
          div:nth-child(2) {
            margin-top: 8px;
            font-weight: 400;
            font-size: 12px;
            color: #ffffff;
            line-height: 16px;
          }
        }
      }
      .in_rig {
        padding: 6px 12px;
        background: #ffffff;
        border-radius: 14px;
        display: flex;
        align-items: center;
        div {
          font-weight: 400;
          font-size: 12px;
          color: #451200;
          line-height: 16px;
          margin-right: 2px;
        }
        image {
          width: 12px;
          height: 12px;
        }
      }
    }
  }
}
.homeme_had {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(151, 151, 151, 0.2);
  .lef {
    display: flex;
    align-items: center;
    image {
      width: 20px;
      height: 20px;
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
    width: 28px;
    height: 28px;
  }
}
.ability_box {
  margin-top: -130px;
  padding: 0 16px;
  position: relative;
  z-index: 2;
  .ability {
    background: #ffffff;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 0 12px;
    .ab_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid rgba(151, 151, 151, 0.2);
      .itm_le {
        display: flex;
        align-items: center;
        image {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
        div {
          font-weight: 400;
          font-size: 15px;
          color: #333333;
          line-height: 21px;
        }
      }
      .itm_ri {
        display: flex;
        align-items: center;
        div {
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          line-height: 20px;
          margin-right: 4px;
        }
        image {
          width: 18px;
          height: 18px;
        }
      }
    }
    .ab_item:last-child {
      border: none;
    }
  }
}

.out {
  padding: 16px 16px;
  div {
    background: #ffffff;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 12px 0;
    font-weight: 400;
    font-size: 15px;
    color: #333333;
    line-height: 21px;
    text-align: center;
  }
}
</style>
