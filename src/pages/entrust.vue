<template>
  <div class="wrap">
    <div class="list_table">
      <div class="d_table" v-loading="loading">
        <el-table :data="tableData3" style="width: 100%" height="100%" @cell-click="deleteS">
          <el-table-column fixed prop="order" label="订单编号" width="150"></el-table-column>
          <el-table-column fixed prop="code" label="股票代码"></el-table-column>
          <el-table-column fixed prop="name" label="股票名称"></el-table-column>
          <el-table-column prop="entrust_price" label="委托价"></el-table-column>
          <el-table-column prop="price_" label="现价"></el-table-column>
          <el-table-column prop="number" label="手数"></el-table-column>
          <el-table-column prop="mold" label="类型" width="70"></el-table-column>
          <el-table-column prop="direction" label="方向" width="70"></el-table-column>
          <el-table-column prop="fee" label="手续费"></el-table-column>
          <el-table-column prop="stamp" label="印花税"></el-table-column>
          <el-table-column prop="interest" label="融资利息"></el-table-column>
          <!-- <el-table-column prop="profit" label="浮动盈亏"></el-table-column> -->
          <el-table-column prop="time" label="交易时间" width="150"></el-table-column>
          <el-table-column fixed="right" prop="action" label="操作" width="70" class-name="delete_td"></el-table-column>
        </el-table>
      </div>
      <div class="d_page ta_r">
        <el-pagination background layout="prev, pager, next" :total="sum" @current-change="getList"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery"
export default {
  data() {
    return {
      page: 1,
      loading: false,
      page: 1,
      size: 10,
      sum: 0,
      tableData3: [],
    };
  },
  mounted() {},
  activated() {
    let that = this;
    that.page = 1;
    that.getList(that.page);
  },
  methods: {
    deleteS(row, column, cell, event) {
      if(column.property!="action"){
        return false;
      }
      let that = this;
      that
        .$confirm("确定要撤销该单吗？", "撤单", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "cancel_entrust",
            token: that.$store.state.token,
            mark:row.id
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            that.$message({
              message: res.data.msg,
              type: "success",
              duration: 1500
            });
            that.getList(that.page);
          }
        });
        })
        .catch(() => {});
    },
    getList(p) {
      let that = this;
      that.loading = true;
      that.page = p;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "entrust_log",
            token: that.$store.state.token,
            page: p,
            num: that.size
          }
        })
        .then(function(res) {
          that.loading = false;
          if (res.data.code == 1) {
            that.sum = Number(res.data.data.page) * Number(that.size);
            if (res.data.data.data.length) {
              let arr1=[];
              let self={};
              for(let v of res.data.data.data){
                if(v.short != that.$store.state.self_short){
                  arr1.push(v)
                }else{
                  self = v;
                }
              }

              $.ajax({
                cache: true,
                url: "http://qt.gtimg.cn/q=" + arr1.toString(),
                type: "GET",
                dataType: "script",
                success: function() {
                  let p_arr = [];
                  for (let i in arr1) {
                    let a = eval("v_" + arr1[i].short).split("~");
                    p_arr.push(a[3]);
                  }
                  for(let i in arr1){
                    arr1[i].action = "撤单";
                    arr1[i].price_ = p_arr[i];
                  }
                  that.tableData3 = arr1;
                  that
                    .$http({
                      url: "/",
                      method: "post",
                      data: {
                        nozzle: "detailed"
                      }
                    })
                    .then(function(res1) {
                      self.price_ = res1.data.data[3];
                      self.action = "撤单";
                      that.tableData3.push(self);
                    })
                }
              });
            }
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 304px;
  .list_table {
    border-left: 1px solid #ddd;
    height: 100%;
    .d_table {
      height: calc(100% - 56px);
      margin-bottom: 16px;
    }
  }
}
</style>


