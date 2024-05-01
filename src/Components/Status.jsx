import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './Status.css';
import { IoArrowBackOutline, IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Status = () => {
  const [applicationList, setApplicationList] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [database, setDatabase] = useState(null);
  const [searchName, setSearchName] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        setCurrentUserEmail('');
      }
    });

    const databaseRef = ref(getDatabase(firebaseApp), 'applications');

    const onDataChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const applicationArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setApplicationList(applicationArray);
      } else {
        setApplicationList([]);
      }
    };

    onValue(databaseRef, onDataChange);
  }, []);

  const navigatetonextpage = () => {
    navigate('/Dashboard');
  };

  const filteredApplications = applicationList.filter((application) => {
    const userMatches = currentUserEmail === application.email;
    const titleMatches =
      searchName === '' || application.title.toLowerCase().includes(searchName.toLowerCase());

    return userMatches && titleMatches;
  });

  return (
    <div className='mainarea-userlist'>
      <h4 className='Scholarship-heading-top'>Status For Applications</h4>
      <div className='top-search-section'>
        <IoArrowBackOutline className='back-logo' onClick={navigatetonextpage} />
        <input
          className='search-input'
          placeholder='Search Applications Here'
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <IoSearch className='search-logo' />
      </div>

      {filteredApplications.length > 0 ? (
        <ul className='Userslist'>
          {filteredApplications.map((application) => (
            <li className='editareaofuser' key={application.id}>
              <div className='usernumberdiv'>
                <div className='leftsidecontentscholarship'>
                  <p className='Scholarship-det-text'>
                    <strong className='strong'>Title:</strong> {application.title}
                  </p>
                </div>
                <div className={`rightsidecontentscholarship ${application.status.toLowerCase()}`}>
                  <p className='status-text'> <span className='status-heading'><strong>Status: </strong></span>
                    {application.status}
                  </p>
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
  );
};

export default Status;
