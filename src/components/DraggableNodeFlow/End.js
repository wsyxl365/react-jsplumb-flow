import React, { Component } from "react";
import HocNodeFlowMenu from "../HocUI/HocNodeFlowMenu";

/**
 * 拖拽画布节点：结束
 * 对应css类名: viso-end-drop
 */
@HocNodeFlowMenu("viso-end-drop")
export default class End extends Component {
    render() {
        const { info } = this.props;
        return (
            <div>
                <div style={{height: `${(info.height - 5)}px`}}>
                    <span className="viso-name align-item-name" key={info.name}>
                        {info.name}
                    </span>
                    <span className="align-item" key={info.name + info.name}/>
                </div>
            </div>
        )
    }
}