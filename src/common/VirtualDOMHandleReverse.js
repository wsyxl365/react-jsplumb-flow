import React from "react";
import { proConfig } from "@/common/config.js";
import Start from "@/components/DraggableNodeFlow/Start"; //开始节点
import End from "@/components/DraggableNodeFlow/End"; //结束节点
import ExclusiveGateWay from "@/components/DraggableNodeFlow/ExclusiveGateWay"; //排他路由节点
import ParallelGateWay from "@/components/DraggableNodeFlow/ParallelGateWay"; //并行路由节点
import InclusiveGateWay from "@/components/DraggableNodeFlow/InclusiveGateWay"; //包容路由节点
import UserTask from "@/components/DraggableNodeFlow/UserTask"; //用户任务节点
import ServiceTask from "@/components/DraggableNodeFlow/ServiceTask"; //服务任务节点
import PoolsOrientation from "@/components/DraggableNodeFlow/PoolsOrientation"; // 横向泳池
import PoolsDirection from "@/components/DraggableNodeFlow/PoolsDirection"; //纵向泳池
import PoolLaneOrientation from "@/components/DraggableNodeFlow/PoolLaneOrientation"; //横向泳道
import PoolLaneDirection from "@/components/DraggableNodeFlow/PoolLaneDirection"; //纵向泳道
/**
 * 其实整个页面只有连线部分不是虚拟dom，是用jquery + canvas去操作生成的，所以页面如果频繁的重新生成会
 * 带来很多bug和问题，现在我们可以只针对虚拟dom去对比更新页面，这样兼容性和性能最优
 *
 * 这里定义一个处理虚拟dom的工厂类，用于执行当需要整体改变虚拟dom的样式或者是
 * 整体改变虚拟dom的功能属性等
 */
// 不同节点类型的class类名
const TypeClassName = {
    startEvent: 'viso-start',
    endEvent: 'viso-end',
    exclusiveGateway: 'viso-gateway-exclusive',
    parallelGateway: 'viso-gateway-parallel',
    userTask: 'viso-task',
};
const mode = "reverse";

export default class VirtualDOMHandle {
    /**
     * @param dataSource 需要更新的虚拟dom数据源
     * @param handleEvent 给每个节点绑定的事件
     */
    constructor(dataSource, eventObj, extraEventObj) {
        /**
         * dataSource 传递进来的数据源
         * nodeList 结合dataSource处理后的虚拟dom集合
         * eventObj 事件绑定对象合集
         * extraDomObj 额外需要添加的虚拟dom对象
         * mark forward代表正向渲染 reverse代表反向渲染
         * reduxProps 全局Redux引用
         */
        this.dataSource = dataSource;
        this.nodeList = {};
        this.eventObj = eventObj || {};
        this.extraEventObj = extraEventObj
    }

    /**
     * 用于判断返回到底是哪种类型的节点或者流程(或者后期扩展的其他类型)
     * info 节点信息对象
     * styleObj 节点css样式对象
     */
    getRenderSortFlow(info, styleObj){
        switch (info.type) {
            case proConfig.nodeFlowType.start : //开始节点
                return (
                    <Start
                        info={ info }
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
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.end }
                        mode= { mode }
                    />
                );
            case proConfig.nodeFlowType.exclusiveGateway : //路由网关节点
                return (
                    <ExclusiveGateWay
                        info={ info }
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.exclusiveGateway }
                        mode= { mode }
                    />
                );
            case proConfig.nodeFlowType.parallelGateway : //并行网关节点
                return (
                    <ParallelGateWay
                        info={ info }
                        styleObj={ styleObj }
                        eventObj={ this.eventObj }
                        key={ info.id }
                        workFlowName={ proConfig.nodeFlowType.parallelGateway }
                        mode= { mode }
                    />
                );
            case proConfig.nodeFlowType.inclusiveGateway : //包容网关节点
                return (
                    <InclusiveGateWay
                        info={ info }
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
                        extraEventObj = { this.extraEventObj }
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
                        extraEventObj = { this.extraEventObj }
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
                        extraEventObj = { this.extraEventObj }
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
                        extraEventObj = { this.extraEventObj }
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
                        data-type={info.type}
                        onClick={()=>{this.handleEvent(info)}}
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
        const allNodeList = this.dataSource.nodeData.map((info) => {
            let styleObj = {
                position: 'absolute',
                left: `${info.x}px`,
                top: `${info.y}px`,
                cursor: "move"
            };
            if (info.width) {
                styleObj.width = `${info.width}px`
                styleObj.height = `${info.height}px`
            }
            let newStyleObj = Object.assign({}, styleObj, styleNewObj);
            return this.getRenderSortFlow(info, newStyleObj);
        });
        this.nodeList = allNodeList;
    }

    /**
     * 新增拖拽节点
     * newNodeData 最新数据源
     * dropInfo 当前节点信息
     * eventObj 当前节点需要绑定的事件
     * styleNewObj 当前节点需要新增或者更新的样式，默认为空对象
     * @param newNodeData
     * @param eventObj
     */
    addNodeFlow( newNodeData, dropInfo, eventObj, styleNewObj ={}){
        /**
         * 首先更改下dataSource的值，新传递进来的newNodeData就是当前最新的数据源
         * 再更新一下需要绑定的事件
         */
        /**
         * 新增节点到画布有2中情况：
         * ------第一种情况是没有清除内容，也就是用户没有点击清除画布的按钮，那么默认在请求反渲染数据后，实例属性dataSource中是有值的。
         * 第二种情况是用户点击了清除内容，那么也就代表所有的实例属性数据被清空了，这里需要做下判断，要不下面的赋值会报错。
         * -------但是由于调用addNodeFlow方法前，redux store里面的nodeData的数据已经做过处理，所以这里的newNodeFlowItem永远都不会是undefined,
         * 所以就不用判断了
         */
        this.dataSource = newNodeData;
        this.eventObj = eventObj;
        let newNodeFlowItem = this.dataSource.nodeData.find((item) => {
            return item.id === dropInfo.createInfo.id;
        });
        let styleObj = {
            position: 'absolute',
            left: `${ newNodeFlowItem.x }px`,
            top: `${ newNodeFlowItem.y }px`,
            cursor: "move"
        };
        if (newNodeFlowItem.width) {
            styleObj.width = `${ newNodeFlowItem.width }px`
            styleObj.height = `${ newNodeFlowItem.height }px`
        }
        let newStyleObj = Object.assign({}, styleObj, styleNewObj);
        let newNodeList = this.getRenderSortFlow( newNodeFlowItem , newStyleObj);
        this.nodeList.push(newNodeList);
        this.updateNodeFlowCssStyle();
    }

    /**
     * 这里是循环所有的节点数据去更新相应的css样式，虽然现在和updateNodeFlow方法有些重复，
     * 但是在以后方便扩展，分别管理逻辑和样式。
     * @param styleNewObj
     */
    updateNodeFlowCssStyle( styleNewObj ={} ) {
        const allNodeList = this.dataSource.nodeData.map((item, index)=>{
            let styleObj = {
                position: 'absolute',
                left: `${ item.x }px`,
                top: `${ item.y }px`,
                cursor: "move"
            };
            if (item.width) {
                styleObj.width = `${item.width}px`
                styleObj.height = `${item.height}px`
            }
            let newStyleObj = Object.assign({}, styleObj, styleNewObj );
            return this.getRenderSortFlow(item, newStyleObj);
        });
        this.nodeList = allNodeList;
    }

    /**
     * 更新节点，可以是样式、绑定方法等等
     * @param info
     */
    updateNodeFlow(nodeData, eventObj, styleNewObj={}){
        /**
         * 首先更改下dataSource的值，新传递进来的newNodeData就是当前最新的数据源
         *
         * ******eventObj暂时没有做处理，如果后期在更新节点的时候需要改变虚拟dom绑定的事件，
         * 那么这里可以对this.eventObj做处理，最终由getRenderSortFlow循环绑定******
         */
        this.dataSource.nodeData = nodeData;
        const allNodeList = nodeData.map((item, index)=>{
            let styleObj = {
                position: 'absolute',
                left: `${ item.x }px`,
                top: `${ item.y }px`,
                cursor: "move"
            };
            if (item.width) {
                styleObj.width = `${item.width}px`
                styleObj.height = `${item.height}px`
            }
            let newStyleObj = Object.assign({}, styleObj, styleNewObj);
            return this.getRenderSortFlow(item, newStyleObj);
        });
       this.nodeList = allNodeList;
    }

    /**
     * 清空单例模式下实例所有的数据，用于销毁组件的时候调用
     */
    clearData( dataSource ) {
        this.dataSource = dataSource;
        this.nodeList = [];
    }
}