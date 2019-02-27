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
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
        <el-table-column label="层级">
          <template slot-scope="scope">
            <span>{{scope.row.level | fmtLevel}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
import {getAuthList} from '@/api'

export default {
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
        getAuthList('list').then(res => {
          if (res.meta.status === 200) {
            //更新数据
            this.tableData = res.data
            //隐藏loading
            this.loading = false;
          }
        })
    }
  },
  filters: {
    fmtLevel (level) {
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
  }
}
</script>

<style scoped>
</style>