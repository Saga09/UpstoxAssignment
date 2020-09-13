import {combineReducers} from 'redux';

import upstoxReducer from './upstox-reducer'

let reducers = combineReducers({
    upstoxState: upstoxReducer
});

export default reducers
