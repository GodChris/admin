import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
import axios from 'axios'

import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);


//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
});

//路由拦截
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth){
  if (to.path === '/masterlogin') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path !== '/masterlogin') {
    next(
        {
            path: '/masterlogin'
        })
  } else {
    next()
  }
    }else{
        next()
    }
});

// 拦截 401 ，退出到登录
axios.interceptors.response.use((response) => {

    if(response.data.status===401){
        setTimeout(()=>{
            sessionStorage.removeItem('user');
            router.replace('/masterlogin');
        },2000);

    }
    return response;
}, error => {
    return Promise.reject(error)
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

