import React, { Component } from "react";
import HocNodeFlowMenu from "../HocUI/HocNodeFlowMenu";

/**
 * 拖拽画布节点：开始
 * 对应css类名: viso-start-drop
 */
@HocNodeFlowMenu("viso-start-drop")
export default class Start extends Component {
    render() {
        const { info } = this.props;
        return (
            <div style={{height: `${(info.height - 5)}px`}}>
                <span className="viso-name align-item-name" key={info.name}>
                    {info.name}
                </span>
                <span className="align-item" key={info.name + info.name}/>
            </div>
        )
    }
}