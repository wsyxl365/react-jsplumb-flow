import React, {Component, Fragment} from "react";
import HocUIHeader from "./../HocUI/HocUIHeader";
//左侧节点->开始
import Start from "./component/Start";

/**
 * 左侧节点模块区域->左侧Start Events模块
 */
@HocUIHeader("Start Events")
export default class NodeLeft extends Component {
    render() {
        return (
            <Fragment>
                {/**
                 ** ------开始-----
                 **/}
                <Start />
            </Fragment>
        );
    }
}