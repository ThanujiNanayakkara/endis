import React, {Component} from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button,  Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label, ListGroup, ListGroupItem } from 'reactstrap';
import { auth, firestore, messaging } from '../firebase/firebase';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';

import {Line, Bar, Bubble, Pie} from 'react-chartjs-2';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ReactDOM from 'react-dom';


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
                    label:"Tv",
                    fontColor: "#ffffff",
                    backgroundColor: "rgba(0, 0, 200, 0.3)",
                    pointBackgroundColor: "rgb(0, 0, 200)",
                    borderColor:"rgba(0, 0, 200)",
                    data:[]
                }]
                },{
                labels:[],
                datasets:[{
                    label:"Fridge",
                    backgroundColor: "rgba(0, 180, 0, 0.3)",
                    pointBackgroundColor: "rgb(0, 180, 0)",
                    borderColor:"rgba(0, 180, 0)",
                    data:[]
                }]
                },{
                labels:[],
                datasets:[{
                    label:"Washing Machine",
                    backgroundColor: "rgba(200, 0, 0, 0.3)",
                    pointBackgroundColor: "rgb(200, 0, 0)",
                    borderColor:"rgba(200, 0, 0)",
                    
                    data:[]
                }]
                },
                ],
            barInfo: [{
                labels:[],
                datasets:[{
                    label:"Tv",
                    backgroundColor: "rgba(0, 0, 200, 0.3)",
                pointBackgroundColor: "rgb(0, 0, 200)",
                borderColor:"rgba(0, 0, 200)",
                borderWidth: 5,
                    data:[]
                }]
            },{
                labels:[],
                datasets:[{
                    label:"Fridge",
                    backgroundColor: "rgba(0, 180, 0, 0.3)",
                pointBackgroundColor: "rgb(0, 180, 0)",
                borderColor:"rgba(0, 180, 0)",
                borderWidth: 5,
                    data:[]
                }]
                },
                {
                    labels:[],
                    datasets:[{
                        label:"Washing Machine",
                        backgroundColor: "rgba(200, 0, 0, 0.3)",
                pointBackgroundColor: "rgb(200, 0, 0)",
                borderColor:"rgba(200, 0, 0)",
                        borderWidth: 5,
                        data:[]
                    }]
                    },
                ],
            bubbleInfo: [{
                labels:[],
                datasets:[{
                    label:"Tv",
                    fontColor: "#ffffff",
                    backgroundColor: "rgba(0, 0, 200, 0.3)",
                    pointBackgroundColor: "rgb(0, 0, 200)",
                    borderColor:"rgba(0, 0, 200)",
                    borderWidth: 5,
                    data:[]
                }]
                },{
                labels:[],
                datasets:[{
                    label:"Fridge",
                    backgroundColor: "rgba(0, 180, 0, 0.3)",
                    pointBackgroundColor: "rgb(0, 180, 0)",
                    borderColor:"rgba(0, 180, 0)",
                    borderWidth: 5,
                    data:[]
                }]
                },{
                labels:[],
                datasets:[{
                    label:"Washing Machine",
                    backgroundColor: "rgba(200, 0, 0, 0.3)",
                    pointBackgroundColor: "rgb(200, 0, 0)",
                    borderColor:"rgba(200, 0, 0)",
                    borderWidth: 5,                    
                    data:[]
                }]
                },
                ],
            pieInfo: [{
                labels:[],
                datasets:[{
                    label:"Tv",
                    backgroundColor: ["#C70039",
                    "#F37121",
                    "#FFBD69"],
                    pointBackgroundColor: "rgb(200, 200, 200)",
                    borderColor:"rgba(200, 200, 200)",
                    borderWidth: 5,
                        data:[]
                }]
            },{
                labels:[],
                datasets:[{
                    label:"Fridge",
                    backgroundColor: "rgba(0, 180, 0, 0.3)",
                pointBackgroundColor: "rgb(0, 180, 0)",
                borderColor:"rgba(0, 180, 0)",
                borderWidth: 5,
                    data:[]
                }]
                },
                {
                    labels:[],
                    datasets:[{
                        label:"Washing Machine",
                        backgroundColor: "rgba(200, 0, 0, 0.3)",
                pointBackgroundColor: "rgb(200, 0, 0)",
                borderColor:"rgba(200, 0, 0)",
                        borderWidth: 5,
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
        this.evaluateMonthlyData = this.evaluateMonthlyData.bind(this);
        this.evaluateTwoMonthData = this.evaluateTwoMonthData.bind(this);
        //new
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubscribe = this.handleSubscribe.bind(this);
        this.handleUnSubscribe = this.handleUnSubscribe.bind(this);

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
    
    handleTokenRefresh() {
        return messaging.getToken().then((token) => {
          firestore.collection('userDetails').doc(auth.currentUser.uid).update({
            token: token,
          });
        });
        
      }

    checkSubscription() {
        firestore.collection('userDetails').doc(auth.currentUser.uid).get().then((snapshot) => {
          if ( snapshot.data().token !== "" ) {
            document.getElementById('subscribe').setAttribute("hidden", true);
            document.getElementById('unsubscribe').removeAttribute("hidden");
          } else {
            document.getElementById('unsubscribe').setAttribute("hidden", true);
            document.getElementById('subscribe').removeAttribute("hidden");
          }
        });
      }

    handleSubscribe(){ 
        messaging.requestPermission()
        .then(() => this.handleTokenRefresh())
        .then(() => this.checkSubscription())
        .catch((err) => {
        console.log("error getting permission :(");
        });
     }

     handleUnSubscribe(){
        messaging.getToken()
        .then((token) => messaging.deleteToken(token))
        .then(() => {
            var tokenRef = firestore.collection("userDetails").doc(auth.currentUser.uid);
            tokenRef.update({
                token: ""
            })
        })
        .then(() => this.checkSubscription())
        .catch((err) => {
          console.log("error deleting token :(");
        });
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
//this function runs each time component get mounted in order to read the user data
    readUserData(){
        let user= auth.currentUser;
        var usersRef = firestore.collection("userDetails").doc(user.uid);
        usersRef.get()
        .then(doc => {
            if (doc.exists) {
                this.setState({
                    userDetails: doc.data(),
                });
                this.informUser(doc.data().productId);
                if ( doc.data().token !== "" ) {
                    document.getElementById('subscribe').setAttribute("hidden", true);
                    document.getElementById('unsubscribe').removeAttribute("hidden");
                  } else {
                    document.getElementById('unsubscribe').setAttribute("hidden", true);
                    document.getElementById('subscribe').removeAttribute("hidden");
                  }
                if(doc.data().productId!==""){
                    //this.readDataRealTimeDevByDev("tv",0);
                    //this.readDataRealTimeDevByDev("fridge",1);
                     //this.readDailyDataOD();
                     //keep under this
                    this.readDataRealTime();
                    this.readDailyDataSD();
                    this.readMonthlyData();
                   
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
            <div className="mt-3">
            {condition !== "" ? null :
            <Card >
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
            <Card >
                <CardBody>
                    <CardTitle className="text-center">
                        No power data to be shown as product ID is not specified. Please proceed to edit your bio in order to add the product ID.
                    </CardTitle>
                </CardBody>
            </Card>
            }
            </div>, document.getElementById('notifyD'));
            ReactDOM.render(
                <div>
                {condition !== "" ? null :
                <Card >
                    <CardBody>
                        <CardTitle className="text-center">
                            No power data to be shown as product ID is not specified. Please proceed to edit your bio in order to add the product ID.
                        </CardTitle>
                    </CardBody>
                </Card>
                }
                </div>, document.getElementById('notifyM')); 
                ReactDOM.render(
                    <div>
                    {condition !== "" ? null :
                    <Card >
                        <CardBody>
                            <CardTitle className="text-center">
                                No power data to be shown as product ID is not specified. Please proceed to edit your bio in order to add the product ID.
                            </CardTitle>
                        </CardBody>
                    </Card>
                    }
                    </div>, document.getElementById('notifyE')); 
        console.log(condition);
        if(condition !== "") {
        document.getElementById('buttonBar').removeAttribute("hidden");
        document.getElementById('subscribe').removeAttribute("disabled");
        document.getElementById('unsubscribe').removeAttribute("disabled"); 
        
        }
        else{
        document.getElementById('buttonBar').setAttribute("hidden",true);
        document.getElementById('subscribe').setAttribute("disabled",true);
        document.getElementById('unsubscribe').setAttribute("disabled",true);

        }
    }

//realtime listener function to capture power usage of devices real time
//(if usage of each device is stored in one doc)
    readDataRealTime(){
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
                options = {{responsive:true, style:{backgroundColor:"#000000"},legend: {
                    display: true,
                    labels: {
                        fontColor: '#ffffff',
                        fontSize: 20
                    }
                },scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#ffffff"
                        }
                    }],
                    xAxes:[{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#ffffff"
                        }
                    }]}
                } }
                data={this.state.info[device]}></Line>, document.getElementById('graphs'+device)); 
                
        }
        })   
    }
//realtime listener function to capture power usage of devices real time
//(if usage of each device is stored in seperate docs) New
    readDataRealTimeDevByDev(device,num){
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

//to get data on previous days of the current month
//(if daily usage of each user is stored in seperate docs)
    readDailyDataSD(){
        var productI = this.state.userDetails.productId;
        var deviceTypes = ["tv","fridge","washingmachine"];
        var months = ["Jan","Feb","Mar","April","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        var end = new Date(Date.now());
        var month = end.getMonth();
        var firstDay = new Date(end.getFullYear(), end.getMonth(), 1);
        var endObj = new Date(end.getFullYear(),end.getMonth(),end.getDate());

        firestore.collection('dailyPowerReadings').where("productId","==",productI).where("timeStamp",">=",firstDay)
        .where("timeStamp","<", endObj).orderBy("timeStamp").get()
        .then(
        (querySnapshot)=>{
            for (var device in deviceTypes)
            {
                //this.state.barInfo[device].labels=[];
                this.state.bubbleInfo[device].datasets[0].data=[];
                for (var i in querySnapshot.docs) {
                    const doc = querySnapshot.docs[i];
                    const YVal = doc.data()[deviceTypes[device]];
                    const Obj = {
                        x: doc.data().timeStamp.toDate().getDate(),
                        y:YVal,
                        r:15
                    }
                    //this.state.barInfo[device].labels.push( months[month] + doc.data().timeStamp.toDate().getDate());
                    //this.state.barInfo[device].datasets[0].data.push(YVal);
                    this.state.bubbleInfo[device].datasets[0].data.push(Obj);                 
            }
            this.state.bubbleInfo[device].datasets[0].label = this.state.bubbleInfo[device].datasets[0].label +"-"+ months[month];
            ReactDOM.render(<Bubble options= {
                {
                    legend: {
                        display: true,
                        labels: {
                            fontColor: '#ffffff',
                            fontSize: 20
                        }
                    },scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontColor: "#ffffff"
                            }
                        }],
                        xAxes:[{
                            ticks: {
                                beginAtZero: true,
                                fontColor: "#ffffff",
                                stepSize:1
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Day",
                                fontColor: "#ffffff"
                            }
                        }]}}
            } data={this.state.bubbleInfo[device]}></Bubble>, document.getElementById('bars'+device)); 
                
        }
        })
    }

//to get data on previous days of the current month
//(if daily usage of each user is stored in one doc)
    readDailyDataOD(){
        var productI = this.state.userDetails.productId;
        var productTypes = ["total","tv","fridge","washingmachine"];
        var months = ["Jan","Feb","Mar","April","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        var end = new Date(Date.now());
        var month = end.getMonth();
        var firstDay = new Date(end.getFullYear(), end.getMonth(), 1);
        var endObj = new Date(end.getFullYear(),end.getMonth(),end.getDate());

        firestore.collection('dailyPowerReadings').where("timeStamp",">=",firstDay)
            .where("timeStamp","<", endObj).orderBy("timeStamp").get()
            .then(
            docSnapshots=>{
                for (var product in productTypes)
                {
                this.state.bubbleInfo[product].labels=[];
                this.state.bubbleInfo[product].datasets[0].data=[];
                for (var j in docSnapshots.docs) {
                    const doc = docSnapshots.docs[j];
                    const Y = doc.data().data;
                    //console.log(Y)
                    for (var pro in Y){
                        if ((Y[pro][productI])!== undefined){
                            //console.log(Y[pro][productI])
                            var YData = Y[pro][productI][productTypes[product]]
                            // this.state.barInfo[product].labels.push( months[month] + doc.data().timeStamp.toDate().getDate());
                            // this.state.barInfo[product].datasets[0].data.push(YData);
                            const Obj ={
                                x:doc.data().timeStamp.toDate().getDate(),
                                y: YData,
                                r:20
                            }
                            this.state.bubbleInfo[product].datasets[0].data.push(Obj);
                            break;                     
                        }
                    }                                       
                }
                //console.log(this.state.barInfo[product])
                ReactDOM.render(<Bubble options= {
                    {   
                        legend: {
                            display: true,
                            labels: {
                                fontColor: '#ffffff',
                                fontSize: 20
                            }
                        },scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    fontColor: "#ffffff"
                                }
                            }],
                            xAxes:[{
                                ticks: {
                                    beginAtZero: true,
                                    fontColor: "#ffffff",
                                    stepSize:1
                                }
                            }]}}
                } data={this.state.bubbleInfo[product]}></Bubble>, document.getElementById('bars'+product)); 
            }              
            })
    }

//to get data on previous months of the year
//(if monthly usage of each user is stored in seperate docs)
    readMonthlyData(){
        var product = this.state.userDetails.productId;
        var now = new Date(Date.now());
        var firstDayOfYear = new Date(now.getFullYear(),1,1);
        var productTypes = ["tv","fridge","washingmachine"];
        firestore.collection("monthlyPowerReadings").where("productId","==",product).where("timeStamp",">",firstDayOfYear)
        .where("timeStamp","<=",now).orderBy("timeStamp")
        .get()
        .then(querySnapshot=>{
            for (var pro in productTypes)
            {
                this.state.barInfo[pro].datasets[0].data=[];
                this.state.barInfo[pro].labels=[];
                for (var i in querySnapshot.docs) {
                    const doc = querySnapshot.docs[i];
                    const YVal = doc.data()[productTypes[pro]];
                    const XVal = doc.data().month
                    if(YVal!==undefined & XVal!==undefined){
                        this.state.barInfo[pro].datasets[0].data.push(YVal);
                        this.state.barInfo[pro].labels.push(XVal);
                    }                  
            }
            console.log(this.state.barInfo[pro].datasets[0].data)
            ReactDOM.render(<Bar options= {
                {   layout:{
                    padding:{
                        left:10,
                        right:10,
                        top: 10,
                        bottom:10
                    }
                },
                    legend: {
                        display: true,
                        labels: {
                            fontColor: '#ffffff',
                            fontSize: 20
                        }
                    },scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontColor: "#ffffff"
                            }
                        }],
                        xAxes:[{
                            ticks: {
                                beginAtZero: true,
                                fontColor: "#ffffff"
                            }
                        }]}}
            } data={this.state.barInfo[pro]}></Bar>, document.getElementById('bubble'+pro)); 
                
        }
        })
    }

//evaluating last month data
    evaluateMonthlyData(){
        var product = this.state.userDetails.productId;
        var now = new Date(Date.now());
        var month = now.getMonth()-1;
        var year = now.getFullYear();
        if (month < 0){
            month= month+12;
            year = year-1;
        }
        var firstDay = new Date(year,month,1);
        var endDay = new Date(now.getFullYear(),now.getMonth(),1)
        var deviceTypes = ["tv","fridge","washingmachine"];
        firestore.collection("monthlyPowerReadings").where("productId","==", product).where("timeStamp",">",firstDay)
        .where("timeStamp","<",endDay).get()
        .then(docSnapshot=>{
            this.state.pieInfo[0].labels=[]
            this.state.pieInfo[0].datasets[0].data=[]
            var sum =[0,0,0]
            if(!docSnapshot.empty){
                //console.log(docSnapshot.docs[0])
                for (var device in deviceTypes){                    
                    // for (var doc in docSnapshot.docs){
                    //     if(docSnapshot.docs[doc].data()[deviceTypes[device]]!== undefined){
                    //     sum[device]+= docSnapshot.docs[doc].data()[deviceTypes[device]]
                    //     }
                    // }
                    // this.state.pieInfo[0].labels.push(deviceTypes[device]);
                    // this.state.pieInfo[0].datasets[0].data.push(sum[device])
                    if(docSnapshot.docs[0].data()[deviceTypes[device]]!== undefined){
                        this.state.pieInfo[0].labels.push(deviceTypes[device]);
                        this.state.pieInfo[0].datasets[0].data.push(docSnapshot.docs[0].data()[deviceTypes[device]])
                    }
                }
                ReactDOM.render(<Pie options= {
                    {   layout:{
                        padding:{
                            left:10,
                            right:10,
                            top: 10,
                            bottom:10
                        }
                    },
                        legend: {
                            display: true,
                            labels: {
                                fontColor: '#ffffff',
                                fontSize: 20
                            }
                        }}
                } data={this.state.pieInfo[0]}></Pie>, document.getElementById('pie0'));
            }
        })
    }
    //evaluating last 2 month data
    evaluateTwoMonthData(){
        var product = this.state.userDetails.productId;
        var now = new Date(Date.now());
        var month = now.getMonth()-2;
        var year = now.getFullYear();
        if (month < 0){
            month= month+12;
            year = year-1;
        }
        var firstDay = new Date(year,month,1);
        var endDay = new Date(now.getFullYear(),now.getMonth(),1)
        var deviceTypes = ["tv","fridge","washingmachine"];
        firestore.collection("monthlyPowerReadings").where("productId","==", product).where("timeStamp",">",firstDay)
        .where("timeStamp","<",endDay).get()
        .then(docSnapshot=>{
            this.state.pieInfo[0].labels=[]
            this.state.pieInfo[0].datasets[0].data=[]
            var sum =[0,0,0]
            if(!docSnapshot.empty){
                for (var device in deviceTypes){                    
                    for (var doc in docSnapshot.docs){
                        if(docSnapshot.docs[doc].data()[deviceTypes[device]]!== undefined){
                        sum[device]+= docSnapshot.docs[doc].data()[deviceTypes[device]]
                        }
                    }
                    this.state.pieInfo[0].labels.push(deviceTypes[device]);
                    this.state.pieInfo[0].datasets[0].data.push(sum[device])
                }
                ReactDOM.render(<Pie options= {
                    {   layout:{
                        padding:{
                            left:10,
                            right:10,
                            top: 10,
                            bottom:10
                        }
                    },
                        legend: {
                            display: true,
                            labels: {
                                fontColor: '#ffffff',
                                fontSize: 20
                            }
                        }}
                } data={this.state.pieInfo[0]}></Pie>, document.getElementById('pie0'));
            }
        })
    }

    render(){     
        return(
                <div className="dashboard">
                    <div className="row">
                        <div className="col-12 col-md-2 mr-5" style={{width:"100%", height:"100%"}}> 
                            <div className="column">
                            <Card style={{backgroundColor:"#ffffff", color:'#000000'}}>
                                <CardBody className="text-center">
                                    <CardImg src="assets/images/ppic.png" alt="" className="img-fluid mb-3"/>  
                                    <CardTitle className="text-center" >{this.state.userDetails.name}</CardTitle> 
                                    <ListGroup  variant="flush" style={{fontSize:15, color:'#000000',backgroundColor:"#808080"}}>
                                        <ListGroupItem className= "listgroupitem">Email: {auth.currentUser.email}</ListGroupItem>
                                        <ListGroupItem className= "listgroupitem">Product Id: {this.state.userDetails.productId}</ListGroupItem>
                                        <ListGroupItem className= "listgroupitem">Address: {this.state.userDetails.address}</ListGroupItem>
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
                            <Card style={{backgroundColor:"#ffffff", color:'#000000'}} className="mt-3">
                                <CardBody className="text-center">
                                    <CardImg src="assets/images/ppic.png" alt="" className="img-fluid mb-3"/>  
                                    <CardTitle className="text-center" >Enable Notifications</CardTitle> 
                                    <CardSubtitle className="text-center listgroupitem">If you wanna recieve messages on any abnormalities in your power consumption, click the button below and subscribe to our service</CardSubtitle>                                  
                                    <Button color="danger" className="mt-2" onClick={this.handleSubscribe} id="subscribe">
                                     Subscribe
                                    </Button>
                                    <Button color="secondary" className="mt-2" onClick={this.handleUnSubscribe} id="unsubscribe" hidden>
                                     Unsubscribe
                                    </Button>
                                </CardBody>
                                </Card>

                            </div>
                        </div>
                        <div className="col-12 col-md-9 align-self-start">
                            <Tabs defaultActiveKey="now" id="uncontrolled-tab-example" className="tab-topic" >
                                <Tab eventKey="now" title="Current" className="tab-item">
                                    <div id="notify">
                                    </div>
                                
                                    {/* <div className="row equip-choose">
                                    <div className="form-check col-4">
                                        <input type="checkbox" className="form-check-input" id="showWashingMachine"></input>
                                        <label className="form-check-label" htmlFor="showWashingMachine">Washing machine</label>
                                    </div>
                                    <div className="form-check col-4">
                                        <input type="checkbox" className="form-check-input" id="showTV"></input>
                                        <label className="form-check-label" htmlFor="showTV">TV</label>
                                    </div>
                                    <div className="form-check col-4">
                                        <input type="checkbox" className="form-check-input" id="showFridge"></input>
                                        <label className="form-check-label" htmlFor="showFridge">Fridge</label>
                                    </div>
                                    </div> */}
                            
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-2"></div>
                                    <div className="col-12 col-md-8" id='graphs0' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                    
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-3"></div>
                                    <div className="col-12 col-md-8" id='graphs1' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                    
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-2"></div>
                                    <div className="col-12 col-md-8" id='graphs2' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                
                                    <br></br><br></br>

            
                                </Tab>
                                <Tab eventKey="daily" title="Daily" className="tab-item ">
                                    <div id="notifyD">
                                    </div>
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-1"></div>
                                    <div className="col-12 col-md-8" id='bars0' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                    
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-3"></div>
                                    <div className="col-12 col-md-8" id='bars1' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                    
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-1"></div>
                                    <div className="col-12 col-md-8" id='bars2' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    </div>

                                    <br></br><br></br>
                                    
                                    {/* <div className="row">
                                    <div className="col-12 col-md-3"></div>
                                    <div className="col-12 col-md-8" id='bars3' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    </div>

                                    <br></br><br></br> */}
                                
                                </Tab>
                                <Tab eventKey="monthly" title="Monthly" className="tab-item">
                                <div id="notifyM">
                                    </div>
                            
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-2"></div>
                                    <div className="col-12 col-md-8" id='bubble0' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                    
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-3"></div>
                                    <div className="col-12 col-md-8" id='bubble1' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                    
                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-2"></div>
                                    <div className="col-12 col-md-8" id='bubble2' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                
                                    <br></br><br></br>

                                </Tab>
                                <Tab eventKey="evaluation" title="Evaluation" className="tab-item">
                                <div id="notifyE">
                                    </div>
                            
                                    <br></br><br></br>
                                    <div className="col-12 align-items-center">
                                   

                                    <div className="row button-bar" style={{}} id="buttonBar">
                                    <div className="col-4 text-center">
                                        <Button  onClick={this.evaluateMonthlyData} size="lg" >
                                            <span className="fas fa-chart-pie "></span> Last Month
                                        </Button>
                                    </div>
                                    <div className=" col-4 text-center">
                                    <Button  onClick={this.evaluateTwoMonthData} size="lg">
                                            <span className="fas fa-chart-pie "></span> Last 2 Months                                                        
                                    </Button>
                                    </div>
                                    <div className=" col-4 text-center">
                                    <Button size="lg">
                                            <span className="fas fa-chart-pie "></span> Last 3 Months                                                        
                                    </Button>
                                    </div>
                                    </div>

                                    <br></br><br></br>
                                    
                                    <div className="row">
                                    <div className="col-12 col-md-2"></div>
                                    <div className="col-12 col-md-8" id='pie0' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    </div>
                                    
                    
                                
                                    <br></br><br></br>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
        );
    }
}

export default Dashboard;
