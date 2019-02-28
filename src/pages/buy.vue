<template>
  <div class="wrap clearfix">
    <div class="form bs_form">
      <div class="clearfix">
        <span class="f_l">可用资金：</span>
        <div class="f_r">{{$store.state.u_assets.cash}}</div>
      </div>
      <div class="clearfix">
        <span class="f_l">股票名称：</span>
        <div class="f_r">{{name}}</div>
      </div>
      <div class="clearfix">
        <span class="f_l">股票代码：</span>
        <div class="f_r">
          <el-input
            @input="inputNum"
            v-model.number="code"
            maxlength="6"
            placeholder="股票代码"
            clearable
          ></el-input>
        </div>
      </div>
      <div class="clearfix">
        <span class="f_l">买入价格：</span>
        <div class="f_r">
          <el-input @input="inputCoin" v-model.number="price" placeholder="委托价格" clearable></el-input>
        </div>
      </div>
      <div class="clearfix">
        <span class="f_l">最大买入：</span>
        <div class="f_r">
          <el-input v-model.number="max" placeholder clearable readonly></el-input>
        </div>
      </div>
      <div class="clearfix">
        <span class="f_l">买入手数：</span>
        <div class="f_r">
          <el-input @input="inputCoin1" v-model.number="num" placeholder="买入手数" clearable></el-input>
        </div>
      </div>
      <div class="clearfix bs_btn">
        <el-button @click="buy(0)" class="f_l" type="primary" :loading="bool1">
          买涨
          <span class="span">(开多)</span>
        </el-button>
        <el-button @click="buy(1)" class="f_r" type="primary" :loading="bool2">
          买跌
          <span class="span">(开空)</span>
        </el-button>
      </div>
    </div>
    <div class="bs_deal f_l">
      <ul>
        <li class="clearfix" v-for="(item,index) in $store.state.sellArr">
          <span class="f_l green1">{{item.index}}</span>
          <span class="f_l green1">{{item.price}}</span>
          <span class="f_r">{{item.number}}</span>
        </li>
      </ul>
      <ul>
        <li class="clearfix" v-for="(item,index) in $store.state.buyArr">
          <span class="f_l red1">{{item.index}}</span>
          <span class="f_l red1">{{item.price}}</span>
          <span class="f_r">{{item.number}}</span>
        </li>
      </ul>
      <div>
        <div class="clearfix">
          <span class="f_l">
            今开
            <span>{{$store.state.otherArr[0]}}</span>
          </span>
          <span class="f_r">
            涨停
            <span class="red1">{{$store.state.otherArr[1]}}</span>
          </span>
        </div>
        <div class="clearfix">
          <span class="f_l">
            昨收
            <span>{{$store.state.otherArr[2]}}</span>
          </span>
          <span class="f_r">
            跌停
            <span class="green1">{{$store.state.otherArr[3]}}</span>
          </span>
        </div>
      </div>
    </div>
    <div class="list_table f_r">
      <div class="d_table" v-loading="loading">
        <el-table
          :data="tableData3"
          style="width: 100%"
          height="100%"
          @row-click="select"
          :cell-class-name="cellStyle"
        >
          <el-table-column fixed prop="code" label="股票代码" class-name="first_td"></el-table-column>
          <el-table-column fixed prop="name" label="股票名称"></el-table-column>
          <el-table-column prop="price" label="现价"></el-table-column>
          <el-table-column prop="price_" label="成交价"></el-table-column>
          <el-table-column prop="mold" label="方向"></el-table-column>
          <el-table-column prop="num" label="持仓手数"></el-table-column>
          <el-table-column prop="updown_" label="涨幅(%)"></el-table-column>
          <el-table-column prop="updown" label="盈亏"></el-table-column>
          <el-table-column prop="type" label="交易类型"></el-table-column>
          <el-table-column prop="time" label="交易时间" width="140"></el-table-column>
        </el-table>
      </div>
      <div class="d_page ta_r">
        <el-pagination background layout="prev, pager, next" :total="sum" @current-change="getList"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
export default {
  data() {
    return {
      name: "--",
      code: "",
      price: "",
      max: "",
      num: "",
      bool1: false,
      bool2: false,
      page: 1,
      size: 10,
      sum: 0,
      loading: false,
      tableData3: [],
       maxx:this.$store.state.u_assets.cash
    };
  },
  mounted() {},
  activated() {
    let that = this;
    that.page = 1;
    that.loading = false;
    that.getList(that.page,1);
    that.$store.state.sellArr = [
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
    ];
    that.$store.state.buyArr = [
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
    ];
    that.$store.state.otherArr = [
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--",
      "--"
    ];
    that.name = "--";
    that.price = "";
    that.max = "";
    window.max_time = setInterval(()=>{
      if(that.price){
        that.max = (
                that.$store.state.u_assets.cash / that.price/100
              ).toString().split(".")[0];
      }
    },2000)
  },
  methods: {
    buy(i) {
      let that = this;
      if (that.code && that.price && that.num) {
        if (parseFloat(that.num) > parseFloat(that.max)) {
          that.$message({
            message: "余额不足",
            type: "error",
            duration: 1500
          });
          return false;
        }
        if (i) {
          // 买跌
          that.bool2 = true;
        } else {
          // 买涨
          that.bool1 = true;
        }
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "trade_buy",
              token: that.$store.state.token,
              code: that.code,
              price: that.price,
              number: that.num,
              mold: i
            }
          })
          .then(function(res) {
            if (i) {
              that.bool2 = false;
            } else {
              that.bool1 = false;
            }
            if (res.data.code == 1) {
              that.$message({
                message: res.data.msg,
                type: "success",
                duration: 1500
              });
              that.$store.dispatch("getAssets");
              that.name = "--";
              that.code = "";
              that.price = "";
              that.max = "";
              that.num = "";
            }
          });
      } else {
        that.$message({
          message: "请输入完整信息",
          type: "warning",
          duration: 1500
        });
      }
    },
    select(row, e, col) {
      let that = this;
      this.getInfo(row.short, 1);
      this.formInfo(row.short);
      if (that.$store.state.tlineIf) {
        that.$parent.$refs.tline.time_line(row.short);
      }
      if (that.$store.state.klineIf) {
        that.$parent.$refs.kline.setCurrent(that.$store.state.kline_index);
        that.$parent.$refs.kline.otr = 1;
      }
    },
    getList(p,type) {
      clearInterval(window.bot_stock);
      let that = this;
      if(type){
        that.loading = true;
      }
      that.page = p;
      fun();
       if(that.$store.commit('getIfTrade')){
                
         window.bot_stock = setInterval(()=>{
           fun();
         },2000)
              }
      function fun() {
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "depot_log",
              token: that.$store.state.token,
              page: p,
              num: that.size
            }
          })
          .then(function(res) {
            that.loading = false;
            if (res.data.code == 1) {
              that.sum = Number(res.data.data.page) * Number(that.size);
              if (res.data.data.data) {
                let arr = [];
                let arr_out = [],
                  arr_self = {};
                for (let v of res.data.data.data) {
                  arr.push(v.short);
                  // 处理自我股票
                  if (v.short != that.$store.state.self_short) {
                    arr_out.push(v);
                  } else {
                    arr_self = v;
                  }
                }
                that.getMarket(arr, arr_out, arr_self);
              }
            }
          });
      }
    },

    getMarket(arr, arr0, arr_self) {
      let that = this;
      let self = "";
      let arr1 = [];
      let list = [];
      for (let v of arr) {
        if (v == that.$store.state.self_short) {
          self = v;
        } else {
          arr1.push(v);
        }
      }
      if (self) {
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "detailed"
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              let obj = {};
              let a = res.data.data;
              obj.short = that.$store.state.self_short;
              obj.code = a[0].substr(2);
              obj.name = a[1];
              obj.updown_ = parseFloat((a[4] - a[3]) / a[3]).toFixed(2) + "%";
              obj.price = a[3];
              if(arr_self.mold=="买涨"){
                obj.updown = (parseFloat(a[3] - arr_self.price)*parseFloat(arr_self.number*100)).toFixed(2);
              }else{
                obj.updown = (parseFloat(arr_self.price - a[3])*parseFloat(arr_self.number*100)).toFixed(2);
              }
              obj.price_ = arr_self.price;
              obj.num = arr_self.number;
              obj.type = arr_self.mold;
              obj.time = arr_self.time;
              obj.mold = arr_self.mold;
              list.unshift(obj);
              fun();
            }
          });
      } else {
        fun();
      }
      function fun() {
        $.ajax({
          cache: true,
          url: "http://qt.gtimg.cn/q=" + arr1.toString(),
          type: "GET",
          dataType: "script",
          success: function() {
            for (let i in arr1) {
              let obj = {};
              let a = eval("v_" + arr1[i]).split("~");
              obj.short = (a[2].substr(0,1) == 6) ? "sh" : "sz" + a[2];
              obj.code = a[2];
              obj.name = a[1];
              obj.price = a[3];
              obj.price_ = arr0[i].price;
              obj.num = arr0[i].number;
              if(arr0[i].mold=="买涨"){
                obj.updown = (parseFloat(a[3] - arr0[i].price)*parseFloat(arr0[i].number*100)).toFixed(2);
              }else{
                obj.updown = (parseFloat(arr0[i].price - a[3])*parseFloat(arr0[i].number*100)).toFixed(2);
              }
              obj.updown_ = a[32] + "%";
              obj.type = arr0[i].mold;
              obj.time = arr0[i].time;
              obj.mold = arr0[i].mold;
              list.push(obj);
            }
            that.tableData3 = list;
          }
        });
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 7) {
        if (row.updown > 0) {
          return "red";
        } else if (row.updown < 0) {
          return "green";
        } else {
          return "";
        }
      }
      if (columnIndex == 4) {
        return row.mold == "买涨" ? "red" : "green";
      }
    },
    inputNum(v) {
      let that = this;
      that.$nextTick(function() {
        that.code = v.toString().replace(/[^\d]/g, "");
        if (that.code.length == 6) {
          that
            .$http({
              url: "/",
              method: "post",
              data: {
                nozzle: "query_stock",
                token: that.$store.state.token,
                code: that.code
              }
            })
            .then(function(res) {
              if (res.data.code == 1) {
                if (res.data.data.code == 1) {
                  clearInterval(window.t_other);
                  let short;
                  if (
                    that.$store.state.self_short.substr(0, 2) + that.code !=
                    that.$store.state.self_short
                  ) {
                    short =
                      that.code.slice(0, 1) == 6 ? "sh" : "sz";
                      short+=that.code;
                  } else {
                    short = that.$store.state.self_short;
                  }
                  that.formInfo(short);
                  that.getInfo(short, 1);
                  if (that.$store.state.tlineIf) {
                    that.$parent.$refs.tline.time_line(short);
                  }
                  if (that.$store.state.klineIf) {
                    that.$parent.$refs.kline.setCurrent(
                      that.$store.state.kline_index
                    );
                    that.$parent.$refs.kline.otr = 1;
                  }
                } else {
                  that.$message({
                    message: "未查询到相关股票",
                    type: "warning",
                    duration: 1500
                  });
                }
              }
            });
        } else {
          clearInterval(window.t_other);
          that.$store.state.sellArr = [
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
          ];
          that.$store.state.buyArr = [
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
          ];
          that.$store.state.otherArr = [
            "--",
            "--",
            "--",
            "--",
            "--",
            "--",
            "--",
            "--",
            "--",
            "--",
            "--",
            "--",
            "--",
            "--",
            "--",
            "--",
            "--",
            "--",
            "--"
          ];
          that.name = "--";
          that.price = "";
          that.max = "";
        }
      });
    },
    getInfo(short, source) {
      let that = this;
      clearInterval(window.t_other);
      fun();
       if(that.$store.commit('getIfTrade')){
                
         window.t_other = setInterval(fun, 2000);
              }
      function fun() {
        if (short != that.$store.state.self_short) {
          $.ajax({
            cache: true,
            url: "http://qt.gtimg.cn/q=" + short,
            type: "GET",
            dataType: "script",
            success: function() {
              let a = eval("v_" + short).split("~");
              if (source) {
                that.$store.state.active_stock = {
                  code: that.code,
                  short: short,
                  name: a[1]
                };
              }
              for (let i in that.$store.state.sellArr) {
                that.$store.state.sellArr[i].price = a[27 - i * 2];
                that.$store.state.sellArr[i].number = a[28 - i * 2];
              }
              for (let i in that.$store.state.buyArr) {
                that.$store.state.buyArr[i].price = a[i * 2 + 9];
                that.$store.state.buyArr[i].number = a[i * 2 + 10];
              }
              that.$store.state.otherArr = [
                a[5],
                a[47],
                a[4],
                a[48],
                a[3],
                a[31],
                a[41],
                a[32],
                a[34],
                "--",
                "--",
                a[7],
                a[8],
                a[39],
                "--",
                a[38],
                a[44],
                "--",
                "--"
              ];
            }
          });
        } else {
          that
            .$http({
              url: "/",
              method: "post",
              data: {
                nozzle: "detailed"
              }
            })
            .then(function(res) {
              if (res.data.code == 1) {
                let a = res.data.data;
                if (source) {
                  that.$store.state.active_stock = {
                    code: a[0].substr(2),
                    short: short,
                    name: a[1]
                  };
                }
                for (let i in that.$store.state.sellArr) {
                  that.$store.state.sellArr[i].price = a[30 - i * 2];
                  that.$store.state.sellArr[i].number = a[29 - i * 2];
                }
                for (let i in that.$store.state.buyArr) {
                  that.$store.state.buyArr[i].price = a[12 + i * 2];
                  that.$store.state.buyArr[i].number = a[11 + i * 2];
                }
                that.$store.state.otherArr = [
                  a[2],
                  parseFloat(a[3] + a[3] * 0.1).toFixed(2),
                  a[3],
                  parseFloat(a[3] - a[3] * 0.1).toFixed(2),
                  a[4],
                  a[2],
                  parseFloat(a[4] - a[3]).toFixed(2),
                  a[5],
                  parseFloat((a[4] - a[3]) / a[3] / 100).toFixed(2),
                  "--",
                  "--",
                  "--",
                  "--",
                  "--",
                  "--",
                  "--",
                  "--",
                  "--",
                  "--"
                ];
              }
            });
        }
      }
    },
    formInfo(short) {
      let that = this;
      if (short != that.$store.state.self_short) {
        $.ajax({
          cache: true,
          url: "http://qt.gtimg.cn/q=" + short,
          type: "GET",
          dataType: "script",
          success: function() {
            let a = eval("v_" + short).split("~");
            (that.code = a[2]), (that.name = a[1]);
            that.price = a[3];
            that.max = (
              that.$store.state.u_assets.cash / that.price/100
            ).toString().split(".")[0];
          }
        });
      } else {
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "detailed"
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              let a = res.data.data;
              that.code = a[0].substr(2);
              that.name = a[1];
              that.price = a[4];
              that.max = (
              that.$store.state.u_assets.cash / that.price/100
            ).toString().split(".")[0];
            }
          });
      }
    },
    inputCoin(v) {
      let that = this;
      if (v != "") {
        that.$nextTick(function() {
          that.price = v.toString().match(/\d+\.?\d{0,6}/)[0];
          that.max = (
              that.$store.state.u_assets.cash / that.price/100
            ).toString().split(".")[0];
        });
      } else {
        that.max = "";
      }
    },
    inputCoin1(v) {
      let that = this;
      if (v != "") {
        that.$nextTick(function() {
          that.num = v.toString().replace(/[^\d]/g, '');
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  .form {
    color: #333;
    font-size: 14px;
    float: left;
    width: 226px;
    height: 294px;
    border: 1px solid #ddd;
    border-bottom: 0;
    padding: 8px 12px 0;
    > div {
      line-height: 30px;
      margin-bottom: 8px;
      > div {
        width: calc(100% - 80px);
      }
    }
    > div:last-child {
      padding-top: 16px;
      .span {
        font-size: 12px;
      }
    }
  }
  .bs_deal {
    font-size: 14px;
    margin-left: 6px;
    width: 180px;
    height: 304px;
    border: 1px solid #ddd {
      top: 0px;
      bottom: 0px;
    }
    ul {
      padding: 6px 0 6px;
      border-bottom: 1px solid #ddd;
      li {
        line-height: 22px;
        padding: 0 12px 0;
        > span:first-child {
          margin-right: 10px;
        }
      }
    }
    > div {
      padding: 0 12px 0;
      > div {
        &:first-child {
          padding: 6px 0 6px;
        }
        > span {
          font-size: 16px;
          > span {
            font-size: 14px;
          }
        }
      }
    }
  }
  .list_table {
    width: calc(100% - 447px);
    height: 304px;
    border-left: 1px solid #ddd;
    .d_table {
      height: calc(100% - 56px);
      margin-bottom: 16px;
    }
  }
}
</style>


