const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require("moment");
const tf = require("@tensorflow/tfjs");
const { google } = require('googleapis');
const axios = require('axios');
const nodemailer = require('nodemailer');
//const { firestore } = require('firebase');
const ml = google.ml('v1');


admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

//   exports.scheduledEmail = functions.pubsub.schedule('20 00 01 * *')
//   .timeZone('Asia/Colombo') // Users can choose timezone - default is America/Los_Angeles
//   .onRun((context) => {
//     admin.firestore().collection("issuedProducts").where("active","==", true).get()
//     .then(querySnapshot => {
//         var productsList=[];
//         querySnapshot.forEach(doc => {
//             // doc.data() is never undefined for query doc snapshots
//             productsList.push(doc.data().productId)
//         });
//         const promises = []
//         var end = new Date(Date.now());
//         var beginningObject = new Date(end.getFullYear(), end.getMonth(), 1);//check oct18
//         var endObject = new Date(end.getFullYear(),end.getMonth(),2);
//         for (product in productsList){
//             const p = admin.firestore().collection("monthlyPowerReadings").where("productId","==", productsList[product])
//                 .where("timeFrameNo",">", beginningObject)
//                 .where("timeFrameNo", "<=", endObject)
//                 .get()
//             const q = admin.firestore().collection("monthlyAggregateData").where("productId","==", productsList[product])
//             .where("timeFrameNo",">", beginningObject)
//             .where("timeFrameNo", "<=", endObject)
//             .get()
//             const r = admin.firestore().collection("userDetails").where("productId","==", productsList[product])
//             .get()
//             const proStep1 = [p,q,r]
//             promises.push(proStep1)
//         }        
//         return Promise.all(promises.map(Promise.all, Promise))
//     }) 
//         .then(docSnapshots =>{
//             console.log(docSnapshots);
//             // const powerSum=[]
//             // const deviceTypes = ["tv","fridge","washing machine"]
//             // docSnapshots.forEach(docSnapshot => {
//             //     var sum=[0,0,0]
//             //     var productName = ""
//             //     docSnapshot.forEach(doc => {
//             //         for (device in deviceTypes){
//             //             const docdata = doc.data()[deviceTypes[device]]
//             //             for (i in docdata){
//             //                 sum[device]+= docdata[i]
//             //             }
//             //         }
//             //         productName = doc.data().productId
//             //     })
//             //     powerSum.push({[productName]: {tv: sum[0],fridge: sum[1], washingmachine:sum[2]}})
//             // })
//             // var dateO = new Date(Date.now() - 86400000)
//             // //var date = dateO.toDateString()
//             // const q = admin.firestore().collection("dailyPowerReadings").add({
//             //     data: powerSum,
//             //     timeStamp: dateO
//             // })
//             //res.send(q)
//             return 
//         })
//         .catch((error)=>{
//             console.log("error")
//             //res.status(500).send(error)
//     })        
// });
const mailTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:465,
    secure:true,
    auth:{
        user:"isurikatesting@gmail.com",
        pass:"isurika20"
    }
})

//make a scheduled function for this: nov 05
exports.ScheduledEmail = functions.https.onRequest((req, res) => {
    admin.firestore().collection("issuedProducts").where("active","==", true).get()
    .then(querySnapshot => {
        var productsList=[];
        querySnapshot.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            productsList.push(doc.data().productId)
        });
        const promises = []
        var end = new Date(Date.now());
        var beginningObject = new Date(end.getFullYear(), end.getMonth(), 1);//check oct18
        var endObject = new Date(end.getFullYear(),end.getMonth(),2);
        for (product in productsList){
            const promisesInside=[]
            const p = admin.firestore().collection("monthlyPowerReadings").where("productId","==", productsList[product])
                .where("timeStamp",">", beginningObject)
                .where("timeStamp", "<=", endObject)
                .get()
            const q = admin.firestore().collection("monthlyAggregateData").where("productId","==", productsList[product])
            .where("timeStamp",">", beginningObject)
            .where("timeStamp", "<=", endObject)
            .get()
            const r = admin.firestore().collection("userDetails").where("productId","==", productsList[product])
            .get()
            promisesInside.push(p);
            promisesInside.push(q);
            promisesInside.push(r)
            promises.push(promisesInside);
        }      
        return Promise.all(promises.map(Promise.all, Promise))
    }) 
        .then(docSnapshots =>{
            mailOptArray=[];
            docSnapshots.forEach(docSnapshotArr=>{
                let i=0;
                // const obj = {
                //     email: "",
                //     name:"",
                //     month: "",
                //     tv: "",
                //     fridge:"",
                //     washingmachine: "",
                //     total:""
                // }
                 const mailOptions={
                    from: '"Endis 👻" <elecmoni9@gmail.com>',
                    to: "",
                    subject: "Energy Usage Bill",
                    text: "No data in the database"
                }
                docSnapshotArr.forEach(docSnapshotEl=>{
                    docSnapshotEl.forEach(doc=>{
                        if(i===0){
                            // obj.tv=doc.data().tv;
                            // obj.fridge = doc.data().fridge;
                            // obj.washingmachine=doc.data().washingmachine;
                            // obj.month= doc.data().month;
                           mailOptions.text = "Energy used by the tv = " + (doc.data().tv).toString() + ". Energy used by the fridge = "+(doc.data().fridge).toString()+". Energy used by the washing machine = "+(doc.data().washingmachine).toString();
                            mailOptions.subject = mailOptions.subject+ " for the month of "+ doc.data().month
                        }
                        else if(i===1){
                            // obj.total=doc.data().data;
                           mailOptions.text = mailOptions.text + " Total energy usage = "+(doc.data().data).toString()+" ."
                        }
                        else if(i===2){
                            // obj.email=doc.data().email;
                            // obj.name=doc.data().name;
                            mailOptions.to = doc.data().email;
                            mailOptions.text= "Dear " + doc.data().name +", Your energy usage details for the previous month are as follows. " + mailOptions.text;
                        }
                    })
                    i+=1
                })
                
                mailOptArray.push(mailOptions);
            })
            promses=[];
            for (var i in mailOptArray){
                const l = mailTransport.sendMail(mailOptArray[i])
                console.log(mailOptArray[i])
                promses.push(l);
            }
            return Promise.all(promses)           
        })
        .then(()=>{
            res.send("OK");
            return
        }
        )
        .catch((error)=>{
            console.log("error")
            //res.status(500).send(error)
    })        
  });
 
 


 

//deploy this function once the AI model is deployed(Nov1)
// exports.callPaidModel = functions.firestore.document("aggregateData/{docId}")
// .onCreate((snap,context)=>{
//     const productId = snap.data().productId;
//     //var firstDay = new Date(Date.now()- 43200000)
//     return admin.firestore().collection("aggregateData").where("productId","==", productId)
//     .orderBy("timeFrameNo", "desc").limit(3).get()
//     .then((docSnaps)=>{
//         var dataArray = [];
//         for (var i in docSnaps.docs){
//             console.log(i);
//             const docData = (docSnaps.docs[2-i]).data().data;
//             for (var j in docData){
//                 dataArray.push([docData[j]]);
//             }      
//         }
//         dataArray = [dataArray];
//         let user = docSnaps.docs[0].data().productId;
//         let date = docSnaps.docs[0].data().timeFrameNo;// this should be 2(index)
//         //var input = tf.tensor(dataArray,shape=[1,1000,1],dtype="float32");
//         google.auth.getApplicationDefault( (err, authClient, projectId) => {
    
//             if (err) {
    
//                 console.log('Authentication failed because of ', err);
//                 //res.status(401).send('Authentication failed');
              
//             } else {
              
//                // create the full model name which includes the project ID
//                const modelName = 'projects/' + projectId + '/models/' + 'test_model/versions/v1';
              
//                 const mleRequestJson = {
//                     'auth': authClient,
//                     'name': modelName,
//                     'resource': {'instances' : dataArray}
//                 }
    
//                 ml.projects.predict(mleRequestJson)
//                 .then(result => {
//                     const q = admin.firestore().collection("powerDataTest").add({
//                         predictions: result.data.predictions[0].dense_8,
//                         productId: user,
//                         timeFrameNo: date,
//                         device: "fridge"
//                     })
//                     //res.send("OK")
//                     return q
    
//                 })
//                 .catch(err=>{
//                     console.log(err);
//                     console.log('Something broke, does that model exist?');
//                     //res.status(400).send('Something broke, does that model exist?');
//                 })
//               }
//         });
//            })
//     .catch((err)=>{
//         console.log(err);
//     })
// })


// exports.callModel = functions.firestore.document("aggregateData/{docId}")
// .onCreate((snap,context)=>{
//     const productId = snap.data().productId;
//     //var firstDay = new Date(Date.now()- 43200000)
//     return admin.firestore().collection("aggregateData").where("productId","==", productId)
//     .orderBy("timeFrameNo", "desc").limit(3).get()
//     .then((docSnaps)=>{
//         var dataArray = [];
//         for (var i in docSnaps.docs){
//             console.log(i);
//             const docData = (docSnaps.docs[2-i]).data().data;
//             for (var j in docData){
//                 dataArray.push([docData[j]]);
//             }      
//         }
//         dataArray = [dataArray];
//         let user = docSnaps.docs[0].data().productId;
//         let date = docSnaps.docs[0].data().timeFrameNo;// this should be 2(index)
//         var input = tf.tensor(dataArray,shape=[1,1000,1],dtype="float32");
//         return predict(input)
//             .then((pred) => { 
//                 const q = admin.firestore().collection("powerDataTest").add({
//                     tv: Array.from(pred),//field should be data and another field named device with value tv
//                     timeFrameNo: date,
//                     productId: user
//                 })
//                 return(q);
//             })
//             .catch((error)=>{
//                 console.log("error");
//             });
//            })
//     .catch((err)=>{
//         console.log(err);
//     })
// })




//   async function predict(data) {
//    let model = await tf.loadLayersModel(
//       "https://firebasestorage.googleapis.com/v0/b/elecmoni.appspot.com/o/model.json?alt=media&token=63fa3a5c-2fef-4a1c-884b-d14d4bb17241"
//     );
    
//     return model.predict(data).dataSync(); }
 




// exports.getAggData = functions.https.onRequest((request, response) => {
//     var arr = [];
//     let data= request.body.array;
//     var dat = data.slice(1,data.length-1);
//     dat = dat.split(",");
//     for (var i in dat){
//         arr.push(parseInt(dat[i]));
//     }
//     return admin.firestore().collection("aggregateData").add({
//         data: arr,
//         timeFrameNo: new Date(request.body.time),
//         productId: request.body.user
//     }).then(()=>{
//         response.send("OK");
//         return;
//     }).catch((err)=>{
//         console.log(err);
//         response.send("error");
//     })


// });


// exports.helloWorldNew = functions.https.onRequest((request, response) => {
//     console.log(request.body.name);
//     console.log(request.body);


//  response.send("Hello from Firebase!" + request.body.name);
// });
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.

//best method for calling deployed ml models
// exports.getPrediction = functions.https.onRequest((req, res) => {

//     google.auth.getApplicationDefault( (err, authClient, projectId) => {

//         res.header('Content-Type','application/json');
//         res.header('Access-Control-Allow-Origin', 'https://storage.googleapis.com');
//         res.header('Access-Control-Allow-Headers', 'Content-Type');

//         //respond to CORS preflight requests
//         if (req.method === 'OPTIONS') {
//             res.status(204).send('');
//             return;
//         }

//         if (err) {

//             console.log('Authentication failed because of ', err);
//             res.status(401).send('Authentication failed');
          
//         } else {
          
//            // create the full model name which includes the project ID
//            const modelName = 'projects/' + projectId + '/models/' + req.body.model;
          
//             const mleRequestJson = {
//                 'auth': authClient,
//                 'name': modelName,
//                 'resource': {'instances' : req.body.instances}
//             }

//             ml.projects.predict(mleRequestJson)
//             .then(result => {
//                 const q = admin.firestore().collection("testData").add({
//                     predictions: result.data.predictions[0].dense_2
//                 })
//                 res.send("OK")
//                 return q

//             })
//             .catch(err=>{
//                 console.log(err);
//                 res.status(400).send('Something broke, does that model exist?');
//             })
//           }
//     });
// });

// //best method for calling all ml models at once in order to write data of all devices to the same doc in firestore
// //not tested yet
// exports.getPredictionAll = functions.https.onRequest((req, res) => {

//     google.auth.getApplicationDefault( (err, authClient, projectId) => {

//         res.header('Content-Type','application/json');
//         res.header('Access-Control-Allow-Origin', 'https://storage.googleapis.com');
//         res.header('Access-Control-Allow-Headers', 'Content-Type');

//         //respond to CORS preflight requests
//         if (req.method === 'OPTIONS') {
//             res.status(204).send('');
//             return;
//         }

//         if (err) {

//             console.log('Authentication failed because of ', err);
//             res.status(401).send('Authentication failed');
          
//         } else {          
//            // create the full model name which includes the project ID
//            var modelRequests=[]
//            for (var i ; i< req.body.devices; i++){
//             const modelName = 'projects/' + projectId + '/models/' + req.body.model;
//             const mleRequestJson = {
//                 'auth': authClient,
//                 'name': modelName,
//                 'resource': {'instances' : req.body.instances[i]}
//             }
//             modelRequests.push(mleRequestJson);
//            }
//            var promises =[]
//            for (var request in modelRequests){
//                const p = ml.projects.predict(modelRequests[request])
//                promises.push(p)
//            }
//            return Promise.all(promises)
//             .then(result => {
//                 const q = admin.firestore().collection("testData").add({
//                     tv: result[0].data.predictions[0].dense_2,
//                     fridge: result[1].data.predictions[0].dense_2,
//                     washingmachine: result[2].data.predictions[0].dense_2,
//                 })
//                 res.send("OK")
//                 return q

//             })
//             .catch(err=>{
//                 console.log(err);
//                 res.status(400).send('Something broke, does that model exist?');
//             })
//           }
//     });
// });
 
//authentication trigger function
// exports.userJoined= functions.auth.user()
//     .onCreate(user=>{
//         //console.log('user created',user.email,user.uid);
//         return admin.firestore().collection('userDetails')
//         .doc(user.uid).set({
//             email:user.email,
//             productId: "",
//             token: ""
//         });

// });

// //authentication trigger function
// exports.userDeleted= functions.auth.user()
//     .onDelete(user=>{
//         //console.log('user created',user.email,user.uid);
//         const doc = admin.firestore().collection('userDetails').doc(user.uid);
//         return doc.delete();

// });

// exports.sendNotifications = functions.firestore
//   .document('powerDataTest/{docid}')
//   .onCreate((snap, context) => {
//       const deviceLimits = {
//           tv: 200,
//           fridge:500,
//           washingmachine:500
//       }
//       const device = snap.data().device;
//       const dataArray = snap.data()[device];
//       const product = snap.data().productId;
//       let count = 0;
//       for (var data in dataArray ){
//         if (dataArray[data]>deviceLimits[device]){
//             count= count + 1;
//         }
//         if(count>5){
//             console.log("count exceeded");
//             const payload = {
//                 notification: {
//                   title: `Alert!`,
//                   body: "Your " + device + " is indicating an abnormal power consumption. Please check.",
//                   click_action: "https://elecmoni.web.app"
//                 }

//               };
//             return admin.firestore().collection("userDetails").where("productId","==",product).get()
//             .then(querSnapshot=>{
//                 if(!querSnapshot.empty){
                    
//                     if(querSnapshot.docs[0].data().token !== ""){
//                         var token = [];
//                         token.push(querSnapshot.docs[0].data().token);
//                         return admin.messaging().sendToDevice(token,payload)
//                         .then((response)=>{
//                             console.log("response");
//                             return response;})
//                         .catch((err)=>{
//                             console.log("Error sending notification");
//                             console.log(err);
//                     })
//                     }
//                 }
//                 return null;
//             })
//             .catch((err)=>{
//                 console.log("Error in getting user info");
//                 console.log(err);
//         })
//         }
//       }
      
//   });


//Scheduled function to run at midnight everyday to calculate the power usage of each device in the previous day 
//(If power usage of all devices at a specific time frame is stored in one doc )
//   exports.scheduledFunctionCrontab = functions.pubsub.schedule('00 00 * * *')
//   .timeZone('Asia/Colombo') // Users can choose timezone - default is America/Los_Angeles
//   .onRun((context) => {
//     admin.firestore().collection("issuedProducts").where("active","==", true).get()
//     .then(querySnapshot => {
//         var productsList=[];
//         querySnapshot.forEach(doc => {
//             // doc.data() is never undefined for query doc snapshots
//             productsList.push(doc.data().productId)
//         });
//         const promises = []
//         var beginningDate = new Date(Date.now() - 42300000);
//         var beginningObject = new Date(beginningDate.getFullYear(),beginningDate.getMonth(),beginningDate.getDate());
//         var endDate = new Date(Date.now());
//         var endObject = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate())
//         for (product in productsList){
//             const p = admin.firestore().collection("powerData").where("productId","==", productsList[product])
//                 .where("timeFrameNo",">", beginningObject)
//                 .where("timeFrameNo", "<=", endObject)
//                 .get()
//             promises.push(p)
//         }        
//         return Promise.all(promises)
//     }) 
//         .then(docSnapshots =>{
//             const powerSum=[]
//             const deviceTypes = ["tv","fridge","washing machine"]
//             docSnapshots.forEach(docSnapshot => {
//                 var sum=[0,0,0]
//                 var productName = ""
//                 docSnapshot.forEach(doc => {
//                     for (device in deviceTypes){
//                         const docdata = doc.data()[deviceTypes[device]]
//                         for (i in docdata){
//                             sum[device]+= docdata[i]
//                         }
//                     }
//                     productName = doc.data().productId
//                 })
//                 powerSum.push({[productName]: {tv: sum[0],fridge: sum[1], washingmachine:sum[2]}})
//             })
//             var dateO = new Date(Date.now() - 86400000)
//             //var date = dateO.toDateString()
//             const q = admin.firestore().collection("dailyPowerReadings").add({
//                 data: powerSum,
//                 timeStamp: dateO
//             })
//             //res.send(q)
//             return q
//         })
//         .catch((error)=>{
//             console.log("error")
//             //res.status(500).send(error)
//     })        
// });

// //Scheduled function to run at midnight everyday to calculate the power usage of each device in the previous day 
// //(If power usage of different devices at a specific time frame is stored in differnet docs (one doc per one time frame for one device) )
// exports.scheduledFunctionCrontabD = functions.pubsub.schedule('00 00 * * *')
//   .timeZone('Asia/Colombo') // Users can choose timezone - default is America/Los_Angeles
//   .onRun((context) => {
//     admin.firestore().collection("issuedProducts").where("active","==", true).get()
//     .then(querySnapshot => {
//         var productsList=[];
//         querySnapshot.forEach(doc => {
//             // doc.data() is never undefined for query doc snapshots
//             productsList.push(doc.data().productId)
//         });
//         const promises = []
//         var beginningDate = new Date(Date.now() - 42300000);
//         var beginningObject = new Date(beginningDate.getFullYear(),beginningDate.getMonth(),beginningDate.getDate());
//         var endDate = new Date(Date.now());
//         var endObject = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate())
//         for (product in productsList){
//             const p = admin.firestore().collection("powerData").where("productId","==", productsList[product])
//                 .where("timeFrameNo",">", beginningObject)
//                 .where("timeFrameNo", "<=", endObject)
//                 .get()
//             promises.push(p)
//         }        
//         return Promise.all(promises)
//     }) 
//         .then(docSnapshots =>{
//             const powerSum=[]
//             const deviceTypes = ["tv","fridge","washing machine"]
//             docSnapshots.forEach(docSnapshot => {
//                 var sum=[0,0,0]
//                 var productName = "None"
//                 docSnapshot.forEach(doc => {
//                     for (device in deviceTypes){
//                         if(doc.data().device === deviceTypes[device]){
//                             const docdata = doc.data()[deviceTypes[device]]
//                             for (i in docdata){
//                                 sum[device]+= docdata[i]
//                             }
//                             break;
//                         }                        
//                     }
//                     productName = doc.data().productId
//                 })
//                 powerSum.push({[productName]: {tv: sum[0],fridge: sum[1], washingmachine:sum[2]}})
//             })
//             var dateO = new Date(Date.now() - 86400000)
//             //var date = dateO.toDateString()
//             const q = admin.firestore().collection("dailyPowerReadings").add({
//                 data: powerSum,
//                 timeStamp: dateO
//             })
//             //res.send(q)
//             return q
//         })
//         .catch((error)=>{
//             console.log("error")
//             res.status(500).send(error)
//     })        
// });

//cost free method for calling one ml model at a time 
// exports.predict = functions.https.onRequest((req, res) => {
//     // var b = new Array(1000).fill(1)
//     let data = req.body.samples; 
//     var input = tf.tensor(data,shape=[1,1000,1],dtype="float32");
//     //var input = tf.ones([1,1000,1])
//     predict(input)
//     .then((pred) => {
//         let user = req.body.user;
//         var date = new Date(Date.now())
//         const q = admin.firestore().collection("powerDataTest").add({
//             tv: Array.from(pred),
//             timeFrameNo: date,
//             productId: user
//         })
//         res.status(200).send("OK");
//         return(Array.from(pred));
//     })
//     .catch((error)=>{
//         console.log("error")
//         res.status(500).send(error)
//     });
//   });

// //cost free method for calling all ml models at once in order to write data of all devices to the same doc in firestore
//   exports.predictAll = functions.https.onRequest((req, res) => {
//     var data = [req.body.tvSamples, req.body.fridgeSamples];
//     var shapeAr = [1000,1000]
//     var promises = []
//     for (var i in shapeAr){
//         var input = tf.tensor(data[i],shape=[1,shapeAr[i],1],dtype="float32");
//         const p = predict(input)
//         promises.push(p)
//     }
//     Promise.all(promises)
//     .then((preds) => {
//         let user = req.body.user;
//         var date = new Date(Date.now())
//         const q = admin.firestore().collection("powerDataTest").add({
//             tv: Array.from(preds[0]),
//             fridge: Array.from(preds[1]),
//             timeFrameNo: date,
//             productId: user
//         })
//         res.status(200).send("OK");
//         return(q);
//     })
//     .catch((error)=>{
//         console.log("Error")
//         res.status(500).send(error)
//     });
//   });

//   async function predict(data) {
//    let model = await tf.loadLayersModel(
//       "https://firebasestorage.googleapis.com/v0/b/elecmoni.appspot.com/o/model.json?alt=media&token=63fa3a5c-2fef-4a1c-884b-d14d4bb17241"
//     );
//     //let input = tf.tensor3d(data);
//     //console.log(model)
    
//     //input = input.expandDims(0);
//     return model.predict(data).dataSync();
//   }
 
// //http function to test on scheduled functions
// exports.onScheduleD = functions.https.onRequest((req, res) => {   
//     admin.firestore().collection("issuedProducts").where("active","==", true).get()
//     .then(querySnapshot => {
//         var productsList=[];
//         querySnapshot.forEach(doc => {
//             // doc.data() is never undefined for query doc snapshots
//             productsList.push(doc.data().productId)
//         });
//         const promises = []
//         // var beginningDate = new Date(Date.now() - 84600000);
//         // var beginningObject = new Date(beginningDate.getFullYear(),beginningDate.getMonth(),beginningDate.getDate());
//         // var endDate = new Date(Date.now());
//         // var endObject = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate())
//         var end = new Date(Date.now());
//         var beginningObject = new Date(end.getFullYear(), end.getMonth(), 1);
//         var endObject = new Date(end.getFullYear(),end.getMonth(),end.getDate());
//         for (product in productsList){
//             const p = admin.firestore().collection("powerDataTest").where("productId","==", productsList[product])
//                 .where("timeFrameNo",">", beginningObject)
//                 .where("timeFrameNo", "<=", endObject)
//                 .get()
//             promises.push(p)
//         }        
//         return Promise.all(promises)
//     }) 
//         .then(docSnapshots =>{
//             const prom=[]
//             const powerSum=[]
//             const deviceTypes = ["tv","fridge","washing machine"]
//             var dateO = new Date(Date.now() - 86400000)
//             docSnapshots.forEach(docSnapshot => {
//                 var sum=[0,0,0]
//                 var productName = "None"
//                 docSnapshot.forEach(doc => {
//                     //console.log(doc.data().device)
//                     for (var device in deviceTypes){
//                         if(doc.data().device === deviceTypes[device]){
//                             const docdata = doc.data()[deviceTypes[device]]
//                             for (i in docdata){
//                                 sum[device]+= docdata[i]
//                             }
//                         } 
//                     }
//                     productName = doc.data().productId
//                 })
//                 powerSum.push({[productName]: {tv: sum[0],fridge: sum[1], washingmachine:sum[2]}})
//                 //console.log(powerSum)
//                 const q = admin.firestore().collection("dailyPowerReadings").add({
//                 productId: productName,
//                 tv: sum[0],
//                 fridge: sum[1], 
//                 washingmachine:sum[2],
//                 timeStamp:dateO })
//                 prom.push(q)
//             })
//             res.send("OK")
//             return Promise.all(prom)
//             // var dateO = new Date(Date.now() - 86400000)
//             // const q = admin.firestore().collection("dailyPowerReadings").add({
//             //     data: powerSum,
//             //     timeStamp: dateO
//             // })
//             //res.send("OK")
//             ///return q
//         })
//         .catch((error)=>{
//             console.log("error")
//             res.status(500).send(error)
//     })        
//   })

//   exports.dailyScheduleInfer = functions.pubsub.schedule('05 00 * * *')
//     .timeZone('Asia/Colombo') // Users can choose timezone - default is America/Los_Angeles
//     .onRun((context) => {
//     admin.firestore().collection("issuedProducts").where("active","==", true).get()
//     .then(querySnapshot => {
//         var productsList=[];
//         querySnapshot.forEach(doc => {
//             // doc.data() is never undefined for query doc snapshots
//             productsList.push(doc.data().productId)
//         });
//         const promises = []
//         var beginningDate = new Date(Date.now() - 84600000);
//         var beginningObject = new Date(beginningDate.getFullYear(),beginningDate.getMonth(),beginningDate.getDate());
//         var endDate = new Date(Date.now());
//         var endObject = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate())
//         // var end = new Date(Date.now());
//         // var beginningObject = new Date(end.getFullYear(), end.getMonth(), 1);
//         // var endObject = new Date(end.getFullYear(),end.getMonth(),end.getDate());
//         for (product in productsList){
//             const p = admin.firestore().collection("powerDataTest").where("productId","==", productsList[product])
//                 .where("timeFrameNo",">", beginningObject)
//                 .where("timeFrameNo", "<=", endObject)
//                 .get()
//             promises.push(p)
//         }        
//         return Promise.all(promises)
//     }) 
//         .then(docSnapshots =>{
//             const prom=[]
//             const powerSum=[]
//             const deviceTypes = ["tv","fridge","washing machine"]
//             var dateO = new Date(Date.now() - 86400000)
//             docSnapshots.forEach(docSnapshot => {
//                 var sum=[0,0,0]
//                 var productName = "None"
//                 docSnapshot.forEach(doc => {
//                     //console.log(doc.data().device)
//                     for (var device in deviceTypes){
//                         if(doc.data().device === deviceTypes[device]){
//                             const docdata = doc.data()[deviceTypes[device]]
//                             for (i in docdata){
//                                 sum[device]+= docdata[i]
//                             }
//                             break;//Added oct18
//                         } 
//                     }
//                     productName = doc.data().productId
//                 })
//                 //powerSum.push({[productName]: {tv: sum[0],fridge: sum[1], washingmachine:sum[2]}})
//                 //console.log(powerSum)
//                 const q = admin.firestore().collection("dailyPowerReadings").add({
//                 productId: productName,
//                 tv: sum[0],
//                 fridge: sum[1], 
//                 washingmachine:sum[2],
//                 timeStamp:dateO })
//                 prom.push(q)
//             })
//             res.send("OK")
//             return Promise.all(prom)
//             // var dateO = new Date(Date.now() - 86400000)
//             // const q = admin.firestore().collection("dailyPowerReadings").add({
//             //     data: powerSum,
//             //     timeStamp: dateO
//             // })
//             //res.send("OK")
//             ///return q
//         })
//         .catch((error)=>{
//             console.log("error")
//             res.status(500).send(error)
//     })       
//   });

//   exports.dailyScheduleAgg = functions.pubsub.schedule('05 00 * * *')
//   .timeZone('Asia/Colombo') // Users can choose timezone - default is America/Los_Angeles
//   .onRun((context) => {
//   admin.firestore().collection("issuedProducts").where("active","==", true).get()
//   .then(querySnapshot => {
//       var productsList=[];
//       querySnapshot.forEach(doc => {
//           // doc.data() is never undefined for query doc snapshots
//           productsList.push(doc.data().productId)
//       });
//       const promises = []
//       var beginningDate = new Date(Date.now() - 84600000);
//       var beginningObject = new Date(beginningDate.getFullYear(),beginningDate.getMonth(),beginningDate.getDate());
//       var endDate = new Date(Date.now());
//       var endObject = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate())
//       // var end = new Date(Date.now());
//       // var beginningObject = new Date(end.getFullYear(), end.getMonth(), 1);
//       // var endObject = new Date(end.getFullYear(),end.getMonth(),end.getDate());
//       for (product in productsList){
//           const p = admin.firestore().collection("aggregateData").where("productId","==", productsList[product])
//               .where("timeFrameNo",">", beginningObject)
//               .where("timeFrameNo", "<=", endObject)
//               .get()
//           promises.push(p)
//       }        
//       return Promise.all(promises)
//   }) 
//       .then(docSnapshots =>{
//           const prom=[];
//           var dateO = new Date(Date.now() - 86400000)
//           docSnapshots.forEach(docSnapshot => {
//               var sum=[0,0,0];
//               var productName = "None";
//               docSnapshot.forEach(doc => {
//                   //console.log(doc.data().device)                                      
//                     const docdata = doc.data().data;
//                     for (i in docdata){
//                         sum += docdata[i];
//                     }                  
//                   productName = doc.data().productId;
//               })
              
//               const q = admin.firestore().collection("dailyAggregateData").add({
//               productId: productName,
//               data:sum,
//               date:dateO })
//               prom.push(q)
//           })
//           res.send("OK")
//           return Promise.all(prom)
//           // var dateO = new Date(Date.now() - 86400000)
//           // const q = admin.firestore().collection("dailyPowerReadings").add({
//           //     data: powerSum,
//           //     timeStamp: dateO
//           // })
//           //res.send("OK")
//           ///return q
//       })
//       .catch((error)=>{
//           console.log("error")
//           res.status(500).send(error)
//   })       
// });

//   exports.Monthly = functions.https.onRequest((req, res) => {
//     admin.firestore().collection("issuedProducts").where("active","==", true).get()
//     .then(querySnapshot => {
//         var productsList=[];
//         querySnapshot.forEach(doc => {
//             // doc.data() is never undefined for query doc snapshots
//             productsList.push(doc.data().productId)
//         });
//         const promises = []
//         var end = new Date(Date.now());
//         var beginningObject = new Date(end.getFullYear(), end.getMonth(), 1);
//         var endObject = new Date(end.getFullYear(),end.getMonth(),end.getDate());
//         for (product in productsList){
//             const p = admin.firestore().collection("dailyPowerReadings").where("productId","==", productsList[product])
//                 .where("timeStamp",">", beginningObject)
//                 .where("timeStamp", "<=", endObject)
//                 .get()
//             promises.push(p)
//         }        
//         return Promise.all(promises)
//     }) 
//         .then(docSnapshots =>{
//             const prom=[]
//             const deviceTypes = ["tv","fridge","washingmachine"]
//             docSnapshots.forEach(docSnapshot => {
//                 var sum=[0,0,0]
//                 var productName = "None"
//                 docSnapshot.forEach(doc => {
//                     for (var device in deviceTypes){
//                         if(doc.data()[deviceTypes[device]]!== undefined){
//                             sum[device]+= doc.data()[deviceTypes[device]]                            
//                         } 
//                     }
//                     productName = doc.data().productId
//                 })
//                 var months = ["Jan","Feb","Mar","April","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
//                 var end = new Date(Date.now()-43200000);
//                 var month = months[end.getMonth()];
//                 const q = admin.firestore().collection("monthlyPowerReadings").add({
//                 productId: productName,
//                 tv: sum[0],
//                 fridge: sum[1], 
//                 washingmachine:sum[2],
//                 month:month,
//                 timeStamp: end })
//                 prom.push(q)
//             })
//             res.send("OK")
//             return Promise.all(prom)
//         })
//         .catch((error)=>{
//             console.log("error")
//             res.status(500).send(error)
//     })        
    
//   });
 
//   exports.monthlyScheduleInfer = functions.pubsub.schedule('10 00 01 * *')
//   .timeZone('Asia/Colombo') // Users can choose timezone - default is America/Los_Angeles
//   .onRun((context) => {
//     admin.firestore().collection("issuedProducts").where("active","==", true).get()
//     .then(querySnapshot => {
//         var productsList=[];
//         querySnapshot.forEach(doc => {
//             // doc.data() is never undefined for query doc snapshots
//             productsList.push(doc.data().productId)
//         });
//         const promises = []
//         var end = new Date(Date.now());
//         var beginningObject = new Date(end.getFullYear(), end.getMonth()-1, 1);//check oct18
//         var endObject = new Date(end.getFullYear(),end.getMonth(),end.getDate());
//         for (product in productsList){
//             const p = admin.firestore().collection("dailyPowerReadings").where("productId","==", productsList[product])
//                 .where("timeStamp",">", beginningObject)
//                 .where("timeStamp", "<=", endObject)
//                 .get()
//             promises.push(p)
//         }        
//         return Promise.all(promises)
//     }) 
//         .then(docSnapshots =>{
//             const prom=[]
//             const deviceTypes = ["tv","fridge","washingmachine"]
//             docSnapshots.forEach(docSnapshot => {
//                 var sum=[0,0,0]
//                 var productName = "None"
//                 docSnapshot.forEach(doc => {
//                     for (var device in deviceTypes){
//                         if(doc.data()[deviceTypes[device]]!== undefined){
//                             sum[device]+= doc.data()[deviceTypes[device]]                            
//                         } 
//                     }
//                     productName = doc.data().productId
//                 })
//                 var months = ["Jan","Feb","Mar","April","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
//                 var end = new Date(Date.now()-43200000);
//                 var month = months[end.getMonth()];
//                 const q = admin.firestore().collection("monthlyPowerReadings").add({
//                 productId: productName,
//                 tv: sum[0],
//                 fridge: sum[1], 
//                 washingmachine:sum[2],
//                 month:month,
//                 timeStamp: end })
//                 prom.push(q)
//             })
//             res.send("OK")
//             return Promise.all(prom)
//         })
//         .catch((error)=>{
//             console.log("error")
//             res.status(500).send(error)
//     }) 
// });

// exports.monthlyScheduleAgg = functions.pubsub.schedule('10 00 01 * *')
//   .timeZone('Asia/Colombo') // Users can choose timezone - default is America/Los_Angeles
//   .onRun((context) => {
//     admin.firestore().collection("issuedProducts").where("active","==", true).get()
//     .then(querySnapshot => {
//         var productsList=[];
//         querySnapshot.forEach(doc => {
//             // doc.data() is never undefined for query doc snapshots
//             productsList.push(doc.data().productId)
//         });
//         const promises = []
//         var end = new Date(Date.now());
//         var beginningObject = new Date(end.getFullYear(), end.getMonth()-1, 1);
//         var endObject = new Date(end.getFullYear(),end.getMonth(),end.getDate());
//         for (product in productsList){
//             const p = admin.firestore().collection("dailyAggregateData").where("productId","==", productsList[product])
//                 .where("date",">", beginningObject)
//                 .where("date", "<=", endObject)
//                 .get()
//             promises.push(p)
//         }        
//         return Promise.all(promises)
//     }) 
//         .then(docSnapshots =>{
//             const prom=[]
//             //const deviceTypes = ["tv","fridge","washingmachine"]
//             docSnapshots.forEach(docSnapshot => {
//                 //var sum=[0,0,0]
//                 var sum = 0;
//                 var productName = "None"
//                 docSnapshot.forEach(doc => {                       
//                     sum+= doc.data().data;                                              
//                     productName = doc.data().productId
//                 })
//                 var months = ["Jan","Feb","Mar","April","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
//                 var end = new Date(Date.now()-43200000);
//                 var month = months[end.getMonth()];
//                 const q = admin.firestore().collection("monthlyAggregateData").add({
//                 productId: productName,
//                 data:sum,
//                 month:month,
//                 timeStamp: end })
//                 prom.push(q)
//             })
//             res.send("OK")
//             return Promise.all(prom)
//         })
//         .catch((error)=>{
//             console.log("error")
//             res.status(500).send(error)
//     }) 
// });


// exports.monthly = functions.https.onRequest((req, res) => {
//     admin.firestore().collection("issuedProducts").where("active","==", true).get()
//     .then(querySnapshot => {
//         var productsList=[];
//         querySnapshot.forEach(doc => {
//             // doc.data() is never undefined for query doc snapshots
//             productsList.push(doc.data().productId)
//         });
//         const promises = []
//         var beg = new Date(Date.now()-43200000);
//         var end = new Date(Date.now());
//         var firstDay = new Date(beg.getFullYear(), beg.getMonth(), 1);
//         var endObj = new Date(end.getFullYear(),end.getMonth(),end.getDate());
//         for (product in productsList){
//             const p = admin.firestore().collection("powerData").where("productId","==", productsList[product])
//                 .where("timeFrameNo",">", firstDay)
//                 .where("timeFrameNo", "<=", endObj)
//                 .get()
//             promises.push(p)
//         }        
//         return Promise.all(promises)
//     }) 
//         .then(docSnapshots =>{
//             const powerSum=[]
//             const deviceTypes = ["tv","fridge","washing machine"]
//             docSnapshots.forEach(docSnapshot => {
//                 var sum=[0,0,0]
//                 var productName = "None"
//                 docSnapshot.forEach(doc => {
//                     for (device in deviceTypes){
//                         const docdata = doc.data()[deviceTypes[device]]
//                         for (i in docdata){
//                             sum[device]+= docdata[i]
//                         }
//                     }
//                     productName = doc.data().productId
//                 })
//                 powerSum.push({[productName]: {tv: sum[0],fridge: sum[1], washingmachine:sum[2]}})
//             })
//             var months = ["Jan","Feb","Mar","April","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
//             var end = new Date(Date.now()-43200000);
//             var month = months[end.getMonth()];
//             const q = admin.firestore().collection("monthlyPowerReadings").add({
//                 data: powerSum,
//                 month: month
//             })
//             res.send("OK")
//             return q
//         })
//         .catch((error)=>{
//             console.log("error")
//             res.status(500).send(error)
//     }) 
//   });

//   exports.scheduledMonthly = functions.pubsub.schedule('10 00 01 * *')
//   .timeZone('Asia/Colombo') // Users can choose timezone - default is America/Los_Angeles
//   .onRun((context) => {
//     admin.firestore().collection("issuedProducts").where("active","==", true).get()
//     .then(querySnapshot => {
//         var productsList=[];
//         querySnapshot.forEach(doc => {
//             // doc.data() is never undefined for query doc snapshots
//             productsList.push(doc.data().productId)
//         });
//         const promises = []
//         var beg = new Date(Date.now()-43200000);
//         var end = new Date(Date.now());
//         var firstDay = new Date(beg.getFullYear(), beg.getMonth(), 1);
//         var endObj = new Date(end.getFullYear(),end.getMonth(),end.getDate());
//         for (product in productsList){
//             const p = admin.firestore().collection("powerData").where("productId","==", productsList[product])
//                 .where("timeFrameNo",">", firstDay)
//                 .where("timeFrameNo", "<=", endObj)
//                 .get()
//             promises.push(p)
//         }        
//         return Promise.all(promises)
//     }) 
//         .then(docSnapshots =>{
//             const powerSum=[]
//             const deviceTypes = ["tv","fridge","washing machine"]
//             docSnapshots.forEach(docSnapshot => {
//                 var sum=[0,0,0]
//                 var productName = "None"
//                 docSnapshot.forEach(doc => {
//                     for (device in deviceTypes){
//                         const docdata = doc.data()[deviceTypes[device]]
//                         for (i in docdata){
//                             sum[device]+= docdata[i]
//                         }
//                     }
//                     productName = doc.data().productId
//                 })
//                 powerSum.push({[productName]: {tv: sum[0],fridge: sum[1], washingmachine:sum[2]}})
//             })
//             var months = ["Jan","Feb","Mar","April","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
//             var end = new Date(Date.now()-43200000);
//             var month = months[end.getMonth()];
//             const q = admin.firestore().collection("monthlyPowerReadings").add({
//                 data: powerSum,
//                 month: month,
//                 timeStamp: end
//             })
//             //res.send("OK")
//             return q
//         })
//         .catch((error)=>{
//             console.log("error")
//             //res.status(500).send(error)
//     })    
// });