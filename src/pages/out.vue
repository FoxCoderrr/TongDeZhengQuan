<template>
  <div class="wrap">
    <div>
      <div class="date_div">
        <el-date-picker
          v-model="value"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        ></el-date-picker>
        <el-button class="date_btn" @click="search" :loading="bool">查询</el-button>
      </div>
      <div class="list_table">
        <div class="d_table" v-loading="loading">
          <el-table :data="tableData3" style="width: 100%" height="100%">
            <el-table-column prop="time" label="申请时间" width="150px"></el-table-column>
            <el-table-column prop="number" label="申请金额"></el-table-column>
            <el-table-column prop="fee" label="手续费"></el-table-column>
            <el-table-column prop="total" label="实际金额"></el-table-column>
            <el-table-column prop="status" label="出金状态"></el-table-column>
            <el-table-column prop="card" label="出金账户" width="180px"></el-table-column>
            <el-table-column prop="pay_time" label="处理时间" width="150px"></el-table-column>
          </el-table>
        </div>
        <div class="d_page ta_r">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="sum"
            @current-change="getList"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: "",
      loading: false,
      bool: false,
      page: 1,
      size:10,
      sum:0,
      date: [],
      tableData3: []
    };
  },
  mounted() {},
  activated() {
    let that = this;
    that.page = 1;
    that.getList(that.page);
  },
  methods: {
    changeDate(v){
      if(v==null){
        this.page = 1;
        this.date=[];
        this.getList(this.page);
      }
    },
    search() {
      let that = this;
      if (that.value) {
        that.date = that.value;
        that.getList(that.page);
      } else {
        that.$message({
          message: "请选择日期",
          type: "error",
          duration: 1500
        });
      }
    },
    getList(p) {
      let that = this;
      that.loading = true;
      that.page = p;
      let data = {};
      if (that.date) {
        data = {
          nozzle: "withdraw_log",
          token: that.$store.state.token,
          page: p,
          num: that.size,
          start: that.date[0],
          end: that.date[1]
        };
      } else {
        data = {
          nozzle: "withdraw_log",
          token: that.$store.state.token,
          page: p,
          num: that.size,
        };
      }
      that
        .$http({
          url: "/",
          method: "post",
          data: data
        })
        .then(function(res) {
          that.loading = false;
          if (res.data.code == 1) {
            that.sum = Number(res.data.data.page)*Number(that.size);
            if(res.data.data.data){
              that.tableData3 = res.data.data.data;
            }
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  padding-top: 12px;
  box-sizing: border-box;
  border-left: 1px solid #ddd;
  height: 304px;
  > div {
    height: 100%;
    .date_div {
      padding-left: 20px;
      padding-bottom: 12px;
      .date_btn {
        margin-left: 12px;
      }
    }
    .list_table {
      height: calc(100% - 53px);
      .d_table {
        height: calc(100% - 56px);
        margin-bottom: 16px;
      }
    }
  }
}
</style>


