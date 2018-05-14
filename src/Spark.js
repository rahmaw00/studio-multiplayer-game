import Avatar from 'material-ui/Avatar';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import UserApi from './UserApi.js';
import firebase from 'firebase';
import { List, ListItem } from 'material-ui/List';
import {GridList, GridTile} from 'material-ui/GridList';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


const ButtonStyle = {
  position: "fixed",
  right: 24,
  bottom: 24,
  marginBottom: 0,
  zIndex: 998,
};

export default class Spark extends Component {
  constructor(props) {
    super(props);
    var path = "/session/" + this.props.match.params.id;
    this.sessionRef = firebase.database().ref(path);

    this.state = {
      posts: [],
      urlInput: "",
      userInput: "",
      open: false,
    };
  }
  handleOpen() {
    this.setState({
      open: true,
    })
  }
  
  handleClose() {
    this.sessionRef.push({
      user: this.state.userInput,
      name: "",
      image: this.state.urlInput,
    })
    this.setState({
      open: false,
      input: "",
    })
  }
  
  handleCancel() {
    this.setState({
      open: false,
      input: "",
    })
  }

  handleUserChange(event, newValue) {
    this.setState({
      userInput: newValue,
    })
  }
  
    handleUrlChange(event, newValue) {
    this.setState({
      urlInput: newValue,
    })
  }

  componentWillMount() {
    
    /*
    From firebase: {
    
      "<random-id>": {
        user: "foo",
        name: "foo name",
        image: "URL"
      }
      ....
    }
    
    We want: [
      {
        user: "foo",
        name: "foo name",
        image: "URL"
      }
    ]
    */
    this.sessionRef.on("value", (snapshot) => this.setState({
      posts: snapshot.val() ? Object.values(snapshot.val()) : [],
    }))
  }

  componentWillUnmount() {
  }

  handleKeyEvent(key) {
  }

  render() {
    const actions = [
      <FlatButton
        label="POST"
        primary={true}
        onClick={() => this.handleClose()}
      />,
      <FlatButton
        label="CANCEL"
        secondary={true}
        onClick={() => this.handleCancel()}
      />
    ];

    return (
      <div style={{margin: 56}}>
      <Dialog
          title="Paste your url..."
          actions={actions}
          modal={false}
          open={this.state.open}
        >
        <TextField onChange={(event, newValue) => this.handleUrlChange(event, newValue)}
              hintText="Paste your url "
              floatingLabelText="Photo url " />        
        <TextField onChange={(event, newValue) => this.handleUserChange(event, newValue)}
              hintText="Enter your username"
              floatingLabelText="Username" />
      </Dialog>
        <GridList
          cellHeight={"auto"}
        >
          {this.state.posts.map((tile) => (
            <GridTile
              title={tile.name, tile.user}>
              <img src={tile.image} />
            </GridTile>
          ))}
        </GridList>
        <FloatingActionButton secondary={true} style={ButtonStyle} onClick={() => this.handleOpen()}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

//subtitle={<span>by <b>{tile.author}</b></span>}
