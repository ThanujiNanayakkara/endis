import React, {Component} from 'react';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle, Button,  Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label, ListGroup, ListGroupItem } from 'reactstrap';
import { auth, firestore, messaging } from '../firebase/firebase';


import { Pie} from 'react-chartjs-2';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ReactDOM from 'react-dom';
import LineChart from './LineChartComponent';
import BarChart from './BarChartComponent';
import BubbleChart from './BubbleChartComponent';


class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state={
            isUpdateOpen:false,
            isVerified:false,
            productDocId: "",
            userDetails: {name: "", email: "", productId:"", address:""},
            aggregateR:{labels:[],data:[]},
            info:[{labels:[],data:[]},{labels:[],data:[]},{labels:[],data:[]}],
            aggregateD:{labels:[],data:[],label:"Total Power"},
            bubbleInfo : [{labels:[],data:[],label:"Tv"},{labels:[],data:[],label:"Fridge"},{labels:[],data:[],label:"Washing Machine"}],
            aggregateM: {labels:[],data:[],label:"Total Power"},
            barInfo : [{labels:[],data:[],label:"Tv"},{labels:[],data:[],label:"Fridge"},{labels:[],data:[],label:"Washing Machine"}],
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
            today: "Calculating..",
            thisWeek: "Calculating..",
            thisMonth: "Calculating..",
            thisMonthDup: 0,
            thisWeekDup: 0,
            todayAgg: "Calculating..",
            thisWeekAgg: "Calculating..",
            thisMonthAgg: "Calculating..",
            thisMonthDupAgg: 0,
            thisWeekDupAgg: 0,
            uptoNow : [],
            dataUptoNow:[],
            uptoMonth: [],
            devices:["Tv","Fridge","Washing Machine"],
            leadingConsumersM: [0,0,0],
            leadingConsumersMNames:[],
            sort:[],
            sortDev :[],
            //new
            // house: '',
            // equipment: '',
            // data:[],
                      
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
    //var today = new Date();
        //var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
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
                    this.setState({
                        uptoNow:[0,0,0],
                        dataUptoNow:[0,0,0],
                        

                    })
                    this.readAggregateData();
                    this.readAggregateDaily();
                    this.readAggregateMonthly();
                    this.readDataRealTimeDevByDev("tv",0);
                    this.readDataRealTimeDevByDev("fridge",1);
                    this.readDataRealTimeDevByDev("washingmachine",2);                  
                     //this.readDailyDataOD();
                     //keep under this
                    //this.readDataRealTime();
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
    
    readAggregateData(){
        var product = this.state.userDetails.productId;
        var now = new Date(Date.now());
        var firstDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        this.houseRef = firestore.collection('aggregateData').where("productId","==", product).where("timeFrameNo",">=",firstDay).orderBy("timeFrameNo").onSnapshot(
            (querySnapshot)=>{
                var sumNow = 0;
                //var XVal=1;
                this.setState(prevstate=>({
                    aggregateR: {
                        ...prevstate.aggregateR,
                        labels:[],
                        data:[]
                    }
                }))
                // this.state.aggregateR.labels=[];
                // this.state.aggregateR.data=[];
                for (var i in querySnapshot.docs) {
                    const doc = querySnapshot.docs[i];
                    const time = (doc.data().timeFrameNo.seconds)*1000;
                    const YVal = doc.data().data;
                    const labels=[];
                    const data=[];
                    for (var j in YVal) {
                        labels.push(new Date(time + (j)*3000));
                        data.push(YVal[j]);
                        sumNow=sumNow+YVal[j];
                        //XVal=XVal+1;
                } 
                this.setState(state => {
                    const l = state.aggregateR.labels.concat(labels);
                    const d = state.aggregateR.data.concat(data) ;             
                    return{
                    aggregateR: {
                        ...state.aggregateR,
                        labels:l,
                        data:d
                    }}
                  });                     
                }
            ReactDOM.render(<LineChart label = "Total Power" backgroundColor = "rgba(0, 0, 200, 0.3)" pointBackgroundColor="rgb(0, 0, 200)" borderColor="rgba(0, 0, 200)" data={this.state.aggregateR.data} labels = {this.state.aggregateR.labels}/>, document.getElementById('graphsagg'));
            this.setState({
                todayAgg: Math.round(sumNow),
                thisMonthAgg: this.state.thisMonthDupAgg + Math.round(sumNow),
                thisWeekAgg: this.state.thisWeekDupAgg + Math.round(sumNow),
            })    
            }) 
    }

    readAggregateDaily(){
        var productI = this.state.userDetails.productId;
        var months = ["Jan","Feb","Mar","April","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        var end = new Date(Date.now());
        var month = end.getMonth();
        var firstDay = new Date(end.getFullYear(), end.getMonth(), 1);
        var endObj = new Date(end.getFullYear(),end.getMonth(),end.getDate());
        var weekBefore = new Date(end.getFullYear(), end.getMonth(),end.getDate()-7);
        //var dataUptoMonth = []

        firestore.collection('dailyAggregateData').where("productId","==",productI).where("date",">=",firstDay)
        .where("date","<", endObj).orderBy("date").get()
        .then(
        (querySnapshot)=>{
            var sum = 0;
            var sumWeek = 0;
            this.setState(prevstate=>({
                aggregateD: {
                    ...prevstate.aggregateD,
                    data:[]
                }
            }))
            //this.state.aggregateD.data=[];
            for (var i in querySnapshot.docs) {
                const doc = querySnapshot.docs[i];
                const YVal = doc.data().data;
                const Obj = {
                    x: doc.data().date.toDate().getDate(),
                    y:YVal,
                    r:5
                }
                if (doc.data().date.toDate() >= weekBefore){
                    sumWeek += YVal;
                    console.log("thisweek")
                }
                //this.state.barInfo[device].labels.push( months[month] + doc.data().timeStamp.toDate().getDate());
                //this.state.barInfo[device].datasets[0].data.push(YVal);
                this.setState(state => {
                    const data = state.aggregateD.data.concat(Obj)
                    return{
                    aggregateD: {
                        ...state.aggregateD,
                        data:data
                    }}
                  });
                //this.state.aggregateD.data.push(Obj);
                sum=sum+YVal;               
            }
            this.setState(prevstate=>({
                aggregateD: {
                    ...prevstate.aggregateD,
                    label: "Total Power -"+ months[month]
                },
                thisMonthAgg: Math.round(sum+this.state.todayAgg),
                thisMonthDupAgg: Math.round(sum),
                thisWeekAgg: Math.round(sumWeek +this.state.todayAgg),
                thisWeekDupAgg: Math.round(sumWeek),
            }))
            //this.state.aggregateD.label = this.state.aggregateD.label +"-"+ months[month];
            ReactDOM.render(<BubbleChart label = {this.state.aggregateD.label} backgroundColor = "rgba(0, 0, 200, 0.3)" pointBackgroundColor="rgb(0, 0, 200)" borderColor="rgba(0, 0, 200)" data={this.state.aggregateD.data} labels = {this.state.aggregateD.labels}/>, document.getElementById('barsagg'));          
        })
    }

    readAggregateMonthly(){
        var product = this.state.userDetails.productId;
        var now = new Date(Date.now());
        var firstDayOfYear = new Date(now.getFullYear(),1,1);
        firestore.collection("monthlyAggregateData").where("productId","==",product).where("timeStamp",">",firstDayOfYear)
        .where("timeStamp","<=",now).orderBy("timeStamp")
        .get()
        .then(querySnapshot=>{
            this.setState(prevstate=>({
                aggregateM: {
                    ...prevstate.aggregateM,
                    data:[],
                    labels:[]
                }
            }))
                for (var i in querySnapshot.docs) {
                    const doc = querySnapshot.docs[i];
                    const YVal = doc.data().data;
                    const XVal = doc.data().month
                    if(YVal!==undefined & XVal!==undefined){
                        this.setState(state => {
                            const data = state.aggregateM.data.concat(YVal);
                            const labels = state.aggregateM.labels.concat(XVal);
                            return{
                            aggregateM: {
                                ...state.aggregateM,
                                data:data,
                                labels: labels
                            }}
                          });
                    }                  
            }
            //console.log(this.state.barInfo[pro].datasets[0].data)
            ReactDOM.render(<BarChart label = {this.state.aggregateM.label} backgroundColor = "rgba(0, 0, 200, 0.3)" pointBackgroundColor="rgb(0, 0, 200)" borderColor="rgba(0, 0, 200)" data={this.state.aggregateM.data} labels = {this.state.aggregateM.labels}/>, document.getElementById('bubbleagg'));        
        })
    }


//realtime listener function to capture power usage of devices real time
//(if usage of each device is stored in seperate docs) New
    readDataRealTimeDevByDev(device,num){
        var product = this.state.userDetails.productId;
        var now = new Date(Date.now());
        var firstDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        this.houseRef = firestore.collection('powerDataTest').where("device", "==", device).where("productId","==", product).where("timeFrameNo",">=",firstDay).orderBy("timeFrameNo").onSnapshot(
            (querySnapshot)=>{
                var sumNow = 0;
                this.setState(prevState => ({
                    info: prevState.info.map(
                      (el,index) => index === num? { ...el, labels:[] , data:[]}: el
                    )                 
                  }))
                // this.state.info[num].labels=[];
                // this.state.info[num].data=[];
                for (var i in querySnapshot.docs) {
                    const doc = querySnapshot.docs[i];
                    const time = (doc.data().timeFrameNo.seconds)*1000;
                    const YVal = doc.data()[device];
                    const labels=[]
                    for (var j in YVal) {
                        labels.push(new Date(time + (j)*3000));
                        sumNow=sumNow+YVal[j];
                    }
                    this.setState(prevState => ({
                        info: prevState.info.map(
                          (el,index) => index === num? { ...el, labels: el.labels.concat(labels), data: el.data.concat(YVal) }: el
                        )                      
                      }))                   
                }
            ReactDOM.render(<LineChart label = {this.state.devices[num]} backgroundColor = "rgba(0, 0, 200, 0.3)" pointBackgroundColor="rgb(0, 0, 200)" borderColor="rgba(0, 0, 200)" data={this.state.info[num].data} labels = {this.state.info[num].labels}/>, document.getElementById('graphs'+ num));
            this.setState(prevState => ({
                uptoNow: prevState.uptoNow.map(
                  (el,index) => index === num? sumNow : el
                ),
                dataUptoNow: prevState.dataUptoNow.map(
                    (el,index) => index === num? { device:this.state.devices[num],value: sumNow }: el
                  ) , 
                sort:[],
                sortDev:[]               
              }))
            //this.state.uptoNow[num]= sumNow; 
            //this.state.dataUptoNow[num]= {device:this.state.devices[num],value: sumNow};
            let lead = []; // the new empty object
            // let's copy all user properties into it
            for (let key in this.state.dataUptoNow) {
            lead[key] = this.state.dataUptoNow[key];
            }
            var sum = this.state.uptoNow.reduce(function(a, b){
                return a + b;
            }, 0);
            if (lead.length>=3){
                lead.sort(function(a, b){return b.value-a.value});
            const values=[];
            const devices=[];
            for (var k in lead){
                values.push(lead[k].value);
                devices.push(lead[k].device)
            }
            this.setState( {
                sort: values,
                sortDev: devices
              });
        }           
            this.setState({
                today: Math.round(sum),
                thisMonth: this.state.thisMonthDup + Math.round(sum),
                thisWeek: this.state.thisWeekDup + Math.round(sum)
            }) 
            this.readDailyDataSD();          
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
        var weekBefore = new Date(end.getFullYear(), end.getMonth(),end.getDate()-7);
        var dataUptoMonth = []

        firestore.collection('dailyPowerReadings').where("productId","==",productI).where("timeStamp",">=",firstDay)
        .where("timeStamp","<", endObj).orderBy("timeStamp").get()
        .then(
        (querySnapshot)=>{
            var sum = 0;
            var sumWeek = 0;
            var count=0
            for (var device in deviceTypes)
            {
                //this.state.barInfo[device].labels=[];
                var sumMonth = 0;
                this.setState(prevState => ({
                    bubbleInfo: prevState.bubbleInfo.map(
                      (el,index) => index === count? { ...el, data:[]}: el
                    )                 
                  }))
               //this.state.bubbleInfo[device].data=[];
               const Objs = [];
                for (var i in querySnapshot.docs) {
                    const doc = querySnapshot.docs[i];
                    const YVal = doc.data()[deviceTypes[device]];
                    const Obj = {
                        x: doc.data().timeStamp.toDate().getDate(),
                        y:YVal,
                        r:5
                    }
                    if (doc.data().timeStamp.toDate() >= weekBefore){
                        sumWeek += YVal;
                        console.log("thisweek")
                    }
                    Objs.push(Obj);
                    this.setState(prevState => ({
                        bubbleInfo: prevState.bubbleInfo.map(
                          (el,index) => index === count ? { ...el, data:el.data.concat(Obj) }: el
                        )                      
                      })) 
                    sum=sum+YVal;
                    sumMonth = sumMonth + YVal;   
                              
            }
            ReactDOM.render(<BubbleChart label = {this.state.bubbleInfo[device].label  +"-"+ months[month]} backgroundColor = "rgba(0, 0, 200, 0.3)" pointBackgroundColor="rgb(0, 0, 200)" borderColor="rgba(0, 0, 200)" data={this.state.bubbleInfo[device].data} labels = {this.state.bubbleInfo[device].labels}/>, document.getElementById('bars'+device));
            
            this.setState(prevState=>({
                thisMonth: Math.round(sum+this.state.today),
                thisMonthDup: Math.round(sum),
                thisWeek: Math.round(sumWeek +this.state.today),
                thisWeekDup: Math.round(sumWeek),
                uptoMonth: prevState.uptoMonth.map(
                    (el,index) => index === count ? sumMonth : el
                  ) 
            })) 
            //this.state.uptoMonth[device] = sumMonth;
            dataUptoMonth[device]=sumMonth;
            count+=1
        }
        var sumUpto = this.state.uptoNow.map(function (num, idx) {
            const obj = {device: deviceTypes[idx] ,value: num + dataUptoMonth[idx]};
            return obj
          });
    
        let leadM = []; // the new empty object
        for (let key in sumUpto) {
            leadM[key] = sumUpto[key];
        }
        leadM.sort(function(a, b){return b.value-a.value});
        var sortM=[]
        var sortMDev =[]
        for (var k in leadM){
            sortM.push(leadM[k].value);
            sortMDev.push(leadM[k].device)
        }
        this.setState({
            leadingConsumersM:sortM,
            leadingConsumersMNames: sortMDev,
        })            
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
                this.state.barInfo[pro].data=[];
                this.state.barInfo[pro].labels=[];
                for (var i in querySnapshot.docs) {
                    const doc = querySnapshot.docs[i];
                    const YVal = doc.data()[productTypes[pro]];
                    const XVal = doc.data().month
                    if(YVal!==undefined & XVal!==undefined){
                        this.state.barInfo[pro].data.push(YVal);
                        this.state.barInfo[pro].labels.push(XVal);
                    }                  
            }
            //console.log(this.state.barInfo[pro].datasets[0].data)
            ReactDOM.render(<BarChart label = {this.state.barInfo[pro].label} backgroundColor = "rgba(0, 0, 200, 0.3)" pointBackgroundColor="rgb(0, 0, 200)" borderColor="rgba(0, 0, 200)" data={this.state.barInfo[pro].data} labels = {this.state.barInfo[pro].labels}/>, document.getElementById('bubble'+pro));
            
                
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
                        <div className="col-12 col-md-2 mr-5 mb-4" style={{width:"100%", height:"100%"}}> 
                            <div className="column">
                                <Card style={{backgroundColor:"#323232", color:'#000000'}}>
                                    <CardBody className="text-center">
                                        <CardImg src="assets/images/ppic.png" alt="" className="img-fluid mb-3"/>  
                                        <CardTitle className="text-center" style={{fontSize:18, color:'#ffffff'}}>{this.state.userDetails.name}</CardTitle> 
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
                                <Card style={{backgroundColor:"#323232", color:'#000000'}} className="mt-3">
                                    <CardBody className="text-center">
                                        <CardImg src="assets/images/ppic.png" alt="" className="img-fluid mb-3"/>  
                                        <CardTitle className="text-center" style={{fontSize:18, color:'#ffffff'}}>Enable Notifications</CardTitle> 
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
                 <div className="col-12 col-md-9 align-self-start" id="data">
                 { this.state.userDetails.productId === "" ? 
                    <div className="container mb-3">
                    <Card >
                    <CardBody>
                        <CardTitle className="text-center">
                            No power data to be shown as product ID is not specified. Please proceed to edit your bio in order to add the product ID.
                        </CardTitle>
                    </CardBody>
                </Card>
                </div>
                 : null}
                        <div className="container">
                                <Card style={{backgroundColor:"#646464", color:'#000000'}}>
                                <CardBody>
                                <CardTitle style={{fontSize:"28px", color:"#000000"}}>Total Power Consumption</CardTitle>
                                <div className="row">
                                <div className="col-md-4">
                                <div className="card-counter primary">
                                    <i className="fa fa-clock-o"></i>
                                    <span className="count-name">Today</span>
                                <span className="count-numbers">{this.state.todayAgg}</span>    
                                </div>
                                </div>
                                <div className="col-md-4">
                                <div className="card-counter danger">
                                    <i className="fa fa-calendar"></i>
                                <span className="count-numbers">{this.state.thisWeekAgg}</span>
                                    <span className="count-name">Last 7 days</span>
                                </div>
                                </div>
                                <div className="col-md-4">
                                <div className="card-counter success">
                                    <i className="fa fa-area-chart"></i>
                                <span className="count-numbers">{this.state.thisMonthAgg}</span>
                                    <span className="count-name">Current billing period</span>
                                </div>
                                </div>
                            </div>
                            </CardBody>
                            </Card>
                            </div>
                            <div className="container mt-4">
                            <Card>
                            <CardBody>
                            <CardTitle style={{fontSize:"30px", color:"#000000"}}>Total Power Usage - In detail</CardTitle>
                            <Tabs defaultActiveKey="now" id="uncontrolled-tab-example" className="tab-topic" >
                                <Tab eventKey="now" title="Current" className="tab-item">
                                    <div id="notify">
                                    </div>
                                    <div className="col-12" id='graphsagg' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                </Tab>
                                <Tab eventKey="daily" title="Daily" className="tab-item ">
                                    <div id="notifyD">
                                    </div>   
                                    <div className="col-12 " id='barsagg' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>                                   
                                </Tab>
                                <Tab eventKey="monthly" title="Monthly" className="tab-item">
                                <div id="notifyM">
                                    </div> 
                                    <div className="col-12" id='bubbleagg' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>    
                                </Tab>
                            </Tabs>
                            </CardBody>
                            </Card>
                            </div>                            
                            <div className="container mt-4">
                                <Card style={{backgroundColor:"#646464", color:'#000000'}}>
                                <CardBody>
                                <CardTitle style={{fontSize:"28px", color:"#000000"}}>Power Consumption of High Power Consuming Devices</CardTitle>
                                <div className="row">
                                <div className="col-md-4">
                                <div className="card-counter primary">
                                    <i className="fa fa-clock-o"></i>
                                    <span className="count-name">Today</span>
                                <span className="count-numbers">{this.state.today}</span>    
                                </div>
                                </div>
                                <div className="col-md-4">
                                <div className="card-counter danger">
                                    <i className="fa fa-calendar"></i>
                                <span className="count-numbers">{this.state.thisWeek}</span>
                                    <span className="count-name">Last 7 days</span>
                                </div>
                                </div>
                                <div className="col-md-4">
                                <div className="card-counter success">
                                    <i className="fa fa-area-chart"></i>
                                <span className="count-numbers">{this.state.thisMonth}</span>
                                    <span className="count-name">Current billing period</span>
                                </div>
                                </div>
                            </div>
                            </CardBody>
                            </Card>
                            </div>
                            <div className="container mt-4">
                                <Card style={{backgroundColor:"#646464", color:'#000000'}}>
                                    <CardBody>
                                    <CardTitle style={{fontSize:"30px", color:"#000000"}}>Leading Power Consumers</CardTitle>
                                    <Tabs defaultActiveKey="now" id="uncontrolled-tab-example" className="tab-topic" >
                                <Tab eventKey="now" title="Today" className="tab-consumer-item">
                                <div className="row">
                                <div className="col-md-4">
                                <div className="card-consumer large">
                                    <i className="fa fa-fire"></i>
                                {this.state.sort.length >=3 ? 
                                <React.Fragment>
                                <span className="count-name-large">{this.state.sortDev[0]}</span>
                                <span className="count-numbers-large">{Math.round(this.state.sort[0])}</span> </React.Fragment>  : null 
                                }
                                </div>
                                </div>
                                <div className="col-md-4">
                                <div className="card-consumer medium">
                                    <i className="fa fa-fire"></i>
                                    {this.state.sort.length >=3 ? 
                                <React.Fragment>
                                <span className="count-numbers-medium">{Math.round(this.state.sort[1])}</span>
                                    <span className="count-name-medium">{this.state.sortDev[1]}</span>
                                    </React.Fragment>  : null 
                                }
                                </div>
                                </div>
                                <div className="col-md-4">
                                <div className="card-consumer small">
                                    <i className="fa fa-fire"></i>
                                    {this.state.sort.length >=3  ? 
                                <React.Fragment>
                                <span className="count-numbers-small">{Math.round(this.state.sort[2])}</span>
                                    <span className="count-name-small">{this.state.sortDev[2]}</span>
                                    </React.Fragment>  : null 
                                }
                                </div>
                                </div>
                            </div>           
                                </Tab>
                                <Tab eventKey="monthly" title="This Month" className="tab-consumer-item">
                                <div className="row">
                                <div className="col-md-4">
                                <div className="card-consumer large">
                                    <i className="fa fa-fire"></i>
                                <span className="count-name-large">{this.state.leadingConsumersMNames[0]}</span>
                                <span className="count-numbers-large">{Math.round(this.state.leadingConsumersM[0])}</span>   
                                </div>
                                </div>
                                <div className="col-md-4">
                                <div className="card-consumer medium">
                                    <i className="fa fa-fire"></i>
                                <span className="count-numbers-medium">{Math.round(this.state.leadingConsumersM[1])}</span>
                                    <span className="count-name-medium">{this.state.leadingConsumersMNames[1]}</span>
                                </div>
                                </div>
                                <div className="col-md-4">
                                <div className="card-consumer small">
                                    <i className="fa fa-fire"></i>
                                <span className="count-numbers-small">{Math.round(this.state.leadingConsumersM[2])}</span>
                                    <span className="count-name-small">{this.state.leadingConsumersMNames[2]}</span>
                                </div>
                                </div>
                            </div>
                                </Tab>    
                            </Tabs>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="container mt-4">
                            <Card>
                            <CardBody>
                            <CardTitle style={{fontSize:"30px", color:"#000000"}}>Power Usage - In detail</CardTitle>
                            <Tabs defaultActiveKey="now" id="uncontrolled-tab-example" className="tab-topic" >
                                <Tab eventKey="now" title="Current" className="tab-item">
                                    <div id="notify">
                                    </div>
                                
                                    
                                    <div className="col-12 mb-4" id='graphs0' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    
                                    <div className="col-12 mb-4" id='graphs1' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    
                                   
                                    <div className="col-12 mb-4" id='graphs2' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                   
                                </Tab>
                                <Tab eventKey="daily" title="Daily" className="tab-item ">
                                    <div id="notifyD">
                                    </div>
                                    
                                    <div className="col-12 mb-4" id='bars0' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    
                                    <div className="col-12 mb-4" id='bars1' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    
                                    <div className="col-12 mb-4" id='bars2' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    
                                
                                </Tab>
                                <Tab eventKey="monthly" title="Monthly" className="tab-item">
                                <div id="notifyM">
                                    </div>
                                    <div className="col-12 mb-4" id='bubble0' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    <div className="col-12 mb-4" id='bubble1' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
                                    <div className="col-12 mb-4" id='bubble2' style={{position: "relative", backgroundColor:"#152238", borderRadius:"10px"}}>
                                    </div>
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
                            </CardBody>
                            </Card>
                            </div>    
                        </div>
                    </div>
                </div>
        );
    }
}

export default Dashboard;
