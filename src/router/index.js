import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index   from '@/views/Index/Index'
import Welcome from '@/views/Index/Welcome'
import User  from '@/views/User/User'
import Auth  from '@/views/Rbac/Auth'
import Role  from '@/views/Rbac/Role'
import Category  from '@/views/Goods/Category'
// import Auth  from '@/views/Rbac/Auth'
// import Role  from '@/views/Rbac/Role'
import Login from '@/views/Login'
 
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      //通过children声明子组件（父要不要挖坑显示子  要）
      //访问规则：/父路径/子路径
      children: [
        {path:'welcome', name:'Welcome', component:Welcome},
        {path:'user', name:'User', component:User},
        {path:'auth', name:'Auth', component:Auth},
        {path:'role', name:'Role', component:Role},
        {path:'category', name:'Category', component:Category}
        // {path:'auth', name:'Auth', component:Auth},
        // {path:'role', name:'Role', component:Role}
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
