import React, { Component } from "react";
import logo from "../logo.png";

import firebase from "../firebase.js";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleUser(e) {
    if (e.id === "username") {
      this.setState({ email: e.value });
    }
    if (e.id === "password") {
      this.setState({ password: e.value });
    }
  }

  SignIn(e) {
    e.preventDefault();
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        user = JSON.stringify(user);
        localStorage.setItem("user", user);
        window.location.assign(`/admin/cpanel/content`);
      })
      .catch(error => {
        var user = false;
        localStorage.setItem("user", user);
        this.setState({ error });
      });
  }

  render() {
    return (
      <div className="SignIn" style={{ marginTop: 100 }}>
        <Container component="main" maxWidth="xs">
          <div className="img-container">
            <img alt="logo" style={{ maxWidth: 250 }} src={logo} />
          </div>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: 280,
              margin: "auto"
            }}
            onSubmit={e => {
              this.SignIn(e);
            }}
            id="siform"
          >
            <TextField
              style={{
                margin: "10px 0",
                boxSizing: "border-box"
              }}
              variant="outlined"
              fullWidth
              label="Username"
              id="username"
              onChange={e => {
                this.handleUser(e.target);
              }}
              required
              autoComplete="email"
              type="text"
            />
            <TextField
              style={{
                margin: "10px 0",
                boxSizing: "border-box"
              }}
              variant="outlined"
              fullWidth
              label="Password"
              id="password"
              onChange={e => {
                this.handleUser(e.target);
              }}
              required
              autoComplete="current-password"
              type="password"
            />
            <Button
              style={{
                padding: 10,
                boxSizing: "border-box"
              }}
              variant="contained"
              color="primary"
              onClick={e => {
                this.SignIn(e);
              }}
            >
              Sign In
            </Button>
            {this.state.error ? (
              <div className="errbar">
                <div>{this.state.error.message}</div>
                <div
                  onClick={() => {
                    this.setState({ error: false });
                  }}
                >
                  X
                </div>
              </div>
            ) : (
              ""
            )}
          </form>
        </Container>
      </div>
    );
  }
}

export default SignIn;
