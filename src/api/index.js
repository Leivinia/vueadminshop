//1.引入axios模块
import axios from 'axios'

//2.定义所有接口请求网址（注：这么一写后期发送请求就是当前网址 + 请求路径）
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

//3.添加请求拦截器
axios.interceptors.request.use(function (config) {
    //1.获取token
    var token = localStorage.getItem('mytoken')
    //2.判断
    if (token) {
        //设置请求头（后期请求接口 http请求头携带Authorization参数）
        config.headers['Authorization'] = token
    }
    return config
}, function (error) {
    // Do something with request error
    return Promise.reject(error)
})

// 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//     //判断请求方式
//     // if(config.method === 'post') {
//     //     //发送数据编码格式（form表单默认格式）
//     //     config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
//     //     //过滤请求数据
//     //     config.transformRequest = [function (data, headers) {
//     //         return '键=值&...&键n=值n'; //声明表单发送的数据
//     //     }];
//     // }
//     //1.获取mytoken
//     var mytoken = localStorage.getItem('mytoken') 
//     //2.设置请求头
//     if (mytoken) {
//         config.headers['Authorization'] = mytoken;
//     }
//     return config
// }, function (error) {
//     return Promise.reject(error)
// })

//2.定义成员并导出（ES6）
//导出语法：export 修饰符 变量名 = 值
//导入语法：import {变量名,...,变量名n} from '@/api'  注：不写文件则默认index.js


//检测用户
export const checkUser = params => {  //params => {username:xxx, password:xxxx}
    // 问题this.form需要变成方法的变量
    // return axios.post('http://localhost:8888/api/private/v1/login', this.form)

    // 问题url需要优化  便于后期维护
    // return axios.post('http://localhost:8888/api/private/v1/login', params)

    // 优化url
    // return axios.post('login', params)
    
    // 继续优化，减少获取值
    // return axios.post('login', params).then(returnData => {
    //     returnData.data 这里面有 data和meta
    // })
    return axios.post('login', params).then(res => res.data)
}

// export const getUserList  = getDataObj => {  //getDataObj对象 => query	pagenum	 pagesize
//     // return axios.get('users', 参数)  
//     // 1.  users?键1=值1&....&键n=值n
//     // 2.  {params: 对象}
//                                     //axios是基于promise封装
//                                     //promise第一个then的值会交给第二个then的值
//     return axios.get('users', {params: getDataObj}).then(function(returnData){
//         return returnData.data
//     })
// }


//获取用户列表数据
export const getUserList = getParamsObj => {  //getParamsObj => query pagenum pagesize
    return axios.get('users', {
        params: getParamsObj
    }).then(res => res.data)
}

//改变用户状态
export const changeUserState = (uid, type) => { 
    return axios.put(`users/${uid}/state/${type}`).then(res => res.data)
}

//添加用户
export const addUser = postParamObj => {   //postParamObj => username password email mobile
    return axios.post('users', postParamObj).then(res => res.data)
}

//删除用户
export const delUser = userid=> {  
    return axios.delete('users/'+userid).then(res => res.data)
}

//根据用户ID 查询用户数据信息
export const getUserinfoById = userid=> {  
    return axios.get('users/'+userid).then(res => res.data)
}

//根据用户ID 修改用户信息
export const updateUserById = (userid, putParamObj) => {  //putParamObj => email  mobile
    return axios.put('users/'+userid, putParamObj).then(res => res.data)
}

// //获取权限列表数据
// export const getAuthList = type => {  //type  list  tree
//     return axios.get('rights/'+type).then(res => res.data)
// }

// //获取角色列表数据
// export const getRoleList = () => { 
//     return axios.get('roles').then(res => res.data)
// }

//获取权限列表数据
export const getAuthList = type => {  //type  list  tree
    return axios.get('rights/'+type).then(res => res.data)
}

// 获取角色列表（返回角色信息 & 当前角色已有的权限）
export const getRoleList = () => {
    return axios.get('roles').then(res => res.data)
}
// 更改角色权限
export const changeRoleAuth = (roleId, rids) => {//rids  权限ID  字符串  多个之间逗号隔开

    //axios.post(请求地址，对象)  对象 {键：值}
    return axios.post(`roles/${roleId}/rights`, {rids: rids}).then(res => res.data)
}

// 商品分类列表
export const getGoodsCateList = (typeNum, pagenum, pagesize) => {
    return axios.get(`categories`, {params:{type:typeNum, pagenum: pagenum, pagesize: pagesize}}).then(res => res.data)
}

// 添加分类
export const addCategories = params => {
    return axios.post(`categories`, {params}).then(res => res.data)
}