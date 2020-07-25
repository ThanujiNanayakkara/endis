//whole thing is new
import React, {Component} from 'react';
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Graph extends Component {	

    constructor(props) {
        super(props);
    
	}
    render() {
        const options = {
			theme: "light1",
			animationEnabled: true,
			zoomEnabled: true,
			title: {
				text: "Electricity Monitor"
			},
			axisY: {
				includeZero: false
			},
			data: [{
				type: "area",
                dataPoints: this.props.data
       	}]
        }      
     return (
          <CanvasJSChart options = {options}/>
      );
    }
  }

  export default Graph