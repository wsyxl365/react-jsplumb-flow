/**
 * 收集reducer
 **/

import { combineReducers } from "redux-immutable";

/**
 * 正向渲染Reducer
 */
import { reducer as toolReducer } from "../storeTool";
import { reducer as dataGlobal } from "../storeGlobal";
import { reducer as propertyReducer } from "../storeProperty";


/**
 * 反向渲染Reducer
 */
import { reducer as dataGlobalReverse } from "../storeGlobalReverse";
import { reducer as propertyReducerReverse } from "../storePropertyReverse";
import { reducer as toolReducerReverse } from "../storeToolReverse";

//redux-immutable
const reducer = combineReducers({
    tool: toolReducer,
    global: dataGlobal,
    property: propertyReducer,
})

const reducerReverse = combineReducers({
    toolReverse: toolReducerReverse,
    globalReverse: dataGlobalReverse,
    propertyReverse: propertyReducerReverse
})

export { reducer, reducerReverse };

