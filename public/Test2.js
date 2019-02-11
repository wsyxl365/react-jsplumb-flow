import React, { Component } from "react";
import { ReverseJSPlumbFlow }  from "../src"
import {proConfig} from "@/common/config";

export default class Test2 extends Component{
    render() {
        return (
            <div>
                <ReverseJSPlumbFlow
                    id={"1087954106012282882"}
                    headerToken={{name: "Authorization", token: proConfig.interfaceToken }}
                />
            </div>
        )
    }
}