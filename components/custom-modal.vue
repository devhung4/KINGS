<!-- 
  * @FileDescription: 通用模态框组件
  * @Author: DevHung
  * @Date: 2025-2-18-14:43
-->
<template>
  <uni-popup
    ref="popup"
    :type="mode"
    :is-mask-click="onClickMaskClose"
    :style="{
      zIndex: mode === 'bottom' && 9999,
    }">
    <view
      :class="[
        'custom-modal',
        `custom-modal__${mode}`,
        fullScreen ? 'custom-modal__full' : '',
      ]">
      <view
        v-if="title"
        class="custom-modal__title">
        {{ title }}
      </view>
      <view
        v-if="$slots.default"
        class="custom-modal__content">
        <slot></slot>
      </view>
      <view
        v-if="showConfirmButton || showCancelButton"
        class="custom-modal__button-group">
        <button
          v-if="showCancelButton"
          @tap="handleCancel"
          class="custom-modal__button-group--cancel">
          {{ cancelText }}
        </button>
        <button
          v-if="showConfirmButton"
          @tap="handleConfirm"
          class="custom-modal__button-group--confirm">
          {{ confirmText }}
        </button>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: String,
    mode: {
      type: String,
      default: 'center',
      validator: (val) =>
        ['center', 'top', 'bottom', 'left', 'right'].includes(val),
    },
    onClickMaskClose: {
      type: Boolean,
      default: true,
    },
    showConfirmButton: {
      type: Boolean,
      default: false,
    },
    showCancelButton: {
      type: Boolean,
      default: false,
    },
    confirmText: {
      type: String,
      default: '确认',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    fullScreen: {
      type: Boolean,
      default: false,
      validator: (val) => typeof val === 'boolean',
    },
  },
  data() {
    return {}
  },
  methods: {
    open() {
      this.$nextTick(() => {
        if (this.$refs.popup) {
          this.$refs.popup.open() // 确保DOM更新后调用
        }
      })
    },
    close() {
      this.$nextTick(() => {
        if (this.$refs.popup) {
          this.$refs.popup.close() // 确保DOM更新后调用
        }
      })
    },
    handleCancel() {
      this.close()
      this.$emit('cancel')
    },
    handleConfirm() {
      this.close()
      this.$emit('confirm')
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-modal {
  padding: 24px;
  max-width: 100%;
  background-color: #1f2029;
  // 开启GPU加速
  will-change: transform, opacity;
  backface-visibility: hidden;

  &__full {
    min-height: calc(100vh - 56px);
  }

  &__center {
    width: 575rpx;
    border-radius: 18px;
  }

  &__bottom {
    border-top-right-radius: 18px;
    border-top-left-radius: 18px;
    width: 100%;
    min-width: 100%;
  }

  &__title {
    display: block;
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    text-align: center;
  }

  &__content {
    padding-top: 24px;
    color: #ffffff;
    white-space: normal;
    word-wrap: break-word;
  }

  &__button-group {
    display: flex;
    gap: 6px;
    padding-top: 32px;

    button {
      flex: 1 1 0%;
      border-radius: 18px;
      font-size: 16px;
      font-weight: bold;
      width: min-content;
    }

    &--confirm {
      color: #303241;
      background-color: #f0c474;
    }

    &--cancel {
      color: #a8abb6;
      background-color: #303241;
    }
  }
}
</style>
