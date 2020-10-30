import * as firebase from 'firebase';
import 'firebase/storage' 
import 'firebase/firestore' 

export const config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
}
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
export const StorageRef = firebase.storage();
export const FirestoreRef = firebase.firestore();
export default firebase;
