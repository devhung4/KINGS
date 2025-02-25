<template>
  <view class="cont">
    <image class="hed_bg" src="../../static/image/card_hed.png" />
    <div class="lab4">
      <div class="itm">
        <div class="check">1</div>
        <span class="check_color">信息登记</span>
      </div>
      <image class="step" src="../../static/image/step.png" />
      <div class="itm">
        <div>2</div>
        <span>证件上传</span>
      </div>
      <image class="step" src="../../static/image/step.png" />
      <div class="itm">
        <div>3</div>
        <span>照片上传</span>
      </div>
    </div>

    <div class="bld_box">
      <div class="lab">
        <image class="step" src="../../static/image/info_1.png" />
        <div>证件类型(当前仅支持护照办理)</div>
      </div>

      <picker mode="selector" :range="list" @change="onChange">
        <div class="select">
          <view class="picker"> {{ selectedValue }} </view>
          <image class="step" src="../../static/image/down.png" />
        </div>
      </picker>

      <div class="lab">
        <image class="step" src="../../static/image/info_2.png" />
        <div>国家/地区</div>
      </div>

      <picker mode="selector" :range="country" @change="onChange2">
        <div class="select">
          <view class="picker"> {{ countryName }} </view>
          <image class="step" src="../../static/image/down.png" />
        </div>
      </picker>

      <div class="lab">
        <image class="step" src="../../static/image/info_3.png" />
        <div>护照号</div>
      </div>
      <div class="input">
        <input type="text" v-model="idCard" placeholder="请输入护照号" />
      </div>

      <div class="lab">
        <image class="step" src="../../static/image/info_4.png" />
        <div>姓名</div>
      </div>
      <div class="input">
        <input
          type="text"
          @input="onKeyVinInput"
          v-model="realName"
          placeholder="仅限英文字符"
        />
      </div>

      <!-- <div class="slicing">
        <div class="sli_itm">
          <div class="lab">
            <image class="step" src="../../static/image/info_4.png" />
            <div>名字</div>
          </div>
          <div class="input">
            <input type="text" placeholder="请输入名字" />
          </div>
        </div>
        <div class="sli_itm">
          <div class="lab">
            <image class="step" src="../../static/image/info_5.png" />
            <div>姓氏</div>
          </div>
          <div class="input">
            <input type="text" placeholder="请输入姓氏" />
          </div>
        </div>
      </div> -->

      <!-- <div class="lab">
        <image class="step" src="../../static/image/info_6.png" />
        <div>出生日期</div>
      </div>
      <div class="input">
        <input type="text" placeholder="请输入证件号" />
        <image src="../../static/image/info_6.png" />
      </div> -->
    </div>

    <div class="next">
      <div @click="goNext()">下一步</div>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      idCard: "",
      check: 1,
      list: ["护照"],
      selectedValue: "护照",
      country: [],
      countryName: "美国",
      realName: "",
    };
  },
  computed: {},
  onLoad() {
    this.getCountry();
  },
  methods: {
    onKeyVinInput(e) {
      const o = e.target;
      // 数字和字母
      const inputRule = /[^a-zA-Z ]/g; //修改inputRule 的值
      this.$nextTick(function () {
        this.realName = o.value.replace(inputRule, "");
      });
    },
    goNext() {
      if (!this.realName) {
        uni.showToast({
          icon: "none",
          title: "请输入姓名",
        });
        return;
      }
      if (!this.idCard) {
        uni.showToast({
          icon: "none",
          title: "请输入护照号",
        });
        return;
      }
      let data = {
        country: this.countryName,
        realName: this.realName,
        idCard: this.idCard,
      };
      const paramJson = JSON.stringify(data);
      uni.setStorageSync("paramJson", paramJson);

      uni.navigateTo({ url: "/pages/user/next1?list=" + encodeURIComponent(paramJson) });
    },
    onChange(e) {
      this.selectedValue = this.list[e.detail.value];
    },
    onChange2(e) {
      this.countryName = this.country[e.detail.value];
    },

    async getCountry() {
      this.country = [];
      let res = await this.$request.post("/uc/support/country");
      if (res.data.code == 0) {
        res.data.data.forEach((item) => {
          this.country.push(item.zhName);
        });
      }
    },
  },
};
</script>

<style lang="scss">
image {
  display: block;
}
.cont {
  padding: 18px 16px 0;
  background: #f8f8f8;
  min-height: 100vh;
  .hed_bg {
    width: 100%;
    position: fixed;
    height: 235px;
    top: 0;
    left: 0;
  }
  .lab4 {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .itm {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        background: #fff;
        font-weight: 400;
        font-size: 18px;
        color: #333333;
        line-height: 24px;
        border-radius: 50%;
      }
      span {
        margin-top: 12px;
        font-weight: 400;
        font-size: 12px;
        color: #333333;
        line-height: 16px;
      }
    }

    .step {
      width: 24px;
      height: 24px;
      display: block;
    }

    .check {
      background: #9c47e3 !important;
      color: #fff !important;
    }
    .check_color {
      color: #9c47e3 !important;
    }
  }

  .bld_box {
    position: relative;
    padding: 20px 16px;
    margin-top: 18px;
    background: #ffffff;
    box-shadow: 0px 1px 3px 0px rgba(240, 240, 242, 0.5);
    border-radius: 12px;
    .lab {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      image {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
      div {
        font-family: MiSans, MiSans;
        font-weight: 400;
        font-size: 12px;
        color: #333333;
        line-height: 16px;
      }
    }

    .select {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f5f5f5;
      border-radius: 8px;
      padding: 12px;
      div {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 19px;
      }
      image {
        width: 16px;
        height: 16px;
      }
    }

    .input {
      margin-bottom: 16px;
      display: flex;
      font-size: 14px;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      align-items: center;
      border: 1px solid rgba(151, 151, 151, 0.5);
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
      image {
        width: 20px;
        height: 20px;
        margin-left: 20px;
      }
    }

    .slicing {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .sli_itm {
        width: 48%;
      }
    }
  }

  .next {
    background: #fff;
    padding: 5px 15px 30px;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    bottom: 0;
    div {
      background: linear-gradient(135deg, #8776f9 0%, #b45ae0 100%);
      border-radius: 12px;
      padding: 12px 0;
      font-weight: 600;
      font-size: 16px;
      color: #ffffff;
      line-height: 22px;
      text-align: center;
    }
  }
}
</style>
