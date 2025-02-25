<template>
  <div class="card_box">
    <div class="navBox">
      <div class="back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="title">{{id == '210' ?'關於我們':'幫助中心'}}</div>
      <div class="div"></div>
    </div>
    <view class="page">
      <view class="title" v-if="id != '210'">{{ noticeinfo.title }}</view>
      <view class="time" v-if="id != '210'">{{ noticeinfo.createTime }}</view>
      <rich-text class="introduce" :nodes="noticeinfo.content"></rich-text>
    </view>
  </div>
</template>

<script>
import { mapState } from "vuex";
import jyfParser from "@/components/jyf-parser/jyf-parser.vue";
export default {
  computed: {},
  data() {
    return {
      id: "",
      noticeinfo: {},
      htmlNodes: "",
      htmltext: true,
    };
  },
  onShow() {
    // this.id = this.$route.query.id;
    this.id = uni.getStorageSync("helpdetailid");

    this.detailinfo();
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },
    async detailinfo() {
      let res = await this.$request.post("/news/ancillary/more/help/detail", {
        data: {
          id: this.id,
        },
      });
      if (res.data.code == 0) {
        this.noticeinfo = res.data.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card_box {
  background: #000;
  min-height: 100vh;
  padding-top: 30px;
  box-sizing: border-box;
}
.navBox {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 15px;
  background: #000;

  .div,
  .rec {
    width: 76rpx;
    height: 76rpx;
  }

  .title {
    font-weight: bold;
  }

  .back {
    image {
      width: 76rpx;
      height: 76rpx;
      display: block;
    }
  }

  .record {
    width: 48rpx;
    height: 48rpx;
  }
}
.page {
  padding: 0 5% 5% 5%;

  .title {
    line-height: 60upx;
    color: #fff;
  }
  .time {
    font-size: 26upx;
    color: #fff;
    margin: 3% 0 5%;
  }
  .introduce {
    font-size: 28upx;
    color: #fff;
    line-height: 50upx;
    /deep/ p {
      color: #fff !important;
    }
  }
}
</style>
