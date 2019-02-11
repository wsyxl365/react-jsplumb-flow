import React, { Component } from "react";
import { connect } from "react-redux";
import { fromJS } from "immutable";
import Util from "../../../common/Util"
// 引入高阶组件函数
import HocUIProperty from "../../HocUI/HocUIProperty";
import "../../../static/css/rightAttr.css";
import { actionCreators as actionCreatorsProperty } from "../../../storeProperty";
import { actionCreators as actionCreatorsGlobal} from "../../../storeGlobal";

import { actionCreators as actionCreatorsPropertyReverse } from "../../../storePropertyReverse";
import { actionCreators as actionCreatorsGlobalReverse } from "../../../storeGlobalReverse";

import { proConfig } from "@/common/config.js";
// start 属性表单模块
import Start from "../../property/Start";
// UserTask 属性表单模块
import UserTask from "../../property/UserTask";
// ServiceTask 属性表单模块
import ServiceTask from "../../property/ServiceTask";
// GateWay 属性表单模块
import ExclusiveGateWay from "../../property/ExclusiveGateWay"; // 排他网关
import ParallelGateWay from "../../property/ParallelGateWay"; // 并行网关
import InclusiveGateWay from "../../property/InclusiveGateWay"; // 包容网关
// End 结束模块
import End from "../../property/End";
// 横向泳池模块
import PoolsOrientation from "../../property/PoolsOrientation";
// 纵向泳池模块
import PoolsDirection from "../../property/PoolsDirection";
// 横向泳道模块
import PoolLaneOrientation from "../../property/PoolLaneOrientation";
// 纵向泳道模块
import PoolLaneDirection from "../../property/PoolLaneDirection";

const mapStateToProps = (state, props) => {
    if(props.mode && props.mode === "reverse")
    {
        return {
            propertyData: state.getIn(['propertyReverse', 'propertyData']),
            nodeList: state.getIn(['globalReverse', 'nodeList']),
            data4: state.getIn(['globalReverse', 'data4']),
            bankFormList: state.getIn(['propertyReverse', 'bankFormList']),
            error: state.getIn(['propertyReverse', 'error'])
        }
    }
    else
    {
        return {
            propertyData: state.getIn(['property', 'propertyData']),
            nodeList: state.getIn(['global', 'nodeList']),
            data4: state.getIn(['global', 'data4']),
            bankFormList: state.getIn(['property', 'bankFormList']),
            error: state.getIn(['property', 'error'])
        }
    }
}

const mapDispatchToProps = (dispatch, props) => {
    if(props.mode && props.mode === "reverse")
    {
        return {
            handleSetProperty(propertyData){
                const action = actionCreatorsPropertyReverse.setProperty(propertyData);
                dispatch(action);
            },
            handleSetReRender(reRender){
                const action = actionCreatorsGlobalReverse.setReRender(reRender);
                dispatch(action);
            },
            handleSetDataSource(dataSource){
                const action = actionCreatorsGlobalReverse.setDataSource(dataSource);
                dispatch(action);
            },
            getBankFormList(pageNum, size, requestUrl){
                dispatch(actionCreatorsPropertyReverse.getBankFormList(pageNum, size, requestUrl));
            }
        }
    }
    else
    {
        return {
            handleSetProperty(propertyData){
                const action = actionCreatorsProperty.setProperty(propertyData);
                dispatch(action);
            },
            handleSetReRender(reRender){
                const action = actionCreatorsGlobal.setReRender(reRender);
                dispatch(action);
            },
            handleSetDataSource(dataSource){
                const action = actionCreatorsGlobal.setDataSource(dataSource);
                dispatch(action);
            },
            getBankFormList(pageNum, size, requestUrl){
                dispatch(actionCreatorsProperty.getBankFormList(pageNum, size, requestUrl));
            }
        }
    }
}

@HocUIProperty("节点属性编辑")
@connect(mapStateToProps, mapDispatchToProps)
class NodeFlow extends Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: this.props.propertyData.name
        };
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChangeId = this.handleChangeId.bind(this);
        this.handleBlurId = this.handleBlurId.bind(this);
        this.handleChangeTextArea = this.handleChangeTextArea.bind(this);
        this.handleBlurTextArea = this.handleBlurTextArea.bind(this);
    }

    /**
     * 节点名称回调事件
     */
    handleBlur(e){
        const { propertyData, data4, handleSetReRender, handleSetDataSource } = this.props;
        let newData = data4.toJS();
        let propertyDataToJs = propertyData.toJS();

        let newDataItem = newData.nodeData.find((item) => {
            return item.id === propertyDataToJs.id;
        });
        newDataItem.name = e.target.value;
        /**
         * 更新全局reRender变量，触发data4源数据重新循环渲染
         */
        handleSetReRender({
            hash: Util.randHash()
        });
        /**
         * 操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
         */
        handleSetDataSource(fromJS(newData));
    }
    /**
     * 节点名称input输入事件
     */
    handleChangeInput(event){
        const { propertyData, handleSetProperty } = this.props;
        let newPropertyData = propertyData.toJS();
        newPropertyData.name = event.target.value;
        handleSetProperty(fromJS(newPropertyData))
    }

    /**
     * id input输入事件
     * 备注一下，由于jsplumb会操作页面的id节点元素，所以动态的改变id没有实际的意义而且会引起
     * jsplumb报错，这里暂时不让用户修改，做成只读属性，如果后期有需要可以新增uid来标识节点
     * 组件的id，这样就和真实的id区分开
     * @param event
     */
    handleChangeId(event){
        // const { data4, propertyData, handleSetDataSource, handleSetProperty, handleSetReRender } = this.props;
        // let newData = data4.toJS();
        // let propertyDataToJs = propertyData.toJS();
        // let newDataItem = newData.nodeData.find((item) => {
        //     return item.id ===  propertyDataToJs.id;
        // });
        // newDataItem.id = propertyDataToJs.id = event.target.value;
        // handleSetDataSource(fromJS(newData));
        // handleSetProperty(fromJS(propertyDataToJs));
        // /**
        //  * 更新全局reRender变量，触发data4源数据重新循环渲染
        //  */
        // handleSetReRender({
        //     hash: Util.randHash()
        // });
    }
    /**
     * id input失焦回调事件
     */
    handleBlurId(e){
        // const { propertyData, data4, handleSetReRender, handleSetDataSource } = this.props;
        // let newData = data4.toJS();
        // let propertyDataToJs = propertyData.toJS();
        //
        // let newDataItem = newData.nodeData.find((item) => {
        //    return item.id ===  propertyDataToJs.id;
        // });
        // newDataItem.id = e.target.value;
        //
        // /**
        //  * 操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
        //  */
        // handleSetDataSource(fromJS(newData));
    }

    /**
     * Documentation textarea输入事件
     * @param event
     */
    handleChangeTextArea(event){
        const { propertyData, handleSetProperty } = this.props;
        let newPropertyData = propertyData.toJS();
        newPropertyData.documentation = event.target.value;
        handleSetProperty(fromJS(newPropertyData))
    }
    /**
     * Documentation textarea失焦回调事件
     */
    handleBlurTextArea(e){
        const { propertyData, data4, handleSetReRender, handleSetDataSource } = this.props;
        let newData = data4.toJS();
        let propertyDataToJs = propertyData.toJS();
        let newDataItem = newData.nodeData.find((item) => {
            return item.id === propertyDataToJs.id;
        });
        newDataItem.documentation = e.target.value;
        /**
         * 更新全局reRender变量，触发data4源数据重新循环渲染
         */
        handleSetReRender({
            hash: Util.randHash()
        });
        /**
         * 操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
         */
        handleSetDataSource(fromJS(newData));
    }

    renderItem(type, propsItem, otherProps){
        switch (type) {
            case proConfig.nodeFlowType.start: //开始
                return (
                    <Start {...propsItem} {...otherProps} />
                );
            case proConfig.nodeFlowType.userTask: //用户任务
                return (
                    <UserTask {...propsItem} {...otherProps} />
                );
            case proConfig.nodeFlowType.serviceTask: //服务任务
                return (
                    <ServiceTask {...propsItem} {...otherProps} />
                );
            case proConfig.nodeFlowType.exclusiveGateway: //排他网关
                return (
                    <ExclusiveGateWay {...propsItem} {...otherProps} />
                );
            case proConfig.nodeFlowType.parallelGateway: //并行网关
                return (
                    <ParallelGateWay {...propsItem} {...otherProps} />
                );
            case proConfig.nodeFlowType.inclusiveGateway: //包容网关
                return (
                    <InclusiveGateWay {...propsItem} {...otherProps} />
                );
            case proConfig.nodeFlowType.end: //结束
                return (
                    <End {...propsItem} {...otherProps} />
                );
            case proConfig.nodeFlowType.poolsOrientation: //横向泳池
                return (
                    <PoolsOrientation {...propsItem} {...otherProps} />
                );
            case proConfig.nodeFlowType.poolsDirection: //纵向泳池
                return (
                    <PoolsDirection {...propsItem} {...otherProps} />
                );
            case proConfig.nodeFlowType.poolLaneOrientation: //横向泳池
                return (
                    <PoolLaneOrientation {...propsItem} {...otherProps} />
                );
            case proConfig.nodeFlowType.poolLaneDirection: //纵向泳池
                return (
                    <PoolLaneDirection {...propsItem} {...otherProps} />
                );
            default :
                return (<div style={{ paddingBottom: "5px", textAlign: "center" }}>
                    未定义节点类型
                </div>)
        }
    }

    render() {
        const { propertyData, error, bankFormList, data4, handleSetDataSource, handleSetReRender, handleSetProperty, getBankFormList, mode } = this.props;
        let propertyDataToJs = propertyData.toJS();
        const nameInputProps = {
            onChange: this.handleChangeInput,
            onBlur : this.handleBlur,
            value: propertyDataToJs.name
        };
        const idInputProps = {
            readOnly : "readOnly",
            onChange: this.handleChangeId,
            onBlur : this.handleBlurId,
            value: propertyDataToJs.id
        };
        const textAreaProps = {
            onChange: this.handleChangeTextArea,
            onBlur: this.handleBlurTextArea,
            value: propertyDataToJs.documentation
        };
        const otherProps = {
            mode,
            bankFormList,
            error,
            propertyData,
            data4,
            handleSetDataSource,
            handleSetReRender,
            handleSetProperty,
            getBankFormList
        }
        return (<div>
                {
                    this.renderItem(propertyDataToJs.type, {nameInputProps, idInputProps, textAreaProps}, otherProps)
                }
        </div>)
    }
}

export default NodeFlow;