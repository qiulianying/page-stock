import http from '../common/http'
import consts from '../common/const'

// 用户余额查询
export const queryAccBalance = (data, option) => http('jft/api/v1/order/accBalance', data, option)

export const queryAccBind = (data, option) => http('jft/api/v1/order/accBindQuery', data, option)
