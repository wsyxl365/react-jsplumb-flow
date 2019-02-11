import * as actionTypes from './constants';
import { fromJS } from "immutable";

const defaultState = fromJS({
    focused: "MouseMoveTools" //连线工具、鼠标工具的选中状态字段
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
    if(action.type === actionTypes.BUTTON_FOCUS) {
        // immutable对象的set方法，会结合之前immutable对象的值
        // 和设置的值，返回一个全新的对象
        /**
         * 点击了连线工具以后，设置连线工具的字段为true,并且把其他工具的字段设为false
         */
        return state.set("focused",action.dataItem);

    }
    if(action.type === actionTypes.BUTTON_FOCUS_MOUSE) {
        /**
         * 点击了鼠标工具以后，设置鼠标工具的字段为true,并且把其他工具的字段设为false
         */
        return state.set("mouseFocused",true).set("lineFocused", false);
    }
    return state;
}