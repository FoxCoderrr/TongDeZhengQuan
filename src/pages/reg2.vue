<template>
  <div id="ww">
    <div id="wrapper">
      <div class="title">股票交易系统</div>
      <div class="cont">
        <div class="input-cont">
          <p>真实姓名：</p>
          <input class="name" type="text" placeholder="请输入真实姓名" v-model="name">
        </div>
        <div class="input-cont">
          <p>身份证号：</p>
          <input class="card" type="text" placeholder="请输入身份证号" v-model="card">
        </div>
        <div class="input-cont">
          <p>身份证正面照：</p>
          <div id="upLoad1" class="upLoad">
            <img src alt>
          </div>
        </div>
        <div class="input-cont" style="margin-bottom: 40px;">
          <p>身份证背面照：</p>
          <div id="upLoad2" class="upLoad">
            <img src alt>
          </div>
        </div>
        <button class="button" @click="register()">下一步</button>
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
      name: window.sessionStorage.getItem("name")||"", //姓名
      card: window.sessionStorage.getItem("card")||"", //身份证号
      positive: window.sessionStorage.getItem("positive")||"", //正面照 url
      otherSide: window.sessionStorage.getItem("otherSide")||"" //反面 url
    };
  },
  mounted() {
      let that = this;

    //上传正反面照片
    layui.use("upload", function() {
      var $ = layui.jquery,
        upload = layui.upload;
      //普通图片上传
      var uploadInst1 = upload.render({
        elem: "#upLoad1",
        url: "http://ayserve.bjfable.com/upload/",
        before: function(obj) {
          //预读本地文件示例，不支持ie8
          obj.preview(function(index, file, result) {
            $("#upLoad1 img").attr("src", result); //图片链接（base64）
          });
        },
        done: function(res) {
          //上传成功
          if (res.data.code == 200) {
            layer.msg("上传成功", {
              icon: 6,
              time: 1500
            });
            that.positive = res.data.msg;
          } else {
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
            that.otherSide = res.data.msg;
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
        let that = this;
      if (that.name == "") {
        that.$message({
          message: "请输入真实姓名",
          type: "error",
          duration: 1500
        });
      } else if (!/^\d{17}(\d|x)$/i.test(card)) {
        that.$message({
          message: "身份证号格式错误",
          type: "error",
          duration: 1500
        });
      } else if (that.positive == "") {
        that.$message({
          message: "请上传身份证正面照片",
          type: "error",
          duration: 1500
        });
      } else if (that.otherSide == "") {
        that.$message({
          message: "请上传身份证背面照片",
          type: "error",
          duration: 1500
        });
      } else {
        window.sessionStorage.setItem("name", name);
        window.sessionStorage.setItem("card", card);
        window.sessionStorage.setItem("positive", info.positive);
        window.sessionStorage.setItem("other_side", info.otherSide);
        that.$router.push({
            name:"reg3"
        })
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
