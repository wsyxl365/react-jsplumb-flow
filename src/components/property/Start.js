import React, {Component, Fragment} from "react";
import HocFormComponent from "../HocUI/HocFormComponent";
import HocFormPagination from "../HocUI/component/HocFormPagination";

@HocFormComponent()
@HocFormPagination()
class Start extends Component{
    render() {
        return (<Fragment></Fragment>)
    }
}
export default Start;