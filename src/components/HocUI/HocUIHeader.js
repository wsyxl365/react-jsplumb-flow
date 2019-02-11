import React, { Component } from "react";
import { Card } from 'antd';
import "../../static/css/HocUIHeader.css"

/**
 * 用于包装左侧整体块状组件的UI高阶组件，主要负责渲染Tab的header内容
 * @param WrappedComponent
 * @returns {{new(): {render(): *}}}
 * @constructor
 */
function HocUIHeader (headerTitle) {
    return function (WrappedComponent) {
        return class HocUIHeader extends Component {
            constructor(props){
                super(props);
                console.log("高阶组件UI-TabHeader", this.props)
            }
            render(){
                return (<div>
                    <Card title={headerTitle} style={{border: "none"}}>
                        <WrappedComponent {...this.props} />
                    </Card>
                </div>)
            }
        }
    }
}
export default HocUIHeader;