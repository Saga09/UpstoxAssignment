import React from 'react';

import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
import HomePage from './webSocket/home'
import WebSocket from './webSocket/webSocket'
import Header from './webSocket/header'
import './App.css';

import {connect} from 'react-redux';
import * as action from './actions/upstox-actions'
import * as upstoxAction from './actions/upstox-actions';



class App extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            name: '',
            price: '',
            date: ''
        };

    }
    componentDidMount(){
       // this.props.dispatch(action.getAuthenticationStatus())
        this.props.dispatch(upstoxAction.fetchData(this.props.intervel))

        console.log('data ', this.props.data);
    }


    render()
    {
        return (
            <div className="App">
                <div className="container">
                    <HashRouter>
                        <Header />
                        <Switch>
                            <Route path="/home:activeTab?" component={HomePage}/>
                            <Route path="/liveChart:activeTab?" component={WebSocket}/>
                            <Redirect to="/home"/>
                        </Switch>
                    </HashRouter>
                </div>
            </div>
        )
    }
}

const mapStateToProps = function (store) {
    return {
        data: store.upstoxState.data
    }
}

export default connect(mapStateToProps)(App);
