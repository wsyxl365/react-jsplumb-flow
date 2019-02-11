import React, { Component } from "react";
import {
    Card,
    Input,
    Select
} from 'antd';
import "@/static/css/HocFormComponent.css";

const { TextArea } = Input;
const { Option } = Select;
/**
 * 右侧节点的包装高阶组件，提供最基本的组件，例如id、name、Documentation等
 * @param WrappedComponent
 * @returns {{new(): {render(): *}}}
 * @constructor
 */
function HocFormComponent() {
    return function (WrappedComponent) {
        return class HocFormComponent extends Component {
            constructor(props){
                super(props);
                console.log("高阶组件-属性编辑form", this.props)
            }
            render(){
                return (
                    <div className="container-body">
                        <div className="item-container">
                            <div className="item-title">Id:</div>
                            <Input
                                placeholder="编辑Id"
                                {...this.props.idInputProps}
                            />
                        </div>
                        <div className="item-container">
                            <div className="item-title">名称:</div>
                            <Input
                                placeholder="编辑节点名称"
                                {...this.props.nameInputProps}
                            />
                        </div>
                        <div className="item-container">
                            <div className="item-title">描述:</div>
                            <TextArea
                                type="textarea"
                                placeholder="在这里输入节点的描述"
                                autosize={{ minRows: 2, maxRows: 6 }}
                                {...this.props.textAreaProps}
                            />
                        </div>
                        <WrappedComponent {...this.props} />
                    </div>
                )
            }
        }
    }
}
export default HocFormComponent;