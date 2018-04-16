import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Header from './Header.js'
import Paper from 'material-ui/Paper';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import React, { Component } from 'react';
import WaitingRoom from './WaitingRoom.js';
import firebase from 'firebase';
import firebaseConfig from './firebaseConfig.js';
import gameData from './gameData.js';
import { Route } from 'react-router-dom';
import { UserApiConfig } from './UserApi.js';
import Snackbar from 'material-ui/Snackbar';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

const buttonStyle = {
  width: 56,
  height: 56,
  marginTop: 56,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authIsLoading: true,
      userApiIsLoading: true,
      user: null,
      open: true
    };
  }

  componentWillMount() {
    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(
        (user) => this.setState({
          authIsLoading: false,
          user: user
        }));

    firebase.auth().getRedirectResult().then(
        (result) => {
          if (result.user) {
            this.logSignIn(result.user);
          }
        },
        (error) => { console.error("Failed to sign in", error) });

    UserApiConfig.startListeningForChanges().then(
        () => this.setState({ userApiIsLoading: false }));
  }

  componentWillUnmount() {
    UserApiConfig.stopListeningForChanges();
  }

  logSignIn(user) {
    var userData = {
      name: user.displayName,
      photoURL: user.photoURL,
      lastSignIn: firebase.database.ServerValue.TIMESTAMP,
    }
    var userDatabaseRef = firebase.database().ref('/user/' + user.uid);

    userDatabaseRef.set(userData).catch(
        (error) => console.error("Error storing user metadata", error));
  }

  signIn() {
    this.setState({ authIsLoading: true });
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  render() {
    if (!this.state.authIsLoading && this.state.user === null) {
      return (
        <center>
          <Snackbar
          open={this.state.open}
          message="Event added to your calendar"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}/>
          <FloatingActionButton
              style={buttonStyle}
              onClick={() => this.signIn()}>
            <PersonAdd />
          </FloatingActionButton>
          <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <MenuItem primaryText="Refresh" />
            <MenuItem primaryText="Help &amp; feedback" />
            <MenuItem primaryText="Settings" />
            <MenuItem primaryText="Sign out" />
          </Menu>
        </Popover>
        </center>
      );
    } else if (this.state.authIsLoading || this.state.userApiIsLoading) {
      return (
        <center>
          <Paper style={buttonStyle} circle={true}>
            <CircularProgress size={56} />
          </Paper>
        </center>
      );
    } else {
      var gameRoutes = Object.keys(gameData).map((type) => (
        <Route
            key={type}
            path={"/" + type + "/:id"}
            component={gameData[type].component} />
      ));
      return (
        <div>
          <Header />
          <Route path="/" component={WaitingRoom} exact />
          {gameRoutes}
        </div>
      );
    }
  }
}