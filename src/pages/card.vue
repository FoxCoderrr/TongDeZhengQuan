<template>
  <div class="wrap clearfix">
    <div class="w_form w_form1 f_l">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px">
        <el-form-item label="姓名：" prop="name">
          <el-input
            v-model="ruleForm2.name"
            @keyup.native.enter="withdraw('ruleForm2')"
            placeholder="请输入您的真实姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="银行：" prop="bank">
          <el-select v-model="ruleForm2.bank" placeholder="请选择银行">
            <el-option v-for="item in bank_list" :key="item.id" :label="item.bank" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户支行：" prop="ads">
          <el-input
            v-model="ruleForm2.ads"
            @keyup.native.enter="withdraw('ruleForm2')"
            placeholder="请输入开户支行"
          ></el-input>
        </el-form-item>
        <el-form-item label="银行账号：" prop="id">
          <el-input
            v-model="ruleForm2.id"
            @keyup.native.enter="withdraw('ruleForm2')"
            placeholder="请输入实名的银行卡账户"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="s_btn">
        <el-button @click="withdraw('ruleForm2')" type="primary" :loading="bool">立即绑定</el-button>
      </div>
    </div>
    <div class="card_div f_r">
      <div class="d_title">我的银行卡</div>
      <div class="d_con clearfix" v-loading="load">
        <div class="d_card" v-for="(item,index) in my_card" :key="index">
          <div class="c_name clearfix">
            <span class="f_l">{{item.name}}</span>
            <span class="f_r c_p" @click="deleteC(item.id,index)">移除</span>
          </div>
          <div class="c_num">{{item.card}}</div>
          <div class="u_name">姓名：{{item.account}}</div>
          <div class="c_ads">开户支行：{{item.address}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    var checkname = (rule, value, callback) => {
      let reg = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/;
      if (value == "" || !reg.test(value)) {
        return callback(new Error("请输入您的真实姓名"));
      } else {
        callback();
      }
    };
    var checkbank = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请选择开户银行"));
      } else {
        callback();
      }
    };
    var checkads = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入开户支行"));
      } else {
        callback();
      }
    };
    var checkid = (rule, value, callback) => {
      let reg = /^([1-9]{1})(\d{15}|\d{18})$/;
      if (value == "" || !reg.test(value)) {
        return callback(new Error("请输入正确的银行卡号"));
      } else {
        callback();
      }
    };
    return {
      load: false,
      bank_list: [],
      my_card:[],
      ruleForm2: {
        name: "",
        bank: "",
        id: "",
        ads: ""
      },
      bool: false,
      rules2: {
        name: [{ validator: checkname, trigger: "blur" }],
        bank: [{ validator: checkbank, trigger: "change" }],
        id: [{ validator: checkid, trigger: "blur" }],
        ads: [{ validator: checkads, trigger: "blur" }]
      }
    };
  },
  mounted() {
    let that = this;
    //银行信息
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
          that.bank_list = res.data.data.bank;
          that.my_card = res.data.data.data;
        }
      });
  },
  activated() {
    let that = this;
    that.$refs["ruleForm2"].resetFields();
  },
  methods: {
    deleteC(id,i) {
      let that = this;
      that
        .$confirm("确定要移除该银行卡？", "移除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          that
            .$http({
              url: "/",
              method: "post",
              data: {
                nozzle: "del_bank",
                token: that.$store.state.token,
                mark:id
              }
            })
            .then(function(res) {
              if (res.data.code == 1) {
                that.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 2000
                });
                that.my_card.splice(i,1);
              }
            });
        })
        .catch(() => {});
    },
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
                nozzle: "bind_bank",
                token: that.$store.state.token,
                name: that.ruleForm2.name,
                bank_id: that.ruleForm2.bank,
                card: that.ruleForm2.id,
                address: that.ruleForm2.ads
              }
            })
            .then(function(res) {
              that.bool = false;
              if (res.data.code == 1) {
                that.getMycard();
                that.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 2000
                });
                that.$refs[formName].resetFields();
              }
            });
        } else {
          return false;
        }
      });
    },
    getMycard(){
      let that = this;
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
          that.my_card = res.data.data.data;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  border-left: 1px solid #ddd;
  box-sizing: border-box;
  height: 304px;
  > .w_form {
    width: 404px;
    height: 100%;
    box-sizing: border-box;
    padding-top: 16px;
    font-size: 14px;
    border-right: 1px solid #ddd;
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
    .s_btn {
      padding-top: 10px;
    }
  }
  > .card_div {
    width: calc(100% - 410px);
    height: 100%;
    border-left: 1px solid #ddd;
    box-sizing: border-box;
    padding: 12px 16px 0;
    .d_title {
      color: #5770c8;
      font-size: 18px;
      padding-bottom: 10px;
      box-shadow: 0 0 10px 0 white;
      position: relative;
      z-index: 1;
    }
    .d_con {
      height: calc(100% - 34px);
      overflow: auto;
      box-sizing: border-box;
      &::-webkit-scrollbar {
        width: 4px;
        height: 6px;
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
      > .d_card {
        float: left;
        background: #5770c8;
        border-radius: 4px;
        color: white;
        font-size: 14px;
        padding: 4px 6px 16px;
        margin-bottom: 16px;
        box-sizing: border-box;
        width: 350px;
        margin-right: 16px;
        > div {
          padding: 0 8px 12px;
          word-break: break-all;
        }
        .c_name {
          padding: 8px;
          margin-bottom: 20px;
          border-bottom: 1px solid #bbb;
        }
      }
    }
  }
}
</style>


