import http from '../common/http'
import consts from '../common/const'

const API_TYPE = consts.API_TYPE.BUSI_INT

export const order = (data, option) => http('api/v2/order', data, option, API_TYPE)

export const orderV1 = (data, option) => http('api/v1/order', data, option, API_TYPE)

export const confirm = (data, option) => http('api/v2/confirm', data, option, API_TYPE)