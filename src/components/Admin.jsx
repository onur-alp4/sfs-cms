import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import firebase from "../firebase.js";

import Nav from "./components/Nav";
import Content from "./scomps/Content";
import Editor from "./scomps/Editor";
import NavBar from "./components/NavBar.jsx";
import Drawer from "@material-ui/core/Drawer";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false
    };
  }

  componentDidMount() {
    this.authStateListener = firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
      } else {
        console.log("auth failed");
        window.location.assign("/");
      }
    });
  }

  componentWillUnmount() {
    this.authStateListener();
  }

  render() {
    return (
      <div className="Admin">
        <Drawer
          open={this.state.isMenuOpen}
          onClose={() => {
            this.setState({ isMenuOpen: false });
          }}
        >
          <Nav />
        </Drawer>
        <div>
          <NavBar drawerSwitch={() => {
            this.setState({isMenuOpen: true})
          }}/>
          <Switch>
            <Route path={"/admin/cpanel/content"} component={Content} />
            <Route path={"/admin/cpanel/editor"} component={Editor} />
            <Route
              render={() => {
                return <Redirect to="/admin/cpanel/content" />;
              }}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Admin;
