import Vue from 'vue'
import Router from 'vue-router'
import {Message} from 'element-ui'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
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
