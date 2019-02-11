import React, { Component } from "react";
import Util from "@/common/Util";
import { Icon } from "antd";
import { connect } from "react-redux";
import { fromJS } from "immutable";
import "../../static/css/NodeFlowRightMenu.css";
import { actionCreators as actionCreatorsGlobal } from "../../storeGlobal";
import { actionCreators as actionCreatorsGlobalReverse } from "../../storeGlobalReverse";

const mapStateToProps = (state, props) => {
    if(props.mode && props.mode === "reverse")
    {
        return {
            nodeFlowMenu: state.getIn(["globalReverse", "nodeFlowMenu"]).toJS(),
            data4: state.getIn(['globalReverse', 'data4']).toJS(),
            reverseRender: state.getIn(['globalReverse', 'reverseRender']),
        }
    }
    else
    {
        return {
            nodeFlowMenu: state.getIn(["global", "nodeFlowMenu"]).toJS(),
            data4: state.getIn(['global', 'data4']).toJS(),
            reverseRender: state.getIn(['global', 'reverseRender']),
        }
    }

};
const mapDispatchToProps = (dispatch, props) =>{
    if(props.mode && props.mode === "reverse")
    {
        return {
            setNodeFlowMenu(dataItem){
                dispatch(actionCreatorsGlobalReverse.setNodeFlowMenu(dataItem));
            },
            setDataSource(dataSource){
                const action = actionCreatorsGlobalReverse.setDataSource(dataSource);
                dispatch(action);
            },
            handleSetReRender(reRender){
                const action = actionCreatorsGlobalReverse.setReRender(reRender);
                dispatch(action);
            },
            setMainContainerPos(pos){
                const action = actionCreatorsGlobalReverse.setMainContainerPos(pos);
                dispatch(action);
            }
        }
    }
    else
    {
        return {
            setNodeFlowMenu(dataItem){
                dispatch(actionCreatorsGlobal.setNodeFlowMenu(dataItem));
            },
            setDataSource(dataSource){
                const action = actionCreatorsGlobal.setDataSource(dataSource);
                dispatch(action);
            },
            handleSetReRender(reRender){
                const action = actionCreatorsGlobal.setReRender(reRender);
                dispatch(action);
            }
        }
    }
};

@connect(mapStateToProps, mapDispatchToProps)
export default class NodeFlowRightMenu extends Component{
    constructor(props) {
        super(props);
        this.handleDeleteNodeFlow = this.handleDeleteNodeFlow.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this);
    }

    /**
     * 删除节点
     */
    handleDeleteNodeFlow(){
        const { data4: { nodeData, connectionData, bpmnAttr } , nodeFlowMenu, setNodeFlowMenu ,setDataSource, handleSetReRender, reverseRender, mode, jsplumbGetAllConnections, jsplumbDeleteConnectionsForElement, jsplumbDeleteConnection } = this.props;
        /**
         * 先关闭菜单
         */
        setNodeFlowMenu(fromJS({isSet: false, info: {}}));
        //console.log("当前的数据", nodeData);
        /**
         * 这里要区分一下正、反渲染模式处理connectionData数据
         *
         * -----------*************************************-------
         * 反渲染模式下jsPlumb.getAllConnections()获取的连线信息id 和之前保存的连线id存在误差，
         * 只有通过获取endpoints数组-》anchor-》elementId 来对比是否和connectionData的source.elementId相同来判定是否是同一条连线
         * -----------*************************************-------
         */
        if(mode === "reverse")
        {
            /** 反渲染模式:
             * 连线删除逻辑不需要区分究竟是何种反渲染模式
             * 反渲染模式的节点是根据数据addEndPoint生成的，所以用deleteConnection方法去删除连线对象的话，端点还是存在，
             * 查看源码这部分也对锚点做了处理，但是确实没有删除，源码的bug，换了种思维去删除2端的锚点，中间的连线自然
             * 就删除了。
             * 所以在正渲染的逻辑下，连线是通过makeSource生成的，可以使用deleteConnection删除
             * 反渲染逻辑下，连线是通过addEndPoint生成的，可以使用deleteEndpoint删除
             */
            //console.log('当前获取连线的所有信息', newOriginalData);
            const newOriginalData = jsplumbGetAllConnections();
            connectionData.forEach((item, index, arr) => {
                if(item.source.elementId === nodeFlowMenu.info.id || item.target.elementId === nodeFlowMenu.info.id) {
                    /**
                     * 根据当前所有的连线的信息循环查找相对应的连线id，然后进行连线删除
                     */
                    newOriginalData.forEach((itemTwo) => {
                        if( itemTwo.endpoints[0].anchor.elementId === item.source.elementId || itemTwo.endpoints[1].anchor.elementId === item.target.elementId )
                        {
                            /**
                             * 根据id移除节点相关的Endpoint信息
                             */
                            itemTwo.endpoints.forEach((itemEndpoints) => {
                                jsplumbDeleteConnectionsForElement(itemEndpoints);
                            });
                        }
                        if(itemTwo.id === item.id) {
                            /**
                             * 根据id移除节点相关的连线信息
                             */
                            jsplumbDeleteConnection(itemTwo);
                        }
                    });
                }
            });
        } else {
            /**
             * 这里是正向渲染，删除有几种情况，正向渲染，初始化没有数据，也就代表着所有的节点以及连线并不是通过connect + addPoint去生成的，
             * 也就是说当正向渲染通过连线工具连接后才算的上是正真的添加jsplumb数据，所以这里需要判断，当全局的变量connectionData长度为0或者
             * 当前的nodeFlowMenu.info.id在connectionData里面没有相对应的信息，那就代表是单独的节点，删除只需要更新虚拟dom就可以删除，假如
             * 有相对应的id那么就使用jsplumb的删除方法删除
             */
            if( connectionData.length !== 0 ) {
                let currentItem = connectionData.find( (item) => {
                    return item.source.elementId === nodeFlowMenu.info.id || item.target.elementId === nodeFlowMenu.info.id;
                });
                if( currentItem ) {
                    jsplumbDeleteConnectionsForElement(nodeFlowMenu.info.id);
                }
            }
        }
        /** 正渲染模式:
         * 处理connectionData数据,这里暂时不能改变原数组长度，否则会影响连线删除的操作
         **/
        // connectionData.forEach((item, index, arr) => {
        //     if(item.source.elementId === nodeFlowMenu.info.id || item.target.elementId === nodeFlowMenu.info.id) {
        //         /**
        //          * 根据当前所有的连线的信息循环查找相对应的连线id，然后进行连线删除
        //          */
        //         newOriginalData.forEach((itemTwo) => {
        //             if(itemTwo.id === item.id) {
        //                 /**
        //                  * 根据id移除节点相关的连线信息，节点又虚拟dom控制删除
        //                  */
        //                 jsplumbDeleteConnection(itemTwo);
        //             }
        //         });
        //     }
        // });
        /**
         *  ----------去除reudx store中的节点和连线数据
         */
        /**
         * 根据id去对当前的nodeData、connectionData数据进行数组的删除操作
         */
        // 处理nodeData数据
        nodeData.forEach((item, index, arr) => {
            if(item.id === nodeFlowMenu.info.id) {
                arr.splice(index, 1);
            }
        });
        /**
         * 处理删除connectionData的数据信息，必须等连线删除完后再执行,使用倒叙循环删除
         * 倒序循环删除与正序循环删除最大区别是：在倒序循环删除中，它的删除操作不会影响还未循环遍历的元素；
         * 这就使得即使删除之后数组中元素会向前移动一位，也不会让未遍历的元素跳过遍历
         */
        for( let i=connectionData.length -1; i >= 0; i--) {
            if(connectionData[i].source.elementId === nodeFlowMenu.info.id || connectionData[i].target.elementId === nodeFlowMenu.info.id) {
                connectionData.splice(i, 1);
            }
        }
        /**
         * 删除完毕后，更新下数据源
         */
        setDataSource(fromJS({
            bpmnAttr,
            nodeData,
            connectionData
        }));
        handleSetReRender({
            hash: Util.randHash()
        });
    }

    /**
     * 点击空白区域关闭右键弹出菜单
     */
    handleCloseMenu(){
        const { setNodeFlowMenu } = this.props;
        /**
         * 关闭菜单
         */
        setNodeFlowMenu(fromJS({isSet: false, info: {}}));
    }
    render() {
        const { nodeFlowMenu } = this.props;
        return (<div onContextMenu={(e)=>{e.preventDefault()}} onClick={this.handleCloseMenu}>
            {
                nodeFlowMenu.isSet
                    ?
                        <div className="nodeflowmenu-container" ref={ ref => (this.nodeFlowMenuRefs = ref)} >
                            <div style={{
                                position: "absolute",
                                top: `${nodeFlowMenu.info.newY}px`,
                                left: `${nodeFlowMenu.info.newX}px`
                            }}>
                                <div className="menu-item-name-container">
                                    <div className="menu-item-name" onClick={this.handleDeleteNodeFlow}><Icon type="delete" className="Icon" />删除节点</div>
                                    <div className="menu-item-line"/>
                                    <div className="menu-item-name"><Icon type="credit-card" className="Icon" />测试</div>
                                    <div className="menu-item-line"/>
                                    <div className="menu-item-name"><Icon type="edit" className="Icon" />测试</div>
                                </div>
                            </div>
                        </div>
                    :
                        null
            }
        </div>)
    }
}