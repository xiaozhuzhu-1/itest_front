import {deleteRequest, getRequest, postRequest,putRequest} from "./common";

export const createTestCase = function (data) { //创建case
    return postRequest('/backend/testCases/', data)
};

export const getTestCaseList = function (serviceId,size,page) { //获取case
    return getRequest(`/backend/testCases/?service_id=${serviceId}&size=${size}&page=${page}`)
};

export const updateTestCase = function (testCaseId, data) {//编辑case
    return putRequest(`/backend/testCase/${testCaseId}/`, data)
};

export const deleteTestCase = function (testCaseId) {//删除case
    return deleteRequest(`/backend/testCase/${testCaseId}/`)
};

export const getTestCase = function (testCaseId) {//获取单个case
    return deleteRequest(`/backend/testCase/${testCaseId}/`)
};

export const debugTestCase = function (data) { //创建case
    return postRequest('/backend/testCase/debug/', data)
};

