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
* */

var myPrivate = {
    // 日志埋点方法
    myJournalFunction (userinfo, projectinfo) {
        // 目前默认固定写死该接口作为前端传入参数使用
        var myurl = 'https://spmapi.51zcm.cc/bookkeeping/save/proxy/bigdatainsert'
        var data = {
            "dataType":"front-log",
            body: {
                userinfo: userinfo,
                accesstime: timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
                projectinfo: projectinfo || ''
            }
        }
        // h5情况下获取访问ip地址以及路径
        data.body.accessway = 1
        data.body.ipaddr = window.location.host
        data.body.accessurl = window.location.href
        console.log(324234234)

        ajax({
            url: myurl,
            type: 'post',//请求方式
            timeOut: 1000,//响应超时事件
            data: data
        })
    }
}

// 封装ajax
function ajax(options) {
    var xhr = new XMLHttpRequest();
    var method = options.type.toUpperCase(); // 将请求方式大写
    if (method === 'GET' || method === 'DELETE') {
        xhr.open(method, options.url)
    } else if (method === 'POST' || method === 'PUT') {
        xhr.open(method, options.url)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(options.data));
        xhr.timeout = options.timeOut;
        xhr.ontimeout = function () {
            // console.log('请求超时')
        }
        xhr.onerror = function () {
            // options.fail('请求失败')
        }
    }
}

// 其他更多是格式化有如下:
// yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合
function timeFormat(dateTime = null, fmt = 'yyyy-mm-dd') {
    // 如果为null,则格式化当前时间
    if (!dateTime) dateTime = Number(new Date());
    // 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
    if (dateTime.toString().length == 10) dateTime *= 1000;
    let date = new Date(dateTime);
    let ret;
    let opt = {
        "y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "h+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "s+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
