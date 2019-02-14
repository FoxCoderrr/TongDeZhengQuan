<template>
  <div class="wrap" v-html="info"></div>
</template>
<script>
export default {
  data() {
    return {
        info:"",
    };
  },
  mounted() {
    let that = this;
    // 系统通知
    that
      .$http({
        url: "/",
        method: "post",
        data: {
          nozzle: "risk_revelation"
        }
      })
      .then(function(res) {
        if (res.data.code == 1) {
          that.info = res.data.data;
        }
      });
  },
  activated() {
    let that = this;
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.wrap {
  padding: 16px;
  height: 304px;
  box-sizing: border-box;
  overflow: auto;
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
}
</style>


