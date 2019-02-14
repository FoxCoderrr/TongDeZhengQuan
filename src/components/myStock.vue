<template>
  <div class="stock_wrap" @click="mouseIf=false">
    <div class="stock_table">
      <el-table
        :data="tableData3"
        style="width: 100%"
        :height="t_height"
        empty-text=" "
        @row-click="leftClick"
        @row-dblclick="dbClick"
        @row-contextmenu="rightClick"
        :row-class-name="rowStyle"
        :cell-class-name="cellStyle"
      >
        <el-table-column fixed prop="index" label=" " width="40"></el-table-column>
        <el-table-column fixed prop="code" label="代码" class-name="yellow" width="60"></el-table-column>
        <el-table-column fixed prop="name" label="名称" class-name="yellow"></el-table-column>
        <el-table-column prop="mark" label=" " class-name="purple" width="40"></el-table-column>
        <el-table-column prop="updown_" label="涨跌幅"></el-table-column>
        <el-table-column prop="price" label="现价"></el-table-column>
        <el-table-column prop="updown" label="涨跌额"></el-table-column>
        <el-table-column prop="amount" label="成交金额"></el-table-column>
        <el-table-column prop="hand" label="换手"></el-table-column>
        <el-table-column prop="ratio" label="市盈率"></el-table-column>
        <el-table-column prop="buy" label="买入价"></el-table-column>
        <el-table-column prop="sell" label="卖出价"></el-table-column>
        <el-table-column prop="today" label="今开"></el-table-column>
        <el-table-column prop="yestoday" label="昨收" class-name="white"></el-table-column>
        <el-table-column prop="high" label="最高"></el-table-column>
        <el-table-column prop="low" label="最低"></el-table-column>
        <el-table-column prop="range" label="振幅"></el-table-column>
      </el-table>
    </div>
    <div class="mouse_div" v-if="mouseIf" :style="{left:m_left,top:m_top}">
      <ul>
        <li class="gray">加入自选股&nbsp;&nbsp;&nbsp;insert</li>
        <li class="li" @click="deleteMy">删除自选股&nbsp;&nbsp;&nbsp;del</li>
        <li class="li" @click.stop="toTline">实时走势</li>
        <li class="li" @click.stop="toKline(1)">日线</li>
        <li class="li" @click.stop="toKline(2)">周线</li>
        <li class="li" @click.stop="toKline(3)">月线</li>
      </ul>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
export default {
  data() {
    return {
      m_left: 0,
      m_top: 0,
      page: 0,
      size: 20,
      mouseIf: false,
      t_height: "100%",
      tableData3: [],
      ifSetFirst: true
    };
  },
  mounted() {
    let that = this;
    that.mouseIf = false;
    $(window).resize(function() {});
    that.getList(1);
  },
  activated() {},
  methods: {
    toKline(i) {
      clearInterval(window.top_stock);
      let that = this;
      that.$store.state.speIf = false;
      that.$store.state.source_list = 0;
      that.mouseIf = false;
      that.$store.state.kline_index = i;
      that.$store.state.klineIf = true;
      that.$store.state.tlineIf = false;
      that.$store.state.stockIf = false;
      that.$store.state.stockIf1 = false;
      that.$store.state.sortIf = false;
      that.$store.state.top_h = "calc(100% - 370px)";
    },
    toTline() {
      clearInterval(window.top_stock);
      let that = this;
      that.$store.state.speIf = false;
      that.$store.state.source_list = 1;
      that.mouseIf = false;
      that.$store.state.klineIf = false;
      that.$store.state.tlineIf = true;
      that.$store.state.stockIf = false;
      that.$store.state.stockIf1 = false;
      that.$store.state.sortIf = false;
      that.$store.state.top_h = "calc(100% - 370px)";
    },
    deleteMy() {
      let that = this;
      that.mouseIf = false;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "cancel_concern",
            token: that.$store.state.token,
            code: JSON.stringify([that.$store.state.active_stock.code])
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            that.$message({
              message: res.data.msg,
              type: "success",
              duration: 1500
            });
          }
          let x;
          for (let i in that.tableData3) {
            if (
              that.$store.state.active_stock.code == that.tableData3[i].code
            ) {
              x = i;
              break;
            }
          }
          that.tableData3.splice(x, 1);
          that.$store.state.active_stock = that.tableData3[0];
        });
    },
    getList(firstActive) {
      clearInterval(window.top_stock);
      let that = this;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "concern",
            token: that.$store.state.token
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            if (res.data.data) {
              let arr = [];
              for (let v of res.data.data) {
                arr.push(v.short);
              }
              that.getMarket(arr, firstActive);
              window.top_stock = setInterval(() => {
                that.getMarket(arr, firstActive);
              }, 2000);
            }
          }
        });
    },
    getMarket(arr, firstActive) {
      let that = this;
      let self = "";
      let list = [];
      let arr1 = [];
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
              obj.index = 1;
              obj.code = a[0].substr(2);
              obj.name = a[1];
              obj.updown_ = parseFloat((a[4] - a[3]) / a[3]).toFixed(2) + "%";
              obj.price = a[4];
              obj.updown = parseFloat(a[4] - a[3]).toFixed(2);
              if (a[10] > 10000) {
                if (parseFloat(a[10] % 10000)) {
                  a[10] = parseFloat(a[10] / 10000).toFixed(1);
                } else {
                  a[10] = parseFloat(a[10] / 10000);
                }
                a[10] = parseFloat(a[10]) + "亿";
              } else {
                a[10] = a[10] + "万";
              }
              obj.amount = a[10];
              obj.hand = "--";
              obj.ratio = "--";
              obj.buy = a[7];
              obj.sell = a[22];
              obj.today = a[2];
              obj.yestoday = a[3];
              obj.high = a[5];
              obj.low = a[6];
              obj.range = parseFloat((a[5] - a[6]) / a[3]).toFixed(2) + "%";
              list.unshift(obj);
              fun(2);
            }
          });
      } else {
        fun(1);
      }
      function fun(x) {
        $.ajax({
          cache: true,
          url: "http://qt.gtimg.cn/q=" + arr1.toString(),
          type: "GET",
          dataType: "script",
          success: function() {
            for (let i in arr1) {
              let obj = {};
              let a = eval("v_" + arr1[i]).split("~");
              obj.short = arr1[i];
              obj.index = Number(i) + Number(x);
              obj.code = a[2];
              obj.name = a[1];
              obj.updown_ = a[32] + "%";
              obj.price = a[3];
              obj.updown = a[31];
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
              obj.hand = a[38] + "%";
              obj.ratio = a[39];
              obj.buy = a[9];
              obj.sell = a[19];
              obj.today = a[5];
              obj.yestoday = a[4];
              obj.high = a[33];
              obj.low = a[34];
              obj.range = a[43] + "%";
              list.push(obj);
            }
            that.tableData3 = list;
            if (firstActive && that.ifSetFirst) {
              that.$store.state.active_stock = that.tableData3[0];
              that.ifSetFirst = false;
            }
          }
        });
      }
    },
    rowStyle({ row, rowIndex }) {
      if (this.$store.state.active_stock.code == row.code) {
        return "bg_white";
      } else {
        return "";
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex == 3 ||
        columnIndex == 4 ||
        columnIndex == 5 ||
        columnIndex == 9 ||
        columnIndex == 10 ||
        columnIndex == 11 ||
        columnIndex == 13 ||
        columnIndex == 14
      ) {
        if (row.updown > 0) {
          return "red";
        } else if (row.updown < 0) {
          return "green";
        } else {
          return "white";
        }
      }
    },
    leftClick(row, e, col) {
      e.returnValue = false;
      let that = this;
      that.$store.state.active_stock = row;
      let short0;
      if(row.code!=that.$store.state.self_short.substr(2)){
        short0 =(row.code.slice(0, 1) == 6) ? "sh" : "sz" + row.code;
      }else{
        short0 = that.$store.state.self_short;
      }
      if (that.$route.name == "buy" || that.$route.name == "sell") {
        that.$parent.$refs.bot.getInfo(row.short, 0);
        that.$parent.$refs.bot.formInfo(row.short);
      }
    },
    dbClick(row, e) {
      let that = this;
      that.$store.state.active_stock = row;
      that.$store.state.source_list = 1;
      that.toTline();
    },
    rightClick(row, e) {
      e.returnValue = false;
      let that = this;
      that.mouseIf = true;
      let short0;
      if(row.code!=that.$store.state.self_short.substr(2)){
        short0 =(row.code.slice(0, 1) == 6) ? "sh" : "sz" + row.code;
      }else{
        short0 = that.$store.state.self_short;
      }
      if (that.$route.name == "buy" || that.$route.name == "sell") {
        that.$parent.$refs.bot.getInfo(row.short, 0);
        that.$parent.$refs.bot.formInfo(row.short);
      }
      that.$store.state.active_stock = row;
      that.m_left = that.position(e).left + "px";
      that.m_top = that.position(e).top + "px";
    },
    position(o) {
      let w = $("body").width();
      if (o.screenX + 202 > w) {
        return {
          left: o.x - 202,
          top: o.y
        };
      } else {
        return {
          left: o.x,
          top: o.y
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.stock_wrap {
  height: 100%;
  .stock_table {
    height: 100%;
  }
  .mouse_div {
    position: fixed;
    background: white;
    font-size: 13px;
    border: 1px solid #ccc;
    width: 200px;
    z-index: 999999;
    ul {
      padding: 4px 0 4px;
      li {
        cursor: default;
        line-height: 26px;
        padding-left: 30px;
      }
      .li:hover {
        background: #ebebeb;
      }
    }
  }
}
</style>

