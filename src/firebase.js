import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCZCeoe92VX4ScH07TD3UzPYzdHiP91S-E",
  authDomain: "sfs-cms.firebaseapp.com",
  databaseURL: "https://sfs-cms.firebaseio.com",
  projectId: "sfs-cms",
  storageBucket: "sfs-cms.appspot.com",
  messagingSenderId: "1066575175421",
  appId: "1:1066575175421:web:b698913872b129214e2894",
};


export default firebase.initializeApp(firebaseConfig);