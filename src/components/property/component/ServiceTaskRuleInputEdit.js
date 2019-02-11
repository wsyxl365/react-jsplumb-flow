import React, { Component } from "react";
import { Input } from 'antd';
import HocInputRules from "@/components/HocUI/component/HocInputRules";

@HocInputRules()
export default class ServiceTaskRuleInputEdit extends Component {
    componentDidMount() {
        const { onRef } = this.props;
        onRef(this.refs);
    }

    render() {
        return (<Input ref={ref => this.refs = ref} {...this.props.inputProps}/>)
    }
}