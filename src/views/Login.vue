<template>
  <div class="login">
      <el-form ref="form" :rules="rules" :model="form" class="container" >
        <el-form-item>
          <div class="avatar">
            <img src="../assets/img/avatar.jpg" alt="">
          </div>
        </el-form-item>
        <!-- 
        语法：prop="验证规则中的键"
        作用：设置校验
         -->
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="账户" prefix-icon="myicon myicon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="密码" prefix-icon="myicon myicon-key" type="password" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="loginSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
//以前：引入axios文件
//现在：导入axios模块，所以导入前需要先安装（npm install axios）
// import axios from 'axios'
// 优化后的
   import {checkUser} from '@/api'

export default {
  //声明普通方法
  methods: {
    //表单登录处理
    loginSubmit() {
      //重新触发表单验证：验证通过-发送异步请求，验证失败-不管框框会自动变红（提示）
      //注：下述的form需要在表单的form标签上写【ref="标识"】
      this.$refs.form.validate(valid => {
          //判断
          if (valid) {
            // alert('验证通过，待发送异步请求')
            // axios.post('http://localhost:8888/api/private/v1/login', this.form)
            checkUser(this.form)
            .then(returnData => {
              // console.log(returnData)  
              // return; 
              // 发现：returnData 是一个大对象
              // 思考：如何获取接口返回的数据？ 答：returnData.data可以获取返回的data和meta数据
              // 思考：如何校验是否登录成功？   答：看meta.status是200则登录成功，否则都失败
              // if (returnData.data.meta.status == 200) {
              //   //登录成功，现在先弹框提示，后期跳转到后台首页
              //   // alert('登录成功')   太丑，则使用element-ui组件
              //   this.$message({
              //     message: '登录成功，后期跳转到后台首页',
              //     type: 'success',  //error/warning....
              //     duration: 1000
              //   });
              // } else {
              //   // alert(returnData.data.meta.msg)
              //   this.$message.error(returnData.data.meta.msg);
              // }

              //优化后的代码，减少data这个属性操作
              if (returnData.meta.status == 200) {
                // this.$message({
                //   message: '登录成功，后期跳转到后台首页',
                //   type: 'success',
                //   duration: 1000
                // });
                //1.保存登录信息
                localStorage.setItem('mytoken', returnData.data.token)
                localStorage.setItem('username', returnData.data.username)
                //2.跳转首页
                this.$router.push({name: 'Welcome'})  //跳转到指定名称的路由
              } else {
                this.$message.error(returnData.meta.msg);
              }
            })
            .catch(err => {
              console.log(err)
            })
          }
      })
    }
  },
  //声明组件模型数据
  data() {
    //在模型返回对象前  可以做一些操作
    var usernameLength = (rule, value, callback) => {
      // value是用户输入的数据
      // 成功：callback()
      // 失败：callback(new Error(错误信息))
      if (value.length < 3) {
        callback(new Error('用户名至少3个字符'))
      } else {
        callback()
      }
    } 
    //固定语法返回对象
    return {
        //表单双向绑定数据同步
        form: {
          username: '',
          password: ''
        },
        //声明表单验证规则
        rules: {
          //键就写表单要验证的数据
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            // 官方封装好的规则
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            // 自定义验证规则
            // 语法：{ validator: 变量名, trigger: 'blur' }
            { validator: usernameLength , trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
    }
  }
}
</script>

<style>
.login {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #2f4050;
  }
  .login .container {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 0px 40px 15px 40px;
      margin: 200px auto;
      background: white;
  }
  .login .container .avatar {
        position: relative;
        left: 50%;
        width: 120px;
        height: 120px;
        margin-left: -60px;
        margin-top: -60px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 10px solid #fff;
        box-shadow: 0 1px 5px #ccc;
        overflow: hidden;
  }
  .login .container .login-btn { width: 100%; }
</style>
