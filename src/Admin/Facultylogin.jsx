import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';
import { getDatabase, ref, onValue } from 'firebase/database';

import { useNavigate, Link } from 'react-router-dom';

const auth = getAuth(app);
const database = getDatabase(app);

const firebaseConfig = {
  apiKey: "AIzaSyBj5kZy9sskXEg0xlbMDg35-pVvSTJm9Zw",
  authDomain: "cuischolarship-23b42.firebaseapp.com",
  projectId: "cuischolarship-23b42",
  storageBucket: "cuischolarship-23b42.appspot.com",
  messagingSenderId: "361327887400",
  appId: "1:361327887400:web:9a6386f40f1c34b95fe11d",
};



const Facultylogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [verificationError, setVerificationError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  useEffect(() => {
    setLoading(true);
    // Set up a listener for real-time updates
    const notificationsRef = ref(database, 'notification');
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const notificationsData = snapshot.val();
      if (notificationsData) {
        const notificationsArray = Object.values(notificationsData);
        setNotifications(notificationsArray);
      } else {
        setNotifications([]);
      }
      setLoading(false); 
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [database]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading2(true);
    e.preventDefault();

    try {
      const { user } = await signInWithEmailAndPassword(auth, formData.email, formData.password);

      alert('Login successful!');
      window.location.href = '/Facultydashboard';
    } catch (error) {
      console.error('Error logging in:', error.message);
      setLoading2(false);
    }
  };

  return (
    <div className='loading2'> 
    {loading2 ? (
       <center><div className='loading-spinner2'></div></center> 
    ) : (

    <div className="main-area-div">
      <div className="top-heading-area">
        <div className="left-logo-side">
          <img className='campusimg1' src='./cuilogo.png' alt="Dynamic Image" />
          <h3 className='university-logo-text'>CUI Scholarship Portal</h3>
        </div>
        <div className="right-logo-side"></div>
      </div>
      <div className='sub-area-div'>
        <div className="newssection">
          <h3 className='news-section-heading'>NOTICEBOARD</h3>
          <ul className='notice-text-ul'>
            {loading ? (
              <div className='loading-innoticeboard'> 
                {loading && <div className="loading-spinner-innoticeboard"></div>}
              
              </div>
            ) : (
              notifications.map((notification, index) => (
                <li key={index} className='notice-text'>{notification.notify}</li>
              ))
            )}
          </ul>
        </div>
        <div className="form-area2">
          <center><h3>Admin Login</h3></center>
          <form onSubmit={handleSubmit}>
            <div className="inputdiv">
              <label>Email: </label> <br />
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              <br />
            </div>
            <div className="inputdiv">
              <label>Password:</label> <br />
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
            <br />

            <button className='submitbtn' type="submit">Login</button>
          </form>


        </div>
      </div>
      <div className="bottom">
        <p className='footer-credit'>Copyright © 2020, All Rights Reserved by CUOnline-COMSATS</p>
      </div>
    </div>

)}
</div>
  );
};

export default Facultylogin;
