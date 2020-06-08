import React, {Component} from 'react';
import {Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, 
    Jumbotron, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label} from 'reactstrap';
import {NavLink} from 'react-router-dom';



class Header extends Component{

    constructor(props){
        super(props);
        this.state={
            isNavOpen: false,
            isModalLoginOpen: false,
            isModalSignUpOpen: false,
        };
        this.toggleNav= this.toggleNav.bind(this);
        this.toggleModalLogin= this.toggleModalLogin.bind(this);
        this.toggleModalSignUp= this.toggleModalSignUp.bind(this);
        this.handleLogin= this.handleLogin.bind(this);
        this.handleSignUp= this.handleSignUp.bind(this);
        this.handleLogout= this.handleLogout.bind(this);
        this.handleVerify= this.handleVerify.bind(this);
        // another method that can be followed, which saves us from doing it usig the arrow function
    }

    toggleNav(){
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    toggleModalLogin(){
        this.setState({
            isModalLoginOpen: !this.state.isModalLoginOpen
        });

    }

    toggleModalSignUp(){
        this.setState({
            isModalSignUpOpen: !this.state.isModalSignUpOpen
        });
        this.props.resetSignUpForm();

    }
    handleVerify(){
        this.props.productIdVerification(this.productid.value);
    }

    handleSignUp(event){
        this.toggleModalSignUp();
        this.props.signUpUser({username: this.username.value, password: this.password.value, productid:this.productid.value});
        event.preventDefault();
    }

    handleLogin(event){
        this.toggleModalLogin();
        this.props.loginUser({username: this.username.value, password: this.password.value});
        event.preventDefault();
    }

    handleLogout() {
        this.props.logoutUser();
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
                                    <PersonalData loggedIn={this.props.auth.isAuthenticated}/>   
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
                                        { !this.props.auth.isAuthenticated ?
                                            <div>
                                            <Button outline onClick={this.toggleModalLogin} style={{marginRight:10}}>
                                                <span className="fa fa-sign-in fa-lg"></span> Sign in
                                                {this.props.auth.isFetching ?
                                                    <span className="fa fa-spinner fa-pulse fa-fw"></span>
                                                    : null
                                                }
                                            </Button>
                                            <Button outline onClick={this.toggleModalSignUp}>
                                            <span className="fa fa-user-plus fa-lg"></span> Sign up
                                            {this.props.auth.isFetching ?
                                                <span className="fa fa-spinner fa-pulse fa-fw"></span>
                                                : null
                                            }
                                            </Button>
                                            </div>
                                            :
                                            <div>
                                            
                                            <Button outline onClick={this.handleLogout}>
                                                <span className="fa fa-sign-out fa-lg"></span> Logout
                                                {this.props.auth.isFetching ?
                                                    <span className="fa fa-spinner fa-pulse fa-fw"></span>
                                                    : null
                                                }
                                            </Button>
                                            </div>
                                        }
                                    </NavItem>
                                    {/* <NavItem>
                                        <Button outline onClick={this.toggleModal} style={{marginRight:10}}>
                                            <span className="fa fa-sign-in fa-lg"></span> Sign in
                                        </Button>
                                    </NavItem>
                                    <NavItem>
                                        <Button outline onClick={this.toggleModalSignUp}>
                                            <span className="fa fa-user-plus fa-lg"></span> Sign up
                                        </Button>
                                    </NavItem> */}
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
                <Modal isOpen = {this.state.isModalLoginOpen} toggle={this.toggleModalLogin}>
                    <ModalHeader toggle={this.toggleModalLogin}>Login</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <Label htmlFor="username">Email</Label>
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
                <Modal isOpen = {this.state.isModalSignUpOpen} toggle={this.toggleModalSignUp}>
                    <ModalHeader toggle={this.toggleModalSignUp}>Sign Up</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSignUp}>
                            <FormGroup >
                                <Label htmlFor="productid">Product ID</Label>
                                <Input type="text" id="productid" name="productid" disabled={this.props.product.isVerified}
                                innerRef = {(input) => this.productid = input} /> 
                            </FormGroup>
                            <Button className="primary" disabled={this.props.product.isVerified}
                             onClick={this.handleVerify}>Verify</Button> 
                             {/* <FormGroup>
                                <p visible={this.props.product.isVerified}>Product Verification Successful...</p> 
                            </FormGroup> */}
                            <FormGroup >
                                <Label htmlFor="firstname">Firstname</Label>
                                <Input type="text" id="firstname" name="firstname" disabled={!this.props.product.isVerified}
                                innerRef = {(input) => this.firstname = input} />       
                            </FormGroup>
                            <FormGroup >
                                <Label htmlFor="lastname">Lastname</Label>
                                <Input type="text" id="lastname" name="lastname" disabled={!this.props.product.isVerified}
                                innerRef = {(input) => this.lastname = input} />       
                            </FormGroup>
                            
                            <FormGroup>
                                <Label htmlFor="username">Email</Label>
                                <Input type="text" id="username" name="username" disabled={!this.props.product.isVerified}
                                innerRef = {(input) => this.username = input} />       
                            </FormGroup>
                            <FormGroup >
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"  disabled={!this.props.product.isVerified}
                                innerRef = {(input) => this.password = input} />       
                            </FormGroup>
                            <Button type="submit" value="submit" className="primary" disabled={!this.props.product.isVerified}>Sign Up</Button>

                        </Form>
                </ModalBody>
                </Modal>
                
            </React.Fragment>
            
        );
    }
}



export default Header;