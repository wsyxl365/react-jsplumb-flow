import React, {Component, Fragment} from "react";
import { proConfig } from "@/common/config";
import {Input, Modal, Button, Radio, Card, Row, Col, Skeleton, Alert, Spin, Pagination } from "antd";
import {fromJS} from "immutable";
import Util from "@/common/Util";
const RadioGroup = Radio.Group;
/**
 * 属性修改公共包装组件-表单分页
 * @returns {function(*): HocInputRules}
 * @constructor
 */
function HocFormPagination(){
    return function(WrappedComponent) {
        return class HocFormPagination extends Component {
            constructor(props){
                super(props);
                this.state = {
                    visible: false
                };
                this.showModal = this.showModal.bind(this);
                this.handleOk = this.handleOk.bind(this);
                this.handleCancel = this.handleCancel.bind(this);
                this.onChangePagination = this.onChangePagination.bind(this);
                this.onChangeRadioGroup = this.onChangeRadioGroup.bind(this);
            }

            componentDidMount() {
                const { getBankFormList } = this.props;
                /**
                 * 默认传入分页数据，
                 * 页数是1，每页条数12
                 */
                getBankFormList(proConfig.pagination.defaultCurrent, proConfig.pagination.defaultPageSize, this.jsPlumbConfig.bankFormListUrl);
            }

            showModal() {
                this.setState(()=>({visible: true}))
            }
            handleOk() {
                this.setState(()=>({visible: false}))
            }
            handleCancel() {
                this.setState(()=>({visible: false}))
            }
            /**
             * 分页逻辑
             */
            onChangePagination(pageNumber) {
                //console.log("pageNumber", pageNumber)
                const { getBankFormList } = this.props;
                /**
                 * 默认传入分页数据，
                 * 页数是1，每页条数10
                 */
                getBankFormList(pageNumber, proConfig.pagination.defaultPageSize, this.jsPlumbConfig.bankFormListUrl);
            }

            /**
             * RadioGroup组选择回调事件
             * @param e
             */
            onChangeRadioGroup(event) {
                const { propertyData, data4, handleSetDataSource, handleSetReRender, handleSetProperty } = this.props;
                let dataSourceToJs = data4.toJS();
                let propertyDataToJs = propertyData.toJS();
                let nodeDataItem =  dataSourceToJs.nodeData.find((item) => {
                    return item.id === propertyDataToJs.id
                });
                nodeDataItem.formKey = propertyDataToJs.formKey = event.target.value;
                /**
                 * 操作完毕后设置下数据源，方便修改整体虚拟dom逻辑
                 */
                handleSetDataSource(fromJS(dataSourceToJs));
                /**
                 * 这里propertyData属性数据源也需要动态更新
                 */
                handleSetProperty(fromJS(propertyDataToJs));
                /**
                 * 更新全局reRender变量，触发data4源数据重新循环渲染
                 */
                handleSetReRender({
                    hash: Util.randomWord(false, 15),
                });
            }
            render() {
                const { propertyData, bankFormList } = this.props;
                return (<div>
                    <WrappedComponent { ...this.props }/>
                    <div className="item-container">
                        <div className="item-title">表单配置:</div>
                        <Button block onClick={this.showModal}>
                            {
                                propertyData.get("formKey") && bankFormList.data
                                    ?

                                        bankFormList.data.map((item, index) => {
                                            if (item.formId === propertyData.get("formKey")) {
                                                return item.name
                                            }
                                        })
                                    :
                                        "选择表单"
                            }
                        </Button>
                    </div>
                    <Modal
                        className="selectFormModal"
                        title="表单配置"
                        visible={this.state.visible}
                        width={"80%"}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        {
                            bankFormList.data
                                ?
                                <div>
                                    <RadioGroup
                                        onChange={ this.onChangeRadioGroup }
                                        value={ propertyData.get("formKey") }
                                        style={{ width: "100%" }}
                                    >
                                        <Row gutter={16}>
                                            {
                                                bankFormList.data.map((item, index) => {
                                                    return (
                                                        <Col className="gutter-row" span={6} key={item.name + index}>
                                                            <div className="gutter-box">
                                                                <Radio value={item.formId}>{item.name}</Radio>
                                                                <Card
                                                                    title={item.name}
                                                                    style={{marginTop: "20px", marginBottom: "20px"}}
                                                                    hoverable={true}
                                                                >
                                                                    <div style={{padding: "10px"}}>
                                                                        <Skeleton avatar paragraph={{rows: 4}}/>
                                                                    </div>
                                                                </Card>
                                                            </div>
                                                        </Col>
                                                    )
                                                })
                                            }
                                        </Row>
                                    </RadioGroup>
                                    <Pagination
                                        style={{ textAlign: "center" }}
                                        defaultCurrent={ proConfig.pagination.defaultCurrent }
                                        defaultPageSize={ proConfig.pagination.defaultPageSize }
                                        total={ bankFormList.count }
                                        onChange={ this.onChangePagination }
                                    />
                                </div>
                                :
                                null
                        }
                    </Modal>
                </div>)
            }
        }
    }
}

export default HocFormPagination;