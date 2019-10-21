import React, { Component } from "react";
import firebase from "../../firebase.js";
import { slashReplacer } from "./helperFuncs/common";

import Grid from "@material-ui/core/Grid";

import "./editor.css";

// !!!----------------------------
// !!! If any interuption occurs in img block file.url becomes undefined. And that causes problem while doing operations on this.usedimgs
// !!!----------------------------

// Add embed and table tool after test
import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Checklist from "@editorjs/checklist";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import ImageTool from "@editorjs/image";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";

import NavigateNext from "@material-ui/icons/NavigateNext";
import CheckBoxOutlineBlank from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBox from "@material-ui/icons/CheckBox";
import Delete from "@material-ui/icons/Delete";
import Archive from "@material-ui/icons/Archive";
import Publish from "@material-ui/icons/Publish";
import Save from "@material-ui/icons/Save";
import Clear from "@material-ui/icons/Clear";
import Check from "@material-ui/icons/Check";

const db = firebase.firestore();
const storage = firebase.storage().ref();
const iRef = db.doc("web/pages");

class Editor extends Component {
  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(window.location.search);
    this.editorArea = React.createRef();
    this.usedImgs = [];
    this.state = {
      status: localStorage.getItem("status"),
      url: urlParams.get("url"),
      mins: 0,
      saveStatus: "",
      isSure: false,
      navChange: false,
      isNavElem: false,
      imgLinks: []
    };
  }

  componentDidMount() {
    var { status, url } = this.state;
    const docRef = db.doc(
      `web/pages/${status === "publish" ? "publish" : "others"}/${url}`
    );

    if (url && status) {
      var data = getData(docRef);
      data
        .then(data => {
          this.editor = newEditor(data.data, url, this);
          this.setState({ isNavElem: data.isNavElem, name: data.name });

          data.data.blocks &&
            data.data.blocks.forEach(e => {
              if (e.type === "image") {
                this.usedImgs.push(e.data.file.url);
              }
            });
        })
        .catch(e => {
          window.location.assign("content?cNew=2&err=1");
        });
    } else {
      window.location.assign("content?cNew=2&err=1");
    }
    this.interval = setInterval(() => {
      var new1 = this.state.mins + 1;
      this.setState({ mins: new1 });
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  editorSave(isFirstSave, status) {
    var { isNavElem, url, navChange, name } = this.state;
    const docRef = db.doc(
      `web/pages/${status === "publish" ? "publish" : "others"}/${url}`
    );
    var saveStatus = "saving";
    this.setState({ saveStatus });
    this.editor
      .save()
      .then(outputData => {
        var imgsToDel = [...this.usedImgs];
        outputData.blocks.forEach(e => {
          if (e.type === "image") {
            // reverse operation
            var index = imgsToDel.indexOf(e.data.file.url);
            if (index > -1) {
              imgsToDel.splice(index, 1);
            }
          }
        });

        if (navChange && isFirstSave) {
          var d = {};
          d[status] = {};
          d[status][url] = {
            isNavElem: isNavElem
          };
          // eslint-disable-next-line
          var write = iRef.set(d, { merge: true }).catch(err => {});
        }

        saveData(docRef, outputData, isNavElem, name)
          .then(() => {
            saveStatus = "saved";
            setTimeout(() => {
              this.setState({ mins: 0, saveStatus });
            }, 1000);
          })
          .then(() => {
            imgDel(imgsToDel, url);
          })
          .then(() => {
            var _usedImgs = [];
            outputData.blocks &&
              outputData.blocks.forEach(e => {
                if (e.type === "image") {
                  _usedImgs.push(e.data.file.url);
                }
              });
            this.usedImgs = _usedImgs;
          });
      })
      .catch(error => {
        console.log("Saving failed: ", error);
      });
  }

  handleStatusChange(newStatus) {
    var { status, url, isNavElem, name } = this.state;
    var docRef = db.doc(
      `web/pages/${status === "publish" ? "publish" : "others"}/${url}`
    );
    updateIndex(status, url, name, newStatus, isNavElem).then(s => {
      if (s === "updated") {
        if (newStatus === "delete") {
          docDel(docRef).then(() => {
            imgDel(this.usedImgs, url);
            localStorage.removeItem("status");
            window.location.assign("content");
          });
        } else {
          docDel(docRef).then(() => {
            localStorage.setItem("status", newStatus);
            this.setState({ status: newStatus });
            this.editorSave(false, newStatus);
          });
        }
      }
    });
  }

  render() {
    const { status, url, isNavElem, isSure } = this.state;
    var statusn =
      status === "archive"
        ? "archived"
        : status === "publish"
        ? "published"
        : "editing";
    const statusName = statusn[0].toUpperCase() + statusn.slice(1);
    return (
      <Grid container alignItems="center" direction="column" id="editor-route">
        <Grid item xs={11} md={9} id="editor-header">
          <div>
            <div>
              {/* {url && status && `${statusName} - ${slashReplacer(url, true)}`} */}
              {url && status && (
                <Paper elevation={1} style={{ padding: "8px 15px" }}>
                  <Breadcrumbs
                    separator={<NavigateNext fontSize="small" />}
                  >
                    <Typography variant="body2">{statusName}</Typography>
                    <Typography variant="body2">
                      {slashReplacer(url, true)}
                    </Typography>
                  </Breadcrumbs>
                </Paper>
              )}
            </div>
            <div>
              <Button
                variant="outlined"
                style={{ color: isNavElem ? "#28a745" : "#dc3545" }}
                onClick={() => {
                  this.setState({
                    isNavElem: !this.state.isNavElem,
                    navChange: !this.state.navChange
                  });
                }}
                endIcon={isNavElem ? <CheckBox /> : <CheckBoxOutlineBlank />}
              >
                Navigation Link
              </Button>
            </div>
          </div>
          <div></div>
        </Grid>
        <Grid item xs={11} md={9} id="editor-area" ref={this.editorArea}></Grid>
        <Grid item xs={11} md={9} id="editor-menu">
          <div id="opts">
            <Button
              variant="contained"
              style={{
                marginTop: 10,
                marginRight: 10,
                backgroundColor: this.state.deleteHover && "#dc3545"
              }}
              onClick={() => {
                if (isSure === false) {
                  this.setState({ isSure: true });
                }
              }}
              endIcon={
                isSure ? (
                  <span
                    style={{ marginLeft: 0 }}
                    className="MuiButton-endIcon MuiButton-iconSizeMedium"
                  >
                    <Check
                      onClick={() => {
                        this.handleStatusChange("delete");
                      }}
                    />
                    <Clear
                      onClick={() => {
                        this.setState({ isSure: false });
                      }}
                      style={{ fontSize: 20 }}
                    />
                  </span>
                ) : (
                  <Delete />
                )
              }
              onMouseEnter={() => {
                this.setState({ deleteHover: true });
              }}
              onMouseLeave={() => {
                this.setState({ deleteHover: false });
              }}
            >
              {isSure ? "Confirm" : "Delete"}
            </Button>
            <Button
              variant="contained"
              style={{
                marginTop: 10,
                marginRight: 10
              }}
              onClick={() => {
                this.handleStatusChange("archive");
              }}
              endIcon={<Archive />}
            >
              Archive
            </Button>
            <Button
              variant="contained"
              style={{ marginTop: 10, marginRight: 10 }}
              onClick={() => {
                this.handleStatusChange("publish");
              }}
              endIcon={<Publish />}
            >
              Publish
            </Button>
          </div>
          <div id="save">
            <Button
              variant="contained"
              className={this.state.saveStatus}
              style={{ marginTop: 10, marginRight: 0 }}
              onClick={e => {
                this.editorSave(true, this.state.status);
              }}
              endIcon={<Save />}
            >
              Save!
            </Button>
            <Paper elevation={0} style={{ marginTop: 5 }}>
              <Typography variant="body2">
                Last Save:{" "}
                {this.state.mins === 0
                  ? "just now"
                  : `${this.state.mins} minutes ago`}
              </Typography>
            </Paper>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default Editor;

const getData = async docRef => {
  var data = await docRef.get().then(doc => {
    return doc.data();
  });
  return data;
};

const newEditor = (data, url, t) => {
  const editor = new EditorJS({
    holder: t.editorArea.current,
    data,
    tools: {
      p: Paragraph,
      h: Header,
      li: {
        class: List,
        inlineToolbar: true
      },
      warning: Warning,
      checklist: {
        class: Checklist,
        inlineToolbar: true
      },
      Marker: {
        class: Marker,
        shortcut: "CMD+SHIFT+M"
      },
      quote: Quote,
      delimiter: Delimiter,
      image: {
        class: ImageTool,
        config: {
          uploader: {
            uploadByFile(file) {
              return fileUploader(file, url, t).then(d => {
                return d;
              });
            }
          }
        }
      }
    },
    initialBlock: "p"
  });
  return editor;
};

const saveData = async (docRef, data, isNavElem, name) => {
  // eslint-disable-next-line
  var update = docRef.set({ data, isNavElem, name }, { merge: true });
};

const updateIndex = async (status, url, name, newStatus, isNavElem) => {
  let d = {};
  d[newStatus] = {};
  d[newStatus][url] = {
    name: name,
    isNavElem: isNavElem,
    oldStatus: status,
    timeChanged: Date.now()
  };

  let z = iDelFunc(status, url);
  let a = await z(iRef, db)
    .then(s => {
      if (s === "deleted") {
        iRef.set(d, { merge: true });
        return "updated";
      } else {
        return s;
      }
    })
    .catch(e => {
      console.log(e);
    });
  return a;
};

const docDel = async (docRef, imgArr, url) => {
  var q = await docRef
    .delete()
    .then(() => {
      imgDel(imgArr, url);
    })
    .catch(e => {
      console.log(e);
    });
  return q;
};

const iDelFunc = (status, url) => {
  // eslint-disable-next-line
  var f = new Function(
    "iRef, db",
    `var q = iRef.update({ "${status}.${url}": db.app.firebase_.firestore.FieldValue.delete() }).then(() => {return 'deleted'}).catch((e) => {return e}); return q`
  );
  return f;
};

const fileUploader = async (f, url, t) => {
  var fileMeta = {
    name: f.name,
    type: f.type,
    date: f.lastModified
  };
  var upName = `--__--${Date.now()}-${fileMeta.name}--__--`;

  var itemRef = storage.child(`static/${url}/${upName}`);
  var img = {
    file: {}
  };

  var a = await itemRef.put(f).then(async d => {
    if (d.state !== "success") return false;
    var z = await d.ref.getDownloadURL().then(da => {
      img.success = 1;
      img.file.url = da;
      t.usedImgs.push(da);
      return true;
    });
    return z;
  });

  return new Promise(function(res, rej) {
    if (a) {
      return res(img);
    } else {
      return rej("please try again");
    }
  });
};

function imgDel(imgArr, url) {
  if (imgArr !== undefined) {
    imgArr.forEach(e => {
      var upName = "--__--" + e.split("--__--")[1] + "--__--";
      var itemRef = storage.child(`static/${url}/${upName}`);
      itemRef.delete().then(a => {});
    });
  }
}
