// 前端日志接口公用调用方法
import journalweb from './libs/function/journalweb.js'
import timeFormat from './libs/function/timeFormat'

const myImport = require.context('./components', true, /\.vue$/)
const components = myImport.keys().map(item => {
    const value = myImport(item)
    return value.default
})

// 设置组件公用方法
const $fhu = {
    journalweb: journalweb,
    timeFormat: timeFormat
}


// $u挂载到uni对象上
uni.$fhu = $fhu

const install = Vue => {
    // 设置全局$fhu
    Vue.prototype.$fhu = $fhu
    if (install.installed) return
    install.installed = true
    // 遍历注册全局组件
    components.map(component => Vue.component(component.name, component))
}

export default {
    install
}
