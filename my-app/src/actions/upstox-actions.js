import * as actionTypes from './action-types'
import store from "../store"

export function receivedData(data)
{
    return {
        type: actionTypes.GET_DATA_SUCCESS,
        data: data
    }

}

export function getAuthenticationStatus()
{
    return (dispatch, getState) => {
        const url = 'https://jsonplaceholder.typicode.com/todos/1';

        fetch(url)
            .then((response) =>
                response.json().then(function(data) {
                   dispatch(receivedData(data));
                })
            )
    }
}


export  function fetchData(intervel)
{
    return (dispatch, getState) => {
        let newUrl = 'http://kaboom.rksv.net/api/historical?interval='+intervel;
        console.log("newUrl",newUrl);
         fetch(newUrl)
             .then((response) =>
                 response.json().then(function(data) {
                     dispatch(receivedData(data));
                 })
             )
    }
}


export  function frequitlyFetchData(intervel)
{
    return (dispatch, getState) => {
        let newUrl = 'http://kaboom.rksv.net/api/historical?interval='+intervel;
        console.log("newUrl",newUrl);
        fetch(newUrl)
            .then((response) =>
                response.json().then(function(data) {
                    dispatch(receivedLiveData(data));
                    frequitlyFetchDataContinue(intervel+1)
                })
            )
    }
}


export  function frequitlyFetchDataContinue(intervel)
{

        let newUrl = 'http://kaboom.rksv.net/api/historical?interval='+intervel;
        console.log("frequitlyFetchDataContinue",newUrl);
        fetch(newUrl)
            .then((response) =>
                response.json().then(function(data) {
                    store.dispatch(receivedLiveData(data));
                    setTimeout(function() {
                        store.dispatch(frequitlyFetchData(intervel+1))
                    }, 5000);
                })
            )

}


export function receivedLiveData(data)
{
    return {
        type: actionTypes.GET_LIVE_DATA_SUCCESS,
        data: data
    }

}