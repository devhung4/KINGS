<template>
  <div class="transfer_box">
    <div class="navBox">
      <div class="back">
        <image src="../../static/image/go_back2.png" alt="" @click="goBack()" />
      </div>
      <div class="title">地址列表</div>
      <div class="div"></div>
    </div>
    <div class="apply_box">
      <div class="notice">
        <scroll-view @scrolltolower="scrolltolowerFnc">
          <div v-for="(item, index) in list" :key="index">
            <div class="list_itm" @click="checkItem(item)">
              <div class="list_top">
                <div>{{ item.remark }}</div>
                <span>{{ form.unit }}</span>
              </div>
              <div class="list_bottom">
                {{ item.address }}
              </div>
            </div>
          </div>
        </scroll-view>
      </div>

      <div class="sub_button">
        <div @click="setAddress()">添加地址</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      index: 0,
      isMobile: false,
      form: {
        unit: "",
        realUnit: "",
        pageNo: 0,
        pageSize: 20,
      },
      list: [],
      loading: false,
      finished: false,
    };
  },
  props: [],
  created() {},
  onShow() {
    this.form.unit = uni.getStorageSync("extractcoin");
    this.form.realUnit = uni.getStorageSync("extractrealUnit");
    this.addressPage();
  },
  onLoad(options) {
    this.form.unit = options.coin;
    this.form.realUnit = options.realUnit;
    if (options.index) {
      this.index = options.index;
    }
  },
  mounted() {
    // this.addressPage();
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1, // 默认值是1，表示返回的页面层数
      });
    },
    // 地址列表
    async addressPage() {
      let res2 = await this.$request.post("/uc/withdraw/address/page", {
        data: this.form,
      });
      let res = res2.data;
      this.loading = false;
      if (res.code == 0) {
        let obj = res.data.content;
        if (this.form.pageNo === 0) {
          this.list = res.data.content;
        } else {
          for (let i = 0; i < obj.length; i++) {
            this.list.push(obj[i]);
          }
        }
        if (obj.length == 10) {
          this.form.pageNo++;
        } else if (obj.length == 0 || obj.length < 10) {
          this.finished = true;
        }
      } else {
        this.finished = true;
      }
    },
    // 添加地址
    setAddress() {
      uni.setStorageSync("extractunit", this.form.unit);
      uni.setStorageSync("extractrealUnit", this.form.realUnit);

      uni.navigateTo({
        url:
          "/pages/index/updateAddress?coin=" +
          this.form.unit +
          "&realUnit=" +
          this.form.realUnit,
      });
    },

    // 删除地址
    deleteList(item) {
      Dialog.confirm({
        title: "提示",
        message: "是否确认删除",
      })
        .then(() => {
          deleteaddress({ id: item.id }).then((res) => {
            if (res.code == 0) {
              this.$api.msg(res.message);

              this.form.pageNo = 0;
              this.onLoad();
            } else {
              this.$api.msg(res.message);
            }
          });
        })
        .catch(() => {});
    },

    // 选择地址
    checkItem(item) {
      uni.setStorageSync("extractaddress", item.address);
      uni.setStorageSync("extractindex", this.index);

      uni.navigateTo({
        url: "/pages/index/extract?address=" + item.address + "&index=" + this.index,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.transfer_box {
  box-sizing: border-box;
  padding-top: 30px;
  min-height: 100vh;
  background: #000;
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

  span {
    font-weight: 400;
    font-size: 28rpx;
    color: #f0c473;
    line-height: 38rpx;
  }
}
.sub_button {
  position: fixed;
  width: 100%;
  bottom: 20px;
  left: 0;
  div {
    margin: 0 20px;
    background: #f0c473;
    color: #000;
    padding: 10px 0;
    border-radius: 5px;
    text-align: center;
  }
}
.apply_box {
  position: relative;
  .item {
    margin-top: 10px;
    background: #fff;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.list_itm {
  margin-top: 10px;
  padding: 15px;
  // background: #fff;
  background: rgba(31, 32, 41, 0.6);

  .list_top {
    display: flex;
    margin-bottom: 10px;
    align-items: flex-end;
    div {
      font-size: 20px;
      margin-right: 8px;
      color: #fff;
    }
    span {
      color: #999;
      font-size: 14px;
    }
  }
  .list_bottom {
    display: flex;
    color: #fff;
    word-break: break-all;
  }
}
.notice {
  height: 80vh;
  overflow-y: scroll;
}
.del_button {
  height: 100%;
}
.mobilStyle {
  width: 30rem !important;
  left: auto;
}
</style>
