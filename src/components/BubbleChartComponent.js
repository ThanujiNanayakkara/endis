import React, {Component} from 'react';
import { Bubble} from 'react-chartjs-2';


class BubbleChart extends Component{
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
                borderWidth: 5,
                data:this.props.data
            }]
            }
        return( <Bubble options= {
            {
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
                            //beginAtZero: true,
                            min:1,
                            max:30,
                            fontColor: "#ffffff",
                            stepSize:1
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Day",
                            fontColor: "#ffffff",
                        }
                    }]}}
        } data={chartConfig}></Bubble>);
    }
}

export default BubbleChart