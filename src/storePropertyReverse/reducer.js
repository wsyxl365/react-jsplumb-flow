import * as actionTypes from './constants';
import { fromJS } from "immutable";

const defaultState = fromJS({
    propertyData: {}, //右侧属性数据
    bankFormList: {}, // 银行表单列表数据
    error: {
        isRender: 0,
        dataString: ""
    }
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
    if(action.type === actionTypes.SET_PROPERTY) {
        // immutable对象的set方法，会结合之前immutable对象的值
        // 和设置的值，返回一个全新的对象
        return state.set("propertyData",action.dataItem);
    }
    if(action.type === actionTypes.BANK_FORM_LIST) {
        return state.set("bankFormList", action.dataItem);
    }
    if(action.type === actionTypes.ERROR) {
        return state.set("error", action.dataItem);
    }
    return state;
}