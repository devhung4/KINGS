<template>
  <div class="transfer_box">
    <div class="navBox">
      <div class="back">
        <image
          src="../../static/image/go_back2.png"
          alt=""
          @click="goBack()" />
      </div>
      <div class="title">{{ $t('index.extract.pageTitle') }}</div>
      <div class="div"></div>
      <!-- <span>提币记录</span> -->
    </div>

    <div class="transfer_center">
      <div class="coin_box">
        <div
          class="coin"
          @click="coinShow = true">
          <span>{{ coin }}</span>
          <image
            src="../../static/image/center2.png"
            alt="" />
        </div>

        <div
          v-if="coin == 'USDT'"
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
          <div
            @click="checkcoin(index)"
            v-for="(item, index) in usdtList"
            :class="[index == coincheck ? 'check' : '', 'network']"
            :key="index">
            {{ item.name }}
          </div>
        </div>
        <div
          v-else
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
          <div
            @click="checkother(index)"
            v-for="(item, index) in otherList"
            :class="[index == othercheck ? 'check' : '', 'network']"
            :key="index">
            {{
              item.coin.chainType == 2
                ? 'ERC20'
                : item.coin.chainType == 3
                ? 'TRC20'
                : 'BEP20'
            }}
          </div>
        </div>
      </div>

      <div class="address">
        <div class="add_tit">{{ $t('index.extract.inputs.coinAddress') }}</div>
        <div
          class="add_item"
          @click="selectAddress()">
          <div class="left">
            <span>{{ address }}</span>
            <image
              src="../../static/image/drop.png"
              alt="" />
          </div>
          <div
            class="right"
            @click="setAddress()">
            <image src="../../static/image/check_address.png" />
          </div>
        </div>

        <div class="add_tit">{{ $t('index.extract.inputs.number') }}</div>
        <div class="add_item">
          <input
            type="text"
            class="left"
            :placeholder="$t('index.extract.inputs.minCoinsNumber', { number })"
            v-model="amount" />
          <div class="right">
            <div>{{ coin }}</div>
            <span @click="amount = price">{{
              $t('index.extract.inputs.all')
            }}</span>
          </div>
        </div>
        <div class="commission">
          <span>{{
            $t('index.extract.inputs.available', { price, coin })
          }}</span>
          <span>{{
            $t('index.extract.inputs.handlingFee', { minTxFee, coin })
          }}</span>
        </div>
      </div>

      <div class="address">
        <div class="add_tit">{{ $t('index.extract.inputs.password') }}</div>
        <div class="add_item">
          <input
            :type="passwordState ? 'text' : 'password'"
            class="left"
            :placeholder="$t('index.extract.inputs.password')"
            v-model="jyPassword" />
          <div class="right">
            <image
              :src="passwordState ? closeimage : openimage"
              alt=""
              @click="passwordState = !passwordState" />
          </div>
        </div>
      </div>

      <div class="address">
        <div class="add_tit">{{ $t('index.extract.inputs.code') }}</div>
        <div class="add_item">
          <input
            type="text"
            v-model="code"
            class="left"
            :placeholder="$t('index.extract.inputs.inputCode')" />
          <div class="right">
            <span @click="setCode()">{{ label }}</span>
          </div>
        </div>
      </div>

      <div class="sub_button">
        <div
          @click="withdrawal()"
          v-if="submitState">
          {{ $t('index.extract.buttons.extract') }}
        </div>
        <div v-else>{{ $t('index.extract.buttons.extract') }}</div>
      </div>
    </div>

    <u-picker
      :show="coinShow"
      :columns="coinActions"
      keyName="label"
      confirmColor="#FF5B13"
      confirmText="确认"
      cancelText="取消"
      @cancel="coinShow = false"
      @confirm="coinSelect">
    </u-picker>

    <u-picker
      :show="addressShow"
      :columns="addresstions"
      keyName="label"
      confirmColor="#FF5B13"
      confirmText="确认"
      cancelText="取消"
      @cancel="addressShow = false"
      @confirm="addressSelect">
    </u-picker>
  </div>
</template>

<script>
// import {
//   infowallet,
//   addressPage,
//   setting,
//   ucsendCode,
//   applyaddress,
//   getWithdrawFee,
// } from "@/service/config";
export default {
  components: {},
  data() {
    return {
      submitState: true,
      setStatte: false,
      label: this.$t('index.extract.inputs.sendCode'),
      number: 0,
      code: '',
      jyPassword: '',
      amount: '',
      price: 0,
      minTxFee: 0,
      passwordState: false,
      openimage: require('../../static/image/icon_6.png'),
      closeimage: require('../../static/image/icon_7.png'),
      otherList: [],
      coinList: [],
      coinShow: false,
      coin: '',
      coinActions: [[]],
      coincheck: 0,
      usdtList: [{ name: 'ERC20' }, { name: 'TRC20' }, { name: 'BEP20' }],
      othercheck: 0,
      address: '',
      addressShow: false,
      addresstions: [[]],
      form: {
        unit: '',
        realUnit: '',
        pageNo: 0,
        pageSize: 20,
      },
      fundsVerified: 0,
    }
  },
  props: [],
  onLoad(options) {
    if (uni.getStorageSync('extractaddress')) {
      this.address = uni.getStorageSync('extractaddress')
      this.coincheck = uni.getStorageSync('extractindex')
    }
  },
  onshow() {},
  mounted() {
    this.infowallet()
    this.setting()
    this.setprice()
  },
  methods: {
    async setprice() {
      let res = await this.$request.post('/uc/wallet/walletTotalData', {
        data: { accountType: 7, coinId: 'USDT' },
      })
      console.log(res)
      if (res.data.code == 0) {
        this.price = res.data.data.walletList[0].balance
      }
    },
    async getWithdrawFee() {
      let uType = ''
      if (this.coin == 'USDT') {
        if (this.usdtList[this.coincheck].name == 'ERC20') {
          uType = 0
        } else if (this.usdtList[this.coincheck].name == 'TRC20') {
          uType = 2
        } else {
          uType = 3
        }
      } else {
        if (this.otherList[this.othercheck].name == 'ERC20') {
          uType = 0
        } else if (this.otherList[this.othercheck].name == 'TRC20') {
          uType = 2
        } else {
          uType = 3
        }
      }

      let res2 = await this.$request.post('/uc/withdraw/getWithdrawFee', {
        data: { unit: this.coin, uType: uType },
      })
      let res = res2.data
      if (res.code == 0) {
        if (res.data.feeLogicType == 0) {
          this.minTxFee = res.data.fixFee
        } else {
          this.minTxFee = res.data.feeRate
        }
      }
    },
    async infowallet() {
      let res2 = await this.$request.post('/uc/asset/wallet')
      let arr = []
      let res = res2.data
      if (res.code == 0) {
        this.coinActions = [[]]

        res.data.forEach((item, index) => {
          if (item.coin.canWithdraw == 1) {
            arr.push({
              name: item.coin.name,
              price: item.balance,
              minTxFee: item.coin.minTxFee,
              number: item.coin.minWithdrawAmount,
            })
          }
          this.coinList.push(item)
          this.coinActions[0].push({
            name: item.coin.name,
            price: item.balance,
            minTxFee: item.coin.minTxFee,
            number: item.coin.minWithdrawAmount,
            label: item.coin.name,
          })
        })
        console.log(this.coinActions[0])
        this.coin = arr[0].name
        // this.price = arr[0].price;
        this.number = arr[0].number

        let uType = ''
        if (this.usdtList[this.coincheck].name == 'ERC20') {
          uType = 0
        } else if (this.usdtList[this.coincheck].name == 'TRC20') {
          uType = 2
        } else {
          uType = 3
        }
        this.getWithdrawFee()
      }
    },
    async setting() {
      let res = await this.$request.post('/uc/approve/security/setting')
      if (res.data.code == 0) {
        this.fundsVerified = res.data.data.fundsVerified
      }
    },
    async addressPage() {
      let res2 = await this.$request.post('/uc/withdraw/address/page', {
        data: this.form,
      })
      let res = res2.data
      let arr = []
      if (res.code == 0) {
        this.addresstions = [[]]
        res.data.content.forEach((item, index) => {
          this.addresstions[0].push({ name: item.address, label: item.address })
        })
      }
    },
    coinSelect(action) {
      this.coinShow = false
      if (action.value[0].name == this.coin) {
        return
      }
      this.otherList = []
      this.coin = action.value[0].name
      // this.price = action.value[0].price;
      this.number = action.value[0].number
      this.address = ''
      if (action.value[0].name != 'USDT') {
        this.coinList.forEach((item, index) => {
          if (action.value[0].name == item.coin.name) {
            this.otherList.push(item)
          }
        })
      }
      this.getWithdrawFee()
    },
    selectAddress() {
      this.form.unit = this.coin
      let realUnit = ''
      if (this.coin == 'USDT') {
        realUnit = this.coin + '_' + this.usdtList[this.coincheck].name
      } else {
        this.otherList[this.othercheck].coin.chainType == 2
          ? (realUnit = this.coin + '_' + 'ERC20')
          : this.otherList[this.othercheck].coin.chainType == 3
          ? (realUnit = this.coin + '_' + 'TRC20')
          : (realUnit = this.coin + '_' + 'BEP20')
      }
      this.form.realUnit = realUnit
      this.addressPage()
      this.addressShow = true
    },
    addressSelect(action) {
      this.address = action.value[0].name
      this.addressShow = false
    },
    checkcoin(index) {
      this.address = ''

      if (this.coincheck == index) {
        return
      } else {
        this.coincheck = index
      }

      this.getWithdrawFee(this.coin)
    },
    checkother(index) {
      if (this.othercheck == index) {
        return
      } else {
        this.othercheck = index
        this.getWithdrawFee()
      }
    },

    async setCode(params) {
      if (this.setStatte) {
        return
      }
      this.setStatte = true
      uni.showLoading({
        title: 'Loading',
      })
      let sendtime = null
      const data = {
        codeType: 15,
        type: 1,
        // captchaVerification: params.captchaVerification,
      }
      let res2 = await this.$request.post('/uc/captchaAuth/sendCode', {
        data: data,
      })
      let res = res2.data
      if (res.code == 0) {
        this.$api.msg('发送成功')
        uni.hideLoading()
        let num = 60
        sendtime = setInterval(() => {
          if (num > 0) {
            num--
            this.label = num + 's'
          } else {
            clearInterval(sendtime)
            this.setStatte = false
            this.label = '获取验证码'
          }
        }, 1000)
      } else {
        this.setStatte = false
        uni.hideLoading()

        this.$api.msg(res.data.message)
      }
    },
    setAddress() {
      let realUnit = ''
      if (this.coin == 'USDT') {
        realUnit = this.coin + '_' + this.usdtList[this.coincheck].name
      } else {
        this.otherList[this.othercheck].coin.chainType == 2
          ? (realUnit = this.coin + '_' + 'ERC20')
          : this.otherList[this.othercheck].coin.chainType == 3
          ? (realUnit = this.coin + '_' + 'TRC20')
          : (realUnit = this.coin + '_' + 'BEP20')
      }

      uni.setStorageSync('extractcoin', this.coin)
      uni.setStorageSync('extractrealUnit', this.realUnit)
      uni.setStorageSync('extractcoincheck', this.coincheck)

      uni.navigateTo({
        url:
          '/pages/index/addressList?coin=' +
          this.coin +
          '&realUnit=' +
          realUnit +
          '&index=' +
          this.coincheck,
      })
    },
    // 提币
    async withdrawal() {
      if (!this.address) {
        this.$api.msg('请从地址薄选择地址')

        return
      }
      if (!this.amount) {
        this.$api.msg('请输入提币数量')

        return
      }
      if (this.amount < this.number) {
        this.$api.msg('小于最低提币数量')

        return
      }
      // if (!this.fundsVerified) {
      //   Dialog.confirm({
      //     title: "提示",
      //     message: "您还没有设置资金密码,是否去设置?",
      //   })
      //     .then(() => {
      //       this.$router.push("/setfund");
      //     })
      //     .catch(() => {});
      //   return;
      // }

      if (!this.code) {
        this.$api.msg('请输入验证码')

        return
      }

      this.submitState = false
      let data = {
        unit: this.coin,
        uType: '',
        address: this.address,
        amount: this.amount,
        jyPassword: this.jyPassword,
        code: this.code,
        longitude: '0',
        latitude: '0',
        ip: '0',
        sign: '0',
      }
      let realUnit = ''
      if (this.coin == 'USDT') {
        this.usdtList[this.coincheck].name == 'ERC20'
          ? (realUnit = 0)
          : this.usdtList[this.coincheck].name == 'TRC20'
          ? (realUnit = 2)
          : (realUnit = 3)
      } else {
        this.otherList[this.othercheck].coin.chainType == 2
          ? (realUnit = 0)
          : this.otherList[this.othercheck].coin.chainType == 3
          ? (realUnit = 2)
          : (realUnit = 3)
      }
      data.uType = realUnit

      let res2 = await this.$request.post('/uc/withdraw/apply', {
        data: data,
      })
      let res = res2.data
      if (res.code == 0) {
        this.submitState = true
        this.$api.msg(res.message)
      } else {
        this.submitState = true
        this.$api.msg(res.message)
      }
    },
    goBack() {
      uni.switchTab({
        url: '../index/index',
      })
    },
  },
}
</script>

<style scoped lang="scss">
.transfer_box {
  min-height: 100vh;
  background: #000;
  box-sizing: border-box;
  padding-top: 30px;
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
.sub_button {
  // position: fixed;
  width: 100%;
  margin-top: 20px;
  // bottom: 20px;
  // left: 0;
  div {
    background: #f0c473;
    color: #000;
    padding: 10px 0;
    border-radius: 5px;
    text-align: center;
  }
}

.transfer_box {
  position: relative;
  .transfer_center {
    padding: 0 15px 16px;
    overflow-y: scroll;
    .coin_box {
      padding: 15px;
      // background: #fff;
      border-radius: 10px;
      .coin {
        margin-bottom: 20px;
        display: flex;
        padding: 12px 10px;
        border: 1px solid rgba(178, 198, 222, 0.4);
        align-items: center;
        justify-content: space-between;
        border-radius: 5px;
        span {
          font-size: 14px;
          color: #fff;
        }
        image {
          display: block;
          width: 14px;
          height: 14px;
        }
      }

      .network {
        padding: 10px 25px;
        border-radius: 10px;
        border-radius: 5px;
        font-size: 14px;
        font-weight: 500;
        line-height: 16px;

        border: 1px solid #f0c473;
        background: none;
        color: #f0c473;
      }
      .check {
        color: #000;
        background: #f0c473;
      }
    }

    .address {
      padding: 15px;
      background: rgba(31, 32, 41, 0.6);
      border-radius: 10px;
      margin-top: 20px;
      .add_tit {
        color: #fff;
        font-size: 12px;
        margin-bottom: 10px;
      }
      .add_item {
        display: flex;
        padding: 12px 10px;
        border: 1px solid rgba(178, 198, 222, 0.4);
        align-items: center;
        justify-content: space-between;
        border-radius: 5px;
        margin-bottom: 10px;
        .left {
          flex: 1;
          color: #fff;
          border: none;
          background: none;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          word-break: break-all;

          image {
            width: 14px;
            height: 14px;
            display: block;
          }
        }
        .right {
          margin-left: 10px;
          display: flex;
          align-items: center;
          image {
            height: 24px;
            width: 24px;
            display: block;
          }
          div {
            font-size: 14px;
            color: #fff;
            margin-right: 10px;
            padding-right: 10px;
            border-right: 1px solid rgba(151, 151, 151, 0.5);
          }
          span {
            display: block;
            font-size: 14px;
            color: #e7a011;
            font-weight: 500;
          }
        }
      }
      .commission {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #fff;
      }
    }
  }
}
.mobilStyle {
  width: 30rem !important;
  left: auto;
}
</style>
