import React, {Component} from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button,  Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';
import { auth, firestore, fireauth, firebasestore } from '../firebase/firebase';

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state={
            isUpdateOpen:false,

        };
        this.updateProfile= this.updateProfile.bind(this);
        this.toggleModalUpdate= this.toggleModalUpdate.bind(this);

    }

    updateProfile(event){
        event.preventDefault();
        this.toggleModalUpdate();
        console.log("here");
        firestore.collection('userDetails').doc(auth.currentUser.uid).set({
            email: auth.currentUser.email,
            firstname:this.firstname.value,
            lastname:this.lastname.value,
        })
        .then(()=>{})
        .catch(()=>{})
    }

    toggleModalUpdate(){
        this.setState({
            isUpdateOpen: !this.state.isUpdateOpen
        });
    }

    componentDidUpdate(){
    }


    render(){
        const readUserData = ()=>{
            
        }
        return(
            <div>
                <Card>
                    <CardBody>
                        <CardTitle>User Profile</CardTitle> 
                        <CardSubtitle>Hi {auth.currentUser.email}</CardSubtitle> 
                        <Button className="mr-auto"onClick={this.toggleModalUpdate}>
                        <span className="fa fa-sign-out fa-lg"></span> Update User Profile
                        </Button>
                    </CardBody>
                    <Modal isOpen = {this.state.isUpdateOpen} toggle={this.toggleModalUpdate}>
                    <ModalHeader toggle={this.toggleModalUpdate}>Update Profile</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.updateProfile}>
                            <FormGroup>
                                <Label htmlFor="firstname">Firstname</Label>
                                <Input type="text" id="firstname" name="firstname"
                                innerRef = {(input) => this.firstname = input} />       
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="lastname">Lastname </Label>
                                <Input type="text" id="lastname" name="lastname" 
                                innerRef = {(input) => this.lastname = input} />       
                            </FormGroup>
                            <Button type="submit" value="submit" className="primary">Update</Button>
                        </Form>
                    </ModalBody>
                    </Modal>
                    
                </Card>

            </div>
        );
    }
}

export default Dashboard;