import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex);

// 应用初始状态
const state = {
    count: 10,
    // //invoice_type
    // comdata1:{},
    // //need_invoice
    // comdata2:{},
    // //statement_type
    // comdata3:{},
    // //order_type
    // comdata4:{},
    // //user_user
    // comdata5:{},
    // //action_module
    // comdata6:{}

};

// 定义所需的 mutations
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    }
};

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})