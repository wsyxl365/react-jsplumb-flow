import { actionCreators as actionCreatorsGlobal } from "@/storeGlobal";
import { actionCreators as actionCreatorsGlobalReverse } from "@/storeGlobalReverse";

const mapStateToProps = (state, props) => {
    if( props.mode && props.mode === "reverse" ) {
        return {
            data4: state.getIn(['globalReverse', 'data4']).toJS(),
        }
    } else {
        return {
            data4: state.getIn(['global', 'data4']).toJS(),
        }
    }
}

const mapDispatchToProps = ( dispatch, props) => {
    if( props.mode && props.mode === "reverse" ) {
        return {
            handleSetReRender(reRender){
                const action = actionCreatorsGlobalReverse.setReRender(reRender);
                dispatch(action);
            },
            setDataSource(dataSource){
                const action = actionCreatorsGlobalReverse.setDataSource(dataSource);
                dispatch(action);
            },
        }
    } else {
        return {
            handleSetReRender(reRender){
                const action = actionCreatorsGlobal.setReRender(reRender);
                dispatch(action);
            },
            setDataSource(dataSource){
                const action = actionCreatorsGlobal.setDataSource(dataSource);
                dispatch(action);
            },
        }
    }

};

export { mapStateToProps, mapDispatchToProps }