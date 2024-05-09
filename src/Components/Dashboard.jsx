import { SiGooglescholar } from "react-icons/si";
import { TbProgress } from "react-icons/tb";
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; 
import { app } from '../firebase';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { IoLogOutOutline } from "react-icons/io5";
import { LuActivity } from "react-icons/lu";
import { MdOutlineTask } from "react-icons/md";
import { FaNetworkWired } from "react-icons/fa6";
import { MdEventNote } from "react-icons/md";

const auth = getAuth(app);
const database = getDatabase(app);

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState('');
  const navigate = useNavigate(); // Move the declaration of navigate before using it

  useEffect(() => {
    const notificationsRef = ref(database, 'news');
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const notificationsData = snapshot.val();
      if (notificationsData) {
        const notificationsArray = Object.values(notificationsData);
        setNotifications(notificationsArray);
      } else {
        setNotifications([]);
      }
      setLoading(false); // Set loading to false when data is fetched
    });

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const userRef = ref(database, `userdata/${userId}/president`);
        onValue(userRef, (snapshot) => {
          const userType = snapshot.val();
          setUserType(userType);
        });
      }
    });
    return () => unsubscribe();
  }, [database]);

  const navigatetonextpage = () => {
    navigate('/Scholarshiplistforstudent');
  };

  const navigatetonextpage2 = () => {
    navigate('/Status');
  };

  const navigatetonextpage3 = () => {
    navigate('/');
  };
  const navigatetonextpage4 = () => {
    navigate('/Societieslist');
  };

  const navigatetonextpage5 = () => {
    navigate('/SocietyActivities', { state: { societiesTitle: "" } });
  };
  const navigatetonextpage7 = () => {
    navigate('/Createevent');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Ensure auth is initialized and signOut correctly
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className="main-area-div">
      <div className="top-area">
        <div className="left-logo-side">
          <img className='campusimg1' src='./cuilogo.png' alt="Dynamic Image" />
          <h3 className='university-logo-text'>CUI Scholarship & Activities Portal</h3>
        </div>
        <div className="right-logo-side">
          <div className="logout-section" onClick={handleLogout}>
            <p className="logout-text">Logout</p>
            <IoLogOutOutline className="logout-button" />
          </div>
        </div>
      </div>
      <div className="dashboardmodulelist">
        <div className="module" onClick={navigatetonextpage}>
          <SiGooglescholar className="module-logo" />
          <p className='module-name'>Scholarships</p>
        </div>
        <div className="module" onClick={navigatetonextpage2}>
          <TbProgress className="module-logo" />
          <p className='module-name'>Scholarships Status</p>
        </div>
        <div className="module" onClick={navigatetonextpage4}>
          <FaNetworkWired className="module-logo" />
          <p className='module-name'>Societies</p>
        </div>
        <div className="module" onClick={navigatetonextpage5}>
          <LuActivity className="module-logo" />
          <p className='module-name'>Activities</p>
        </div>

        {userType === 'yes' && (
          <div className="module" onClick={navigatetonextpage7}>
            <MdEventNote className="module-logo" />
            <p className='module-name'>Create Event</p>
          </div>
        )}
      </div>
      <div className="latest-news-area">
        <h3 className='news-section-heading2'>Latest News</h3>
        <ul className="news-list-area">
          {loading ? (
            <div className='loading-indashboard'> {loading && <div className="loading-spinner-indashboard"></div>}
              <h4>Loading...</h4></div>
          ) : (
            notifications.map((notification, index) => (
              <li key={index} className='news-text-area'>
                <h4>{notification.title}</h4>
                <p className="news-description">{notification.description}</p>
                <a href={notification.link}>Show more</a>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="bottom">
        <p className='footer-credit'>Copyright © 2020, All Rights Reserved by CUOnline-COMSATS</p>
      </div>
    </div>
  );
}

export default Dashboard;
