
<template>
    <div class="user">
      <el-row>
        <el-col :span="24">
          <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
      </el-row>
      <!-- 表格代码手动删除 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名"
          width="180">
        </el-table-column>
        <!-- <el-table-column
          prop="level"
          label="层级">
        </el-table-column> -->
        <el-table-column label="层级">
            <template slot-scope="scope">
                {{ scope.row.level | fmtLevel }}
            </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
import {getAuthList} from '@/api'

export default {
  filters: {
      fmtLevel(level) {
            if (level == 0) {
                return '一级'
            } else if (level == 1) {
                return '二级'
            } else {
                return '三级'
            }
      }
  },
  data() {
    return {
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04', 
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      loading: false
    }
  },
  //页面加载时触发
  created: function() {
      this.initList()
  },
  methods: {
    //初始化表单数据
    initList: function() {
        //显示loading
        this.loading = true;
        //发送异步请求
        getAuthList('list')
        .then(res => {
            if (res.meta.status == 200) {
                this.tableData = res.data
            }
        })
        //隐藏loading
        this.loading = false;
    }
  }
}
</script>

<style scoped>
</style>