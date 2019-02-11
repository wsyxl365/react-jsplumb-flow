import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { connect } from "react-redux";
import { actionCreators as actionCreatorsGlobal } from "@/storeGlobal";
import { actionCreators as actionCreatorsGlobalReverse } from "@/storeGlobalReverse";
import { fromJS } from "immutable";
const FormItem = Form.Item;

const mapStateToProps = (state, props) => {
    if(props.mode && props.mode === "reverse")
    {
        return {
            data4: state.getIn(['globalReverse', 'data4'])
        }
    }
    else
    {
        return {
            data4: state.getIn(['global', 'data4'])
        }
    }
};

const mapDispatchToProps = (dispatch, props) => {
    if(props.mode && props.mode === "reverse")
    {
        return {
            handleSetDataSource(dataSource){
                const action = actionCreatorsGlobalReverse.setDataSource(dataSource);
                dispatch(action);
            }
        }
    }
    else
    {
        return {
            handleSetDataSource(dataSource){
                const action = actionCreatorsGlobal.setDataSource(dataSource);
                dispatch(action);
            }
        }
    }
};

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
export default class GlobalForm extends Component {
    constructor(props) {
        super(props);
        this.handleNameBlur = this.handleNameBlur.bind(this);
        this.handleDescriptionBlur = this.handleDescriptionBlur.bind(this);
        this.handleProcessBeanBlur = this.handleProcessBeanBlur.bind(this);
        this.saveDataSource = this.saveDataSource.bind(this);
    }

    /**
     * 抽离保存全局Redux data4 bpmnAttr字段方法
     */
    saveDataSource(e, bpmnAttrName) {
        const { data4, handleSetDataSource } = this.props;
        let dataToJs = data4.toJS();
        dataToJs.bpmnAttr[bpmnAttrName] = e.target.value;
        handleSetDataSource(fromJS(dataToJs));
    }
    /**
     * 工作流表单名称input 输入回调
     */
    handleNameBlur(event) {
        this.saveDataSource(event, "bpmnName");
    }
    /**
     * 工作流表单描述信息input 输入回调
     */
    handleDescriptionBlur() {
        this.saveDataSource(event, "bpmnDescription");
    }
    /**
     * 工作流表单class类名input 输入回调
     */
    handleProcessBeanBlur() {
        this.saveDataSource(event, "processBean");
    }
    render() {
        const { form: { getFieldDecorator }, data4 } = this.props;
        let dataToJs = data4.toJS();
        return (
            <div className="global-property-form">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('bpmnName', {
                            rules: [{ required: true, message: '请输入工作流程表单名称' }],
                            initialValue: dataToJs.bpmnAttr.bpmnName
                        })(
                            <Input
                                prefix={<Icon type="fund" style={{ fontSize: 13 }} />}
                                placeholder="工作流程表单名称"
                                onBlur={ this.handleNameBlur }
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('bpmnDescription', {
                            initialValue: dataToJs.bpmnAttr.bpmnDescription
                        })(
                            <Input
                                prefix={<Icon type="highlight" style={{ fontSize: 13 }} />}
                                placeholder="工作流程表单描述信息"
                                onBlur={ this.handleDescriptionBlur }
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('processBean', {
                            initialValue: dataToJs.bpmnAttr.processBean
                        })(
                            <Input
                                prefix={<Icon type="highlight" style={{ fontSize: 13 }} />}
                                placeholder="工作流程表单Bean类名"
                                onBlur={ this.handleProcessBeanBlur }
                            />
                        )}
                    </FormItem>
                </Form>
            </div>
        )
    }
}