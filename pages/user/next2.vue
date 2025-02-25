<template>
  <view class="cont">
    <div class="lab4">
      <div class="itm">
        <image src="../../static/image/ok.png" />
        <span>信息登记</span>
      </div>
      <image class="step" src="../../static/image/step.png" />
      <div class="itm">
        <image src="../../static/image/ok.png" />
        <span>证件上传</span>
      </div>
      <image class="step" src="../../static/image/step.png" />
      <div class="itm">
        <div class="check">3</div>
        <span class="check_color">照片上传</span>
      </div>
    </div>

    <div class="bold_box">
      <div class="slogan1">请拍摄上传一张自拍</div>
      <div class="slogan2">* 所有证件资料将绝对保密，仅用于个人信</div>
      <div class="slogan3">
        <image @click="selsect()" :src="imgUrl ? imgUrl : upload" />
      </div>
    </div>

    <div class="text">请确保人脸清晰可见</div>

    <div class="next">
      <div @click="submit()">提交审核</div>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: "",
      upload: require("../../static/image/card1.png"),
      paramPageBJSon: {},
    };
  },
  computed: {},
  onLoad() {
    const paramPageB = uni.getStorageSync("paramJson");
    this.paramPageBJSon = JSON.parse(paramPageB);
  },
  methods: {
    async submit() {
      if (!this.imgUrl) {
        uni.showToast({
          icon: "none",
          title: "请先上传自拍照片",
        });
        return;
      }

      uni.showLoading({
        title: "loading",
      });

      this.paramPageBJSon.handHeldIdCard = this.imgUrl;
      this.paramPageBJSon.idCardBack = "1";

      let res = await this.$request.post("/uc/approve/real/name", {
        data: this.paramPageBJSon,
      });
      uni.hideLoading();
      if (res.data.code == 0) {
        uni.showToast({
          icon: "none",
          title: "审核已提交",
        });

        setTimeout(() => {
          uni.switchTab({
            url: "../index/index",
          });
        }, 1000);
      } else {
        uni.showToast({
          icon: "none",
          title: res.data.message,
        });
      }
    },
    selsect() {
      uni.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          uni.showLoading({
            title: this.$t("loading"),
          });
          uni.uploadFile({
            url: "https://api.8.top" + "/uc/upload/uploadFile", // 服务器上传接口
            filePath: res.tempFilePaths[0],
            header: {
              "x-auth-token": uni.getStorageSync("token"),
            },
            name: "file", // 这里根据后端需要的字段来定义
            success: (uploadFileRes) => {
              if (JSON.parse(uploadFileRes.data).code == 0) {
                uni.hideLoading();
                this.imgUrl = JSON.parse(uploadFileRes.data).data;
              } else {
                uni.hideLoading();
                uni.showToast({
                  icon: "none",
                  title: JSON.parse(uploadFileRes.data).message,
                });
              }
            },
            fail: (uploadFileError) => {
              // 处理上传失败的错误
              uni.hideLoading();
              uni.showToast({
                icon: "none",
                title: "上传失败",
              });
            },
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
image {
  display: block;
}
.cont {
  padding: 18px 0 0;
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
    margin: 0 16px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .itm {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      image {
        width: 42px;
        height: 42px;
      }
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

  .text {
    margin: 12px 0 0 16px;
    font-weight: 400;
    font-size: 12px;
    color: #000000;
    line-height: 16px;
  }

  .bold_box {
    margin-top: 20px;
    background: #fff;
    padding: 16px 16px 36px;
    .slogan1 {
      font-weight: 400;
      font-size: 14px;
      color: #000000;
      line-height: 19px;
      margin-bottom: 10px;
    }
    .slogan2 {
      font-weight: 400;
      font-size: 10px;
      color: #f3343c;
      line-height: 13px;
      margin-bottom: 36px;
    }
    .slogan3 {
      display: flex;
      align-items: center;
      justify-content: center;
      image {
        width: 224px;
        height: 146px;
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
