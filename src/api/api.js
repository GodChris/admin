import axios from 'axios';
import Vue from 'vue'
// let base = '';
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
//在线测试
axios.defaults.baseURL = 'http://dsp.crm.echowap.com/api/';
//本地测试
// axios.defaults.baseURL = 'http://api.crm.echowap.com/';
// axios.defaults.withCredentials=true;
// Vue.http.options.xhr={withCredentials:true};
export default{
    //登录
    requestLogin(data){
    return axios.post('/login',data)},
    //注销
    logOut(){
        return axios.get('/logout')
    },
    //创建
    addUser(params){
        return axios({
            url:'/v1/accounts',
            method:'post',
            dataType:'json',
            data:params
        });
    },
    //获取开户基本信息
    getAccountInfo(para){
        return axios.get('/v1/accounts',{params:para});
    },
    //获取单个信息
    getAccountInfoByUserId(para){
        return axios.get('/v1/accounts/'+para)
    },
    //获取待审核信息
    getAuditUser(para){
        return axios.get('/v1/accounts/users',{params:para})
    },
    //注册审核
    auditUser(para){
        return axios.post('/v1/accounts/users/check',para)
    },
    //修改信息
    editUser(data){
        return axios.post('/v1/accounts/update', data);
    },
    //重置密码
    resetPass(data){
        return axios.post('/v1/accounts/password/update',data)
    },
    //删除单个信息
    removeUser(para){
        return axios.delete('/v1/accounts/'+para);
    },
    //批量删除
    batchRemoveUser(params){
        return axios.get(`${base}/user/batchremove`, { params: params });
    },
    //新增充值记录
    addRecharges(para){
        return axios.post('/v1/accounts/recharges',para)
    },
    //查询充值记录
    getRecharges(para){
        return axios.get('/v1/accounts/recharges',{params:para})
    },
    //查询单条充值记录
    getOneRecharge(para){
      return axios.get('/v1/accounts/recharges/'+para)
    },
    //充值审核
    auditRecharge(para){
        return axios.post('/v1/accounts/recharges/check',para)
    },
    //查询操作记录
    getActions(para){
        return axios.get('/v1/actions',{params:para})
    },
    getLogByEmail(para){
        return axios.get('/v1/actions/'+para)
    }
}


//批量删除用户
// export const batchRemoveUser = params => {
//     return axios.get(`${base}/user/batchremove`, { params: params });
// };