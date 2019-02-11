import React, {Component, Fragment} from "react";
import HocUIHeader from "./../HocUI/HocUIHeader";
//左侧节点->排他网关
import ExclusiveGateWayCom from "./component/ExclusiveGateWay";
//左侧节点->并行网关
import ParallelGateWay from "./component/ParallelGateWay";
//左侧节点->包容网关
import InclusiveGateWay from "./component/InclusiveGateWay";


/**
 * 左侧网关节点模块区域
 */
@HocUIHeader("Gateways")
export default class GateWays extends Component {
    render() {
        return (
            <Fragment>
                <ExclusiveGateWayCom />
                <ParallelGateWay />
                <InclusiveGateWay />
            </Fragment>
        );
    }
}