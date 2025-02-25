<template>
  <view class="prize-pool">
    <view
      class="prize-pool__scroll"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd">
      <view
        class="prize-wrapper"
        :style="scrollStyle">
        <view
          v-for="prize in prizes"
          :key="prize.id"
          class="prize-wrapper__item">
          {{ prize.name }}
        </view>
        <view
          v-for="prize in prizes"
          :key="prize.id + '_copy'"
          class="prize-wrapper__item">
          {{ prize.name }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'prize-pool',
  props: {
    prizes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isTouching: false,
    }
  },
  computed: {
    scrollStyle() {
      return {
        animationPlayState: this.isTouching ? 'paused' : 'running',
        animationDuration: '10s',
        // animationDuration: '10s', // 根据奖品数量调整速度
      }
    },
  },
  methods: {
    handleTouchStart() {
      this.isTouching = true
    },
    handleTouchEnd() {
      this.isTouching = false
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.prize-pool {
  margin-top: 12px;
  width: 100%;
  height: 84px;
  overflow: hidden;
  &__scroll {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .prize-wrapper {
      display: inline-flex;
      gap: 8px;
      height: 100%;
      animation: scroll linear infinite;
      &__item {
        flex-shrink: 0;
        width: 96px;
        height: 84px;
        background: #2e2f36;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #fff;
      }
    }
  }
}
</style>
