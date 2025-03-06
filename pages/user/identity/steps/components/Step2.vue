<template>
  <view>
    <view class="step2">
      <view class="image-uploader">
        <view class="image-uploader__header">
          <text class="image-uploader__header-title">請上傳您的護照首页</text>
          <text class="image-uploader__header-subtitle">
            *所有的徵件資料將絕對保密，僅用於個人信息驗證
          </text>
        </view>
        <view @tap="handleChooseImage" class="image-uploader__main">
          <view class="image-uploader__main-result">
            <template v-if="tempImage">
              <view class="temp-image">
                <image v-if="imgUrl && uploaded" :src="tempImage" mode="scaleToFill" />
                <view v-show="imgUrl && uploaded" class="re-choose">重新上傳</view>
              </view>
            </template>
            <template v-else>
              <image class="upload-icon" src="../../../../../static/icons/icon-upload.png" />
              <text>上傳護照</text>
            </template>
          </view>
        </view>
        <view class="image-uploader__footer">
          <text class="image-uploader__footer-left">
            請確保照片內容清晰可見
          </text>
          <text class="image-uploader__footer-right"> 查看照片範例 &gt; </text>
        </view>
      </view>
      <view class="next-btn" @tap="goNext">
        <text>下一步</text>
      </view>
    </view>

    <!-- <CustomModal
      ref="imageDemoRef"
      title="照片范例"
      mode="bottom">
      <view class="passport-example">
        <image
          src="./../../../../../static/image/passport.png"
          mode="scaleToFill" />
        <text>·放平護照 ·上下頁完整 ·四邊可見 ·不能反光 ·無遮擋物</text>
      </view>
    </CustomModal> -->
  </view>
</template>

<script>
import CustomModal from '../../../../../components/custom-modal.vue'

export default {
  components: {
    CustomModal,
  },
  name: 'Step2',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tempImage: null,
      uploading: false,
      uploaded: false,
      imgUrl: null,
    }
  },
  watch: {},
  methods: {
    handleChooseImage() {
      if (this.uploading) return
      if (this.tempImage) {
        this.tempImage = null
        this.imgUrl = null
      }
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        // compressed: [],
        sourceType: ['album', 'camera'],
        success: ({ tempFilePaths, tempFiles }) => {
          // 检查图片大小
          // const maxSize = 5 * 1024 * 1024 // 5MB
          // if (tempFiles[0].size > maxSize) {
          //   return uni.showToast({
          //     title: '图片大小不能超过5MB',
          //     icon: 'none',
          //     mask: true,
          //   })
          // }

          // 图片的本地地址，用于回显至屏幕
          this.tempImage = tempFilePaths[0]

          // 正式上传到服务器
          this.uploading = true
          uni.showLoading({
            title: '上传中...',
            mask: true
          })
          uni.uploadFile({
            url: 'https://api.8.top/uc/upload/uploadFile',
            // fileType: 'image',
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              "x-auth-token": uni.getStorageSync("token"),
            },
            success: ({ data, statusCode }) => {
              const { data: imgUrl, code, message } = JSON.parse(data)
              if (code === 0) {
                uni.hideLoading()
                this.uploaded = true
                this.uploading = false
                this.imgUrl = imgUrl
              } else {
                this.uploading = false
                // this.uploaded = false
                this.tempImage = null
                uni.hideLoading()
                uni.showToast({
                  title: message,
                  icon: 'none',
                  mask: true
                })
              }
              console.log(data, statusCode)
            },
            fail: (error) => {
              this.uploading = false
              this.tempImage = null
              uni.hideLoading()
              uni.showToast({
                title: '上传失败',
                icon: 'none',
                mask: true
              })
            }
          })
        },
        fail: (error) => {
          this.uploading = false
          // 用户主动取消不提示错误
          if (error.errMsg.includes('cancel')) return
          // 其他错误才显示提示
          return uni.showToast({
            title: '選擇圖片失敗',
            icon: 'none',
            mask: true,
          })
        },
      })
    },

    goNext() {
      if (!this.imgUrl) {
        return uni.showToast({
          title: '請上傳護照',
          icon: 'none',
          mask: true,
        })
      } else {
        this.$emit('update:step', 2, { idCardFront: this.imgUrl, idCardBack: this.imgUrl })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.step2 {
  margin-top: 24px;

  .image-uploader {
    display: flex;
    flex-direction: column;
    padding: 12px 16px 18px 16px;
    border-radius: 18px;
    width: 100%;
    background: rgba(31, 32, 41, 0.6);

    &__header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;

      &-title {
        font-size: 16px;
        color: #fff;
      }

      &-subtitle {
        font-size: 13px;
        color: hsla(240, 33%, 94%, 0.6);
      }
    }

    &__main {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 200px;
      border-radius: 4px;
      margin: 16px 0 12px 0;
      border: 1px dashed hsla(0, 0%, 59%, 0.6);

      &-result {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 12px;

        .upload-icon {
          width: 40px;
          height: 40px;
        }

        text {
          text-align: center;
          font-size: 13px;
          color: #f0c473;
        }

        .temp-image {
          position: relative;
          width: 164px;
          height: 196px;

          image {
            width: 100%;
            height: 100%;
            object-fit: fill;
          }

          .re-choose {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 88px;
            height: 24px;
            border-radius: 8px;
            background: hsla(0, 0%, 0%, 0.6);
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            color: hsla(0, 0%, 100%, 1);
          }
        }
      }
    }

    &__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      text {
        font-size: 13px;
      }

      &-left {
        color: hsla(240, 33%, 94%, 0.6);
      }

      &-right {
        color: hsla(240, 33%, 94%, 0.4);
      }
    }
  }

  .next-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 48px;
    border-radius: 14px;
    background: #f0c473;
    margin-top: 40px;

    text {
      font-size: 17px;
      font-weight: 600;
      color: #000;
    }
  }
}

.passport-example {
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;
  width: 100%;
  height: 421px;

  image {
    margin: 0 auto;
    width: 280px;
    height: 421px;
  }

  text {
    font-size: 16px;
    margin-left: calc(50% - 140px);
    margin-top: 12px;
    color: rgba($color: #fff, $alpha: 0.8);
  }
}
</style>
