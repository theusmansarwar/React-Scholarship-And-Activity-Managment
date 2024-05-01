import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import './scholarship.css';
import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { IoArrowBackOutline, IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
const ScholarshipList = () => {

  const [scholarshipList, setScholarshipList] = useState([]);
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
  const navigatetoAddScholarship = () => {
    setLoading2(true);
    navigate('/AddScholarship');
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
    const databaseRef = ref(getDatabase(firebaseApp), 'Scholarshipdata');
    const onDataChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const scholarshipArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setScholarshipList(scholarshipArray);
      } else {
        setScholarshipList([]);
      }
    };
    onValue(databaseRef, onDataChange);
  }, []);

  const handleDeleteClick = (scholarshipId) => {
    const shouldDelete = window.confirm('Do you want to delete this Scholarship?');
    if (shouldDelete) {
      const scholarshipRef = ref(database, `Scholarshipdata/${scholarshipId}`);
      remove(scholarshipRef);
    }
  };

  const handleEditClick = (scholarshipId) => {
    setEditMode((prevState) => ({
      ...prevState,
      [scholarshipId]: true,
    }));
  };
  const handleCancelClick = () => {
    setEditMode(null);
  };

  const handleSaveClick = (scholarshipId, updatedUserData) => {
    const scholarshipRef = ref(database, `Scholarshipdata/${scholarshipId}`);
    update(scholarshipRef, updatedUserData);

    setEditMode((prevState) => ({
      ...prevState,
      [scholarshipId]: false,
    }));
  };
  const handleInputChange = (scholarshipId, fieldName, value) => {
    setScholarshipList((prevScholarshipList) => {
      const updatedScholarshipList = prevScholarshipList.map((scholarship) => {
        if (scholarship.id === scholarshipId) {
          return { ...scholarship, [fieldName]: value };
        }
        return scholarship;
      });
      return updatedScholarshipList;
    });
  };

  const filteredScholarships = scholarshipList.filter((scholarship) => {
    const titleMatches =
      searchName === '' || scholarship.scholarshipTitle.toLowerCase().includes(searchName.toLowerCase());

    return titleMatches;
  });
  return (
    <div className='loading2'>
      {loading2 ? (
        <center><div className='loading-spinner2'></div></center>
      ) : (
        <div className='mainarea-userlist'>
          <h4 className='Scholarship-heading-top'>Scholarships</h4>

          <div className="top-search-section">
            <IoArrowBackOutline className='back-logo' onClick={navigatetonextpage} />
            <input className='search-input'
              placeholder='Search Scholarship Here'
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}></input>
            <IoSearch className='search-logo' />
          </div>

          <div className="scholar-add-btm-area">
            <div className="left-add-scholar"><h4>Scholarships</h4></div>
            <button className="right-add-scholar-top" onClick={navigatetoAddScholarship}>+ Add new Scholarship</button>
          </div>

          {filteredScholarships.length > 0 ? (
            
            <ul className='Userslist'>
              {filteredScholarships.map((scholarship) => (
                <li className='editareaofuser' key={scholarship.id}>
                  <div className='usernumberdiv'>
                    <div className='leftsidecontentscholarship'>
                      <p className='Scholarship-det-text'>
                        <strong>Title:</strong> {scholarship.scholarshipTitle}<br /></p>
                      <p className='Scholarship-det-text'>
                        <strong>Type:</strong> {scholarship.scholarshipType}<br /></p>
                      <p className='Scholarship-det-text'>
                        <strong>Amount:</strong> {scholarship.scholarshipAmount}<br /></p>
                      <p className='Scholarship-det-text'>
                        <strong>Criteria:</strong> {scholarship.eligibilityCriteria}</p>
                    </div>
                    <div className="actions">
                      <MdDelete
                        className="icon-del"
                        onClick={() => handleDeleteClick(scholarship.id)}
                      />
                      <br />
                      <br />
                      <MdModeEditOutline
                        className="icon"
                        onClick={() => handleEditClick(scholarship.id)}
                      />
                    </div>
                  </div>
                  {editMode[scholarship.id] && (
                    <div className="editsection">
                      <form>
                        <input
                          type="number"
                          className='userslistinputs'
                          value={scholarship.scholarshipAmount}
                          name="scholarshipAmount"
                          placeholder='Scholarship Amount'
                          required
                          readOnly={!editMode[scholarship.id]}
                          onChange={(e) =>
                            handleInputChange(scholarship.id, 'scholarshipAmount', e.target.value)
                          }
                        />
                        <textarea
                          type="text"
                          className='userslistinputs'
                          value={scholarship.eligibilityCriteria}
                          name="eligibilityCriteria"
                          placeholder='Eligibility Criteria'
                          required
                          readOnly={!editMode[scholarship.id]}
                          onChange={(e) =>
                            handleInputChange(scholarship.id, 'eligibilityCriteria', e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="savebtn"
                          onClick={() =>
                            handleSaveClick(scholarship.id, {
                              scholarshipAmount: scholarship.scholarshipAmount,
                              eligibilityCriteria: scholarship.eligibilityCriteria,
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
  );
};

export default ScholarshipList;
