import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { useNavigate, Link } from 'react-router-dom';

const auth = getAuth(app);
const database = getDatabase(app);

const Createevent = () => {
    const [societyTitles, setSocietyTitles] = useState([]);
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        SocietyName: '',
        EventDate: '',
        EventVenu: '',
    });

    const [loading2, setLoading2] = useState(false);

    useEffect(() => {
        const titlesRef = ref(database, 'Societies');
        onValue(titlesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const titles = Object.values(data).map((society) => ({
                    title: society.title,
                    presidentEmail: society.PresidentEmail,
                }));
                setSocietyTitles(titles);
            } else {
                setSocietyTitles([]);
            }
        });

        // Get current user's email
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserEmail(user.email);
            }
        });
    }, []); // Empty dependency array ensures the effect runs only once

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading2(true);

        try {
            const usersRef = ref(database, 'Activities');
            await push(usersRef, {
                title: formData.title,
                description: formData.description,
                SocietyName: formData.SocietyName,
                EventDate: formData.EventDate,
                EventVenu: formData.EventVenu,
            });
            alert('Event Registered Successfully ');
            navigate('/Activities');
        } catch (error) {
            console.error('Error in Society Registering:', error.message);
            setLoading2(false);
        }
    };
    useEffect(() => {
        const matchedSociety = societyTitles.find(
            (society) => society.presidentEmail === currentUserEmail
        );
        if (matchedSociety) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                SocietyName: matchedSociety.title,
            }));
        }
    }, [currentUserEmail, societyTitles]);

    return (
        <div className='loading2'>
            {loading2 ? (
                <center><div className='loading-spinner2'></div></center>
            ) : (
                <div className="main-area-div">
                    <h3>{}</h3>
                    <div className="top-heading-area">
                        <div className="left-logo-side">
                            <img className='campusimg1' src='./cuilogo.png' alt="Dynamic Image" />
                            <h3 className='university-logo-text'>CUI Scholarship Portal</h3>
                        </div>
                        <div className="right-logo-side"></div>
                    </div>
                    <div className='sub-area-div'>
                        <div className="form-area4">
                            <center><h3>Create New Activity </h3></center>
                            <form onSubmit={handleSubmit}>
                                <div className="inputdiv">
                                    <label>Activity Name: </label><br />
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} />
                                </div>
                                <div className="inputdiv">
                                    <label>Description: </label><br />
                                    <textarea type="text" name="description" value={formData.description} onChange={handleChange} />
                                </div>
                                <div className="inputdiv">
                                    <label>Society Name: </label><br />
                                    <h5>{formData.SocietyName}</h5>
                                </div>
                                <div className="inputdiv">
                                    <label>Event Date: </label><br />
                                    <input type="date" name="EventDate" value={formData.EventDate} onChange={handleChange} />
                                </div>
                                <div className="inputdiv">
                                    <label>Event Venue: </label><br />
                                    <input type="text" name="EventVenu" value={formData.EventVenu} onChange={handleChange} />
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

export default Createevent;
