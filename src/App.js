import React, {Component} from 'react';
import Main from './components/MainComponent';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

const store = ConfigureStore();

// if(localStorage.getItem('user')){
//   store.dispatch(authStateChange());
// }

class App extends Component {

  componentDidMount(){
  }
  render(){
  return (
    <Provider store={store}>

        <BrowserRouter >
        <div >     
          <Main/>      
        </div>
      </BrowserRouter>
      
    </Provider>
    
  );
  }
}

export default App;

