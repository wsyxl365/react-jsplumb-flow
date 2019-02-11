import React, { Component } from "react";
// import App from './../../src/index';

export default class Test extends Component {
    constructor(props) {
        super(props);


    }
    componentDidMount(){
       // console.log('this.childCp', this.childCp);
    }

    render() {
        return (<div>
            你好你好你好！
            {/*<App*/}
                {/*//id={"1082873701903077378"}*/}
                {/*getInstance={(childCp) => { this.childCp = childCp; }}*/}
            {/*/>*/}
        </div>)
    }
}