import {deleteRequest, getRequest, postRequest,putRequest} from "./common";

export const createService = function (data) { //创建模块
    return postRequest('/backend/services/', data)
};

export const updateService = function (serviceId, data) {//编辑模块
    return putRequest(`/backend/service/${serviceId}/`, data)
};

export const deleteService = function (serviceId) {//删除模块
    return deleteRequest(`/backend/service/${serviceId}/`)
};

export const getServiceList = function (projectId) { //获取模块
    return getRequest('/backend/services/?project_id='+ projectId)
};