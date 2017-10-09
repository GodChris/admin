import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
//advertiser
import admessage from './views/advertiser/adMessage.vue'
import openAccount from './views/advertiser/openAccount.vue'
import resetPass from './views/advertiser/resetPass.vue'
import userAudit from './views/advertiser/userAudit.vue'
import user from './views/advertiser/user.vue'
//useraction
import recharges from './views/useraction/recharges.vue'
import addRecharges from './views/useraction/addRecharges.vue'
import actions from './views/useraction/actions.vue'
import Page4 from './views/useraction/Page4.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
//creativeSet
import creativeSet from './views/creativeset/CreativeSetCheck.vue'
import checkSet from './views/creativeset/checkSet.vue'

let routes = [
    {
        path: '/masterlogin',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path:'/',
        meta:{
            requireAuth: true
        },
        hidden:true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '广告主',
        //图标样式class
        iconCls: 'el-icon-message',
        children: [
            // { path: '/main', component: echarts, name: '主页'},
            { path: '/openAccount', component: openAccount, name: '开户' },
            { path: '/AccountInfo', component: admessage, name: '广告主信息' },
            { path: '/resetPass',component: resetPass,name: '密码管理'},
            { path: '/userAudit', component: userAudit, name: '注册审核' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '用户行为',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/recharges', component:recharges , name: '充值记录' },
            { path: '/addRecharges', component:addRecharges, name: '充值' },
            { path: '/actions', component:actions, name: '操作记录' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '创意审核',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/creativeSet', component:creativeSet , name: '广告创意集合' },
            { path: '/checkCreativeSet', component:checkSet,name:'创意集合审核'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '财务',
        iconCls: 'fa fa-address-card',

        children: [
            { path: '/page6', component: Page6, name: '待开发' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: Main, name: '图表' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;