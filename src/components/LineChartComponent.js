import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';


class LineChart extends Component{
    // constructor(props) {
    //     super(props);
    //     //console.log(this.props.labels)
    
    // }
    render(){
        const chartConfig = {
            labels:this.props.labels,
            datasets:[{
                label: this.props.label,
                fontColor: "#ffffff",
                backgroundColor: this.props.backgroundColor,
                pointBackgroundColor: this.props.pointBackgroundColor,
                borderColor: this.props.borderColor,
                data:this.props.data
            }]
            }
        return( <Line  options= {
            {                
                responsive:true,
                legend: {
                    display: true,
                    labels: {
                        fontColor: '#ffffff',
                        fontSize: 20
                    }
                },
            
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#ffffff"
                        }
                    }],
                    
                    xAxes:[{ 
                        type:"time",
                        distribution: "linear",
                        time:{
                            displayFormats:{
                                millisecond: "mm:ss:SSS"
                            }
                        },
                       
                        ticks: {
                            
                            fontColor: "#ffffff",
                            
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Time",
                            fontColor: "#ffffff",
                            
                        }
                    }]}}
        }
            data= {chartConfig} ></Line>);
    }
}

export default LineChart