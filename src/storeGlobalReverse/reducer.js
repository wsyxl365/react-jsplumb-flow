import * as actionTypes from './constants';
import { fromJS } from "immutable";
import _ from "lodash";
import { proConfig } from "@/common/config";

const defaultState = fromJS({
    mode: "Reverse",
    data4: _.cloneDeep(proConfig.dataSource),
    /**
     * 用于首页监听比对props是否发生了改变，从而重新返回动态虚拟dom渲染页面
     */
    reRender: "",
    /**
     * 流程图初始数据
     */
    nodeList: [],
    /**
     * 是否需要清除画布内容
     */
    isClearCont: true,
    /**
     * 主绘图区域的高度
     */
    mainContainerHeight: 0,
    commonFreeConnectStyle: {
        endpoint: [ "Dot", { radius: 4 , cssClass: "addSource"} ],
        // 设置端点的样式
        endpointStyle: {
            fill: '#787878', // 填充颜色
            outlineStroke: 'blank', // 边框颜色
            outlineWidth: 0, // 边框宽度
        },
        // 设置连接线的样式 Bezier-贝瑟尔曲线 Flowchart-流程图 StateMachine-弧线 Straight-直线
        connector: ['Flowchart'],
        // 设置连接线的样式
        connectorStyle: {
            stroke: '#456', // 实线颜色
            strokeWidth: 3, // 实线宽度
            outlineStroke: 'blank', // 边框颜色
            outlineWidth: 2, // 边框宽度
        },
        connectorHoverStyle: {
            stroke: "#ff6627",
        },
        connectorOverlays: [
            ['Arrow', {
                width: 10,
                length: 10,
                location: 1
            }]
        ],
        anchor: "Continuous",
    },
    dataJson: {}, // 工作流提交的数据
    nodeFlowMenu: {
        isSet: false,
        info: {}
    }, // 节点右键弹出菜单
    reverseRender: {
        status: false,
        name: "normal"
    },
    mainContainerPosition: {} //主绘图区域container坐标值
});
/**
 * fromJS可以把一个js对象转化成一个immutable对象
 */

/**
 * 这里一定要保证是纯函数，返回固定值且没有副作用
 * @param state
 * @param action
 * @returns {{}}
 */
export default (state = defaultState, action ) => {
    if(action.type === actionTypes.SET_NODE_LIST) {
        // immutable对象的set方法，会结合之前immutable对象的值
        // 和设置的值，返回一个全新的对象
        /**
         * 点击了连线工具以后，设置连线工具的字段为true,并且把其他工具的字段设为false
         */
        return state.set("nodeList",action.dataItem);
    }
    if(action.type === actionTypes.SET_MAIN_CONTAINER_HEIGHT) {
        // immutable对象的set方法，会结合之前immutable对象的值
        // 和设置的值，返回一个全新的对象
        return state.set("mainContainerHeight",action.dataItem);
    }
    if(action.type === actionTypes.SET_RERENDER) {
        // immutable对象的set方法，会结合之前immutable对象的值
        // 和设置的值，返回一个全新的对象
        return state.set("reRender",action.dataItem);
    }
    if(action.type === actionTypes.SET_DATASOURCE) {
        // immutable对象的set方法，会结合之前immutable对象的值
        // 和设置的值，返回一个全新的对象
        return state.set("data4",action.dataItem);
    }
    if(action.type === actionTypes.CLEAR_OUT) {
        // immutable对象的set方法，会结合之前immutable对象的值
        // 和设置的值，返回一个全新的对象
        return state.set("isClearCont",action.dataItem);
    }
    if(action.type === actionTypes.SAVE_WORKFLOW) {
        return state.set("dataJson", action.dataItem);
    }
    if(action.type === actionTypes.SET_NODE_FLOW_MENU) {
        return state.set("nodeFlowMenu", action.dataItem);
    }
    if(action.type === actionTypes.SET_WORK_FLOW_MODE) {
        return state.set("reverseRender", action.dataItem);
    }
    if(action.type === actionTypes.SET_MAIN_CONTAINER_POS) {
        return state.set("mainContainerPosition", action.dataItem);
    }
    return state;
}