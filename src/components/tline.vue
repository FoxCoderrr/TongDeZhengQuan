<template>
  <div class="wrap" @click="mouseIf=false">
    <div class="info_div" :style="{padding: pad}">
      <span>分时走势</span>
      <span class="yellow">{{$store.state.active_stock.name}}</span>
      <span class="yellow">分时</span>
      <span class="yellow">均价：
        <span>{{avg}}</span>
      </span>
      <span>最新：
        <span v-if="!$store.state.speIf">{{$store.state.otherArr[4]}}</span>
        <span v-if="$store.state.speIf">{{$store.state.otherArr1[4]}}</span>
      </span>
      <span class="f_r red1 c_p mr0" v-if="!fullIf" @click="full">
        <span class="iconfont icon-fangda"></span>放大
      </span>
      <span class="f_r red1 c_p mr0" v-if="fullIf" @click="notFull">
        <span class="iconfont icon-suoxiao"></span>缩小
      </span>
      <span class="f_r red1 c_p" @click="backList">
        <span class="iconfont icon-liebiao2"></span>返回列表
      </span>
    </div>
    <div class="div clearfix">
      <div id="chart" class="f_l" :style="{width:chart_w}" @click.right="rightClick($event)"></div>
      <chart-right v-if="!fullIf" @click.dbclick="chartTool"></chart-right>
    </div>
    <div class="mouse_div" v-if="mouseIf" :style="{left:m_left,top:m_top}">
      <ul>
        <li class="li" @click.stop>加入自选股&nbsp;&nbsp;&nbsp;insert</li>
        <li class="gray" @click.stop>删除自选股&nbsp;&nbsp;&nbsp;del</li>
        <li class="gray" @click.stop>实时走势</li>
        <li class="li" @click.stop="toKline(1)">日线</li>
        <li class="li" @click.stop="toKline(2)">周线</li>
        <li class="li" @click.stop="toKline(3)">月线</li>
      </ul>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import echarts from "echarts";
import chartRight from "./chartRight";
export default {
  data() {
    return {
      avg:"",
      pad:"0 276px 0 66px",
      m_left: 0,
      m_top: 0,
      chart_w: "calc(100% - 200px)",
      mouseIf: false,
      fullIf: false,
      myChart: "",
      activeShort:this.$store.state.active_stock.short,
    };
  },
  components: {
    "chart-right": chartRight
  },
  mounted() {
    let that = this;
    that.time_line(that.$store.state.active_stock.short);
  },
  activated() {
    let that = this;
  },
  methods: {
    chartTool(){
      // this.myChart.dispatchAction({
      //     type: 'hideTip',
      // })
    },
    backList(){
      clearInterval(window.top_stock);
      this.$parent.toHome(0);
    },
    toKline(i) {
      let that = this;
      that.$store.state.kline_index = i;
      that.$store.state.klineIf = true;
      that.$store.state.tlineIf = false;
      that.$store.state.stockIf = false;
      that.$store.state.stockIf1 = false;
      that.$store.state.sortIf = false;
      that.$store.state.top_h = "calc(100% - 370px)";
    },
    rightClick(e) {
      let that = this;
      that.mouseIf = true;
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
    },
    full() {
      this.fullIf = true;
      this.chart_w = "100%";
      this.pad = "0 76px 0 66px"
      this.$nextTick(() => {
        this.myChart.resize();
        // 手动触发window resize事件
        // var myEvent = new Event('resize');
        // window.dispatchEvent(myEvent);
      });
    },
    notFull() {
      this.fullIf = false;
      this.chart_w = "calc(100% - 200px)";
      this.pad = "0 276px 0 66px"
      this.$nextTick(() => {
        this.myChart.resize();
        // 手动触发window resize事件
        // var myEvent = new Event('resize');
        // window.dispatchEvent(myEvent);
      });
    },
    time_line(short) {
      let that = this;
      if(short==that.$store.state.self_short){
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "time_sharing",
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              that.time_line_k(res.data.data.data, 0,res.data.data.info);
            }
          });
      }else{
        $.get(
          "http://web.ifzq.gtimg.cn/appstock/app/minute/query",
          {
            _var: "min_data_" + short,
            code: short
          },
          function(rawData) {
            that.time_line_k(rawData, short,0);
          }
        );
      }
    },

    time_line_k(rawData, short,info) {
      let that = this;
      that.myChart = echarts.init(document.getElementById("chart"));
      window.onresize = that.myChart.resize;
      var rate_min, rate_max, price_min, price_max;
      var rate_int, price_int;
      if(short==0){
        var arr = rawData;
        var yesterday = info.close;
        var up_amplitude = Math.abs(((info.highest - yesterday) / yesterday) * 100);
        var down_amplitude = Math.abs(((info.lowest - yesterday) / yesterday) * 100);
      }else{
        var arr = $.parseJSON(rawData.slice(18)).data[short]["data"]["data"];
        var info = $.parseJSON(rawData.slice(18)).data[short]["qt"][short];
        var yesterday = parseFloat(info[4]);
        var up_amplitude = Math.abs(((info[33] - yesterday) / yesterday) * 100);
        var down_amplitude = Math.abs(((info[34] - yesterday) / yesterday) * 100);
      }
      var data = that.split_data(arr, yesterday);
      that.avg = data.average[data.average.length-1];
      var max = 0;
        for (var i = 1; i < data["number"].length; i++) {
          var cur = data["number"][i];
          cur > max ? (max = cur) : 0;
        }
      var up_down =
        up_amplitude > down_amplitude ? up_amplitude : down_amplitude;
      rate_min = -up_down;
      rate_max = Math.abs(up_down);
      rate_int = up_down / 4;
      price_min = yesterday * (1 + rate_min / 100);
      price_max = yesterday * (1 + rate_max / 100);
      price_int = (yesterday * rate_int) / 100;
      var option = {
        animation: false,
        tooltip: {
          show: true,
          trigger: "none",
          axisPointer: {
            type: "cross",
            lineStyle: { type: "solid", color: "#777" },
            crossStyle: { type: "solid", color: "#777" },
            label: {
              show: true,
              precision: 2,
              backgroundColor: "#000080",
              borderColor: "#ff3232",
              borderWidth: 1,
              shadowBlur: 0
            }
          },
          backgroundColor: "rgba(0, 0, 0)",
          borderWidth: 1,
          borderColor: "#B00000",
          padding: [10, 2],
          textStyle: { color: "#FFF", fontSize: 12 },
          position: [0, 6],
          formatter: function(params) {
            return that.timeLine(params, yesterday);
          },
          crossStyle: { opacity: 1 }
        },
        axisPointer: {
          link: { xAxisIndex: "all" },
          label: { backgroundColor: "#777" }
        },
        grid: [
          { left: "66px", right: "76px", top: "2%", height: "60%" },
          { left: "66px", right: "76px", top: "62%", height: "31%" }
        ],
        xAxis: [
          {
            nameLocation: "center",
            nameTextStyle: { color: "#FFF" },
            type: "category",
            data: data.times,
            boundaryGap: false,
            scale: true,
            min: 0,
            max: 240,
            axisTick: { show: false, interval: 29 },
            axisLabel: { show: false, interval: 29 },
            axisLine: { show: true, lineStyle: { color: "#B00000", width: 2 } },
            splitLine: {
              show: true,
              lineStyle: { color: ["#B00000"], opacity: 1, type: "dotted" }
            },
            splitArea: { show: false },
            axisPointer: { show: true, label: { show: false } }
          },
          {
            type: "category",
            data: data.times,
            scale: true,
            boundaryGap: false,
            min: 0,
            max: 240,
            gridIndex: 1,
            axisTick: { show: false, interval: 29 },
            axisLabel: {
              show: true,
              interval: 29,
              textStyle: { color: "#ff3232", fontSize: 13 },
              formatter: function(value, index) {
                return that.axis_label(index);
              }
            },
            axisLine: { show: true, lineStyle: { color: "#B00000" } },
            splitLine: {
              show: true,
              lineStyle: { color: ["#B00000"], opacity: 1, type: "dotted" }
            },
            splitArea: { show: false }
          }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            gridIndex: 0,
            // min: (yesterday * (1 - down_v / 100)).toFixed(2),
            // max: (yesterday * (1 + down_v / 100)).toFixed(2),
            // interval: (yesterday * down_v / 4 / 100),
            min: price_min,
            max: price_max,
            interval: price_int,
            position: "left",
            splitLine: {
              show: true,
              lineStyle: { color: ["#B00000"], opacity: 1 }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: function(value) {
                  return that.axis_label_text_style(value, yesterday);
                }
              }
            },
            axisTick: { show: true },
            axisLabel: {
              true: true,
              formatter: function(value) {
                return value.toFixed(2);
              }
            },
            splitArea: { show: false },
            axisPointer: { show: true, label: { show: true } }
          },
          {
            type: "value",
            scale: true,
            boundaryGap: true,
            gridIndex: 1,
            position: "right",
            max: max,
            min: 0,
            interval: max / 4,
            axisLabel: {
              textStyle: { color: "#F0F888" },
              formatter: function(value) {
                return value == 0 || value == max ? "" : value - (value % 10);
              }
            },
            splitLine: {
              show: true,
              lineStyle: { color: ["#B00000"], opacity: 1 }
            },
            axisLine: { show: true, lineStyle: { color: "#B00000" } },
            axisTick: { show: true },
            splitArea: { show: false },
            axisPointer: { show: true, label: { show: true, precision: 0 } }
          },
          {
            type: "value",
            scale: true,
            gridIndex: 0,
            min: rate_min,
            max: rate_max,
            maxInterval: rate_int,
            splitLine: {
              show: false,
              lineStyle: { color: ["#F2F2F2"], opacity: 1 }
            },
            axisLine: { show: true, lineStyle: { color: "#B00000" } },
            axisTick: { show: false },
            axisLabel: {
              show: true,
              textStyle: {
                color: function(value) {
                  return that.axis_label_text_style(value, 0);
                }
              },
              formatter: function(value) {
                return value >= 0
                  ? "+" + value.toFixed(2) + "%"
                  : "-" + (-value).toFixed(2) + "%";
              }
            },
            splitArea: { show: false },
            axisPointer: { show: true, label: { show: false } }
          },
          {
            type: "value",
            scale: true,
            gridIndex: 1,
            splitLine: {
              show: false,
              lineStyle: { color: ["#F2F2F2"], opacity: 1 }
            },
            axisLine: { show: true, lineStyle: { color: "#B00000" } },
            axisTick: { show: false },
            axisLabel: {
              show: true,
              textStyle: {
                color: function(value) {
                  if (value > 0) {
                    return "#ff3232";
                  } else if (value == 0) {
                    return "#000";
                  } else {
                    return "#17A63A";
                  }
                }
              },
              formatter: function(value) {
                return value >= 0
                  ? value.toFixed(2) + "%"
                  : (-value).toFixed(2) + "%";
              }
            },
            splitArea: { show: false }
          }
        ],
        series: [
          {
            name: "现价",
            type: "line",
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: data.price,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: { width: 1, color: "#FAFAFA" }
            }
          },
          {
            name: "交易量",
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            barMaxWidth: "1px",
            data: that.af(data.number),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: { width: 1, color: "#FAFAFA" }
            }
          },
          {
            name: "均价",
            type: "line",
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: data.average,
            smooth: true,
            symbol: "none",
            lineStyle: {
              normal: { width: 1, color: "#fbff5d" }
            },
            sampling: "average"
          },
          {
            name: "均量",
            type: "line",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: data.average_num,
            smooth: true,
            symbol: "none",
            lineStyle: { normal: { width: 1, color: "#FFF" } },
            sampling: "average"
          }
        ]
      };
      that.myChart.clear(option, true);
      that.myChart.setOption(option, true);
    },
    time_data(time) {
      let that = this;
      var amDate = new Date(time * 1000);
      return (
        that.getzf(amDate.getHours()) + ":" + that.getzf(amDate.getMinutes())
      );
    },

    af(data) {
      var result = [],
        i;
      for (i = 0; i < data.length; i++) {
        var html = "";
        // var x = data[i] - data[i - 1];
        html = { value: data[i], itemStyle: { normal: { color: "#F0F888" } } };
        // if (x > 0) {
        //     html = {value: data[i] / 10000, itemStyle: {normal: {color: "#D91A2A"}}};
        // } else {
        //     html = {value: data[i] / 10000, itemStyle: {normal: {color: "#17A63A"}}};
        // }
        result.push(html);
      }
      return result;
    },

    timeLine(params, yesterday) {
      let that = this;
      var times = "";
      var price = 0,
        average = 0,
        number = 0;
      $.each(params, function(i, item) {
        if (i == 0) {
          times = item.name;
        }
        if (item.seriesName == "现价") {
          price = item.value;
        } else if (item.seriesName == "均价") {
          average = item.value;
        } else if (item.seriesName == "交易量") {
          number = item.value;
        }
      });
      var ran = price - yesterday;
      var color = that.axis_label_text_style(ran, 0);
      return (
        "<div><span>时间：</span><b>" +
        times +
        "</b></div>" +
        '<div><span>价位：</span><b style="color: ' +
        color +
        '">' +
        price +
        "</b></div>" +
        '<div><span>均价：</span><b style="color: ' +
        color +
        '">' +
        average +
        "</b></div>" +
        '<div><span>涨跌：</span><b style="color: ' +
        color +
        '">' +
        ran.toFixed(2) +
        "</b></div>" +
        '<div><span>涨幅：</span><b style="color: ' +
        color +
        '">' +
        ((ran / yesterday) * 100).toFixed(2) +
        "%</b></div>" +
        '<div><span>成交量：</span><b style="color:#F0F888">' +
        number.toFixed(0) +
        "</b></div>" +
        '<div><span>成交额：</span><b style="color:#F0F888">' +
        ((number * average) / 100).toFixed(1) +
        "万</b></div>"
      );
    },

    //补0操作
    getzf(num) {
      if (parseInt(num) < 10) {
        num = "0" + num;
      }
      return num;
    },

    /**
     * 数据处理
     * @param rawData
     * @param yesterday
     * @returns {{data: Array, price: Array, number: Array, times: Array|*, average: Array, average_num: Array, rates: Array, increase: Array}}
     */
    split_data(rawData, yesterday) {
      let that = this;
      var datas = [],
        number = [],
        price = [],
        times,
        average = [],
        average_num = [],
        rates = [],
        increase = [];
      var num = 0,
        arr_up;
      var price_total = 0,
        num_total = 0;
      for (var i = 0; i < rawData.length; i++) {
        var arr = rawData[i].split(" ");
        if (i > 0) {
          arr_up = rawData[i - 1].split(" ");
          num = parseFloat(arr[2]) - parseFloat(arr_up[2]);
        } else {
          num = parseFloat(arr[2]);
        }
        if (i != 121) {
          number.push(num);
          price.push(parseFloat(arr[1]).toFixed(2));
        }
        datas.push(arr);
        increase.push((arr[1] - yesterday).toFixed(2));
        rates.push((((arr[1] - yesterday) / yesterday) * 100).toFixed(2));
        price_total += parseFloat(arr[1]);
        num_total = parseFloat(arr[2]);
        average.push((price_total / (i + 1)).toFixed(2));
        average_num.push((num_total / (i + 1)).toFixed(0));
      }
      times = that.date_time();
      return {
        data: datas,
        price: price,
        number: number,
        times: times,
        average: average,
        average_num: average_num,
        rates: rates,
        increase: increase
      };
    },

    /**
     * X轴标文本样式
     * @param value
     * @param num
     * @returns {string}
     */
    axis_label_text_style(value, num) {
      value = Math.round(value * 100) / 100;
      num = Math.round(num * 100) / 100;
      if (value > num) {
        return "#ff3232";
      } else if (value == num) {
        return "#FFFFFF";
      } else {
        return "#00e600";
      }
    },

    /**
     * X轴标时间处理
     * @param index
     * @returns {*}
     */
    axis_label(index) {
      let that = this;
      var today = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
      var am1 = today + 9.5 * 3600,
        am11 = today + 10 * 3600,
        am2 = today + 10.5 * 3600,
        am21 = today + 10 * 3600,
        am3 = today + 11.5 * 3600;
      var pm1 = today + 13 * 3600,
        pm11 = today + 13.5 * 3600,
        pm2 = today + 14 * 3600,
        pm21 = today + 14.5 * 3600,
        pm3 = today + 15 * 3600;
      var x;
      if (index == 0) {
        x = that.time_data(am1);
      } else if (index == 30) {
        x = that.time_data(am11);
      } else if (index == 60) {
        x = that.time_data(am2);
      } else if (index == 90) {
        x = that.time_data(am21);
      } else if (index == 120) {
        x = that.time_data(am3); //+ '/' + time_data(pm1)
      } else if (index == 150) {
        x = that.time_data(pm11);
      } else if (index == 180) {
        x = that.time_data(pm2);
      } else if (index == 210) {
        x = that.time_data(pm21);
      } else if (index == 240) {
        x = that.time_data(pm3);
      }
      return x;
    },

    /**
     * 开市时间
     * @returns {Array}
     */
    date_time() {
      let that = this;
      var today = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
      var i,
        times = [];
      var am1 = today + 9.5 * 3600,
        pm1 = today + 13 * 3600;
      for (i = 0; i <= 120; i++) {
        times.push(that.time_data(am1 + i * 60));
      }
      for (i = 1; i <= 120; i++) {
        times.push(that.time_data(pm1 + i * 60));
      }
      return times;
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .info_div {
    height: 24px;
    color: white;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    > span {
      display: inline-block;
      margin-right: 6px;
      font-size: 16px;
      > span {
        font-size: 14px;
      }
    }
    > span:first-child {
      font-size: 14px;
      color: #c0c0c0;
      padding-top: 14px;
    }
    > span:nth-child(4) {
      margin-right: 18px;
    }
    > .f_r {
      font-size: 14px;
      transform: translateY(14px);
      margin-right: 10px;
      .iconfont {
        font-size: 15px;
        margin-right: 2px;
      }
    }
    .mr0 {
      margin: 0;
    }
  }
  .div {
    height: calc(100% - 24px);
  }
  #chart {
    box-sizing: border-box;
    height: 100%;
  }
  .right_div {
    width: 198px;
    height: 100%;
    border: 1px solid #b00000;
    border-bottom: 0;
    .d_title {
      color: #01daeb;
      border-bottom: 1px solid #b00000;
      padding: 2px 0 2px;
      font-size: 15px;
    }
    .d_con {
      color: #c0c0c0;
      height: calc(100% - 25px);
      font-size: 14px;
      .d1 {
        box-sizing: border-box;
        padding: 0 2px 0;
        line-height: 20px;
        border-bottom: 1px solid #b00000;
        > span {
          width: 50%;
          box-sizing: border-box;
          > span:first-child {
            font-size: 15px;
          }
        }
        > span:first-child {
          padding-right: 1px;
        }
        > span:last-child {
          padding-left: 1px;
        }
      }
      .d_list {
        overflow: auto;
        position: relative;
        height: calc(100% - 21px);
        ul {
          border-bottom: 1px solid #b00000;
          li {
            line-height: 18px;
            > span {
              width: 50%;
              box-sizing: border-box;
              padding: 0 2px 0;
              > span:last-child {
                font-size: 15px;
              }
            }
          }
        }
        .ul1 {
          li {
            > span {
              > span:first-child {
                font-size: 15px;
              }
            }
          }
        }
        .d_menu {
          position: absolute;
          bottom: 0;
          left: 0;
          border-top: 1px solid #b00000;
          border-right: 1px solid #b00000;
          overflow: hidden;
          > span {
            float: left;
            padding: 1px 4px 1px;
          }
          > span:first-child {
            border-right: 1px solid #b00000;
          }
        }
      }
    }
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

