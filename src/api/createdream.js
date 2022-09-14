import http from "../common/http";

/*新增梦想*/
export const addDream = (data, option) => http('dream', data, option)

/*梦想详情搜索*/
export const DreamDetail = (id, option) => http(`dream/${id}`, id, {method: 'GET'})

/*获取图片组*/

/*话题搜索*/
export const getTopic = (data, option) => http(`topic/query${data}`, data, {method: 'GET'})

/*文件上传*/
export const upload = (data, option) => http('file/upload', data, option)
