import React, { Component } from "react";
import { Resizable, ResizableBox } from "react-resizable";
import '../../../node_modules/react-resizable/css/styles.css';
import {connect} from "react-redux";
import {fromJS} from "immutable";
import { mapStateToProps, mapDispatchToProps } from "@/common/stateAndDispatch";
/**
 * 拖拽画布节点：横向泳道
 * 对应css类名: viso-pool-lane-ori-drop
 */
@connect(mapStateToProps, mapDispatchToProps)
export default class PoolLaneOrientation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 1000,
            height: 200
        }
        this.onResize = this.onResize. bind(this);
        this.onResizeStart = this.onResizeStart. bind(this);
        this.onResizeStop = this.onResizeStop.bind(this);
        this.handleMouseEnter = this.handleMouseEnter. bind(this);
        this.handleMouseLeave = this.handleMouseLeave. bind(this);
    }
    componentDidMount() {
        const { info, data4 } = this.props;
        let dataItem = data4.nodeData.find( (item) => {
            return item.id === info.id;
        });
        this.setState(()=>({
            width: dataItem.width,
            height: dataItem.height
        }));
    }
    onResize(event, { element, size }){
        this.setState({ width: size.width, height: size.height });
    }
    onResizeStart() {
        console.log("我拖拽开始了！！！");
    }

    /**
     * 针对画布生成的元素右下角箭头的鼠标移入事件，当鼠标移入的时候需要
     * 将该元素jsplumb的可拖拽设置成不能拖拽，然后进行元素的放大、缩小
     */
    handleMouseEnter() {
         const { info, extraEventObj } = this.props;
         extraEventObj.startPoolsDraggable(info);
    }
    /**
     * 针对画布生成的元素右下角箭头的鼠标移出事件，当鼠标移出的时候需要
     * 将该元素jsplumb的可拖拽设置成可以拖拽，然后进行元素的坐标拖拽
     */
    handleMouseLeave() {
        const { info, extraEventObj } = this.props;
        extraEventObj.endPoolsDraggable(info);
    }

    /**
     * 拖拽宽度停止后，把该元素的宽高保存至redux
     */
    onResizeStop(e, stopCallbackInfo) {
        console.log("我停止了！！", stopCallbackInfo);
        const { info, data4, setDataSource } = this.props;
        data4.nodeData.forEach( (item) => {
            if(item.id === info.id) {
                item.width = stopCallbackInfo.size.width;
                item.height = stopCallbackInfo.size.height;
            };
        });
        console.log('data4', data4);
        setDataSource(fromJS(data4));
        //console.log('dataitem', dataItem);
    }
    render() {
        const { info, styleObj, eventObj, data4 } = this.props;
        const textContainer = {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            width: 35,
            height: "100%",
            border:  "2px solid black",
            backgroundColor: "rgb(252, 235, 0)",
            background: "linear-gradient(to right, rgb(252, 235, 0, 0.9), rgb(252, 235, 0, 0.8), rgb(252, 235, 0, 0.9))"
        }
        const textStyle = {
            textAlign: "center",
            fontSize: "16px",
            color: "#000"
        }
        return (
            <Resizable
                key={ info.id }
                id={ info.id }
                className={'viso-pool-lane-ori-drop node-flow-item'}
                style={{ position: styleObj.position, left:styleObj.left, top: styleObj.top, zIndex:1}}
                minConstraints={[200, 200]}
                height={ this.state.height }
                width={ this.state.width }
                onResize={this.onResize}
                onResizeStart={this.onResizeStart}
                onResizeStop={this.onResizeStop}
                onResizeArrowEnter={ this.handleMouseEnter }
                onResizeArrowLeave={ this.handleMouseLeave }
                //style={{background: "red"}}
            >
                <div
                    onClick={() => {
                        eventObj.onClick(info)
                    }}
                    onMouseUp={(e) => {
                        eventObj.onMouseUp(e, info)
                    }}
                    onContextMenu={(e) => {
                        eventObj.onContextmenu(e)
                    }}
                    style={{width: this.state.width + 'px', height: this.state.height + 'px'}}
                >
                    <div style={ textContainer } className={"viso-name"} >
                        <span className="text" style={textStyle}>
                            { info.name }
                        </span>
                    </div>
                </div>
            </Resizable>
        )
    }
}