import React, {Component} from "react";
import { DropTarget } from 'react-dnd';
import { connect } from "react-redux";
import Util from "@/common/Util";
import { actionCreators } from "../../../storeGlobal";
import { actionCreators as actionCreatorsGlobalReverse } from "../../../storeGlobalReverse";
import {fromJS} from "immutable";
export const ItemTypes = {
    KNIGHT: 'knight'
};
const dropSpec = {
    canDrop(props) {
        //return canMoveKnight(props.x, props.y);
        return true;
    },
    drop(props, monitor, component) {
        console.log("*****monitor*****", monitor)
        // const { id } = monitor.getItem();
        // moveKnight(id, props.x, props.y);
        /**
         * 获取index页面传递过来的回调方法
         */
        const { props: { dropDownCB } } = component
        /**
         * getClientOffset获得拖拽体放下的坐标
         */
        let dropInfo = {};
        dropInfo.coordinate = monitor.getClientOffset();
        //dropInfo.coordinate = monitor.getSourceClientOffset();
        dropInfo.createInfo = monitor.getItem();
        console.log("放下了", dropInfo);
        dropDownCB(dropInfo);
        //console.log("monitor.getClientOffset()", monitor.getClientOffset());
        //console.log("monitor.getSourceClientOffset()", monitor.getSourceClientOffset());
    }
};

function collect(connector, monitor) {
    return {
        connectDropTarget: connector.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

const mapStateToProps = (state, props) => {
    if(props.mode && props.mode === "reverse")
    {
        return {
            nodeList: state.getIn(['globalReverse', 'nodeList']).toJS()
        }
    }
    else
    {
        return {
            nodeList: state.getIn(['global', 'nodeList']).toJS()
        }
    }
}
const mapDispatchToProps = (dispatch, props) => {
    if(props.mode && props.mode === "reverse")
    {
        return {
            setMainContainerPos(pos){
                const action = actionCreatorsGlobalReverse.setMainContainerPos(pos);
                dispatch(action);
            }
        }
    }
    else
    {
        return {
            setMainContainerPos(pos){
                const action = actionCreators.setMainContainerPos(pos);
                dispatch(action);
            }
        }
    }
}

@connect(mapStateToProps, mapDispatchToProps)
class MainContainer extends Component{
    componentDidMount() {
        //console.log("容器信息", Util.getDomPosition(this.refs));
        /**
         * 挂载完毕后获得主绘图容器的x,y坐标值
         */
        const { setMainContainerPos } = this.props;
        setMainContainerPos(fromJS(Util.getDomPosition(this.refs)));
    }
    renderRootContainer() {
        if(this.props.mode && this.props.mode === "reverse")
        {
            return (<div id="diagramContainerReverse" ref={ref => this.refs = ref}>
                {this.props.nodeList}
            </div>)
        }
        else
        {
            return (<div id="diagramContainer" ref={ref => this.refs = ref}>
                {this.props.nodeList}
            </div>)
        }
    }
    render() {
        const { connectDropTarget, isOver, canDrop } = this.props;
        return connectDropTarget(this.renderRootContainer())
    }
}

export default DropTarget(ItemTypes.KNIGHT, dropSpec, collect)(MainContainer);