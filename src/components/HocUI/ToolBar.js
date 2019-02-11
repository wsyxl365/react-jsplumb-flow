import React, { Component } from "react";
import "../../static/css/HocTool.css";
/**
 * 用于包装工具组件的高阶函数
 * 例如：鼠标工具、连线工具等，后期还可以扩展一些其他的工具
 * @param WrappedComponent
 * @returns {{new(): {render(): *}}}
 * @constructor
 */
function HocTool() {
    return function (WrappedComponent) {
        return class HocTool extends Component {
            constructor(props){
                super(props);
                console.log("高阶组件-工具", this.props)
            }
            render(){

                return (<div className="item">
                    <WrappedComponent {...this.props} />
                </div>)
            }
        }
    }
}
export default HocTool;