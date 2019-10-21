import React, { Component } from "react";
import './Nav.css'

import { NavLink } from "react-router-dom";

import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";

import AmpStories from "@material-ui/icons/AmpStories";
import SupervisorAccount from "@material-ui/icons/SupervisorAccount";


const routes = [
  {
    to: "content",
    icon: <AmpStories />,
    text: "Content Manager"
  },
  {
    to: "users",
    icon: <SupervisorAccount />,
    text: "User Manager",
    secText: "Coming Soon"
  }
];

const navLinkStyle = {
  padding: "8px 16px",
  flexDirection: "row",
  alignItems: "center",
  display: "flex",
  width: "100%",
  color: "#000000d1",
  textDecoration: "none"
};

const selectedNav = {
  color: "#3f51b5"
};


class Nav extends Component {
  render() {
    return (
      <div>
        <div>
          <List>
            {routes.map(e => {
              return (
                <ListItem style={{ margin: 0, padding: 0 }} key={e.to}>
                  <NavLink
                    to={`/bi/${e.to}`}
                    style={navLinkStyle}
                    activeStyle={selectedNav}
                  >
                    <ListItemIcon style={{ minWidth: 0, marginRight: 3 }}>
                      {e.icon}
                    </ListItemIcon>
                    <ListItemText primary={e.text} secondary={e.secText} />
                  </NavLink>
                </ListItem>
              );
            })}
          </List>
        </div>
      </div>
    );
  }
}

export default Nav;
