import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { IoArrowBackOutline, IoSearch } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';

const SocietyActivities = () => {
    const location = useLocation();
    const societiesTitle = location.state?.societiesTitle;
    const [activitieslist, setActivitiesList] = useState([]);
    const [searchName, setSearchName] = useState(societiesTitle);
    const navigate = useNavigate();
    const [loading2, setLoading2] = useState(false);
    const [loading, setLoading] = useState(false);

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
        const database = getDatabase(firebaseApp);
        const databaseRef = ref(database, 'Activities');
        
        const onDataChange = (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const activitiesArray = Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
              }));
              setActivitiesList(activitiesArray);
            } else {
                setActivitiesList([]);
            }
          };
          onValue(databaseRef, onDataChange);
    }, []);

  
    const filteredActivitiesList = activitieslist.filter((societies) => {
        const titleMatches =
          searchName === '' || societies.SocietyName.toLowerCase().includes(searchName.toLowerCase());
    
        return titleMatches;
      });
    const navigateToDashboard = () => {
        setLoading2(true);
        navigate('/Dashboard');
    };
    


    return (
        <div className='loading2'>
             
            {loading2 ? (
                <div className='loading-spinner2'>
                     <h3>Society Activities for: {societiesTitle}</h3>
                </div>
            ) : (
                <div className='mainarea-userlist'>
                    <h4 className='Scholarship-heading-top'>Activities</h4>

                    <div className="top-search-section">
                        <IoArrowBackOutline className='back-logo' onClick={navigateToDashboard} />
                        <input className='search-input'
                            placeholder='Search Event Here'
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)} />
                        <IoSearch className='search-logo' />
                    </div>

                  

                    {filteredActivitiesList.length > 0 ? (
                        <ul className='Userslist'>
                            {filteredActivitiesList.map((activity) => (
                                <li className='editareaofuser' key={activity.id}>
                                    <div className='usernumberdiv'>
                                        <div className='leftsidecontentscholarship'>
                                            <p className='Scholarship-det-text'>
                                                <strong>Title:</strong> {activity.title}<br />
                                            </p>
                                            <p className='Scholarship-det-text'>
                                                <strong>Description:</strong> {activity.description}<br />
                                            </p>
                                            <p className='Scholarship-det-text'>
                                                <strong>Society Name:</strong> {activity.SocietyName}<br />
                                            </p>
                                            <p className='Scholarship-det-text'>
                                                <strong>Event Date:</strong> {activity.EventDate}<br />
                                            </p>
                                            <p className='Scholarship-det-text'>
                                                <strong>Event Venue:</strong> {activity.EventVenu}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className='loading-indashboard'>
                            {loading && <div className="loading-spinner-indashboard"></div>}
                            <h4>Loading...</h4>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SocietyActivities;
