<template>
  <div id="ww">
    <div id="wrapper">
     <div class="title">股票交易系统</div>
      <div class="cont">
        <div class="input-cont">
          <p>开户银行：</p>
          <select name="bank" id="bank">
            <option v-for="(item,index) in bank_list" :key="index" value="item.id">{{item.bank}}</option>
          </select>
        </div>
        <div class="input-cont">
          <p>银行卡号：</p>
          <input class="bankCard" type="text" placeholder="请输入银行卡号" v-model="bankCard">
        </div>
        <div class="input-cont">
          <p>开户行地址：</p>
          <input class="bankAddress" type="text" placeholder="请输入开户行地址" v-model="bankAddress">
        </div>
        <div class="input-cont" style="margin-bottom: 40px;">
          <p>银行卡正面照：</p>
          <div id="upLoad2" class="upLoad">
            <img src alt>
          </div>
        </div>
        <button class="button" @click="register()">注册</button>
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
      bankAddress: "",
      bankCard: "",
      src: "",
      bank_list: [
        {
          id: 1,
          bank: "建设银行"
        },
        {
          id: 2,
          bank: "农业银行"
        },
        {
          id: 3,
          bank: "工商银行"
        },
        {
          id: 4,
          bank: "中国银行"
        },
        {
          id: 5,
          bank: "浦发银行"
        },
        {
          id: 6,
          bank: "光大银行"
        },
        {
          id: 7,
          bank: "平安银行"
        },
        {
          id: 8,
          bank: "兴业银行"
        },
        {
          id: 9,
          bank: "邮政储蓄银行"
        },
        {
          id: 10,
          bank: "中信银行"
        },
        {
          id: 11,
          bank: "华夏银行"
        },
        {
          id: 12,
          bank: "招商银行"
        },
        {
          id: 13,
          bank: "广发银行"
        },
        {
          id: 14,
          bank: "北京银行"
        },
        {
          id: 15,
          bank: "上海银行"
        },
        {
          id: 16,
          bank: "民生银行"
        },
        {
          id: 17,
          bank: "交通银行"
        }
      ]
    };
  },
  mounted() {
    //上传照片
    layui.use("upload", function() {
      var $ = layui.jquery,
        upload = layui.upload;
      //
      var uploadInst2 = upload.render({
        elem: "#upLoad2",
        url: "http://ayserve.bjfable.com/upload/",
        before: function(obj) {
          //预读本地文件示例，不支持ie8
          obj.preview(function(index, file, result) {
            $("#upLoad2 img").attr("src", result); //图片链接（base64）
          });
        },
        done: function(res) {
          if (res.data.code == 200) {
            //上传成功
            layer.msg("上传成功", {
              icon: 6,
              time: 1500
            });
            that.src = res.data.msg;
          } else {
            //失败
            layer.msg("上传失败");
          }
        },
        error: function() {
          //演示失败状态，并实现重传
          var demoText = $("#demoText");
          demoText.html(
            '<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>'
          );
          demoText.find(".demo-reload").on("click", function() {
            uploadInst.upload();
          });
        }
      });
    });
  },
  methods: {
    toLogin() {
      this.$router.push({
        name: "login"
      });
    },
    register() {
      var bankId = $("#bank option:selected").val();
      let that = this;
      if (!/^(\d{16}|\d{19})$/.test(that.bankCard)) {
        that.$message({
          message: "银行卡格式错误",
          type: "error",
          duration: 1500
        });
      } else if (that.bankAddress == "") {
        that.$message({
          message: "请输入开户行地址",
          type: "error",
          duration: 1500
        });
      } else {
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "register",
              phone: sessionStorage.getItem("phone"),
              code: sessionStorage.getItem("code"),
              email: sessionStorage.getItem("email"),
              password: sessionStorage.getItem("password"),
              reid: sessionStorage.getItem("reid"),
              name: sessionStorage.getItem("name"),
              card: sessionStorage.getItem("card"),
              positive: sessionStorage.getItem("positive"),
              other_side: sessionStorage.getItem("other_side"),
              bank_id: bankId,
              bank_card: that.bankCard,
              bank_address: that.bankAddress,
              bank_side: that.src
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              that.$vux.alert.show({
                title: "成功",
                content: "注册成功！",
                buttonText: "立即登录",
                onShow() {},
                onHide() {
                  that.$router.push({
                    name: "login"
                  });
                }
              });
            }
          });
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
