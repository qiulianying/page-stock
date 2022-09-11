import http from '../common/http'
import consts from '../common/const'

/*筑梦*/
// 筑梦点赞
export const praise = (data, option) => http('dreambuild/praise', data, option)

// 新增筑梦
export const dreambuild = (data, option) => http('dreambuild', data, option)

// 通过id查询
export const getDreambuild = (data, option) => http('dreambuild', data, option)

// 删除梦

// 筑梦列表
export const getDreamPage = (data, option) => http(`dreambuild/page${data}`, data, {method: 'GET'})

/*梦圈*/
// 梦圈列表
export const getDreamList = (data, option) => http(`dream/page${data}`, data, {method: 'GET'})

/*新增梦想*/
export const addDream = (data, option) => http('add/dream', data, option)


/*首页金梦列表*/
export const getDreamgodenList = (data, option) => http(`dream/page${data}`, data, {method: 'GET'})
