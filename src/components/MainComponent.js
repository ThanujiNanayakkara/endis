//git log --all --decorate --oneline --graph

import React, {Component} from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import About from './AboutComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import Dashboard from './DashboardComponent';

import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import { signUpUser, loginUser, logoutUser} from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => ({
    loginUser: (creds) => dispatch(loginUser(creds)),
    signUpUser: (creds) => dispatch(signUpUser(creds)),
    logoutUser: () => dispatch(logoutUser()),
      });
  

class Main extends Component{

    componentWillUnmount() {
        this.props.logoutUser();
      }    

    render(){
        const PrivateRoute = ({ component: Component, ...rest }) => (
            <Route {...rest} render={(props) => (
              this.props.auth.isAuthenticated
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/home',
                    state: { from: props.location }
                  }} />
            )} />
          );

        return(
            <div>
                <Header auth={this.props.auth} 
                    loginUser={this.props.loginUser} 
                    logoutUser={this.props.logoutUser}
                    signUpUser={this.props.signUpUser}/>
                    <Switch>
                        <Route path = '/home' component ={ () => <Home/>} />
                        <Route exact path = '/about' component ={ () => <About/>} />
                        <Route exact path = '/contact' component ={ () => <Contact/>} />
                        <PrivateRoute exact path="/dashboard" component={() => <Dashboard />} />
                        <Redirect to="/home"/>
                    </Switch>
                <Footer/>
            </div>
        )
    }


}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));