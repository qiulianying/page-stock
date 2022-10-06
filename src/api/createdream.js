import http from "../common/http";

/*新增梦想*/
export const addDream = (data, option) => http('dream', data, option)

/*梦想详情搜索*/
export const DreamDetail = (id, option) => http(`dream/${id}`, id, {method: 'GET'})

/*获取图片组*/

/*话题搜索*/
export const getTopic = (data, option) => http(`topic/query${data}`, data, {method: 'GET'})

/*话题创建*/
export const CreateTopic = (data, option) => http(`topic`, data, option)

/*梦想点赞*/
export const putPraise = (data, option) => http(`dream/praise?id=${data.id}&description=${data.description}`, data, {method: 'PUT'})

/*梦想收藏*/
export const putCollect = (data, option) => http(`dream/collect?id=${data.id}&description=${data.description}`, data, {method: 'PUT'})

/*梦想围观*/
export const putWatch = (data, option) => http(`dream/watch?id=${data.id}&description=${data.description}`, data, {method: 'PUT', contentType: ''})

/*新增评论*/
export const addComment = (data, option) => http(`comment`, data, option)

/*评论点赞*/
export const praiseComment = (data, option) => http(`comment/praise${data}`, data, {method: 'PUT'})

/*梦想评论查询*/
export const getDreamComment = (id, option) => http(`comment/dream/${id}`, id, {method: 'GET'})

/*文件上传*/
export const upload = (data, option) => http('file/upload', data, option)

// 新增筑梦
export const dreambuild = (data, option) => http('dreambuild', data, option)
