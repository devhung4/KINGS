<template>
  <view class="image-uploader">
    <view class="image-uploader__header">
      <text class="image-uploader__header-title">{{ headerText }}</text>
      <text class="image-uploader__header-subtitle">
        {{ headerSubtext }}
      </text>
    </view>
    <view class="image-uploader__main">
      <view class="image-uploader__main-result">
        <template v-if="tempImage">
          <view class="temp-image">
            <image v-if="tempImage" :src="tempImage" mode="scaleToFill" />
            <view class="re-choose">重新上傳</view>
          </view>
        </template>
        <template v-else>
          <image class="upload-icon" src="../../../../../static/icons/icon-upload.png" />
          <text>上傳照片</text>
        </template>
      </view>
    </view>
    <view class="image-uploader__footer">
      <text class="image-uploader__footer-left"> 請確保人臉清晰可見 </text>
      <text class="image-uploader__footer-right"> 查看照片範例 &gt; </text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ImageUploader',
  emits: ['on-upload'],
  props: {
    headerText: String,
    headerSubtext: String,
    footerLeftText: String,
    footerRightText: String,
    apiUrl: {
      type: String
    }
  },
  methods: {
    chooseImage() {
      uni.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: ({ tempFilePaths, tempFiles }) => {

        },
        fail: (error) => { }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
