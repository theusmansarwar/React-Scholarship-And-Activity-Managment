import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { IoArrowBackOutline, IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import './Applications.css';

const Applications = () => {
  const [applicationList, setApplicationList] = useState([]);
  const [searchName, setSearchName] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
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

    return () => {
      // Cleanup function if needed
    };
  }, []);

  const navigatetonextpage = () => {
    setLoading2(true);
    navigate('/Facultydashboard');
  };

  const handleViewApplication = (id) => {
    setLoading2(true);

    navigate(`/Applicationdetails/${id}`);


  };

  const filteredApplications = applicationList.filter((application) =>
    application.title.toLowerCase().includes(searchName.toLowerCase())
  );

  return (


    <div className='loading2'>
      {loading2 ? (
        <center><div className='loading-spinner2'></div></center>
      ) : (
        <div className='mainarea-userlist'>
          <h4 className='Scholarship-heading-top'>Applications</h4>
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
                      <p className='Scholarship-det-text'>
                        <strong className='strong'>Applicant Name:</strong> {application.name}
                      </p>
                      <p className='Scholarship-det-text'>
                        <strong className='strong'>Reg No:</strong> {application.registrationNo}
                      </p>
                      <button className='view-btn' onClick={() => handleViewApplication(application.id)}>
                        View application
                      </button>
                    </div>
                    <div className={`rightsidecontentscholarship ${application.status.toLowerCase()}`}>
                      <p className='status-text'>
                        <span className='status-heading'>
                          <strong>Status: </strong>
                        </span>
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
      )}
    </div>

  );
};

export default Applications;
