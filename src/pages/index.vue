<template>
  <div class="index_wrap">
    <div class="top" @click="reset" :style="{height:$store.state.top_h}">
      <stock ref="stock" v-show="$store.state.stockIf"></stock>
      <my-stock ref="mystock" v-show="$store.state.stockIf1"></my-stock>
      <k-line ref="kline" v-if="$store.state.klineIf"></k-line>
      <t-line ref="tline" v-if="$store.state.tlineIf"></t-line>
      <div class="sort clearfix" v-if="$store.state.sortIf">
        <!-- <span class="c_p" :class="{active:$store.state.sort_index==1}" @click.stop="sort(1)">指数</span> -->
        <span class="c_p" :class="{active:$store.state.sort_index==2}" @click.stop="sort(2)">A股</span>
        <!-- <span class="c_p" :class="{active:$store.state.sort_index==3}" @click.stop="sort(3)">B股</span>
        <span class="c_p" :class="{active:$store.state.sort_index==4}" @click.stop="sort(4)">权证</span>
        <span class="c_p" :class="{active:$store.state.sort_index==5}" @click.stop="sort(5)">债务</span>
        <span class="c_p" :class="{active:$store.state.sort_index==6}" @click.stop="sort(6)">开放式基金</span>
        <span class="c_p" :class="{active:$store.state.sort_index==7}" @click.stop="sort(7)">封闭式基金</span>
        <span class="c_p" :class="{active:$store.state.sort_index==8}" @click.stop="sort(8)">中小基金</span>
        <span class="c_p" :class="{active:$store.state.sort_index==9}" @click.stop="sort(9)">创业板</span>
        <span class="c_p" :class="{active:$store.state.sort_index==10}" @click.stop="sort(10)">退市整理期</span>
        <span class="c_p" :class="{active:$store.state.sort_index==11}" @click.stop="sort(11)">风险警示</span>
        <span class="c_p" :class="{active:$store.state.sort_index==12}" @click.stop="sort(12)">其他</span>-->
        <span class="c_p" :class="{active:$store.state.sort_index==13}" @click.stop="sort(13)">自选</span>
        <!-- <span
          class="c_p s_re"
          :class="{active:$store.state.sort_index=='area'}"
          @click.stop="sort(14)"
        >
          地区
          <span class="iconfont icon-triangle-top"></span>
          <div class="area_div" v-show="area_if" :style="{left:area_left}">
            <div class="clearfix">
              <ul>
                <li :class="{active:$store.state.sort_index=='黑龙江'}" @click.stop="sort('黑龙江')">黑龙江</li>
                <li>新疆板块</li>
                <li>吉林板块</li>
                <li>甘肃板块</li>
                <li>辽宁板块</li>
                <li>青海板块</li>
                <li>北京板块</li>
                <li>陕西板块</li>
                <li>天津板块</li>
                <li>广西板块</li>
                <li>河北板块</li>
                <li>广东板块</li>
                <li>河南板块</li>
                <li>宁夏板块</li>
                <li>山东板块</li>
                <li>上海板块</li>
              </ul>
              <ul>
                <li>山西板块</li>
                <li>深圳板块</li>
                <li>湖北板块</li>
                <li>福建板块</li>
                <li>湖南板块</li>
                <li>江西板块</li>
                <li>四川板块</li>
                <li>安徽板块</li>
              </ul>
            </div>
          </div>
        </span>
        <span
          class="c_p s_re"
          :class="{active:$store.state.sort_index=='trade'}"
          @click.stop="sort(15)"
        >
          行业
          <span class="iconfont icon-triangle-top"></span>
        </span>
        <span
          class="c_p s_re"
          :class="{active:$store.state.sort_index=='idea'}"
          @click.stop="sort(16)"
        >
          概念
          <span class="iconfont icon-triangle-top"></span>
        </span>-->
        <span class="c_p" @click="pre">上一页</span>
        <span class="c_p" @click="next">下一页</span>
        <span class="pages">
          第
          <!-- <input type="text" @input="inputNum($event)" v-model="input_page" @keyup.enter="toPage"> -->
          <select @change="toPage" v-model="input_page">
            <option v-for="(item,index) in sum" :value="item">{{item}}</option>
          </select>
          页
        </span>
        <span class="search">
          股票代码
          <input type="text" v-model="search_code" @input="inputNum($event)" @keyup.enter="search">
          <button type="button" class="btn" @click="search">搜索</button>
        </span>
      </div>
      <div class="menu clearfix">
        <div v-for="(item,index) in threeArr" :key="index" @click="toTline(item,1)" class="c_p">
          <span class="yellow">{{item.name1}}</span>
          <span :class="item.color">{{item.updown}}&nbsp;&nbsp;{{item.updown_}}</span>
          <span class="yellow">{{item.amount}}</span>
        </div>
        <div class="tool_btn">
          <el-tooltip content="主页" placement="top" effect="light">
            <el-button @click="toHome(1)">
              <span class="iconfont icon-zhuye1"></span>
            </el-button>
          </el-tooltip>
          <el-tooltip content="上一页" placement="top" effect="light">
            <el-button @click="pre">
              <span class="iconfont icon-uparrow"></span>
            </el-button>
          </el-tooltip>
          <el-tooltip content="下一页" placement="top" effect="light">
            <el-button @click="next">
              <span class="iconfont icon-downarrow"></span>
            </el-button>
          </el-tooltip>
          <el-tooltip content="后退" placement="top" effect="light">
            <el-button @click="toHome(0)">
              <span class="iconfont icon-leftarrow"></span>
            </el-button>
          </el-tooltip>
          <el-tooltip content="已连接" placement="top" effect="light">
            <el-button>
              <img src="../assets/6.png" style="width:36px;margin-top:2px;margin-left:6px;" alt>
            </el-button>
          </el-tooltip>
          <span>同德证券</span>
        </div>
      </div>
      <div class="assets">
        <div>
          账户：
          <span>{{$store.state.u_assets.number}}</span>
        </div>
        <div>
          资金：
          <span>{{$store.state.u_assets.total}}</span>
        </div>
        <div>
          平仓盈亏：
          <span
            :class="[$store.state.u_assets.close_profit>0?'red':'green']"
          >{{$store.state.u_assets.close_profit}}</span>
        </div>
        <div>
          持仓盈亏：
          <span
            :class="[$store.state.u_assets.profit>0?'red':'green']"
          >{{$store.state.u_assets.profit}}</span>
        </div>
        <div>
          实际入金：
          <span>{{$store.state.u_assets.bond}}</span>
        </div>
        <div>
          可用资金：
          <span>{{$store.state.u_assets.cash}}</span>
        </div>
        <div>
          证券市值：
          <span>{{$store.state.u_assets.market}}</span>
        </div>
      </div>
    </div>
    <div class="bottom clearfix">
      <div class="clearfix">
        <div class="bot_nav">
          <router-link tag="div" class="nav c_p" :to="{ name:'buy' }">股票买入</router-link>
          <router-link tag="div" class="nav c_p" :to="{ name:'sell' }">股票卖出</router-link>
          <router-link tag="div" class="nav c_p" :to="{ name:'entrust' }">委托记录</router-link>
          <router-link tag="div" class="nav c_p" :to="{ name:'close' }">平仓记录</router-link>
          <router-link tag="div" class="nav c_p" :to="{ name:'deal' }">开仓记录</router-link>
          <router-link tag="div" class="nav c_p" :to="{ name:'withdraw' }">申请提现</router-link>
          <router-link tag="div" class="nav c_p" :to="{ name:'topup' }">申请充值</router-link>
          <router-link tag="div" class="nav c_p" :to="{ name:'in' }">入金记录</router-link>
          <router-link tag="div" class="nav c_p" :to="{ name:'out' }">出金记录</router-link>
          <router-link tag="div" class="nav c_p" :to="{ name:'identify' }">实名认证</router-link>
          <router-link tag="div" class="nav c_p" :to="{ name:'card' }">绑定银行卡</router-link>
          <router-link tag="div" class="nav c_p" :to="{ name:'pwd' }">修改密码</router-link>
          <router-link tag="div" class="nav c_p" :to="{ name:'notice' }">系统公告</router-link>
        </div>
        <div class="bot_main">
          <keep-alive>
            <router-view ref="bot" name="child"></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
    <div class="mask" v-if="risk">
      <div>
        <div class="d_top clearfix">
          <span class="f_l">风险提示书</span>
          <span class="f_r c_p iconfont icon-cha" @click="exit"></span>
        </div>
        <div class="d_con">
          <div class="title white">风险揭示书</div>
          <div class="con" v-html="risk_book"></div>
        </div>
        <div class="d_bot">
          <button class="btn" @click="risk = false">同意</button>
          <button class="btn" @click="exit">退出</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import Kline from "../components/kline";
import Tline from "../components/tline";
import Stock from "../components/stock";
import MyStock from "../components/myStock";
import "../assets/iconfont/iconfont.css";
export default {
  data() {
    return {
      search_code: "",
      sum: [],
      input_page: 1,
      risk: true,
      area_if: false,
      trade_if: false,
      idea_if: false,
      area_left: "0",
      trade_left: "0",
      idea_left: "0",
      risk_book: "",
      threeArr: [
        {
          code:"000001",
          short:"sh000001",
          color: "",
          name: "--",
          updown: "--",
          updown_: "--",
          amount: "--"
        },
        {
          code:"399001",
          short:"sz399001",
          color: "",
          name: "--",
          updown: "--",
          updown_: "--",
          amount: "--"
        },
        {
          code:"399300",
          short:"sz399300",
          color: "",
          name: "--",
          updown: "--",
          updown_: "--",
          amount: "--"
        }
      ]
    };
  },
  components: {
    "k-line": Kline,
    "t-line": Tline,
    stock: Stock,
    "my-stock": MyStock
  },
  mounted() {
    let that = this;
    // 风险提示书
    that
      .$http({
        url: "/",
        method: "post",
        data: {
          nozzle: "risk_revelation"
        }
      })
      .then(function(res) {
        if (res.data.code == 1) {
          that.risk_book = res.data.data;
        }
      });
  },
  activated() {
    this.$store.dispatch("getAssets");
    this.getOther();
  },
  methods: {
    search() {
      let that = this;
      if(that.search_code==""||that.search_code.length!=6){
        that.$message({
          message: "请输入合理股票代码",
          type: "error",
          duration: 1500
        });
        return false;
      }
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle:"search_stock",
            num:that.$refs.stock.size,
            code:that.search_code
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            if(res.data.data.data.length){
              that.input_page = res.data.data.current;
              that.$refs.stock.page = res.data.data.current-1;
              that.$refs.stock.ifSetFirst = true;
              that.$refs.stock.getList(1, 0, 1,that.search_code);
            }else{
              that.$message({
                message: "未查询到相关股票",
                type: "error",
                duration: 1500
              });
            }
          }
        });
    },
    getOther() {
      let that = this;
      let arr = ["sh000001", "sz399001", "sz399300"];
      fun();
      window.three = setInterval(fun, 3000);
      function fun() {
        $.ajax({
          url: "http://qt.gtimg.cn/q=" + arr.toString(),
          type: "GET",
          dataType: "script",
          cache: true,
          success: function() {
            var a,
              list = [];
            for (let i in arr) {
              a = eval("v_" + arr[i]).split("~");
              let obj = {};
              obj.short = arr[i];
              obj.updown_ = a[32] + "%";
              obj.updown = a[31];
              if (obj.updown > 0) {
                obj.color = "red";
              } else if (obj.updown < 0) {
                obj.color = "green";
              } else {
                obj.color = "white";
              }
              if (a[37] > 10000) {
                if (parseFloat(a[37] % 10000)) {
                  a[37] = parseFloat(a[37] / 10000).toFixed(1);
                } else {
                  a[37] = parseFloat(a[37] / 10000);
                }
                a[37] = parseFloat(a[37]) + "亿";
              } else {
                a[37] = a[37] + "万";
              }
              obj.amount = a[37];
              obj.code = a[2];
              obj.name = a[1];
              if (i == 0) {
                obj.name1 = "上证";
              } else if (i == 1) {
                obj.name1 = "深证";
              } else {
                obj.name1 = "深沪";
              }
              list.push(obj);
            }
            that.threeArr = list;
          }
        });
      }
    },
    toTline(item,x) {
      let that = this;
      if(x){
        that.$store.state.speIf = true;
        // that.$refs.tline.time_line(item.short);
      }else{
        that.$store.state.speIf = false;
      }
      clearInterval(that.$refs.stock.top_stock);
      that.$store.state.active_stock = item;
      let short0 = item.code.slice(0, 1) == 6 ? "sh" : "sz" + item.code;
      // if (that.$route.name == "buy" || that.$route.name == "sell") {
      //   that.$refs.bot.getInfo(short0, 0);
      //   that.$refs.bot.formInfo(short0);
      // }
      that.$store.state.source_list = 0;
      that.mouseIf = false;
      that.$store.state.klineIf = false;
      that.$store.state.tlineIf = true;
      that.$store.state.stockIf = false;
      that.$store.state.stockIf1 = false;
      that.$store.state.sortIf = false;
      that.$store.state.top_h = "calc(100% - 370px)";
    },
    pre() {
      let that = this;
      clearInterval(that.$refs.stock.top_stock);
      if (that.$store.state.sort_index != 13) {
        that.$refs.stock.ifSetFirst = true;
        if(that.$refs.stock.page==1){
          return false;
        }
        that.$refs.stock.getList(0, 0, 1);
      }
    },
    next() {
      let that = this;
      clearInterval(that.$refs.stock.top_stock);
      if (that.$store.state.sort_index != 13) {
        that.$refs.stock.ifSetFirst = true;
        if(that.$refs.stock.page==that.sum.length){
          return false;
        }
        that.$refs.stock.getList(1, 0, 1);
      }
    },
    toHome(type) {
      let that = this;
      clearInterval(that.$refs.stock.top_stock);
      clearInterval(window.tline_time);
      clearInterval(window.chart_right);
      clearInterval(window.chart_right1);
      that.$children[1].mouseIf = false;
      that.$store.state.klineIf = false;
      that.$store.state.tlineIf = false;
      that.$store.state.stockIf1 = false;
      that.$store.state.sortIf = true;
      that.$store.state.top_h = "calc(100% - 401px)";
      if (type) {
        that.$store.state.sort_index = 2;
        that.$refs.stock.page = 0;
        that.input_page = 1;
        that.$store.state.stockIf = true;
        that.$refs.stock.ifSetFirst = true;
        that.$refs.stock.getList(1, 1, 1);
      } else {
        if (that.$store.state.source_list) {
          that.$store.state.stockIf1 = true;
          that.$refs.stock.getList(0);
        } else {
          that.$refs.stock.page--;
          that.$store.state.stockIf = true;
          that.$refs.stock.getList(1, 0, 0);
        }
      }
    },
    inputNum(e) {
      let that = this;
      that.$nextTick(function() {
        that.search_code = $(e.target)
          .val()
          .toString()
          .replace(/[^\d]/g, "");
      });
    },
    toPage() {
      let that = this;
      clearInterval(that.$refs.stock.top_stock);
      that.$refs.stock.page = that.input_page-1;
      that.$refs.stock.ifSetFirst = true;
      that.$refs.stock.getList(1, 0, 1);
    },
    reset() {
      this.area_if = false;
      this.trade_if = false;
      this.idea_if = false;
    },
    exit() {
      this.risk = false;
      this.$router.push({
        name: "login"
      });
    },
    sort(i) {
      if (i == 2) {
        this.$store.state.active_stock = {};
        this.toHome(1);
      }
      if (i == 13) {
        this.sum = [1];
        this.input_page = 1;
        this.$store.state.active_stock = {};
        this.$store.state.stockIf1 = true;
        this.$store.state.stockIf = false;
        this.$refs.mystock.getList(1);
      }
      if (i != 14 && i != 15 && i != 16) {
        this.reset();
        this.$store.state.sort_index = i;
      } else {
        let w = $("body").width();
        if (i == 14) {
          this.area_if = !this.area_if;
          this.trade_if = false;
          this.idea_if = false;
        } else if (i == 15) {
          this.trade_if = !this.trade_if;
          this.area_if = false;
          this.idea_if = false;
        } else if (i == 16) {
          this.idea_if = !this.idea_if;
          this.area_if = false;
          this.trade_if = false;
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../base/common.scss";
.index_wrap {
  width: 100%;
  height: 100%;
  background: #000;
  .top {
    background: #000;
    .sort {
      padding: 10px 0 2px 2px;
      > span {
        float: left;
        background: #808080;
        font-size: 14px;
        padding: 0 4px 0;
        border-radius: 1px;
        margin-right: 3px;
        .iconfont {
          display: inline-block;
          font-size: 14px;
          margin-left: -2px;
        }
      }
      > span:active {
        color: #800000;
      }
      > .active {
        background: #800000;
        color: #7fffff;
      }
      > .s_re {
        position: relative;
        > div {
          position: absolute;
          // left: 0;
          bottom: calc(100% + 1px);
          > div {
            width: max-content;
            white-space: nowrap;
            background: #d4d0c8;
          }
          ul {
            float: left;
            border-right: 1px solid #000;
            li {
              color: #333;
              width: 90px;
              text-align: center;
              line-height: 22px;
              font-size: 13px;
            }
            li:hover {
              background: #0a246a;
              color: white;
            }
            .active {
              background: #800000 !important;
              color: #7fffff !important;
            }
          }
          ul:last-child {
            border: 0;
          }
        }
      }
      > .pages:active {
        color: #aeaeae;
      }
      > .search:active {
        color: #aeaeae;
      }
      > .pages {
        margin-left: 4px;
        background: transparent;
        color: #aeaeae;
      }
      .search {
        margin-left: 4px;
        background: transparent;
        color: #aeaeae;
        input:focus {
          border-color: rgba($color: white, $alpha: 0.9);
        }
        input {
          display: inline-block;
          margin: 0 4px 0;
          height: 19px;
          transform: translateY(-1px);
          color: rgba($color: white, $alpha: 0.9);
          background: #000;
          outline: 0;
          border: 1px solid #aeaeae;
          width: 100px;
          box-sizing: border-box;
          padding: 0 4px 0;
        }
        .btn {
          width: 60px;
          text-align: center;
          border-radius: 2px;
          background: transparent;
          border: 1px solid #ccc;
          color: #333;
          background: #ccc;
        }
      }
    }
    .menu {
      margin-top: 2px;
      border: 1px solid #b00000;
      font-size: 15px;
      > div {
        float: left;
        border-right: 1px solid #b00000;
        padding: 2px 4px 2px;
        > span {
          display: inline-block;
        }
        > span:nth-child(2) {
          padding: 0 8px 0;
        }
      }
      > div:last-child {
        border: 0;
        padding: 0;
        line-height: 24px;
        button {
          padding: 0;
          color: #ccc;
          background: transparent;
          border: 0;
          vertical-align: top;
        }
        .iconfont {
          font-size: 16px;
          display: inline-block;
        }
        > span {
          color: #c6c6c6;
          display: inline-block;
          margin-left: 12px;
          vertical-align: top;
        }
      }
    }
    .assets {
      padding: 8px 8px 8px;
      font-size: 15px;
      > div {
        display: inline-block;
        color: #aeaeae;
        margin-right: 16px;
      }
      > div:first-child {
        margin-right: 32px;
      }
    }
  }
  .bottom {
    position: absolute;
    width: 100%;
    z-index: 999;
    bottom: 0;
    left: 0;
    background: white;
    border-bottom: 1px solid #bbb;
    .bot_nav {
      float: left;
      height: 304px;
      overflow: auto;
      border-right: 1px solid #bbb;
      /*webkit滚动条处理*/
      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
        background-color: #eee;
        border: 1px solid #eee;
      }

      /*定义滚动条轨道 内阴影+圆角*/
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px #eee;
        background-color: #eee;
      }
      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        -webkit-box-shadow: inset 0 0 6px #eee;
        background-color: #ccc;
        border-radius: 10px;
      }
      .nav {
        color: #5770c8;
        line-height: 38px;
        width: 150px;
        text-align: center;
      }
      .nav:hover {
        background: #eee;
      }
      .router-link-exact-active {
        color: white !important;
        background: #5770c8 !important;
      }
    }
    .bot_main {
      float: right;
      width: calc(100% - 160px);
    }
  }
  .mask {
    background: rgba($color: #000000, $alpha: 0);
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 9999999;
    > div {
      position: absolute;
      border: 6px solid #444;
      width: 40%;
      min-width: 650px;
      height: 60%;
      left: 50%;
      top: 50%;
      border-radius: 2px;
      transform: translate(-50%, -50%);
      background: #444;
      border-radius: 2px;
      .d_top {
        color: #9e9e9e;
        background: #444;
        padding: 0 4px 6px;
        .f_l {
          font-size: 14px;
        }
        .iconfont {
          font-size: 18px;
        }
      }
      .d_con {
        background: #000;
        margin: 0 auto;
        height: calc(100% - 80px);
        .title {
          text-align: center;
          font-size: 18px;
          padding: 10px 0 10px;
        }
        .con {
          width: 100%;
          height: calc(100% - 44px);
          overflow: auto;
          color: #c0c0c0;
          font-size: 14px;
          padding: 0 16px 0;
          box-sizing: border-box;
          /*webkit滚动条处理*/
          &::-webkit-scrollbar {
            width: 3px;
            height: 3px;
            background-color: #2b2b2b;
            border: 1px solid #2b2b2b;
          }

          /*定义滚动条轨道 内阴影+圆角*/
          &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px #2b2b2b;
            background-color: #2b2b2b;
          }
          /*定义滑块 内阴影+圆角*/
          &::-webkit-scrollbar-thumb {
            -webkit-box-shadow: inset 0 0 6px #2b2b2b;
            background-color: #646464;
            border-radius: 4px;
          }
        }
      }
      .d_bot {
        text-align: center;
        background: #333;
        padding: 14px 0 10px;
        .btn {
          @include btn(#000, 2px);
          display: inline-block;
          width: 80px;
          margin: 0 30px 0;
          color: #c0c0c0;
          line-height: 26px;
        }
      }
    }
  }
}
</style>


