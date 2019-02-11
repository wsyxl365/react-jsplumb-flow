import * as actionTypes from './constants';
export const buttonFocus = (markName) => ({
    type: actionTypes.BUTTON_FOCUS,
    dataItem: markName
})

// export const setNodelistData = (nodeList) => ({
//     type: actionTypes.SET_NODE_LIST,
//     dataItem: nodeList
// })