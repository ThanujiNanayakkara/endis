import React, {Component} from 'react';
import {Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, 
    Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label} from 'reactstrap';
import {NavLink} from 'react-router-dom';
import {  firestore } from '../firebase/firebase';
// const firebase = require("firebase");
// // Required for side-effects
// require("firebase/functions");

class Header extends Component{

    constructor(props){
        super(props);
        this.state={
            isNavOpen: false,
            isModalLoginOpen: false,
            isModalSignUpOpen: false,
            isVerified:false,
            productDocId: ""

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
                isModalSignUpOpen: !this.state.isModalSignUpOpen,
                isVerified: false,
            });
        }

    handleVerify(){
        var productsRef = firestore.collection("issuedProducts");
         productsRef.where("productId", "==", this.productid.value).where("active", "==", false)
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty){
                    this.setState({
                        isVerified: !this.state.isVerified
                    });
                    alert("Device verification is successful. Proceed to Sign Up");
                    this.setState({
                        productDocId: querySnapshot.docs[0].id,
                    }); 
                    localStorage.setItem("productDocId",this.state.productDocId);
             
                }
                else{
                    alert("Not a valid device");
                }
            })
            .catch(error => console.log("Error"));
     
    }


    handleSignUp(event){
        event.preventDefault();
        this.toggleModalSignUp();
        //this.props.signUpUser({username: this.username.value, password: this.password.value, docId:this.state.productDocId});
        this.props.signUpUser({username: this.username.value, password: this.password.value});
        // var addMessage = firebase.functions().httpsCallable('addMessage');
        // addMessage({text: "messageText"}).then(function(result) {
        // // Read result of the Cloud Function.
        // //var sanitizedMessage = result.data.text;
        //     // ...
        // });
       
             
    }


    handleLogin(event){
        event.preventDefault();
        this.toggleModalLogin();
        this.props.loginUser({username: this.username.value, password: this.password.value});
        
    }

    handleLogout() {
        this.props.logoutUser();
        
    }

    componentDidUpdate(){
        
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
                    <Navbar className="header navbar-expand navbar-dark" style={{zIndex:10}}>
                            <div className = 'container' >
                                <NavbarToggler onClick={this.toggleNav}/>
                                <NavbarBrand href="/home"    style={{position: 'absolute',  left: '0%'}}> 
                                    <img src="assets/images/logo_white.png" width="15%" alt="EnDis"></img>
                                </NavbarBrand>
                                <Collapse navbar isOpen={this.state.isNavOpen} style={{position: 'absolute',  right: '2%', bottom:'20%'}}>
                                    <Nav>
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
                                                    <Button outline onClick={this.handleLogout} style={{marginRight:10}}>
                                                        <span className="fa fa-sign-out fa-lg"></span> Logout
                                                        {this.props.auth.isFetching ?
                                                            <span className="fa fa-spinner fa-pulse fa-fw"></span>
                                                            : null
                                                        }
                                                    </Button>
                                                    <Button outline>
                                                        <NavLink className="nav-link" to="/dashboard">
                                                            <span className="fa fa-line-chart fa-lg"></span> Dashboard
                                                        </NavLink>
                                                    </Button>
                                                </div>
                                            }
                                        </NavItem>
                                    </Nav>
                                </Collapse>
                                
                            </div>
                    </Navbar>

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
                                <FormGroup>
                                    <Label htmlFor="username">Email</Label>
                                    <Input type="text" id="username" name="username" 
                                    innerRef = {(input) => this.username = input} />       
                                </FormGroup>
                                <FormGroup >
                                    <Label htmlFor="password">Password</Label>
                                    <Input type="password" id="password" name="password"  
                                    innerRef = {(input) => this.password = input} />       
                                </FormGroup>
                                <Button type="submit" value="submit" className="primary" >Sign Up</Button>
                            </Form>
                        </ModalBody>
                    </Modal>
                </React.Fragment>
        );
    }
}



export default Header;
