<template>
  <div id="app" @click.right="prevent($event)">
    <keep-alive>
      <router-view name="main"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import "./base/reset.scss"
export default {
  name: "App",
  data() {
    return {};
  },
  watch: {
    // 使用watch 监听$router的变化
    $route(to, from) {
      clearInterval(window.t);
      clearInterval(window.t_other);
      clearInterval(window.bot_stock);
    }
  },
  mounted() {
    let that = this;
  },
  methods: {
    prevent(e) {
      e.returnValue = false;
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  /* overflow: auto; */
}
/*webkit滚动条处理*/
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #2b2b2b;
  border: 1px solid #2b2b2b;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px #2b2b2b;
  background-color: #2b2b2b;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px #2b2b2b;
  background-color: #646464;
  border-radius: 4px;
}
* {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: Helvetica Neue, Helvetica, Hiragino Sans GB, Microsoft YaHei,
    \\5fae\8f6f\96c5\9ed1, Arial, sans-serif;
}
html {
  width: 100%;
  height: 100%;
}
body {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  // min-height: 800px;
  position: relative;
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
    background-color: rgb(173, 170, 170);
    border-radius: 10px;
  }
}
.btn {
  outline: none;
  cursor: pointer;
}
.btn:hover {
  opacity: 0.9;
}
.btn:active {
  opacity: 1;
}
.f_l {
  float: left;
}
.f_r {
  float: right;
}
.c_p {
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.clearfix::after,
.clearfix::before {
  content: "";
  height: 0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
.f_c {
  color: #5770c8;
}
.ta_c {
  text-align: center;
}
.ta_l {
  text-align: left;
}
.ta_r {
  text-align: right;
}
.yellow {
  color: #f0f888;
}
.red {
  color: #ff3232;
}
.green {
  color: #05c505;
}
.white {
  color: white;
}
.purple {
  color: #e016be;
}
.gray {
  color: #999;
}
.red1 {
  color: #e51c23;
}
.green1 {
  color: #259b24;
}
</style>

