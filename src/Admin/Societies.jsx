import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import './scholarship.css';
import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { IoArrowBackOutline, IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Societies = () => {
    const [societieslist, setsocietiesList] = useState([]);
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
      navigate('/Addsocieties');
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



      const handleDeleteClick = (societiesId) => {
        const shouldDelete = window.confirm('Do you want to delete this society?');
        if (shouldDelete) {
          const scholarshipRef = ref(database, `Societies/${societiesId}`);
          remove(scholarshipRef);
        }
      };
    
      const handleEditClick = (societiesId) => {
        setEditMode((prevState) => ({
          ...prevState,
          [societiesId]: true,
        }));
      };
      const handleSaveClick = (societiesId, updatedUserData) => {
        const scholarshipRef = ref(database, `Societies/${societiesId}`);
        update(scholarshipRef, updatedUserData);
    
        setEditMode((prevState) => ({
          ...prevState,
          [societiesId]: false,
        }));
      };
      const handleInputChange = (societiesId, fieldName, value) => {
        setsocietiesList((prevsocietiesList) => {
          const updatedsocietiesList = prevsocietiesList.map((societies) => {
            if (societies.id === societiesId) {
              return { ...societies, [fieldName]: value };
            }
            return societies;
          });
          return updatedsocietiesList;
        });
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
            <button className="right-add-scholar-top"
             onClick={navigatetoAddSociety}
             >+ Add new Society</button>
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
                      <MdDelete
                        className="icon-del"
                        onClick={() => handleDeleteClick(societies.id)}
                      />
                      <br />
                      <br />
                      <MdModeEditOutline
                        className="icon"
                        onClick={() => handleEditClick(societies.id)}
                      />
                    </div>
                  </div>
                  {editMode[societies.id] && (
                    <div className="editsection">
                      <form>
                        <input
                          type="text"
                          className='userslistinputs'
                          value={societies.title}
                          name="title"
                          placeholder='title'
                          required
                          readOnly={!editMode[societies.id]}
                          onChange={(e) =>
                            handleInputChange(societies.id, 'title', e.target.value)
                          }
                        />
                        <textarea
                          type="text"
                          className='userslistinputs'
                          value={societies.description}
                          name="description"
                          placeholder='Description'
                          required
                          readOnly={!editMode[societies.id]}
                          onChange={(e) =>
                            handleInputChange(societies.id, 'description', e.target.value)
                          }
                        />
                             <input
                          type="text"
                          className='userslistinputs'
                          value={societies.PresidentName}
                          name="PresidentName"
                          placeholder='President Name'
                          required
                          readOnly={!editMode[societies.id]}
                          onChange={(e) =>
                            handleInputChange(societies.id, 'PresidentName', e.target.value)
                          }
                        />
                        <textarea
                          type="text"
                          className='userslistinputs'
                          value={societies.PresidentRegNo}
                          name="PresidentRegNo"
                          placeholder='President RegNo'
                          required
                          readOnly={!editMode[societies.id]}
                          onChange={(e) =>
                            handleInputChange(societies.id, 'PresidentRegNo', e.target.value)
                          }
                        />
                             <textarea
                          type="email"
                          className='userslistinputs'
                          value={societies.PresidentEmail}
                          name="PresidentEmail"
                          placeholder='President Email'
                          required
                          readOnly={!editMode[societies.id]}
                          onChange={(e) =>
                            handleInputChange(societies.id, 'PresidentEmail', e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="savebtn"
                          onClick={() =>
                            handleSaveClick(societies.id, {
                                title: societies.title,
                                description: societies.description,
                                PresidentName: societies.PresidentName,
                                PresidentRegNo: societies.PresidentRegNo,
                                PresidentEmail: societies.PresidentEmail,
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

export default Societies