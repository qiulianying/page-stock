import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        nowLoading: false,  // 当前是否处于加载状态
        walletInfo: {},
        bankcardInfo: {},
        accountId: null,
        selectGoods: {},		//选中的商品内容
        enableMemberPassword: 0,	//是否开启密码验证，0：关闭；1：开启
        hasPassword: 0,	//是否有密码，0：没有；1：有
        appTheme: 'bg-theme-blue', // 主题色
        routerNow: '',          // 当前路由链接
    },
    mutations: {
        setNowLoading(state, nowLoading) {
            state.nowLoading = nowLoading
        },
        setWalletInfo(state, walletInfo) {
            state.walletInfo = walletInfo
        },
        setBankcardInfo(state, bankcardInfo) {
            state.bankcardInfo = bankcardInfo
        },
        setAccountId(state, accountId) {
            state.accountId = accountId
        },
        setEnableMemberPassword(state, enableMemberPassword) {
            state.enableMemberPassword = enableMemberPassword
        },
        setHasPassword(state, hasPassword) {
            // 是否设置密码
            state.hasPassword = hasPassword
        },
        setAppTheme(state, color = 'bg-theme-blue') {
            // 如果没有传入颜色，则默认是blue
            state.appTheme = color
        },
        setRouterNow(state, routerNow) {
            state.routerNow = routerNow
        }
    },
    getters: {
        getWalletInfo: state => {
            return state.walletInfo
        },
        getBankcardInfo: state => {
            return state.bankcardInfo
        }
    },
    actions: {
        changeSetNowLoading({commit}, content) {
            commit('setNowLoading', content || false)
        },
        changeEnableMember({commit}, content) {
            commit('setEnableMemberPassword', content.type || 0)
        },
        changeHasPassword({commit}, hasPassword) {
            commit('setHasPassword', hasPassword.type || 0)
        },
        changeRouterNow({commit}, routerNow) {
            commit('setRouterNow', routerNow || '/pages/index/index')
        }
    }
})

export default store
