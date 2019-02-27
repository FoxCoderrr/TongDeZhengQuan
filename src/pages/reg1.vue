<template>
  <div id="ww">
    <div id="wrapper">
        <div class="title">股票交易系统</div>
      <div class="cont">
        <div class="input-cont">
          <p>手机号：</p>
          <input class="phone" type="tel" maxlength="11" value placeholder="请输入手机号" v-model="phone">
        </div>
        <div class="input-cont">
          <p>验证码：</p>
          <div class="input-text">
            <input class="code" type="text" placeholder="请输入验证码" v-model="code">
            <button @click="getCode" class="fonget_send">获取验证码</button>
          </div>
        </div>
        <div class="input-cont">
          <p>邮箱：</p>
          <input class="email" type="text" placeholder="请输入邮箱账号" v-model="email">
        </div>
        <div class="input-cont">
          <p>密码：</p>
          <input class="pass" type="password" placeholder="请输入登录密码" v-model="pass">
        </div>
        <div class="input-cont">
          <p>确认密码：</p>
          <input class="confirm" type="password" placeholder="请再次输入登录密码" v-model="confirm">
        </div>
        <div class="input-cont" style="margin-bottom: 40px;">
          <p>推荐码：</p>
          <input class="push" type="text" placeholder="请输入代理推荐码" v-model="push">
        </div>
        <button class="button" @click="register">下一步</button>
      </div>
      <div class="link">
          <span>
            已有账号，
            <span class="f_c c_p" @click="toLogin">立即登录</span>
          </span>
        </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
export default {
  data() {
    return {
      globalUrl: "http://ayserve.bjfable.com/",
      phone: window.sessionStorage.getItem("phone")||"",
      code: "",
      netCode: window.sessionStorage.getItem("netCode")||"abc",
      email: window.sessionStorage.getItem("email")||"",
      pass: window.sessionStorage.getItem("pass")||"",
      confirm: window.sessionStorage.getItem("confirm")||"",
      push: window.sessionStorage.getItem("push")||""
    };
  },
  mounted() {},
  methods: {
    toLogin() {
      this.$router.push({
        name: "login"
      });
    },
    getCode() {
      let that = this;
      var phone = $(".phone").val();
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
        that.$message({
          message: "手机号格式错误",
          type: "error",
          duration: 1500
        });
      } else {
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "register_code",
              phone: phone
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              that.$message({
                message: res.data.msg,
                type: "success",
                duration: 3000
              });
              // that.netCode = res.data.msg.substr(res.data.msg.length - 6, 6);
              $(".fonget_send").attr("disabled", true);
              var time = 60;
              var str = time + "s";
              $(".fonget_send").html(str);
              var timer = setInterval(function() {
                time--;
                str = time + "s";
                $(".fonget_send").html(str);
                if (time <= 0) {
                  $(".fonget_send").attr("disabled", false);
                  $(".fonget_send").html("发送验证码");
                  clearInterval(timer);
                }
              }, 1000);
            }
          });
      }
    },
    register() {
      let that = this;
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.phone)) {
        that.$message({
          message: "手机号格式错误",
          type: "error",
          duration: 1500
        });
      } else if (that.code =="") {
        that.$message({
          message: "请输入验证码",
          type: "error",
          duration: 1500
        });
      } else if (
        !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
          that.email
        )
      ) {
        that.$message({
          message: "邮箱格式错误",
          type: "error",
          duration: 1500
        });
      } else if (that.pass == "") {
        that.$message({
          message: "请输入登录密码",
          type: "error",
          duration: 1500
        });
      } else if (that.confirm == "") {
        that.$message({
          message: "请再次输入登录密码",
          type: "error",
          duration: 1500
        });
      } else if (that.confirm != that.pass) {
        layer.msg("两次密码输入不一致", {
          icon: 15,
          time: 1500
        });
      } else if (that.push == "") {
        that.$message({
          message: "请输入代理人推荐码",
          type: "error",
          duration: 1500
        });
      } else {
        window.sessionStorage.setItem("phone", that.phone); //手机号
        window.sessionStorage.setItem("code", that.code); //验证码
        window.sessionStorage.setItem("email", that.email); //验证码
        window.sessionStorage.setItem("password", that.pass); //密码
        window.sessionStorage.setItem("reid", that.push); //推荐码
        that.$router.push({
            name:"reg2"
        })
        //				$.post(globalUrl, {
        //					nozzle: "register",
        //					phone: phone,
        //					code: code,
        //					password: pass,
        //					reid: push
        //				}, function(res) {
        //					if(res.code == 1) {
        //						layer.msg(res.msg, {
        //							icon: 6,
        //							time: 1500
        //						});
        //					} else {
        //						layer.msg(res.msg, {
        //							icon: 15,
        //							time: 1500
        //						});
        //					}
        //				});
      }
    }
  }
};
</script>
<style scoped>
.title {
      color: white;
      text-align: center;
      font-size: 36px;
      padding-bottom: 16px;
    }
#ww{
  padding-top: 6vh;
  width: 100%;
  height: 100%;
  background: url(../assets/bg0.png);
  background-size: 100% 100%;
  overflow: auto;
  padding-bottom: 20px;
}
</style>
