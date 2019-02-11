import React,{ Component } from "react";
import { proConfig } from "@/common/config";
import AceEditor from 'react-ace';
import {
    Input,
    Select,
    Modal,
    Button
} from "antd";

const { Option } = Select;
/**
 * 加载全部的react-ace语言及主体条件
 */
proConfig.languages.forEach(lang => {
    require(`brace/mode/${lang}`);
    require(`brace/snippets/${lang}`);
});
proConfig.themes.forEach(theme => {
    require(`brace/theme/${theme}`);
});

/**
 * 公共组件: 连线、服务任务节点等规则编辑器input
 * @returns {function(*): HocInputRules}
 * @constructor
 */
function HocInputRules (){
    return function(WrappedComponent) {
        return class HocInputRules extends Component {
            constructor(props){
                super(props);
                this.state = {
                    rules: false
                };
                this.onFocusRulesInput = this.onFocusRulesInput.bind(this);
                this.rulesModalOk = this.rulesModalOk.bind(this);
                this.rulesModalCancel = this.rulesModalCancel.bind(this);
                this.onRef = this.onRef.bind(this);
                console.log("高阶组件-公共规则表达式编辑器input", this.props)
            }
            /**
             * input focus事件
             **/
            onFocusRulesInput() {
                this.child.blur(); // 子input进行失焦
                this.setState(()=>({
                    rules: true
                }))
            }
            /**
             * 规则编辑器modal框确定按钮回调
             **/
            rulesModalOk (){
                this.setState(()=>({
                    rules: false, // 关闭编辑modal框
                }))
            }
            /**
             * 规则编辑器modal框取消按钮回调
             **/
            rulesModalCancel(){
                this.setState(()=>({
                    rules: false, // 关闭编辑modal框
                }))
            }
            /**
             * 用于获取子组件input实例，从而在获取焦点的时候进行失焦操作
             * @param ref
             */
            onRef(ref) {
               this.child = ref;
            }
            render() {
                const { placeholder,readOnly, modalTitle, selectValue, rules, onChangeLanguage, onChangeEditValue } = this.props;
                /**
                 * 针对input组件传递的属性
                 * @type {{readOnly: HocInputRules.props.readOnly, placeholder: HocInputRules.props.placeholder, value: HocInputRules.props.value, onFocus: HocInputRules.onFocusRulesInput}}
                 */
                const inputProps = {
                    placeholder,
                    value: rules,
                    readOnly,
                    onFocus: this.onFocusRulesInput,
                };
                return (<div>
                    <WrappedComponent inputProps={inputProps} onRef={this.onRef}/>
                    <Modal
                        title={ modalTitle }
                        width="60%"
                        visible={this.state.rules}
                        onOk={this.rulesModalOk}
                        onCancel={this.rulesModalCancel}
                        footer={[
                            <Button type="primary" onClick={ this.rulesModalOk }>
                                确定
                            </Button>,
                        ]}
                    >
                        <div className="item-container">
                            <div className="item-title">规则语言选择:</div>
                            <Select
                                style={{ marginBottom: "15px" }}
                                value={ selectValue }
                                onChange={ onChangeLanguage }
                            >
                                <Option value="activiti">activiti</Option>
                                <Option value="drools">drools</Option>
                                <Option value="groovy">groovy</Option>
                                <Option value="javascript">javascript</Option>
                            </Select>
                            <AceEditor
                                width="100%"
                                value={ rules }
                                mode= { selectValue }
                                theme="monokai"
                                onChange={ onChangeEditValue }
                                name="UNIQUE_ID_OF_DIV"
                            />
                        </div>
                    </Modal>
                </div>)
            }
        }
    }
}

export default HocInputRules;