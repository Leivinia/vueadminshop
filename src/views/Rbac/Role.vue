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
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                prop="id"
                label="编号"
                width="180">
                </el-table-column>
                <el-table-column
                prop="roleName"
                label="角色名"
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
                    ref="tree"
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
  import {getRoleList, getAuthList, changeRoleAuth} from '@/api'
  export default {
    mounted() {
        this.initList()
    },
    methods: {
        //更用户分配权限（数据处理）
        grantUserSubmit() {
            //获取当前选中的所有权限ID
            //this.$refs.标识   问：什么时候用的   表单验证   切记需要再el-tree 定义 tree标识
            var ids = this.$refs.tree.getCheckedKeys().join(',')
            //请求接口
            changeRoleAuth(this.currentRole.id, ids) 
            .then(res => {
                if (res.meta.status == 200) {
                    //弹框显示
                    this.$message({
                        message: '更新成功',
                        type: 'success',
                        duration: 1000
                    });
                    //关闭当前弹框
                    this.grantDialogFormVisible = false
                    //重新获取数据
                    this.initList()
                } else {
                  this.$message.error(returnData.meta.msg);
                }
            })
        },
        //弹框给角色分配权限（1-显示弹框，2-显示所有权限tree）
        showDialog(row) {
            //0.表格里面点击给用户授权按钮时，保存角色信息，这样后期点确定按钮事，可以获取角色ID
            this.currentRole = row

            //1.显示弹框
            this.grantDialogFormVisible = true
            //2.发送请求获取所有权限数据 authList
            getAuthList('tree')
            .then(res => {
                if (res.meta.status == 200) {
                    this.authList = res.data
                }
            })

            //3.存储当前角色拥有的三级权限ID
            //3.1避免累计 每次都清空
            this.defaultSelectedIds = []
            //3.2再存储当前角色拥有的三级ID
            row.children.forEach(first => {
                if (first.children && first.children.length !== 0) {
                    first.children.forEach(two => {
                        if (two.children && two.children.length !== 0) {
                            two.children.forEach(three => {
                                // three.id
                                this.defaultSelectedIds.push(three.id)
                            })
                        }
                    })
                }
            })
        },
        //初始化数据
        initList() {
            //请求接口 getRoleList
            getRoleList()
            .then(res => {
                if (res.meta.status == 200) {
                    //保存数据
                    this.tableData = res.data
                }
            })
        }
    },
    data() {
      return {
        //存放待授权的角色信息
        currentRole: '',
        //保存当前角色已有的权限ID （三级）
        defaultSelectedIds: [],
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
          children: 'children',
        //   label: 'label'
          label: 'authName'
        },

        tableData: [{
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