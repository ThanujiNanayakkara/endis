import React, {Component} from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button,  Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label, ListGroup, ListGroupItem } from 'reactstrap';
import { auth, firestore } from '../firebase/firebase';
import {Line, Bar} from 'react-chartjs-2';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ReactDOM from 'react-dom';
import Graph from './GraphComponent';
import Footer from './FooterComponent';

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state={
            isUpdateOpen:false,
            isVerified:false,
            productDocId: "",
            userDetails: {name: "", email: "", productId:"", address:""},
            info: [{
                labels:[],
                datasets:[{
                    label:"tv",
                    backgroundColor: "rgba(0, 0, 130, 0.3)",
                    pointBackgroundColor: "rgb(0, 0, 130)",
                    borderColor:"rgba(0, 0, 130)",
                    data:[]
                }]
                },{
                labels:[],
                datasets:[{
                    label:"fridge",
                    backgroundColor: "rgba(0, 130, 0, 0.3)",
                    pointBackgroundColor: "rgb(0, 130, 0)",
                    borderColor:"rgba(0, 130, 0)",
                    data:[]
                }]
                },{
                labels:[],
                datasets:[{
                    label:"washing machine",
                    backgroundColor: "rgba(130, 0, 0, 0.3)",
                    pointBackgroundColor: "rgb(130, 0, 0)",
                    borderColor:"rgba(130, 0, 0)",
                    data:[]
                }]
                },
                ],
            barInfo: [{
                    labels:[],
                    datasets:[{
                        label:"tv",
                        backgroundColor: "#fac802",
                        data:[]
                    }]
                },{
                    labels:[],
                    datasets:[{
                        label:"fridge",
                        backgroundColor: "#fcd22b",
                        data:[]
                    }]
                    },
                    {
                        labels:[],
                        datasets:[{
                            label:"washing machine",
                            backgroundColor: "#fcd94c",
                            data:[]
                        }]
                        },
                    ],
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
            address:this.address.value,
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
                        activeUser:auth.currentUser.uid,
                        active:true,
                    })
                    .then(()=>{})
                    .catch(()=>{})
                    firestore.collection('userDetails').doc(auth.currentUser.uid).update({
                        productId:this.productid.value,
                        productDocId: this.state.productDocId,
                    })
                    .then(()=>{this.readUserData();})
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
        //this.state.data=[];
        event.preventDefault();
    }

    //new
    readDB=(house,equipment)=>{
    var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        firestore.collection("readings").add({
            time: new Date(Date.now())
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
                this.informUser(doc.data().productId);
                if(doc.data().productId!=""){
                    this.readGraphDataRealTime();
                    this.readDailyDataForMonth();
                }                
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }            
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });           
    }

    informUser(condition){
        ReactDOM.render(
            <div>
            {condition != "" ? null :
            <Card>
                <CardBody>
                    <CardTitle className="text-center">
                        No power data to be shown as product ID is not specified. Please proceed to edit your bio in order to add the product ID.
                    </CardTitle>
                </CardBody>
            </Card>
            }
            </div>, document.getElementById('notify'));
        ReactDOM.render(
            <div>
            {condition != "" ? null :
            <Card>
                <CardBody>
                    <CardTitle className="text-center">
                        No power data to be shown as product ID is not specified. Please proceed to edit your bio in order to add the product ID.
                    </CardTitle>
                </CardBody>
            </Card>
            }
            </div>, document.getElementById('notifyD')); 
    }

    readGraphDataRealTime(){
    var product = this.state.userDetails.productId;
    var deviceTypes=["tv","fridge","washing machine"];
    this.houseRef = firestore.collection('powerData').where("productId","==", product).orderBy("timeFrameNo").onSnapshot(
        (querySnapshot)=>{
            for (var device in deviceTypes)
            {var XVal=1;
            this.state.info[device].labels=[];
            this.state.info[device].datasets[0].data=[];
            for (var i in querySnapshot.docs) {
                const doc = querySnapshot.docs[i];
                const YVal = doc.data()[deviceTypes[device]];
                for (var j in YVal) {
                    this.state.info[device].labels.push(XVal.toString());
                    this.state.info[device].datasets[0].data.push(YVal[j]);
                    XVal=XVal+1;
            }                      
            }
            //console.log(this.state.info[device])
            ReactDOM.render(<Line 
                options = {{responsive:true, style:{backgroundColor:"#000000"} }}
                data={this.state.info[device]}></Line>, document.getElementById('graphs'+device)); 
                
        }
        })   
    }

    readDailyDataForMonth(){
        var productI = this.state.userDetails.productId;
        var productTypes = ["tv","fridge","washingmachine"];
        var begining = new Date(Date.now()- 604800000);
        var end = new Date(Date.now());
        var beginingDate = begining.getFullYear()+'-'+(begining.getMonth()+1)+'-'+begining.getDate();
        var endDate = end.getFullYear()+'-'+(end.getMonth()+1)+'-'+end.getDate();
        var beginingObj = new Date(beginingDate)
        var endObj = new Date(endDate)
        firestore.collection('dailyPowerReadings').where("timeStamp",">=",beginingObj)
            .where("timeStamp","<", endObj).orderBy("timeStamp").get()
            .then(
            docSnapshots=>{
                //console.log(docSnapshots.docs[0].data().data[0])
                //console.log(docSnapshots.docs[1].data().data[1])
                for (var product in productTypes)
                {var X=1;
                this.state.barInfo[product].labels=[];
                this.state.barInfo[product].datasets[0].data=[];
                for (var j in docSnapshots.docs) {
                    const doc = docSnapshots.docs[j];
                    const Y = doc.data().data;
                    //console.log(Y)
                    for (var pro in Y){
                        if ((Y[pro][productI])!== undefined){
                            //console.log(Y[pro][productI])
                            var YData = Y[pro][productI][productTypes[product]]
                            this.state.barInfo[product].labels.push(X.toString());
                            this.state.barInfo[product].datasets[0].data.push(YData);
                            X=X+1;
                            break;                     
                        }
                    }                    
                    
                }
                console.log(this.state.barInfo[product])
                ReactDOM.render(<Bar options= {
                    {scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]}
                    }
                } data={this.state.barInfo[product]}></Bar>, document.getElementById('bars'+product)); 
            }              
            })
    }

    render(){     
        return(

                <div className="dashboard">
                    <div className="row">
                        <div className="col-12 col-md-2 mr-5" style={{width:"100%", height:"100%"}}> 
                            <Card style={{backgroundColor:"#222222", color:'#ffffff'}}>
                                <CardBody className="text-center">
                                    <CardImg src="assets/images/ppic.png" alt="" className="img-fluid mb-3"/>  
                                    <CardTitle className="text-center" >{this.state.userDetails.name}</CardTitle> 
                                    <ListGroup variant="flush" style={{fontSize:15, color:'#000000'}}>
                                        <ListGroupItem>Email: {auth.currentUser.email}</ListGroupItem>
                                        <ListGroupItem>Product Id: {this.state.userDetails.productId}</ListGroupItem>
                                        <ListGroupItem>Address: {this.state.userDetails.address}</ListGroupItem>
                                     </ListGroup>
                                    <Button color="warning" className="mt-2" onClick={this.toggleModalUpdate}>
                                     Change bio
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
                        <div className="col-12 col-md-9 align-self-start">
                            <Tabs defaultActiveKey="now" id="uncontrolled-tab-example" className="tab-topic">
                                <Tab eventKey="now" title="Now" className="tab-item">
                                    <div id="notify">
                                    </div>
                                
                                    <div className="row equip-choose">
                                    <div class="form-check col-4">
                                        <input type="checkbox" class="form-check-input" id="showWashingMachine"></input>
                                        <label class="form-check-label" for="showWashingMachine">Washing machine</label>
                                    </div>
                                    <div class="form-check col-4">
                                        <input type="checkbox" class="form-check-input" id="showTV"></input>
                                        <label class="form-check-label" for="showTV">TV</label>
                                    </div>
                                    <div class="form-check col-4">
                                        <input type="checkbox" class="form-check-input" id="showFridge"></input>
                                        <label class="form-check-label" for="showFridge">Fridge</label>
                                    </div>
                                    </div>
                            
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-2"></div>
                                    <div className="col-12 col-md-7" id='graphs0' style={{position: "relative", backgroundColor:"#ffffff", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                    
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-3"></div>
                                    <div className="col-12 col-md-7" id='graphs1' style={{position: "relative", backgroundColor:"#ffffff", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                    
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-2"></div>
                                    <div className="col-12 col-md-7" id='graphs2' style={{position: "relative", backgroundColor:"#ffffff", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                
                                    <br></br><br></br>
                                </Tab>
                                <Tab eventKey="daily" title="Daily">
                                    <div id="notifyD">
                                    </div>
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-1"></div>
                                    <div className="col-12 col-md-8" id='bars0' style={{position: "relative", backgroundColor:"#ffffff", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                    
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-3"></div>
                                    <div className="col-12 col-md-8" id='bars1' style={{position: "relative", backgroundColor:"#ffffff", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                    
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-1"></div>
                                    <div className="col-12 col-md-8" id='bars2' style={{position: "relative", backgroundColor:"#ffffff", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                
                                </Tab>
                                <Tab eventKey="monthly" title="Monthly" disabled>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
        );
    }
}

export default Dashboard;
