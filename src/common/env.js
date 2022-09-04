import Cookies from 'js-cookie'
import defaultSettings from '../setting'
export const ENV_PLATFORM_ID = 'sp-mate'
export const ENV_FILE_FOLDER = '/platform-oss/internal-getfile'
export const ENV_UPLOAD_FOLDER = '/platform-oss/internal-savefile'
export const ENV_SECRETFILE_FOLDER = '/platform-oss/internal-secretfile'
export const ENV_SECRETFILE_CARD = '/rights-marketing/OCR/bankCardRecognize'        //图片流文件上传
export const ENV_SECRETFILE_IDCARD = '/rights-marketing/OCR/idCardRecognize'        //身份证图片流文件上传

/*默认当前为微信小程序appId*/
let ENV_MP_WECHAT_APPID = 'wx4f9144675b75b1c9'
/*默认当前为云闪付小程序appId：目前默认写的是U热购小程序的appId，实际都优先使用接口调用*/
let ENV_MP_APPLET_APPID = '1b09a54d391a48ef88f75bcc871aee43'

const IMG_PRE_URL = 'https://spmct.51zcm.cc/platform-oss/internal-getfile/softwareparkweb/manageweb/'


// 获取当前窗口url中param参数的值
function getQueryVariable(variable) {
    let query = window.location.hash.substring(3);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

//获取当前帐号信息
let ENV_BASE_URL = '',
    ENV_BASE_API = '',
    ENV_REGION_ID = '',
    VUE_APP_PROCESS = 'x-oss-process',
    DOMAIN_NAME = '',       //设置域名
    Software_Park = true    //是否软件园项目 false为否


//h5情况下进行本地以及相关域名配置
// #ifdef H5
//h5需要在链接中获取到对应的appId或者渠道韩等参数
if ((!uni.getStorageSync('regionNo') || uni.getStorageSync('regionNo') === '') && getQueryVariable('regionNo')) {
    uni.setStorageSync('regionNo', getQueryVariable('regionNo'))
} else if (uni.getStorageSync('regionNo') && getQueryVariable('regionNo') && getQueryVariable('regionNo') !== uni.getStorageSync('regionNo')) {
    uni.setStorageSync('regionNo', getQueryVariable('regionNo'))
}
ENV_REGION_ID = getQueryVariable('regionNo') ? getQueryVariable('regionNo') : uni.getStorageSync('regionNo')   //软件园渠道固定regionNo

//这里h5作为通用使用，需要额外判断
if (ENV_REGION_ID && (ENV_REGION_ID !== 'DL1330809358619254784' || ENV_REGION_ID !== 'DL1333225698034458624' || ENV_REGION_ID !== 'DL1306153654495223808') ) {
    Software_Park = false
} else {
    Software_Park = false
}
console.log("process.env.NODE_ENV：" + process.env.NODE_ENV )
if (process.env.NODE_ENV === 'development') {
    //本地开发环境
    ENV_BASE_URL = 'http://' + window.location.host
    ENV_BASE_API = '/sp-mate'
    VUE_APP_PROCESS = 'x-oss-process'
    DOMAIN_NAME = `https://${defaultSettings.environment === 'spmapi' ? 'spmmp' : defaultSettings.environment}.51zcm.cc`
} else {
    if (window.location.host === 'spdev.51zcm.cc') {
        //开发环境
        ENV_BASE_URL = 'https://spdev.51zcm.cc'
        ENV_BASE_API = '/sp-mate'
        VUE_APP_PROCESS = '==prVH2IHeofDf247APPUPLOADTAPROCESSfND=='
        DOMAIN_NAME = 'https://spdev.51zcm.cc'
    } else if (window.location.host === 'sptest.51zcm.cc') {
        //测试环境
        ENV_BASE_URL = 'https://sptest.51zcm.cc'
        ENV_BASE_API = '/sp-mate'
        VUE_APP_PROCESS = '==prVH2IHeofDf247APPUPLOADTAPROCESSfND=='
        DOMAIN_NAME = 'https://sptest.51zcm.cc'
    } else if (window.location.host === 'spmd.51zcm.cc' || window.location.host === 'spmmp.51zcm.cc') {
        //生产环境：生产环境的域名需要注意使用到的域名有spmd.51zcm.cc以及spmmp.51zcm.cc
        ENV_BASE_URL = 'https://spmapi.51zcm.cc'
        ENV_BASE_API = ''
        VUE_APP_PROCESS = '==prVH2IHeofDf247APPUPLOADTAPROCESSfND=='
        DOMAIN_NAME = 'https://' + window.location.host       //微信公众号生产环境域名
    }
}
// #endif


//微信小程序情况下根据不同的环境使用不同的数据(注意：只在微信小程序情况下有效)
// #ifdef MP-WEIXIN
const accountInfo = uni.getAccountInfoSync();
// miniProgram.envVersion的合法值：develop开发版、trial体验版、release正式版
const env = accountInfo.miniProgram.envVersion;
// 链接到不同环境 master：生产；develop：测试；devTest：开发
let environment = ''
if (env === 'release') {
    environment = 'master'
} else if (env === 'trial') {
    environment = uni.getStorageSync('environment') || 'develop'
} else {
    environment = uni.getStorageSync('environment') || 'devTest'
}
//得到最终的链接到不同环境的结果
switch (environment) {
    case "devTest":
        // 开发
        ENV_BASE_URL = 'https://dream.kaihuaikj.com/api/app'
        ENV_BASE_API = '/app'
        ENV_REGION_ID = 'DL1306153654495223808'        //软件园渠道固定regionNo
        VUE_APP_PROCESS = 'x-oss-process'

        //上线时，需要强制改为生产环境
        // ENV_BASE_URL = 'https://spmapi.51zcm.cc'
        // ENV_BASE_API = ''
        // ENV_REGION_ID = 'DL1330809358619254784'
        break;
    case "develop":
        // 测试
        ENV_BASE_URL = 'https://dream.kaihuaikj.com/api/app'
        ENV_BASE_API = '/app'
        ENV_REGION_ID = 'DL1333225698034458624'
        VUE_APP_PROCESS = '==prVH2IHeofDf247APPUPLOADTAPROCESSfND=='


        // 上线时，需要强制改为生产环境
        // ENV_BASE_URL = 'https://spmapi.51zcm.cc'
        // ENV_BASE_API = ''
        // ENV_REGION_ID = 'DL1330809358619254784'
        break;
    case "master":
        //生产
        ENV_BASE_URL = 'https://spmapi.51zcm.cc'
        ENV_BASE_API = ''
        ENV_REGION_ID = 'DL1330809358619254784'
        break;
}
// #endif

export {
    ENV_BASE_URL,
    ENV_BASE_API,
    ENV_REGION_ID,
    ENV_MP_WECHAT_APPID,
    ENV_MP_APPLET_APPID,
    VUE_APP_PROCESS,
    DOMAIN_NAME,
    Software_Park,
    IMG_PRE_URL
}
