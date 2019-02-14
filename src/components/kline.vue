<template>
  <div class="wrap" @click="mouseIf=false">
    <div class="info_div" :style="{padding: pad}">
      <span>{{$store.state.active_stock.name}}(日线)</span>
      <span class="white">MA5:{{ma5}}</span>
      <span class="yellow">MA10:{{ma10}}</span>
      <span class="purple">MA20:{{ma20}}</span>
      <span class="green">MA60:{{ma60}}</span>
      
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
      <div class="f_l" :style="{width:chart_w}" @click.right="rightClick($event)">
        <div id="chart"></div>
        <div class="tip1">
          <span class="white">VOLUME:{{vol}}</span>
          <span class="white">MA5:{{ma_5}}</span>
          <span class="yellow">MA10:{{ma_10}}</span>
        </div>
        <div class="tip2">
          <div v-if="otr==1">
            <span class="purple">MACD</span>
            <span class="white">DIF:{{b}}</span>
            <span class="yellow">DEA:{{c}}</span>
          </div>
          <div v-if="otr==2">
            <span class="purple">RSI</span>
            <span class="white">RSI6:{{a}}</span>
            <span class="yellow">RSI12:{{b}}</span>
            <span class="green">RSI24:{{c}}</span>
          </div>
          <div v-if="otr==3">
            <span class="purple">KDJ</span>
            <span class="white">K:{{a}}</span>
            <span class="yellow">D:{{b}}</span>
            <span class="green">J:{{c}}</span>
          </div>
        </div>
        <div class="x_line"></div>
        <div class="other">
          <span class="c_p" :class="{active:otr==1}" @click="other(1)">MACD</span>
          <span class="c_p" :class="{active:otr==2}" @click="other(2)">RSI</span>
          <span class="c_p" :class="{active:otr==3}" @click="other(3)">KDJ</span>
        </div>
      </div>
      <chart-right v-if="!fullIf"></chart-right>
    </div>
    <div class="mouse_div" v-if="mouseIf" :style="{left:m_left,top:m_top}">
      <ul>
        <li class="li" @click.stop>加入自选股&nbsp;&nbsp;&nbsp;insert</li>
        <li class="gray" @click.stop>删除自选股&nbsp;&nbsp;&nbsp;del</li>
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
import echarts from "echarts";
import chartRight from "./chartRight";
export default {
  data() {
    return {
      current: 1,
      pad: "0 220px 0 66px",
      m_left: 0,
      m_top: 0,
      chart_w: "calc(100% - 200px)",
      mouseIf: false,
      fullIf: false,
      myChart: "",
      option: "",
      otr: 1,
      ma5: "",
      ma10: "",
      ma20: "",
      ma60: "",
      vol: "",
      ma_5: "",
      ma_10: "",
      a: "",
      b: "",
      c: ""
    };
  },
  components: {
    "chart-right": chartRight
  },
  mounted() {
    let that = this;
    that.setCurrent(that.$store.state.kline_index);
  },
  activated() {
    let that = this;
  },
  methods: {
    backList() {
      clearInterval(window.top_stock);
      this.$parent.toHome(0);
    },
    toKline(i) {
      let that = this;
      that.mouseIf = false;
      that.$store.state.kline_index = i;
      that.setCurrent(i);
    },
    toTline() {
      let that = this;
      that.$store.state.klineIf = false;
      that.$store.state.tlineIf = true;
      that.$store.state.stockIf = false;
      that.$store.state.stockIf1 = false;
      that.$store.state.sortIf = false;
      that.$store.state.top_h = "calc(100% - 370px)";
    },
    other(i) {
      let that = this;
      if (i == that.otr) {
        return false;
      }
      if (that.otr == 1) {
        that.myChart.dispatchAction({
          type: "legendUnSelect",
          name: "MACD"
        });
        that.myChart.dispatchAction({
          type: "legendUnSelect",
          name: "DIF"
        });
        that.myChart.dispatchAction({
          type: "legendUnSelect",
          name: "DEA"
        });
      } else if (that.otr == 2) {
        that.myChart.dispatchAction({
          type: "legendUnSelect",
          name: "RSI6"
        });
        that.myChart.dispatchAction({
          type: "legendUnSelect",
          name: "RSI12"
        });
        that.myChart.dispatchAction({
          type: "legendUnSelect",
          name: "RSI24"
        });
      } else {
        that.myChart.dispatchAction({
          type: "legendUnSelect",
          name: "k_value"
        });
        that.myChart.dispatchAction({
          type: "legendUnSelect",
          name: "d_value"
        });
        that.myChart.dispatchAction({
          type: "legendUnSelect",
          name: "j_value"
        });
      }
      that.otr = i;
      if (i == 1) {
        that.myChart.dispatchAction({
          type: "legendSelect",
          name: "MACD"
        });
        that.myChart.dispatchAction({
          type: "legendSelect",
          name: "DIF"
        });
        that.myChart.dispatchAction({
          type: "legendSelect",
          name: "DEA"
        });
      } else if (i == 2) {
        that.myChart.dispatchAction({
          type: "legendSelect",
          name: "RSI6"
        });
        that.myChart.dispatchAction({
          type: "legendSelect",
          name: "RSI12"
        });
        that.myChart.dispatchAction({
          type: "legendSelect",
          name: "RSI24"
        });
      } else {
        that.myChart.dispatchAction({
          type: "legendSelect",
          name: "k_value"
        });
        that.myChart.dispatchAction({
          type: "legendSelect",
          name: "d_value"
        });
        that.myChart.dispatchAction({
          type: "legendSelect",
          name: "j_value"
        });
      }
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
      this.pad = "0 20px 0 66px";
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
      this.pad = "0 220px 0 66px";
      this.$nextTick(() => {
        this.myChart.resize();
        // 手动触发window resize事件
        // var myEvent = new Event('resize');
        // window.dispatchEvent(myEvent);
      });
    },
    //切换K线方式函数
    setCurrent(params) {
      let that = this;
      that.data_line = [];
      that.current = params;
      that.short = that.$store.state.active_stock.short;
      var url;
      if (that.current == 1) {
        //日K
        url = "http://web.ifzq.gtimg.cn/appstock/app/kline/kline";
        that.k_line(url, "kline_day", that.short, "day", 10);
      } else if (that.current == 2) {
        //周K
        url = "http://web.ifzq.gtimg.cn/appstock/app/kline/kline";
        that.k_line(url, "kline_week", that.short, "week", 11);
      } else if (that.current == 3) {
        //月K
        url = "http://web.ifzq.gtimg.cn/appstock/app/kline/kline";
        that.k_line(url, "kline_month", that.short, "month", 12);
      } else if (that.current == 7) {
        //30分钟
        url = "http://ifzq.gtimg.cn/appstock/app/kline/mkline";
        that.k_line(url, "m30_today", that.short, "m30", 10);
      } else if (that.current == 8) {
        //60分钟
        url = "http://ifzq.gtimg.cn/appstock/app/kline/mkline";
        that.k_line(url, "m60_today", that.short, "m60", 10);
      } else if (that.current == 5) {
        //5分钟
        url = "http://ifzq.gtimg.cn/appstock/app/kline/mkline";
        that.k_line(url, "m5_today", that.short, "m5", 9);
      } else if (that.current == 6) {
        //15分钟
        url = "http://ifzq.gtimg.cn/appstock/app/kline/mkline";
        that.k_line(url, "m15_today", that.short, "m15", 10);
      } else if (that.current == 4) {
        //1分钟
        url = "http://ifzq.gtimg.cn/appstock/app/kline/mkline";
        that.k_line(url, "m1_today", that.short, "m1", 9);
      } else {
        //		that.time_line(that.short);
      }
    },
    k_line(url, vars, short, type, str_num) {
      let that = this;
      if (short == that.$store.state.self_short) {
        // let t;
        // if (type == "day") {
        //   t = "100";
        // } else if (type == "week") {
        //   t = "200";
        // } else {
        //   t = "300";
        // }
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "k_line",
              type: 100
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              let arr = res.data.data;
              if(type=="week"){
                arr = that.weekData(arr);
              }else if(type=="month"){
                arr = that.monthData(arr);
              }

              arr = that.macd_index(arr);
              arr = that.boll_index(arr);
              arr = that.bbi_index(arr);
              arr = that.kdj_index(arr);
              var data = that.splitData(arr);
              var startValue = data.times.length - 120;
              var endValue = data.times.length - 1;
              that.line(data, startValue, endValue, 0, 0, 0, 0);
              that.data = data;
            }
          });
      } else {
        $.get(
          url,
          {
            _var: vars,
            param: short + "," + type + ",,,480,"
          },
          function(rawData) {
            var arr = $.parseJSON(rawData.slice(str_num)).data[short][type];
            arr = that.macd_index(arr);
            arr = that.boll_index(arr);
            arr = that.bbi_index(arr);
            arr = that.kdj_index(arr);
            var data = that.splitData(arr);
            var startValue = data.times.length - 120;
            var endValue = data.times.length - 1;
            that.line(data, startValue, endValue, vars, short, type, str_num);
            that.data = data;
          }
        );
      }
    },
    line(data, start, end, vars, short, type, str_num) {
      let that = this;
      that.myChart = echarts.init(document.getElementById("chart"));
      window.onresize = that.myChart.resize;
      that.option = {
        title: {
          show: false
        },
        animation: false,
        legend: {
          show: false,
          selected: {
            k_value: false,
            d_value: false,
            j_value: false,
            RSI6: false,
            RSI12: false,
            RSI24: false
          }
        },
        tooltip: {
          color: [],
          show: true,
          trigger: "axis",
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
          textStyle: {
            color: "#FFF",
            fontSize: 12
          },
          position: [0, 0],
          formatter: function(params) {
            that.a = params[8].value;
            that.b = params[9].value;
            that.c = params[10].value;
            if (params[0].seriesIndex == 0) {
              that.ma5 = params[1].value;
              that.ma10 = params[2].value;
              that.ma20 = params[3].value;
              that.ma60 = params[4].value;
              that.vol = params[5].value;
              that.ma_5 = params[6].value;
              that.ma_10 = params[7].value;
            } else if (params[0].seriesIndex == 5) {
              that.vol = params[0].value;
              that.ma_5 = params[1].value;
              that.ma_10 = params[2].value;
              that.ma5 = params[4].value;
              that.ma10 = params[5].value;
              that.ma20 = params[6].value;
              that.ma60 = params[7].value;
            } else {
              that.ma5 = params[4].value;
              that.ma10 = params[5].value;
              that.ma20 = params[6].value;
              that.ma60 = params[7].value;
              that.vol = params[8].value;
              that.ma_5 = params[9].value;
              that.ma_10 = params[10].value;
            }
          },
          crossStyle: {
            opacity: 1
          }
        },
        axisPointer: {
          link: {
            xAxisIndex: "all"
          },
          label: {
            backgroundColor: "#777"
          }
        },
        grid: [
          {
            left: "66px",
            right: "20px",
            top: "2%",
            height: "45%"
          },
          {
            left: "66px",
            right: "20px",
            top: "47%",
            height: "22%"
          },
          {
            left: "66px",
            right: "20px",
            top: "69%",
            height: "22%"
          }
        ],
        xAxis: [
          {
            type: "category",
            gridIndex: 0,
            data: data.times,
            scale: true,
            boundaryGap: true,
            min: "dataMin",
            max: "dataMax",
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              showMaxLabel: true,
              showMinLabel: true
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#B00000"
              }
            },
            splitLine: {
              show: true,
              lineStyle: { color: ["#B00000"], opacity: 1, type: "dotted" }
            },
            splitArea: {
              show: false
            },
            axisPointer: {
              show: true,
              label: {
                show: false
              }
            }
          },
          {
            type: "category",
            gridIndex: 1,
            data: data.times,
            scale: true,
            boundaryGap: true,
            min: "dataMin",
            max: "dataMax",
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              showMaxLabel: true,
              showMinLabel: true
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#B00000"
              }
            },
            splitLine: {
              show: true,
              lineStyle: { color: ["#B00000"], opacity: 1, type: "dotted" }
            },
            splitArea: {
              show: false
            },
            axisPointer: {
              show: true,
              label: {
                show: false
              }
            }
          },
          {
            type: "category",
            gridIndex: 2,
            data: data.times,
            scale: true,
            boundaryGap: true,
            min: "dataMin",
            max: "dataMax",
            axisTick: {
              show: false
            },
            axisLabel: {
              true: true,
              color: "#ff3232"
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#B00000",
                type: "dotted"
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#B00000"],
                opacity: 1,
                type: "dotted"
              }
            },
            splitArea: {
              show: false
            },
            axisPointer: {
              show: true,
              label: {
                show: true
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            gridIndex: 0,
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#B00000"],
                opacity: 1,
                type: "dotted"
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: ["#FF0000"],
                opacity: 1,
                type: "solid"
              }
            },
            axisLabel: {
              true: true,
              color: "#ff3232"
            },
            axisTick: {
              show: true
            },
            splitArea: {
              show: false
            },
            axisPointer: {
              show: true,
              label: {
                show: true
              }
            }
          },
          {
            type: "value",
            scale: true,
            gridIndex: 1,
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#B00000"],
                opacity: 1,
                type: "dotted"
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: ["#FF0000"],
                opacity: 1,
                type: "solid"
              }
            },
            axisLabel: {
              show: true,
              color: "#ff3232",
              inside: false
            },
            axisTick: {
              show: true
            },
            splitArea: {
              show: false
            },
            axisPointer: {
              show: true,
              label: {
                show: true
              }
            }
          },
          {
            type: "value",
            scale: true,
            gridIndex: 2,
            splitLine: {
              show: false,
              lineStyle: {
                color: ["#B00000"],
                opacity: 1,
                type: "dotted"
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: ["#FF0000"],
                opacity: 1,
                type: "solid"
              }
            },
            axisLabel: {
              show: true,
              color: "#ff3232",
              inside: false
            },
            axisTick: {
              show: true
            },
            splitArea: {
              show: false
            },
            axisPointer: {
              show: true,
              label: {
                show: true
              }
            }
          },
          {
            type: "value",
            scale: true,
            gridIndex: 0,
            position: "right",
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#B00000"],
                opacity: 1,
                type: "dotted"
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: ["#FF0000"],
                opacity: 1,
                type: "solid"
              }
            },
            axisTick: {
              show: true
            },
            axisLabel: {
              true: true,
              color: "#ff3232"
            },
            splitArea: {
              show: false
            },
            axisPointer: {
              show: true,
              label: {
                show: true
              }
            }
          },
          {
            type: "value",
            scale: true,
            gridIndex: 1,
            position: "right",
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#B00000"],
                opacity: 1,
                type: "dotted"
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: ["#FF0000"],
                opacity: 1,
                type: "solid"
              }
            },
            axisTick: {
              show: true
            },
            axisLabel: {
              true: true,
              color: "#ff3232"
            },
            splitArea: {
              show: false
            },
            axisPointer: {
              show: false
            }
          },
          {
            type: "value",
            scale: true,
            gridIndex: 2,
            position: "right",
            splitLine: {
              show: false,
              lineStyle: {
                color: ["#B00000"],
                opacity: 1,
                type: "solid"
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: ["#FF0000"],
                opacity: 1,
                type: "solid"
              }
            },
            axisTick: {
              show: true
            },
            axisLabel: {
              true: true,
              color: "#ff3232"
            },
            splitArea: {
              show: false
            },
            axisPointer: {
              show: false
            }
          }
        ],
        dataZoom: [
          {
            show: false,
            type: "inside",
            xAxisIndex: [0, 0],
            startValue: start,
            endValue: end,
            // zoomLock: true
          },
          {
            show: false,
            type: "inside",
            xAxisIndex: [0, 1],
            startValue: start,
            endValue: end,
            // zoomLock: true
          },
          {
            show: false,
            type: "inside",
            xAxisIndex: [0, 2],
            startValue: start,
            endValue: end,
            // zoomLock: true
          }
        ],
        series: [
          {
            name: "K线表",
            type: "candlestick",
            data: data.datas,
            itemStyle: {
              color: "#000000",
              color0: "#00F0F0",
              borderColor: "#FF0000",
              borderColor0: "#00F0F0"
            },
            markPoint: {
              symbol: "pin",
              symbolSize: [10, 10],
              label: {
                color: "#FFFFFF"
              },
              data: [
                {
                  type: "max",
                  name: "最大值",
                  symbolOffset: [10, -10]
                },
                {
                  type: "min",
                  name: "最小值",
                  symbolOffset: [10, 10]
                }
              ]
            }
          },
          {
            name: "MA5",
            type: "line",
            data: that.calculateMA(data, 5),
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            smooth: true,
            lineStyle: { color: "#FFFFFF" }
          },
          {
            name: "MA10",
            type: "line",
            data: that.calculateMA(data, 10),
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            smooth: true,
            lineStyle: { color: "#FFFF00" }
          },
          {
            name: "MA20",
            type: "line",
            data: that.calculateMA(data, 20),
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            smooth: true,
            lineStyle: { color: "#CD0066" }
          },
          {
            name: "MA60",
            type: "line",
            data: that.calculateMA(data, 60),
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            smooth: true,
            lineStyle: { color: "#e016be" }
          },
          {
            name: "交易量",
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: data.vols,
            itemStyle: {
              color: function(params) {
                var data_h = data.datas[params.dataIndex];
                return data_h[1] > data_h[0] ? "#000000" : "#00F0F0";
              },
              borderColor: function(params) {
                var data_h = data.datas[params.dataIndex];
                return data_h[1] > data_h[0] ? "#FF0000" : "#00F0F0";
              }
            }
          },
          {
            name: "MA5",
            type: "line",
            data: that.numberMA(data, 5),
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            smooth: true,
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle: { color: "#FFFFFF" }
          },
          {
            name: "MA10",
            type: "line",
            data: that.numberMA(data, 10),
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            smooth: true,
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle: { color: "#FFFF00" }
          },
          {
            name: "MACD",
            type: "bar",
            xAxisIndex: 2,
            yAxisIndex: 2,
            // smooth: true,
            symbol: "none",
            data: data.macd,
            barWidth: 1,
            itemStyle: {
              color: function(params) {
                return params.data >= 0 ? "#FF0000" : "#00F0F0";
              }
            }
          },
          {
            name: "DIF",
            type: "line",
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: data.dif,
            // smooth: true,
            symbol: "none",
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            lineStyle: {
              color: "#FFFF00"
            }
          },
          {
            name: "DEA",
            type: "line",
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: data.dea,
            // smooth: true,
            symbol: "none",
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            lineStyle: {
              color: "#FFFFFF"
            }
          },
          {
            name: "k_value",
            type: "line",
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: data.k_value,
            // smooth: true,
            symbol: "none",
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            lineStyle: {
              color: "#007AF5"
            }
          },
          {
            name: "d_value",
            type: "line",
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: data.d_value,
            // smooth: true,
            symbol: "none",
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            lineStyle: {
              color: "#B68000"
            }
          },
          {
            name: "j_value",
            type: "line",
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: data.j_value,
            // smooth: true,
            symbol: "none",
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            lineStyle: {
              color: "#A800FF"
            }
          },
          {
            name: "RSI6",
            type: "line",
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: that.RSI(data, 6),
            // smooth: true,
            symbol: "none",
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            lineStyle: {
              color: "white"
            }
          },
          {
            name: "RSI12",
            type: "line",
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: that.RSI(data, 12),
            // smooth: true,
            symbol: "none",
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            lineStyle: {
              color: "#f0f888"
            }
          },
          {
            name: "RSI24",
            type: "line",
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: that.RSI(data, 24),
            // smooth: true,
            symbol: "none",
            hoverAnimation: false,
            showSymbol: false,
            showAllSymbol: false,
            lineStyle: {
              color: "#05c505"
            }
          }
        ]
      };
      that.myChart.clear(that.option, true);
      that.myChart.setOption(that.option, true);
    },
    /**
     * 以下是计算部分
     * */
    //数组处理
    splitData(rawData) {
      let that = this;
      var datas = [],
        times = [],
        vols = [],
        macd = [],
        dif = [],
        dea = [];
      var bools = [],
        upper = [],
        lower = [];
      var j_value = [],
        d_value = [],
        k_value = [];
      // 数据意义:开盘(open)，收盘(close)，最低(lowest)，最高(highest)
      // 1: "9.310" //开   2: "9.380"// 收   3:"9.460"//高 4: "9.310" //低
      for (var i = 0; i < rawData.length; i++) {
        var arr = [];
        arr[0] = rawData[i][1];
        arr[1] = rawData[i][2];
        arr[2] = rawData[i][4];
        arr[3] = rawData[i][3];
        arr[4] = rawData[i][5];
        datas.push(arr);
        times.push(rawData[i][0]);
        vols.push(rawData[i][4]);
        macd.push(rawData[i][6]);
        dif.push(rawData[i][7]);
        dea.push(rawData[i][8]);
        bools.push(rawData[i][12]);
        upper.push(rawData[i][13]);
        lower.push(rawData[i][14]);
        k_value.push(rawData[i][17]);
        d_value.push(rawData[i][18]);
        j_value.push(rawData[i][19]);
      }
      return {
        datas: datas,
        times: times,
        vols: vols,
        macd: macd,
        dif: dif,
        dea: dea,
        bools: bools,
        upper: upper,
        lower: lower,
        k_value: k_value,
        d_value: d_value,
        j_value: j_value
      };
    },
    numberMA(data, dayCount) {
      let that = this;
      var result = [];
      for (var i = 0, len = data.vols.length; i < len; i++) {
        if (i < dayCount) {
          result.push("-");
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += parseFloat(data.vols[i - j]);
        }
        result.push((sum / dayCount).toFixed(2));
      }
      return result;
    },
    //价格MA计算公式
    calculateMA(data, dayCount) {
      let that = this;
      var result = [];
      for (var i = 0; i < data.datas.length; i++) {
        if (i < dayCount) {
          result.push("-");
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += parseFloat(data.datas[i - j][1]);
        }
        result.push((sum / dayCount).toFixed(2));
      }
      return result;
    },
    // RSI指标
    RSI(data, time) {
      let that = this;
      var closeArr = [];
      $.each(data.datas, function(index, item) {
        closeArr.push(item[1]);
      });
      var numArr = [];
      for (var i = 0; i < closeArr.length; i++) {
        if (i == 0) {
          var num = 0;
          numArr.push(num);
        } else {
          var num = parseFloat(closeArr[i]) - parseFloat(closeArr[i - 1]);
          numArr.push(num);
        }
      }
      var maxSum = 0;
      var minSum = 0;
      var result = [];
      for (var i = 0; i < numArr.length; i++) {
        if (i < time) {
          result.push(100);
        } else {
          for (var j = 1; j <= time; j++) {
            var index = i - j;
            if (numArr[index] > 0) {
              maxSum += numArr[index];
            } else {
              minSum += numArr[index] * -1;
            }
          }
          var RSI = ((maxSum / (maxSum + minSum)) * 100).toFixed(2);
          result.push(RSI);
        }
      }
      return result;
    },
    /**
     * MACD指标
     * @param line_data
     * @param short
     * @param long
     * @param m
     * @returns {*}
     */
    macd_index(line_data, short, long, m) {
      let that = this;
      short = 12;
      long = 26;
      m = 9;
      var highest = line_data[0][2]; //第一条数据的最高价
      var ema_short = highest;
      var ema_long = highest;
      var dea = ((ema_short - ema_long) * 2) / 10; //平滑移动平均线
      for (let value of line_data) {
        var price = value[2];
        ema_short = parseFloat(
          (
            (ema_short * (short - 1)) / (short + 1) +
            (price * 2) / (short + 1)
          ).toFixed(2)
        );
        ema_long = parseFloat(
          (
            (ema_long * (long - 1)) / (long + 1) +
            (price * 2) / (long + 1)
          ).toFixed(2)
        );
        var dif = ema_short - ema_long;
        dea = (dea * 8) / 10 + (dif * 2) / 10;
        value[6] = ((dif - dea) * 2).toFixed(2);
        value[7] = parseFloat(dif.toFixed(2));
        value[8] = parseFloat(dea.toFixed(2));
      }
      return line_data;
    },
    /**
     * boll指标
     * @param data  数据
     * @param  num 周期
     * @param  k  K为参数，可根据股票的特性来做相应的调整，一般默认为2
     * @return mixed
     */
    boll_index(data, num, k) {
      let that = this;
      num = 20;
      k = 2;
      var i, j, sum, i_j;
      for (i = 0; i < data.length; i++) {
        sum = 0;
        for (j = 0; j < num; j++) {
          i_j = i - j;
          sum += i_j <= 0 ? parseFloat(data[0][2]) : parseFloat(data[i_j][2]);
        }
        var ma = parseFloat((sum / num).toFixed(2));
        data[i][data[i].length] = parseFloat(ma.toFixed(2)); //计算MA
        data[i][data[i].length] = parseFloat(
          (Math.abs(data[i][2] - ma) * Math.abs(data[i][2] - ma)).toFixed(2)
        ); //差
      }
      for (i = 0; i < data.length; i++) {
        sum = 0;
        for (j = 0; j < num; j++) {
          i_j = i - j;
          sum +=
            i_j <= 0
              ? data[0][data[i].length - 1]
              : data[i_j][data[i].length - 1];
        }
        data[i][data[i].length] = parseFloat(
          Math.sqrt(sum / (num - 1)).toFixed(2)
        ); //计算MD
      }
      for (i = 0; i < data.length; i++) {
        var num_value = data[i].length - 1;
        data[i][num_value + 1] = parseFloat(data[i][num_value - 2].toFixed(2)); //MB
        data[i][num_value + 2] = parseFloat(
          (data[i][num_value + 1] + k * data[i][num_value]).toFixed(2)
        ); //UP
        data[i][num_value + 3] = parseFloat(
          (data[i][num_value + 1] - k * data[i][num_value]).toFixed(2)
        ); //down
      }
      return data;
    },
    /**
     * BBI指标  关盘价格
     * @param data
     * @returns {*}
     */
    bbi_index(data) {
      let that = this;
      var i, j, sum0, sum1, sum2, sum3, i_j;
      for (i = 0; i < data.length; i++) {
        sum0 = sum1 = sum2 = sum3 = 0;
        for (j = 0; j < 3; j++) {
          i_j = i - j;
          sum1 += i_j <= 0 ? parseFloat(data[0][2]) : parseFloat(data[i_j][2]);
        }
        for (j = 0; j < 6; j++) {
          i_j = i - j;
          sum1 += i_j <= 0 ? parseFloat(data[0][2]) : parseFloat(data[i_j][2]);
        }
        for (j = 0; j < 12; j++) {
          i_j = i - j;
          sum2 += i_j <= 0 ? parseFloat(data[0][2]) : parseFloat(data[i_j][2]);
        }
        for (j = 0; j < 24; j++) {
          i_j = i - j;
          sum3 += i_j <= 0 ? parseFloat(data[0][2]) : parseFloat(data[i_j][2]);
        }
        var ma3 = parseFloat((sum0 / 3).toFixed(2));
        var ma6 = parseFloat((sum1 / 6).toFixed(2));
        var ma12 = parseFloat((sum2 / 12).toFixed(2));
        var ma24 = parseFloat((sum3 / 24).toFixed(2));
        data[i][data[i].length] = parseFloat(
          ((ma3 + ma6 + ma12 + ma24) / 4).toFixed(2)
        ); //计算MA
      }
      return data;
    },
    // KDJ指标
    kdj_index(data, day) {
      let that = this;
      day = 9;
      var array = data;
      var k_value = 50,
        d_value = 50;
      var d_day, k_day;
      $.each(data, function(item, value) {
        var close = parseFloat(value[2]);
        if (item + 1 < day) {
          handle_arr = array.slice(0, item + 1);
        } else {
          var start = item + 1 - day;
          var handle_arr = array.slice(start, start + 9);
        }
        var handle = that.low_data(handle_arr);
        value.push(
          (-handle["lowest"] / (handle["highest"] - handle["lowest"])) * 100
        ); //RSV
        data[item] = value;
      });
      $.each(data, function(item, value) {
        var key_num = value.length;
        if (data[item - 1] != undefined) {
          k_value = data[item - 1][key_num];
          d_value = data[item - 1][key_num + 1];
        }
        k_day = (2 / 3) * k_value + (1 / 3) * value[key_num - 1]; //K值=2/3×第8日K值+1/3×第9日RSV
        d_day = (2 / 3) * d_value + (1 / 3) * k_day; //D值=2/3×第8日D值+1/3×第9日K值
        value[value.length] = parseFloat(k_day.toFixed(2));
        value[value.length] = parseFloat(d_day.toFixed(2));
        value[value.length] = parseFloat((3 * k_day - 2 * d_day).toFixed(2)); //J值=3*第9日K值-2*第9日D值
        data[item] = value;
      });
      return data;
    },
    /**
     * N日内的最低和最高价
     * @param list array 数据
     */
    low_data(list) {
      let that = this;
      var lowest = [];
      var highest = [];
      if (list.length == 9) {
        $.each(list, function(item, value) {
          highest.push(parseFloat(value[4]));
          lowest.push(parseFloat(value[3]));
        });
        return {
          highest: Math.max.apply(null, highest),
          lowest: Math.min.apply(null, highest)
        };
      } else {
        $.each(list, function(item, value) {
          highest.push(parseFloat(value[4]));
        });
        return {
          highest: Math.max.apply(null, highest),
          lowest: 0
        };
      }
    },
    otherLine(params) {
      let that = this;
      var names = [],
        values = [],
        colors = [];
      $.each(params, function(i, item) {
        if (isNaN(item.value)) {
          values.push(item.value);
        } else {
          values.push(parseFloat(item.value).toFixed(2));
        }
        names.push(item.seriesName);
        colors.push(item.color);
      });
      var rk = [],
        rk_color = "#FFFFFF",
        numbs = 0,
        numbs_color = "#FFFFFF",
        zf = 0,
        ma_color;
      var price_ma5 = [],
        price_ma10 = [],
        price_ma20 = [],
        price_ma30 = [];
      var number_ma5 = [],
        number_ma10 = [],
        number_ma20 = [],
        number_ma30 = [];
      $.each(names, function(i, val) {
        switch (val) {
          case "MA5":
            price_ma5.push(val, values[i], colors[i]);
            break;
          case "MA10":
            price_ma10.push(val, values[i], colors[i]);
            break;
          case "MA20":
            price_ma20.push(val, values[i], colors[i]);
            break;
          case "MA30":
            price_ma30.push(val, values[i], colors[i]);
            break;
          case "MA51":
            number_ma5.push(val, values[i], colors[i]);
            break;
          case "MA101":
            number_ma10.push(val, values[i], colors[i]);
            break;
          case "MA201":
            number_ma20.push(val, values[i], colors[i]);
            break;
          case "MA301":
            number_ma30.push(val, values[i], colors[i]);
            break;
          default:
            break;
        }
        if (typeof values[i] == "object") {
          rk = values[i];
          rk_color = colors[i];
        }
      });
      var s =
        "开盘价 " +
        ' <span style="color:' +
        rk_color +
        '">' +
        parseFloat(rk[1]).toFixed(2) +
        "</span><br>" +
        "收盘价 " +
        ' <span style="color:' +
        rk_color +
        '">' +
        parseFloat(rk[2]).toFixed(2) +
        "</span><br>" +
        "最高价 " +
        ' <span style="color:' +
        rk_color +
        '">' +
        parseFloat(rk[3]).toFixed(2) +
        "</span><br>" +
        "最低价 " +
        ' <span style="color:' +
        rk_color +
        '">' +
        parseFloat(rk[4]).toFixed(2) +
        "</span><br>" +
        "成交量 " +
        ' <span style="color:' +
        numbs_color +
        '">' +
        numbs +
        "</span><br>";
      var s1 =
        " 开 " +
        ' <span style="color:' +
        rk_color +
        '">' +
        rk[1] +
        "</span> " +
        "收 " +
        ' <span style="color:' +
        rk_color +
        '">' +
        rk[2] +
        "</span> " +
        "高 " +
        ' <span style="color:' +
        rk_color +
        '">' +
        rk[3] +
        "</span> " +
        "低 " +
        ' <span style="color:' +
        rk_color +
        '">' +
        rk[4] +
        "</span> " +
        "成交量 " +
        ' <span style="color:' +
        numbs_color +
        '">' +
        numbs +
        "</span>";
      // document.getElementById('text').innerHTML =
      //     '<span style="color: #c23531;">MA5:' + price_ma5[1] + ' </span>' +
      //     '<span style="color: #d48265;">MA10:' + price_ma10[1] + ' </span>' +
      //     '<span style="color:#91c7ae;">MA20:' + price_ma20[1] + ' </span>' +
      //     '<span style="color: #bda29a;">MA30:' + price_ma30[1] + '</span>';
      // document.getElementById('ma').innerHTML =
      //     '<span style="color: #c23531;">MA5:' + (number_ma5[1] / 10000).toFixed(2) + '万 </span>' +
      //     '<span style="color: #d48265;">MA10:' + (number_ma10[1] / 10000).toFixed(2) + '万 </span>' +
      //     '<span style="color:#91c7ae;">MA20:' + (number_ma20[1] / 10000).toFixed(2) + '万 </span>';
      // +
      // '<span style="color: #bda29a;">MA30:' + (number_ma5[1] / 10000).toFixed(2) + '万</span>';
      //		return s;
    },
    dateFtt(fmt, date) {
      let that = this;
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    weekData(rawData) {
      let that = this;
      var week_arr = [];
      for (var i = 0; i < rawData.length; i++) {
        var arr = rawData[i][0].split("-");
        var week = that.getYearWeek(arr[0], arr[1], arr[2])+arr[0];
        // if (arr[0] != "2018") {
        //   week = week * 100; //区分2019年数据
        // }
        rawData[i].push(week);
        if (typeof index != "undefined") {
          //存在
          if (index != week) {
            index = week;
            week_arr.push(index);
          }
        } else {
          //不存在
          var index = week;
          week_arr.push(index);
        }
      }
      var data_arr = []; //三维数组 把数据分为每个周的数据为一个小数组 放在一个大数组里面
      for (var i = 0; i < week_arr.length; i++) {
        var data_account = [];
        for (var j = 0; j < rawData.length; j++) {
          if (week_arr[i] == rawData[j][6]) {
            data_account.push(rawData[j]);
          }
        }
        data_arr[i] = data_account;
      }
      //创建最终渲染K线的数据
      var line_arr = [];
      //var arr = [t, o, h, l, c, v];
      for (var i = 0; i < data_arr.length; i++) {
        var arr = [];
        var t = data_arr[i][data_arr[i].length - 1][0]; //日期最大的一条
        var o = data_arr[i][0][1]; //每周初始数据的开盘价 作为周开盘价
        var h = data_arr[i][0][2]; //最高价初值
        var l = data_arr[i][0][3]; //最低价初值
        var c = data_arr[i][data_arr[i].length - 1][4]; //收盘价 最后一条数据的收盘价为周收盘价
        var v = 0;
        for (var j = 0; j < data_arr[i].length; j++) {
          h = h > data_arr[i][j][2] ? h : data_arr[i][j][2]; //取最低价位一周数据的最低价
          l = l < data_arr[i][j][3] ? l : data_arr[i][j][3]; //取最高价位一周数据的最低价
          //				v += data_arr[i][j][5];
          v = data_arr[i][j][5];
        }
        arr = [t, o, h, l, c, v];
        line_arr.push(arr);
      }
      return line_arr;
    },
    //获取 一年的第几周
    getYearWeek(a, b, c) {
      /*  
	      date1是当前日期  
	      date2是当年第一天  
	      d是当前日期是今年第多少天  
     	    用d + 当前年的第一天的周差距的和在除以7就是本年第几周  
        */
      var date1 = new Date(a, parseInt(b) - 1, c),
        date2 = new Date(a, 0, 1),
        d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
      return Math.ceil((d + (date2.getDay() + 1 - 1)) / 7);
    },
    //修改月线数据
    monthData(rawData) {
      var month_arr = [];
      for (var i = 0; i < rawData.length; i++) {
        var arr = rawData[i][0].split("-");
        var month = Number(arr[1])+arr[0];
        // if (arr[0] != "2018") {
        //   month = month * 100; //区分2019年数据
        // }
        rawData[i].push(month);
        if (typeof index != "undefined") {
          //存在
          if (index != month) {
            index = month;
            month_arr.push(index);
          }
        } else {
          //不存在
          var index = month;
          month_arr.push(index);
        }
      }
      var data_arr = []; //三维数组 把数据分为每个周的数据为一个小数组 放在一个大数组里面
      for (var i = 0; i < month_arr.length; i++) {
        var data_account = [];
        for (var j = 0; j < rawData.length; j++) {
          if (month_arr[i] == rawData[j][6]) {
            data_account.push(rawData[j]);
          }
        }
        data_arr[i] = data_account;
      }
      //创建最终渲染K线的数据
      var line_arr = [];
      //var arr = [t, o, h, l, c, v];
      for (var i = 0; i < data_arr.length; i++) {
        var arr = [];
        var t = data_arr[i][data_arr[i].length - 1][0]; //日期最大的一条
        var o = data_arr[i][0][1]; //每周初始数据的开盘价 作为周开盘价
        var h = data_arr[i][0][2]; //最高价初值
        var l = data_arr[i][0][3]; //最低价初值
        var c = data_arr[i][data_arr[i].length - 1][4]; //收盘价 最后一条数据的收盘价为周收盘价
        var v = 0;
        for (var j = 0; j < data_arr[i].length; j++) {
          h = h > data_arr[i][j][2] ? h : data_arr[i][j][2]; //取最低价位一周数据的最低价
          l = l < data_arr[i][j][3] ? l : data_arr[i][j][3]; //取最高价位一周数据的最低价
          //				v += data_arr[i][j][5];
          v = data_arr[i][j][5];
        }
        arr = [t, o, h, l, c, v];
        line_arr.push(arr);
      }
      return line_arr;
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
      font-size: 14px;
      > span {
        font-size: 14px;
      }
    }
    > span:first-child {
      font-size: 16px;
      color: #c0c0c0;
      padding-top: 14px;
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
    > .f_l {
      box-sizing: border-box;
      height: 100%;
      position: relative;
    }
    #chart {
      width: 100%;
      height: 100%;
    }
    .tip1 {
      position: absolute;
      background: #000;
      white-space: nowrap;
      top: 47%;
      left: 70px;
      font-size: 13px;
      > span {
        margin-right: 6px;
      }
    }
    .tip2 {
      position: absolute;
      background: #000;
      white-space: nowrap;
      top: 69%;
      left: 70px;
      font-size: 13px;
      > div {
        > span {
          margin-right: 6px;
        }
      }
    }
    .x_line {
      position: absolute;
      width: calc(100% - 84px);
      left: 65px;
      height: 1px;
      background: #b00000;
      bottom: calc(9% - 1px);
      z-index: 1;
    }
    .other {
      position: absolute;
      left: 65px;
      bottom: -2px;
      overflow: hidden;
      > span {
        background: #808080;
        color: #000;
        font-size: 13px;
        padding: 1px 2px 1px;
        float: left;
        margin-right: 3px;
      }
      > .active {
        background: #800000;
        color: #7fffff;
      }
    }
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

