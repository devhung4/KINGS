<template>
  <view class="information">
    <u-navbar
      title="个人信息"
      titleStyle="font-size: 36rpx;font-weight: 600;"
      border
      :autoBack="true"
      placeholder
    />
    <image src="../../static/image/card_hed.png" class="card_hed" />
    <view class="personal">
      <view class="from_message">
        <view class="infor_lab">
          <image src="../../static/image/icon1.png" />
          <view>国家/地区</view>
        </view>
        <view class="infor_itm1" @click="langShow = true">
          <view>{{ form.country }}</view>
          <image src="../../static/image/down3.png" />
        </view>

        <view class="infor_box">
          <view class="infor_lab">
            <image src="../../static/image/icon2.png" />
            <view>名字</view>
          </view>
          <view class="infor_lab">
            <image src="../../static/image/icon2.png" />
            <view>姓氏</view>
          </view>
        </view>
        <view class="infor_box">
          <view class="infor_itm2">
            <input type="text" placeholder="请输入名字" v-model="form.firstName" />
          </view>
          <view class="infor_itm2">
            <input type="text" placeholder="请输入姓氏" v-model="form.lastName" />
          </view>
        </view>

        <view class="infor_lab">
          <image src="../../static/image/icon4.png" />
          <view>证件类型</view>
        </view>
        <view class="infor_itm1" @click="cardState = true">
          <view>{{ cardNmae }}</view>
          <image src="../../static/image/down3.png" />
        </view>

        <view class="infor_lab">
          <image src="../../static/image/icon5.png" />
          <view>证件号</view>
        </view>
        <view class="infor_itm2">
          <input type="text" placeholder="请输入证件号" v-model="form.idCard" />
        </view>

        <view class="adr">账单地址</view>
        <textarea placeholder="请输入账单地址" v-model="form.address"></textarea>
      </view>
    </view>

    <view class="next">
      <view @click="next()">下一步</view>
    </view>

    <!-- 国家选择器 -->
    <u-picker
      :show="langShow"
      :columns="langArr"
      keyName="label"
      confirmColor="#FF5B13"
      confirmText="确认"
      cancelText="取消"
      @cancel="langShow = false"
      @confirm="confirmLang"
    >
    </u-picker>

    <!-- 身份证选择器 -->
    <u-picker
      :show="cardState"
      :columns="cardList"
      keyName="label"
      confirmColor="#FF5B13"
      confirmText="确认"
      cancelText="取消"
      @cancel="cardState = false"
      @confirm="confirmCard"
    >
    </u-picker>

    <!-- <u-datetime-picker
      :show="dateRange"
      @confirm="checkTime"
      @cancel="dateRange = false"
      v-model="value1"
      :minDate="startDate"
      :maxDate="endFate"
      mode="datetime"
    ></u-datetime-picker> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      cardState: false,
      cardNmae: "",
      cardList: [
        [
          {
            key: "0",
            label: "身份证",
          },
          {
            key: "1",
            label: "护照",
          },
        ],
      ],
      langShow: false,
      form: {
        address: "",
        country: "",
        areaCode: "",
        firstName: "",
        lastName: "",
        idCard: "",
        type: "",
      },
      langArr: [
        [
          {
            key: "86",
            label: "中国",
          },
          {
            key: "886",
            label: "中国台湾",
          },
          {
            key: "65",
            label: "新加坡",
          },
          {
            key: "1",
            label: "美国",
          },
          {
            key: "852",
            label: "香港",
          },
        ],
      ],
    };
  },
  methods: {
    confirmCard(item) {
      this.cardNmae = item.value[0].label;
      this.form.type = item.value[0].key;
      this.cardState = false;
    },
    confirmLang(item) {
      this.form.country = item.value[0].label;
      this.form.areaCode = item.value[0].key;
      this.langShow = false;
    },
    next() {
      for (let key in this.form) {
        if (!this.form[key]) {
          this.$api.msg("请填写完整的个人信息");
          return;
        }
      }
      let data = JSON.stringify(this.form);
      uni.navigateTo({
        url: "/pages/product/identity?data=" + data,
      });
    },
  },
};
</script>

<style lang="less" scope>
.information {
  background: #f8f8f8;
  min-height: 100vh;
  .personal {
    padding: 24px 16px;
    position: relative;
    z-index: 2;
    .from_message {
      margin-top: -200px;
      background: #ffffff;
      box-shadow: 0px 1px 3px 0px rgba(240, 240, 242, 0.5);
      border-radius: 12px;
      padding: 4px 16px 20px;
      .infor_box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .infor_lab,
        .infor_itm2 {
          width: 48%;
        }
      }
      .infor_lab {
        margin-top: 16px;
        display: flex;
        align-items: center;
        image {
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }
        view {
          font-weight: 400;
          font-size: 12px;
          color: #333333;
          line-height: 16px;
        }
      }
      .infor_itm1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        background: #f5f5f5;
        border-radius: 8px;
        margin-top: 10px;
        view {
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
      .infor_itm2 {
        box-sizing: border-box;
        margin-top: 10px;
        padding: 12px;
        background: rgba(245, 245, 245, 0);
        border-radius: 8px;
        border: 1px solid rgba(151, 151, 151, 0.5);
        input {
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          line-height: 19px;
        }
      }
      .infor_itm3 {
        box-sizing: border-box;
        margin-top: 10px;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid rgba(151, 151, 151, 0.5);
        display: flex;
        align-items: center;
        justify-content: space-between;
        view {
          font-weight: 400;
          font-size: 14px;
          color: #333;
          line-height: 19px;
        }
        image {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .card_hed {
    width: 100%;
    height: 235px;
  }

  .next {
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    position: fixed;
    bottom: 30px;
    view {
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
  }
}

.adr {
  margin-top: 16px;
  font-weight: 400;
  font-size: 14px;
  color: #000000;
  line-height: 19px;
}

textarea {
  height: 97px;
  padding: 10px 16px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 10px;
  border-radius: 12px;
  border: 1px solid rgba(151, 151, 151, 0.5);
  font-weight: 400;
  font-size: 12px;
  color: #999999;
  line-height: 16px;
}
/deep/ .u-border-bottom {
  border-color: rgb(255, 255, 255) !important;
}
</style>
