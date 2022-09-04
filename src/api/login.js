import http from '../common/http'
import consts from '../common/const'

// 微信登录
export const userLogin = (data, option) => http('login/wechat', data, option)
