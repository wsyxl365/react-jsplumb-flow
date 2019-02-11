import React, { Component } from "react";
import HocNodeFlowMenu from "../HocUI/HocNodeFlowMenu";

/**
 * 拖拽画布节点：排他网关
 * 对应css类名: viso-gateway-drop
 */
@HocNodeFlowMenu("viso-gateway-drop")
export default class ExclusiveGateWay extends Component {
    render() {
        const { info } = this.props;
        return (
            <div
                style={{ transform: "rotate(45deg) translateZ(0)", width: info.width, height: info.height, paddingTop: 15 }}
            >
                <span
                    className="viso-name align-item-name"
                    key={info.name}
                >
                    {info.name}
                </span>
            </div>
        )
    }
}