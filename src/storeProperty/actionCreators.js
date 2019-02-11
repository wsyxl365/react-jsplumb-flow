import * as actionTypes from './constants';
import axios from "axios";
import { proConfig } from "@/common/config.js";
export const setProperty = (propertyData) => ({
    type: actionTypes.SET_PROPERTY,
    dataItem: propertyData
})
/**
 * Catch错误
 * @param data
 * @returns {{dataItem: *, type: string}}
 */
const Error = (data) => ({
    type: actionTypes.ERROR,
    dataItem: data
})

/**
 * thunk获取银行表单列表数据
 * @param data
 * @returns {{dataItem: *, type: string}}
 */
const bankFormList = (data) => ({
    type: actionTypes.BANK_FORM_LIST,
    dataItem: data
})
/**
 *
 * @param pageNum 页码
 * @param size 条数
 * @returns {Function}
 */
export const getBankFormList = (pageNum, size, requestUrl)=>{
    return (dispatch) => {
        axios.get(`${requestUrl}?pageNum=${pageNum}&size=${size}`)
            .then((res)=>{
                const { data: { data, count } } = res;
                console.log(data);
                let newData = {
                    data,
                    count
                };
                dispatch(bankFormList(newData));
            })
            .catch((error) => {
                dispatch(Error({
                    isRender: 1,
                    dataString: `${error.message}`
                }));
            })
    }
}