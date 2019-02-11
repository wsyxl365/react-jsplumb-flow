import React, { Component } from "react";
import { ForwardJSPlumbFlow, ExhibitionJSPlumbFlow }  from "../src"
import { proConfig } from "@/common/config";
import ReverseJSPlumbFlow from "@/indexReverse";

export default class Test1 extends Component{
    render() {
        return (
            <div>
                {/*<ExhibitionJSPlumbFlow*/}
                    {/*requestUrl={"http://192.168.3.128:8090/bank/bpmn/getScheduleByHistoryTaskId"}*/}
                    {/*id={"100009"}*/}
                    {/*headerToken={{name: "Authorization", token: proConfig.interfaceToken }}*/}
                    {/*containerIdPreFix={"01"}*/}
                {/*/>*/}
                {/*<ExhibitionJSPlumbFlow*/}
                    {/*requestUrl={"http://192.168.3.128:8090/bank/bpmn/getScheduleByHistoryTaskId"}*/}
                    {/*id={"125012"}*/}
                    {/*headerToken={{name: "Authorization", token: proConfig.interfaceToken }}*/}
                    {/*containerIdPreFix={"02"}*/}
                {/*/>*/}
                <ForwardJSPlumbFlow
                    headerToken={{name: "Authorization", token: proConfig.interfaceToken }}
                    // config={{backstageCssMode: "sdfsdf"}}
                />
                {/*<ReverseJSPlumbFlow*/}
                    {/*id={"1087954106012282882"}*/}
                    {/*headerToken={{name: "Authorization", token: proConfig.interfaceToken }}*/}
                {/*/>*/}
            </div>
        )
    }
}