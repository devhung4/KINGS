<template>
  <uni-popup
    ref="lotteryModalRef"
    type="center"
    :is-mask-click="false">
    <view class="lottery-modal-content"></view>
  </uni-popup>
</template>

<script>
export default {
  name: 'lottery-modal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    close() {
      this.$emit('update:show', false)
    },
  },
}
</script>

<style></style>
