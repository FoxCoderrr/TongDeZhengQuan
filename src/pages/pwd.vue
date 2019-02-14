<template>
  <div class="wrap clearfix">
    <div class="w_form w_form1 f_l">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px">
        <el-form-item label="手机号码：" prop="phone">
          <el-input
            v-model="ruleForm2.phone"
            @keyup.native.enter="withdraw('ruleForm2')"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="code">
          <el-input class="code_input" v-model="ruleForm2.code" placeholder="请输入验证码"></el-input>
          <div class="code_div">
            <el-button class="code_btn" :disabled="codeIf" @click="getCode">{{btn_msg}}</el-button>
          </div>
        </el-form-item>
        <el-form-item label="输入密码：" prop="pwd">
          <el-input
            v-model="ruleForm2.pwd"
            type="password"
            @keyup.native.enter="withdraw('ruleForm2')"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="pwd1">
          <el-input
            v-model="ruleForm2.pwd1"
            type="password"
            @keyup.native.enter="withdraw('ruleForm2')"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="s_btn">
        <el-button @click="withdraw('ruleForm2')" type="primary" :loading="bool">确认修改</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    var checkphone = (rule, value, callback) => {
      let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (value == "" || !reg.test(value)) {
        return callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    var checkcode = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    var checkpwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.pwd1 !== "") {
          this.$refs.ruleForm2.validateField("pwd1");
        }
        callback();
      }
    };
    var checkpwd1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pwd) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      time: 60,
      btn_msg: "获取验证码",
      codeIf: false,
      load: false,
      ruleForm2: {
        phone: "",
        code: "",
        pwd: "",
        pwd1: ""
      },
      bool: false,
      rules2: {
        phone: [{ validator: checkphone, trigger: "blur" }],
        code: [{ validator: checkcode, trigger: "blur" }],
        pwd: [{ validator: checkpwd, trigger: "blur" }],
        pwd1: [{ validator: checkpwd1, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  activated() {
    let that = this;
    that.$refs["ruleForm2"].resetFields();
    that.time = 60;
    that.btn_msg = "获取验证码";
    that.codeIf = false;
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
                nozzle: "modify_login",
                token: that.$store.state.token,
                password: that.ruleForm2.pwd,
                confirm: that.ruleForm2.pwd1,
                code: that.ruleForm2.code
              }
            })
            .then(function(res) {
              if (res.data.code == 1) {
                that.$refs[formName].resetFields();
                that.$alert(res.data.msg, "成功", {
                  confirmButtonText: "确定",
                  type: "success",
                  showClose: "false",
                  callback: action => {
                    that.$router.push({
                      name: "login"
                    });
                  }
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    getCode() {
      let that = this;
      let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (reg.test(that.ruleForm2.phone)) {
        if (!that.codeIf) {
          that.codeIf = true;
          that.btn_msg = "60秒";
          window.t = setInterval(function() {
            that.time--;
            that.btn_msg = that.time + "秒";
            if (that.time <= 0) {
              that.codeIf = false;
              that.btn_msg = "获取验证码";
              clearInterval(window.t);
              that.time = 60;
            }
          }, 1000);
          that
            .$http({
              url: "/",
              method: "post",
              data: {
                nozzle: "modify_password",
                token: that.$store.state.token
              }
            })
            .then(function(res) {
              if (res.data.code == 1) {
                that.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 3000
                });
              } else {
                that.btn_msg = "获取验证码";
                clearInterval(window.t);
                that.time = 60;
                that.codeIf = false;
              }
            });
        }
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
  > .w_form {
    width: 404px;
    height: 100%;
    box-sizing: border-box;
    padding-top: 16px;
    font-size: 14px;
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
}
</style>


