<template>
  <div class="apply_box">
    <scroll-view @scrolltolower="scrolltolowerFnc">
      <div class="applt_cen">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="top">
            <span>{{ item.symbol }}</span>
          </div>

          <div class="item_label">
            <span>充币数量</span>
            <div>{{ item.amount }}</div>
          </div>
          <div class="item_label">
            <span>充币地址</span>
            <div>{{ item.address }}</div>
          </div>
          <div class="item_label">
            <span></span>
            <div style="color: #999; margin-top: 10px">
              到账时间：{{ item.createTime }}
            </div>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      pageNo: 1,
      fundfinished: false,
    };
  },
  props: [],
  mounted() {},
  methods: {
    onLoad() {
      this.transferRecord();
    },

    async transferRecord() {
      let res = await this.$request.post("/uc/approve/security/setting");
      if (res.data.code == 0) {
        let res2 = await this.$request.post("/uc/asset/transaction/all", {
          data: {
            pageNo: this.pageNo,
            pageSize: 10,
            type: 0,
            memberId: res.data.data.id,
          },
        });

        if (res2.data.code == 0) {
          let obj = res2.data.data.content;
          if (this.pageNo === 1) {
            this.list = obj;
          } else {
            this.list = [...this.list, ...obj];
          }
          if (obj.length == 0 || obj.length < 10) {
            this.fundfinished = true;
          }
        }
      }
    },

    scrolltolowerFnc() {
      if (this.fundfinished) {
        return;
      }
      this.pageNo++;
      this.transferRecord();
    },
  },
};
</script>

<style scoped lang="scss">
.apply_box {
  min-height: 100vh;
  background: #000;
  position: relative;
}
.applt_cen {
  padding: 0 15px;
  max-height: 92vh;
  overflow-y: scroll;
  .item {
    padding: 15px;
    border-radius: 10px;
    margin-top: 10px;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      color: #fff;
      font-weight: 500;
      border-bottom: 1px solid rgba(151, 151, 151, 0.2);
      font-size: 14px;
    }
    .item_label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 12px;
      span {
        color: #999;
      }
      div {
        flex: 1;
        text-align: right;
        margin-left: 20px;
        word-break: break-all;
        color: #fff;
      }
    }
  }
}
</style>
