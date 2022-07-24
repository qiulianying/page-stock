import http from '../common/http'
import consts from '../common/const'

const API_TYPE = consts.API_TYPE.INFO_USER
const API_TYPE_PAY = consts.API_TYPE.INFO_PAY

// 通过qid获取当前传入小程序或者h5的详细情况
export const getFindById = (data, option) => http('qrcode/findById', data, option, API_TYPE)

//获取首页详情页面
export const orgHomeConfig = (id, data, option) => http(`organizationHomeConfig/detail/${id}`, data, option, API_TYPE)

// 获取门店
export const getMerchantList = (data, option) => http('merchant/page', data, option, API_TYPE)

//门店详情
export const getMerchantDetail = (data, option) => http('merchant/detail', data, option, API_TYPE)

export const addCollection = (data, option) => http('collection/add', data, option, API_TYPE)

export const delCollection = (data, option) => http('collection/delete', data, option, API_TYPE)

export const checkCollection = (data, option) => http('collection/judge', data, option, API_TYPE)

// 获取机构信息
export const getRegionData = (data, option) => http('region/detail', data, option, API_TYPE)

// 获取积分详情
export const getPoint = (data, option) => http('memberPointLog/searchByMerchant', data, option, API_TYPE_PAY)

// 获取门店微信小程序appid以及小程序原生id
// subjectType: 1, subjectId: merchantNo    //1：门店；5：机构 2021.12.21 高老师描述
export const getAppid = (data, option) => http('sub/findBySubjectId', data, option, API_TYPE)



