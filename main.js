import Vue from "vue";
import store from "./store";
import App from "./App";
import i18n from "./i18n/index.js";
// import $http from './js_sdk/zhouWei-request/requestConfig.js';
import request from "js_sdk/cooke-request/request/request.js";

import uView from "uview-ui";
import { toPage, goBack } from "./utils/index.js";

Vue.use(uView);

// import Json from './Json' //测试用数据
import pageHead from "./components/page-head.vue";
/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
Vue.component("page-head", pageHead);

// const $htmlhttpurl = "http://appcj2021.coneys.shop";
const $htmlhttpurl = "https://api.8.top/gateway/";

const msg = (title, duration = 1500, mask = false, icon = "none") => {
  //统一提示方便全局修改
  if (Boolean(title) === false) {
    return;
  }
  uni.showToast({
    title,
    duration,
    mask,
    icon,
  });
};
const json = (type) => {
  //模拟异步请求数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Json[type]);
    }, 500);
  });
};
const add0 = (m) => {
  return m < 10 ? "0" + m : m;
};
const format = (shijianchuo) => {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return (
    y +
    "-" +
    add0(m) +
    "-" +
    add0(d) +
    " " +
    add0(h) +
    ":" +
    add0(mm) +
    ":" +
    add0(s)
  );
};
const prePage = () => {
  let pages = getCurrentPages();
  let prePage = pages[pages.length - 2];
  // #ifdef H5
  return prePage;
  // #endif
  return prePage.$vm;
};

// 全局配置
// http://47.98.171.200:19999/yunxianggou-interface --- http://47.90.89.113/digital_mall/wx -- https://lianwu.kuaibiaoshou.com/cloud-shop-interface -- http://47.240.105.242:19999/yunxianggou-interface--http://yunxianggou.network/yunxianggou-interface
request.setConfig({
  // baseUrl: 'http://app.ruijiegou.net/yunxianggou-interface',

  //   baseUrl: '/gateway/',
  baseUrl: "https://api.8.top/",
  // baseUrl: 'http://192.168.31.215:8080/shennongji-interface',
  dataType: "json", // 可删除，默认为json
  responseType: "text", // 可删除，默认为text
  // 设置请求头，支持所有请求头设置，也可不设置，去掉header就行
  header: {
    // 'token': 'token from global',
    "content-type": "application/x-www-form-urlencoded;charset=UTF-8n",
    // "Access-Control-Allow-Origin": "*",
    // "x-auth-token": uni.getStorageSync("x-auth-token"),
    "Accept-Language": uni.getStorageSync("locale")
      ? uni.getStorageSync("locale")
      : "zh-CN,zh",
  },
});

// 设置请求拦截器
request.interceptors.request((config) => {
  if(config.data && config.data.base){
    if (uni.getStorageSync("token")) {
      config.header["token"] = uni.getStorageSync("token");
      config.header["content-type"]="application/json"
    } else {
      config.header["token"] = "";
    }
  }else{
    if (uni.getStorageSync("token")) {
      config.header["x-auth-token"] = uni.getStorageSync("token");
    } else {
      config.header["x-auth-token"] = "";
    }
  }
  
  // 配置参数和全局配置相同，此优先级最高，会覆盖在其他地方的相同配置参数

  // 追加请求头，推荐
  // config.header['content-type'] = 'application/json';
  // config.header.token = 'token from interceptors';

  // 覆盖请求头
  // config.header = {
  // 'content-type': 'application/json',
  // 'token': 'token from interceptors'
  // }

  // return false; // 终止请求
  // return Promise.reject('error from request interceptors'); // 向外层抛出错误，用catch捕获
  return config; // 返回修改后的配置，如未修改也需添加这行
});

// 设置响应拦截器
request.interceptors.response((res) => {
  if(res.data.code == 4000 || (res.data.base && res.data.base.code == '100102')){
    uni.navigateTo({
      url: "../public/login",
    });
  }else{
    return res; // 原样返回
  }
  // 接收请求，执行响应操作
  // 您的逻辑......

  // return false;    // 阻止返回,页面不会接收返回值
  // return {message: '自定义值，来自拦截器'};   // 返回您自定义的值，将覆盖原始返回值
  // return Promise.reject('error from response interceptors') // 向外层抛出错误，用catch捕获
  
});

// // 挂载到全局vue实例上，在页面中可以使用this.$request调用request实例下相应方法
Vue.prototype.$request = request;
// Vue.prototype.$http = $http;
// Vue.prototype.$htmlhttpurl = $htmlhttpurl;
Vue.config.productionTip = false;
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype._i18n = i18n;
Vue.prototype.$toPage = toPage; // 跳转页面
Vue.prototype.$goBack = goBack; // 返回上一页
Vue.prototype.$api = {
  msg,
  json,
  prePage,
  add0,
  format,
};
// Vue.prototype.url = 'http://47.95.141.194:17777/cloud-shop-interface';
// Vue.prototype.url = 'http://app2020hdekehhe.bishen.co/seven-star-interface';
// Vue.prototype.url = 'http://192.168.31.215:8080/shennongji-interface';
App.mpType = "app";

const app = new Vue({
  i18n,
  ...App,
});
app.$mount();
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);
