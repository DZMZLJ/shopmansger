import Vue from 'vue'
import Router from 'vue-router'
import {Message} from 'element-ui'
// const Foo = () => import('./foo.vue')
const  Login = () => import ('@/components/login.vue')
const  Home = () => import ('@/components/home.vue')
const  Users = () => import ('@/components/users.vue')
const  Rights = () => import ('@/components/rights.vue')
const  Roles = () => import ('@/components/roles.vue')
const  Goodslist = () => import ('@/components/goodslist.vue')
const  GoodsAdd = () => import ('@/components/goodsadd.vue')
const  Params = () => import ('@/components/params.vue')
const  Goodscate = () => import ('@/components/goodscate.vue')
const  Orders = () => import ('@/components/order.vue')
const  Reports = () => import ('@/components/reports.vue')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      },
      {
        name: 'rights',
        path: '/rights',
        component: Rights
      },
      {
        name: 'roles',
        path: '/roles',
        component: Roles
      },
      {
        name: 'goods',
        path: '/goods',
        component: Goodslist
      },
      {
        name: 'goodsadd',
        path: '/goodsadd',
        component: GoodsAdd
      },
      {
        name: 'params',
        path: '/params',
        component: Params
      },
      {
        name: 'categories',
        path: '/categories',
        component: Goodscate
      },
      {
        name: 'orders',
        path: '/orders',
        component: Orders
      },
      {
        name: 'reports',
        path: '/reports',
        component: Reports
      }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})
// if(!localStorage.getItem('token')){
//   this.$message.warning('请先登陆！')
//   this.$router.push({
//       name: 'login'
//   });
// }
// 路由拦截器（路由守卫）
router.beforeEach((to,from,next) => {
  console.log(to);
  // 如果要去的是登录
  if (to.name === 'login') {
    next()
  } else {
  // 如果要去的不是登录判断是否有token如果有 next() 如果没有返回登陆页面
    if (!localStorage.getItem('token')) {
      Message.warning('请先登录')
      router.push({
        name: 'login'
      })
    } else {
      next()
    }
  }
})
export default router;
