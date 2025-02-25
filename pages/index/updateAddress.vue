<template>
  <div class="transfer_box">
    <div class="navBox">
      <div class="back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="title">新增地址</div>
      <div class="div"></div>
    </div>

    <div class="transfer_center">
      <div class="label">地址</div>
      <div class="input_box">
        <input type="text" v-model="form.address" placeholder="输入或者长按粘贴地址" />
      </div>
      <div class="label">备注</div>
      <div class="input_box">
        <input type="text" v-model="form.remark" placeholder="请输入备注" />
      </div>

      <div class="submit" @click="submit()">确认</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      isMobile: false,
      updateState: false,
      label: "发送验证码",
      setStatte: true,
      email: "",
      show: false,
      form: {
        unit: "",
        realUnit: "",
        address: "",
        remark: "",
        aims: "",
        code: "",
      },
    };
  },
  props: [],
  created() {
    this.form.unit =  uni.getStorageSync("extractunit");
    this.form.realUnit = uni.getStorageSync("extractrealUnit");
  },
  mounted() {
    this.setting();
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },
    submit() {
      if (!this.form.address) {
        this.$api.msg("请输入地址");
        return;
      }
      if (!this.form.remark) {
        this.$api.msg("请输入备注");

        return;
      }
      // this.show = true;
      this.updateAddress();
    },

    // 获取邮箱
    async setting() {
      let res2 = await this.$request.post("/uc/approve/security/setting", {
        data: this.form,
      });
      let res = res2.data;
      if (res.code == 0) {
        this.form.aims = res.data.email;
        this.email = res.data.email.replace(/([\w]{3})[\w\W]+([\w]{3})$/, "$1*******$2");
      }
    },
    success(params) {
      this.setStatte = false;
      let sendtime = null;
      const data = {
        codeType: 14,
        type: 1,
        captchaVerification: params.captchaVerification,
      };
      ucsendCode(data).then((res) => {
        if (res.code == 0) {
          let num = 60;
          sendtime = setInterval(() => {
            if (num > 0) {
              num--;
              this.label = num + "s";
            } else {
              clearInterval(sendtime);
              this.setStatte = true;
              this.label = "获取验证码";
            }
          }, 1000);
        } else {
          this.setStatte = true;
          this.$api.msg(res.message);
        }
      });
    },
    async updateAddress() {
      // if (!this.form.code) {
      //   this.$api.msg("请输入验证码");
      //   return;
      // }
      if (this.updateState) {
        return;
      }

      uni.showLoading({
        title: "Loading",
      });
      this.updateState = true;

      let res = await this.$request.post("/uc/withdraw/address/add", {
        data: this.form,
      });
      uni.hideLoading();
      this.updateState = false;
      if (res.data.code == 0) {
        this.$api.msg(res.data.message);
        setTimeout(() => {
          uni.navigateBack({
            delta: 1, // 默认值是1，表示返回的页面层数
          });
        }, 1000);
      } else {
        this.$api.msg(res.data.message);
      }
    },
  },
};
</script>

<style scoped lang="scss">
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
  position: fixed;
  width: 100%;
  bottom: 20px;
  left: 0;
  div {
    margin: 0 20px;
    background: linear-gradient(135deg, #8776f9 0%, #b45ae0 100%);
    color: #fff;
    padding: 10px 0;
    border-radius: 5px;
    text-align: center;
  }
}

.transfer_box {
  box-sizing: border-box;
  padding-top: 30px;
  min-height: 100vh;
  background: #000;
  position: relative;
  .transfer_center {
    padding: 20px 10px;
    .label {
      font-size: 16px;
      margin-bottom: 10px;
      color: #fff;
    }
    .input_box {
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid rgba(151, 151, 151, 1);
    }
    input {
      border: none;
      background: none;
      font-size: 16px;
      color: #fff;
      width: 100%;
      box-sizing: border-box;
    }
  }

  .submit {
    margin: 30px 20px 20px;
    background: #f0c473;
    color: #000;
    padding: 10px 0;
    border-radius: 5px;
    text-align: center;
  }
}

.poups_verify {
  .top {
    padding: 15px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(102, 102, 102, 0.2);
    div:nth-child(1) {
      width: 20px;
    }
    div:nth-child(2) {
      font-size: 16px;
      font-weight: bold;
    }
    div:nth-child(3) {
      color: #999;
    }
  }
  .bold {
    padding: 0 15px;
    .bd_item {
      padding: 15px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 18px;
      border-bottom: 1px solid rgba(102, 102, 102, 0.2);
      input {
        flex: 1;
        border: none;
        background: none;
        margin: 0;
      }
      div {
        color: #e7a011;
      }
    }
  }
}
.mobilStyle {
  width: 30rem !important;
  left: auto;
}
</style>
