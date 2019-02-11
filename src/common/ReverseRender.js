import React, { Component } from "react";

export default class ReverseRender extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tipsOffsetWidth: 0,
            tipsOffsetHeight: 0,
            currentFlow: null
        }
    }

    componentDidMount() {
        this.setState(() => ({
            tipsOffsetWidth: this.refs.offsetWidth,
            tipsOffsetHeight: this.refs.offsetHeight,
        }))
    }

    render() {
        const { info, extraInfo } = this.props;
        const { tipsOffsetWidth, tipsOffsetHeight } = this.state;
        let currentFlow = null;
        if( extraInfo ) {
            currentFlow = extraInfo.elementInfos.find((item) => {
                return info.id === item.elementId;
            });
        }
        return (
            <div
                ref={ ref => (this.refs = ref) }
                className="ant-tooltip  ant-tooltip-placement-top"
                style={{
                    position: "absolute",
                    left: info.x - ( tipsOffsetWidth / 2 ) + ( info.width / 2 ),
                    top: info.y - tipsOffsetHeight + 100
                }}
            >
                <div className="ant-tooltip-content">
                    <div className="ant-tooltip-arrow"></div>
                    <div className="ant-tooltip-inner">
                        <div>
                            {
                                extraInfo && info.id === extraInfo.currentElementId
                                    ?
                                    <div style={{textAlign: "left", color: "#FF615F"}}>
                                        <span>当前审批节点: {info.name}</span>
                                    </div>
                                    :
                                    <div style={{textAlign: "left"}}>
                                        <span>节点名称: {info.name}</span>
                                    </div>
                            }
                            <div style={{textAlign: "left"}}>
                                <div>
                                    {
                                        currentFlow && currentFlow.submitParams && currentFlow.submitParams.map((item) => {
                                            return (
                                                <div>
                                                    <span>{ item.title}:{item.value}</span>
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        currentFlow && currentFlow.executionTime
                                            ?
                                                (
                                                    <div>
                                                        <span>执行时间: { currentFlow.executionTime }</span>
                                                    </div>
                                                )
                                            :
                                                null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}