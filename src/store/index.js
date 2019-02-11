import { createStore, compose, applyMiddleware } from 'redux'; // compose就是包装函数，可以依次传入多种方法并且依次执行
import thunk from "redux-thunk";
import { reducer, reducerReverse } from "./reducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
    applyMiddleware(thunk)
));

const storeReverse = createStore(reducerReverse, composeEnhancers(
    applyMiddleware(thunk)
));
export { store, storeReverse};

