import React, {Component} from "react";
import HocFormComponent from "../HocUI/HocFormComponent";

@HocFormComponent()
class End extends Component{
    render() {
      return (<div>
         后期扩展选项
      </div>)
    }
}
export default End;