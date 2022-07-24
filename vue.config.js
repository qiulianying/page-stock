//vue.config.js
const TransformPages = require('uni-read-pages')
const {webpack} = new TransformPages()


const path = require('path')
const defaultSettings = require('./src/setting')
const fs = require('fs')
fs.readFile('src/manifest.json', (error, data) => {
    if (error) {
        return console.log(error)
    }
    let getJson = JSON.parse(JSON.stringify(data.toString()))
    let myChange = eval('(' + getJson + ')')
    // console.log(myChange)
})

/*
* 注意，在uni-app中配置vue.config.js，其中很多是不能使用的，例如public，且以manifest.json为优先
* */
module.exports = {
    devServer: {
        port: 8082,
        https: false,
        open: false,
        disableHostCheck: true,
        proxy: {
            "/sp-mate": {
                ws: true,
                changeOrigin: true,
                target: `https://${defaultSettings.environment}.51zcm.cc`,
                pathRewrite: {
                    "^/dpc": ""
                }
            },
            "/platform-oss": {
                ws: true,
                changeOrigin: true,
                target: `https://${defaultSettings.environment}.51zcm.cc/platform-oss`,
                pathRewrite: {
                    "^/dpc": ""
                }
            },
            "/fzsp": {
                ws: true,
                changeOrigin: true,
                target: `https://gitlab.51zcm.cc`,
                pathRewrite: {
                    "^/fzsp": "/fzsp"
                }
            }
        },
    },
    chainWebpack: (config) => {
        // 发行或运行时启用了压缩时会生效
        config.optimization.minimizer('terser').tap((args) => {
            const compress = args[0].terserOptions.compress
            // 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
            compress.drop_console = defaultSettings.dropConsole
            compress.pure_funcs = [
                '__f__', // App 平台 vue 移除日志代码
                // 'console.debug' // 可移除指定的 console 方法
            ]
            return args
        })
    },
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                // 设置uni-simple-router钩子
                ROUTES: webpack.DefinePlugin.runtimeValue(() => {
                    const tfPages = new TransformPages({
                        includes: ['path', 'name', 'aliasPath', 'style', 'hideRouter']
                    });
                    return JSON.stringify(tfPages.routes)
                }, true )
            })
        ]
    }
}
