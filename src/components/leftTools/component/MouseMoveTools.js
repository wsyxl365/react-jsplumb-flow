import React, { Component } from "react";
import ToolBar from "../../HocUI/ToolBar";
import { Button } from 'antd';
import { connect } from 'react-redux';

import { actionCreators } from '../../../storeTool'
import { actionCreators as actionCreatorsGlobal } from '../../../storeGlobal'

import { actionCreators as actionCreatorsReverse } from "../../../storeToolReverse";
import { actionCreators as actionCreatorsGlobalReverse } from '../../../storeGlobalReverse'


import Util from "../../../common/Util"
import "../../../static/css/ToolBtn.css";

const mapStateToProps = (state, props) => {
    if(props.mode && props.mode === "reverse")
    {
        return {
            focused: state.getIn(['toolReverse', 'focused']),
            nodeList: state.getIn(['globalReverse', 'nodeList']),
        }
    }
    else
    {
        return {
            focused: state.getIn(['tool', 'focused']),
            nodeList: state.getIn(['global', 'nodeList']),
        }
    }
}

const mapDispatchToProps = (dispatch, props) => {
    if(props.mode && props.mode === "reverse")
    {
        return {
            handleButtonFocus(markName){
                const action = actionCreatorsReverse.buttonFocus(markName);
                dispatch(action);
            },
            handleSetReRender(reRender) {
                const action = actionCreatorsGlobalReverse.setReRender(reRender);
                dispatch(action);
            }
        }
    }
    else
    {
        return {
            handleButtonFocus(markName){
                const action = actionCreators.buttonFocus(markName);
                dispatch(action);
            },
            handleSetReRender(reRender) {
                const action = actionCreatorsGlobal.setReRender(reRender);
                dispatch(action);
            }
        }
    }
}

@connect(mapStateToProps, mapDispatchToProps)
@ToolBar()
class MouseMoveTools extends Component {
    constructor(props){
        super(props);
        this.clickHandle = this.clickHandle.bind(this);
    }
    clickHandle(){
        /**
         * 点击button时，需要改变页面元素鼠标的样式(后期可以扩展增加其他需要定制的样式)
         * 随机生成15为hash值去触发index页面的componentWillReceiveProps方法,从而重新
         * 渲染页面元素
         */
        this.props.handleSetReRender({
            event: "MouseEvent",
            hash: Util.randHash(),
            style: {
                mouse: "move"
            }
        });
        /**
         * 改变工具按钮的focus状态
         */
        this.props.handleButtonFocus(this.props.markName);
    }
    renderButton(){
        const { nodeList, focused, markName } = this.props;
        if(nodeList.size === 0) {
            return (<Button
                className="tool-btn"
                type="primary"
                icon="swap"
                size="large"
                disabled
            >
                鼠标工具
            </Button>)
        } else {
            if(focused === markName) {
                return (
                    <Button
                        className="tool-btn"
                        type="danger"
                        icon="swap"
                        size="large"
                    >
                        鼠标工具
                    </Button>
                )
            } else {
                return (
                    <Button
                        className="tool-btn"
                        type="primary"
                        icon="swap"
                        size="large"
                        onClick={this.clickHandle}
                    >
                        鼠标工具
                    </Button>
                )
            }
        }
    }
    render(){
        return (<div>
            {
              this.renderButton()
            }
        </div>)
    }
}
export default MouseMoveTools;