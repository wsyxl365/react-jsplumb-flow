import React, { Component } from "react";
import {
    Input,
    Select,
    Popconfirm,
    Modal,
    Button
} from 'antd';
import { connect } from "react-redux";
// 引入高阶组件函数
import HocUIProperty from "../../HocUI/HocUIProperty";
import { actionCreators as actionCreatorsProperty } from "../../../storeProperty";
import { actionCreators as actionCreatorsGlobal } from "../../../storeGlobal";

import { actionCreators as actionCreatorsPropertyReverse } from "../../../storePropertyReverse";
import { actionCreators as actionCreatorsGlobalReverse } from "../../../storeGlobalReverse";
import {fromJS} from "immutable";
import AceEditor from 'react-ace';
import { proConfig } from "../../../common/config";
import "brace/mode/java"
/**
 * 加载全部的react-ace语言及主体条件
 */
proConfig.languages.forEach(lang => {
    require(`brace/mode/${lang}`);
    require(`brace/snippets/${lang}`);
});
proConfig.themes.forEach(theme => {
    require(`brace/theme/${theme}`);
});

const { TextArea } = Input;
const { Option } = Select;

const mapStateToProps = (state, props) => {
    if(props.mode && props.mode === "reverse")
    {
        return {
            propertyData: state.getIn(['propertyReverse', 'propertyData']).toJS(),
            nodeList: state.getIn(['globalReverse', 'nodeList']),
            data4: state.getIn(['globalReverse', 'data4']),
        }
    }
    else
    {
        return {
            propertyData: state.getIn(['property', 'propertyData']).toJS(),
            nodeList: state.getIn(['global', 'nodeList']),
            data4: state.getIn(['global', 'data4']),
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
            }
        }
    }
}

@HocUIProperty("连线属性编辑")
@connect(mapStateToProps, mapDispatchToProps)
class ConnectLine extends Component {
    constructor(props){
        super(props);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.handleChangeInputId = this.handleChangeInputId.bind(this);
        this.handleBlurId = this.handleBlurId.bind(this);
        this.handleFocusId = this.handleFocusId.bind(this);

        this.handleChangeTextArea = this.handleChangeTextArea.bind(this);
        this.handleBlurTextArea = this.handleBlurTextArea.bind(this);

        this.handleChangeRules = this.handleChangeRules.bind(this);
        this.handleBlurRules = this.handleBlurRules.bind(this);

        this.handleChangeRulesLanguage = this.handleChangeRulesLanguage.bind(this);

        this.onChangeEdit = this.onChangeEdit.bind(this);
        this.onFocusRluesInput = this.onFocusRluesInput.bind(this);
        this.rulesModalOk = this.rulesModalOk.bind(this);
        this.rulesModalCancel = this.rulesModalCancel.bind(this);
        console.log('this.props-connectLine', this.props);
        /**
         * 由于修改了id 但是又需要用id进行比较去获取数据源中的值，所以用State临时存储下该id值
         * @type {{inputId: string}}
         */
        this.state = {
            inputId : "",
            rules: false,
            //rulesEditValue: this.props.propertyData.rules || "" // react-ace编辑器的值 如果当前propertyData数据中rules字段有值就取，否则就是"" 临时变量保存
        }
    }
    /**
     * 审批角色回调
     * @param value
     */
    handleChange(value){
        console.log(`selected ${value}`);
    }
    /**
     * 连线标签名回调事件
     */
    handleBlur(e){
        const { jsPlumb, propertyData, data4, handleSetReRender, handleSetDataSource, jsplumGetConnections } = this.props;
        /**
         * 首先需要获取当前连线的Overlays信息
         * 循环判断得到当前的标签name值
         * @type {Array<any> | Map<any, any>}
         */
        let getConnectionsObj = jsplumGetConnections({
            source: propertyData.source.elementId,
            target: propertyData.target.elementId
        });
        let connectionsObj = getConnectionsObj[0];
        let overlays = connectionsObj.getOverlays();
        let labelText = null, labelOverlays = null;
        Object.keys(overlays).forEach(key => {
            if (overlays[key].type === 'Label') {
                labelOverlays = overlays[key];
                labelText = overlays[key].labelText;
            }
        });
        /**
         * 根据labelText的值去判断是直接渲染还是有值去覆盖物渲染
         * labelText无值的情况 return null
         * @type {{[K in keyof TProps]: any} | Object | Array<any> | {[p: string]: any} | {[K in keyof TProps]: any}}
         */
        /**
         * 1、文本不为空，首先获取连接 -> 上文已经获取到 connectionsObj
         * 2、获取文本覆盖物，判断是否存在，存在时移除文本覆盖物
         */
        connectionsObj.removeOverlay(labelOverlays.id);
        /**
         * 如果用户输入为空，那么就隐藏label标签，直接不定义Class名称就可以了
         */
        connectionsObj.setLabel({
            label: e.target.value,
            cssClass: e.target.value === "" ? '' : 'jtk-overlay-label',
            location: 0.4,
        });
        /**
         * 更新数据源，方便操作
         * @type {{[K in keyof TProps]: any} | Object | Array<any> | {[p: string]: any} | {[K in keyof TProps]: any}}
         */
        let newData = data4.toJS();
        newData.connectionData.forEach((item, index)=>{
            if(item.id === propertyData.id) {
                return item.name = e.target.value;
            }
        });
        handleSetDataSource(fromJS(newData));
    }

    /**
     * name input输入事件
     * @param event
     */
    handleChangeInput(event){
        const { propertyData } = this.props;
        let newPropertyData = propertyData;
        newPropertyData.name = event.target.value;
        this.props.handleSetProperty(fromJS(newPropertyData))
    }

    /**
     * id input焦点事件
     * 每次获得焦点后保存当前的id值至State inputId里面，
     * 用于后面失焦事件当前id和数据源里面的id做比较
     */
    handleFocusId(){
        const { propertyData } = this.props;
        this.setState(()=>({
            inputId: propertyData.id
        }))
    }
    /**
     * id input输入事件
     * @param event
     */
    handleChangeInputId(event) {
        const { propertyData } = this.props;
        let newPropertyData = propertyData;
        newPropertyData.id = event.target.value;
        this.props.handleSetProperty(fromJS(newPropertyData))
    }
    /**
     * id input失焦回调事件
     */
    handleBlurId(event){
        const { propertyData, data4, handleSetDataSource } = this.props;
        /**
         * 更新数据源，方便操作
         * @type {{[K in keyof TProps]: any} | Object | Array<any> | {[p: string]: any} | {[K in keyof TProps]: any}}
         */
        let newData = data4.toJS();
        newData.connectionData.forEach((item, index)=>{
            if(item.id === this.state.inputId) {
                return item.id = event.target.value;
            }
        });
        handleSetDataSource(fromJS(newData));
    }

    /**
     * Documentation textarea输入事件
     * @param event
     */
    handleChangeTextArea(event){
        const { propertyData, handleSetProperty } = this.props;
        propertyData.documentation = event.target.value;
        handleSetProperty(fromJS(propertyData))
    }
    /**
     * Documentation textarea失焦回调事件
     */
    handleBlurTextArea(e){
        const { propertyData, data4, handleSetDataSource } = this.props;
        let newData = data4.toJS();
        newData.connectionData.forEach((item, index)=>{
            if(item.id === propertyData.id) {
                return item.documentation = e.target.value;
            }
        });
        /**
         * 操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
         */
        handleSetDataSource(fromJS(newData));
    }

    /**
     * 规则 input输入事件
     */
    handleChangeRules(event) {
        const { propertyData, handleSetProperty } = this.props;
        propertyData.rules = event.target.value;
        handleSetProperty(fromJS(propertyData))
    }
    /**
     * 规则 input失焦事件
     */
    handleBlurRules(event) {
        const { propertyData, data4, handleSetDataSource } = this.props;
        let newData = data4.toJS();
        newData.connectionData.forEach((item, index)=>{
            if(item.id === propertyData.id) {
                return item.rules = event.target.value;
            }
        });
        /**
         * 操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
         */
        handleSetDataSource(fromJS(newData));
    }

    /**
     * 规则语言 input选择框改变事件
     */
    handleChangeRulesLanguage(value){
        console.log("value", value);
        const { propertyData, data4, handleSetDataSource, handleSetReRender, handleSetProperty } = this.props;
        let newData = data4.toJS();
        newData.connectionData.forEach((item, index)=>{
            if(item.id === propertyData.id) {
                return item.rulesLanguage = value;
            }
        });
        /**
         * 操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
         */
        handleSetDataSource(fromJS(newData));
        /**
         * 这里propertyData属性数据源也需要动态更新
         * 由于这里需要多个连线之间切换，所以必须及时更新全局状态的属性值
         */
        let newPropertyData = propertyData;
        newPropertyData.rulesLanguage = value;
        handleSetProperty(fromJS(newPropertyData));
    }

    /**
     * react-ace onChange编辑事件
     * @param newValue
     */
    onChangeEdit(newValue){
        console.log('change',newValue);
        const { propertyData, handleSetProperty } = this.props;
        /**
         * 这里propertyData属性数据源也需要动态更新
         * 由于这里需要多个连线之间切换，所以必须及时更新全局状态的属性值
         */
        propertyData.rules = newValue;
        handleSetProperty(fromJS(propertyData));
    }

    /**
     * 页面设置规则input的焦点focus事件
     */
    onFocusRluesInput(){
        this.refs.blur();
        this.setState(()=>({rules: true}))
    }

    /**
     * 规则编辑器modal框确定按钮回调
     **/
    rulesModalOk (){
        this.setState(()=>({rules: false}))
        /**
         * 如果用户点击了确定按钮，那么就把rulesEditValue的state值更新到全局的data4中，然后在更新propertyData的当前属性值
         */
        const { propertyData, data4, handleSetDataSource, handleSetProperty } = this.props;
        let newData = data4.toJS();
        newData.connectionData.forEach((item, index)=>{
            if(item.id === propertyData.id) {
                return item.rules = propertyData.rules;
            }
        });
        /**
         * 操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
         */
        handleSetDataSource(fromJS(newData));
    }

    /**
     * 规则编辑器modal框取消按钮回调
     **/
    rulesModalCancel(){
        this.setState(()=>({
            rules: false, // 关闭编辑modal框
        }))
    }
    /**
     * 规则编辑取消modal按钮确定逻辑
     **/
    // cancelValidate(){
    //     this.setState(()=>({
    //         rules: false, // 关闭编辑modal框
    //     }))
    // }

    render() {
        const { propertyData } = this.props;
        return (<div className="container-body">
            <div className="item-container">
                <div className="item-title">Id:</div>
                <Input
                    placeholder="编辑Id"
                    onChange={this.handleChangeInputId}
                    onBlur={this.handleBlurId}
                    onFocus={this.handleFocusId}
                    value={ propertyData.id }
                />
            </div>
            <div className="item-container">
                <div className="item-title">连线标签名称:</div>
                <Input
                    placeholder="编辑标签名称"
                    onChange={this.handleChangeInput}
                    onBlur={this.handleBlur}
                    value={ propertyData.name }
                />
            </div>
            <div className="item-container">
                <div className="item-title">描述:</div>
                <TextArea
                    type="textarea"
                    placeholder="在这里输入节点的描述"
                    onChange={this.handleChangeTextArea}
                    onBlur={this.handleBlurTextArea}
                    autosize={{ minRows: 2, maxRows: 6 }}
                    value={ propertyData.documentation }
                />
            </div>
            {
                propertyData.renderType === proConfig.nodeFlowType.connectionLineNormal
                    ?
                        null
                    :
                        <div className="item-container">
                            <div className="item-title">规则:</div>
                            <Input ref={ref => this.refs = ref} placeholder="设置规则" value={this.props.propertyData.rules}
                                   onFocus={this.onFocusRluesInput} readOnly/>

                            <Modal
                                title="连线规则编辑器"
                                width="60%"
                                visible={this.state.rules}
                                onOk={this.rulesModalOk}
                                onCancel={this.rulesModalCancel}
                                footer={[
                                    <Button type="primary" onClick={this.rulesModalOk}>
                                        确定
                                    </Button>,
                                ]}
                            >
                                <div className="item-container">
                                    <div className="item-title">规则语言选择:</div>
                                    <Select
                                        value={propertyData.rulesLanguage}
                                        onChange={this.handleChangeRulesLanguage}
                                    >
                                        <Option value="activiti">activiti</Option>
                                        <Option value="drools">drools</Option>
                                        <Option value="groovy">groovy</Option>
                                        <Option value="javascript">javascript</Option>
                                    </Select>
                                </div>
                                <AceEditor
                                    width="100%"
                                    value={propertyData.rules}
                                    mode={propertyData.rulesLanguage}
                                    theme="monokai"
                                    onChange={this.onChangeEdit}
                                    name="UNIQUE_ID_OF_DIV"
                                />
                            </Modal>
                        </div>
            }
        </div>)
    }
}

export default ConnectLine;