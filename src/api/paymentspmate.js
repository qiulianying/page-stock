import http from '../common/http'
import consts from '../common/const'

const API_TYPE = consts.API_TYPE.PAYMENT_SPMATE

export const uploadImg = (data, option) => http('jft/api/v1/order/imgUpload', data, option, API_TYPE)

export const openAcc = (data, option) => http('jft/api/v1/order/accOpen', data, option, API_TYPE)

export const checkOpenAcc = (data, option) => http('jft/api/v1/order/accOpenCheck', data, option, API_TYPE)

export const bindAcc = (data, option) => http('jft/api/v1/order/accBind', data, option, API_TYPE)

export const checkBindAcc = (data, option) => http('jft/api/v1/order/accBindCheck', data, option, API_TYPE)

export const unBindAcc = (data, option) => http('jft/api/v1/order/accUnBind', data, option, API_TYPE)

export const sendSms = (data, option) => http('jft/api/v1/order/smsSend', data, option, API_TYPE)

// 用户余额查询
export const queryAccBalance = (data, option) => http('jft/api/v1/order/accBalance', data, option, API_TYPE)

export const queryAccBind = (data, option) => http('jft/api/v1/order/accBindQuery', data, option, API_TYPE)

export const queryUser = (data, option) => http('jft/api/v1/user/queryUser', data, option, API_TYPE)

export const getAccDetailList = (data, option) => http('jft/api/v1/order/accDetail', data, option, API_TYPE)

export const rechargeAcc = (data, option) => http('jft/api/v1/order/accRecharge', data, option, API_TYPE)

export const withdrawAcc = (data, option) => http('jft/api/v1/order/accWithdraw', data, option, API_TYPE)

// 充值账户查询
export const accRechargeQuery = (data, option) => http('jft/api/v1/order/accRechargeQuery', data, option, API_TYPE)
