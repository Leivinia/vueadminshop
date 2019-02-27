<template>
    <div>
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <div>
            <el-button type="primary" plain>添加角色</el-button>
        </div>

        <div style="margin-top: 10px">
            <el-table
                :data="roleList"
                border
                style="width: 100%">
                <el-table-column
                prop="id"
                label="编号"
                width="180">
                </el-table-column>
                <el-table-column
                prop="roleName"
                label="角色名称"
                width="180">
                </el-table-column>
                <el-table-column
                prop="roleDesc"
                label="描述"
                width="180">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" plain icon="el-icon-edit"></el-button>
                        <el-button size="mini" type="warning" plain icon="el-icon-delete"></el-button>
                        <!-- <el-button size="mini" type="danger" plain icon="el-icon-check" @click="grantDialogFormVisible = true"></el-button> -->
                        <el-button size="mini" type="danger" plain icon="el-icon-check" @click="showDialog(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        
        <!-- 分配角色对话框 -->
        <el-dialog title="授权角色" :visible.sync="grantDialogFormVisible">
                <el-tree
                    :data="authList"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[2, 3]"
                    :default-checked-keys="defaultSelectedIds"
                    :props="defaultProps">
                </el-tree>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="grantDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="grantUserSubmit()">确 定</el-button>
                </div>
        </el-dialog>
    </div>
</template>


<script>
  //导入接口
  import {getRoleList,getAuthList} from '@/api'
  
  export default {
    //页面加载时触发
    created () {
      this.initList()
    },
    methods: {
      //给角色分配权限弹框（注：row是当前行数据 也就是当前行角色信息数据）
      showDialog(row) {
          //显示弹框
          this.grantDialogFormVisible = true
          //发送异步请求获取所有权限数据（tree）   res => result => response
          getAuthList('tree')
          .then(res => {
            if (res.meta.status == 200) {
                //跟新模型数据
                this.authList = res.data
            }
          })


          //row当前角色信息
          //row.children   当前角色拥有的权限
          //操作：通过遍历保存当前角色拥有的权限  三级编号 
          //脚下留心：每次点击弹框都要清空
          this.defaultSelectedIds = []
          //重新追加当前角色已经选中的权限ID
          row.children.forEach(first => {
             if (first.children && first.children.length !== 0) {
                first.children.forEach(two => {
                   if (two.children && two.children.length !== 0) {
                      two.children.forEach(three => {
                        //  three.id
                        this.defaultSelectedIds.push(three.id)
                      })
                   }
                })
             }
          })
      },
      //初始化表格数据
      initList () {
        //发送请求
        getRoleList().then(res => {
          if (res.meta.status === 200) {
            console.log(res)
            this.roleList = res.data
          }
        })
      },
    },
    data() {
      return {
        //给角色分配权限的
        grantDialogFormVisible: false, //隐藏弹框
        //分类树
        //  data2: [{
         authList: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',  //声明子节点是哪个字段
          // label: 'label'   声明分类树名称用哪个字段
          label: 'authName'
        },
        //默认选中的三级ID
        defaultSelectedIds: [],

        // tableData: [{
        roleList: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    }
  }
</script>