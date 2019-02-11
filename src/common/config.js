/**
 * 定义全局config文件
 * @type {{themes: string[], languages: string[]}}
 */
export const proConfig = {
    languages : [
        'javascript',
        'java',
        'python',
        'xml',
        'ruby',
        'sass',
        'markdown',
        'mysql',
        'json',
        'html',
        'handlebars',
        'golang',
        'csharp',
        'elixir',
        'typescript',
        'css',
        'drools',
        'groovy'
    ],
    themes : [
        'monokai',
        'github',
        'tomorrow',
        'kuroir',
        'twilight',
        'xcode',
        'textmate',
        'solarized_dark',
        'solarized_light',
        'terminal',
    ],
    nodeFlowType : {
        start: "startEvent", //开始节点
        userTask: "userTask", //用户任务节点
        serviceTask: "serviceTask", //用户任务节点
        exclusiveGateway: "exclusiveGateway", //属于sequenceFlow---只是用作页面判断-路由排他网关节点
        parallelGateway: "parallelGateway", //属于sequenceFlow---只是用作页面判断-路由并行网关节点
        inclusiveGateway: "inclusiveGateway",//属于sequenceFlow---只是用作页面判断-路由包容网关节点
        end: "endEvent", //结束节点
        connectionLine: "sequenceFlow", //连接线
        connectionLineNormal: "sequenceFlowNormal", //连接线-并行网关、普通连线，代表不需要配置规则
        poolsOrientation: "poolsOrientation", // 横向泳池
        poolsDirection: "poolsDirection", // 纵向泳池
        poolLaneOrientation: "poolLaneOrientation", // 横向泳道
        poolLaneDirection: "poolLaneDirection", // 纵向泳道
    },
    bankFormListUrl: "/bank/form/list", // 节点配置表单列表接口
    //bankFormListUrl: "http://192.168.3.217:8090/bank/form/list",
    renderFormUrl: "http://192.168.3.128:3000/#/renderForm/",
    //saveWorkFlowUrl: "http://192.168.3.217:8090/bank/bpmn/save", //保存工作流信息到后台接口
    saveWorkFlowUrl: "/bank/bpmn/save", //保存工作流信息到后台接口
    reverseWorkFlowUrl: "/bank/bpmn/get", // 反渲染请求数据接口
    candidateUsersPageList: "/user/pagedlist", // 用户任务节点users分页请求
    candidateGroupsPageList: "/role/pagedlist", // 用户组任务节点groups分页请求
    connectionCircleRadius: 4,
    dataSource: {
        "bpmnAttr": {
            bpmnName: "",
            bpmnDescription: "",
            processBean: ""
        }, //全局表单属性数组
        "nodeData": [],
        "connectionData": []
    },
    pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12
    },
    ipAddress: "http://192.168.3.128:8090",
    interfaceToken: "b4f6c84c-c5c2-45b2-bbd0-1795401206ff"
    //ipAddress: "localhost"
};