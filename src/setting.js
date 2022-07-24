// 全局配置，后续继续优化再添加
module.exports = {
    // 开发环境spdev，测试sptest，生产spmapi，h5修改这里重新即可自动修改对应环境配置(只限h5，小程序有公用组件进行环境切换)
    environment: 'spdev',
    // 打包是否全局自动屏蔽console等输出调试代码
    dropConsole: true
}
