import React, { Component } from "react";
/**
 * ------纵向泳池------
 */
export default class PoolsDirection extends Component {
    render() {
        const { info, styleObj } = this.props;
        const textContainer = {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 35,
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
            <div
                key={ info.id }
                id={ info.id }
                className={'viso-pools-ori-drop node-flow-item'}
                style={{ position: styleObj.position, left:styleObj.left, top: styleObj.top, zIndex: 0}}
            >
                <div
                    style={{width: styleObj.width, height: styleObj.height}}
                >
                    <div style={ textContainer } className={"viso-name"} >
                        <span className="text" style={textStyle}>
                            { info.name }
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}