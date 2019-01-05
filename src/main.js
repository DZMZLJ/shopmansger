// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import Http from '@/plugins/http'
import moment from 'moment'
import MyBread from '@/components/cusBread.vue'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/index.css'
import router from './router'

Vue.config.productionTip = false
Vue.component(MyBread.name,MyBread)
Vue.use(ElementUI)
Vue.use(Http)
// 处理日期的全局过滤器
Vue.filter('fmtDate',(v)=>{
  return moment(v).format('YYYY-MM-DD');
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
