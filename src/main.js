// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI) 

//引入初始化css代码
import '@/assets/css/index.css'
 
Vue.config.productionTip = false

//导航守卫（监控路由变化）
router.beforeEach((to, from, next) => {
  // to.path             新路由
  // from.path           旧路由
  // next()              向下匹配
  // next({path: 路径})  跳转指定路由
  var mytoken = localStorage.getItem('mytoken')
  //如果访问的不是登录页 && 并且没有登录信息（token）就去登录页
  if (to.path != '/login' && !mytoken) {
    next({path: '/login'})
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
