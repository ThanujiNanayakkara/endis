import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button,  Label,  Col, Row} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Carousel} from 'react-bootstrap';

class Contact extends Component{


    render(){
        return(
            
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to= '/home'>Home</Link ></BreadcrumbItem>
                        <BreadcrumbItem active>Contact Us</BreadcrumbItem>
                    </Breadcrumb>  
                </div>
                {/* <Carousel className="align-center" >
                        <Carousel.Item>
                        <img
                            className="d-block w- 70 h-50"
                            src="assets/images/mailbox.jpg"
                            alt="First slide"
                            style={{height : 50}}
                            />
                            <Carousel.Caption>
                                <div className="col-12 col-sm-4 offset-sm-1">
                                    <h5>Our Address</h5>
                                    <address>
                                    University of Moratuwa<br />
                                    ,Moratuwa<br />
                                    Sri Lanka<br />
                                    <i className="fa fa-phone"></i>: +94711608162<br />
                                    <i className="fa fa-fax"></i>: +94716853273<br />
                                    <i className="fa fa-envelope"></i>: <a href="mailto:confusion@food.net">endis@gmail.com</a>
                                    </address>
                                </div>
                            </Carousel.Caption>       
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-70 h-50"
                                src="assets/images/social.png"
                                alt="First slide"
                                style={{height : 50}}
                                />
                            <Carousel.Caption>
                                <div className="col-12 col-sm-11 offset-sm-1">
                                    <div className="btn-group" role="group">
                                        <a role="button" className="btn btn-primary" href="tel:+85212345678"><i className="fa fa-phone"></i> Call</a>
                                        <a role="button" className="btn btn-info" href="skype:echo123?call">><i className="fa fa-skype"></i> Skype</a>
                                        <a role="button" className="btn btn-success" href="mailto:confusion@food.net"><i className="fa fa-envelope-o"></i> Email</a>
                                    </div>
                                </div>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel> */}
                <div className="row row-content">
                    <div className="col-12">
                    <h3>Location Information</h3>
                    </div>
                    <div className="col-12 col-sm-4 offset-sm-1">
                            <h5>Our Address</h5>
                            <address>
                            University of Moratuwa<br />
                            Katubedda, Moratuwa<br />
                            Sri Lanka<br />
                            <i className="fa fa-phone"></i>: +94711608162<br />
                            <i className="fa fa-fax"></i>: +94716853273<br />
                            <i className="fa fa-envelope"></i>: <a href="mailto:confusion@food.net">endis@gmail.com</a>
                            </address>
                    </div>
                    <div className="col-12 col-sm-6 offset-sm-1">
                        <h5>Map of our Location</h5>
                    </div>
                    <div className="col-12 col-sm-11 offset-sm-1">
                        <div className="btn-group" role="group">
                            <a role="button" className="btn btn-primary" href="tel:+85212345678"><i className="fa fa-phone"></i> Call</a>
                            <a role="button" className="btn btn-info" href="skype:echo123?call">><i className="fa fa-skype"></i> Skype</a>
                            <a role="button" className="btn btn-success" href="mailto:confusion@food.net"><i className="fa fa-envelope-o"></i> Email</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Contact;