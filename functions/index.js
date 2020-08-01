const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require("moment");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
 

exports.userJoined= functions.auth.user()
    .onCreate(user=>{
        //console.log('user created',user.email,user.uid);
        return admin.firestore().collection('userDetails')
        .doc(user.uid).set({
            email:user.email,
            productId: ""
        });

});

exports.userDeleted= functions.auth.user()
    .onDelete(user=>{
        //console.log('user created',user.email,user.uid);
        const doc = admin.firestore().collection('userDetails').doc(user.uid);
        return doc.delete();

});
exports.onSchedule = functions.https.onRequest((req, res) => {   
    admin.firestore().collection("issuedProducts").where("active","==", true).get()
    .then(querySnapshot => {
        var productsList=[];
        querySnapshot.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            productsList.push(doc.data().productId)
        });
        const promises = []
        var beginningDate = Date.now() - 345600000 ;
        var beginningDateObject = new Date(beginningDate);
        var endObject = new Date(Date.now() - 259200000)
        for (product in productsList){
            const p = admin.firestore().collection("powerData").where("productId","==", productsList[product])
                .where("timeFrameNo",">", beginningDateObject)
                .where("timeFrameNo", "<=", endObject)
                .get()
            promises.push(p)
        }        
        return Promise.all(promises)
    }) 
        .then(docSnapshots =>{
            const powerSum=[]
            const deviceTypes = ["tv","fridge","washing machine"]
            docSnapshots.forEach(docSnapshot => {
                var sum=[0,0,0]
                var productName = ""
                docSnapshot.forEach(doc => {
                    for (device in deviceTypes){
                        const docdata = doc.data()[deviceTypes[device]]
                        for (i in docdata){
                            sum[device]+= docdata[i]
                        }
                    }
                    productName = doc.data().productId
                })
                powerSum.push({[productName]: {tv: sum[0],fridge: sum[1], washingmachine:sum[2]}})
            })
            var dateO = new Date(Date.now() - 86400000)
            //var date = dateO.toDateString()
            const q = admin.firestore().collection("dailyPowerReadings").add({
                data: powerSum,
                timeStamp: dateO
            })
            res.send(q)
            return q
        })
        .catch((error)=>{
            console.log("error")
            res.status(500).send(error)
    })        
  })

