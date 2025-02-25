<template>
  <div class="transfer_box">
    <div class="navBox">
      <div class="back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="title">积分流水</div>
      <div class="div"></div>
    </div>

    <div class="transfer_center">
      <div v-for="(item, index) in list" :key="index">
        <div class="guo_itm">
          <div class="itm_lef">
            <div>{{ setType(item.type) }}</div>
            <span>{{ setTime(item.createTime) }}</span>
          </div>
          <div class="itm_rig">
            {{ item.changeExperience }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UQRCode from "uqrcodejs";
export default {
  components: {},
  data() {
    return {
      list: [],
    };
  },
  props: [],
  mounted() {
    this.task();
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },
    async task() {
      let res = await this.$request.post(
        "/zhaotoubao-server/user/getUserIntegrationRecord",
        {
          data: {
            base: {},
            param: {
              offset: 1,
              count: 10,
            },
          },
        }
      );
      if (res.data.base.code == "000000") {
        this.list = res.data.data;
      }
    },

    setType(item) {
      let type = "";
      if (item == 1) {
        type = "完成KYC认证";
      } else if (item == 2) {
        type = "邀请用户完成KYC认证";
      } else if (item == 3) {
        type = "邀请用户开卡";
      } else if (item == 4) {
        type = "完成开卡";
      }
      return type;
    },

    setTime(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hour = date.getHours().toString().padStart(2, "0");
      const minute = date.getMinutes().toString().padStart(2, "0");
      const second = date.getSeconds().toString().padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },
    duihuan() {},
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
.qrcode {
  display: inline-block;
  width: 140px;
  height: 140px;
  background-color: #fff;
  padding: 6px;
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

  span {
    font-weight: 400;
    font-size: 28rpx;
    color: #f0c473;
    line-height: 38rpx;
  }
}

.transfer_box {
  position: relative;
  .transfer_center {
    padding: 0 30rpx 20rpx;
    .guo_itm {
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(31, 32, 41, 0.6);
      border-radius: 27rpx;
      padding: 24rpx 16rpx 32rpx 24rpx;
      .itm_lef {
        div {
          margin-bottom: 8rpx;
          font-weight: 400;
          font-size: 31rpx;
          color: #ffffff;
          line-height: 42rpx;
        }
        span {
          font-weight: 300;
          font-size: 23rpx;
          color: rgba(255, 255, 255, 0.6);
          line-height: 32rpx;
          text-align: left;
        }
      }
      .itm_rig {
        display: flex;
        align-items: center;
        font-weight: 400;
        font-size: 31rpx;
        color: #fff;
        line-height: 42rpx;
      }
    }
  }
}
</style>
