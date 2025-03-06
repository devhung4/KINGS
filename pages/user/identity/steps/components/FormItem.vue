<template>
  <view class="form-item">
    <view class="form-item-label" v-if="label">
      {{ label }}
      <text class="required" v-if="required">*</text>
    </view>
    <view class="form-item-content">
      <input :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled" class="form-item-input"
        :maxlength="maxlength" @input="handleInput" @blur="handleBlur">
      <text class="error-message" v-if="errorMessage">{{ errorMessage }}</text>
    </view>
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
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: -1
    },
    errorMessage: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'blur'],
  methods: {
    handleInput(e) {
      const value = e.detail.value
      this.$emit('update:modelValue', value)
    },
    handleBlur(e) {
      this.$emit('blur', e)
    },
    validate() {
      if (this.required && !this.modelValue) {
        return false
      }
      if (this.rules.length) {
        return this.rules.every(rule => rule.test(this.modelValue))
      }
      return true
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
  width: 100%;
  margin-bottom: 16px;

  &-label {
    font-size: 14px;
    color: #fff;
    display: flex;
    align-items: center;

    .required {
      color: #ff4d4f;
      margin-left: 4px;
    }
  }

  &-content {
    width: 100%;
  }

  &-input {
    width: 100%;
    height: 44px;
    border-radius: 14px;
    background: #070708;
    border: 1px solid #B2C6DE;
    padding: 0 12px;
    font-size: 14px;
    color: #fff;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &::placeholder {
      color: rgba($color: #fff, $alpha: 0.3);
    }
  }

  .error-message {
    font-size: 12px;
    color: #ff4d4f;
    margin-top: 4px;
    display: block;
  }
}
</style>