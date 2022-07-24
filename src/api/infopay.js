import http from '../common/http'
import consts from '../common/const'

const API_TYPE = consts.API_TYPE.INFO_PAY
const PAYMENT_SPMATE = consts.API_TYPE.PAYMENT_SPMATE

export const getOrderList = (data, option) => http('bizOrder/searchByUserIdV2', data, option, API_TYPE)

//旧充值记录接口
//export const getChargeOrderList = (data, option) => http('bizOrder/findReChargeOrder', data, option, API_TYPE)

//更换充值记录接口
export const getChargeOrderList = (data, option) => http('jft/api/v1/order/accRechargeWithdrawOrder', data, option, PAYMENT_SPMATE)

export const findOrderByByMemberPayCode = (data, option) => http('bizOrder/findOrderByByMemberPayCode', data, option, API_TYPE)

export const getOrderDetail = (data, option) => http('bizOrder/detail', data, option, API_TYPE)
// 我的订单详情
export const getOrderDetailMore = (data, option) => {
  let params = data.billNo
  return http(`order/detail/${params}`, data, option, API_TYPE)
}
console.log('接口数据')
// console.log(data)

// 获取充值提现记录接口
export const getRechargeOrderDetail = (data, option) => http('jft/api/v1/order/accRechargeWithdrawOrderDetail', data, option, PAYMENT_SPMATE)

// 我的订单详情列表
export const getMyOrder = (data, option) => http('bizOrder/searchByUserIdV2', data, option, API_TYPE)


