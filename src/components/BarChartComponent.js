import React, {Component} from 'react';
import { Bar} from 'react-chartjs-2';


class BarChart extends Component{
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
        return( <Bar options= {
            {   layout:{
                padding:{
                    left:10,
                    right:10,
                    top: 10,
                    bottom:10
                }
            },
                legend: {
                    display: true,
                    labels: {
                        fontColor: '#ffffff',
                        fontSize: 20
                    }
                },scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#ffffff"
                        }
                    }],
                    xAxes:[{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#ffffff"
                        }
                    }]}}
        } data={chartConfig}></Bar>);
    }
}

export default BarChart