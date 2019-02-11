import React, {Component, Fragment} from "react";
import HocUIHeader from "./../HocUI/HocUIHeader";
// 横向泳池
import PoolsOrientation from "./component/PoolsOrientation";
// 纵向泳池
import PoolsDirection from "./component/PoolsDirection";

/**
 * 左侧节点模块区域
 */
@HocUIHeader("Swimlanes")
export default class Swimlanes extends Component {
    render() {
        return (
            <Fragment>
                <PoolsOrientation />
                <PoolsDirection />
            </Fragment>
        );
    }
}