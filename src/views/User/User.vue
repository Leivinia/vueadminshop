<template>
    <div class="user">
      <el-row>
        <el-col :span="24">
          <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <!-- 给组件绑定原生事件的话，需要一个.native的修饰符 -->
          <el-input placeholder="请输入内容" class="search-input" v-model="query">
            <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
          </el-input>
          <el-button type="success" plain @click="addDialogFormVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table
        class="margin-20"
        v-loading="loading"
        :data="userList"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="showDeleteDialog(scope.row)"></el-button>
            <el-button size="mini" type="warning" plain icon="el-icon-check" @click="showRoleDialog(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[pagesize, 20, 30, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
 
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
        <el-form :model="addForm" label-width="80px" :rules="rules" ref="addUserForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserSubmit('addUserForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑用户对话框 -->
      <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
        <el-form :model="editForm" label-width="80px" :rules="rules" ref="editUserForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserSubmit('editUserForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
        <el-form :model="grantForm" label-width="120px">
          <el-form-item label="当前的用户：" prop="username">
            <el-tag type="info">{{grantForm.username}}</el-tag>
          </el-form-item>
          <el-form-item label="请选择角色：">
            <el-select v-model="roleId" placeholder="请选择角色">
              <el-option
                v-for="(role, index) in roleList"
                :key="index"
                :label="role.roleName"
                :value="role.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="grantDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="grantUserSubmit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>


<script>

//导入接口
import {getUserList, changeUserState, addUser, delUser, getUserinfoById, updateUserById} from '@/api'

export default {
    //页面加载完毕发送请求（获取用户列表数据）
    mounted() {
      //理论上：1-导入接口文件，2-调用getUserList方法
      //但是：实际上要考虑到后期可扩展性、所以这边调用initList方法去发送请求
      this.initList()
    },
    //声明模型数据
    data() {
        return {
        loading: true,
        userList: [
          {"id":1,"role_name":"超级管理员1","username":"admin","create_time":1486720211,"mobile":"12345678","email":"adsfad@qq.com","mg_state":true},
          {"id":2,"role_name":"超级管理员2","username":"admin","create_time":1486720211,"mobile":"12345678","email":"adsfad@qq.com","mg_state":true}
          ],
        query: '',
        total: 30,
        pagesize: 1,
        pagenum: 1,

        //###添加数据
        addDialogFormVisible: false,
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '电话不能为空' }
          ]
        },
        //###修改数据
        editDialogFormVisible: false,
        editForm: {
          username: '',
          email: '',
          mobile: '',
          id: 0
        },
        //分配角色
        grantDialogFormVisible: false,
        grantForm: {},
        roleId: '',
        roleList: [],
      }
    },
    //声明普通方法
    methods: {
      //编辑用户信息
      editUserSubmit()
      {
          //请求接口
          updateUserById(this.editForm.id, this.editForm)
          .then(returnData => {
              //判断
              if (returnData.meta.status == 200) {
                  //弹框提示
                  this.$message({
                    message: '更新成功',
                    type: 'success',
                    duration: 1000
                  });
                  //关闭窗口
                  this.editDialogFormVisible = false
                  //刷新
                  this.initList()
              } else {
                  this.$message.error(returnData.meta.msg);
              }
          })
      },
      //删除用户数据
      showDeleteDialog(row) {

        // console.log(row)
        // return;
        //调用接口
        delUser(row.id)
        .then(returnData => {
            //判断
            if (returnData.meta.status == 200) {
                //弹框提示
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration: 1000
                });
                //刷新
                this.initList()
            } else {
                this.$message.error(returnData.meta.msg);
            }
        })
      },
      //添加用户数据处理
      addUserSubmit(){
          //调用接口
          addUser(this.addForm)
          .then(returnData => {
              //判断
              if (returnData.meta.status == 201) {
                   //弹框提示
                   this.$message({
                    message: '添加成功',
                    type: 'success',
                    duration: 1000
                  });
                  //关闭弹框
                  this.addDialogFormVisible = false
                  //重新发送请求
                  this.initList()
              } else {
                this.$message.error(returnData.meta.msg);
              }
          })
      },
      //初始化数据
      initList() {
        //发送请求
        getUserList({
          query: this.query, //条件
          pagesize: this.pagesize,
          pagenum: this.pagenum
        })
        .then(returnData => {
            if (returnData.meta.status == 200) {
              this.userList = returnData.data.users   //设置数据
              this.total = returnData.data.total      //总条数
              this.loading = false                    //关闭加载框
            }
        })
      },
      // initList() {
      //     //1.在上面先导入接口
      //     //2.再调用
      //     getUserList({
      //       query: this.query,
      //       pagenum:	 this.pagenum,
      //       pagesize: this.pagesize
      //     })
      //     .then(returnData => {
      //       console.log(returnData) //returnData是一个对象   里面有返回的数据（data和meta）
      //                               //如果接口文件那边不优化，以后我就得returnData.data.data 或 returnData.data.meta
      //                               //现在因为接口做了优化，所以可以通过returnData.data 或 returnData.meta 直接获取到值
      //       if (returnData.meta.status == 200) {
      //         //将数据放到模型中，然后视图获取（因为页面html  table标签上 通过:data绑定的就是userList所以也给他赋值）
      //         this.userList = returnData.data.users
      //       }
      //     })
      //     .catch(err => {
      //       console.log(err)
      //     })
      // },
    //显示编辑用户对话框
    showEditDialog: function (row) {
        this.editDialogFormVisible = true
        // this.editForm.username = '测试数据12'
        // this.editForm.email = '测试数据123'
        // this.editForm.mobile = '测试数据123'
        // this.editForm.id = '测试数据'

        // 请求接口获取用户数据
        getUserinfoById(row.id)
        .then(returnData => {
          //判断
          if (returnData.meta.status == 200) {
            this.editForm.username = returnData.data.username
            this.editForm.email = returnData.data.email
            this.editForm.mobile = returnData.data.mobile
            this.editForm.id = returnData.data.id
          }
        })
    },
    //显示分配角色对话框
    showRoleDialog (row) {
        this.grantForm = row
        this.grantDialogFormVisible = true
        this.roleList = [
        {id: 1, roleName: '你爸爸1'},
        {id: 2, roleName: '你爸爸2'},
        {id: 3, roleName: '你爸爸3'},
        ]
    },
    //改变用户状态
    changeUserState (row) {
        console.log(row)
        //请求接口修改数据库状态
        changeUserState(row.id, row.mg_state)
        .then(returnData => {
            if (returnData.meta.status == 200) {
                 this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1000
                });
            } else {
                 this.$message({
                  message: returnData.meta.msg,
                  type: 'error',
                  duration: 1000
                });
            }
        })
    },
    handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
        // //1.改变模型数据  pagenum
        this.pagenum = val
        // //2.重新发送请求
        this.initList()
    }
    }
}
</script>



<style scoped>
.user .margin-20 { 
margin: 20px 0;
}
.user .search-input {
width: 300px;
}
.user .page {
padding: 5px 0;
background-color: #D3DCE6;
}
</style>