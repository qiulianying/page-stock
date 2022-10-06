import http from '../common/http'
import consts from '../common/const'

/*筑梦*/
// 筑梦点赞
export const dreambuildPraise = (data, option) => http('dreambuild/praise', data, option)

// 通过id查询
export const getDreambuild = (data, option) => http('dreambuild', data, option)

// 删除梦

// 筑梦列表
export const getDreamPage = (data, option) => http(`dreambuild/page${data}`, data, {method: 'GET'})

/*梦圈*/
// 梦圈列表
export const getDreamList = (data, option) => http(`dream/page${data}`, data, {method: 'GET'})

/*首页金梦列表*/
export const getDreamgodenList = (data, option) => http(`dream/page`, data, {method: 'GET'})

/*首页梦圈列表*/
export const getGoldList = (data, option) => http(`dream/page/gold${data}`, data, {method: 'GET'})
