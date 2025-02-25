<template>
  <div class="card_box">
    <div class="navBox">
      <div class="back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="title">{{ $t('user.team.pageTitle') }}</div>
      <div class="div"></div>
    </div>
    <view class="container">
      <div class="con_hed">
        <div class="tit">
          <div class="tit_lef">
            <div>{{ $t('user.team.container1.text1') }}</div>
            <div>{{ memberGradeName }}</div>
            <div class="sj">{{ $t('user.team.container1.text3', { number: upgradeNeedTeamNumber }) }}</div>
          </div>
          <div class="tit_rig">
            <div>{{ $t('user.team.container1.text2') }}</div>
            <div>{{ totalRewardAmount }}</div>
            <div class="xs">
              <image src="../../static/image/qy.png" />
              <span>{{ $t('user.team.container1.text4', { number: teamRate * 100 }) }}</span>
            </div>
          </div>
        </div>

        <div class="link">
          <div class="link_lef">
            <div>{{ $t('user.team.container1.text6') }}</div>
            <div>{{ Invite }}</div>
          </div>
          <div class="link_rig" @click="copyContent(Invite)">{{ $t('user.team.container1.text7') }}</div>
        </div>

        <div class="coder">
          <div>{{ $t('user.team.container1.text5') }}</div>
          <span>{{ promotionCode }}</span>
        </div>
      </div>

      <div class="team_box pd">
        <div class="team_tit2">
          <div class="tit_lef">
            <image src="../../static/image/team2.png" />
            <div>{{ $t('user.team.container2.text1') }}</div>
          </div>
          <!-- <div class="tit_rig">
          <div>成员列表</div>
          <image src="../../static/image/go7.png" />
        </div> -->
        </div>

        <div class="team_cont2">
          <div class="itm">
            <div>{{ $t('user.team.container2.text2') }}</div>
            <span>{{ teamNum }}</span>
          </div>
          <div class="bld"></div>
          <div class="itm">
            <div>{{ $t('user.team.container2.text3') }}</div>
            <span>{{ directNum }}</span>
          </div>
          <div class="bld"></div>
          <div class="itm">
            <div>{{ $t('user.team.container2.text4') }}</div>
            <span>{{ teamCardNum }}</span>
          </div>
        </div>
      </div>

      <div class="team_box">
        <div class="team_tit">
          <div class="tit_lef">
            <image src="../../static/image/team2.png" />
            <div>{{ $t('user.team.container3.text1') }}</div>
          </div>
        </div>

        <div class="team_cont">
          <div v-if="List.length">
            <div class="tem_itm" v-for="(item, index) in List" :key="index">
              <div class="itm_lef">
                <span>{{ item.email }}</span>
                <div>{{ item.memberGradeName }}</div>
              </div>
              <div class="itm_rig">返現價值：{{ item.rewardAmount }}</div>
            </div>
          </div>

          <div class="kong" v-else>
            <image src="../../static/image/komg.png" />
            <div>{{ $t('common.empty') }}</div>
          </div>
        </div>
      </div>
    </view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      List: [],
      Invite: "",
      directNum: 0,
      teamNum: 0,
      memberGradeName: "",
      totalRewardAmount: 0,
      upgradeNeedTeamNumber: 0,
      teamRate: 0,
      teamCardNum: 0,
      promotionCode: "",
    };
  },
  onShow() {
    this.setUser();
    this.teamList();
    this.static();
  },
  mounted() {},
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },
    async static() {
      let res = await this.$request.post("/uc/promotion/record/statistics");
      if (res.data.code == 0) {
        this.directNum = res.data.data.directNum;
        this.teamNum = res.data.data.teamNum;
        this.memberGradeName = res.data.data.memberGradeName;
        this.totalRewardAmount = res.data.data.totalRewardAmount;
        this.upgradeNeedTeamNumber = res.data.data.upgradeNeedTeamNumber;
        this.teamRate = res.data.data.teamRate;
        this.teamCardNum = res.data.data.teamCardNum;
        this.promotionCode = res.data.data.promotionCode;
      }
    },
    async setUser() {
      let res = await this.$request.post("/uc/approve/security/setting");
      if (res.data.code == 0) {
        this.Invite =
          "https://payfi.8.top/pages/register/register?invite=" +
          res.data.data.bindPromotionCode;
      }
    },

    copyContent(item) {
      uni.setClipboardData({
        data: item,
        success: () => {
          uni.getClipboardData({
            success: (res) => {
              this.$api.msg(this.$t('common.messages.copySucceed'));
            },
          });
        },
      });
    },

    async teamList() {
      let res = await this.$request.post("/uc/promotion/record", {
        data: {
          pageNo: 1,
          pageSize: 10,
        },
      });
      if (res.data.code == 0) {
        this.List = res.data.data.content;
      }
    },
  },
};
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
  padding: 12rpx 32rpx 32rpx;
  .con_hed {
    padding: 32rpx;
    background: rgba(46, 47, 54, 0.4);
    box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(0, 0, 0, 0.2);
    border-radius: 24rpx;
    .tit {
      display: flex;
      align-items: center;
      .tit_lef,
      .tit_rig {
        width: 50%;
        div:nth-child(1) {
          margin-bottom: 12rpx;
          font-family: MiSans, MiSans;
          font-weight: 400;
          font-size: 24rpx;
          color: #999999;
          line-height: 32rpx;
        }
        div:nth-child(2) {
          margin-bottom: 12rpx;
          font-weight: bold;
          font-size: 40rpx;
          color: #fff;
          line-height: 54rpx;
          letter-spacing: 1px;
        }
        .sj {
          font-weight: 400;
          font-size: 20rpx;
          color: #999999;
          line-height: 26rpx;
        }
        .xs {
          padding: 4rpx 8rpx;
          background: rgba(231, 160, 17, 0.1);
          border-radius: 8rpx;
          display: flex;
          align-items: center;
          image {
            width: 28rpx;
            height: 28rpx;
            display: block;
          }
          span {
            margin-left: 4rpx;
            font-weight: 400;
            font-size: 20rpx;
            color: #e7a011;
            line-height: 26rpx;
          }
        }
      }
    }

    .coder {
      margin-top: 24rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      div {
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        line-height: 32rpx;
      }
      span {
        font-weight: bold;
        font-size: 24rpx;
        color: #fff;
        line-height: 32rpx;
      }
    }

    .link {
      margin-top: 20rpx;
      background: rgba(240, 196, 115, 0.4);
      border-radius: 24rpx;
      border: 1rpx solid rgba(240, 196, 115, 0.5);
      padding: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .link_lef {
        width: 70%;
        word-wrap: break-word; /* 允许在单词内换行 */
        overflow-wrap: break-word;
        div {
          margin-bottom: 12rpx;
          font-weight: bold;
          font-size: 24rpx;
          color: rgba(240, 196, 115, 1);
          line-height: 32rpx;
        }
        span {
          font-weight: 400;
          font-size: 20rpx;
          color: rgba(240, 196, 115, 1);
          line-height: 26rpx;
          letter-spacing: 1px;
        }
      }

      .link_rig {
        border-radius: 20rpx;
        padding: 12rpx 32rpx;
        background: rgba(240, 196, 115, 1);
        font-weight: 500;
        font-size: 28rpx;
        color: #000;
        line-height: 38rpx;
      }
    }
  }

  .team_box {
    margin-top: 24rpx;
    background: rgba(46, 47, 54, 0.4);
    border-radius: 24rpx;
    padding: 24rpx 32rpx 32rpx;
    .team_tit2 {
      padding: 0 !important;
      border: none !important;
    }
    .team_tit,
    .team_tit2 {
      padding-bottom: 24rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(151, 151, 151, 0.1);
      .tit_lef {
        display: flex;
        align-items: center;
        image {
          width: 32rpx;
          height: 32rpx;
          margin-right: 4rpx;
          display: block;
        }
        div {
          font-weight: bold;
          font-size: 28rpx;
          color: #fff;
          line-height: 36rpx;
        }
      }

      .tit_rig {
        display: flex;
        align-items: center;
        image {
          width: 24rpx;
          height: 24rpx;
          margin-right: 4rpx;
          display: block;
        }
        div {
          font-weight: 400;
          font-size: 24rpx;
          color: rgba(240, 196, 115, 1);
          line-height: 32rpx;
        }
      }
    }

    .team_cont {
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
          font-size: 25rpx;
          color: rgba(235, 235, 245, 0.6);
          line-height: 34rpx;
        }
      }
      .tem_itm {
        padding: 32rpx 0 26rpx;
        border-bottom: 1px solid rgba(151, 151, 151, 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        .itm_lef {
          display: flex;
          align-items: center;
          span {
            margin-right: 8rpx;
            font-weight: 400;
            font-size: 28rpx;
            color: #fff;
            line-height: 36rpx;
          }
          div {
            padding: 6rpx 16rpx;
            font-weight: 400;
            font-size: 20rpx;
            color: rgba(240, 196, 115, 1);
            line-height: 24rpx;
            background: rgba(156, 71, 227, 0.1);
            border-radius: 12rpx;
          }
        }
        .itm_rig {
          font-weight: 400;
          font-size: 24rpx;
          color: #333333;
          line-height: 36rpx;
        }
      }
    }

    .team_cont2 {
      margin-top: 26rpx;
      background: rgba(240, 196, 115, 0.5);
      border-radius: 24rpx;
      padding: 32rpx 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .itm {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 32%;
        div {
          margin-bottom: 12rpx;
          font-weight: 400;
          font-size: 22rpx;
          color: #ccc;
          line-height: 28rpx;
        }
        span {
          font-weight: bold;
          font-size: 28rpx;
          color: #fff;
          line-height: 38rpx;
        }
      }

      .bld {
        width: 2rpx;
        height: 40rpx;
        background: rgba(151, 151, 151, 0.6);
      }
    }
  }
  .pd {
    padding: 40rpx 32rpx 60rpx;
  }
}
</style>
