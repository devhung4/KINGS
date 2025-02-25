<template>
  <div class="transfer_box">
    <div class="navBox">
      <div class="back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="title">{{ $t("index.depositCoins.pageTitle") }}</div>
      <span class="div" @click="record()">{{ $t("index.depositCoins.depositRecords") }}</span>
    </div>

    <div class="transfer_center">
      <div class="top">
        <div class="coin" @click="coinShow = true">
          <span>{{ $t("index.depositCoins.deposit", { coin }) }}</span>
          <image src="../../static/image/drop.png" alt="" />
        </div>

        <div style="display: flex; align-items: center">
          <div
            @click="checkcoin(index)"
            v-for="(item, index) in usdtList"
            :class="[index == coincheck ? 'check' : '', 'network']"
            :key="index"
          >
            {{ item.name }}
          </div>
        </div>
      </div>

      <div class="code">
        <canvas
          id="qrcode"
          class="qrcode"
          canvas-id="qrcode"
          style="width: 200px; height: 200px"
        />

        <div class="adress">{{ $t("index.depositCoins.coinAddress", { coin }) }}</div>
        <div class="adress">{{ address }}</div>
        <div class="copy" @click="copyContent(address)">{{ $t("index.depositCoins.buttons.copyAddress") }}</div>
      </div>

      <div class="transfer_title" v-html="content"></div>
    </div>

    <u-picker
      :show="coinShow"
      :columns="coinActions"
      keyName="label"
      confirmColor="#FF5B13"
      confirmText="确认"
      cancelText="取消"
      @cancel="coinShow = false"
      @confirm="coinSelect"
    >
    </u-picker>
  </div>
</template>

<script>
import UQRCode from "uqrcodejs";
export default {
  components: {},
  data() {
    return {
      address: "",
      coincheck: 0,
      othercheck: 0,
      coinShow: false,
      content: "",
      coin: "",
      usdtList: [],
      coinActions: [[]],
      coinList: [],
      otherList: [],
      qrcode: null,
    };
  },
  props: [],
  mounted() {
    // 充值说明
    this.helpDetail();
    this.getCoinList();
  },
  methods: {
    async getCoinList() {
      uni.showLoading({
        title: "Loading",
      });
      let res = await this.$request.post("/uc/coin/getCoinList", {
        data: { type: 0 },
      });
      let arr = [];
      if (res.data.code == 0) {
        this.coinActions = [[]];
        res.data.data.forEach((item, index) => {
          arr.push({ name: item.name, label: item.name });
          this.coinActions[0].push({ name: item.name, label: item.name });
        });
        this.coin = arr[0].name;
        this.resetAddress(arr[0]);
      }
    },

    async creatQrCode() {
      const qr = new UQRCode();
      qr.data = this.address;
      qr.make();
      const ctx = uni.createCanvasContext("qrcode", this); // 组件内调用需传this，vue3 中 this 为 getCurrentInstance()?.proxy
      qr.canvasContext = ctx;
      uni.hideLoading();

      qr.drawCanvas();
    },
    async helpDetail() {
      let res = await this.$request.post("/news/ancillary/more/help/detail", {
        data: { id: 171 },
      });
      if (res.data.code == 0) {
        this.content = res.data.data.content;
      }
    },

    async resetAddress(item) {
      let res = await this.$request.post("/uc/asset/wallet/reset-address", {
        data: { unit: item.name },
      });
      if (res.data.code == 0) {
        let arr = [];
        if (res.data.data.USDT_ERC20 && res.data.data.USDT_ERC20 != null) {
          arr.push({ address: res.data.data.USDT_ERC20, name: "USDT_ERC20" });
        }
        if (res.data.data.USDT_TRC20 && res.data.data.USDT_TRC20 != null) {
          arr.push({ address: res.data.data.USDT_TRC20, name: "USDT_TRC20" });
        }
        if (res.data.data.USDT_BEP20 && res.data.data.USDT_BEP20 != null) {
          arr.push({ address: res.data.data.USDT_BEP20, name: "USDT_BEP20" });
        }
        this.usdtList = arr;
        this.address = arr[0].address;
        this.creatQrCode();
      }
    },
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },
    record() {
      uni.navigateTo({
        url: "../index/depositCoinsrecord",
      });
    },
    coinSelect(action) {
      this.coincheck = 0;
      this.otherList = [];
      this.coin = action.value[0].name;
      this.coinShow = false;
      this.resetAddress(action.value[0]);
    },
    checkcoin(index) {
      if (this.coincheck == index) {
        return;
      } else {
        this.address = this.usdtList[index].address;
        this.coincheck = index;
      }
      this.creatQrCode();
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

  .div, .rec {
    // width: 76rpx;
    // height: 76rpx;
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
    padding: 15px;
    .top {
      padding: 0 15px 15px;
      .coin {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        span {
          font-size: 18px;
          color: #fff;
        }
        image {
          width: 12px;
          height: 12px;
          display: block;
          margin-left: 10px;
        }
      }
      .network {
        padding: 10px 10px;
        border-radius: 5px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        margin-right: 16px;

        border: 1px solid #f0c473;
        background: none;
        color: #f0c473;
      }
      .check {
        background: #f0c473;
        color: #000;
      }
    }
  }
  .code {
    margin-top: 10px;
    // background: #fff;
    padding: 30px 15px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .adress {
      font-size: 14px;
      margin-top: 20px;
      font-weight: 500;
      color: #fff;
      line-height: 18px;
    }
    .copy {
      padding: 10px 0;
      background: #f0c473;
      border-radius: 5px;
      width: 100%;
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #000;
      line-height: 20px;
    }
  }

  .transfer_title {
    padding: 15px 0 20px;
    /deep/ div {
      color: #fff;
      margin-bottom: 4px;
      font-size: 14px;
    }
  }
}
</style>
