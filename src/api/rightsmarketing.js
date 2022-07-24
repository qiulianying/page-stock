import http from '../common/http'
import consts from '../common/const'

const API_TYPE = consts.API_TYPE.RIGHTS_MARKETING
const BUSI_RIGHT = consts.API_TYPE.BUSI_RIGHT
const API_PRODUCT = consts.API_TYPE.INFO_PRODUCT
const INFO_PRODUCT = consts.API_TYPE.INFO_PRODUCT
const INFO_MEMBER = consts.API_TYPE.INFO_MEMBER

// 获取权益商品详情
export const getRightData = (data, option) => http('rightsActivity/popularActivityDetail', data, option, API_TYPE)
// 权益商品计价
export const getRightPrice = (data, option) => http('order/price', data, option, API_TYPE)
// 下单接口
export const getRightPay = (data, option) => http('order/pay', data, option, API_TYPE)
// 我的收藏
export const getCollection = (data, option) => http('collection/findCollection', data, option, API_TYPE)
// 卡包
export const getBusiRight = (data, option) => http('api/v1/rights/my', data, option, BUSI_RIGHT)
// 卡包详情
export const getBusiRightDetail = (data, option) => http('api/v1/rights/detail', data, option, BUSI_RIGHT)
// 优惠券详情 GET请求
export const coupondDetail = (id, option) => http(`coupon/detail/${id}`,{}, option, INFO_MEMBER)
// 优惠券适用门店
export const suitMerchant = (data, option) => http('api/v1/coupon/suitMerchant', data, option, BUSI_RIGHT)

// 获取权益商品列表
export const getPreSettleCalc = (data, option) => http('rightsActivity/popularActivity', data, option, API_TYPE)

// 获取特惠分类类目
export const getDiscountType = (data, option) => http('industryCategory/client/search', data, option, INFO_PRODUCT)

// 中石化的加油券绑定
export const sinopecBind = (data, option) => http('api/v1/sinopec/bind', data, option, BUSI_RIGHT)

// 获取预约活动列表
export const appointmentList = (data, option) => http('bookActivity/display', data, option, API_TYPE)

// 获取预约活动详情
export const appointmentDetail = (data, option) => http('bookActivity/detail', data, option, API_TYPE)

// 我的订单预约活动详情
export const getAppointData = (data, option) => http('bookOrder/queryByBillNo', data, option, API_TYPE)

// 查询可预约时间
export const appointmentDateCanUse = (data, option) => http('bookActivity/enableTime', data, option, API_TYPE)

// 查询我的预约
export const myAppoint = (data, option) => http('bookOrder/query', data, option, API_TYPE)

