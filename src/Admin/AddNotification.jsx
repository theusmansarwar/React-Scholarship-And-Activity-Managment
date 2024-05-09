import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { getDatabase, ref, push } from 'firebase/database';
import { useNavigate} from 'react-router-dom';

const auth = getAuth(app);
const database = getDatabase(app);


const firebaseConfig = {
    apiKey: "AIzaSyBj5kZy9sskXEg0xlbMDg35-pVvSTJm9Zw",
    authDomain: "cuischolarship-23b42.firebaseapp.com",
    projectId: "cuischolarship-23b42",
    storageBucket: "cuischolarship-23b42.appspot.com",
    messagingSenderId: "361327887400",
    appId: "1:361327887400:web:9a6386f40f1c34b95fe11d",
};

const AddNotification = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
       

    });

    const [loading2, setLoading2] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading2(true);

        try {


            const usersRef = ref(database, 'notification');
            await push(usersRef, {
                notify: formData.notify,
            });
            alert('News Added Successfully ');
            navigate('/Facultydashboard');
        } catch (error) {
            console.error('Error News Added:', error.message);
            setLoading2(false);
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
                            <center><h3>Add new Notification</h3></center>
                            <form onSubmit={handleSubmit}>
                                <div className="inputdiv">
                                    <label>
                                        Text: </label><br />
                                    <input type="text" name="notify" value={formData.notify} onChange={handleChange} required />
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
    );
};

export default AddNotification;
