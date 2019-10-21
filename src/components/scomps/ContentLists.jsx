import React, { Component } from "react";

import { slashReplacer } from "./helperFuncs/common";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

class ContentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true
    };
  }

  listSwitch() {
    const isOpen = !this.state.isOpen;
    this.setState({ isOpen });
  }

  render() {
    const props = this.props;
    return (
      <div>
        <ListItem
          button
          onClick={() => {
            this.listSwitch();
          }}
        >
          <ListItemText variant="h2">{props.listName}</ListItemText>
          {this.state.isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {props.listItems && props.listItems.length > 0 ? (
              props.listItems.map(e => {
                return (
                  <ListItem
                    key={e.url}
                    onClick={() => {
                      forward(props.groupName, e.url);
                    }}
                    button
                    style={{ paddingLeft: 32 }}
                    divider
                  >
                    <ListItemText
                      primary={e.name}
                      secondary={
                        <Typography variant="body1">
                          {slashReplacer(e.url, true)}
                          {e.isNavElem && (
                            <span className="navicon">Nav Element</span>
                          )}
                        </Typography>
                      }
                    />
                  </ListItem>
                );
              })
            ) : (
              <ListItem style={{ paddingLeft: 32 }} divider>
                <ListItemText primary="There are not any entries" />
              </ListItem>
            )}
          </List>
        </Collapse>
      </div>
    );
  }
}

function forward(s, n) {
  localStorage.setItem("status", s);
  window.location.assign(`/admin/cpanel/editor?url=${n}`);
}

export default ContentList;
