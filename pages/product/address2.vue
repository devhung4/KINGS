<template>
  <div class="transfer_box">
    <div class="navBox">
      <div class="back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="title">输入地址</div>
      <div class="div"></div>
    </div>
    <div class="bld">
      <div class="address">
        <div class="lab">
          <image class="step" src="../../static/image/ad1.png" />
          <div>收件人姓名</div>
        </div>
        <div class="input">
          <input type="text" v-model="formate.mailName" placeholder="请输入您的姓名" />
        </div>

        <div class="half">
          <div class="half_itm">
            <div class="lab">
              <image class="step" src="../../static/image/info_2.png" />
              <div>国家/地区</div>
            </div>
            <picker mode="selector" :range="country" @change="onChange">
              <div class="select">
                <view class="picker"> {{ formate.mailCountry }} </view>
                <image class="step" src="../../static/image/down.png" />
              </div>
            </picker>
          </div>
          <div class="half_itm">
            <div class="lab">
              <image class="step" src="../../static/image/info_2.png" />
              <div>州/省</div>
            </div>
            <div class="input">
              <input
                type="text"
                v-model="formate.mailProvince"
                placeholder="请输入您的州/省"
              />
            </div>
          </div>
        </div>

        <div class="half">
          <div class="half_itm">
            <div class="lab">
              <image class="step" src="../../static/image/info_2.png" />
              <div>城市</div>
            </div>
            <div class="input">
              <input
                type="text"
                v-model="formate.mailCity"
                placeholder="请输入您的城市"
              />
            </div>
          </div>
          <div class="half_itm">
            <div class="lab">
              <image class="step" src="../../static/image/info_2.png" />
              <div>邮编</div>
            </div>
            <div class="input">
              <input
                type="text"
                v-model="formate.mailCode"
                placeholder="请输入所在城市邮编"
              />
            </div>
          </div>
        </div>

        <div class="lab">
          <image class="step" src="../../static/image/ad2.png" />
          <div>详细收件地址</div>
        </div>
        <div class="textarea">
          <textarea
            cols="30"
            v-model="formate.mailAddress"
            rows="10"
            placeholder="请输入您的详细收件地址"
          ></textarea>
        </div>

        <div class="lab">
          <image class="step" src="../../static/image/ad3.png" />
          <div>手机号码</div>
        </div>
        <div class="input">
          <div class="guobie">{{number}}</div>
          <input
            type="text"
            v-model="formate.mailPhone"
            placeholder="请输入您的手机号码"
          />
        </div>

        <div class="lab">
          <image class="step" src="../../static/image/ad4.png" />
          <div>邮箱</div>
        </div>
        <div class="input">
          <input type="text" v-model="formate.mailEmail" placeholder="请输入您的邮箱" />
        </div>
      </div>
    </div>

    <div class="submit">
      <div @click="submit()">提交地址</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      number:'+86',
      name: "",
      country: [],
      formate: {
        id: "",
        mailName: "",
        mailCountry: "中国",
        mailProvince: "",
        mailCity: "",
        mailCode: "",
        mailAddress: "",
        mailPhone: "",
        mailEmail: "",
      },
      coLIst:[],
    };
  },
  props: [],
  onLoad() {
    this.formate.id = Number(uni.getStorageSync("addressid"));

    this.getCountry();
    
    this.setCard();
  },
  onShow() {

  },
  methods: {
    async setCard() {
      let res = await this.$request.post("/finance/card/findPhysicalCard", {
        data: { id: this.formate.id },
      });
      if (res.data.code == 0) {
        this.formate.mailName = res.data.data.mailName;
        if (res.data.data.mailCountry) {
          this.formate.mailCountry = res.data.data.mailCountry;
        }
        this.formate.mailProvince = res.data.data.mailProvince;
        this.formate.mailCity = res.data.data.mailCity;
        this.formate.mailCode = res.data.data.mailCode;
        this.formate.mailAddress = res.data.data.mailAddress;
        this.formate.mailPhone = res.data.data.mailPhone;
        this.formate.mailEmail = res.data.data.mailEmail;
      }
    },

    async submit() {
      if (
        !this.formate.mailName ||
        !this.formate.mailProvince ||
        !this.formate.mailCity ||
        !this.formate.mailCode ||
        !this.formate.mailAddress ||
        !this.formate.mailPhone ||
        !this.formate.mailEmail
      ) {
        this.$api.msg("请填写所有资料");
        return;
      }
      uni.showLoading({
        title: "loading..",
        mask: true,
      });
      let res = await this.$request.post("/finance/card/fillHarvestAddress", {
        data: this.formate,
      });

      uni.hideLoading();
      if (res.data.code == 0) {
        this.$api.msg("设置成功");
        setTimeout(() => {
          uni.navigateBack({
            delta: 1, // 默认值是1，表示返回的页面层数
          });
        }, 1000);
      } else {
        this.$api.msg(res.data.message);
      }
    },
    async getCountry() {
      this.country = [];
      let res = await this.$request.post("/uc/support/country");
      if (res.data.code == 0) {
        this.coLIst = res.data.data
        res.data.data.forEach((item) => {
          this.country.push(item.zhName);
        });
      }
    },
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },
    onChange(e) {
      this.number= this.coLIst[e.detail.value].areaCode
      this.formate.mailCountry = this.country[e.detail.value];
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
.bld {
  padding: 0 32rpx 150rpx;
  .address {
    padding: 8rpx 32rpx 40rpx;
    box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(0, 0, 0, 0.2);
    border-radius: 24rpx;
    .lab {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      margin-top: 32rpx;
      image {
        width: 32rpx;
        height: 32rpx;
        margin-right: 4px;
      }
      div {
        font-weight: 400;
        font-size: 28rpx;
        color: #ffffff;
        line-height: 32rpx;
      }
    }

    .select {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 2rpx solid rgba(178, 198, 222, 0.4);
      border-radius: 8px;
      padding: 12px;
      .picker {
        font-weight: 400;
        font-size: 14px;
        color: #fff;
        line-height: 19px;
      }
      image {
        width: 16px;
        height: 16px;
      }
    }

    .input {
      display: flex;
      font-size: 14px;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      display: flex;
      border-radius: 27rpx;
      align-items: center;
      border: 2rpx solid rgba(178, 198, 222, 0.4);
      input {
        flex: 1;
        width: 100%;
        font-weight: 400;
        font-size: 14px;
        color: #999999;
        line-height: 19px;
        background: none;
        border: none;
      }
      .guobie{
        color: #fff;
        font-size: 14px;
        margin-right: 20rpx;
        padding-right: 20rpx;
        border-right: 1px solid #fff;
      }
      image {
        width: 20px;
        height: 20px;
        margin-left: 20px;
      }
    }

    .textarea {
      display: flex;
      font-size: 14px;
      align-items: center;
      justify-content: space-between;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      align-items: center;
      border: 2rpx solid rgba(178, 198, 222, 0.4);
      textarea {
        flex: 1;
        width: 100%;
        font-weight: 400;
        font-size: 14px;
        color: #999999;
        line-height: 19px;
        background: none;
        border: none;
      }
      image {
        width: 20px;
        height: 20px;
        margin-left: 20px;
      }
    }

    .half {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .half_itm {
        width: 48%;
      }
    }
  }
}
.submit {
  position: fixed;
  box-sizing: border-box;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 20rpx 32rpx;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background: #f0c473;
    border-radius: 5px;
    font-weight: 600;
    font-size: 16px;
    color: #000;
    line-height: 22px;
  }
}
</style>
