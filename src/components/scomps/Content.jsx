import React, { Component } from "react";
import firebase from "../../firebase.js";
import { slashReplacer } from "./helperFuncs/common";
import "./content.css";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";

import ArrowForward from "@material-ui/icons/ArrowForward";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";

import ContentList from "./ContentLists.jsx";

const db = firebase.firestore();

class Content extends Component {
  constructor(props) {
    super(props);
    var urlParams = new URLSearchParams(window.location.search);
    this.state = {
      editing: [],
      archive: [],
      publish: [],
      isErrRedirect: urlParams.get("err") || false,
      isNew: urlParams.get("cNew") || false,
      cname: "",
      curl: "",
      isExists: false,
      newCErr: false
    };
  }

  componentDidMount() {
    getPages().then(d => {
      let { editing, archive, publish } = d === undefined ? [] : d;
      this.setState({ editing, archive, publish });
    });
  }

  createNew(e) {
    e.preventDefault();
    var url = slashReplacer(this.state.curl);
    var objN = this.state.curl;
    this[objN] = {
      name: this.state.cname,
      url: url,
      status: "editing"
    };

    if (this.state.cname.length > 0 && this.state.curl > 0) {
      console.log(this.state.cname)
      console.log('curl', this.state.curl)
      setPageIndex(this[objN], this)
        .then(() => {
          const ref = db.doc(`web/pages/others/${this[objN].url}`);
          ref
            .set({
              data: {},
              isNavElem: false,
              name: this[objN].name
            })
            .then(() => {
              if (this.state.isExists === false) {
                this.forward("editing", this[objN].url);
              }
            });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.setState({ newCErr: true });
    }
  }

  forward(s, n) {
    localStorage.setItem("status", s);
    window.location.assign(`/admin/cpanel/editor?url=${n}`);
  }

  render() {
    var {
      editing,
      archive,
      publish,
      isExists,
      isErrRedirect,
      isdb,
      isNew
    } = this.state;
    if (this.state.isNew) {
      return (
        <div style={{ margin: "10px 30px" }}>
          <div className="addMenu">
            <span style={{ padding: 12 }}>
              <Typography variant="h5">Create New Content:</Typography>
            </span>
            <span>
              <IconButton
                onClick={() => {
                  this.setState({ isNew: false });
                }}
              >
                <Close />
              </IconButton>
            </span>
          </div>
          {isNew === "2" ? (
            <div>Please create the name and url of the page first</div>
          ) : (
            ""
          )}
          <div style={{ flexGrow: 1, margin: 10 }}>
            <Grid container justify="center" alignItems="flex-start">
              <Grid item xs={9} md={4}>
                <form
                  className="new-content"
                  noValidate
                  onSubmit={e => {
                    this.createNew(e);
                  }}
                >
                  <TextField
                    label="Content Name"
                    name="cname"
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.setState({ cname: e.target.value })}
                    // value={this.state.cname}
                    required
                  />
                  <TextField
                    label="Content Url"
                    name="curl"
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.setState({ curl: e.target.value })}
                    // value={this.state.curl}
                    required
                  />
                  <Button
                    style={{ margin: "16px auto" }}
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowForward />}
                    type="submit"
                  >
                    Compose
                  </Button>
                </form>
              </Grid>
              <Grid item xs={9} md={6}>
                <div>
                  <Typography
                    style={{ marginTop: 52, fontSize: 14, color: "#00000099" }}
                    variant="body1"
                  >
                    <b>Content Name</b> is for your own records. Content Header
                    will be set later.
                  </Typography>
                  <Typography
                    style={{ marginTop: 50, fontSize: 14, color: "#00000099" }}
                    variant="body1"
                  >
                    <b>Content Url</b> is important for SEO. Try to match it
                    with content headline. There are no restrictions for path
                    number or length.
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </div>
          <div>
            {isExists ? (
              <div className="errbar">
                This route already exists, please delete or edit the existing
                one
              </div>
            ) : this.state.newCErr ? (
              <div className="errbar">Name and Url are Required</div>
            ) : (
              ""
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ margin: "10px 30px" }}>
          {isErrRedirect && isdb ? (
            <div className="errbar">
              <div>
                Some error occured please contact with system administrator
              </div>
              <div
                onClick={() => {
                  this.setState({ isErrRedirect: false });
                }}
              >
                X
              </div>
            </div>
          ) : (
            ""
          )}
          <div>
            <div id="newC">
              <Button
                variant="contained"
                aria-label="add"
                color="primary"
                startIcon={<Add />}
                onClick={() => {
                  this.setState({ isNew: true });
                }}
                onMouseEnter={() => {
                  this.setState({ newCHover: "newC-hover" });
                }}
                onMouseLeave={() => {
                  this.setState({ newCHover: null });
                }}
                className={this.state.newCHover}
              >
                New Content
              </Button>
            </div>
            <List>
              <ContentList
                listName="Editing"
                listItems={editing}
                groupName="editing"
              />
              <ContentList
                listName="Published"
                listItems={publish}
                groupName="publish"
              />
              <ContentList
                listName="Archived"
                listItems={archive}
                groupName="archive"
              />
            </List>
          </div>
        </div>
      );
    }
  }
}

const getPages = async () => {
  const pagesRef = db.doc("web/pages");
  var pages = await pagesRef
    .get()
    .then(doc => {
      return doc.data();
    })
    .then(pages => {
      var data = {};
      for (var k in pages) {
        data[k] = [];
        for (var j in pages[k]) {
          var d = {
            name: pages[k][j].name,
            url: j,
            isNavElem: pages[k][j].isNavElem
          };
          data[k].push(d);
        }
      }
      return data;
    });
  return pages;
};

const setPageIndex = async (o, t) => {
  var d = {};
  d[o.status] = {};
  d[o.status][o.url] = {
    name: o.name,
    isNavElem: false
  };

  var data = getPages();
  data
    .then(d => {
      var { editing, archive, publish } = d === undefined ? [] : d;
      t.setState({ editing, archive, publish });
    })
    .then(() => {
      var { editing, publish, archive } = t.state;
      if (!Array.isArray(editing)) {
        editing = [];
      }
      if (!Array.isArray(publish)) {
        publish = [];
      }
      if (!Array.isArray(archive)) {
        archive = [];
      }
      var allroutes = [...editing, ...publish, ...archive];
      var isExists = allroutes.findIndex(e => {
        return e.url === o.url;
      });
      if (isExists === -1) {
        var write = db.doc("web/pages");

        write.set(d, { merge: true }).catch(err => {
          console.log(err);
          t.setState({ newCErr: ["Name"] });
        });
      } else {
        t.setState({ isExists: true });
      }
    });
};

export default Content;
