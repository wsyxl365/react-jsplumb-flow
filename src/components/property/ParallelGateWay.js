import React, {Component, Fragment} from "react";
import HocFormComponent from "../HocUI/HocFormComponent";
import { Input, Select, AutoComplete } from 'antd';

@HocFormComponent()
class ParallelGateWay extends Component{
    render() {
        return (<Fragment>
           <div>后期扩展选项</div>
        </Fragment>)

    }
}
export default ParallelGateWay;