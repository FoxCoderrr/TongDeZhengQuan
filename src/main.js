// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
//vuex
import store from './store'

// axios
import axios from 'axios'
import Qs from "qs"
axios.defaults.transformRequest = [function (data) {
  if (data.toString() == "[object FormData]") {
    return data;
  } else {
    return Qs.stringify(data)
  }
}];
const host = process.env.NODE_ENV === 'development' ? '/' : 'http://ayserve.bjfable.com/' // 根据 process.env.NODE_ENV 的值判断当前是什么环境
const instance = axios.create({
  baseURL: host,
  timeout: 10000,
  withCredentials: true,
})
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (response.data.code == 0) {
    Vue.prototype.$message({
      message: response.data.msg,
      type: "error",
      duration: 2000
    });
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  Vue.prototype.$message({
    message: "请求失败",
    type: "error",
    duration: 2000
  });
  return Promise.reject(error);
});
Vue.prototype.$http = instance;
// Vue.prototype.axios = instance;
// 全局函数


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
