import { createStore, combineReducers, applyMiddleware} from 'redux';
import { Auth } from './auth';
import { Product } from './productIds';
import thunk from 'redux-thunk';
import logger from 'redux-logger';


export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            auth: Auth,
            product:Product,
        }),
        applyMiddleware(thunk, logger))
    

    return store;
}