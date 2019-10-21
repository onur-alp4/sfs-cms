import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Admin from "./components/Admin";
import SignIn from "./components/SignIn";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <Router>
          <Switch>
            <Route exact path="/" component={SignIn} />
            <Route path="/admin/cpanel" component={Admin} />
            <Route render={() => {
              return (<Redirect to="/admin/cpanel/content"/>)
            }}/>
          </Switch>
        </Router>
    );
  }
}
export default App;
