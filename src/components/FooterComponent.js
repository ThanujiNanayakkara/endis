import React, {Component} from 'react';
import {Link} from 'react-router-dom';
// import {Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, 
//     Jumbotron, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label} from 'reactstrap';
// import {NavLink} from 'react-router-dom';


class Footer extends Component{
    render(){
        return(
            <div className="row justify-content-center footer">             
                <div className="col-4 text-center">
                    <Link className="footer-links" to="/home">Home</Link>
                </div>

                <div className="col-4 text-center">
                    <Link className="footer-links" to="/about">About us</Link>
                </div>

                <div className="col-4 text-center">
                    <Link className="footer-links" to="/contact">Contact us</Link>
                </div>
            </div>
        );
    }
}
export default Footer;