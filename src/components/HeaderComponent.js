import React, {Component} from 'react';
import {Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, 
    Jumbotron, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label} from 'reactstrap';
import {NavLink} from 'react-router-dom';
import Dashboard from './DashboardComponent';


class Header extends Component{

    constructor(props){
        super(props);
        this.state={
            isNavOpen: false,
            isModalOpen: false
        };
        this.toggleNav= this.toggleNav.bind(this);
        this.toggleModal= this.toggleModal.bind(this);
        this.handleLogin= this.handleLogin.bind(this);
        // another method that can be followed, which saves us from doing it usig the arrow function
    }

    toggleNav(){
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });

    }

    handleLogin(event){
        this.toggleModal();
        alert("Username: " + this.username.value + " Password: "+ this.password.value + 
            " Remember: " + this.remember.checked);
        event.preventDefault();
    }
    render(){

        const PersonalData = ({ loggedIn}) => {
            if (!loggedIn) return null;
          
            return (
                <NavItem >
                    <NavLink className="nav-link" to="/dashboard">
                        <span className="fa fa-line-chart fa-lg"></span>Dashboard
                    </NavLink>
                </NavItem>
            );
          };

        return(
            <React.Fragment>
                <Navbar light expand='md' fixed="top" color="white">
                    <div className = 'container'>
                        <NavbarToggler onClick={this.toggleNav}/>
                            <NavbarBrand className="mr-auto" href="/"> 
                                <img src="assets/images/logo.png" height="80" width="80" alt="EnDis"></img>
                            </NavbarBrand>
                            <Collapse isOpen= {this.state.isNavOpen} navbar>
                                <Nav navbar>
                                            
                                    <NavItem>
                                        <NavLink className="nav-link" to="/home">
                                            <span className="fa fa-home fa-lg"></span>Home
                                        </NavLink>
                                    </NavItem>
                                    <PersonalData loggedIn={true}/>
                                    
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
                                <Nav className="ml-auto" navbar>
                                    <NavItem>
                                        <Button outline onClick={this.toggleModal} style={{marginRight:10}}>
                                            <span className="fa fa-sign-in fa-lg"></span> Sign in
                                        </Button>
                                    </NavItem>
                                    <NavItem>
                                        <Button outline onClick={this.toggleModal}>
                                            <span className="fa fa-user-plus fa-lg"></span> Sign up
                                        </Button>
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
                                {/* <h1 className="text-center font-italic">This is EnDis</h1> */}
                                <p></p>
                                <h4>Join with us to make better Energy Decisions</h4>
                                <p></p>
                                <p>We provide all necessary means for equipping your home to have all relevant energy related data always centrally available for monitoring as well as for basic data analysis. Energy related data can now always be available at the tip of your hands</p>
                                {/* <p>We take inspiration from the World's best cuisines, and create a unique fusion experience. Our lipsmacking creations will tickle your culinary senses!</p>                             */}              
                                <p>We Help You Save Energy, Time, Increase Savings and Improve Sustainability. Simply sign up to begin ....</p>        
                            </div>                       
                        </div>
                    </div>
                </Jumbotron>
                <Modal isOpen = {this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username"
                                innerRef = {(input) => this.username = input} />       
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password" 
                                innerRef = {(input) => this.password = input} />       
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input type="checkbox" name="remember" 
                                    innerRef = {(input) => this.remember = input} />
                                    Remember me
                                </Label>
                            </FormGroup>
                            <Button type="submit" value="submit" className="primary">Login</Button>
                        </Form>

                    </ModalBody>

                </Modal>
            </React.Fragment>
            
        );
    }
}



export default Header;