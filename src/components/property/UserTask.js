import React, {Component, Fragment} from "react";
import HocFormComponent from "../HocUI/HocFormComponent";
import HocFormPagination from "../HocUI/component/HocFormPagination";
import { Input, Radio, Select, Tag, Modal} from 'antd';
import {fromJS} from "immutable";
import Util from "../../common/Util";
import PropertyUsersGroupSelectModal from "./component/PropertyUsersGroupSelectModal";


const Option = Select.Option;

const children = [];
for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}


@HocFormComponent()
@HocFormPagination()
class UserTask extends Component{
    constructor(props){
        super(props);
        this.state = {
            visibleUsers: false,
            visibleGroups: false
        };
        this.handleChangeUser = this.handleChangeUser.bind(this);
        this.handleChangeGroup = this.handleChangeGroup.bind(this);
        this.inputChangeRender = this.inputChangeRender.bind(this);
        this.handleBlurUser = this.handleBlurUser.bind(this);
        this.handleBlurGroups = this.handleBlurGroups.bind(this);

        this.usersSelectFocus = this.usersSelectFocus.bind(this);
        this.groupsSelectFocus = this.groupsSelectFocus.bind(this);
        this.handleCancelUsers = this.handleCancelUsers.bind(this);
        this.handleOKUsers = this.handleOKUsers.bind(this);
        this.handleCallBack = this.handleCallBack.bind(this);
        this.handleCancelGroups = this.handleCancelGroups.bind(this);
        this.handleOKGroups = this.handleOKGroups.bind(this);
    }

    /**
     * 输入事件回调+更新redux
     */
    inputChangeRender(renderValue, keyName) {
        const { propertyData, handleSetProperty } = this.props;
        let propertyDataToJs = propertyData.toJS();
        propertyDataToJs[keyName] = renderValue;
        /**
         * 这里propertyData属性数据源也需要动态更新
         */
        handleSetProperty(fromJS(propertyDataToJs));
    }
    /**
     * 失焦事件回调+更新redux
     */
    inputBlurRender( keyName ) {
        const { propertyData, data4, handleSetDataSource, handleSetReRender } = this.props;
        let dataSourceToJs = data4.toJS();
        let propertyDataToJs = propertyData.toJS();
        let nodeDataItem = dataSourceToJs.nodeData.find((item) => {
            return item.id === propertyDataToJs.id;
        });
        nodeDataItem[keyName] = propertyDataToJs[keyName];
        /**
         * 操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
         */
        handleSetDataSource(fromJS(dataSourceToJs));
        /**
         * 更新全局reRender变量，触发data4源数据重新循环渲染
         * 因为节点的点击事件需要重新循环数据源去拿到最新的info
         */
        handleSetReRender({
            hash: Util.randHash()
        });
    }

    /**
     * User input框输入回调事件
     */
    handleChangeUser(event){
        this.inputChangeRender(event.target.value, "candidateUsers");
    }
    /**
     * User input框失焦回调事件
     */
    handleBlurUser(event) {
        this.inputBlurRender(event.target.value, "candidateUsers");
    }
    /**
     * Group input框输入回调事件
     */
    handleChangeGroup(event){
        this.inputChangeRender(event.target.value, "candidateGroups");
    }
    /**
     * Group input框失焦回调事件
     */
    handleBlurGroups(event) {
        this.inputBlurRender(event.target.value, "candidateGroups");
    }




    /**
     * users select focus
     **/
    usersSelectFocus() {
        this.usersRefs.blur();
        this.setState( () => ({
          visibleUsers: true
        }))
    }
    /**
     * groups select focus
     **/
    groupsSelectFocus() {
        this.groupsRefs.blur();
        this.setState( () => ({
            visibleGroups: true
        }))
    }

    /**
     * users modal cancel回调事件
     */
    handleCancelUsers() {
        this.setState( () => ({
            visibleUsers: false
        }))
    }

    /**
     * groups modal cancel回调事件
     */
    handleCancelGroups() {
        this.setState( () => ({
            visibleGroups: false
        }))
    }
    /**
     *  Users modal框点击确定回调
     **/
    handleOKUsers () {
        this.setState( () => ({
            visibleUsers: false,
        }))
    }
    /**
     *  Users modal框点击确定回调
     **/
    handleOKGroups () {
        this.setState( () => ({
            visibleGroups: false,
        }))
    }

    handleCallBack( value, type ) {
        const { data4, propertyData, handleSetProperty, handleSetReRender, handleSetDataSource } = this.props;
        let dataSourceToJs = data4.toJS();
        let propertyDataToJs = propertyData.toJS();
        let nodeDataItem = dataSourceToJs.nodeData.find((item) => {
            return item.id === propertyDataToJs.id;
        });
        let valueArray = [];
        value.forEach( (item) => {
            valueArray.push(
                item.id
            )
        });
        if( type === "users" ) {
            nodeDataItem["candidateUsers"] = valueArray.join(",");
            nodeDataItem["candidateUsersArray"] = value;
            propertyDataToJs["candidateUsersArray"] = value;
        } else if( type === "groups" ) {
            nodeDataItem["candidateGroups"] = valueArray.join(",");
            nodeDataItem["candidateGroupsArray"] = value;
            propertyDataToJs["candidateGroupsArray"] = value;
        }
        /**
         * 这里propertyData属性数据源也需要动态更新
         */
        handleSetProperty(fromJS(propertyDataToJs));
        handleSetDataSource(fromJS(dataSourceToJs));
        /**
         * 更新全局reRender变量，触发data4源数据重新循环渲染
         * 因为节点的点击事件需要重新循环数据源去拿到最新的info
         */
        handleSetReRender({
            hash: Util.randHash()
        });
    }
    /**
     * 从redux的propertyData取值，渲染select users组件value
     * 由于字段的特殊性，展现给用户的是name字段，而传递给后台的是id字段
     * @returns {Array}
     */
    renderSelectUsersValue( type ) {
        const { propertyData } = this.props;
        let propertyDataToJs = propertyData.toJS();
        let candidateUsersValue = [];
        if( type === "users" ) {
            if( propertyDataToJs.candidateUsersArray ) {
                propertyDataToJs.candidateUsersArray.forEach( (item) => {
                    candidateUsersValue.push(item.name);
                });
            }
        } else if ( type === "groups" ) {
            if( propertyDataToJs.candidateGroupsArray ) {
                propertyDataToJs.candidateGroupsArray.forEach( (item) => {
                    candidateUsersValue.push(item.name);
                });
            }
        }
        return candidateUsersValue;
    }
    render() {
        return (
            <Fragment>
                <div className="item-container">
                    <div className="item-title">CandidateUsers:</div>
                    <Select
                        ref={ ref => (this.usersRefs = ref) }
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        value={ this.renderSelectUsersValue("users") }
                        //onChange={ this.usersSelectFocus }
                        onFocus={ this.usersSelectFocus }
                        open={ false }
                    />
                </div>
                <div className="item-container">
                    <div className="item-title">CandidateGroups:</div>
                    <Select
                        ref={ ref => (this.groupsRefs = ref) }
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        value={ this.renderSelectUsersValue("groups") }
                        onFocus={ this.groupsSelectFocus }
                        open={ false }
                    />
                </div>
                <Modal
                    title="Users"
                    width={ "80%" }
                    visible={ this.state.visibleUsers }
                    onOk={ this.handleOKUsers }
                    onCancel={ this.handleCancelUsers }
                >
                    <PropertyUsersGroupSelectModal
                        type={ "users" }
                        columns={
                            [
                                {
                                    title: 'CandidateUsers',
                                    dataIndex: 'name',
                                }
                            ]
                        }
                        pagination={
                            {
                                defaultCurrent: 1,
                                defaultPageSize: 4
                            }
                        }
                        handleCallBack={ this.handleCallBack }

                    />
                </Modal>
                <Modal
                    title="Groups"
                    width={ "80%" }
                    visible={ this.state.visibleGroups }
                    onOk={ this.handleOKGroups }
                    onCancel={ this.handleCancelGroups }
                >
                    <PropertyUsersGroupSelectModal
                        type={ "groups" }
                        columns={
                            [
                                {
                                    title: 'CandidateGroups',
                                    dataIndex: 'name',
                                }
                            ]
                        }
                        pagination={
                            {
                                defaultCurrent: 1,
                                defaultPageSize: 4
                            }
                        }
                        handleCallBack={ this.handleCallBack }
                    />
                </Modal>
            </Fragment>)
    }
}
export default UserTask;