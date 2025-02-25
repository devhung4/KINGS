<template>
  <view class="identity">
    <u-navbar
      title="提交资料"
      titleStyle="font-size: 36rpx;font-weight: 600;"
      border
      :autoBack="true"
      placeholder
    />

    <view class="update">
      <view class="up_lab">
        <view class="lab">1、上传身份证正面信息页</view>
        <view class="img">
          <view>查看示例</view>
          <image src="../../static/image/go3.png" />
        </view>
      </view>
      <image
        :src="form.identityCardImgFront || '../../static/image/update1.png'"
        class="update_img"
        @click="uploadImg(1)"
      />

      <view class="up_lab">
        <view class="lab">2、上传身份证背面</view>
        <view class="img">
          <view>查看示例</view>
          <image src="../../static/image/go3.png" />
        </view>
      </view>
      <image
        :src="form.identityCardImgReverse || '../../static/image/update2.png'"
        class="update_img"
        @click="uploadImg(2)"
      />

      <view class="up_lab">
        <view class="lab">3、个人照片（请注意着装）</view>
        <view class="img">
          <view>查看示例</view>
          <image src="../../static/image/go3.png" />
        </view>
      </view>
      <image
        :src="form.identityCardImgInHand || '../../static/image/update3.png'"
        class="update_img"
        @click="uploadImg(3)"
      />
    </view>

    <view class="next">
      <view @click="next()">立即提交</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      abloadState: false,
      form: {},
    };
  },
  onLoad(options) {
    this.form = JSON.parse(options.data);
  },
  methods: {
    async next() {
      // if (
      //   !this.form.identityCardImgFront ||
      //   !this.form.identityCardImgReverse ||
      //   !this.form.identityCardImgInHand
      // ) {
      //   this.$api.msg("请先上传图片");
      //   return;
      // }
      let res = await this.$request.post("/uc/otc365/activeCardSubmit", {
        data: this.form,
      });
      if (res.data.code == 0) {
        uni.switchTab({
          url: "../product/index",
        });
      } else {
        this.$api.msg(res.data.message);
      }
    },
    uploadImg(id) {
      if (this.abloadState) {
        return;
      }
      this.abloadState = true;
      uni.chooseImage({
        count: 1,
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          console.log(res);
          uni.showLoading({
            title: "上传中",
          });

          uni.uploadFile({
            url: "/gateway/news/upload/oss/image", //仅为示例，非真实的接口地址
            filePath: tempFilePath,
            name: "file",
            header: {
              Token: uni.getStorageSync("token"),
            },
            formData: {
              zipType: "2",
            },
            success: (uploadFileRes) => {
              let params = JSON.parse(uploadFileRes.data);
              if (id === 1) {
                this.$set(this.form, "identityCardImgFront", params.data);
              } else if (id === 2) {
                this.$set(this.form, "identityCardImgReverse", params.data);
              } else {
                this.$set(this.form, "identityCardImgInHand", params.data);
              }
              uni.hideLoading();
              this.abloadState = false;
            },
            fail: () => {
              this.$api.msg("上传失败");
              uni.hideLoading();
              this.abloadState = false;
            },
          });
        },
        fail: () => {
          this.abloadState = false;
        },
      });
    },
  },
};
</script>

<style lang="less" scope>
.identity {
  background: #f8f8f8;
  min-height: 100vh;
  .update {
    margin-top: 20px;
    background: #fff;
    padding: 1px 16px 20px;
    .up_lab {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 24px;
      .lab {
        font-weight: 400;
        font-size: 12px;
        color: #000000;
        line-height: 17px;
      }
      .image {
        display: flex;
        align-items: center;
        view {
          font-weight: 400;
          font-size: 12px;
          color: #9c47e3;
          line-height: 16px;
        }
        image {
          margin-left: 2px;
          width: 14px;
          height: 14px;
        }
      }
    }
    .update_image {
      width: 173px;
      margin-top: 12px;
      height: 112px;
    }
  }

  .next {
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    background: #fff;
    padding: 5px 15px 20px;
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
</style>
