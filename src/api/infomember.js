import http from '../common/http'
import consts from '../common/const'

const API_TYPE = consts.API_TYPE.INFO_MEMBER
const BUSI_INT = consts.API_TYPE.BUSI_INT

//通过解析token获取openId以及appid对饮接口
export const getAppIdOpenId = (data, option) => http('member/getAppIdOpenId', data, option, API_TYPE)

export const memberRegister = (data, option) => http('member/register', data, option, API_TYPE)

//补充会员信息
export const memberSupply = (data, option) => http('member/supply', data, option, API_TYPE)

export const memberMerge = (data, option) => http('member/merge', data, option, API_TYPE)

//软件园员工信息获取
export const memberAccount = (data, option) => http('member/account', data, option, API_TYPE)

export const genMemberPayCode = (data, option) => http('member/genMemberPayCode', data, option, API_TYPE)

export const verifyStaff = (data, option) => http('softwarePark/verifyStaff', data, option, API_TYPE)

// 获取优惠折扣信息接口
export const getActivityList = (data, option) => http('activity/marketQuery', data, option, API_TYPE)

//当前登录者人员会员信息
export const getMemberInfo = (data, option) => http('member/info', data, option, API_TYPE)

export const setPwd = (data, option) => http('member/api/v1/settingPassword', data, option, API_TYPE)

//验证密码
export const isPassword = (data, option) => http('member/api/v1/isPassword', data, option, API_TYPE)

//开启密码验证
export const openPassword = (data, option) => http('member/api/v1/openPassword', data, option, API_TYPE)

//关闭密码验证
export const closePassword = (data, option) => http('member/api/v1/closePassword', data, option, API_TYPE)

// 会员充值计价
export const memberRechargeCalc = (data, option) => http('marketing-cacl/deposit', data, option)

// 会员充值
export const memberRecharge = (data, option) => http('api/v1/order', data, option, BUSI_INT)
