import React, { Component } from "react";
import { ForwardJSPlumbFlow, ExhibitionJSPlumbFlow }  from "../src"
import { proConfig } from "@/common/config";

export default class Test1 extends Component{
    render() {
        return (
            <div>
                <ExhibitionJSPlumbFlow
                    requestUrl={"http://192.168.3.128:8090/bank/bpmn/getScheduleByProcessInstanceId"}
                    requestUrlHashKey={"processInstanceId"}
                    id={"247528"}
                    headerToken={{name: "Authorization", token: proConfig.interfaceToken }}
                />
                {/*<ExhibitionJSPlumbFlow*/}
                    {/*requestUrl={"http://192.168.3.217:8090/bank/bpmn/getScheduleByProcessInstanceId"}*/}
                    {/*requestUrlHashKey={"processInstanceId"}*/}
                    {/*id={"230026"}*/}
                    {/*headerToken={{name: "Authorization", token: proConfig.interfaceToken }}*/}
                {/*/>*/}
                {/*<ForwardJSPlumbFlow*/}
                    {/*headerToken={{name: "Authorization", token: proConfig.interfaceToken }}*/}
                {/*/>*/}
            </div>
        )
    }
}