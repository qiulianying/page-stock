import http from "../common/http";

/*新增梦想*/
export const addDream = (data, option) => http('add/dream', data, option)

/*话题搜索*/
export const getTopic = (data, option) => http(`add/topic/query${data}`, data, option)
