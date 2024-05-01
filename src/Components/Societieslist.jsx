import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';

import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { IoArrowBackOutline, IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';

const Societieslist = () => {
    const [societieslist, setsocietiesList] = useState([]);
    const [database, setDatabase] = useState(null);
    const [editMode, setEditMode] = useState({});
    const [users, setUsers] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [userType, setUserType] = useState('');
    const auth = getAuth(app);
    const navigatetonextpage = () => {
      setLoading2(true);
      navigate('/dashboard');
  
    };
  

    useEffect(() => {
        const firebaseConfig = {
          apiKey: "AIzaSyBj5kZy9sskXEg0xlbMDg35-pVvSTJm9Zw",
          authDomain: "cuischolarship-23b42.firebaseapp.com",
          projectId: "cuischolarship-23b42",
          storageBucket: "cuischolarship-23b42.appspot.com",
          messagingSenderId: "361327887400",
          appId: "1:361327887400:web:9a6386f40f1c34b95fe11d",
        };
        const firebaseApp = initializeApp(firebaseConfig);
        setDatabase(getDatabase(firebaseApp));
        const databaseRef = ref(getDatabase(firebaseApp), 'Societies');
        const onDataChange = (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const societiesArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setsocietiesList(societiesArray);
          } else {
            setsocietiesList([]);
          }
        };
        onValue(databaseRef, onDataChange);
      }, []);
   
    

      const filteredsocietieslist = societieslist.filter((societies) => {
        const titleMatches =
          searchName === '' || societies.title.toLowerCase().includes(searchName.toLowerCase());
    
        return titleMatches;
      });
      
    const navigate = useNavigate();
    const navigateToviewEvents = (title) => {
        navigate('/SocietyActivities', { state: { societiesTitle: title } });
        
    };

  return (
    <div className='loading2'>
      {loading2 ? (
        <center><div className='loading-spinner2'></div></center>
      ) : (
        <div className='mainarea-userlist'>
          <h4 className='Scholarship-heading-top'>Societies</h4>

          <div className="top-search-section">
            <IoArrowBackOutline className='back-logo' 
            onClick={navigatetonextpage}
             />
            <input className='search-input'
              placeholder='Search Society Here'
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}></input>
            <IoSearch className='search-logo' />
          </div>

          <div className="scholar-add-btm-area">
            <div className="left-add-scholar"><h4>Societies</h4></div>
          </div>

          {filteredsocietieslist.length > 0 ? (
            
            <ul className='Userslist'>
              {filteredsocietieslist.map((societies) => (
                <li className='editareaofuser' key={societies.id}>
                  <div className='usernumberdiv'>
                    <div className='leftsidecontentscholarship'>
                      <p className='Scholarship-det-text'>
                        <strong>Title:</strong> {societies.title}<br /></p>
                      <p className='Scholarship-det-text'>
                        <strong>Description:</strong> {societies.description}<br /></p>
                      <p className='Scholarship-det-text'>
                        <strong>President Name:</strong> {societies.PresidentName}<br /></p>
                        <p className='Scholarship-det-text'>
                        <strong>President RegNo:</strong> {societies.PresidentRegNo}<br /></p>
                      <p className='Scholarship-det-text'>
                        <strong>President Email:</strong> {societies.PresidentEmail}</p>
                    </div>
                    <div className="actions">
                                    <button className='submitbtn'
                                        onClick={() => navigateToviewEvents(societies.title)}
                                    >View Events </button>
                                </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className='loading-indashboard'> {loading && <div className="loading-spinner-indashboard"></div>}
              <h4>Loading...</h4></div>
          )}
        </div>
      )}
    </div>
  )
}

export default Societieslist