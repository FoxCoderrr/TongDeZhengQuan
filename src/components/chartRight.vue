<template>
  <div class="right_div f_r">
    <div v-if="!$store.state.speIf">
      <div v-if="type==0" class="d_title ta_c">{{$store.state.active_stock.code}}&nbsp;&nbsp;{{$store.state.active_stock.name}}</div>
      <div v-if="type==1" class="d_title ta_l" style="padding-left:2px;">主力大单</div>
      <div class="d_con">
        <div class="d1 clearfix" v-if="type==0">
          <span class="f_l">
            <span class="f_l">委比</span>
            <span class="f_r red">--</span>
          </span>
          <span class="f_r">
            <span class="f_l">委差</span>
            <span class="f_r red">--</span>
          </span>
        </div>
        <div class="d1 d2 clearfix" v-if="type==1">
          <span class="f_l">
            <span class="f_l">时间</span>
            <span class="f_r">名称</span>
          </span>
          <span class="f_r">
            <span class="f_l">价格</span>
            <span class="f_r">现量</span>
          </span>
        </div>
        <div class="d_list">
          <ul v-if="type==0">
            <li class="clearfix" v-for="(item,index) in $store.state.sellArr1">
              <span class="f_l">
                <span class="f_l">{{item.index}}</span>
                <span class="f_r red">{{item.price}}</span>
              </span>
              <span class="f_r">
                <span class="f_l"></span>
                <span class="f_r yellow">{{item.number}}</span>
              </span>
            </li>
          </ul>
          <ul v-if="type==0">
            <li class="clearfix" v-for="(item,index) in $store.state.buyArr1">
              <span class="f_l">
                <span class="f_l">{{item.index}}</span>
                <span class="f_r red">{{item.price}}</span>
              </span>
              <span class="f_r">
                <span class="f_l"></span>
                <span class="f_r yellow">{{item.number}}</span>
              </span>
            </li>
          </ul>
          <ul class="ul1" v-if="type==0">
            <li class="clearfix">
              <span class="f_l">
                <span class="f_l">现价</span>
                <span class="f_r red">{{$store.state.otherArr1[4]}}</span>
              </span>
              <span class="f_r">
                <span class="f_l">今开</span>
                <span class="f_r green">{{$store.state.otherArr1[0]}}</span>
              </span>
            </li>
            <li class="clearfix">
              <span class="f_l">
                <span class="f_l">涨跌</span>
                <span class="f_r red">{{$store.state.otherArr1[5]}}</span>
              </span>
              <span class="f_r">
                <span class="f_l">最高</span>
                <span class="f_r green">{{$store.state.otherArr1[6]}}</span>
              </span>
            </li>
            <li class="clearfix">
              <span class="f_l">
                <span class="f_l">涨幅</span>
                <span class="f_r red">{{$store.state.otherArr1[7]}}%</span>
              </span>
              <span class="f_r">
                <span class="f_l">最低</span>
                <span class="f_r green">{{$store.state.otherArr1[8]}}</span>
              </span>
            </li>
            <li class="clearfix">
              <span class="f_l">
                <span class="f_l">总量</span>
                <span class="f_r yellow">{{$store.state.otherArr1[9]}}</span>
              </span>
              <span class="f_r">
                <span class="f_l">量比</span>
                <span class="f_r green">{{$store.state.otherArr1[10]}}</span>
              </span>
            </li>
            <li class="clearfix">
              <span class="f_l">
                <span class="f_l">外盘</span>
                <span class="f_r red">{{$store.state.otherArr1[11]}}</span>
              </span>
              <span class="f_r">
                <span class="f_l">内盘</span>
                <span class="f_r green">{{$store.state.otherArr1[12]}}</span>
              </span>
            </li>
          </ul>
          <ul class="ul1" v-if="type==0">
            <li class="clearfix">
              <span class="f_l">
                <span class="f_l">市盈</span>
                <span class="f_r">{{$store.state.otherArr1[13]}}</span>
              </span>
              <span class="f_r">
                <span class="f_l">股本</span>
                <span class="f_r">{{$store.state.otherArr1[14]}}</span>
              </span>
            </li>
            <li class="clearfix">
              <span class="f_l">
                <span class="f_l">换手</span>
                <span class="f_r">{{$store.state.otherArr1[15]}}</span>
              </span>
              <span class="f_r">
                <span class="f_l">流通</span>
                <span class="f_r">{{$store.state.otherArr1[16]}}</span>
              </span>
            </li>
            <li class="clearfix">
              <span class="f_l">
                <span class="f_l">净资</span>
                <span class="f_r">{{$store.state.otherArr1[17]}}</span>
              </span>
              <span class="f_r">
                <span class="f_l">收益</span>
                <span class="f_r">{{$store.state.otherArr1[18]}}</span>
              </span>
            </li>
          </ul>
          <ul class="ul1 ul2" v-if="type==1">
            <li class="clearfix" v-for="(item,index) in orders" :key="index">
              <span class="f_l spe">
                <span class="f_l">{{item[0]}}</span>
                <span class="f_r yellow">{{$store.state.active_stock.name}}</span>
              </span>
              <span class="f_r">
                <span class="f_l" :class="[item[3]=='UP'?'red':'green']">{{item[2]}}</span>
                <span class="f_r" :class="[item[3]=='UP'?'red':'green']">{{item[1]}}</span>
              </span>
            </li>
          </ul>

          <div class="d_menu">
            <span class="c_p" @click="type=0">笔</span>
            <span class="c_p" @click="type=1">单</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$store.state.speIf" class="spe_right">
      <div v-if="type==0" class="d_title ta_c">{{$store.state.active_stock.code}}&nbsp;&nbsp;{{$store.state.active_stock.name}}</div>
      <ul class="ul">
        <li class="clearfix">
          <span class="f_l">最新指数</span>
          <span class="f_r" :class="[$store.state.otherArr1[5]>0?'red':'green']">{{$store.state.otherArr1[4]}}</span>
        </li>
        <li class="clearfix">
          <span class="f_l">指数涨跌</span>
          <span class="f_r" :class="[$store.state.otherArr1[5]>0?'red':'green']">{{$store.state.otherArr1[5]}}</span>
        </li>
        <li class="clearfix">
          <span class="f_l">涨跌幅度</span>
          <span class="f_r" :class="[$store.state.otherArr1[5]>0?'red':'green']">{{$store.state.otherArr1[7]}}%</span>
        </li>
        <li class="clearfix">
          <span class="f_l">昨日收盘</span>
          <span class="f_r white">{{$store.state.otherArr1[2]}}</span>
        </li>
        <li class="clearfix">
          <span class="f_l">今日开盘</span>
          <span class="f_r" :class="[$store.state.otherArr1[5]>0?'red':'green']">{{$store.state.otherArr1[0]}}</span>
        </li>
        <li class="clearfix">
          <span class="f_l">今日最高</span>
          <span class="f_r" :class="[$store.state.otherArr1[5]>0?'red':'green']">{{$store.state.otherArr1[6]}}</span>
        </li>
        <li class="clearfix">
          <span class="f_l">今日最低</span>
          <span class="f_r" :class="[$store.state.otherArr1[5]>0?'red':'green']">{{$store.state.otherArr1[8]}}</span>
        </li>
        <li class="clearfix">
          <span class="f_l">总成交量</span>
          <span class="f_r" :class="[$store.state.otherArr1[5]>0?'red':'green']">{{$store.state.otherArr1[19]}}</span>
        </li>
        <li class="clearfix">
          <span class="f_l">总成交额</span>
          <span class="f_r" :class="[$store.state.otherArr1[5]>0?'red':'green']">{{$store.state.otherArr1[20]}}</span>
        </li>
      </ul>
      <ul>
        <li class="clearfix">
          <span class="f_l">上涨家数</span>
          <span class="f_r white">{{spe_arr[0]}}</span>
        </li>
        <li class="clearfix">
          <span class="f_l">平盘家数</span>
          <span class="f_r white">{{spe_arr[1]}}</span>
        </li>
        <li class="clearfix">
          <span class="f_l">下跌家数</span>
          <span class="f_r white">{{spe_arr[2]}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
export default {
  data() {
    return {
      type: 0,
      orders:[],
      spe_arr:[],
    };
  },
  mounted() {
    let that = this;
    that.getOrders();
    that.getInfo();
    clearInterval(window.spe);
    ff();
     if(that.$store.commit('getIfTrade')){
                
       window.spe = setInterval(()=>{
         ff();
       },5000)
              }
    function ff(){
      $.ajax({
            cache: true,
            url: "http://hq.sinajs.cn/rn=1550024574975&list=sh000001_zdp,sz399107_zdp,sz399001_zdp,sz399300_zdp",
            type: 'GET',
            dataType: 'script',
            success: function() {
              if(that.$store.state.active_stock.short=="sh000001"){
                that.spe_arr = eval("hq_str_sh000001_zdp").split(",")
              }else if(that.$store.state.active_stock.short=="sz399001"){
                that.spe_arr = eval("hq_str_sz399001_zdp").split(",")
              }else{
                that.spe_arr = eval("hq_str_sz399300_zdp").split(",")
              }
            }
          });
    }
  },
  activated() {
    let that = this;
  },
  methods: {
    getOrders(){
      let that = this;
      let short = that.$store.state.active_stock.short;
      if(short != that.$store.state.self_short){
        clearInterval(window.chartRight1);
        fun();
         if(that.$store.commit('getIfTrade')){
                
           window.chartRight1 = setInterval(fun,60000);
              }
        function fun() {
          //解释：num=>条数  symbol=>代码
          $.ajax({
            cache: true,
            url: `https://vip.stock.finance.sina.com.cn/quotes_service/view/CN_BillList.php?sort=ticktime&symbol=${short}&num=10`,
            type: 'GET',
            dataType: 'script',
            success: function() {
              //解释  list[0][0]=>时间  list[0][1]=>量（手：需要除以100）  list[0][2]=>价格  list[0][3]=>性质
              //性质解释：EQUAL=>中性盘   UP=>买入   DOWN=>卖出 
              var list = eval("bill_detail_list");
              for(let v of list){
                v[0] = v[0].substr(0,5);
                v[1] = v[1]/100;
                v[2] = parseFloat(v[2]).toFixed(2);
              }
              that.orders = list;
            }
          });
        }
      }
    },
    getInfo(){
      let that = this;
      clearInterval(window.chartRight);
       if(that.$store.commit('getIfTrade')){
                
         window.chartRight = setInterval(fun,2000);
              }
      fun();
      function fun(){
        if (that.$store.state.active_stock.short != that.$store.state.self_short) {
          $.ajax({
            cache: true,
            url: "http://qt.gtimg.cn/q=" + that.$store.state.active_stock.short,
            type: "GET",
            dataType: "script",
            success: function() {
              let a = eval("v_" + that.$store.state.active_stock.short).split("~");
              for (let i in that.$store.state.sellArr1) {
                that.$store.state.sellArr1[i].price = a[27 - i * 2];
                that.$store.state.sellArr1[i].number = a[28 - i * 2];
              }
              for (let i in that.$store.state.buyArr1) {
                that.$store.state.buyArr1[i].price = a[i * 2 + 9];
                that.$store.state.buyArr1[i].number = a[i * 2 + 10];
              }
              if(a[36]>=10000){
                a[36] = parseFloat(a[36]/10000).toFixed(2)+"万"
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
              that.$store.state.otherArr1 = [
                a[5],//今开
                a[47],//涨停价
                a[4],//昨收
                a[48],//跌停价
                a[3],//当前价
                a[31],//涨跌额
                a[41],//最高

                a[32],//涨跌幅

                a[34],//最低


                "--",//
                "--",//
                a[7],//外盘
                a[8],//内盘
                a[39],//市盈率
                "--",//
                a[38],//换手率
                a[44],//流通市值
                "--",//
                "--",//
                a[36],//成交量
                a[37]//成交额
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
                for (let i in that.$store.state.sellArr1) {
                  that.$store.state.sellArr1[i].price = a[30 - i * 2];
                  that.$store.state.sellArr1[i].number = a[29 - i * 2];
                }
                for (let i in that.$store.state.buyArr1) {
                  that.$store.state.buyArr1[i].price = a[20 - i * 2];
                  that.$store.state.buyArr1[i].number = a[19 - i * 2];
                }
                that.$store.state.otherArr1 = [
                  a[2],//今开
                (parseFloat(a[3])+parseFloat(a[3]*0.1)).toFixed(2),//涨停价
                a[3],//昨收
                (parseFloat(a[3])-parseFloat(a[3]*0.1)).toFixed(2),//跌停价
                a[4],//当前价
                (parseFloat(a[4]) - parseFloat(a[3])).toFixed(2),//涨跌额
                a[5],//最高

                ((parseFloat(a[4]-a[3]) / parseFloat(a[3])) * 100).toFixed(2),//涨跌幅

                a[6],//最低


                "--",//
                "--",//
                "--",//外盘
                "--",//内盘
                "--",//市盈率
                "--",//
                "--",//换手率
                "--",//流通市值
                "--",//
                "--",//
                a[9],//成交量
                a[10]//成交额
                ];
              }
            });
        }
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.right_div {
  width: 198px;
  height: 100%;
  border: 1px solid #b00000;
  border-bottom: 0;
  >div{
    height: 100%;
  }
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
    .d2 {
      > span {
        width: calc(50% - 8px);
        font-size: 15px;
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
      .ul2{
          li{
              >span{
                  width: calc(50% - 8px);
                  >span{
                    font-size: 14px!important;
                  }
              }
              >.spe{
                width: 50%;
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
  >.spe_right{
    color: #c0c0c0;
    ul{
      li{
        line-height: 21px;
        font-size: 15px;
        padding: 0 2px 0;
      }
    }
    .ul{
      border-bottom: 1px solid #b00000;
    }
  }
}
</style>

