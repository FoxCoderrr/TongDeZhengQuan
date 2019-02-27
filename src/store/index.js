import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
  state: { //$store.state.a调用
    self_short:"",
    source_list:"",
    token: sessionStorage.getItem("token") || "",
    top_h:"calc(100% - 401px)",
    stockIf: true,
    stockIf1: false,
    klineIf: false,
    tlineIf: false,
    sortIf: true,
    u_assets: {
      bond:"",
      cash:"",
      close_profit:"",
      market:"",
      number:"",
      profit:"",
      total:""
    },
    sort_index: 2,
    active_stock: {},
    speIf:false,
    sellArr: [
      {
        index: "卖5",
        number: "--",
        price: "--"
      },
      {
        index: "卖4",
        number: "--",
        price: "--"
      },
      {
        index: "卖3",
        number: "--",
        price: "--"
      },
      {
        index: "卖2",
        number: "--",
        price: "--"
      },
      {
        index: "卖1",
        number: "--",
        price: "--"
      }
    ],
    buyArr: [
      {
        index: "买1",
        number: "--",
        price: "--"
      },
      {
        index: "买2",
        number: "--",
        price: "--"
      },
      {
        index: "买3",
        number: "--",
        price: "--"
      },
      {
        index: "买4",
        number: "--",
        price: "--"
      },
      {
        index: "买5",
        number: "--",
        price: "--"
      }
    ],
    otherArr: ["--", "--", "--", "--"],
    sellArr1: [
      {
        index: "卖5",
        number: "--",
        price: "--"
      },
      {
        index: "卖4",
        number: "--",
        price: "--"
      },
      {
        index: "卖3",
        number: "--",
        price: "--"
      },
      {
        index: "卖2",
        number: "--",
        price: "--"
      },
      {
        index: "卖1",
        number: "--",
        price: "--"
      }
    ],
    buyArr1: [
      {
        index: "买1",
        number: "--",
        price: "--"
      },
      {
        index: "买2",
        number: "--",
        price: "--"
      },
      {
        index: "买3",
        number: "--",
        price: "--"
      },
      {
        index: "买4",
        number: "--",
        price: "--"
      },
      {
        index: "买5",
        number: "--",
        price: "--"
      }
    ],
    otherArr1: ["--", "--", "--", "--"],
  },
  mutations: { //$store.commit('sum')调用
    setAssets(state, params) {
      state.u_assets = params;
    },
  },
  actions: { //$store.dispatch('handler')调用
    getAssets(context) {
      Vue.prototype
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "account",
            token: context.state.token,
          }
        })
        .then(function (res) {
          if (res.data.code == 1) {
            context.commit('setAssets', res.data.data);
          }
        });
    },
  },
  getters: { //计算属性

  },
})
