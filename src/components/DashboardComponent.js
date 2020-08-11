import React, {Component} from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button,  Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label, ListGroup, ListGroupItem } from 'reactstrap';
import { auth, firestore } from '../firebase/firebase';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Line, Bar} from 'react-chartjs-2';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
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
            info: [{
                labels:[],
                datasets:[{
                    label:"tv",
                    backgroundColor: "rgba(255,0,255,0.75)",
                    data:[]
                }]
            },{
                labels:[],
                datasets:[{
                    label:"fridge",
                    backgroundColor: "rgba(0,255,255,0.75)",
                    data:[]
                }]
                },
                {
                    labels:[],
                    datasets:[{
                        label:"washing machine",
                        backgroundColor: "rgba(255,255,0,0.75)",
                        data:[]
                    }]
                    },
                ],
            barInfo: [{
                    labels:[],
                    datasets:[{
                        label:"tv",
                        backgroundColor: "rgba(255,0,255,0.75)",
                        data:[]
                    }]
                },{
                    labels:[],
                    datasets:[{
                        label:"fridge",
                        backgroundColor: "rgba(0,255,255,0.75)",
                        data:[]
                    }]
                    },
                    {
                        labels:[],
                        datasets:[{
                            label:"washing machine",
                            backgroundColor: "rgba(255,255,0,0.75)",
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
//this function runs when edit bio button is clicked
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
//this function handles the verification of the product id
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

        const renderResult=(data)=>{
            return(<div>{data}</div>)
        }        
        this.houseRef = firestore.collection('readings').doc('houses').collection(house).onSnapshot(
        (querySnapshot)=>{
            var XVal=1;
            querySnapshot.forEach(doc => {
                const YVal=doc.data()[equipment]
                const arrayOfObject = this.state.data;
                const check = obj => obj.x === XVal;
                //console.log(arrayOfObject.some(checkUsername))
                if(arrayOfObject.some(check) != true)
                {this.state.data.push({x:XVal,y:YVal})}
                console.log(this.state.data)
                XVal=XVal+1
            })
            //console.log("still here")
            ReactDOM.render(renderResult(<Graph data={this.state.data}></Graph>), document.getElementById('readings')); 
        })
        // var today = new Date();
        // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        // firestore.collection("readings").add({
        //     time: new Date(Date.now())
        // })       
    }

    componentWillUnmount(){
        if (this.houseRef){
            this.houseRef();
        }
    }    
//this function runs each time component get mounted in order to read the user data
    readUserData(){
        let user= auth.currentUser;
        var usersRef = firestore.collection("userDetails").doc(user.uid);
        usersRef.get()
        .then(doc => {
            if (doc.exists) {
                //console.log("Document data:", doc.data().name);
                this.setState({
                    userDetails: doc.data(),
                });
                this.informUser(doc.data().productId);
                if(doc.data().productId!==""){
                    this.readDeviceByDevice("tv",0);
                    this.readDeviceByDevice("fridge",1);
                    //this.readGraphDataRealTime();
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
            {condition !== "" ? null :
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
            {condition !== "" ? null :
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
            ReactDOM.render(<Line options = {{responsive:true}}
                data={this.state.info[device]}></Line>, document.getElementById('graphs'+device)); 
        }
        })   
    }

    readDeviceByDevice(device,num){
        var product = this.state.userDetails.productId;
        this.houseRef = firestore.collection('powerDataTest').where("device", "==", device).where("productId","==", product).orderBy("timeFrameNo").onSnapshot(
            (querySnapshot)=>{
                var XVal=1;
                this.state.info[num].labels=[];
                this.state.info[num].datasets[0].data=[];
                for (var i in querySnapshot.docs) {
                    const doc = querySnapshot.docs[i];
                    const YVal = doc.data()[device];
                    for (var j in YVal) {
                        this.state.info[num].labels.push(XVal.toString());
                        this.state.info[num].datasets[0].data.push(YVal[j]);
                        XVal=XVal+1;
                }                      
                }
                //console.log(this.state.info[device])
                ReactDOM.render(<Line options = {{responsive:true}}
                    data={this.state.info[num]}></Line>, document.getElementById('graphs'+ num)); 
            
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
                //console.log(this.state.barInfo[product])
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
            <div>
                <div className="container mt-4">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to= '/home'>Home</Link ></BreadcrumbItem>
                        <BreadcrumbItem active>Dashboard</BreadcrumbItem>
                    </Breadcrumb>  
                </div>
                    <div className="row align-items-start">
                        <div className="col-12 col-md-3 mr-5">                            
                                <Card style={{backgroundColor:"#778899"}}>
                                <CardBody className="text-center">
                                    <CardImg src="assets/images/person.png" alt="" className="img-fluid rounded-circle mb-3" width="20"/>  
                                    <CardTitle className="text-center" >User Profile</CardTitle> 
                                    <ListGroup variant="flush" style={{fontSize:15}}>
                                        <ListGroupItem >Name: {this.state.userDetails.name}</ListGroupItem>
                                        <ListGroupItem>Email: {auth.currentUser.email}</ListGroupItem>
                                        <ListGroupItem>Product Id: {this.state.userDetails.productId}</ListGroupItem>
                                        <ListGroupItem>Address: {this.state.userDetails.address}</ListGroupItem>
                                    </ListGroup>
                                    <Button color="warning"  className="mt-2" onClick={this.toggleModalUpdate}>
                                     Edit Bio
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
                        <div className="col-12 col-md-8 col align-self-start">
                            <Tabs defaultActiveKey="now" id="uncontrolled-tab-example">
                                <Tab eventKey="now" title="Now">
                                    <div id="notify">
                                    </div>
                                    <div id='graphs0' style={{position: "relative"}}>
                                    </div>
                                    <div id='graphs1' style={{position: "relative"}}>
                                    </div>
                                    <div id='graphs2' style={{position: "relative"}}>
                                    </div>
                                </Tab>
                                <Tab eventKey="daily" title="Daily">
                                    <div id="notifyD">
                                    </div>
                                    <div id='bars0' style={{position: "relative"}}>
                                    </div>
                                    <div id='bars1' style={{position: "relative"}}>
                                    </div>
                                    <div id='bars2' style={{position: "relative"}}>
                                    </div>
                                </Tab>
                                <Tab eventKey="monthly" title="Monthly" >
                                <Card>
                                    <CardBody>
                                        <CardTitle className="text-center">
                                            Still Working On..
                                        </CardTitle>
                                    </CardBody>
                                </Card>
                                </Tab>
                            </Tabs>
                           
                        </div>
                            
                    </div>
                    <div className="row align-items-start">
                        <div className="col-12 col-md m-1">
                            
                        </div>
                        <div className="col-12 col-md m-1">
                            
                        </div>
                    </div>
                </div>
            
                {/* new */}
                .
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

// var product = this.state.userDetails.productId;
// var deviceTypes=["tv","fridge"];
// this.houseRef = firestore.collection('powerData').where("productId","==", product).orderBy("timeFrameNo").onSnapshot(
//     (querySnapshot)=>{
//         for (var device in deviceTypes)
//         {var XVal=1;
//         this.state.info1.labels=[];
//         this.state.info1.datasets[0].data=[];
//         for (var i in querySnapshot.docs) {
//             const doc = querySnapshot.docs[i];
//             const YVal = doc.data().tv;
//             for (var j in YVal) {
//                 this.state.info1.labels.push(XVal.toString());
//                 this.state.info1.datasets[0].data.push(YVal[j]);
//                 XVal=XVal+1;
//         }                      
//         }
//         console.log(this.state.info1)
//         ReactDOM.render(<Line options = {{responsive:true}}
//             data={this.state.info1}></Line>, document.getElementById('graphs')); }
//     })

// this.houseRef = firestore.collection('readings').doc('houses').collection("house1").onSnapshot(
    //     (querySnapshot)=>{
    //         var XVal=1;
    //         this.state.info1.labels=[];
    //         this.state.info1.datasets[0].data=[];
    //         querySnapshot.forEach(doc => {
    //             const YVal=doc.data().tv
    //             const YVal1=doc.data().fridge
    //             // if(this.state.info1.labels.includes(XVal.toString())!=true)
    //             // {this.state.info1.labels.push(XVal.toString());
    //             // this.state.info1.datasets[0].data.push(YVal);}
    //             this.state.info1.labels.push(XVal.toString());
    //             this.state.info1.datasets[0].data.push(YVal);
    //             XVal=XVal+1
    //         })
    //         console.log(this.state.info1)
    //         //console.log("still here")
    //         ReactDOM.render(<Line options = {{responsive:true}}
    //             data={this.state.info1}></Line>, document.getElementById('graphs')); 
    //     })

       // this.state.barInfo[product].labels=[];
                // this.state.barInfo[product].datasets[0].data=[];
                // var X=1;
                // for (var j in docSnapshots.docs) {
                //     const doc = docSnapshots.docs[j];
                //     const Y = doc.data().data;
                //     for ( var pro in Y){
                //         if ((Y[pro][productI])!== undefined){
                //             for (var product in productTypes){
                //                 var YData = Y[pro][productI][productTypes[product]]
                //                 this.state.barInfo[product].labels.push(X.toString());
                //                 this.state.barInfo[product].datasets[0].data.push(YData);
                //             }
                //             break;                 
                //         }
                //     }
                //     X=X+1;                                   
                // }
                // ReactDOM.render(<Bar options = {{responsive:true}}
                //     data={this.state.barInfo[0]}></Bar>, document.getElementById('bars'+0)); 
                //     ReactDOM.render(<Bar options = {{responsive:true}}
                //         data={this.state.barInfo[1]}></Bar>, document.getElementById('bars'+1));
                //         ReactDOM.render(<Bar options = {{responsive:true}}
                //             data={this.state.barInfo[2]}></Bar>, document.getElementById('bars'+2));