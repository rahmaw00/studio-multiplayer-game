import Avatar from 'material-ui/Avatar';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import UserApi from './UserApi.js';
import firebase from 'firebase';
import { List, ListItem } from 'material-ui/List';

export default class Spark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      input: "",
    };
  }

  componentWillMount() {
    this.setState({ posts: [
        {
            user: "RW",
            name:"Ramata",
            image: "https://www.funnypica.com/wp-content/uploads/2015/05/TOP-30-Cute-Cats-Cute-Cat-30.jpg",
        },
        {
            user: "AC",
            name:"Andrea",
            image: "https://www.funnypica.com/wp-content/uploads/2015/05/TOP-30-Cute-Cats-Cute-Cat-30.jpg",
        },
           {
            user: "AC",
            name:"Andrea",
            image: "https://www.funnypica.com/wp-content/uploads/2015/05/TOP-30-Cute-Cats-Cute-Cat-30.jpg",
        }
        ] });
  }

  componentWillUnmount() {
  }

  handleKeyEvent(key) {
  }

  render() {
    const posts = this.state.posts.map(post => {
      return <img className="postImage" src={post.image}/>
    })
    return (
      <div style={{margin: 56}}>
      {posts}
      </div>
    );
  }
}
