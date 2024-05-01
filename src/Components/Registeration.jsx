import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { app } from '../firebase';
import { getDatabase, ref, push, onValue, set } from 'firebase/database';
import { useNavigate, Link } from 'react-router-dom';
import './registeration.css';

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

const Registration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        registrationNo: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        program: '',
    });
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);

    useEffect(() => {
        setLoading(true);
        const notificationsRef = ref(database, 'notification');
        const unsubscribe = onValue(notificationsRef, (snapshot) => {
            const notificationsData = snapshot.val();
            if (notificationsData) {
                const notificationsArray = Object.values(notificationsData);
                setNotifications(notificationsArray);
            } else {
                setNotifications([]);
            }
            setLoading(false);
        })

    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading2(true);
        if (formData.name=="") {
           
            alert('Name feild is empty');
          
            return;
        }
        if (formData.registrationNo=="") {
            alert('Reg No feild is empty');
          
            return;
        }
        if (formData.phoneNumber=="") {
            alert('PhoneNumber feild is empty');
           
            return;
        }
        if (formData.email=="") {
            alert('Email feild is empty');
           
            return;
        }
        if (formData.program=="") {
            alert('Program feild is empty');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
           
            return;
        }

        try {

            const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

            const usersRef = ref(database, `userdata/${user.uid}`);
            await set(usersRef, {
                name: formData.name,
                registrationNo: formData.registrationNo,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                program: formData.program,
                president:'no',
                type:'user',
                password:formData.password,
            });
            await sendEmailVerification(user);
            alert('Verify email to complete registertion ');
            navigate('/login');
            setLoading2(false);
        } catch (error) {
            console.error('Error registering user:', error.message);
            alert('Getting an error to complete your registertion ');
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
                    <h3 className='university-logo-text'>CUI Scholarship Portal</h3>
                </div>
                <div className="right-logo-side"></div>
            </div>
            <div className='sub-area-div'>
            <div className="newssection2">
            <h3 className='news-section-heading'>NOTICEBOARD</h3>
          <ul className='notice-text-ul'>
            {loading ? (
              <div className='loading-innoticeboard'> 
                {loading && <div className="loading-spinner-innoticeboard"></div>}
              
              </div>
            ) : (
              notifications.map((notification, index) => (
                <li key={index} className='notice-text'>{notification.notify}</li>
              ))
            )}
          </ul>
        </div>
                <div className="form-area">
                    <center><h3>Student Registeration</h3></center>
                    <form onSubmit={handleSubmit}>
                        <div className="inputdiv">
                            <label>
                                Name: </label><br />
                            <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="inputdiv">
                            <label>
                                Email: </label><br />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />

                        </div>
                        <div className="inputdiv">
                            <label>
                                Select Department: </label><br />
                            <select
                                name="program"
                                value={formData.program} onChange={handleChange}
                            >

                                <option disabled required>
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
                        </div>
                        < div className="inputdiv">
                            <label>
                                Registration No: </label><br />
                            <input type="text" name="registrationNo" value={formData.registrationNo} onChange={handleChange} />
                        </div>
                        <div className="inputdiv">
                            <label>
                                Phone Number: </label><br />
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                        </div>
                        <div className="inputdiv">

                            <label>
                                Password: </label><br />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} />
                        </div>
                        <div className="inputdiv">

                            <label>
                                Confirm Password: </label><br />
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                        </div>
                        <br />
                        <button className='submitbtn' type="submit">Submit</button>
                    </form>
                    <div className="centeredtextarea">
                        <p className='simpletext'>Already Have An Account?<Link className='simpletextlink' to="/login">Login</Link></p>
                    </div>
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

export default Registration;
