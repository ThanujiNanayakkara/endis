import React, {Component} from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button,  Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label, ListGroup, ListGroupItem } from 'reactstrap';
import { auth, firestore } from '../firebase/firebase';
//new
import ReactDOM from 'react-dom';
import Graph from './GraphComponent';

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state={
            isUpdateOpen:false,
            isVerified:false,
            productDocId: "",
            userDetails: {name: "", email: "", productId:"", address:""},
            //new
            house: '',
            equipment: '',
            data:[],
           
        };
        this.updateProfile= this.updateProfile.bind(this);
        this.toggleModalUpdate= this.toggleModalUpdate.bind(this);
        this.handleVerify= this.handleVerify.bind(this);
        this.readUserData= this.readUserData.bind(this);
        //new
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    updateProfile(event){
        event.preventDefault();
        this.toggleModalUpdate();
        console.log("here");
        if(this.state.userDetails.productId===""){
        firestore.collection('userDetails').doc(auth.currentUser.uid).update({
            name:this.firstname.value,
            productId:this.productid.value,
            productDocId: this.state.productDocId,
            address:this.address.value
        })
        .then(()=>{this.readUserData();})
        .catch(()=>{})
        }
        else{
            firestore.collection('userDetails').doc(auth.currentUser.uid).update({
                name:this.firstname.value,
                address:this.address.value
            })
            .then(()=>{this.readUserData();})
            .catch(()=>{})
            
        }
       
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
                    firestore.collection("issuedProducts").doc(this.state.productDocId).update({
                        active:auth.currentUser.uid,
                    })
                    .then(()=>{})
                    .catch(()=>{})
                    //localStorage.setItem("productDocId",this.state.productDocId);
             
                }
                else{
                    alert("Not a valid device");

                }
            })
            .catch(error => console.log("Error"));     
    }


    toggleModalUpdate(){
        this.setState({
            isUpdateOpen: !this.state.isUpdateOpen,
            isVerified: false,
        });
    }

    componentDidMount(){
        this.readUserData();
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
        //alert('The required house is: ' + this.state.house + " and the commponent is " + this.state.equipment);
        this.readDB(this.state.house, this.state.equipment);
        this.state.data=[];
        event.preventDefault();
    }

    //new
    readDB=(house,equipment)=>{

        const renderResult=(data)=>{
            return(<div>{data}</div>)
        }        
        //var houseDB = firestore.collection('readings').doc('houses').collection(house);
        // houseDB.get()
        // .then((snapshot)=>{
        //     var XVal=1;
        //     snapshot.docs.forEach(doc => {
        //         const YVal=doc.data()[equipment]
        //         this.state.data.push({x:XVal,y:YVal})
        //         console.log(this.state.data)
        //         XVal=XVal+1
        //     })
        //     ReactDOM.render(renderResult(<Graph data={this.state.data}></Graph>), document.getElementById('readings')); 
        // })
        this.houseRef = firestore.collection('readings').doc('houses').collection(house).onSnapshot(
        (querySnapshot)=>{
            var XVal=1;
            querySnapshot.forEach(doc => {
                const YVal=doc.data()[equipment]
                this.state.data.push({x:XVal,y:YVal})
                console.log(this.state.data)
                XVal=XVal+1
            })
            //console.log("still here")
            ReactDOM.render(renderResult(<Graph data={this.state.data}></Graph>), document.getElementById('readings')); 
        })
                   
        
    }

    componentWillUnmount(){
        if (this.houseRef){
            this.houseRef();
        }
    }

    readUserData(){
        let user= auth.currentUser;
        var usersRef = firestore.collection("userDetails").doc(user.uid);
        usersRef.get()
        .then(doc => {
            if (doc.exists) {
                console.log("Document data:", doc.data().name);
                this.setState({
                    userDetails: doc.data(),
                });
                
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });           
    }

    readGraphDataRealTime(){
        var dataRef = firestore.collection("powerData");
        dataRef.where("productId", "==", "EM10000")
        .onSnapshot(function(querySnapshot) {
            var data = [];
            querySnapshot.forEach(function(doc) {
                data.push(doc.data().timeFrameNo);
                
            });
            return
        console.log("Current cities in CA: ", data.join(", "));
    });
        
    }

    render(){ 
        
        return(
            <div>
                <div className="container">
                    <div className="row align-items-start">
                        <div className="col-12 col-md m-1">
                        <Card >
                            <CardBody>
                                <CardImg src="assets/images/person.png" alt="" className="img-fluid rounded-circle mb-3"/>  
                                <CardTitle className="text-center" >User Profile</CardTitle> 
                                <ListGroup variant="flush">
                                    <ListGroupItem>Name: {this.state.userDetails.name}</ListGroupItem>
                                    <ListGroupItem>Email: {auth.currentUser.email}</ListGroupItem>
                                    <ListGroupItem>Product Id: {this.state.userDetails.productId}</ListGroupItem>
                                    <ListGroupItem>Address: {this.state.userDetails.address}</ListGroupItem>
                                </ListGroup>
                                <Button className="mr-auto"onClick={this.toggleModalUpdate}>
                                <span className="fa fa-sign-out fa-lg"></span> Edit Bio
                                </Button>
                            </CardBody>
                            <Modal isOpen = {this.state.isUpdateOpen} toggle={this.toggleModalUpdate}>
                            <ModalHeader toggle={this.toggleModalUpdate}>Update Profile</ModalHeader>
                            <ModalBody>
                            {this.state.userDetails.productId === "" ? 
                                <Form onSubmit={this.updateProfile}>                                    
                                    <FormGroup >
                                        <Label htmlFor="productid">Product ID</Label>
                                        <Input type="text" id="productid" name="productid" disabled={this.state.isVerified}
                                        innerRef = {(input) => this.productid = input} /> 
                                    </FormGroup>                                    
                                    <Button className="primary" disabled={this.state.isVerified}
                                    onClick={this.handleVerify}>Verify</Button>     
                                    <FormGroup>
                                        <Label htmlFor="firstname">Name</Label>
                                        <Input type="text" id="firstname" name="firstname" disabled={!this.state.isVerified }
                                        innerRef = {(input) => this.firstname = input} />       
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="address"> Address </Label>
                                        <Input type="text" id="address" name="address" disabled={!this.state.isVerified}
                                        innerRef = {(input) => this.address = input} />       
                                    </FormGroup>
                                    <Button type="submit" value="submit" className="primary" disabled={!this.state.isVerified}>Update</Button>                
                                </Form> : 
                                <Form onSubmit={this.updateProfile}>                                       
                                    <FormGroup>
                                        <Label htmlFor="firstname">Name</Label>
                                        <Input type="text" id="firstname" name="firstname" 
                                        innerRef = {(input) => this.firstname = input} />       
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="address"> Address </Label>
                                        <Input type="text" id="address" name="address" 
                                        innerRef = {(input) => this.address = input} />       
                                    </FormGroup>
                                    <Button type="submit" value="submit" className="primary" >Update</Button>                
                                </Form>
        }
                            </ModalBody>
                            </Modal>
                            
                        </Card>
                        </div>
                        <div className="col-12 col-md m-1">
                        
                        </div>
                        <div className="col-12 col-md m-1">
                           
                        </div>
                    </div>
                </div>
            
                {/* new */}
                {/* <h1>Dashboard</h1> */}
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