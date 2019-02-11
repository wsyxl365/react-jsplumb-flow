import React, {Component} from "react";
import { DragSource } from 'react-dnd';
import "../../../static/css/LeftNode.css";
import {Col, Row} from "antd";
import { proConfig } from "@/common/config.js";
import Util from "@/common/Util";

export const ItemTypes = {
    KNIGHT: 'knight'
};

const knightSpec = {
    /**
     * 拖拽开始触发beginDrag
     * @param props
     * @param monitor
     * @param component
     * @returns {{id: string, type: string, width: number, height: number}}
     */
    beginDrag(props, monitor, component) {
        console.log("开始你的表演!", component);
        // 定义Item结构，通过monitor.getItem()读取
        /**
         * 这里在DragSource里面定义一些需要传递过去的属性，
         * 例如这个节点的width、height、id、type
         * 然后在DropTarget里面去接收这个定制好的属性，
         * 最后全部添加到dropInfo对象中去，回调给index页面
         * 传递过来的函数，然后在主面板中进行节点的添加操作
         */
        return {
            id: `start_${Util.randHash()}`,
            key: `key_start_${Util.randHash()}`,
            type: proConfig.nodeFlowType.start,
            width: 60,
            height: 60,
            name: "开始",
            documentation: "",
            formKey: ""
        };
    }
};
function collect(connector, monitor) {
    return {
        connectDragSource: connector.dragSource(),
        isDragging: monitor.isDragging()
    }
}

@DragSource(ItemTypes.KNIGHT, knightSpec, collect)
class Start extends Component{
    render() {
        const {  connectDragSource, isDragging } = this.props;
        return connectDragSource(
            <div
                className="left-tool-node"
                style={{
                    opacity: isDragging ? 0.5 : 1,
                    lineHeight: '35px',
                    cursor: 'move'
                 }}
            >
                <Row>
                    <Col span={6} offset={5}>
                        <div className="startNodeImg"></div>
                    </Col>
                    <Col span={13}>
                        <div className="contentTitle">开始</div>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Start;