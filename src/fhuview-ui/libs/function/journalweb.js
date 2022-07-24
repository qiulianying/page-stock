/*
* 前端日志接口公用调用方法
* 接口负责人：王丰
*"dataType":"front-log",
* body传递数据如下
userinfo	用户信息	非空
ipaddr	IP地址	非空
session	会话标识
accesstime	访问时间	非空	yyyy-MM-dd HH:mm:ss
accessway	访问方式	非空	1 - 浏览器 2- app 3 -小程序
accessurl	访问的url	非空
duration	访问时长
projectinfo	产品信息	非空
*
*
* */
import timeFormat from './timeFormat'

const Journalweb = (userinfo, projectinfo) => {
    // 目前默认固定写死该接口作为前端传入参数使用
    let myurl = 'https://spmapi.51zcm.cc/bookkeeping/save/proxy/bigdatainsert'
    let data = {
        "dataType":"front-log",
        body: {
            userinfo: userinfo,
            accesstime: timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
            projectinfo: projectinfo || ''
        }
    }

    // 通过uni进行不同环境下进行调用
    uni.getSystemInfo({
        success: function (res) {
            console.log(res.model);
            console.log(res.pixelRatio);
            console.log(res.windowWidth);
            console.log(res.windowHeight);
            console.log(res.language);
            console.log(res.version);
            console.log(res.platform);
        }
    });

    if (window) {
        data.body.accessway = 1
        // h5情况下获取访问ip地址以及路径
        data.body.ipaddr = window.location.host
        data.body.accessurl = window.location.href
    } else {
        data.body.accessway = 3
        // 小程序的情况下获取访问的页面路径
        data.body.accessurl = getPageUrl()
    }


    // #ifdef H5
    console.log('h5情况下')
    // #endif

    // #ifdef MP-WEIXIN
    console.log('微信小程序情况下')
    // #endif

    uni.request({
        url: myurl,
        method: 'POST',
        data: data,
        success: () => {},
        fail: () => {}
    })
}

/*
* 获取微信小程序当前页面路径
* getCurrentPages() 函数用于获取当前页面栈的实例
* */
const getPageUrl = () => {
    const pages = getCurrentPages()
    const curretnPage = pages[pages.length - 1]
    return `/${curretnPage.route}`
}

export default Journalweb
