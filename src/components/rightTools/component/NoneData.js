import React, { Component } from "react";
// 引入高阶组件函数
import HocUIProperty from "../../HocUI/HocUIProperty";

@HocUIProperty("属性编辑")
class NoneData extends Component {
    render() {
        return (<div style={{ paddingBottom: "5px", textAlign: "center" }}>
            暂无数据
        </div>)
    }
}

export default NoneData;