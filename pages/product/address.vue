<template>
  <view class="address">
    <u-navbar
      title="地址信息"
      titleStyle="font-size: 36rpx;font-weight: 600;"
      border
      :autoBack="true"
      placeholder
    />

    <div class="update">
      <div class="add_mess">
        <div class="add_tit">
          <image />
          <div class="tit_rig">
            <div>实体卡</div>
            <div>X 1</div>
            <div>149.00 USD</div>
          </div>
        </div>

        <div class="adr">账单地址</div>
        <textarea placeholder="请输入账单地址"></textarea>

        <div class="adr2">邮寄地址</div>
        <textarea placeholder="请输入信用卡邮寄地址"></textarea>
      </div>
    </div>

    <div class="next">
      <div>立即提交</div>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" scope>
.address {
  background: #f8f8f8;
  min-height: 100vh;
  .update {
    padding: 16px;
    .add_mess {
      padding: 16px 16px 32px;
      background: #ffffff;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      .add_tit {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 17px;
        border-bottom: 1px solid rgba(151, 151, 151, 0.2);
        image {
          width: 140px;
          height: 80px;
          background: red;
          border-radius: 10px;
        }
        .tit_rig {
          flex: 1;
          margin-left: 12px;
          div:nth-child(1) {
            font-weight: 600;
            font-size: 16px;
            color: #333333;
            line-height: 22px;
          }
          div:nth-child(2) {
            margin-top: 8px;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            line-height: 19px;
          }
          div:nth-child(3) {
            text-align: right;
            margin-top: 12px;
            font-weight: 600;
            font-size: 14px;
            color: #9c47e3;
            line-height: 19px;
          }
        }
      }
      .adr,
      .adr2 {
        margin-top: 16px;
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        line-height: 19px;
      }
      .adr2 {
        margin-top: 24px;
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
    }
  }

  .next {
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    background: #fff;
    padding: 5px 15px 20px;
    div {
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
</style>
