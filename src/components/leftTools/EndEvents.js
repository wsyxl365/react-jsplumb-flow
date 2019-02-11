import React, {Component, Fragment} from "react";
import HocUIHeader from "./../HocUI/HocUIHeader";
//左侧节点->开始
import End from "./component/End";

/**
 * 左侧节点模块区域->左侧End Events模块
 */
@HocUIHeader("End Events")
export default class NodeLeft extends Component {
    render() {
        return (
            <Fragment>
                {/**
                 ** ------结束-----
                 **/}
                <End />
            </Fragment>
        );
    }
}