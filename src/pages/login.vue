<template>
  <div class="wrap">
    <div class="login_w">
      <div class="title">股票交易系统</div>
      <el-form status-icon label-width="100px">
        <el-form-item label="登录账号：">
          <el-input v-model="phone" @keyup.native.enter="sub" placeholder="请输入登录手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="登录密码：">
          <el-input
            type="password"
            v-model="pwd"
            @keyup.native.enter="sub"
            placeholder="请输入登录密码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码：">
          <el-input
            class="code_input"
            type="text"
            v-model="code"
            placeholder="请输入验证码"
            clearable
            @keyup.native.enter="sub"
          ></el-input>
          <div class="code_div">
            <s-identify :identifyCode="identifyCode" @refreshcode="getIcode"></s-identify>
          </div>
        </el-form-item>
      </el-form>
      <div class="btn_div">
        <button class="btn" @click="sub">登录</button>
        <div class="link">
          <span>
            没有账号，
            <span class="f_c c_p" @click="toReg">去注册</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SIdentify from "../components/icode";
export default {
  data() {
    return {
      phone: "",
      pwd: "",
      code: "",
      identifyCode: "",
      identifyCodes: "123456789"
    };
  },
  components: {
    SIdentify
  },
  mounted() {
    let that = this;
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
          that.$store.state.self_short = res.data.data[0];
        }
      });
  },
  activated() {
    let that = this;
    if (localStorage.getItem("acc")) {
      that.$nextTick(function() {
        that.phone = localStorage.getItem("acc");
      });
    }
    that.getIcode();
    this.phone = "";
    this.pwd = "";
    this.code = "";
  },
  methods: {
    sub() {
      let that = this;
      let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      // if (!reg.test(that.phone)) {
      //   that.$message({
      //     message: "手机号格式错误",
      //     type: "error",
      //     duration: 1500
      //   });
      //   return false;
      // }
      if (that.phone == "") {
        that.$message({
          message: "请输入账号",
          type: "error",
          duration: 1500
        });
        return false;
      }
      if (!that.pwd) {
        that.$message({
          message: "请输入登录密码",
          type: "error",
          duration: 1500
        });
        return false;
      }
      if (that.code != that.identifyCode) {
        that.$message({
          message: "验证码输入错误",
          type: "error",
          duration: 1500
        });
        that.refreshCode();
        return false;
      }
      const loading = this.$loading({
        lock: true,
        text: "正在登录...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "login",
            phone: that.phone,
            password: that.pwd
          }
        })
        .then(function(res) {
          loading.close();
          if (res.data.code == 1) {
            that.$router.push({
              name: "buy"
            });
            localStorage.setItem("acc", that.phone);
            that.$store.state.token = res.data.data.token;
            sessionStorage.setItem("token", res.data.data.token);
            window.assets = setInterval(()=>{
              fun();
            },3000)
            function fun() {
              that
                .$http({
                  url: "/",
                  method: "post",
                  data: {
                    nozzle: "account",
                    token: that.$store.state.token
                  }
                })
                .then(function(res) {
                  if (res.data.code == 1) {
                    that.$store.commit("setAssets", res.data.data);
                  }
                });
            }
          }
        });
    },
    getIcode() {
      this.code = "";
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    },
    toReg() {
      window.open("http://ayweb.bjfable.com/register/index.html");
      // this.$router.push({
      //   name: "register"
      // });
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
    width: 400px;
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
        width: 200px;
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


