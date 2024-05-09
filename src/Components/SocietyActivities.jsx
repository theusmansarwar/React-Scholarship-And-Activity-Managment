import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { IoArrowBackOutline, IoSearch } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';
import { MdFiberNew } from "react-icons/md";

const auth = getAuth(app);

const SocietyActivities = ({ firebaseConfig }) => {
    const location = useLocation();
    const societiesTitle = location.state?.societiesTitle;
    const [database, setDatabase] = useState(null);
    const [activitiesList, setActivitiesList] = useState([]);
    const [searchName, setSearchName] = useState(societiesTitle);
    const [loading2, setLoading2] = useState(false);
    const [editMode, setEditMode] = useState({});
    const [userEmail, setUserEmail] = useState(null);
    const [societyTitle, setSocietyTitle] = useState(null);
    const [societyEmail, setSocietyEmail] = useState(null);
    const navigate = useNavigate();

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
        const db = getDatabase(firebaseApp);
        setDatabase(db);


        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userId = user.uid;
                const userRef = ref(db, `userdata/${userId}`);
                onValue(userRef, (snapshot) => {
                    const userData = snapshot.val();
                    setUserEmail(userData.email);

                    const societyId = userData.societyid;
                    if (societyId) {
                        const societyRef = ref(db, `Societies/${societyId}`);
                        onValue(societyRef, (snapshot) => {
                            const societyData = snapshot.val();
                            if (societyData && societyData.PresidentEmail === userData.email) {
                                setSocietyTitle(societyData.title);
                                setSocietyEmail(societyData.PresidentEmail);
                            }
                        });
                    }
                });
            }
        });

        const databaseRef = ref(db, 'Activities');
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

        return () => authUnsubscribe();
    }, [firebaseConfig]); // Dependency added

    const filteredActivitiesList = activitiesList.filter((activity) => {
        return searchName === '' || activity.SocietyName.toLowerCase().includes(searchName.toLowerCase());

    });

    const navigateToDashboard = () => {
        setLoading2(true);
        navigate('/Dashboard');
    };

    const handleDeleteClick = (activitiesId) => {
        const shouldDelete = window.confirm('Do you want to delete this Event?');
        if (shouldDelete) {
            const scholarshipRef = ref(database, `Activities/${activitiesId}`);
            remove(scholarshipRef);
        }
    };

    const handleEditClick = (activitiesId) => {
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [activitiesId]: true,
        }));
    };

    const handleSaveClick = (activitiesId, updatedActivityData) => {
        const scholarshipRef = ref(database, `Activities/${activitiesId}`);
        update(scholarshipRef, updatedActivityData);
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [activitiesId]: false,
        }));
    };

    const handleInputChange = (activitiesId, fieldName, value) => {
        setActivitiesList((prevActivitiesList) => {
            const updatedActivitiesList = prevActivitiesList.map((activity) => {
                if (activity.id === activitiesId) {
                    return { ...activity, [fieldName]: value };
                }
                return activity;
            });
            return updatedActivitiesList;
        });
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // 'en-GB' represents the format dd/mm/yyyy
    }
    const isNewItem = (uploadDate) => {
        const currentDate = new Date();
        const itemDate = new Date(uploadDate);
        const differenceInTime = currentDate.getTime() - itemDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays < 7;
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
                                            <p className='Scholarship-det-text'><strong>Title:</strong> {activity.title}<br /></p>
                                            <p className='Scholarship-det-text'><strong>Description:</strong> {activity.description}<br /></p>
                                            <p className='Scholarship-det-text'><strong>Society Name:</strong> {activity.SocietyName}<br /></p>
                                            <p className='Scholarship-det-text'><strong>Event Date:</strong> {activity.EventDate}<br /></p>
                                            <p className='Scholarship-det-text'><strong>Event Venue:</strong> {activity.EventVenu}</p>
                                            <p className='Scholarship-det-text'><strong>Created On:</strong> {formatDate(activity.uploadDate)}</p>
                                            <a href={activity.applylink}>Apply Now</a>
                                            </div>                                      
                                        <div className="actions">
                                            {activity.SocietyName === societyTitle && ( // Check if Society Name matches
                                                <>
                                                    <MdDelete
                                                        className="icon-del"
                                                        onClick={() => handleDeleteClick(activity.id)}
                                                    />
                                                    <br />
                                                    <br />
                                                    <MdModeEditOutline
                                                        className="icon"
                                                        onClick={() => handleEditClick(activity.id)}
                                                    />
                                                </>
                                            )}
                                        </div>
                                       
                                           
                                        
                                        <div className="newicon">{isNewItem(activity.uploadDate) && <MdFiberNew />}</div>

                                    </div>
                                    {editMode[activity.id] && (
                                        <div className="editsection">
                                            <form>
                                                <input
                                                    type="text"
                                                    className='userslistinputs'
                                                    value={activity.title}
                                                    name="title"
                                                    placeholder='title'
                                                    required
                                                    readOnly={!editMode[activity.id]}
                                                    onChange={(e) =>
                                                        handleInputChange(activity.id, 'title', e.target.value)
                                                    }
                                                />
                                                <textarea
                                                    type="text"
                                                    className='userslistinputs'
                                                    value={activity.description}
                                                    name="description"
                                                    placeholder='Description'
                                                    required
                                                    readOnly={!editMode[activity.id]}
                                                    onChange={(e) =>
                                                        handleInputChange(activity.id, 'description', e.target.value)
                                                    }
                                                />

                                                <textarea
                                                    type="text"
                                                    className='userslistinputs'
                                                    value={activity.EventDate}
                                                    name="EventDate"
                                                    placeholder='Event Date'
                                                    required
                                                    readOnly={!editMode[activity.id]}
                                                    onChange={(e) =>
                                                        handleInputChange(activity.id, 'EventDate', e.target.value)
                                                    }
                                                />
                                                <textarea
                                                    type="text"
                                                    className='userslistinputs'
                                                    value={activity.EventVenu}
                                                    name="EventVenu"
                                                    placeholder='Event Venue'
                                                    required
                                                    readOnly={!editMode[activity.id]}
                                                    onChange={(e) =>
                                                        handleInputChange(activity.id, 'EventVenu', e.target.value)
                                                    }
                                                />
                                                 <textarea
                                                    type="link"
                                                    className='userslistinputs'
                                                    value={activity.applylink}
                                                    name="applylink"
                                                    placeholder='applylink'
                                                    required
                                                    readOnly={!editMode[activity.id]}
                                                    onChange={(e) =>
                                                        handleInputChange(activity.id, 'applylink', e.target.value)
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="savebtn"
                                                    onClick={() =>
                                                        handleSaveClick(activity.id, {
                                                            title: activity.title,
                                                            description: activity.description,
                                                            EventDate: activity.EventDate,
                                                            EventVenu: activity.EventVenu,
                                                            applylink: activity.applylink,
                                                        })
                                                    }
                                                >
                                                    Save
                                                </button>

                                            </form>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className='loading-indashboard'>
                            <h4>Loading...</h4>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SocietyActivities;
