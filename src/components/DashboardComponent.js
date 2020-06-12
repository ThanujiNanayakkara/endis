import React, {Component} from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button,  Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';
import { auth, firestore, fireauth, firebasestore } from '../firebase/firebase';
//new
import ReactDOM from 'react-dom';
import Graph from './GraphComponent';

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state={
            isUpdateOpen:false,
            //new
            house: '',
            equipment: '',
            data:[]
        };
        this.updateProfile= this.updateProfile.bind(this);
        this.toggleModalUpdate= this.toggleModalUpdate.bind(this);
        //new
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

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

    //new
    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
        event.preventDefault();
    }

    //new
    handleSubmit(event) {
        alert('The required house is: ' + this.state.house + " and the commponent is " + this.state.equipment);
        {this.readDB(this.state.house, this.state.equipment)};
        this.state.data=[];
        event.preventDefault();
    }

    //new
    readDB=(house,equipment)=>{

        const renderResult=(data)=>{
            return(<div>{data}</div>)
        }

        var houseDB = firestore.collection('readings').doc('houses').collection(house);
        houseDB.get().then((snapshot)=>{
            var XVal=1;
            snapshot.docs.forEach(doc => {
                const YVal=doc.data()[equipment]
                this.state.data.push({x:XVal,y:YVal})
                console.log(this.state.data)
                XVal=XVal+1
            })
        })
        ReactDOM.render(renderResult(<Graph data={this.state.data}></Graph>), document.getElementById('readings'));            
        
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
            
                {/* new */}
                <h1>Dashboard</h1>
                <h3>Readings</h3>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Name:
                            <input type="text" name='house' house={this.state.house} onChange={this.handleChange} />
                        </label>
                        <label>
                            Equipment:
                            <input type="text" name='equipment' equipment={this.state.equipment} onChange={this.handleChange} />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
                <div id='readings'></div>
            </div>
        );
    }
}

export default Dashboard;