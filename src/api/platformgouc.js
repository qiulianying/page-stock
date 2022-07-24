import http from '../common/http'
import consts from '../common/const'

const API_TYPE = consts.API_TYPE.PLATFORM_GOUC

/*
* op：云闪付10
* */
export const userLogin = (data, option) => http('user/login', data, option, API_TYPE)

export const userForceBind = (data, option) => http('user/forceBind', data, option, API_TYPE)

export const getWXPhone = (data, option) => http('user/getWXPhone', data, option, API_TYPE)

export const getUserInfo = (data, option) => http('user/info', data, option, API_TYPE)

// 登录的时候获取短信
export const sendMobileCode = (data, option) => http('user/mobileCaptcha', data, option, API_TYPE)
