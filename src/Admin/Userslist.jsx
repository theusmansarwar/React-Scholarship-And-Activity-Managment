import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, update, remove } from 'firebase/database';

import { MdSomeIcon } from 'react-icons/md';
import { IoArrowBackOutline, IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import './Userslist.css';
const firebaseConfig = {
    apiKey: "AIzaSyBj5kZy9sskXEg0xlbMDg35-pVvSTJm9Zw",
    authDomain: "cuischolarship-23b42.firebaseapp.com",
    projectId: "cuischolarship-23b42",
    storageBucket: "cuischolarship-23b42.appspot.com",
    messagingSenderId: "361327887400",
    appId: "1:361327887400:web:9a6386f40f1c34b95fe11d",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const UsersList = () => {
    const [selectedProgram, setSelectedProgram] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchRegistration, setSearchRegistration] = useState('');
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [editModeIndex, setEditModeIndex] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const handleInputChange = (userId, fieldName, value) => {

        setUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((user) => {
                if (user.id === userId) {
                    return { ...user, [fieldName]: value };
                }
                return user;
            });
            return updatedUsers;
        });
    };


    const handleDeleteClick = (userId) => {
        const shouldDelete = window.confirm('Do you want to delete this user?');

        if (shouldDelete) {
            const userRef = ref(database, `userdata/${userId}`);
            remove(userRef);
        }
    };
    useEffect(() => {
        const usersRef = ref(database, 'userdata');

        const unsubscribe = onValue(usersRef, (snapshot) => {
            const userData = snapshot.val();
            const userList = userData
                ? Object.keys(userData).map((userId) => ({
                    id: userId,
                    ...userData[userId],
                }))
                : [];

            setUsers(userList);
        });

        return () => {
            unsubscribe();
        };
    }, [database]);


    const handleEditClick = (userId) => {
        setEditMode((prevState) => ({
            ...prevState,
            [userId]: true,
        }));
    };

    const handleSaveClick = (userId, updatedUserData) => {

        const userRef = ref(database, `userdata/${userId}`);
        update(userRef, updatedUserData);


        setEditMode((prevState) => ({
            ...prevState,
            [userId]: false,
        }));
    };

    const handleInputChangesearch = (event) => {
        const { name, value } = event.target;

        if (name === 'program') {
            setSelectedProgram(value);
        } else if (name === 'name') {
            setSearchName(value);
        } else if (name === 'registeration') {
            setSearchRegistration(value);
        }
    };

    const filteredUsers = users.filter((user) => {
        const programMatches = selectedProgram === '' || user.program === selectedProgram;
        const nameMatches =
            searchName === '' || user.name.toLowerCase().includes(searchName.toLowerCase());
        const registrationMatches =
            searchRegistration === '' ||
            user.registrationNo.toLowerCase().includes(searchRegistration.toLowerCase());

        return programMatches && nameMatches && registrationMatches;
    });
    const clearFilters = () => {

        setSelectedProgram('');
        setSearchName('');
        setSearchRegistration('');
    };
    const userCount = users.length;
    const handleCancelClick = () => {
        setEditModeIndex(null);
    };
    const navigatetonextpage = () => {
        navigate('/Facultydashboard');
    };

    return (
        <div className='mainarea-userlist'>

            <h4 className='Scholarship-heading-top'>Users</h4>

            <div className="top-search-section">
                <div className="toparea">
                    <IoArrowBackOutline className='back-logo2' onClick={navigatetonextpage} />
                    <select
                        name="program"
                        className='userslisttextarea'
                        onChange={handleInputChangesearch}
                        value={selectedProgram}
                    >
                        <option >
                            Select Program
                        </option>
                        <option>Computer Science</option>
                        <option>Software Engineering</option>
                        <option>Food Science Nutrition</option>
                        <option>Mathematics</option>
                        <option>BBA</option>
                        <option>Mechanical Engineering</option>
                        <option>Electrical Engineering</option>
                        <option>Civil Engineering</option>
                    </select>
                    <input
                        className='userslisttextarea'
                        type="text"
                        name="name"
                        onChange={handleInputChangesearch}
                        value={searchName}
                        placeholder='Search By Name'
                    />
                    <input
                        type="text"
                        className='userslisttextarea'
                        name="registeration"
                        onChange={handleInputChangesearch}
                        value={searchRegistration}
                        placeholder='Search By Reg No'
                    />

                    <button type="submit" className="savebtn" onClick={clearFilters}>
                        Clear
                    </button>
                </div>
            </div>


            <h4 className='users-count'>
                User List <span className="countusers">({filteredUsers.length})</span>
            </h4>
            {filteredUsers.length > 0 ? (
                <ul className='Userslist'>
                    {filteredUsers.map((user) => (
                        <li key={user.id}>
                            <div className="editareaofuser">
                                <div className="usernumberdiv">
                                    <div className="leftsidecontent">
                                        <strong>Name:</strong> {user.name} <br />
                                        <br />
                                        <strong>Program:</strong> {user.program}
                                    </div>
                                    <div className="rightsidecontent">
                                        <strong>Reg No#:</strong> {user.registrationNo} <br />
                                        <br />
                                        <strong>Email:</strong> {user.email}
                                    </div>
                                    <div className="actions">
                                        <MdDelete
                                            className="icon-del"
                                            onClick={() => handleDeleteClick(user.id)}
                                        />{' '}
                                        <br />
                                        <br />
                                        <MdModeEditOutline
                                            className="icon"
                                            onClick={() => handleEditClick(user.id)}
                                        />
                                    </div>
                                </div>
                                {editMode[user.id] && (
                                    <div className="editsection">
                                        <form >
                                            <input
                                                type="text"
                                                className='userslistinputs'
                                                value={user.name}
                                                name="name"
                                                required
                                                readOnly={!editMode[user.id]}
                                                onChange={(e) =>
                                                    handleInputChange(user.id, 'name', e.target.value)
                                                }
                                            />
                                            <input
                                                type="email"
                                                className='userslistinputs'
                                                value={user.email}
                                                name="email"
                                                required
                                                readOnly={!editMode[user.id]}
                                                onChange={(e) =>
                                                    handleInputChange(user.id, 'email', e.target.value)
                                                }
                                            />
                                            <input
                                                type="text"
                                                className='userslistinputs'
                                                value={user.program}
                                                name="program"
                                                required
                                                readOnly={!editMode[user.id]}
                                                onChange={(e) =>
                                                    handleInputChange(user.id, 'program', e.target.value)
                                                }
                                            />
                                            <input
                                                type="text"
                                                className='userslistinputs'
                                                value={user.registrationNo}
                                                name="registrationNo"
                                                required
                                                readOnly={!editMode[user.id]}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        user.id,
                                                        'registrationNo',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                             <input
                                                type="text"
                                                className='userslistinputs'
                                                value={user.type}
                                                name="type"
                                                required
                                                readOnly={!editMode[user.id]}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        user.id,
                                                        'type',
                                                        e.target.value
                                                    )
                                                }
                                            />
<input
                                                type="text"
                                                className='userslistinputs'
                                                value={user.president}                                     
                                                name="president"
                                                required
                                                readOnly={!editMode[user.id]}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        user.id,
                                                        'president',
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <button
                                                type="button"
                                                className="savebtn"
                                                onClick={() =>handleSaveClick
                                                    (user.id, {
                                                        name: user.name,
                                                        email: user.email,
                                                        program: user.program,
                                                        registrationNo: user.registrationNo,
                                                        type: user.type,
                                                        president: user.president,
                                                    })
                                                }
                                            >

                                                Save
                                            </button>
                                            <button className="addbtn2" onClick={handleCancelClick}>
                                                Cancel
                                            </button>
                                        </form>
                                    </div>
                                )}
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

export default UsersList;
