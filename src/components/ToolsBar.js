import React, {Component} from "react";
import { Row, Col } from 'antd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import MainContainer from "./leftTools/component/MainContainer";
import Util from "../common/Util";
// 左侧工具栏模块
import ToolsLeft from "./leftTools/ToolsLeft";
// 左侧Start Events模块
import StartEvents from "./leftTools/StartEvents";
// 左侧Activities模块
import Activities from "./leftTools/Activities";
// 左侧ExclusiveGateWay模块
import GateWays from "./leftTools/GateWays";
// 左侧End Events模块
import EndEvents from "./leftTools/EndEvents";
// 左侧泳池Swimlanes模块
import Swimlanes from "./leftTools/Swimlanes";
// 左侧泳道PoolLane模块
import PoolLane from "./leftTools/PoolLane";


// 右侧连线属性编辑空白组件
import NoneData from "./rightTools/component/NoneData";
// 右侧节点属性编辑组件
import NodeFlow from "./rightTools/component/NodeFlow";
// 右侧连线属性编辑组件
import ConnectLine from "./rightTools/component/ConnectLine";

import "../static/css/toolsBar.css";

import { connect } from "react-redux"
import { actionCreators } from "../storeProperty";
import { actionCreators as actionCreatorsPropertyReverse } from "../storePropertyReverse";


const mapStateToProps = (state, props) => {
    if(props.mode && props.mode === "reverse")
    {
        return {
            mainContainerHeight: state.getIn(['globalReverse', 'mainContainerHeight']),
            propertyData: state.getIn(['propertyReverse', 'propertyData'])
        }
    }
    else
    {
        return {
            mainContainerHeight: state.getIn(['global', 'mainContainerHeight']),
            propertyData: state.getIn(['property', 'propertyData'])
        }
    }

}

const mapDispatchToProps = (dispatch, props) => {
    if(props.mode && props.mode === "reverse")
    {
        return {
            handleSetProperty(propertyData){
                const action = actionCreatorsPropertyReverse.setProperty(propertyData);
                dispatch(action);
            },
        }
    }
    else
    {
        return {
            handleSetProperty(propertyData){
                const action = actionCreators.setProperty(propertyData);
                dispatch(action);
            },
        }
    }
}

@DragDropContext(HTML5Backend)
@connect(mapStateToProps, mapDispatchToProps)
export default class ToolsBar extends Component {
    /**
     * 用于判断渲染的是节点还是连线
     */
    renderSortPropertyItem(info){
        if(Util.isEmptyObj(info)) {
            return (<NoneData { ...this.props }/>)
        } else {
            if(info.id && info.id.indexOf("con_") > -1) {
                return (<ConnectLine { ...this.props } />)
            } else {
                return (<NodeFlow { ...this.props } />)
            }
        }
    }
    render() {
        const { propertyData } = this.props;
        let propertyDataToJs = propertyData.toJS();
        //console.log("`````----- propertyData -----", this.props)
        return (<div className="container-all">
            <Row>
                <Col span={3}>
                    <div className="tools-bar-left" id="left" style={{height: `${this.props.mainContainerHeight}px`, overflow: "scroll"}}>
                        <ToolsLeft {...this.props } />
                        <StartEvents />
                        <Activities />
                        <GateWays />
                        <EndEvents />
                        <Swimlanes />
                        <PoolLane />
                    </div>
                </Col>
                <Col span={17}>
                    <div className="tools-bar-right" style={{height: `${this.props.mainContainerHeight}px`}}>
                        <MainContainer { ...this.props } />
                    </div>
                </Col>
                <Col span={4}>
                    <div className="right-attr" >
                        {
                            this.renderSortPropertyItem(propertyDataToJs)
                        }
                    </div>
                </Col>
            </Row>
        </div>)
    }
}