<template>
  <div class="category">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-button type="success" plain @click="addCategory">添加分类</el-button>
      </el-col>
    </el-row>

    <tree-grid
      v-loading="loading"
      :treeStructure="true"
      :columns="columns"
      :data-source="dataSource"
      @deleteCate="deleteCategory"
      @editCate="editCategory"
    ></tree-grid>

    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[pagesize, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" label-width="80px" :rules="rules" ref="addCateForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            :options="options"
            v-model="selectedOptions"
            :props="props"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateSubmit('addCateForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TreeGrid from "@/components/TreeGrid/TreeGrid";
import { getGoodsCateList ,addCategories} from "@/api";
export default {
  data() {
    return {
        //添加相关数据
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      options: [// 级联选择器的数据源
        {
          "cat_id": 1,
          "cat_name": "A1",
          "cat_pid": 0,
          "cat_level": 0,
          "cat_deleted": false,
          "children": [
            {"cat_id": 11, "cat_name": "B1","cat_pid": 1,"cat_level": 1, "cat_deleted": false},
            {"cat_id": 12, "cat_name": "B2","cat_pid": 1,"cat_level": 1, "cat_deleted": false},
          ]
        },
        {
          "cat_id": 2,
          "cat_name": "A2",
          "cat_pid": 0,
          "cat_level": 0,
          "cat_deleted": false,
          "children": [
            {"cat_id": 21, "cat_name": "B1","cat_pid": 1,"cat_level": 1, "cat_deleted": false},
            {"cat_id": 22, "cat_name": "B2","cat_pid": 1,"cat_level": 1, "cat_deleted": false},
          ]
        },
      ],  
      selectedOptions: [],  // 级联选择器选中后的数据
      props: { // props表示配置级联选择器展示的数据字段
        value: 'cat_id',
        label: 'cat_name'
      },
      addDialogFormVisible: false,
      loading: false,
      //分页参数
      total: 0,
      pagenum: 1,
      pagesize: 10,
      //TreeGrid
      dataSource: [
        {
          cat_id: 1,
          cat_name: "AAA",
          cat_pid: 0,
          cat_level: 0,
          cat_deleted: false,
          children: [
            {
              cat_id: 3,
              cat_name: "B1",
              cat_pid: 1,
              cat_level: 1,
              cat_deleted: false,
              children: []
            },
            {
              cat_id: 3,
              cat_name: "B2",
              cat_pid: 1,
              cat_level: 1,
              cat_deleted: false,
              children: []
            }
          ]
        },
        {
          cat_id: 1,
          cat_name: "大家电",
          cat_pid: 0,
          cat_level: 0,
          cat_deleted: false,
          children: [
            {
              cat_id: 3,
              cat_name: "电视",
              cat_pid: 1,
              cat_level: 1,
              cat_deleted: false,
              children: [
                {
                  cat_id: 7,
                  cat_name: "海信",
                  cat_pid: 3,
                  cat_level: 2,
                  cat_deleted: false
                },
                {
                  cat_id: 8,
                  cat_name: "夏普",
                  cat_pid: 3,
                  cat_level: 2,
                  cat_deleted: false
                }
              ]
            }
          ]
        }
      ],
      columns: [
        {
          text: "分类名称",
          dataIndex: "cat_name",
          width: ""
        },
        {
          text: "是否有效",
          dataIndex: "cat_deleted",
          width: ""
        },
        {
          text: "排序",
          dataIndex: "cat_level",
          width: ""
        }
      ]
    };
  },
  //声明页面组件
  components: {
    TreeGrid
  },
  //加载页面时候触发
  created() {
    this.initList();
  },
  methods: {
    //初始化表格数据
    initList() {
      this.loading = true;
      getGoodsCateList(3, this.pagenum, this.pagesize).then(res => {
        if (res.meta.status == 200) {
          this.dataSource = res.data.result;
          this.total = res.data.total;
          this.loading = false;
        }
      });
    },
    //###分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.initList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.initList();
    },
    //TreeGrid
    deleteCategory(cid) {
      console.log(cid);
    },
    editCategory(cid) {
      console.log(cid);
    },
    handleChange (value) {
      console.log(value)
    },
    //显示添加框
    addCategory () {
      this.addDialogFormVisible = true
      getGoodsCateList(2,1,1000).then(res=>{
          if(res.meta.status==200){
              this.options=res.data.result
          }
      })
    }
  }
};
</script>
<style scoped>
.page {
  padding: 5px 0;
  background-color: #d3dce6;
}
</style>