/*医药商城相关接口*/
import http from '../common/http'
import consts from '../common/const'

const BUSI_INT = consts.API_TYPE.BUSI_INT
const API_TYPE = consts.API_TYPE.INFO_MEMBER
const API_USER = consts.API_TYPE.INFO_USER
const API_PRODUCT = consts.API_TYPE.INFO_PRODUCT
const BUSI_RIGHT = consts.API_TYPE.BUSI_RIGHT

//获取变量
export const getSysParametersApi = (data, option) => http('common/getSysParameters', data, option, API_USER)

/*医药商城门店具体接口*/
//门店详情
export const getStoreApi = (data, option) => http('merchant/detail', data, option, API_USER)

//会员个人账号信息：包括地址等详细信息
export const getMemberAccount = (data, option) => http('member/account', data, option, API_TYPE)

//门店分类以及对应列表
export const getMemberList = (data, option) => http('goodsCategory/searchCategoryByMerchantNoV2', data, option, API_PRODUCT)

//获取收货地址
export const getDeliveryAddress = (data, option) => http('deliveryAddress/page', data, option, API_PRODUCT)

//调用计价接口
export const getPrice = (data, option) => http('marketing-cacl/price', data, option)

//调用支付接口
export const getOrder = (data, option) => http('busi-int/api/v1/takeout/order', data, option)

//医保支付接口
export const getMedical = (data, option) => http('busi-int/api/v2/order', data, option)

//更新身份证信息
export const updateMemberInfo = (data, option) => http('member/api/v1/updateMemberInfo', data, option, API_TYPE)

//支付成功调用查询接口
export const confirmDrug = (data, option) => http('api/v1/takeout/confirm', data, option, BUSI_INT)

//医保计价预结算接口
export const preSettleCalc = (data, option) => http('wy/preSettleCalc', data, option, API_PRODUCT)

// 设置默认地址
export const getDefaultAddress = (data, option) => http('deliveryAddress/setDefault', data, option, API_PRODUCT)

// 新增收货地址
export const getAddAddress = (data, option) => http('deliveryAddress/add', data, option, API_PRODUCT)

// 编辑收货地址
export const getEditAddress = (data, option) => http('deliveryAddress/edit', data, option, API_PRODUCT)

// 删除收货地址
export const getDelAddress = (data, option) => http(`deliveryAddress/delete/${data}`, data, option, API_PRODUCT)

export const getGoodsData = (data, option) => http('goods/detail', data, option, API_PRODUCT)

// 店铺药品搜索
export const searchGoodsByTakeout = (data, option) => http('goodsCategory/searchGoodsByTakeout', data, option, API_PRODUCT)

// 优惠券
export const getCouponData = (data, option) => http('coupon/frontCoupon', data, option, API_TYPE)

// 调用取消订单接口
export const getCancelOrder = (data, option) => http('busi-int/api/v1/order/cancel', data, option)
// 权益商品取消订单接口
export const getRightCancelOrder = (data, option) => http('rights-marketing/order/cancel', data, option)

// 领券接口
export const receiveCoupon = (data, option) => http('rights-marketing/coupon/receive', data, option)


// 调用重新支付接口
export const getRepayOrder = (data, option) => http('busi-int/api/v1/order/repay', data, option)

// 获取门店里面的优惠券/代金券
export const getShopCoupon = (data, option) => http('rights-marketing/rights/queryVoucherByMerchant', data, option)

// 数字餐厅云闪付登录接口
export const registerMemberSz = (data, option) => http('member/registerMemberSz', data, option, API_TYPE)

// 获取代金券列表
export const getCouponList = (data, option) => http('api/v1/rights/detailByBillNo', data, option, BUSI_RIGHT)



