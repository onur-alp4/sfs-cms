![SFS CMS Logo](https://sfs-cms.firebaseapp.com/static/media/logo.53d93032.png =250x250)

# Super Fast & Simple Content Management System

Currently in alpha.

This Project aims to serve customizable CMS for developers to fulfill most basic needs of their customers/projects in no time.

This Project can only be used with Google Firebase for now.(It's free, fast and simple)

Current Features:

1. Add/Publish/Archive/Delete Content
2. Serverless Architecture
3. Block Style Open Source Customizable Text Editor

## Demo:

https://sfs-cms.firebaseapp.com/

Username: demo@user.sfscms
Password: 123456

Coming Up:

2. User Management
3. Better Documentation
4. Head settings
5. Theme Selection

Stack and dependencies:

- Javascript
- [Firebase](https://firebase.google.com/)
  - Hosting
  - Database
  - Storage
  - Authentication
- [React](https://reactjs.org)(create-react-app)
- [Material-ui](https://material-ui.com)
- [Editor.js](https://editorjs.io)
- [React-router-dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom)

## Quick Start

1. Installation

Clone or download this repository.

2. Setting Up

  1. Log-in to Firebase Console.
  2. Create New Project and activate Firestore Database, Hosting, Database.
  3. Copy project config object from Project Settings > General > Your apps.

  Example config file of demo site:

  ```javascript
  const firebaseConfig = {
    apiKey: "AZzaSyCZCeoe72VX8ScH07AD3UzPTzdHiP91S-E",
    authDomain: "sfs-cms.firebaseapp.com",
    databaseURL: "https://sfs-cms.firebaseio.com",
    projectId: "sfs-cms",
    storageBucket: "sfs-cms.appspot.com",
    messagingSenderId: "1066578952421",
    appId: "1:1087535175421:web:b698913872b129214e2894"
  };
  ```

  4. Paste this config object to

    `./src/components/firebase.js`

  5. install dependencies

    `npm install`

  6. build the production files

    `npm run build`

  7. Install Firebase Cdn and Initialize project folder

    Note: Don't forget to select hosting, storage, firestore options during initialization.

    - please refer to: 
    https://firebase.google.com/docs/web/setup?authuser=0#install-cli_deploy

    - After init copy the contents of `/build` folder of SFS-CDN to project to `/public` folder of firebase project and delete 404.html

    - update firestore.rules and storage.rules files as:

    `allow read, write: if request.auth.uid != null`

  8. Deploy to cloud

    run `firebase deploy`

5. Usage

  - Add new user(s) in Authentication settings of your firebase project.

6. Limitations

  - Since syncing is not realtime, two users should't work on the same content. (Fix coming soon)

-------------------

- Feel free to copy, change and use as you like. 
- Looking forward for improvement, fix suggestions. Please file new issue in [github](https://github.com/onur-alp4/sfs-cms/issues) if you have one 
- You can ask questions anytime. onur.alp.d4[at]gmail.com
