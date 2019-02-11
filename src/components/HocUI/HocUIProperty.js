import React, { Component } from "react";
import { Tabs } from 'antd';
import "../../static/css/HocUIProperty.css";
import GlobalForm from "@/components/property/GlobalForm";
const TabPane = Tabs.TabPane;
function callback(key) {
    console.log(key);
}

/**
 * 用于包装右侧属性编辑栏
 * @param WrappedComponent
 * @returns {{new(): {render(): *}}}
 * @constructor
 */
function HocUIProperty(title) {
    return function (WrappedComponent) {
        return class HocUIProperty extends Component {
            constructor(props){
                super(props);
                console.log("高阶组件-属性编辑栏", this.props)
            }
            render(){
                return (
                    <div className="right-property-container">
                        <Tabs
                            defaultActiveKey="1"
                            onChange={callback}>
                            <TabPane
                                tab="字段属性"
                                key="1"
                            >
                                <WrappedComponent {...this.props} />
                            </TabPane>
                            <TabPane
                                tab="流程图属性"
                                key="2"
                            >
                                <GlobalForm {...this.props} />
                            </TabPane>
                        </Tabs>
                    </div>
                )
            }
        }
    }
}
export default HocUIProperty;