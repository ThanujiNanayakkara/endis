import React, {Component} from 'react';
import {Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, 
    Jumbotron, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label} from 'reactstrap';
import {NavLink} from 'react-router-dom';


class Header extends Component{

    constructor(props){
        super(props);
        this.state={
            isNavOpen: false,
        };
        this.toggleNav =this.toggleNav.bind(this);
    }

    toggleNav(){
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    render(){
        return(
            <React.Fragment>
                <Navbar light expand='md'>
                    <div className = 'container'>
                        <NavbarToggler onClick={this.toggleNav}/>
                            <NavbarBrand className="mr-auto" href="/"> 
                                <img src="assets/images/logo.png" height="60" width="80" alt="EnDis"></img>
                            </NavbarBrand>
                            <Collapse isOpen= {this.state.isNavOpen} navbar>
                                <Nav navbar>
                                            <NavItem>
                                                <NavLink className="nav-link" to="/home">
                                                    <span className="fa fa-home fa-lg"></span>Home
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink className="nav-link" to="/about">
                                                    <span className="fa fa-info fa-lg"></span>About Us
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink className="nav-link" to="/contact">
                                                    <span className="fa fa-address-card fa-lg"></span>Contact Us
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                            </Collapse>
                    </div>
                </Navbar>
                <Jumbotron>
                    <div className="container">
                        <div className="row row-header">
                            <div className="col-12 col-sm-12">
                                {/* <h1>Ristorante Con Fusion</h1> */}                               
                                <h1 className="text-center font-italic">This is EnDis</h1>
                                <p></p>
                                <h4>Join with us to make better Energy Decisions</h4>
                                <p></p>
                                <p>We provide all necessary means for equipping your home to have all relevant energy related data always centrally available for monitoring as well as for basic data analysis. Energy related data can now always be available at the tip of your hands</p>
                                {/* <p>We take inspiration from the World's best cuisines, and create a unique fusion experience. Our lipsmacking creations will tickle your culinary senses!</p>                             */}              
                                <p>We Help You Save Energy, Time, Increase Savings and Improve Sustainability. Simply login to begin ....</p>
                                
                            </div>                       
                        </div>
                    </div>
                </Jumbotron>
            </React.Fragment>
            
        );
    }
}

export default Header;