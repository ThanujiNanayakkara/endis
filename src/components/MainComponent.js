//git log --all --decorate --oneline --graph

import React, {Component} from 'react';

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import About from './AboutComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';

import {Switch, Route, Redirect, withRouter} from 'react-router-dom';


class Main extends Component{

    render(){
        return(
            <div>
                <Header/>
                    <Switch>
                        <Route path = '/home' component ={ () => <Home/>} />
                        <Route exact path = '/about' component ={ () => <About/>} />
                        <Route exact path = '/contact' component ={ () => <Contact/>} />
                        <Redirect to="/home"/>
                    </Switch>
                <Footer/>
            </div>
        )
    }


}


export default Main;