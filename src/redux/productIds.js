import * as ActionTypes from './ActionTypes';

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.
export const Product = (state = {
        isLoading: false,
        isVerified: false,
        errMess: null
    }, action) => {
    switch (action.type) { 
        case ActionTypes.PRODUCTID_REQUEST:
            return {...state,
                isLoading: true,
                isVerified: false,
            };  
        case ActionTypes.PRODUCTID_SUCCESS:
            console.log("state");
            return {...state,
                isLoading: false,
                isVerified: true,
                errMess: '',
            };
        case ActionTypes.PRODUCTID_FAILURE:
            return {...state,
                isLoading: false,
                isVerified: false,
                errMess: action.message
            };        
        default:
            return state
    }
}