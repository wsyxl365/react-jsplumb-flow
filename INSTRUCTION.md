# react-jsplumb-flow

在React中使用jsPlumb.js绘制流程图.

# 组件说明

## ServiceTaskRuleInputEdit
1.用于拖拽右侧属性设置里面专门设置规则的组件，包括了idea的功能，集成了react-ace第三方插件.<br/>
2.使用了高阶组件HocInputRules包装，这样可以传递不同类型的组件进行包装，比较灵活。<br/>
3.props介绍:<br/>
(1).placeholder 设置input的placeholder属性。<br/>
(2).rules 设置编辑器书写的表达式最终的值。<br/>
(3).selectValue modal框中可以选择的语言类型，包括:activity、drools、groovy、java。<br/>
(4).onChangeLanguage 选择语言类型回调事件<br/>
(5).onChangeEditValue 编辑器书写内容改变的回调事件<br/>
(6).modalTitle modal框的标题<br/>
(7).readOnly input框只读属性<br/>

# 运行渲染说明

## 右侧属性值如何获取
1.左侧节点栏可以对已渲染的节点组件进行拖拽，当拖拽至绘图容器中后，
会在回调事件handleDropDown中拿到拖拽组件的数据dropInfo;
2.执行createNewNode事件创建虚拟dom，并且把拖拽组件信息dropInfo传入处理;
3.实例化VirtualDOMHandle虚拟dom类，进行相关操作...
4.点击页面节点会触发已经绑定的handleDomClick回调事件,并且会设置全局的property对象值;然而右侧的属性设置栏是靠
全局的property对象驱动的，当点击之后就会根据property对象里面的id去渲染不同的组件。

//  "babel": {
//    "plugins": [
//      [
//        "@babel/plugin-proposal-decorators",
//        {
//          "legacy": true
//        }
//      ]
//    ],
//    "presets": [
//      "@babel/react",
//      ["@babel/preset-env", {
//        "targets": {
//          "browsers": ["last 2 versions"]
//        }
//      }]
//    ]
//  },

externals和libraryTarget的关系
libraryTarget配置如何暴露 library。如果不设置library,那这个library就不暴露。就相当于一个自执行函数

externals是决定的是以哪种模式去加载所引入的额外的包

libraryTarget决定了你的library运行在哪个环境，哪个环境也就决定了你哪种模式去加载所引入的额外的包。也就是说，externals应该和libraryTarget保持一致。library运行在浏览器中的，你设置externals的模式为commonjs，那代码肯定就运行不了了。

如果是应用程序开发，一般是运行在浏览器环境libraryTarget可以不设置，externals默认的模式是global，也就是以全局变量的模式加载所引入外部的库。
