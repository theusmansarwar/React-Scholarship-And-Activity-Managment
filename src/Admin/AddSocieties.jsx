import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';
import { getDatabase, ref, push, set, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app);
const database = getDatabase(app);

const AddSocieties = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        PresidentName: '',
        PresidentEmail: '',
        PresidentRegNo: '',
    });

    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create the new society
            const societiesRef = ref(database, 'Societies');
            const newSocietyRef = await push(societiesRef, {
                title: formData.title,
                description: formData.description,
                PresidentName: formData.PresidentName,
                PresidentEmail: formData.PresidentEmail,
                PresidentRegNo: formData.PresidentRegNo,
            });

            // Get user ID based on the entered email
            const userEmail = formData.PresidentEmail;
            const usersRef = ref(database, 'userdata');
            const userQuery = query(usersRef, orderByChild('email'), equalTo(userEmail));
            let userId;
            onValue(userQuery, (snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    userId = Object.keys(userData)[0]; // Assuming there's only one user with the provided email
                    // Update user data with the new society ID

                    set(ref(database, `userdata/${userId}/societyid`), newSocietyRef.key);
                    setLoading(false);
                    alert('Society Registered Successfully');
                    navigate('/Activities');
                } else {
                    console.error('User not found with email:', userEmail);
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error('Error in Society Registering:', error.message);
            setLoading(false);
        }
    };

    return (
        <div className='loading2'>
            {loading2 ? (
                <center><div className='loading-spinner2'></div></center>
            ) : (
                <div className="main-area-div">
                    <div className="top-heading-area">
                        <div className="left-logo-side">
                            <img className='campusimg1' src='./cuilogo.png' alt="Dynamic Image" />
                            <h3 className='university-logo-text'>CUI Scholarship & Activities Portal</h3>
                        </div>
                        <div className="right-logo-side"></div>
                    </div>
                    <div className='sub-area-div'>
                        <div className="form-area4">
                            <center><h3>Create New Society</h3></center>
                            <form onSubmit={handleSubmit}>
                                <div className="inputdiv">
                                    <label>
                                        Society Name: </label><br />
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} required/>
                                </div>
                                <div className="inputdiv">
                                    <label>
                                        Description: </label><br />
                                    <textarea type="text" name="description" value={formData.description} onChange={handleChange} required />

                                </div>

                                < div className="inputdiv">
                                    <label>
                                        President Name: </label><br />
                                    <input type="text" name="PresidentName" value={formData.PresidentName} onChange={handleChange} required/>
                                </div>
                                < div className="inputdiv">
                                    <label>
                                        President Email: </label><br />
                                    <input type="text" name="PresidentEmail" value={formData.PresidentEmail} onChange={handleChange} required/>
                                </div>
                                < div className="inputdiv">
                                    <label>
                                        President RegNo: </label><br />
                                    <input type="text" name="PresidentRegNo" value={formData.PresidentRegNo} onChange={handleChange} required/>
                                </div>

                                <br />
                                <button className='submitbtn' type="submit">Submit</button>
                            </form>

                        </div>
                    </div>
                    <div className="bottom">
                        <p className='footer-credit'>Copyright © 2020, All Rights Reserved by CUOnline-COMSATS</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddSocieties