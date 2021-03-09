import React, {Component} from 'react';
// import {Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, 
//     Jumbotron, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label} from 'reactstrap';
import {Button} from 'reactstrap';
class Home extends Component{


    render(){
        return(
            <div className="row home">
                <div className="col-12 col-md-5 justify-content-center mt-5">
                    <h4>Join with us to make better Energy Decisions</h4>
                    <p>We provide all necessary means for equipping your home to have all relevant energy 
                        related data always centrally available for monitoring as well as for basic data
                         analysis. Energy related data can now always be available at the tip of your hands</p>
                    <p>We Help You Save Energy, Time, Increase Savings and Improve Sustainability.</p>        
                    <Button outline style={{borderColor:'#04724d', color:'#04724d'}}>
                        <span></span> Learn More
                    </Button>
                </div>
                <div className="col-12 col-md-7 home-image">
                    <img src="assets/images/bulb_home.jpg" width="50%" alt="White bulb"></img>
                </div>
            </div>
        );
    }
}

export default Home;