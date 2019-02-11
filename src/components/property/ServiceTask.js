import React, {Component, Fragment} from "react";
import HocFormComponent from "../HocUI/HocFormComponent";
import { Input, Select, Tooltip, message } from 'antd';
import ServiceTaskRuleInputEdit from "./component/ServiceTaskRuleInputEdit";
import { fromJS } from "immutable";
import Util from "@/common/Util";

const { Option } = Select;
/**
 * 服务任务右侧属性组件
 */
@HocFormComponent()
class UserTask extends Component{
    constructor(props){
        super(props);
        this.handleChangeSet = this.handleChangeSet.bind(this);
        this.onChangeClass = this.onChangeClass.bind(this);
        this.onBlurClass = this.onBlurClass.bind(this);
        this.onChangeLanguage = this.onChangeLanguage.bind(this);
        this.onChangeEditValue = this.onChangeEditValue.bind(this);
        this.handleChangeSetDelegateExpression = this.handleChangeSetDelegateExpression.bind(this);
    }

    /**
     * 配置下拉框选择事件回调
     */
    handleChangeSet(selectValue){
        const { propertyData, data4, handleSetDataSource, handleSetReRender, handleSetProperty } = this.props;
        /**
         * 把数据源和属性数据从immutable对象转换成普通的js对象
         * @type {{[K in keyof TProps]: any} | Object | Array<any> | {[p: string]: any} | {[K in keyof TProps]: any}}
         */
        let newData = data4.toJS();
        let propertyDataToJs = propertyData.toJS();
        /**
         * 1.得到数据源中符合当前数据的对象，由于选择框不同的字段对应的数据结构不一样，
         * 所以这里需要判断一下，赋值不同的对象
         * 2.这里也需要把当前的propertyDataToJs属性对象赋值
         */
        let serviceTaskRuleItem = newData.nodeData.find((item) => {
           return item.id === propertyDataToJs.id;
        });
        if( selectValue === "expression" )
        {
            serviceTaskRuleItem.serviceTaskRule = propertyDataToJs.serviceTaskRule = {
                type: selectValue,
                rulesLanguage: "activiti",
                rules: ""
            };
        }
        else
        {
            serviceTaskRuleItem.serviceTaskRule = propertyDataToJs.serviceTaskRule = {
                value: "",
                type: selectValue
            };
        }
        /**
         * 1.操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
         * 2.这里也需要把当前的propertyDataToJs属性对象更新至全局store,因为规则配置的显示隐藏组件是靠属性数据驱动的
         */
        handleSetDataSource(fromJS(newData));
        handleSetProperty(fromJS(propertyDataToJs));
        /**
         * 更新全局reRender变量，触发data4源数据重新循环渲染
         * 因为节点的点击事件需要重新循环数据源去拿到最新的info
         */
        handleSetReRender({
            hash: Util.randHash()
        });
    }

    /**
     * 配置class value
     */
    onChangeClass(e) {
        const { value } = e.target;
        const { propertyData, handleSetProperty } = this.props;
        let ServiceTaskRuleDataToJs = propertyData.toJS();

        ServiceTaskRuleDataToJs.serviceTaskRule = {
            value,
            type: "class"
        };
        handleSetProperty(fromJS(ServiceTaskRuleDataToJs));
    }
    /**
     * 配置class value 失焦事件
     */
    onBlurClass() {
        const { propertyData, data4, handleSetDataSource, handleSetReRender } = this.props;
        const reg = /^([a-zA-Z]+\.)([a-zA-Z]+\.)*([a-zA-Z][a-zA-Z0-9]+)$/;

        let newData = data4.toJS();
        let propertyDataToJs = propertyData.toJS();

        if( reg.test(propertyDataToJs.serviceTaskRule.value)) {
            message.success("规则配置成功");
            /**
             * 当规则正则验证成功后才更新数据源数据
             */
            let serviceTaskRuleItem = newData.nodeData.find((item)=>{
                return item.id === propertyDataToJs.id;
            });
            serviceTaskRuleItem.serviceTaskRule = {
                value: propertyDataToJs.serviceTaskRule.value,
                type: "class"
            };
            /**
             * 操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
             */
            handleSetDataSource(fromJS(newData));
            /**
             * 更新全局reRender变量，触发data4源数据重新循环渲染
             * 因为节点的点击事件需要重新循环数据源去拿到最新的info
             */
            handleSetReRender({
                hash: Util.randHash()
            });
        } else {
            message.error("规则配置失败，合法的java类路径，只能包含字母和\".\" ,不能包含其他字符");
        }
    }

    /**
     * 根据规则编辑器切换不同的语言，对store的数据进行保存操作
     */
    onChangeLanguage( selectValue ) {
        const { propertyData, data4, handleSetDataSource, handleSetReRender, handleSetProperty } = this.props;
        let newData = data4.toJS();
        let propertyDataToJs = propertyData.toJS();
        /**
         * 找到数据源nodeData对应的数据对象并且把selectValue赋值给rulesLanguage
         */
        let serviceTaskRuleItem = newData.nodeData.find((item) => {
            return item.id === propertyDataToJs.id;
        });
        serviceTaskRuleItem.serviceTaskRule.rulesLanguage = propertyDataToJs.serviceTaskRule.rulesLanguage = selectValue;
        /**
         * 1.操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
         * 2.这里也需要把当前的propertyDataToJs属性对象更新至全局store,因为语言选择input组件是靠属性数据驱动的
         */
        handleSetDataSource(fromJS(newData));
        handleSetProperty(fromJS(propertyDataToJs));
        /**
         * 更新全局reRender变量，触发data4源数据重新循环渲染
         * 因为节点的点击事件需要重新循环数据源去拿到最新的info
         */
        handleSetReRender({
            hash: Util.randHash()
        });
    }

    /**
     * 规则编辑器输入值改变事件
     */
    onChangeEditValue(inputValue) {
        const { propertyData, data4, handleSetDataSource, handleSetReRender, handleSetProperty } = this.props;
        let newData = data4.toJS();
        let propertyDataToJs = propertyData.toJS();

        let serviceTaskRuleItem = newData.nodeData.find((item) => {
            return item.id === propertyDataToJs.id;
        });
        serviceTaskRuleItem.serviceTaskRule.rules = propertyDataToJs.serviceTaskRule.rules = inputValue;
        /**
         * 操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
         */
        handleSetDataSource(fromJS(newData));
        handleSetProperty(fromJS(propertyDataToJs));
        /**
         * 更新全局reRender变量，触发data4源数据重新循环渲染
         * 因为节点的点击事件需要重新循环数据源去拿到最新的info
         */
        handleSetReRender({
            hash: Util.randHash()
        });
    }

    /**
     * DelegateExpression下拉选择input select回调事件
     */
    handleChangeSetDelegateExpression(selectValue) {
        const { propertyData, data4, handleSetDataSource, handleSetReRender, handleSetProperty } = this.props;
        /**
         * 把数据源和属性数据从immutable对象转换成普通的js对象
         * @type {{[K in keyof TProps]: any} | Object | Array<any> | {[p: string]: any} | {[K in keyof TProps]: any}}
         */
        let newData = data4.toJS();
        let propertyDataToJs = propertyData.toJS();
        /**
         * 1.得到数据源中符合当前数据的对象，由于选择框不同的字段对应的数据结构不一样，
         * 所以这里需要判断一下，赋值不同的对象
         * 2.这里也需要把当前的propertyDataToJs属性对象赋值
         */
        let serviceTaskRuleItem = newData.nodeData.find((item) => {
            return item.id === propertyDataToJs.id;
        });
        serviceTaskRuleItem.serviceTaskRule = propertyDataToJs.serviceTaskRule = {
            value: selectValue,
            type: "delegateExpression"
        };
        /**
         * 1.操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
         * 2.这里也需要把当前的propertyDataToJs属性对象更新至全局store,因为规则配置的显示隐藏组件是靠属性数据驱动的
         */
        handleSetDataSource(fromJS(newData));
        handleSetProperty(fromJS(propertyDataToJs));
        /**
         * 更新全局reRender变量，触发data4源数据重新循环渲染
         * 因为节点的点击事件需要重新循环数据源去拿到最新的info
         */
        handleSetReRender({
            hash: Util.randHash()
        });
    }
    /**
     * 根据配置选择的内容展示不容的组件
     */
    renderSetInput() {
        const { propertyData } = this.props;
        let propertyDataToJs = propertyData.toJS();
        switch ( propertyDataToJs.serviceTaskRule.type ) {
            case "class" :
                return (
                    <div className="item-container">
                        <div className="item-title">class规则配置:</div>
                        <Tooltip
                            trigger={['focus']}
                            title={"合法的java类路径，只能包含字母和\".\" ,不能包含其他字符"}
                            placement="topLeft"
                            overlayClassName="numeric-input"
                        >
                            <Input
                                value={  propertyDataToJs.serviceTaskRule.value }
                                onChange={ this.onChangeClass }
                                onBlur={ this.onBlurClass }
                                placeholder='配置class'
                                maxLength="30"
                            />
                        </Tooltip>
                    </div>
                );
            case "expression" :
                return (
                    <div className="item-container">
                        <div className="item-title">expression规则配置:</div>
                        <ServiceTaskRuleInputEdit
                            placeholder="设置规则"
                            rules={ propertyDataToJs.serviceTaskRule.rules }
                            selectValue ={ propertyDataToJs.serviceTaskRule.rulesLanguage }
                            onChangeLanguage = { this.onChangeLanguage }
                            onChangeEditValue = { this.onChangeEditValue}
                            modalTitle="服务任务规则编辑器"
                            readOnly
                        />
                    </div>
                );
            case "delegateExpression" :
                return (
                    <div className="item-container">
                        <div className="item-title">delegateExpression规则配置:</div>
                        {/* 后期这边提供接口供select选择，这边暂时硬编码 */}
                        <Select
                            value={ propertyDataToJs.serviceTaskRule.value }
                            style={{ width: "100%" }}
                            onChange={this.handleChangeSetDelegateExpression}
                        >
                            <Option value="SpringBeanOne">SpringBeanOne</Option>
                            <Option value="SpringBeanTwo">SpringBeanTwo</Option>
                            <Option value="SpringBeanThree">SpringBeanThree</Option>
                        </Select>
                    </div>
                );
            default:
                return null;
        };
    }
    render() {
        const { propertyData } = this.props;
        let propertyDataToJs = propertyData.toJS();
        return (<Fragment>
            <div className="item-container">
                <div className="item-title">规则配置:</div>
                <Select
                    value={ propertyDataToJs.serviceTaskRule.type }
                    style={{ width: "100%" }}
                    onChange={this.handleChangeSet}
                >
                    <Option value="class">class</Option>
                    <Option value="expression">expression</Option>
                    <Option value="delegateExpression">delegateExpression</Option>
                </Select>
            </div>
            {
                this.renderSetInput()
            }
        </Fragment>)

    }
}
export default UserTask;