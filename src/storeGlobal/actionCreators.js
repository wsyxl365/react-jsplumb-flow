import * as actionTypes from './constants';
import axios from "axios";
import { proConfig } from "@/common/config"
import React from "react";
import { message } from 'antd';

/**
 * 设置工作流图数据
 * @param nodeList
 * @returns {{dataItem: *, type: string}}
 */
export const setNodelistData = (nodeList) => ({
    type: actionTypes.SET_NODE_LIST,
    dataItem: nodeList
})

/**
 * 设置主工作流绘图区域高度
 * @param nodeList
 * @returns {{dataItem: *, type: string}}
 */
export const setMainContainerHeight = (mainHeight) => ({
    type: actionTypes.SET_MAIN_CONTAINER_HEIGHT,
    dataItem: mainHeight
})

/**
 * 设置节点鼠标光标
 * @param cursor
 * @returns {{dataItem: *, type: string}}
 */
export const setCursor = (cursor) => ({
    type: actionTypes.SET_CURSOR,
    dataItem: cursor
})

/**
 * 修改首页props监听判断
 * @param reRender
 * @returns {{dataItem: *, type: string}}
 */
export const setReRender = (reRender) => ({
    type: actionTypes.SET_RERENDER,
    dataItem: reRender
})
/**
 * 设置数据源
 * @param dataSource
 * @returns {{dataItem: *, type: *}}
 */
export const setDataSource = (dataSource) => ({
    type: actionTypes.SET_DATASOURCE,
    dataItem: dataSource
})

/**
 * 是否需要激活清除画布内容
 * @param dataSource
 * @returns {{dataItem: *, type: *}}
 */
export const clearOut = (booleanData) => ({
    type: actionTypes.CLEAR_OUT,
    dataItem: booleanData
})

/**
 * 保存工作流图标信息reducer
 * @param dataItem
 * @returns {{dataItem: *, type: string}}
 */
const saveWorkFlowReducer = (dataItem) =>({
  type: actionTypes.SAVE_WORKFLOW,
  dataItem
});
/**
 * 保存工作流图表信息到后台接口
 */
export const saveWorkFlow = (dataItem, requestUrl) => {
    return (dispatch)=>{
        // let dataItemFormData = new FormData();
        // dataItemFormData.append("bpmnJson", dataItem);
        // const extraData = JSON.parse(dataItem);
        // dataItemFormData.append("bpmnName", extraData.bpmnName);
        // dataItemFormData.append("bpmnDescription", extraData.bpmnDescription);
        let dataItemFormData = {"bpmnJson": dataItem};
        axios({
            method: 'post',
            url: requestUrl,
            data: dataItemFormData,
            headers: {
                'Content-Type':'application/json;charset=UTF-8'
            }
        })
            .then((res)=>{
                const { data: { data } } = res;
                console.log(data);
                message.success("工作流保存成功");
                dispatch(saveWorkFlowReducer(data));
            })
            .catch((error) => {
                //alert(error);
                message.error(error.message);
            })
    }
};
/**
 * 修改节点右键弹出菜单
 * @param data
 * @returns {{dataItem: *, type: string}}
 */
export const setNodeFlowMenu = (data) => ({
    type: actionTypes.SET_NODE_FLOW_MENU,
    dataItem: data
});

/**
 * 修改流程图的渲染模式：正向、反向以及反向的类别
 * @param data
 * @returns {{dataItem: *, type: string}}
 */
export const setWorkFlowMode = (data) => ({
    type: actionTypes.SET_WORK_FLOW_MODE,
    dataItem: data
});

/**
 * 设置主绘图区域的坐标值
 * @param data
 * @returns {{dataItem: *, type: string}}
 */
export const setMainContainerPos = (data) => ({
    type: actionTypes.SET_MAIN_CONTAINER_POS,
    dataItem: data
});
