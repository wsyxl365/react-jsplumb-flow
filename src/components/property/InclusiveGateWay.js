import React, {Component, Fragment} from "react";
import HocFormComponent from "../HocUI/HocFormComponent";

/**
 * -----包容网关-----
 */
@HocFormComponent()
class InclusiveGateWay extends Component{
    render() {
        return (<Fragment>
           <div>后期扩展选项</div>
        </Fragment>)

    }
}
export default InclusiveGateWay;