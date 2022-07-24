import http from '../common/http'
import consts from '../common/const'

const API_TYPE = consts.API_TYPE.MARKETING_CACL

export const deposit = (data, option) => http('deposit', data, option, API_TYPE)

export const doPrice = (data, option) => http('price', data, option, API_TYPE)

export const receiveCoupon = (data, option) => http('coupon', data, option, API_TYPE)