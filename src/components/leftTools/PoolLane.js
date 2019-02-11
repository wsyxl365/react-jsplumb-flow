import React, {Component, Fragment} from "react";
import HocUIHeader from "./../HocUI/HocUIHeader";

// 横向泳道
import PoolLaneOrientation from "./component/PoolLaneOrientation";
// 纵向泳道
import PoolLaneDirection from "./component/PoolLaneDirection";

/**
 * 左侧节点模块区域-泳道
 */
@HocUIHeader("PoolLane")
export default class PoolLane extends Component {
    render() {
        return (
            <Fragment>
                <PoolLaneOrientation />
                <PoolLaneDirection />
            </Fragment>
        );
    }
}