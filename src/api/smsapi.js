import http from '../common/http'
import consts from '../common/const'

const API_TYPE = consts.API_TYPE.SMSAPI
const RIGHTS_MARKETING = consts.API_TYPE.RIGHTS_MARKETING
const API_USER = consts.API_TYPE.INFO_USER

//获取公众号h5短信验证码
export const smsSendH5 = (data, option) => http('core/send', data, option, API_TYPE)

//这个短信验证码获取接口只能用于软件园渠道，切只能用于软件园小程序 高老师说的
export const smsSend = (data, option) => http('sms/sendCaptcha', data, option, RIGHTS_MARKETING)

// 用于云闪付在得到授权之后获取手机号码
export const getUnionPhone = (data, option) => http('union/getPhone', data, option, RIGHTS_MARKETING)

//获取当前登录渠道号logo
export const getRegionLogo = (data, option) => http('region/customize', data, option, API_USER)
