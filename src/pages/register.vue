<template>
  <div class="wrap">
    <div class="login_w">
      <div class="title">股票交易系统</div>
      <el-form
        :model="ruleForm2"
        status-icon
        :rules="rules2"
        ref="ruleForm2"
        label-width="100px"
      >
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model.number="ruleForm2.phone" placeholder="请输入登录手机号"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="code">
          <el-input class="code_input" v-model="ruleForm2.code" placeholder="请输入验证码"></el-input>
          <div class="code_div">
            <el-button class="code_btn" :disabled="bool" @click="getCode">{{btn_msg}}</el-button>
          </div>
        </el-form-item>
        <el-form-item label="密码：" prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" placeholder="请输入登录密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" placeholder="请再次输入登录密码"></el-input>
        </el-form-item>
        <el-form-item label="代理：" prop="other">
          <el-input v-model="ruleForm2.other" placeholder="选填"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn_div">
        <button class="btn" @click="submitForm('ruleForm2')">注册</button>
        <div class="link">
          <span>
            已有账号，
            <span class="f_c c_p" @click="toLogin">立即登录</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    var checkphone = (rule, value, callback) => {
      let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (!reg.test(value)) {
        return callback(new Error("手机号格式错误"));
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
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      time: 60,
      btn_msg: "获取验证码",
      bool: false,
      ruleForm2: {
        pass: "",
        checkPass: "",
        phone: "",
        code: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        phone: [{ validator: checkphone, trigger: "blur" }],
        code: [{ validator: checkcode, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  activated() {
    this.$refs['ruleForm2'].resetFields();
  },
  methods: {
    getCode() {
      let that = this;
      let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (reg.test(that.ruleForm2.phone)) {
        if (!that.bool) {
          that.bool = true;
          that.btn_msg = "60秒";
          window.t = setInterval(function() {
            that.time--;
            that.btn_msg = that.time + "秒";
            if (that.time <= 0) {
              that.bool = false;
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
                phone: that.ruleForm2.phone,
                token: that.$store.state.user_info.token
              }
            })
            .then(function(res) {
              if (res.data.code == 1) {
                that.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 1500
                });
              } else {
                that.$message({
                  message: res.data.msg,
                  type: "error",
                  duration: 1500
                });
                that.btn_msg = "获取验证码";
                clearInterval(window.t);
                that.time = 60;
                that.bool = false;
              }
            });
        }
      } else {
        that.$message({
          message: "请输入正确的手机号",
          type: "warning",
          duration: 1500
        });
      }
    },
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          that
            .$http({
              url: "/",
              method: "post",
              data: {}
            })
            .then(function(res) {
              if (res.data.code == 1) {
                that.$confirm("注册成功，立即登录", "成功", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "success"
                })
                  .then(() => {
                    this.toLogin();
                  })
                  .catch(() => {
                    
                  });
                this.$refs[formName].resetFields();
              } else {
                that.$message({
                  message: res.data.msg,
                  type: "error",
                  duration: 1500
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toLogin() {
      this.$router.push({
        name: "login"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../base/common.scss";
.wrap {
  width: 100%;
  height: 100%;
  background: url(../assets/bg0.png);
  background-size: 100% 100%;
  > div {
    .title {
      color: white;
      text-align: center;
      font-size: 36px;
      padding-bottom: 10vh;
    }
    width: 30%;
    margin: 0 auto;
    padding-top: 6vh;
    .code_div {
      float: right;
    }
    .btn_div {
      padding-top: 20px;
      .btn {
        @include btn(#5770c8, 4px);
        display: block;
        margin: 0 auto;
        width: 60%;
        line-height: 40px;
        font-size: 16px;
      }
      .link {
        width: 60%;
        margin: 0 auto;
        text-align: right;
        color: #969696;
        font-size: 14px;
        padding-top: 12px;
      }
    }
  }
}
</style>


