import React, {Component, Fragment} from "react";
import HocUIHeader from "./../HocUI/HocUIHeader";
//左侧工具栏：连线工具
import ConnectLineTools from "./component/ConnectLineTools";
//左侧工具栏：鼠标工具
import MouseMoveTools from "./component/MouseMoveTools";

/**
 * 左侧节点模块区域->左侧工具模块
 */
@HocUIHeader("工具")
export default class ToolsLeft extends Component {
    render(){
        return (
            <Fragment>
                {/**
                 ** ------鼠标工具-----
                 **/}
                <MouseMoveTools { ...this.props } markName="MouseMoveTools" />
                {/**
                 ** ------连线工具-----
                 **/}
                <ConnectLineTools { ...this.props } markName="ConnectLineTools" />
            </Fragment>
        );
    }
}