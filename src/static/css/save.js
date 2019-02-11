// import {Icon} from "antd";
//
// /**
//  * 用于判断返回到底是哪种类型的节点或者流程(或者后期扩展的其他类型)
//  * info 节点信息对象
//  * styleObj 节点css样式对象
//  */
// getRenderSortFlow(info, styleObj){
//     switch (info.type) {
//         case "task":
//             return  (
//                 <div
//                     key={info.id}
//                     id={info.id}
//                     className={`viso-item ${TypeClassName[info.type]}`}
//                     style={styleObj}
//                     data-type={info.type}
//                     onClick={()=>{this.handleDomClick(info)}}
//                 >
//                     {/*<Select defaultValue={info.name}>*/}
//                     {/*<Select.Option value="组长审批">组长审批</Select.Option>*/}
//                     {/*<Select.Option value="主管审批">主管审批</Select.Option>*/}
//                     {/*<Select.Option value="人事审批">人事审批</Select.Option>*/}
//                     {/*<Select.Option value="经理审批">经理审批</Select.Option>*/}
//                     {/*</Select>*/}
//                     {/*<span className="viso-close" style={{display: canChangeLayout ? '' : 'none'}}>&times;</span>*/}
//                     <span className="viso-name" key={info.name}>{info.name}</span>
//                     <span className="viso-close" style={{display: canChangeLayout ? '' : 'none'}} key={info.name + info.name}>&times;</span>
//                 </div>
//             );
//         case "start" :
//             return (
//                 <div
//                     key={ info.id }
//                     id={ info.id }
//                     className="viso-start-drop"
//                     style={ styleObj }
//                     onClick={()=>{this.handleDomClick(info)}}
//                     //data-type={info.type}
//                 >
//               <span className="viso-name align-item-name" key={info.name}>
//                 {info.name}
//               </span>
//                     <span className="align-item" key={info.name + info.name}></span>
//                     {/*<span className="viso-close" style={{display: canChangeLayout ? '' : 'none'}}>&times;</span>*/}
//                 </div>
//             );
//         case "end" :
//             return (
//                 <div
//                     key={ info.id }
//                     id={ info.id }
//                     className="viso-end-drop"
//                     style={ styleObj }
//                     onClick={()=>{this.handleDomClick(info)}}
//                 >
//               <span className="viso-name align-item-name" key={info.name}>
//                   {info.name}
//               </span>
//                     <span className="align-item" key={info.name + info.name}></span>
//                 </div>
//             );
//         case "gateway" :
//             return (
//                 <div
//                     key={ info.id }
//                     id={ info.id }
//                     className="viso-gateway-drop"
//                     style={ styleObj }
//                     onClick={()=>{this.handleDomClick(info)}}
//                 >
//               <span className="viso-name align-item-name" key={info.name} style={{display: "inline-block",transform: "rotate(45deg)"}}>
//                   {info.name}
//               </span>
//                     <span className="align-item"  key={info.name + info.name}></span>
//                 </div>
//             );
//         case "event" :
//             return (
//                 <div
//                     key={ info.id }
//                     id={ info.id }
//                     className="viso-event-drop"
//                     style={ styleObj }
//                     onClick={()=>{this.handleDomClick(info)}}
//                 >
//               <span className="viso-name align-item-name" key={info.name}>
//                   {info.name}
//               </span>
//                     <span className="align-item" key={info.name + info.name}></span>
//                 </div>
//             );
//         case "assignedActivity" :
//             return (
//                 <div
//                     key={ info.id }
//                     id={ info.id }
//                     className="viso-assigned-activity-drop"
//                     style={ styleObj }
//                     onClick={()=>{this.handleDomClick(info)}}
//                 >
//                     <Icon type="user" className="viso-name-icon" />
//                     <span className="viso-name align-item-name" key={info.name}>
//                   {info.name}
//               </span>
//                     <span className="align-item" key={info.name + info.name}></span>
//                 </div>
//             );
//         case "freedomActivity" :
//             return (
//                 <div
//                     key={ info.id }
//                     id={ info.id }
//                     className="viso-freedom-activity-drop"
//                     style={ styleObj }
//                     onClick={()=>{this.handleDomClick(info)}}
//                 >
//                     <Icon type="user" className="viso-name-icon" />
//                     <span className="viso-name align-item-name"  key={info.name}>
//                   {info.name}
//               </span>
//                     <span className="align-item" key={info.name + info.name}></span>
//                 </div>
//             );
//         case "innerChildFlowNode" :
//             return (
//                 <div
//                     key={ info.id }
//                     id={ info.id }
//                     className="viso-inner-child-flow-node-drop"
//                     style={ styleObj }
//                     onClick={()=>{this.handleDomClick(info)}}
//                 >
//               <span className="viso-name align-item-name" key={info.name}>
//                   {info.name}
//               </span>
//                     <span className="align-item" key={info.name + info.name}></span>
//                 </div>
//             );
//         case "outerChildFlowNode" :
//             return (
//                 <div
//                     key={ info.id }
//                     id={ info.id }
//                     className="viso-outer-child-flow-node-drop"
//                     style={ styleObj }
//                     onClick={()=>{this.handleDomClick(info)}}
//                 >
//               <span className="viso-name align-item-name" key={info.name}>
//                   {info.name}
//               </span>
//                     <span className="align-item" key={info.name + info.name}></span>
//                 </div>
//             );
//         default:
//             return (
//                 <div
//                     key={info.id}
//                     id={info.id}
//                     className={`viso-item ${TypeClassName[info.type]}`}
//                     style={styleObj}
//                     data-type={info.type}
//                     onClick={()=>{this.handleDomClick(info)}}
//                 >
//                     <span className="viso-name"  key={info.name}>{info.name}</span>
//                     <span className="viso-close" style={{display: canChangeLayout ? '' : 'none'}} key={info.name + info.name}>&times;</span>
//                 </div>
//             );
//     }
// }
//
// {/*<Popconfirm placement="topLeft" title={"亲，确认关闭编辑规则吗"} onConfirm={ this.cancelValidate } okText="好的" cancelText="取消" >*/}
// {/*<Button onClick={ this.rulesModalCancel }>*/}
// {/*取消*/}
// {/*</Button>*/}
// {/*</Popconfirm>,*/}
//
// // end
// {/*<div*/}
//     {/*key={ info.id }*/}
//     {/*id={ info.id }*/}
//     {/*className="viso-end-drop node-flow-item"*/}
//     {/*// onClick={()=>{this.handleEvent(info)}}*/}
//     {/*onClick={()=>{this.eventObj.onClick(info)}}*/}
//     {/*style={ styleObj }*/}
// {/*>*/}
//               {/*<span className="viso-name align-item-name" key={info.name}>*/}
//                   {/*{info.name}*/}
//               {/*</span>*/}
//     {/*<span className="align-item" key={info.name + info.name}></span>*/}
// {/*</div>*/}
// //排他网关
// {/*<div*/}
//     {/*key={ info.id }*/}
//     {/*id={ info.id }*/}
//     {/*className="viso-gateway-drop node-flow-item"*/}
//     {/*// onClick={()=>{this.handleEvent(info)}}*/}
//     {/*onClick={()=>{this.eventObj.onClick(info)}}*/}
//     {/*style={ styleObj }*/}
// {/*>*/}
//               {/*<span className="viso-name align-item-name" key={info.name} style={{display: "inline-block",transform: "rotate(45deg)"}}>*/}
//                   {/*{info.name}*/}
//               {/*</span>*/}
//     {/*<span className="align-item"  key={info.name + info.name}></span>*/}
// {/*</div>*/}
//
// //用户任务
// {/*<div*/}
//     {/*key={ info.id }*/}
//     {/*id={ info.id }*/}
//     {/*className={`viso-assigned-activity-drop  node-flow-item ${info.currentNode && info.currentNode === 1 ? "currentNodeFlow" : ""}`}*/}
//     {/*// onClick={()=>{this.handleEvent(info)}}*/}
//     {/*onClick={()=>{this.eventObj.onClick(info)}}*/}
//     {/*style={ styleObj }*/}
// {/*>*/}
//     {/*<Icon type="user" className="viso-name-icon" key={info.name + 'icon'}/>*/}
//     {/*<span className="viso-name align-item-name" key={info.name}>*/}
//                   {/*{info.name}*/}
//               {/*</span>*/}
//     {/*<span className="align-item" key={info.name + info.name}></span>*/}
// {/*</div>*/}
