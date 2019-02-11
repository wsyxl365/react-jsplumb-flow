import React, { Component } from 'react'
import {Form, Select, Input, Modal, Icon, Row, Col, Button, message } from 'antd'
import { proConfig } from "@/common/config.js";
import Util from "../../common/Util";
import "@/common/axiosInterceptors";
import PropTypes from 'prop-types';
import axios from "axios";
import VirtualDOMExhibition from "./common/VirtualDOMExhibition";
const containerId = 'diagramContainerExhibition';
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
    stroke: "#8573ff",
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

//const jsPlumbExhibition = jsPlumb.getInstance();

export default class Index extends Component {
  // 初始化页面常量、绑定事件方法
  constructor(props) {
    super(props);
    // 组件数据
    this.state = {
      dataSource: [],
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
    this.reCreatorData = null; //虚拟dom渲染类实例引用
    this.jsPlumbExhibition = jsPlumb.getInstance();
    /**
     * 在构造函数的时候接收传递过来的props getInstance,
     * 得到当前的this,等于拿到了ref，因为高阶组件包装
     * 的问题，所以Ref需要转发，但是这里是ant 和redux 定义的高阶组件，无法修改代码
     */
    const { getInstance, headerToken, config } = props;
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
        Promise.reject(error)
      })
    }
  }

  /**
   * 由于react的路由机制，页面并不会正真的刷新，
   * 所以要在组件销毁的时候去重置jsplumb的实例数据以及
   * 虚拟dom实例的数据
   */
  componentWillUnmount() {
    console.log("我销毁了!");
    /**
     * 路由切换的时候，在所有组件卸载的时候去清除state里面的值，防止出现组件卸载后还执行回调
     * @param state
     * @param callback
     */
    this.setState = (state,callback)=>{
      return;
    };
    this.jsPlumbExhibition.reset();
  }

  // DOM挂载完成时调用
  componentDidMount() {
    //console.log("jsPlumb***********", jsPlumb);
    const { id } = this.props;
    /**
     * 如果有id 则是反渲染流程
     * 如果没有传的化就是正常渲染
     */
    this.getData(id);
  }
  /**
   * 接收到父级iframe message事件后活动请求工作流数据id,进行数据请求
   * @param id
   */
  getData(id){
    const { requestUrl, requestUrlHashKey } = this.props;
    /**
     * 待办任务: `http://192.168.3.217:8090/bank/bpmn/getScheduleByTaskId?taskId=${id}
     * 已办任务: `http://192.168.3.217:8090/bank/bpmn/getScheduleByHistoryTaskId?taskId=${id}
     */
    axios.get(`${ requestUrl }?${ requestUrlHashKey }=${ id }`)
        .then(res =>{
          const { data: { data } } = res;
          console.log("res", data);
          //let dataSource = JSON.parse(data.designJson);
          //dataSource.nodeData[1].currentNode = 1;
          console.log("**************dataSource**************", data);
          this.setState(
              () => ({dataSource: data}),
              () => {
                this.initFlow();
              }
          );
        })
        .catch((error)=>{
          message.error(error.message);
        })
  }

  // 初始化流程图
  initFlow() {
    const { containerIdPreFix } = this.props;
    //console.log("getContainer", jsPlumb.getManagedElements());
    this.jsPlumbExhibition.ready(() => {
      // 设置绘图容器
      this.jsPlumbExhibition.setContainer(containerId + containerIdPreFix)
      // 可以使用importDefaults，来重写某些默认设置
      this.jsPlumbExhibition.importDefaults({
        ConnectionsDetachable: false, // 一般来说拖动创建的连接，可以再次拖动，让连接断开。如果不想触发这种行为，可以设置。
      })
      // 加载数据并绘制流程图
      this.loadDataAndPaint()
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
    this.jsPlumbExhibition.draggable(id, {
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
  addEndpoint(id, xname, yname, info) {
    const {dataSource: {elementInfos}} = this.state;
    console.log("addEndpoint-dataSource", info);
    let newCommonConfig = _.cloneDeep(commonConfig);
    newCommonConfig.connectorStyle.stroke = "red";
    /**
     * 如果想动态的生成Endpoint，就需要知道当前节点下级节点，已经方向，从而去创建相对应的节点
     */
    let anchors = '';
    if (xname === 'left') {
      anchors = 'Left';
    } else if (xname === 'right') {
      anchors = "Right";
    } else if (yname === 'top') {
      anchors = 'Top';
    } else if (yname === 'bottom') {
      anchors = 'Bottom'
    }
    let startFlow = elementInfos.find((item) => {
      return item.elementId === info.source.elementId;
    });
    let endFlow = elementInfos.find((item) => {
      return item.elementId === info.target.elementId;
    });
    if ( startFlow && endFlow ) {
      this.jsPlumbExhibition.addEndpoint(id, {anchors: anchors, uuid: `${id}-anchor-${xname}-${yname}`}, newCommonConfig)
    } else {
      this.jsPlumbExhibition.addEndpoint(id, {anchors: anchors, uuid: `${id}-anchor-${xname}-${yname}`}, commonConfig)
    }
  }

  /**
   * 设置各个节点的连线 connect
   * @param info
   */
  setConnection(info, index) {
    /**
     * connectionData数据
     */
    this.jsPlumbExhibition.connect({
      uuids: [this.getAnchorID(info.source, info), this.getAnchorID(info.target, info)],
      // source:info.source.elementId,
      // target:info.target.elementId,
      overlays: [
        [
          "Label", this.getLabelSetInfo(info.name || '', info.source.elementId, info.target.elementId, index)
        ]
      ]
    })
  }

  // 获取端点id
  getAnchorID(anchorInfo, info) {
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
    //const nodeInfo = this.getNodeInfo(document.getElementById(anchorInfo.elementId))
    //console.log("nodeInfo", nodeInfo);
    console.log("anchorInfo", anchorInfo);
    let posX = 0, posY = 0;
    this.reCreatorData.nodeData.forEach((item, index)=>{
      if(item.id === anchorInfo.elementId) {
        //console.log("item", item.x, item.y);
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
    this.addEndpoint(anchorInfo.elementId, posXName, posYName, info);
    return finalUidConnect;
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

  // 获取设置Label文本的配置信息
  /**
   * connectInputValue代表当前的获取模态框输入的值，也就是当前label的值，如果用户没有输入就默认不需要新建label,控制类名就可以了
   * @param labelText
   * @param sourceId
   * @param targetId
   * @returns {{cssClass: string, location: number, label: (*|string)}}
   */
  getLabelSetInfo(labelText, sourceId, targetId, index) {
    const { dataSource: { bpmnInfo : { designJson } } } = this.state;
    const designJsonObj = JSON.parse(designJson);
    //console.log("自由女神``````````", designJsonObj);
    const labelData = designJsonObj.connectionData[index];
    const labelTextRules = labelData.rules ? `<div>${labelData.rules}</div>` : "";
    const labelTextRulesLanguage = labelData.rulesLanguage === "activity" ? `<div>${labelData.rulesLanguage}</div>` : "";
    const labelInfos = `<div style="text-align: center"><div>${labelText}</div>${ labelTextRules }${ labelTextRulesLanguage }</div>`;
    return {
      label: labelInfos,
      cssClass: 'jtk-overlay-label',
      location: 0.4,
      // events: {
      //   click: (labelOverlay) => {
      //     alert("点我搞什么")
      //   }
      // }
    }
  }

  /**
   * 加载数据按钮执行逻辑
   * propsDataSource: 需要更新渲染的数据源，如果没有传递则是默认加载时候的数据源
   * styleObj: 用于调整了渲染页面数据样式的对象
   */
  // 加载数据并绘制流程图
  loadDataAndPaint() {
    //const { data4 , data4: { nodeData, connectionData } } = this.props;
    /**
     * 定义需要绑定的事件对象
     * @type {{onClick: *}}
     */
    const eventObj = {
      onClick: ()=>{}
    };

    /**
     * 实例化VirtualDOMHandle,如果不存在isSet变量，就执行初始化方法，否则就位新增方法
     * 在这里传入reverseRenderToJs，在类的内部进行判断，全局是否切换成反渲染模式
     */
    this.reCreatorData = new VirtualDOMExhibition(this.state.dataSource, eventObj);
    let nodeList = this.reCreatorData.init();
    this.setState(
        () => ({nodeList}),
        () => {
          this.reCreatorData.connectionData.forEach((info, index) => {
            this.setConnection(info, index)
          })
        }
    );
  }

  // DOM渲染
  render() {
    const { containerIdPreFix } = this.props;
    return (
        <div style={{ width: "100%", overflow: "scroll" }}>
          <div className={ "drawContainer" } id={containerId + containerIdPreFix}>
            <div style={{ fontSize: "18px", marginTop: "20px", marginLeft: "50px" }}>{ this.props.title }</div>
            {this.state.nodeList}
          </div>
        </div>
    )
  }
}
Index.defaultProps={
  config: {
    backstageCssMode: "relative" //由于是内嵌于后台，所以有左侧菜单和头部菜单，默认为relative会计算减去相应的偏移
  },
  requestUrlHashKey: "taskId" ,// 请求接口url哈希的key值
  title: "工作流程图",
  containerIdPreFix: "01", //默认绘图区域的id名称，这是修饰的前缀
};

Index.propTypes={
  id:PropTypes.number
};
