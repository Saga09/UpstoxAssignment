import * as actionType from '../actions/action-types';

const initialState = {
    data: {},
    intervel : 1,
    liveData :{}
};


const upstoxReducer = function (state = initialState, action) {
    switch (action.type) {
        case actionType.GET_DATA_SUCCESS:
            return Object.assign({}, state, {data: action.data});
        case actionType.GET_LIVE_DATA_SUCCESS:
                console.log("actionTypeintervel",state.intervel)
            return Object.assign({}, state, {liveData: action.data, intervel: (state.intervel + 1)});
    }

    return state
};

export default upstoxReducer;
