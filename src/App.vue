<template>
  <div class="main-wrapper">
    <el-form :inline="true" class="demo-form-inline" size="small">
      <el-form-item>
        <el-input
          clearable
          v-model="input"
          placeholder="请输入内容"
          @input="inputSearch"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native="getList" :disabled="btnDisable"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 800px" border size="small">
      <el-table-column prop="date" label="日期" width="200"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="200"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data: () => ({
    input: '',
    inputSearch: null,
    btnDisable: false,
    tableData: []
  }),
  created() {
    this.inputSearch = this.debounce(this.getList, 2000)
  },
  methods: {
    // 函数防抖
    debounce(func, wait) {
      let timeout
      return function() {
        timeout && clearTimeout(timeout)
        timeout = setTimeout(func, wait)
      }
    },
    // 函数节流
    throttle(func, wait) {
      let timeout
      return function() {
        if (!timeout) {
          timeout = setTimeout(function() {
            timeout = null
            func()
          }, wait)
        }
      }
    },
    getList() {
      // this.btnDisable = true
      this.$axios
        .get('//ypwork.zhuanzhuan.com/api/getList')
        .then(({ data }) => {
          this.tableData = data.data
        })
        // .finally(() => (this.btnDisable = false))
    }
  }
}
</script>
<style scoped>
.main-wrapper {
  padding: 20px;
}
</style>
