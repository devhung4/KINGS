<template>
  <view class="form-item">
    <view class="form-item-label">{{ label }}</view>
    <input :type="type" class="form-item-input">
  </view>
</template>

<script>
export default {
  name: 'FormItem',
  props: {
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  &-input {
    width: 100%;
    height: 44px;
    border-radius: 14px;
    background: #070708;
    border: 1px solid #B2C6DE;
  }
}
</style>