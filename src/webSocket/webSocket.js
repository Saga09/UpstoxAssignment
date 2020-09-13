import React from 'react';
//import Websocket from 'react-websocket';

import FusionCharts from "fusioncharts";
import TimeSeries from "fusioncharts/fusioncharts.timeseries";
import ReactFC from "react-fusioncharts";
import connect from "react-redux/es/connect/connect";
import * as upstoxAction from "../actions/upstox-actions";


ReactFC.fcRoot(FusionCharts, TimeSeries);


const jsonify = res => res.json();

const schemaFetch = fetch(
    "https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/ohlc-chart-schema.json"
).then(jsonify);

const dataSource = {
    chart: {},
    caption: {
        text: "UPSTOX Composite Live Index"
    },
    subcaption: {
        text: "From 2005 -  2014"
    },
    yaxis: [
        {
            plot: [
                {
                    value: {
                        open: "Open",
                        high: "High",
                        low: "Low",
                        close: "Close"
                    },
                    type: "ohlc"
                }
            ],
            title: "Index Value"
        }
    ]
};


class WebSocket extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            data: [],
            timeseriesDs: {
                type: "timeseries",
                renderAt: "container",
                width: "100%",
                height: "500",
                dataSource
            }
        };
        this.onFetchData = this.onFetchData.bind(this);
    }

    intervalID;
   
    componentWillReceiveProps(nextProps)
    {
        this.onFetchData(nextProps.data);
   }
    componentDidMount()
    {
        let data = this.props.data
        this.onFetchData(data);
        this.props.dispatch(upstoxAction.frequitlyFetchData(this.props.intervel))


    }
    onFetchData(fetchedData) {

        let data = this.getDataArrayToObject(fetchedData);
        let ohclData = this.convertToOHLC(data)

        Promise.all([ohclData, schemaFetch]).then(res => {
            let newdata = res[0];
            let newschema = res[1];
            const fusionTable = new FusionCharts.DataStore().createDataTable(
                newdata,
                newschema
            );

            const timeseriesDs = Object.assign({}, this.state.timeseriesDs);

            timeseriesDs.dataSource.data = fusionTable;
            this.setState({
                timeseriesDs
            });
        });
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }


    getDataArrayToObject(data)
    {
        let responseXml = [];
        for (let i in data)
        {
            let str = data[i];
            let newData = str.split(",");
            let newDataObject = {
                timestamp : newData[0],
                open: newData[1],
                high: newData[2],
                low: newData[3],
                close: newData[4],
                volume: newData[5],
            };
            responseXml.push(newDataObject)
        }
        return responseXml;

    }


    timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = year + '-' + month + '-' + date ;
        return time;
    }

    convertToOHLC(data)
    {

        let responseXml = [];

        for (let i in data)
        {
            let time = this.timeConverter(data[i]["timestamp"] / 1000);
            responseXml[i] = [
                time,
                Number(data[i]["open"]),
                Number(data[i]["high"]),
                Number(data[i]["low"]),
                Number(data[i]["close"]),
                Number(data[i]["volume"])
            ]
        }
        return responseXml;
    };

    render()
    {
        return (
            <div className="App">
                    <h1 className="page--title">UPSTOX LIVE CHART</h1>
                    {
                        this.state.timeseriesDs.dataSource.data ? (
                        <ReactFC {...this.state.timeseriesDs} />
                    ) : (
                        "loading"
                    )}

            </div>

        )
    }
}


const mapStateToProps = function (store) {
    return {
        data: store.upstoxState.liveData,
        intervel : store.upstoxState.intervel
    }
}

export default connect(mapStateToProps)(WebSocket);
