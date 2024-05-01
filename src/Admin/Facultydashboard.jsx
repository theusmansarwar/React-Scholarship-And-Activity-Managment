
import { SiGooglescholar } from "react-icons/si";
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from "react-router-dom";

import { getDatabase, ref, onValue, remove } from 'firebase/database';
import './fdashboard.css';
import { IoLogOutOutline } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import { LuActivity } from "react-icons/lu";
import { FaNetworkWired } from "react-icons/fa6";



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

const Facultydashboard = () => {

  const [notifications, setNotifications] = useState([]);
  const [editModeIndex, setEditModeIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);


  const navigate = useNavigate();


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
      setLoading(false);
    });

    return () => unsubscribe(); // Unsubscribe when component unmounts
  }, [database]);
  const navigatetonextpage = (e) => {
    e.preventDefault();
    setLoading2(true);
    //  navigate('/Scholarshiplist';
    navigate('/Scholarshiplist');
  };
  const navigatetonextpage0 = () => {
    setLoading2(true);
     navigate('/Login');
  };

  const navigatetonextpage3 = () => {
    setLoading2(true);
     navigate('/Addnews');
  };
  const navigatetonextpage2 = () => {
    setLoading2(true);
     navigate('/Userslist');
  };
  const navigatetonextpage1 = () => {
    setLoading2(true);
     navigate('/Applications');
  };
  const navigatetonextpage4 = () => {
    setLoading2(true);
     navigate('/Activities');
  };
  const navigatetonextpage5 = () => {
    setLoading2(true);
     navigate('/Societies');
  };


  const handleEditClick = (index) => {
    setEditModeIndex(index);
  };

  const handleCancelClick = () => {
    setEditModeIndex(null);
  };

  const handleInputChange = (e, field, index) => {
    const newNotifications = [...notifications];
    newNotifications[index][field] = e.target.value;
    setNotifications(newNotifications);
  };

  const handleEditSubmit = (index) => {
    setEditModeIndex(null);
  };
  const handledelClick = (index) => {
    const shouldDelete = window.confirm('Do you want to delete this user?');
    const notificationKey = Object.keys(notifications)[index];
    if (notificationKey) {
      remove(ref(database, `news/${notificationKey}`))
        .then(() => {
          console.log("Item deleted successfully from database");
          const newNotifications = [...notifications];
          newNotifications.splice(index, 1);
          setNotifications(newNotifications);
        })
        .catch((error) => console.error("Error deleting item:", error));
    }
  };



  return (

    <div className='loading2'>
      {loading2 ? (
        <center><div className='loading-spinner2'></div></center>
      ) : (
        <div className="main-area-div">
          <div className="top-area">
            <div className="left-logo-side">
              <img className='campusimg1' src='./cuilogo.png' alt="Dynamic Image" />
              <h3 className='university-logo-text'>CUI Scholarship Portal</h3>
            </div>
            <div className="right-logo-side">
              <div className="logout-section" onClick={navigatetonextpage0}>
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
            <div className="module" onClick={navigatetonextpage1}>
              <FaFileAlt className="module-logo" />
              <p className='module-name'>Applications</p>
            </div>
           
            <div className="module" onClick={navigatetonextpage5}>
              <FaNetworkWired className="module-logo" />
              <p className='module-name'>Societies</p>
            </div>
            <div className="module" onClick={navigatetonextpage4}>
              <LuActivity className="module-logo" />
              <p className='module-name'>Activities</p>
            </div>
            <div className="module">
              <FaUsers className="module-logo" onClick={navigatetonextpage2} />
              <p className='module-name'>Users</p>
            </div>
          </div>
          <div className="latest-news-area">
            <div className="news-top">
              <div className="left-neews-top"><h3 className='news-section-heading2'>Latest News</h3></div>
              <div className="right-news-top"><button className="addbtn" onClick={navigatetonextpage3}> + Add News </button></div> </div>



            <ul className="news-list-area">
              {loading ? (
                <div className='loading-indashboard'> {loading && <div className="loading-spinner-indashboard"></div>}
                  <h4>Loading...</h4></div>
              ) : (
                notifications.map((notification, index) => (
                  <li key={index} className="news-text-area">
                    <div className="main-content-div">
                      <div className="left-content-area-news">
                        <h4>{notification.title}</h4>
                        <p className="news-description">{notification.description}</p>
                        <a href={notification.link}>Show more</a>
                      </div>

                      <div className="right-action-on-news">
                        <MdDelete className="icon-del" onClick={() => handledelClick(index)} />
                        <br />
                        <br />
                        <MdModeEditOutline
                          className="icon"
                          onClick={() => handleEditClick(index)}
                        />
                      </div>
                    </div>
                    {editModeIndex === index && (
                      <div className="edit-area-inputs">
                        <input
                          type="text"
                          className="edit-area-inputs-feild"
                          value={notification.title}
                          onChange={(e) => handleInputChange(e, 'title', index)}
                        />
                        <input
                          type="text"
                          className="edit-area-inputs-feild"
                          value={notification.description}
                          onChange={(e) => handleInputChange(e, 'description', index)}
                        />
                        <input
                          type="text"
                          className="edit-area-inputs-feild"
                          value={notification.link}
                          onChange={(e) => handleInputChange(e, 'link', index)}
                        />
                        <button className="addbtn2" onClick={() => handleEditSubmit(index)}>
                          Submit
                        </button>
                        <button className="addbtn3" onClick={handleCancelClick}>
                          Cancel
                        </button>
                      </div>


                    )}
                  </li>
                ))
              )}
            </ul>

          </div>

          <div className="bottom">
            <p className='footer-credit'>Copyright © 2020, All Rights Reserved by CUOnline-COMSATS</p>
          </div>

        </div>
      )}
    </div>
  )
}

export default Facultydashboard