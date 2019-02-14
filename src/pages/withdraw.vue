<template>
  <div class="wrap">
    <div class="w_form">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px">
        <div class="clearfix d_item">
          <span class="f_l">提现金额：</span>
          <div class="f_r">￥{{$store.state.u_assets.cash}}</div>
        </div>
        <el-form-item label="银行卡：" prop="bank">
          <el-select v-model="ruleForm2.bank" placeholder="请选择银行卡">
            <el-option v-for="item in bank_list" :key="item.id" :label="item.card" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <div class="clearfix d_item">
          <span class="f_l">银行信息：</span>
          <div class="f_r" v-html="cardInfo"></div>
        </div>
        <el-form-item label="申请金额：" prop="num">
          <el-input @input="inputNum" v-model.number="ruleForm2.num" @keyup.native.enter="withdraw('ruleForm2')" placeholder="请输入申请金额"></el-input>
        </el-form-item>
      </el-form>
      <div class="s_btn">
        <el-button @click="withdraw('ruleForm2')" type="primary" :loading="bool">确认出金</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      var checkbank = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请选择银行卡"));
      } else {
        callback();
      }
    };
    var checknum = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入申请金额"));
      } else if (parseFloat(value) >= this.$store.state.u_assets.cash) {
        return callback(new Error("余额不足"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        num: "",
        bank:"",
      },
      bank_list:[],
      bool: false,
      rules2: {
        num: [{ validator: checknum, trigger: "blur" }],
        bank: [{ validator: checkbank, trigger: "change" }],
      }
    };
  },
  mounted() {},
  computed:{
    cardInfo(){
      if(this.ruleForm2.bank==""){
        return "<span class='gray'>请选择银行卡</span>"
      }else{
        for(let v of this.bank_list){
          if(v.id==this.ruleForm2.bank){
            return v.name+" -- "+v.account+" -- "+v.card;
            break;
          }
        }
      }
    }
  },
  activated() {
    let that = this;
    this.$refs['ruleForm2'].resetFields();
    that
      .$http({
        url: "/",
        method: "post",
        data: {
          nozzle: "bank_info",
          token: that.$store.state.token
        }
      })
      .then(function(res) {
        if (res.data.code == 1) {
          that.bank_list = res.data.data.data;
        }
      });
  },
  methods: {
    withdraw(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          that.bool = true;
          that
            .$http({
              url: "/",
              method: "post",
              data: {
                nozzle:"withdraw",
                token:that.$store.state.token,
                number:that.ruleForm2.num,
                mark:that.ruleForm2.bank,
              }
            })
            .then(function(res) {
              that.bool = false;
              if (res.data.code == 1) {
                that.$refs[formName].resetFields();
                that.$store.dispatch('getAssets');
              }
            });
        } else {
          return false;
        }
      });
    },
    inputNum(v) {
      let that = this;
      if (v != "") {
        that.$nextTick(function() {
          that.price = v.toString().match(/\d+\.?\d{0,2}/)[0];
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  border-left: 1px solid #ddd;
  box-sizing: border-box;
  height: 304px;
  padding-top: 20px;
  > div {
    width: 500px;
    font-size: 14px;
    padding-left: 20px;
    .d_item {
      padding-bottom: 20px;
      > .f_l {
        width: 100px;
        text-align: right;
        padding-right: 12px;
        box-sizing: border-box;
      }
      > .f_r {
        width: calc(100% - 100px);
      }
    }
    .s_btn{
        padding-top: 20px;
    }
  }
}
</style>


