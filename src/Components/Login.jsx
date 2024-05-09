import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';
import { getDatabase, ref, onValue } from 'firebase/database';
import './registeration.css';
import { useNavigate, Link } from 'react-router-dom';

const auth = getAuth(app);
const database = getDatabase(app);

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [verificationError, setVerificationError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [loading2, setLoading2] = useState(false);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    setLoading(true);
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
      if (user && !user.emailVerified) {
        setVerificationError('Email not verified. Please verify your email.');
        alert('Email not verified. Please verify your email.');
        return;
      } else {
        alert('Login successful!');
        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            const userId = user.uid;
            const userRef = ref(database, `userdata/${userId}/type`);
            onValue(userRef, (snapshot) => {
              const userType = snapshot.val();
              setUserType(userType);

              // Navigate based on user type
              switch (userType) {
                case 'admin':
                  navigate('/Facultydashboard');
                  break;
                case 'user':
                  navigate('/Dashboard');
                  break;

                default:
                  navigate('/Dashboard'); // Default route for unknown types
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      alert(error.message); 
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
              <h3 className='university-logo-text'>CUI Scholarship & Activities Portal</h3>
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
              <center><h3>Login your account</h3></center>
              <form onSubmit={handleSubmit}>
                <div className="inputdiv">
                  <label>Email: </label> <br />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  <br />
                </div>
                <div className="inputdiv">
                  <label>Password:</label> <br />
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="forgetarea">
                  <p className='simpletext'><Link className='simpletextlink' to="/forget">Forget Password?</Link></p>
                </div>
                <br />
                <button className='submitbtn' type="submit">Login</button>
              </form>
              <div className="centeredtextarea">
                <p className='simpletext'>Don't Have An Account?<Link className='simpletextlink' to="/registration">Signup</Link></p>
              </div>
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

export default Login;
