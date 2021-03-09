import React, {Component} from 'react';
// import {Breadcrumb, BreadcrumbItem} from 'reactstrap';
// import {Link} from 'react-router-dom';
//import {Carousel} from 'react-bootstrap';

class Contact extends Component{


    render(){
        return(
            <div className="contact">
                <div className="row justify-content-center">
                    <div className="col-12 text-center">
                        <h2>Contact Us</h2><br></br>
                        <p>If you have any doubts regarding the product, please don't be hesitant to contact us.</p>
                    </div>
                </div>
                <br></br>

                <div className="row justify-content-center">
                    <a className="footer-links col-md-3 col-12 d-flex justify-content-center mt-5" href="tel:+85212345678">
                        <div className="card card-contact">
                            <img className="card-img-top " src="assets/images/phone_white.png" alt="Card image" />
                            <div className="card-body text-center">
                                <p>+94711608162</p>
                            </div>
                        </div>
                    </a>
                    <a className="footer-links col-md-3 col-12 d-flex justify-content-center mt-5" href="mailto:confusion@food.net" >
                        <div className="card card-contact">
                            <img className="card-img-top " src="assets/images/email_white.png" alt="Card image" />
                            <div className="card-body text-center">
                            <p>endis@gmail.com</p>
                            </div>
                        </div>
                    </a>
                    <a className="footer-links col-md-3 col-12 d-flex justify-content-center mt-5" href="https://g.page/moratuwauni?share">
                        <div className="card card-contact">
                            <img className="card-img-top " src="assets/images/location_white.png" alt="Card image" />
                            <div className="card-body text-center">
                                <p>University of Moratuwa<br />
                                Katubedda, Moratuwa<br />
                                Sri Lanka<br />
                                </p>
                            </div>
                        </div>
                    </a>
                </div>
                <br></br>
                <div className="row d-flex justify-content-center">
                    <div className="col-2 d-flex justify-content-center">
                        <a className="btn btn-social-icon btn-google" href="http://google.com/+"><i className="fa fa-google-plus"></i></a>
                    </div>
                    <div className="col-2 d-flex justify-content-center">
                        <a className="btn btn-social-icon btn-facebook" href="http://www.facebook.com/profile.php?id="><i className="fa fa-facebook"></i></a>
                    </div>
                    <div className="col-2 d-flex justify-content-center">
                        <a className="btn btn-social-icon btn-twitter" href="http://twitter.com/"><i className="fa fa-twitter"></i></a>
                    </div>
                    <div className="col-2 d-flex justify-content-center">
                        <a className="btn btn-social-icon btn-google" href="http://youtube.com/"><i className="fa fa-youtube"></i></a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Contact;