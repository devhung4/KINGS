<template>
  <view class="bill">
    <u-navbar
      title="账单"
      titleStyle="font-size: 36rpx;font-weight: 600;"
      border
      :autoBack="true"
      placeholder
    />

    <div class="record">
      <div class="re_tit">
        <div class="re_rig">
          <div>2024年8月</div>
          <image src="../../static/image/down2.png" />
        </div>
      </div>

      <scroll-view @scrolltolower="scrolltolowerFnc">
        <div class="list_box" v-for="(item, index) in list" :key="index">
          <div class="itm">
            <div class="itm_le">
              <image src="../../static/image/bill1.png" />
              <div class="le_tit">
                <div>消费</div>
                <div>{{ item.createTime }}</div>
              </div>
            </div>
            <div class="itm_ri">
              <div>{{ item.amount }} {{ item.coinId }}</div>
              <div>成功</div>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pageNo: 1,
      list: [],
      fundfinished: false,
    };
  },
  mounted() {
    this.financeRecord();
  },
  methods: {
    async financeRecord() {
      let res = await this.$request.post("/uc/asset/wallet/financeRecord", {
        data: {
          pageNo: this.pageNo,
          pageSize: 10,
        },
      });
      if (res.data.code == 0) {
        let obj = res.data.data.content;
        if (this.pageNo == 1) {
          this.list = obj;
        } else {
          this.list = [...this.list, ...obj];
        }

        if (obj.length == 0 || obj.length < 10) {
          this.fundfinished = true;
        }
      }
    },
    scrolltolowerFnc() {
      if (this.fundfinished) {
        return;
      }
      this.pageNo++;
      this.financeRecord();
    },
  },
};
</script>

<style lang="less" scope>
.bill {
  background: #f8f8f8;
  min-height: 100vh;
  .record {
    padding: 16px;
    .re_tit {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .re_lef {
        font-weight: bold;
        font-size: 16px;
        color: #333333;
        line-height: 22px;
      }
      .re_rig {
        display: flex;
        align-items: center;
        div {
          margin-right: 2px;
          font-weight: 400;
          font-size: 14px;
          color: #000000;
          line-height: 20px;
        }
        image {
          width: 16px;
          height: 16px;
        }
      }
    }
    .list_box {
      padding: 2px;
      .itm {
        margin-bottom: 12px;
        background: #ffffff;
        box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.15);
        border-radius: 5px;
        padding: 16px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .itm_le {
          display: flex;
          align-items: center;
          image {
            width: 36px;
            height: 36px;
            margin-right: 8px;
          }
          .le_tit {
            div:nth-child(1) {
              font-weight: bold;
              font-size: 14px;
              color: #000000;
              line-height: 20px;
            }
            div:nth-child(2) {
              margin-top: 6px;
              font-weight: 400;
              font-size: 11px;
              color: #999999;
              line-height: 14px;
            }
          }
        }
        .itm_ri {
          div:nth-child(1) {
            text-align: right;
            font-weight: bold;
            font-size: 16px;
            color: #000000;
            line-height: 19px;
            margin-bottom: 6px;
          }
          div:nth-child(2) {
            text-align: right;
            font-weight: 400;
            font-size: 11px;
            color: #10c300;
            line-height: 14px;
          }
        }
      }
    }
  }
}
</style>
