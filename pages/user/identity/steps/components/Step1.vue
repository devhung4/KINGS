<template>
  <view style="color: #fff;">Step1</view>
</template>

<script>
export default {
  name: 'Step1',
  data() {
    return {}
  },
  methods: {
    goNext() {
      this.$emit('step-change', {
        type: next,
        data: {
          name: 'Step1'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>