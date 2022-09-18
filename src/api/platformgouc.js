import http from '../common/http'
import consts from '../common/const'

// 微信登录
export const userLogin = (data, option) => http('login/wechat', data, option)

// 用户关注或者取消关注
export const follow = (data, option) => http('user/follow', data, option)

// 获取用户信息
export const getUserInfo = (data, option) => http('user/info', data, {method: 'GET'})

// 获取微信小程序openid
export const getOpenId = (data, option) => http('login/openid', data, {method: 'GET'})

/*我的消息*/
