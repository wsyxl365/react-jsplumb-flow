import React, {Component, Fragment} from "react";
import HocUIHeader from "./../HocUI/HocUIHeader";

//左侧节点->用户任务
import UserTask from "./component/UserTask";
//左侧节点->服务任务
import ServiceTask from "./component/ServiceTask";

/**
 * 左侧节点模块区域
 */
@HocUIHeader("Activities")
export default class Activities extends Component {
    render() {
        return (
            <Fragment>
                <UserTask />
                <ServiceTask />
            </Fragment>
        );
    }
}