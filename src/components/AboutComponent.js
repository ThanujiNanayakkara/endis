import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';
import {Link} from 'react-router-dom';

class About extends Component{


    render(){
        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to= '/home'>Home</Link ></BreadcrumbItem>
                        <BreadcrumbItem active>About Us</BreadcrumbItem>
                    </Breadcrumb>  
                </div>
                About Us
            </div>
        );
    }
}

export default About;
