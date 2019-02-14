<template>
  <div class="wrap">
    <div class="w_form">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px">
        <el-form-item label="姓名：" prop="name">
          <el-input
            v-model="ruleForm2.name"
            @keyup.native.enter="withdraw('ruleForm2')"
            placeholder="请输入您的真实姓名"
            :disabled="status!=0"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" prop="id">
          <el-input
            v-model="ruleForm2.id"
            @keyup.native.enter="withdraw('ruleForm2')"
            placeholder="请输入身份证号"
            :disabled="status!=0"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="s_btn">
        <el-button
          v-if="status==0"
          @click="withdraw('ruleForm2')"
          type="primary"
          :loading="bool"
        >提交认证</el-button>
        <el-button v-if="status==1" type="primary" disabled>审核中</el-button>
        <el-button v-if="status==2" type="primary" disabled>已认证</el-button>
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
    var checkid = (rule, value, callback) => {
      let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (value == "" || !reg.test(value)) {
        return callback(new Error("请输入正确的身份证号"));
      } else {
        callback();
      }
    };
    return {
      status: 0,
      ruleForm2: {
        name: "",
        id: ""
      },
      bool: false,
      rules2: {
        name: [{ validator: checkname, trigger: "blur" }],
        id: [{ validator: checkid, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  activated() {
    let that = this;
    that.getInfo();
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
                nozzle: "certification",
                token: that.$store.state.token,
                name: that.ruleForm2.name,
                card: that.ruleForm2.id
              }
            })
            .then(function(res) {
              that.bool = false;
              if (res.data.code == 1) {
                that.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 2000
                });
                that.$refs[formName].resetFields();
                that.getInfo();
              }
            });
        } else {
          return false;
        }
      });
    },
    getInfo() {
      let that = this;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "certified",
            token: that.$store.state.token
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            if (res.data.data.certified != 0) {
              that.status = res.data.data.certified;
              that.ruleForm2.name = res.data.data.name;
              that.ruleForm2.id = res.data.data.card;
            }
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
    .s_btn {
      padding-top: 20px;
    }
  }
}
</style>


