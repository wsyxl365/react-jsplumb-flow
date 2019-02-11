import React from "react";
import { proConfig } from "@/common/config.js";
import Start from "@/components/DraggableNodeFlow/Start"; //开始节点
import End from "@/components/DraggableNodeFlow/End"; //结束节点
import ExclusiveGateWay from "@/components/DraggableNodeFlow/ExclusiveGateWay"; // 排他路由节点
import ParallelGateWay from "@/components/DraggableNodeFlow/ParallelGateWay"; // 并行路由节点
import InclusiveGateWay from "@/components/DraggableNodeFlow/InclusiveGateWay"; // 包容路由节点
import UserTask from "@/components/DraggableNodeFlow/UserTask"; // 用户任务节点
import ServiceTask from "@/components/DraggableNodeFlow/ServiceTask";// 服务任务节点
import PoolsOrientation from "../components/PoolsOrientation"; // 横向泳池 横向泳池在纯展示组件中不需要有拖拽大小的功能，所以新建一个组件，仅供渲染展示使用
import PoolsDirection from "../components/PoolsDirection"; // 纵向泳池
import PoolLaneOrientation from "../components/PoolLaneOrientation"; // 横向泳道
import PoolLaneDirection from "../components/PoolLaneDirection"; // 纵向泳道

/**
 * 其实整个页面只有连线部分不是虚拟dom，是用jquery + canvas去操作生成的，所以页面如果频繁的重新生成会
 * 带来很多bug和问题，现在我们可以只针对虚拟dom去对比更新页面，这样兼容性和性能最优
 *
 * 这里定义一个处理虚拟dom的工厂类，用于执行当需要整体改变虚拟dom的样式或者是
 * 整体改变虚拟dom的功能属性等
 */
const mode = "exhibition";
//const mode = "reverse";

export default class VirtualDOMHandleExhibition {
    /**
     * @param dataSource 需要更新的虚拟dom数据源
     * @param handleEvent 给每个节点绑定的事件
     */
    constructor(dataSource, eventObj) {
        /**
         * dataSource 传递进来的数据源
         * nodeList 结合dataSource处理后的虚拟dom集合
         * eventObj 事件绑定对象合集
         * extraDomObj 额外需要添加的虚拟dom对象
         * mark forward代表正向渲染 reverse代表反向渲染
         * reduxProps 全局Redux引用
         * currentElementId 当前的审批节点
         * goingToElementId 将要走向的审批节点
         */
        this.currentElementId = dataSource.currentElementId;
        this.goingToElementId = dataSource.goingToElementId;
        this.bpmnInfo = dataSource.bpmnInfo;
        this.elementInfos = dataSource.elementInfos;
        this.eventObj = eventObj || {};
        this.nodeData = JSON.parse(this.bpmnInfo.designJson).nodeData;
        this.connectionData = JSON.parse(this.bpmnInfo.designJson).connectionData;
    }

    /**
     * 用于判断返回到底是哪种类型的节点或者流程(或者后期扩展的其他类型)
     * info 节点信息对象
     * styleObj 节点css样式对象
     */
    getRenderSortFlow(info, styleObj, extraInfo){
        switch (info.type) {
            case proConfig.nodeFlowType.start : //开始节点
                return (
                    <Start
                        info={ info }
                        extraInfo= { extraInfo }
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.start }
                        mode= { mode }
                    />
                );
            case proConfig.nodeFlowType.end : //结束节点
                return (
                    <End
                        info={ info }
                        extraInfo= { extraInfo }
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.end }
                        mode= { mode }
                    />
                );
            case proConfig.nodeFlowType.exclusiveGateway : //路由排他网关节点
                return (
                    <ExclusiveGateWay
                        info={ info }
                        extraInfo= { extraInfo }
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.exclusiveGateway }
                        mode= { mode }
                    />
                );
            case proConfig.nodeFlowType.parallelGateway : //路由并行网关节点
                return (
                    <ParallelGateWay
                        info={ info }
                        extraInfo= { extraInfo }
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.parallelGateway }
                        mode= { mode }
                    />
                );
            case proConfig.nodeFlowType.inclusiveGateway : //路由包容网关节点
                return (
                    <InclusiveGateWay
                        info={ info }
                        extraInfo= { extraInfo }
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.inclusiveGateway }
                        mode= { mode }
                    />
                );
            case proConfig.nodeFlowType.serviceTask : //服务任务节点
                return (
                    <ServiceTask
                        info={ info }
                        extraInfo= { extraInfo }
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.serviceTask }
                        mode= { mode }
                    />
                );
            case proConfig.nodeFlowType.userTask : //用户任务
                return (
                    <UserTask
                        info={ info }
                        extraInfo= { extraInfo }
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.userTask }
                        mode= { mode }
                    />
                );
            case proConfig.nodeFlowType.poolsOrientation : //横向泳池
                return (
                    <PoolsOrientation
                        info={ info }
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.poolsOrientation }
                        mode= { mode }
                    />
                );
            case proConfig.nodeFlowType.poolsDirection : //纵向泳池
                return (
                    <PoolsDirection
                        info={ info }
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.poolsOrientation }
                        mode= { mode }
                    />
                );
            case proConfig.nodeFlowType.poolLaneOrientation : //横向泳道
                return (
                    <PoolLaneOrientation
                        info={ info }
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.poolLaneOrientation }
                        mode= { mode }
                    />
                );
            case proConfig.nodeFlowType.poolLaneDirection : //纵向泳道
                return (
                    <PoolLaneDirection
                        info={ info }
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.poolLaneOrientation }
                        mode= { mode }
                    />
                );
            default:
                return (
                    <div
                        key={info.id}
                        id={info.id}
                        style={styleObj}
                    >
                        <span className="viso-name"  key={info.name}>{info.name}</span>
                    </div>
                );
        }
    }

    /**
     * 初始化调用，包括:
     * 1.获取style样式并进行传递styleNewObj的合并
     * 2.getRenderSortFlow调用渲染虚拟dom
     * 3.给对象赋值nodeList，更新虚拟dom
     * @param styleNewObj
     */
    init(styleNewObj){
        let extraInfo = Object.assign({}, {currentElementId : this.currentElementId, goingToElementId: this.goingToElementId}, {elementInfos:this.elementInfos});
        console.log("extraInfo", extraInfo);
        const allNodeList = this.nodeData.map((info) => {
            let styleObj = {
                position: 'absolute',
                left: `${info.x}px`,
                top: `${ info.y + 100 }px`,
                cursor: "pointer"
            };
            if (info.width) {
                styleObj.width = `${info.width}px`
                styleObj.height = `${info.height}px`
            }
            let newStyleObj = Object.assign({}, styleObj, styleNewObj);
            return this.getRenderSortFlow(info, newStyleObj, extraInfo);
        });
        return allNodeList;
    }

    /**
     * 设置实例的数据源
     */
    clearData(){
        this.dataSource = {};
    }
}