import * as ActionTypes from './ActionTypes';
import { auth, firestore } from '../firebase/firebase';


export const productIdVerification = (product) => (dispatch) => {

    dispatch(requestProductId());
   var productsRef = firestore.collection("issuedProducts");
    return productsRef.where("productId", "==", product).where("active", "==", false)
        .get()
        .then(querySnapshot => {
            if (!querySnapshot.empty){
                dispatch(receiveProductId());
                alert("Device verification is successful. Proceed to Sign Up");
            }
            else {
                dispatch(productIdError("Not a valid device"));
                alert("Not a valid device");
            }
        })
        .catch(error => dispatch(productIdError(error.message)));
};

export const resetSignUpForm=() =>{
    return {
        type: ActionTypes.PRODUCTID_FAILURE
    }
}

export const requestProductId = () => {
    return {
        type: ActionTypes.PRODUCTID_REQUEST
    }
}

export const receiveProductId = () => {
    return {
        type: ActionTypes.PRODUCTID_SUCCESS,
    }
}
  
export const productIdError = (message) => {
    return {
        type: ActionTypes.PRODUCTID_FAILURE,
        message
    }
}

export const requestSignUp = () => {
    return {
        type: ActionTypes.SIGNUP_REQUEST
    }
}
  
export const receiveSignUp = (user) => {
    return {
        type: ActionTypes.SIGNUP_SUCCESS,
        user
    }
}
  
export const signUpError = (message) => {
    return {
        type: ActionTypes.SIGNUP_FAILURE,
        message
    }
}

export const signUpUser = (creds) => (dispatch) => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestSignUp());
    auth.createUserWithEmailAndPassword(creds.username,creds.password)
    .then(()=>{
        var user = auth.currentUser;
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(receiveSignUp(user));

    }).catch((err)=>{
        dispatch(signUpError());
        alert(err.message);
                })
}


    
export const authStateChange=()=>(dispatch) =>{
    return auth.onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          dispatch(receiveLogin(user));
        //   let doc=localStorage.getItem("productDocId");
        //   if(doc!=null){
        //       localStorage.removeItem("productDocId");
        //       firestore.collection("issuedProducts").doc(doc).update({
        //           active:user.uid,
        //       })
        //       .then(()=>{})
        //       .catch(()=>{})
        //   }
        } else {
          // No user is signed in.
          dispatch(loginError());
        }
      });
    }


export const requestLogin = () => {
    return {
        type: ActionTypes.LOGIN_REQUEST
    }
}
  
export const receiveLogin = (user) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        user
    }
}
  
export const loginError = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    }
}
export const loginUser = (creds) => (dispatch) => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds))

    return auth.signInWithEmailAndPassword(creds.username, creds.password)
    .then(() => {
        var user = auth.currentUser;
        localStorage.setItem('user', JSON.stringify(user));
        // Dispatch the success action
        dispatch(receiveLogin(user));
    })
    .catch(error => {
        dispatch(loginError(error.message));
        alert(error.message);
    })
};

export const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST
    }
}
  
export const receiveLogout = () => {
    return {
      type: ActionTypes.LOGOUT_SUCCESS
    }
}

// Logs the user out
export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout())
    auth.signOut().then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
    localStorage.removeItem('user');
    dispatch(receiveLogout());
}


// export const googleLogin = () => (dispatch) => {
//     const provider = new fireauth.GoogleAuthProvider();

//     auth.signInWithPopup(provider)
//         .then((result) => {
//             var user = result.user;
//             localStorage.setItem('user', JSON.stringify(user));
//             // Dispatch the success action
//             dispatch(receiveLogin(user));
//         })
//         .catch((error) => {
//             dispatch(loginError(error.message));
//         });
// }