import React, {Component, Fragment} from "react";
import { Modal, Table, Input, Row, Col, Button } from "antd";
import axios from "axios";

export default class PropertyUsersGroupSelectModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            searchValue: "", // 搜索框输入值
            selectedRowKeys: [], // 用于保存点击表格的数据为key的字段，自动叠加
        };
        this.onSelectChange = this.onSelectChange.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.searchData = this.searchData.bind(this);
    }
    componentWillMount() {
        const { type } = this.props;
        let requestUrl = type === "users" ? Component.prototype.jsPlumbConfig.candidateUsersPageList : Component.prototype.jsPlumbConfig.candidateGroupsPageList;
        axios.get( requestUrl, {
            params: {
                pageIndex: 1,
                pageSize: 10,
                descending: false,
                filter: { name: ""}
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(res=>{
                console.log('res`````', res);
                let dataArray = [];
                if( type === "users" ) {
                    res.data.data.forEach( (item) => {
                        dataArray.push({
                            key: item.id,
                            id: item.id,
                            name: item.name,
                        })
                    });
                } else if ( type === "groups" ) {
                    res.data.data.forEach( (item) => {
                        dataArray.push({
                            key: item.iid,
                            id: item.iid,
                            name: item.roleName,
                        })
                    });
                }
                this.setState( () => ({
                    data: dataArray,
                    loading: false
                }))
            })
    }
    onSelectChange(selectedRowKeys, selectedRows) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        console.log('selectedRows changed: ', selectedRows);
        this.setState({ selectedRowKeys });
        this.props.handleCallBack( selectedRows, this.props.type );
    }

    /**
     * 搜索input框输入回调事件
     */
    searchChange( e ) {
        let value = e.target.value;
        this.setState( () => ({
            searchValue: value
        }))
    }

    /**
     * 点击查询按钮进行数据查询
     */

    searchData() {
        const { type } = this.props;
        let filterValue = this.state.searchValue;
        let requestUrl = type === "users" ? Component.prototype.jsPlumbConfig.candidateUsersPageList : Component.prototype.jsPlumbConfig.candidateGroupsPageList;
        let params = {
            pageIndex: 1,
            pageSize: 10,
            descending: false
        };
        if ( type === "users" ) {
            params.filter = { name: filterValue }
        }
        else {
            params.filter = { roleName: filterValue }
        }
        axios.get( requestUrl, {
            params,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(res=>{
                console.log('res`````', res);
                let dataArray = [];
                if( type === "users" ) {
                    res.data.data.forEach( (item) => {
                        dataArray.push({
                            key: item.id,
                            id: item.id,
                            name: item.name,
                        })
                    });
                } else if ( type === "groups" ) {
                    res.data.data.forEach( (item) => {
                        dataArray.push({
                            key: item.iid,
                            id: item.iid,
                            name: item.roleName,
                        })
                    });
                }
                this.setState( () => ({
                    data: dataArray,
                    loading: false
                }))
            })
    }

    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div>
                <div style={{ marginBottom: "20px" }}>
                    <Row>
                        <Col span={ 5 }>
                            <Input
                                placeholder="查询Users"
                                onChange={ this.searchChange }
                            />
                        </Col>
                        <Col span={ 1 } offset={ 1 }>
                            <Button type="primary" onClick={ this.searchData }>查询</Button>
                        </Col>
                        <Col span={ 17 }>
                        </Col>
                    </Row>
                </div>
                <Table
                    rowSelection={ rowSelection }
                    columns={ this.props.columns }
                    dataSource={ this.state.data }
                    loading={ this.state.loading }
                    pagination={ this.props.pagination }
                />
            </div>
        )
    }
}