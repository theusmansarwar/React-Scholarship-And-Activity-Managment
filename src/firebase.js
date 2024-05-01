import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBj5kZy9sskXEg0xlbMDg35-pVvSTJm9Zw",
    authDomain: "cuischolarship-23b42.firebaseapp.com",
    projectId: "cuischolarship-23b42",
    storageBucket: "cuischolarship-23b42.appspot.com",
    messagingSenderId: "361327887400",
    appId: "1:361327887400:web:9a6386f40f1c34b95fe11d",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);


export { auth, app, database };

