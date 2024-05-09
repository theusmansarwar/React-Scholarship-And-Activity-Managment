import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import './Activities.css';
import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { IoArrowBackOutline, IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { MdFiberNew } from "react-icons/md";

const Activities = () => {
  const [activitieslist, setactivitieslist] = useState([]);
  const [database, setDatabase] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const navigatetonextpage = () => {
    setLoading2(true);
    navigate('/Facultydashboard');

  };
  const navigatetoAddSociety = () => {
    setLoading2(true);
    navigate('/AddnewActivity');
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
    const databaseRef = ref(getDatabase(firebaseApp), 'Activities');
    const onDataChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const activitiesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setactivitieslist(activitiesArray);
      } else {
        setactivitieslist([]);
      }
    };
    onValue(databaseRef, onDataChange);
  }, []);

  const filteredactivitieslist = activitieslist.filter((activities) => {
    const titleMatches =
      searchName === '' || activities.title.toLowerCase().includes(searchName.toLowerCase());

    return titleMatches;
  });



  const handleDeleteClick = (activitiesId) => {
    const shouldDelete = window.confirm('Do you want to delete this Event?');
    if (shouldDelete) {
      const scholarshipRef = ref(database, `Activities/${activitiesId}`);
      remove(scholarshipRef);
    }
  };

  const handleEditClick = (activitiesId) => {
    setEditMode((prevState) => ({
      ...prevState,
      [activitiesId]: true,
    }));
  };
  const handleSaveClick = (activitiesId, updatedUserData) => {
    const scholarshipRef = ref(database, `Activities/${activitiesId}`);
    update(scholarshipRef, updatedUserData);

    setEditMode((prevState) => ({
      ...prevState,
      [activitiesId]: false,
    }));
  };
  const handleInputChange = (activitiesId, fieldName, value) => {
    setactivitieslist((prevsocietiesList) => {
      const updatedsocietiesList = prevsocietiesList.map((activities) => {
        if (activities.id === activitiesId) {
          return { ...activities, [fieldName]: value };
        }
        return activities;
      });
      return updatedsocietiesList;
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
        <center><div className='loading-spinner2'></div></center>
      ) : (
        <div className='mainarea-userlist'>
          <h4 className='Scholarship-heading-top'>Activities</h4>

          <div className="top-search-section">
            <IoArrowBackOutline className='back-logo'
              onClick={navigatetonextpage}
            />
            <input className='search-input'
              placeholder='Search Event Here'
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}></input>
            <IoSearch className='search-logo' />
          </div>

          <div className="scholar-add-btm-area">
            <div className="left-add-scholar"><h4>Activities</h4></div>
            <button className="right-add-scholar-top"
              onClick={navigatetoAddSociety}
            >+ Add new Activities</button>
          </div>

          {filteredactivitieslist.length > 0 ? (

            <ul className='Userslist'>
              {filteredactivitieslist.map((activities) => (
                <li className='editareaofuser' key={activities.id}>
                  <div className='usernumberdiv'>
                    <div className='leftsidecontentscholarship'>
                      <p className='Scholarship-det-text'>
                        <strong>Title:</strong> {activities.title}<br /></p>
                      <p className='Scholarship-det-text'>
                        <strong>Description:</strong> {activities.description}<br /></p>
                      <p className='Scholarship-det-text'>
                        <strong>Society Name:</strong> {activities.SocietyName}<br /></p>
                      <p className='Scholarship-det-text'>
                        <strong>Event Date:</strong> {activities.EventDate}<br /></p>
                      <p className='Scholarship-det-text'>
                        <strong>Event Venue:</strong> {activities.EventVenu}</p>
                        <p className='Scholarship-det-text'>
                        <strong>Created On:</strong> {formatDate(activities.uploadDate)}</p>
                    </div>
                    <div className="actions">
                      <MdDelete
                        className="icon-del"
                        onClick={() => handleDeleteClick(activities.id)}
                      />
                      <br />
                      <br />
                      <MdModeEditOutline
                        className="icon"
                        onClick={() => handleEditClick(activities.id)}
                      />
                    </div>
                    <div className="newicon">{isNewItem(activities.uploadDate) && <MdFiberNew />}</div>
                  </div>
                  {editMode[activities.id] && (
                    <div className="editsection">
                      <form>
                        <input
                          type="text"
                          className='userslistinputs'
                          value={activities.title}
                          name="title"
                          placeholder='title'
                          required
                          readOnly={!editMode[activities.id]}
                          onChange={(e) =>
                            handleInputChange(activities.id, 'title', e.target.value)
                          }
                        />
                        <textarea
                          type="text"
                          className='userslistinputs'
                          value={activities.description}
                          name="description"
                          placeholder='Description'
                          required
                          readOnly={!editMode[activities.id]}
                          onChange={(e) =>
                            handleInputChange(activities.id, 'description', e.target.value)
                          }
                        />
                        <input
                          type="text"
                          className='userslistinputs'
                          value={activities.SocietyName}
                          name="SocietyName"
                          placeholder='Society Name'
                          required
                          readOnly={!editMode[activities.id]}
                          onChange={(e) =>
                            handleInputChange(activities.id, 'SocietyName', e.target.value)
                          }
                        />
                        <textarea
                          type="text"
                          className='userslistinputs'
                          value={activities.EventDate}
                          name="EventDate"
                          placeholder='Event Date'
                          required
                          readOnly={!editMode[activities.id]}
                          onChange={(e) =>
                            handleInputChange(activities.id, 'EventDate', e.target.value)
                          }
                        />
                        <textarea
                          type="email"
                          className='userslistinputs'
                          value={activities.EventVenu}
                          name="EventVenu"
                          placeholder='Event Venue'
                          required
                          readOnly={!editMode[activities.id]}
                          onChange={(e) =>
                            handleInputChange(activities.id, 'EventVenu', e.target.value)
                          }
                        />
                           <textarea
                          type="link"
                          className='userslistinputs'
                          value={activities.applylink}
                          name="applylink"
                          placeholder='applylink'
                          required
                          readOnly={!editMode[activities.id]}
                          onChange={(e) =>
                            handleInputChange(activities.id, 'applylink', e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="savebtn"
                          onClick={() =>
                            handleSaveClick(activities.id, {
                              title: activities.title,
                              description: activities.description,
                              SocietyName: activities.SocietyName,
                              EventDate: activities.EventDate,
                              EventVenu: activities.EventVenu,
                              applylink: activities.applylink,
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
            <div className='loading-indashboard'> {loading && <div className="loading-spinner-indashboard"></div>}
              <h4>Loading...</h4></div>
          )}
        </div>
      )}
    </div>
  )
}

export default Activities