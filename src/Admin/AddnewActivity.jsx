import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { useNavigate, Link } from 'react-router-dom';

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


const AddnewActivity = () => {
    const [societyTitles, setSocietyTitles] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        SocietyName: '',
        EventDate: '',
        EventVenu: '',
        applylink:'',
    });

    const [loading2, setLoading2] = useState(false);

    useEffect(() => {
        const titlesRef = ref(database, 'Societies');
        onValue(titlesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const titles = Object.values(data).map((society) => society.title);
                setSocietyTitles(titles);
            } else {
                setSocietyTitles([]);
            }
        });
    }, []); // Empty dependency array ensures the effect runs only once

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading2(true);
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString(); 

        try {
            const usersRef = ref(database, 'Activities');
            await push(usersRef, {
                title: formData.title,
                description: formData.description,
                SocietyName: formData.SocietyName,
                EventDate: formData.EventDate,
                EventVenu: formData.EventVenu,
                uploadDate: formattedDate,
                applylink: formData.applylink,
            });
            alert('Event Registered Successfully ');
            navigate('/Activities');
        } catch (error) {
            console.error('Error in Society Registering:', error.message);
            setLoading2(false);
        }
    };

    return (
        <div className='loading2'>
            {loading2 ? (
                <center><div className='loading-spinner2'></div></center>
            ) : (
                <div className="main-area-div">
                    <h3>{ }</h3>
                    <div className="top-heading-area">
                        <div className="left-logo-side">
                            <img className='campusimg1' src='./cuilogo.png' alt="Dynamic Image" />
                            <h3 className='university-logo-text'>CUI Scholarship & Activities Portal</h3>
                        </div>
                        <div className="right-logo-side"></div>
                    </div>
                    <div className='sub-area-div'>
                        <div className="form-area4">
                            <center><h3>Create New Activity </h3></center>
                            <form onSubmit={handleSubmit}>
                                <div className="inputdiv">
                                    <label>Activity Name: </label><br />
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                                </div>
                                <div className="inputdiv">
                                    <label>Description: </label><br />
                                    <textarea type="text" name="description" value={formData.description} onChange={handleChange}  required/>
                                </div>
                                <div className="inputdiv">
                                    <label>Society Name: </label><br />
                                    <select name="SocietyName" value={formData.SocietyName} onChange={handleChange} required>
                                        <option value="">Select Society</option>
                                        {societyTitles.map((title, index) => (
                                            <option key={index} value={title}>{title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="inputdiv">
                                    <label>Event Date: </label><br />
                                    <input type="date" name="EventDate" value={formData.EventDate} onChange={handleChange} required/>
                                </div>
                                <div className="inputdiv">
                                    <label>Apply Form Link: </label><br />
                                    <input type="link" name="applylink" value={formData.applylink} onChange={handleChange} required/>
                                </div>
                                <div className="inputdiv">
                                    <label>Event Venue: </label><br />
                                    <input type="text" name="EventVenu" value={formData.EventVenu} onChange={handleChange} required/>
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

export default AddnewActivity;
