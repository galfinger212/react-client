import 'App.css';

import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { AuthContext } from "./context/AuthContext";
import { useContext, useEffect } from 'react';
import axios from "axios";
import { logoutCall } from "./apiCalls";
import config from '../src/config';

import Home from 'Views/Home/Home';
import TopBar from './components/topbar/Topbar'
import ContactScreen from 'Views/ContactScreen/ContactScreen';
import Login from 'Views/Login/Login';
import Register from "Views/Register/Register";
import SignOut from "Views/signOut/signOut";
import HowToPlay from "Views/HowToPlay/HowToPlay";
import About from "Views/About/About";

const App = () => {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);
  useEffect(async () => {
    console.log(window.location.href);
    console.log(window.location.pathname);
    if (user) {
      await axios.get(config.url + `/auth/isUserAuth`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }).then((response) => {
        if (response.data.auth === false) {
          alert("your token is expired")
          logoutCall(dispatch);
        }
      }).catch((err) => {
        console.log(err);//problem with the server
      })
    }
  }, []);
  return (
    <>
      <TopBar initHistory={history} initUser={user}></TopBar>
      <Switch>
        <Route exact path="/">
          {user ? <Home /> : <Register />}
        </Route>
        <Route path="/signOut" >
          {user ? <SignOut initHistory={history} /> : <Redirect to="/SendMessage" />
          }</Route>
        <Route path="/login">
          {user ? <Redirect to="/SendMessage" /> : <Login />}
        </Route>
        <Route path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/SendMessage" >
          {user ? <ContactScreen /> : <Redirect to="/login" />}
        </Route>
        <Route path="/Backgammon" >
          {user ? <ContactScreen /> : <Redirect to="/login" />}
        </Route>
        <Route path="/HowToPlay" component={HowToPlay}></Route>
        <Route path="/About" component={About}></Route>
      </Switch>
    </>
  );
}
export default App;
