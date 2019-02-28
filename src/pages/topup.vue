<template>
  <div class="wrap">
    <div class="w_form">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px">
        <!-- <div class="clearfix d_item">
          <span class="f_l">银行信息1：</span>
          <div class="f_r">银行信息：中国建设银行--管理员--1234567899876543211</div>
        </div>
        <div class="clearfix d_item">
          <span class="f_l">银行信息2：</span>
          <div class="f_r">银行信息：中国建设银行--管理员--1234567899876543211</div>
        </div> -->
        <div style="height:20px"></div>
        <el-form-item label="申请金额：" prop="num">
          <el-input @input="inputNum" v-model.number="ruleForm2.num" @keyup.native.enter="withdraw('ruleForm2')" placeholder="请输入申请金额"></el-input>
        </el-form-item>
      </el-form>
      <div class="s_btn">
        <el-button @click="withdraw('ruleForm2')" type="primary" :loading="bool">申请入金</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    var checknum = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入申请金额"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        num: ""
      },
      bool: false,
      rules2: {
        num: [{ validator: checknum, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  activated() {
    let that = this;
    this.$refs['ruleForm2'].resetFields();
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
                nozzle:"recharge",
                token: that.$store.state.token,
                number:that.ruleForm2.num
              }
            })
            .then(function(res) {
              that.bool = false;
              if (res.data.code == 1) {
                window.open(res.data.data);
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


