import React, { Component } from 'react'
import {Form, Select, Input, Modal, Icon, Row, Col, Button, message } from 'antd'
import ToolsBar from "../ToolsBar";
import { connect } from "react-redux";
import { fromJS } from "immutable";
import VirtualDOMHandle from "@/common/VirtualDOMHandle";
import { proConfig } from "@/common/config.js";
import Util from "../../common/Util";
import {actionCreators as actionCreatorsGlobal, actionCreators} from "../../storeGlobal";
import { actionCreators as actionCreatorsTool }from "../../storeTool";
import { actionCreators as actionCreatorsProperty }from "../../storeProperty";
import "@/common/axiosInterceptors";
// 右键菜单
import NodeFlowRightMenu from "@/components/NodeFlowRightMenu";
import axios from "axios";
const containerId = 'diagramContainer';
const containerSelector = '#' + containerId;

// 是否允许改变流程图的布局（包括大小、连线、节点删除等）
const canChangeLayout = true;

// 很多连接线都是相同设置的情况下，可以将配置抽离出来，作为一个单独的变量，作为connect的第二个参数传入。
// 实际上connect的第二个参数会和第一个参数merge，作为一个整体。
const commonConfig = {
  /**
   * 如果你将isSource和isTarget设置成true，那么久可以用户在拖动时，自动创建链接。
   */
  // 是否可以拖动（作为连线起点）
  isSource: canChangeLayout,
  // 是否可以放置（连线终点）
  isTarget: canChangeLayout,
  // 设置连接点最多可以连接几条线
  // -1不限制，默认限制一条线
  maxConnections: -1,
  // 设置锚点位置，按照[target, source]的顺序进行设置
  // 可以有 Bottom Top Right Left四种方位
  // 还可以是BottomLeft BottomRight BottomCenter TopLeft TopRight TopCenter LeftMiddle RightMiddle的组合
  // 默认值 ['Bottom', 'Bottom']
  // anchor: ['Bottom', 'Bottom'],
  // 端点类型，形状（区分大小写），Rectangle-正方形 Dot-圆形 Blank-空
  endpoint: [canChangeLayout ? 'Dot' : 'Blank', {
    radius: 4,
  }],
  // 设置端点的样式
  endpointStyle: {
    fill: 'red', // 填充颜色
    outlineStroke: 'blank', // 边框颜色
    outlineWidth: 0, // 边框宽度
  },
  // 设置连接线的样式 Bezier-贝瑟尔曲线 Flowchart-流程图 StateMachine-弧线 Straight-直线
  connector: ['Flowchart'],
  // 设置连接线的样式
  connectorStyle: {
    stroke: '#456', // 实线颜色
    strokeWidth: 3, // 实线宽度
    outlineStroke: 'blank', // 边框颜色
    outlineWidth: 2, // 边框宽度
  },
  // 设置连接线悬浮样式
  connectorHoverStyle: {
    stroke: "#ff6627",
  },
  // 设置连接线的箭头
  // 可以设置箭头的长宽以及箭头的位置，location 0.5表示箭头位于中间，location 1表示箭头设置在连接线末端。 一根连接线是可以添加多个箭头的。
  connectorOverlays: [
    [
      'Arrow',
      {
        width: 10,
        length: 10,
        location: 1
      }
    ],
  ]
}

// 分支条件存储
const ConditionCache = {}

const mapStateToProps = (state) => {
  return {
    data4: state.getIn(['global', 'data4']).toJS(),
    nodeList: state.getIn(['global','nodeList']),
    reRender: state.getIn(['global','reRender']),
    mainContainerHeight: state.getIn(['global', 'mainContainerHeight']),
    freeConnectStyle: state.getIn(['global', 'commonFreeConnectStyle']),
    isClearCont: state.getIn(['global', 'isClearCont']),
    dataJson: state.getIn(['global', 'dataJson']),
    mainContainerPosition: state.getIn(['global', 'mainContainerPosition'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleNodelistData(nodeList){
      const action = actionCreators.setNodelistData(nodeList);
      dispatch(action);
    },
    handleButtonFocus(markName){
      const action = actionCreatorsTool.buttonFocus(markName);
      dispatch(action);
    },
    setMainContainerHeight(mainHeight){
      const action = actionCreators.setMainContainerHeight(mainHeight);
      dispatch(action);
    },
    handleSetProperty(info){
      const action = actionCreatorsProperty.setProperty(info)
      dispatch(action);
    },
    handleSetReRender(reRender){
      const action = actionCreatorsGlobal.setReRender(reRender);
      dispatch(action);
    },
    setDataSource(dataSource){
      const action = actionCreatorsGlobal.setDataSource(dataSource);
      dispatch(action);
    },
    handleClearOut(booleanData){
      const action = actionCreatorsGlobal.clearOut(booleanData);
      dispatch(action);
    },
    saveWorkFlow(dataItem, requestUrl){
      dispatch(actionCreatorsGlobal.saveWorkFlow(dataItem, requestUrl));
    },
    setNodeFlowMenu(dataItem){
      dispatch(actionCreatorsGlobal.setNodeFlowMenu(dataItem));
    },
    setWorkFlowMode(dataItem) {
      dispatch(actionCreatorsGlobal.setWorkFlowMode(dataItem));
    },
    setMainContainerPos(pos){
      const action = actionCreators.setMainContainerPos(pos);
      dispatch(action);
    }
  }
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends Component {
  // 初始化页面常量、绑定事件方法
  constructor(props) {
    super(props);
    // 组件数据
    this.state = {
      labelOverlay: null,
      // 显示编辑浮层
      showEditModal: false,
      visible: false,
      // 连接2个节点Modal框创建节点input输入值
      connectInputValue: '',
      visibleIframe: false,
      visibleSaveData: false, //保存工作流表单
      visibleConnection: false, //删除连线
      currentConnection: "" //当前的连线信息对象
    };
    this.jsPlumbForword = jsPlumb.getInstance();
    this.VirtualDomClass = null;
    this.EndpointsDataArray = [];
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleDomClick = this.handleDomClick.bind(this); //节点点击事件
    this.handleDomMouseUp = this.handleDomMouseUp.bind(this); //节点鼠标事件
    this.handleDomOncontextmenu = this.handleDomOncontextmenu.bind(this);
    this.saveData = this.saveData.bind(this);  //唤醒保存数据的modal框
    this.saveDataHandle = this.saveDataHandle.bind(this); // 正真的保存数据逻辑
    this.handleConnectionOk = this.handleConnectionOk.bind(this);
    this.handleConnectionCancel = this.handleConnectionCancel.bind(this);
    this.clearCont = this.clearCont.bind(this);
    this.clearContUnmount = this.clearContUnmount.bind(this);
    this.startPoolsDraggable = this.startPoolsDraggable.bind(this);
    this.endPoolsDraggable = this.endPoolsDraggable.bind(this);

    /**
     * 在构造函数的时候接收传递过来的props getInstance,
     * 得到当前的this,等于拿到了ref，因为高阶组件包装
     * 的问题，所以Ref需要转发，但是这里是ant 和redux 定义的高阶组件，无法修改代码
     */
    const { getInstance, headerToken, config } = props;

    /**
     * 配置request等配置信息，放在Component原型链上
     */
    this.setConfig(config);

    if (typeof getInstance === 'function') {
      getInstance(this); // 在这里把this暴露给`parentComponent`
    }
    /**
     * 动态的去添加请求头的拦截，需要在后台内部传递token
     */
    if(headerToken) {
      axios.interceptors.request.use(config => {
          config.headers[headerToken.name] = headerToken.token// 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        return config
      }, error => {
        return Promise.reject(error)
      })
    }
  }

  componentWillReceiveProps(nextProps){
    /**
     * 判断全局store里面的reRender hash值是否不一样，如果不一样就触发更新虚拟dom的操作
     */
    if (nextProps.reRender.hash !== this.props.reRender.hash) {
      // 更新数据
      this.upDateAndPaint(nextProps.data4, nextProps.reRender.style || {}, nextProps.reRender.draggable || "draggable");
    }
  }

  /**
   * 由于react的路由机制，页面并不会正真的刷新，
   * 所以要在组件销毁的时候去重置jsplumb的实例数据以及
   * 虚拟dom实例的数据
   */
  componentWillUnmount() {
    /**
     * 路由切换的时候，在所有组件卸载的时候去清除state里面的值，防止出现组件卸载后还执行回调
     * @param state
     * @param callback
     */
    this.setState = (state,callback)=>{
      return;
    };
    this.clearContUnmount();
  }

  // DOM挂载完成时调用
  componentDidMount() {
    this.initFlow();
    /**
     * 计算一下绘图区域的高度
     */
    let mainContainerHeight = Util.getClientHeight() - 40; //(页头height:40)
    this.props.setMainContainerHeight(mainContainerHeight);
    //console.log("窗口可视范围高度", mainContainerHeight);
  }

  /**
   * 用于设置一些初始化的变量
   * @requestConfig 请求接口的配置信息对象
   */
  setConfig(requestConfig) {
    let ipAddress = requestConfig.ipAddress ? requestConfig.ipAddress : proConfig.ipAddress;
    let bankFormListUrl = requestConfig.bankFormListUrl ? requestConfig.bankFormListUrl : proConfig.bankFormListUrl;
    let saveWorkFlowUrl = requestConfig.saveWorkFlowUrl ? requestConfig.saveWorkFlowUrl : proConfig.saveWorkFlowUrl;
    let reverseWorkFlowUrl = requestConfig.reverseWorkFlowUrl ? requestConfig.reverseWorkFlowUrl : proConfig.reverseWorkFlowUrl;
    let candidateUsersPageList = requestConfig.candidateUsersPageList ? requestConfig.candidateUsersPageList : proConfig.candidateUsersPageList;
    let candidateGroupsPageList = requestConfig.candidateGroupsPageList ? requestConfig.candidateGroupsPageList : proConfig.candidateGroupsPageList;
    let requestUrl = {
      ipAddress: ipAddress,
      bankFormListUrl: `${ipAddress}${bankFormListUrl}`, // 获取节点配置表单列表接口
      saveWorkFlowUrl: `${ipAddress}${saveWorkFlowUrl}`, // 保存工作流信息到后台接口
      reverseWorkFlowUrl: `${ipAddress}${reverseWorkFlowUrl}`, // 保存工作流信息到后台接口
      candidateUsersPageList: `${ipAddress}${candidateUsersPageList}`, // 用户任务节点users分页请求
      candidateGroupsPageList: `${ipAddress}${candidateGroupsPageList}`, // 用户组任务节点groups分页请求
    };
    Component.prototype.jsPlumbConfig = Object.assign({}, requestUrl);
    //console.log("正Component", Component.prototype);
  }

  // 初始化流程图
  initFlow() {
   //console.log("getContainer", jsPlumb.getManagedElements());
    this.jsPlumbForword.ready(() => {
        // 设置绘图容器
      this.jsPlumbForword.setContainer(containerId)
        // 可以使用importDefaults，来重写某些默认设置
      this.jsPlumbForword.importDefaults({
          ConnectionsDetachable: false, // 一般来说拖动创建的连接，可以再次拖动，让连接断开。如果不想触发这种行为，可以设置。
        });
        // 加载数据并绘制流程图
        this.loadDataAndPaint()
        // 允许改变流程图的布局
        if (canChangeLayout) {
          // 绑定删除连接线的操作处理
          this.bindDeleteConnection()
          // 绑定连接线添加label文本
          this.bindConnectionAddLabel()
          // 绑定页面元素的click事件，获得元素信息用于属性的编辑
          this.bindGetFlowInfo()
        }
      })
  }

  // 设置默认表现
  setDefault(id) {
    /**
     * 这一步用来注册可以拖动的节点，注册相对应的id号
     */
    canChangeLayout && this.setDraggable(id)
    //this.addEndpoint(id)
  }

  // 设置指定节点可拖动
  setDraggable(id) {
    this.jsPlumbForword.draggable(id, {
      containment: 'parent', // 限制节点的拖动区域
      grid: [10, 10], // 设置网格
    })
  }

  /**
   * 这一步仅仅只是添加了端点，但是并没有设置连线，
   * 设置连线需要调用connect()方法
   * 初始化数据后，给节点加上了endPoint, 如果想编码让endPoint链接上。
   * 需要在addEndpoint时，就给该断点加上一个uuid, 然后通过connect()方法，将两个断点链接上。
   * 建议使用node-uuid给每个断点都加上唯一的uuid， 这样以后链接就方便多了。
   * @param id
   */
  // 给指定节点添加端点
  addEndpoint(id, xname, yname) {
    /**
     * 如果想动态的生成Endpoint，就需要知道当前节点下级节点，已经方向，从而去创建相对应的节点
     */
    let anchors = '';
    if(xname === 'left') {
      anchors = 'Left';
    } else if(xname === 'right') {
      anchors = "Right";
    } else if(yname === 'top') {
      anchors = 'Top';
    } else if (yname === 'bottom') {
      anchors = 'Bottom'
    }
    this.jsPlumbForword.addEndpoint(id, {anchors: anchors, uuid: `${id}-anchor-${xname}-${yname}`}, commonConfig);
  }

  /**
   * 设置各个节点的连线 connect
   * @param info
   */
  setConnection(info) {
    /**
     * connectionData数据
     */
    this.jsPlumbForword.connect({
      uuids: [this.getAnchorID(info.source), this.getAnchorID(info.target)],
      // source:info.source.elementId,
      // target:info.target.elementId,
      overlays: [
        [
          "Label", this.getLabelSetInfo(info.name || '', info.source.elementId, info.target.elementId)
        ]
      ]
    })
  }

  // 获取端点id
  getAnchorID(anchorInfo) {
    /**
    *  anchorInfo: 全局数据源中 connectionData对象数组->source对象
     * anchorInfo.x: 源数据中保存的x值
     * nodeInfo.x: 获取页面真实dom的x值
     * ----- ***** -----
     * (anchorInfo.x - nodeInfo.x) / nodeInfo.width
     * 连接端点所在的x轴位置 - 节点所在的x轴位置 / 节点元素的长度 就可以求出这个连接点具体在节点的哪个位置
     * ----- ****** ------
     *
    * */
    const nodeInfo = this.getNodeInfo(document.getElementById(anchorInfo.elementId))
    console.log("nodeInfo", nodeInfo);
    console.log("anchorInfo", anchorInfo);
    const nodeData = this.props.data4;
    let posX = 0, posY = 0;
    nodeData.nodeData.forEach((item, index)=>{
      if(item.id === anchorInfo.elementId) {
         console.log("item", item.x, item.y);
         posX = (anchorInfo.x - item.x) / item.width;
         posY = (anchorInfo.y - item.y) / item.height;
      }
    })
    // const posX = (anchorInfo.x - nodeInfo.x) / nodeInfo.width;
    // const posY = (anchorInfo.y - nodeInfo.y) / nodeInfo.height;
    let posXName = 'center';
    let posYName = 'middle';

    if (posX === 0) {
      posXName = 'left'
    } else if (posX > 0.6) {
      posXName = 'right'
    }

    if (posY === 0) {
      posYName = 'top'
    } else if (posY > 0.6) {
      posYName = 'bottom'
    }
    const finalUidConnect = `${anchorInfo.elementId}-anchor-${posXName}-${posYName}`;
   // console.log(finalUidConnect)
    /**
     * 在这里确定了端点id的节点连接方向，从而可以动态的生成Endpoint
     */
    this.addEndpoint(anchorInfo.elementId, posXName, posYName);
    return finalUidConnect;
  }

  // 清除画布内容
  clearCont() {
    const { data4, setDataSource, handleNodelistData, handleSetProperty } = this.props;
    /**
     * 如果节点数量为0，清空数据不进行操作
     */
    if( data4.nodeData.length === 0 ) {
      return;
    }
    /**
     * 删除所有连接线、节点、锚点
     * 注意，必须调用此方法，要不然jsPlumb实例对象里面保存的节点ManagedElements不会删除数据，导致bug
     * jsPlumb.getManagedElements()
     */
    this.jsPlumbForword.deleteEveryConnection();
    /**
     * 清空数据源数据、属性值、清空虚拟dom数据
     */
    setDataSource(fromJS(proConfig.dataSource));
    handleNodelistData(fromJS([]));
    handleSetProperty(fromJS({}))
  }

  clearContUnmount() {
    const { data4, setDataSource, handleNodelistData, handleSetProperty } = this.props;
    this.jsPlumbForword.reset();
    /**
     * 清空数据源数据、属性值、清空虚拟dom数据
     */
    setDataSource(fromJS(proConfig.dataSource));
    handleNodelistData(fromJS([]));
    handleSetProperty(fromJS({}))
  }
  // 获取节点数据
  getNodeData() {
    const visoEles = document.querySelectorAll(containerSelector + ' .node-flow-item')
    const nodeData = []

    for (let i = 0, len = visoEles.length; i < len; i++) {
      const nodeInfo = this.getNodeInfo(visoEles[i])

      if (!nodeInfo.id) {
        throw new Error('流程图节点必须包含id')
      }

      if (!nodeInfo.name) {
        throw new Error('流程图节点必须包含name')
      }

      nodeData.push({
        id: nodeInfo.id,
        name: nodeInfo.name,
        type: nodeInfo.type,
        width: nodeInfo.width,
        height: nodeInfo.height,
        x: nodeInfo.x,
        y: nodeInfo.y,
      })
    }
    //console.log("nodeData",nodeData)
    return nodeData
  }

  // 获取节点相关信息
  /**
   * 这里返回的是节点也就是dom元素上的各种属性，包括id、name、width、height等
   * @param ele
   * @returns {{name: string, width: number, x: number, y: number, id: string, type: string, height: number}}
   */
  getNodeInfo(ele) {
    const id = ele.getAttribute('id')
    const eleName = ele.querySelector('.viso-name')
    const eleSelect = ele.querySelector('.ant-select-selection-selected-value')
    const eleRead = eleName || eleSelect
    const name = eleRead ? (eleRead.innerText || eleRead.textContent).replace(/^\s+|\s+$/g, '') : ''
    const currentStyle = ele.currentStyle || window.getComputedStyle(ele, null)
    //console.log("currentStyle", currentStyle.left)
    /**
     * 这里x,y是获取当前的left、top 也就是说是绘图容器内的坐标值
     */
    return  {
      id: id,
      name: name,
      type: ele.getAttribute('data-type'),
      width: parseInt(currentStyle.width, 10) || 80,
      height: parseInt(currentStyle.height, 10) || 80,
      x: parseInt(currentStyle.left, 10) || 0,
      y: parseInt(currentStyle.top, 10) || 0,
    }
  }

  // 获取连线数据
  getConnectionData() {
    /**
     * 获取整个连线的数据
     * @type {Object}
     */
    const originalData = this.jsPlumbForword.getAllConnections()
    const connectionData = []
    console.log("元素的x坐标", originalData[0].endpoints[0].canvas.offsetLeft);
    originalData.forEach((item) => {
      const anchorSource = item.endpoints[0].anchor;
      const anchorTarget = item.endpoints[1].anchor;
      const anchorSourceInfo = {
        name: anchorSource.type,
        x: anchorSource.x,
        y: anchorSource.y,
      }
      const anchorTargetInfo = {
        name: anchorTarget.type,
        x: anchorTarget.x,
        y: anchorTarget.y,
      }
      console.log("anchorSourceInfo---", originalData);
      const anchorSourcePosition = this.getAnchorPosition(anchorSource.elementId, anchorSourceInfo)
      const anchorTargetPosition = this.getAnchorPosition(anchorTarget.elementId, anchorTargetInfo)

      const overlays = item.getOverlays()
      //console.log("``````````overlays```````````", overlays);
      let labelText = ''
      //console.log(" Object.keys(overlays)",  Object.keys(overlays))
      Object.keys(overlays).forEach(key => {
        if (overlays[key].type === 'Label') {
          labelText = overlays[key].labelText
        }
      })

      const infoObj = {
        // 连线id
        id: item.id,
        // label文本
        label: labelText,
        // 源节点
        source: {
          elementId: anchorSource.elementId,
          x: anchorSourcePosition.x,
          y: anchorSourcePosition.y,
        },
        // 目标节点
        target: {
          elementId: anchorTarget.elementId,
          x: anchorTargetPosition.x,
          y: anchorTargetPosition.y,
        },
      }

      const condition = ConditionCache[anchorSource.elementId + ':' + anchorTarget.elementId]
      if (condition) {
        infoObj['conditionExpression'] = condition
      }

      connectionData.push(infoObj)
    })

    return connectionData
  }

  // 获取节点坐标信息
  getAnchorPosition(elementId, anchorInfo) {
    const nodeInfo = this.getNodeInfo(document.getElementById(elementId))
    console.log("x",nodeInfo.x, "y", nodeInfo.y);

    /**
     * nodeInfo.x nodeInfo.y是当前拖拽容器内的坐标值
     */
    return {
      x: nodeInfo.x + nodeInfo.width*anchorInfo.x,
      y: nodeInfo.y + nodeInfo.height*anchorInfo.y,
    }
  }

  // 获取设置Label文本的配置信息
  /**
   * connectInputValue代表当前的获取模态框输入的值，也就是当前label的值，如果用户没有输入就默认不需要新建label,控制类名就可以了
   * @param labelText
   * @param sourceId
   * @param targetId
   * @returns {{cssClass: string, location: number, label: (*|string)}}
   */
  getLabelSetInfo(labelText, sourceId, targetId) {
    return {
      label: labelText || '',
      //cssClass: this.state.connectInputValue === "" ? "" : 'jtk-overlay-label',
      cssClass: 'jtk-overlay-label',
      location: 0.4,
      // events: {
      //   click: (labelOverlay) => {
      //     this.setState({
      //       labelOverlay,
      //       editModalCondition: ConditionCache[`${sourceId}:${targetId}`],
      //       editModalSourceId: sourceId,
      //       eiditModalTargetid: targetId,
      //       editModalLabelText: labelOverlay.labelText,
      //       showEditModal: true,
      //     })
      //   }
      //}
    }
  }

  /**
   * 加载数据按钮执行逻辑
   * propsDataSource: 需要更新渲染的数据源，如果没有传递则是默认加载时候的数据源
   * styleObj: 用于调整了渲染页面数据样式的对象
   */
  // 加载数据并绘制流程图
  loadDataAndPaint() {
    /**
     * 模拟后台请求接口数据返回赋值
     */
    const { data4 } = this.props;
    const { nodeData, connectionData } = data4;
    /**
     * 定义需要绑定的事件对象
     * @type {{onClick: *}}
     */
    const eventObj = {
      onClick: this.handleDomClick,
      onMouseUp: this.handleDomMouseUp,
      onContextmenu: this.handleDomOncontextmenu
    };
    const extraEventObj = {
      startPoolsDraggable: this.startPoolsDraggable,
      endPoolsDraggable: this.endPoolsDraggable
    };

    /**
     * 实例化VirtualDOMHandle,如果不存在isSet变量，就执行初始化方法，否则就位新增方法
     * 在这里传入reverseRenderToJs，在类的内部进行判断，全局是否切换成反渲染模式
     */
    this.VirtualDomClass = new VirtualDOMHandle(data4, eventObj, extraEventObj);
    this.VirtualDomClass.setDataSource(data4);
    this.VirtualDomClass.init({ cursor: "move"});

    /**
     * 这个阶段渲染的只是流程的节点数据，并没有处理每个节点的拖动情况，连线情况等，
     * 安排在setState回调函数中去处理节点的连线、拖动等属性
     */
    this.props.handleNodelistData(fromJS(this.VirtualDomClass.nodeList));
    /**
     * 改变nodeList数据，更新dom结构 下面的方法需要用到真实的dom节点,
     * 所以连线这一块是在真实挂载到页面上的Dom上去操作的
     **/
    /**
     * 设置默认表现
     */
    nodeData.forEach((info) => {
      this.setDefault(info.id)
    });
    /**
     * 创建连线
     */
    connectionData.forEach((info) => {
      // if (info.conditionExpression) {
      //   ConditionCache[info.source.elementId + ':' + info.target.elementId] = info.conditionExpression
      // }
      this.setConnection(info)
    })
  }

  /**
   * 更新节点和数据元
   */
  upDateAndPaint(propsDataSource, extraPropsObj, draggable){
    const storageData = propsDataSource;
    const { nodeData, connectionData } = storageData;
    /**
     * 实例化虚拟dom处理类
     * @type {ReCreatorVD}
     */
    /**
     * 定义需要绑定的事件对象
     * @type {{onClick: *}}
     */
    const eventObj = {
      onClick: this.handleDomClick,
      onMouseUp: this.handleDomMouseUp,
      onContextmenu: this.handleDomOncontextmenu
    };
    this.VirtualDomClass.updateNodeFlow(nodeData, eventObj, extraPropsObj);
    console.log("*******************upDate nodeList*****************************", this.VirtualDomClass.nodeList);
    /**
     * 这个阶段渲染的只是流程的节点数据，并没有处理每个节点的拖动情况，连线情况等，
     * 安排在setState回调函数中去处理节点的连线、拖动等属性
     */
    this.props.handleNodelistData(fromJS(this.VirtualDomClass.nodeList));
    /**
     * 改变nodeList数据，更新dom结构 下面的方法需要用到真实的dom节点,
     * 所以连线这一块是在真实挂载到页面上的Dom上去操作的
     **/
    /**
     * 设置默认表现
     */
    nodeData.forEach((info) => {
      this.setDefault(info.id)
    });

    /**
     * 如果存在draggable 说明页面节点需要开启拖拽模式，关闭连线模式
     * 如果不存在draggable 说明页面节点需要开启连线模式，关闭拖拽模式
     */
    if(draggable && draggable === "draggable") {
      this.nodeFlowCanDraggable(nodeData);
    } else {
      this.nodeFlowCanConnection(nodeData);
    }
  }

  /**
   * 只有连线可以利用jsplumb去bind click,节点的dom需要自行绑定事件
   * 需要更新至property store里面，展示在右侧
   */
  handleDomClick(info){
    this.props.handleSetProperty(fromJS(info));
    console.log("点击了页面上的节点,信息:", info);
  }

  /**
   * 节点的鼠标点击事件
   */
  handleDomMouseUp(event, info) {
      const {setNodeFlowMenu, mainContainerPosition, backstageCssMode } = this.props;
      const mainContainerPositionToJs = mainContainerPosition.toJS();
      const e = event || window.event;
      if (event.button === 2) {
          //console.log("点击了鼠标右键", event);
          console.log("节点信息是", info);

        if ( backstageCssMode && backstageCssMode === "relative") {
          // 左侧工具栏宽度
          const leftToolContainer = document.getElementById("left");
          const leftToolContainerWidth = leftToolContainer.clientWidth;
          // 公共头部高度
          const publicHeader = document.getElementById("titleContainer");
          const publicHeaderHeight = publicHeader.clientHeight;
          const workFlowX = e.clientX;
          const workFlowY = e.clientY;
          info.newX = workFlowX - mainContainerPositionToJs.x + leftToolContainerWidth;
          info.newY = workFlowY - mainContainerPositionToJs.y + publicHeaderHeight;
        } else {
          /**
           /**
           * 避免使用event的坐标，不准备性能差;
           * 这里计算的逻辑的是: info的 x,y是该节点针对于当前画布 x, y + mainContainerPosition对象是画布容器当前的x , y + info.width、info.height是
           * 当前节点的宽高
           */
          info.newX = e.pageX;
          info.newY = e.pageY;
        }
        setNodeFlowMenu(fromJS({isSet: true, info}));
      }
  }

  handleDomOncontextmenu(event){
    event.preventDefault();
  }

  /**
   * 新增添加节点的方法
   **/
  createNewNode(visoData){
    const { XWidth, YHeight, mainContainerPosition } = this.props;
    const mainContainerPositionToJs = mainContainerPosition.toJS();
    const { coordinate: { x,y}, createInfo: { name, width, height, type, id, key, documentation } } = visoData;
    // 左侧工具栏宽度
    const leftToolContainer = document.getElementById("left");
    const leftToolContainerWidth =  leftToolContainer.clientWidth;
    // 公共头部高度
    const publicHeader = document.getElementById("titleContainer");
    const publicHeaderHeight = publicHeader.clientHeight;

    /**
     * 这里需要处理一下x, y的值:
     * 需要在x,y的方向上减去自身的长和宽以及左侧工具栏的padding值
     * 这里减去的x轴163实际上是左侧工具栏的长度，Y轴40实际上是画布
     * 主container到顶部的距离，后期实现考虑动态实现
     *  "x": `${x - leftToolContainerWidth}`,
     *  "y": `${y - publicHeaderHeight}`,
     *  !!!!重要:组件接收传递进来的XWidth、YHeight,这2个值也必须一起减去，
     *  因为画布为绝对定位，必须减去组件本身的边框、头部值和后台
     *  的菜单及头部值，需要组合!!!!
     */
    console.log("为修改之前的x,y", x,y);
    let newInfo = {
      "id": id,
      "name": name,
      "type": type,
      "width": width,
      "height": height,
      // "x": `${x - leftToolContainerWidth - XWidth}`,
      "x": `${ x - mainContainerPositionToJs.x }`,
      // "y": `${y - publicHeaderHeight - YHeight}`,
      "y": `${ y - mainContainerPositionToJs.y }`,
      "documentation": documentation,
    };
    /**
     * 开始节点需要有表单配置的字段
     */
    if(type === proConfig.nodeFlowType.start) {
      newInfo.formKey = visoData.createInfo.formKey
    }
    /**
     * UserTask需要有CandidateUsers、CandidateGroups配置用户以及用户组的字段
     */
    if(type === proConfig.nodeFlowType.userTask) {
      newInfo.candidateUsers = visoData.createInfo.candidateUsers;
      newInfo.candidateGroups = visoData.createInfo.candidateGroups;
      newInfo.formKey = visoData.createInfo.formKey;
    }
    /**
     * ServiceTask需要有配置规则serviceTaskRule字段
     */
    if(type === proConfig.nodeFlowType.serviceTask) {
      newInfo.serviceTaskRule = visoData.createInfo.serviceTaskRule;
    }

    /**
     * 每次添加的新节点或者子流程等需要push进全局store数据源,
     * 数据源可以生成虚拟dom方便样式、属性等修改
     * 这里数据源暂时使用 data4
     */
    let dataSource = this.props.data4;
    dataSource.nodeData.push(newInfo);
    this.props.setDataSource(fromJS(dataSource));
  }

  // 绑定删除连接线的操作处理
  bindDeleteConnection() {
    this.jsPlumbForword.bind('dblclick', (connection) => {
      // if (window.confirm('确定删除所点击的连接线吗？')) {
      //   // 删除指定连接线
      //   jsPlumb.deleteConnection(connection)
      // }
      this.setState(() => ({
        visibleConnection: true,
        currentConnection: connection
      }));
    })
  }

  /**
   * 绑定页面元素的click事件获得该元素的信息，用于连线设置属性
   */
  bindGetFlowInfo() {
    this.jsPlumbForword.bind('click', (connection) => {
      console.log("````````当前连线数据connection", connection)
      /**
       * 特别注意这里当前的连线id是随机生成的，所以不能用来做数据的比对判断，
       * 必须判断改连线的source.elementId、target.elementId是否和connection.sourceId、connection.targetId相等
       */
      let dataArray = this.props.data4.connectionData;
      let currentInfo = null;
      dataArray.forEach((item, index) => {
        if( item.source.elementId === connection.sourceId && item.target.elementId === connection.targetId ) {
          currentInfo = item;
        }
      });
      this.props.handleSetProperty(fromJS(currentInfo));
    })
  }

  // 绑定连接线添加label文本
  /**
   * 绑定连接线这边比较蛋疼，不论你如何操作，是否建立连线都必须同步执行的，
   * 也就是说你回调的方法无法去控制
   */
  bindConnectionAddLabel() {
    // 建立连接线之前触发
    // 返回true正常建立连线，返回false取消连接
    this.jsPlumbForword.bind('beforeDrop',  (info) => {
      console.log('sdfsdfsdfdinfo', info);
      //const { nodeData, connectionData } = this.props.data4;
      let dataToJs = this.props.data4;
      let CurrentLineInfo = null;
      /**
       * 在这里要做个判断，如果是并行网关的化，CurrentLineInfo对象中不需要连线规则和连线规则语言
       * 1.并行网关的逻辑和普通的连线逻辑一样，不需要配置规则。
       * 2.排他网关需要配置规则，则需要判断连线的头和尾，如果出现exclusive字段，则属于排他网关，需要配置规则
       */
      let sourceIdData = info.sourceId.split("_");
      let targetIdData = info.targetId.split("_");
      if( sourceIdData[0] === "exclusive"  || targetIdData[0] === "exclusive" || sourceIdData[0] === "inclusive" || targetIdData[0] === "inclusive" ) {
        CurrentLineInfo = {
          id: info.connection.id, //随机的id 暂时先这样定
          type: proConfig.nodeFlowType.connectionLine,
          renderType: proConfig.nodeFlowType.connectionLine,
          name: "", // 这里暂时先不要获取label的值，应为用户的模态输入框还没有改写state的数据，等在模态框回调中改变全局状态数据的时候再去赋值
          source: {
            elementId:  info.sourceId,
            x: 0,
            y: 0
          },
          target: {
            elementId:  info.targetId,
            x: 0,
            y: 0
          },
          documentation: "", // 连线描述
          rules: "", // 连线规则
          rulesLanguage: "activiti", //连线规则语言 默认activity自带
        }
      } else {
        CurrentLineInfo = {
          id: info.connection.id, //随机的id 暂时先这样定
          type: proConfig.nodeFlowType.connectionLine,
          renderType: proConfig.nodeFlowType.connectionLineNormal,
          name: "", // 这里暂时先不要获取label的值，应为用户的模态输入框还没有改写state的数据，等在模态框回调中改变全局状态数据的时候再去赋值
          source: {
            elementId:  info.sourceId,
            x: 0,
            y: 0
          },
          target: {
            elementId:  info.targetId,
            x: 0,
            y: 0
          }
        };
      }

      if(info.sourceId === info.targetId)
      {
        Modal.error({
          title: '错误啦',
          content: '请不要连接自己 兄跌>_<',
        });
        return false;
      }
      else
      {
        dataToJs.connectionData.push(CurrentLineInfo);
        this.setState(()=>({visible: true}), ()=>{
          this.callback = ()=>{
            info.connection.setLabel(this.getLabelSetInfo(this.state.connectInputValue))
            /**
             * 如果点击确定了，在回调中重新给改连线的标签赋值
             * @type {{[K in keyof TProps]: any} | Object | Array<any> | {[p: string]: any} | {[K in keyof TProps]: any} | data4 | *}
             */
            dataToJs.connectionData.forEach((item, index)=>{
              if(item.id === CurrentLineInfo.id) {
                item.name = this.state.connectInputValue;
              }
            });
            this.props.setDataSource(fromJS(dataToJs));
          }
        });
        this.props.setDataSource(fromJS(dataToJs));
        return true
      }
    })
  }

  /**
   * 保存数据,唤醒modal框
   */
  saveData(){
    this.setState(()=>({visibleSaveData: true}))
  }

  /**
   * 保存数据正真的执行逻辑
   * values存有表单的信息: 工作流名称、工作流描述
   */
  saveDataHandle(){
    const { data4 :{ nodeData, connectionData, bpmnAttr } , setDataSource, saveWorkFlow } = this.props;
    if( bpmnAttr.bpmnName === "" ) {
      message.error("表单属性必须填写名称");
      return;
    }
    /**
     * 获取各个节点坐标的信息等等
     * @type {Array}
     */
    const newNodeData = this.getNodeData()
    console.log("节点的坐标信息", newNodeData);
    /**
     * 获取各个连线的坐标信息等等
     * @type {Object | Array}
     */
    const newOriginalData = this.jsPlumbForword.getAllConnections()
    console.log("newOriginalData", newOriginalData);
    newOriginalData.forEach((item) => {
      const anchorSource = item.endpoints[0].anchor;
      const anchorTarget = item.endpoints[1].anchor;
      /**
       * Source节点信息对象
       * 这里连接线的断点位置需要加上端点图形圆的半径
       * @type {{name: jsPlumb.AnchorId, x: number, y: number}}
       */
      const anchorSourceInfo = {
        elementId: item.sourceId,
        name: anchorSource.type,
        x: item.endpoints[0].canvas.offsetLeft + proConfig.connectionCircleRadius,
        y: item.endpoints[0].canvas.offsetTop + proConfig.connectionCircleRadius,
      };
      /**
       * Target节点信息对象
       * 这里连接线的断点位置需要加上端点图形圆的半径
       * @type {{name: jsPlumb.AnchorId, x: number, y: number}}
       */
      const anchorTargetInfo = {
        elementId: item.targetId,
        name: anchorTarget.type,
        x: item.endpoints[1].canvas.offsetLeft + proConfig.connectionCircleRadius,
        y: item.endpoints[1].canvas.offsetTop + proConfig.connectionCircleRadius,
      };
      /**
       * 循环当前全局的连线数据，赋值x,y坐标值
       */
      connectionData.forEach((item, index, arr) => {
        if(item.source.elementId === anchorSourceInfo.elementId && item.target.elementId === anchorTargetInfo.elementId) {
          item.source.x = anchorSourceInfo.x;
          item.source.y = anchorSourceInfo.y;
          item.target.x = anchorTargetInfo.x;
          item.target.y = anchorTargetInfo.y;
        }
      });
    });

    /**
     * 循环newNodeData节点对象数组，给当前的全局nodeData对象x,y坐标赋值
     */
    newNodeData.forEach((item, index, arr) => {
      nodeData.forEach((itemTwo) => {
        if(itemTwo.id === item.id) {
          itemTwo.x = item.x;
          itemTwo.y = item.y;
        }
      })
    });
    /**
     * 拼装新的数据源并且转化成immutable对象更新全局数据源
     * @type {{nodeData: (*|data4.nodeData|{formKey, Documentation, width, name, x, y, id, type, height}|{name, width, x, y, id, type, height}), connectionData: (*|data4.connectionData|{rulesLanguage, Documentation, rules, id, label, source, target}|{id, label, source, target})}}
     */
    let newDataSource = {
      id: "",
      bpmnAttr,
      nodeData,
      connectionData
    };
    setDataSource(fromJS(newDataSource));
    /**
     * 请求后台接口，保存当前工作流数据
     */
    saveWorkFlow(JSON.stringify(newDataSource), this.jsPlumbConfig.saveWorkFlowUrl);
    console.log("最终保存的数据", JSON.stringify(this.props.data4));
    //message.success(`流程新建完毕，最终的数据是:${JSON.stringify(this.props.data4)}`, 5)
  }

  /**
   * 用于设置页面所有的节点切换成可拖拽状态
   * @param nodeData
   */
  nodeFlowCanDraggable(nodeData){
    /**
     * 设置默认表现
     */
    nodeData.forEach((info) => {
      /**
       * 泳池、泳道组件不受工具的控制，自身有拖拽逻辑
       */
      if( info.type === "poolsOrientation" || info.type === "poolLaneOrientation" ) {
        return;
      }
      /**
       * toggleDraggable为流程节点是否可以拖动的切换事件，
       * 多次绑定就等于在是否可以拖动的状态间切换
       * @type {boolean}
       */
      let flag = this.jsPlumbForword.toggleDraggable(info.id);
      if (!flag) {
        this.jsPlumbForword.toggleDraggable(info.id);
      }
      /**
       * 切换成鼠标工具后，必须解除Source、Target的资源id对应的dom操作，
       * 否则拖动后还是会继续进行连线操作
       */
      this.jsPlumbForword.unmakeSource(info.id);
      this.jsPlumbForword.unmakeTarget(info.id);
    });
    /**
     * 改变工具按钮的focus状态
     */
    this.props.handleButtonFocus("MouseMoveTools");
  }

  /**
   * 用于设置页面所有的节点切换成连线状态
   * @param nodeData
   */
  nodeFlowCanConnection(nodeData){
    console.log("nodeData```````````````", nodeData);
    /**
     * toggleDraggable为流程节点是否可以拖动的切换事件，
     * 多次绑定就等于在是否可以拖动的状态间切换
     * @type {boolean}
     */
    nodeData.forEach((info) => {
      /**
       * 泳池、泳道组件不受工具的控制，自身有拖拽逻辑
       */
      if( info.type === "poolsOrientation" || info.type === "poolLaneOrientation" ) {
        return;
      }
      let flag = this.jsPlumbForword.toggleDraggable(info.id);
      if (flag) {
        this.jsPlumbForword.toggleDraggable(info.id);
      }
      /**
       * 切换成连线工具后，必须把工作流页面中的每个节点都指定城可配置的节点
       * 其实就是每个节点指定Source和Target，使它既可以连线也可以被连线
       * freeConnectStyle为redux全局的自由连线样式设置
       */
      this.jsPlumbForword.makeSource(info.id, this.props.freeConnectStyle.toJS());
      this.jsPlumbForword.makeTarget(info.id, this.props.freeConnectStyle.toJS());
    });
    /**
     * 改变工具按钮的focus状态
     */
    this.props.handleButtonFocus("ConnectLineTools");
  }

  // 左侧工具栏节点拖拽至主面板上的回调方法
  handleDropDown(dropInfo){
    console.log("index页面drop回调",dropInfo);
    /**
     * 大致梳理下逻辑:左侧工具栏拖拽只主页面上的时候，一定要考虑用户已经改变了原来节点的位置，那么原来的坐标就需要重新计算并渲染，显然不切合实际而且性能消耗大，
     * 所以这里只更新虚拟dom，这样只需要在用户保存的同时去获取页面上所有节点加连线的信息就可以了
     */
    this.createNewNode(dropInfo);
    /**
     * 当新建节点或者子流程等其他节点时，当此时的工具停留在连线工具上，
     * 我们需要切换至鼠标工具，方便用户的下一步拖拽操作
     **/
    let newNodeData = this.props.data4;
    /**
     * 定义需要绑定的事件对象
     * @type {{onClick: *}}
     */
    const eventObj = {
      onClick: this.handleDomClick,
      onMouseUp: this.handleDomMouseUp,
      onContextmenu: this.handleDomOncontextmenu
    };

    /**
     * 实例化VirtualDOMHandle,执行新增方法
     */
    this.VirtualDomClass.addNodeFlow(newNodeData, dropInfo, eventObj);

    console.log("reCreatorData", this.VirtualDomClass);
    console.log("reCreatorData.nodeList", this.VirtualDomClass.nodeList);
    this.props.handleNodelistData(fromJS(this.VirtualDomClass.nodeList));
    /**
     * 新增只需要重新设置节点的连接属性，不需要设置连线属性
     * 这里一定需要等到dom挂载以后再去设置拖拽的初始化操作
     */
    this.setDefault(dropInfo.createInfo.id);
    /**
     * 页面节点重新切换成鼠标工具的拖拽状态
     */
    this.nodeFlowCanDraggable(newNodeData.nodeData);
  }
  /**
   * 连接节点modal框点击确定、取消回调事件
   **/
  handleOk(e){
    this.callback && this.callback();
    this.setState(()=>({
      visible: false,
      connectInputValue: '' //每次新建结束后记得清空input的值
    }))
  }
  handleCancel(){
    this.setState({
      visible: false,
    });
  }
  /**
   *  连接节点modal框input框回调事件
   **/
  onChange(e){
    const { value } = e.target;
    this.setState(()=>({
      connectInputValue: value
    }))
  }

  /**
   * 删除连线modal-> ok
   */
  handleConnectionOk() {
    const { data4, setDataSource } = this.props;
    this.setState(() => ({
      visibleConnection: false
    }), () => {
      /**
       * 删除绘图区域的连线后，用时需要删除数据源中的connectionData数据
       */
       let currentConnection = this.state.currentConnection;
      this.jsPlumbForword.deleteConnection(this.state.currentConnection);
       let newConnectionDataItemIndex = data4.connectionData.findIndex((item) => {
         return item.id === currentConnection.id;
       });
      data4.connectionData.splice(newConnectionDataItemIndex, 1);
      /**
       * 删除完毕后对数据源进行保存操作
       */
      setDataSource(fromJS(data4));
    });
  }

  /**
   * 删除连线modal-> cancel
   */
  handleConnectionCancel() {
    this.setState(() => ({
      visibleConnection: false
    }));
  }

  /**
   * 泳道可拖拽长度宽度并且停止移动性-start(传递进虚拟dom类，供生成的泳池组件调用)
   * @returns {*}
   */
  startPoolsDraggable( info ) {
    let flag = this.jsPlumbForword.toggleDraggable(info.id);
    if (flag) {
      this.jsPlumbForword.toggleDraggable(info.id);
    }
  }

  /**
   * 泳道可拖拽移动并且停止拖拽长度和高度-end(传递进虚拟dom类，供生成的泳池组件调用)
   * @returns {*}
   */
  endPoolsDraggable( info ) {
    let flag = this.jsPlumbForword.toggleDraggable(info.id);
    if (!flag) {
      this.jsPlumbForword.toggleDraggable(info.id);
    }
  }

  //jsplumbGetAllConnections() {
    //this.jsPlumbForword.getAllConnections();
    //(item)=>{ this.jsPlumbForword.deleteConnectionsForElement(item) }
    //this.jsPlumbForword.deleteConnection(item);
  //}

  // DOM渲染
  render() {
    return (
      <div style={{position: "relative"}}>
        <Row>
          <Col span={24}>
            <div className="title-container" id="titleContainer">
              <Col span={24}>
                <div style={{color: "#fff", textAlign: "right", lineHeight: "40px"}}>
                    <div className="header-btn-group">
                      <Button id="saveData" type="primary" size="small" onClick={ this.saveDataHandle }>保存数据</Button>
                      <Button type="primary" size="small" onClick={ this.clearCont }>清除内容</Button>
                    </div>
                </div>
              </Col>
            </div>
          </Col>
        </Row>
        <div id="operate">
          <div id="toolsbar">
            <ToolsBar
                dropDownCB={(dropInfo)=>this.handleDropDown(dropInfo)}
                jsplumGetConnections={ this.jsPlumbForword.getConnections.bind(this) }
            />
          </div>
        </div>
        <Modal title="请输入连接线的label"
               visible={this.state.visible}
               onOk={this.handleOk}
               onCancel={this.handleCancel}
        >
          <Input placeholder="请输入label名称" onChange={this.onChange} value={this.state.connectInputValue}/>
        </Modal>
        <Modal
            title="提示"
            visible={this.state.visibleConnection}
            onOk={this.handleConnectionOk}
            onCancel={this.handleConnectionCancel}
        >
          <p>确定删除所点击的连接线吗</p>
        </Modal>
        <NodeFlowRightMenu
            jsplumbGetAllConnections={ this.jsPlumbForword.getAllConnections }
            jsplumbDeleteConnectionsForElement={ this.jsPlumbForword.deleteConnectionsForElement.bind(this) }
            EndpointsDataArray={ this.EndpointsDataArray }
        />
      </div>
    )
  }
}
