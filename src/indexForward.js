import React, { Component } from 'react';
import JSPlumbFlow from './components/JSPlumbFlow';
import './static/css/App.css';
import { store } from "@/store";
import { Provider } from "react-redux";
import PropTypes from 'prop-types';


export default class ForwardJSPlumbFlow extends Component {
    constructor(props) {
        super(props);
        this.store = store;
    }
    componentDidMount(){

    }
    render() {
        return (
            <Provider store={ this.store }>
                <JSPlumbFlow{ ...this.props }/>
            </Provider>
        );
    }
}
ForwardJSPlumbFlow.defaultProps={
    XWidth: 0,
    YHeight: 0,
    config: {

    },
    backstageCssMode: "relative" //由于是内嵌于后台，所以有左侧菜单和头部菜单，默认为relative会计算减去相应的偏移
};

ForwardJSPlumbFlow.propTypes={
    id:PropTypes.number,
    XWidth: PropTypes.number,
    YHeight: PropTypes.number,
    clearCont: PropTypes.func
};


