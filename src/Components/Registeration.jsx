import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { app } from '../firebase';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { useNavigate, Link } from 'react-router-dom';
import './registeration.css';

const auth = getAuth(app);
const database = getDatabase(app);

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
    const [errors, setErrors] = useState({
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
        });

        return () => unsubscribe();
    }, [database]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let error = '';
        if (name === 'name') {
            if (!/^[A-Za-z\s]+$/.test(value)) {
              error = 'Name must contain only alphabets and spaces';
            } else {
              error = '';
            }
          }
          
        else if (name === 'password') {
            if (value.trim().length < 8) {
                error = 'Password must be at least 8 characters long';
            } else if (!/[A-Z]/.test(value)) {
                error = 'Password must contain at least one uppercase letter';
            } else if (!/\d/.test(value)) {
                error = 'Password must contain at least one number';
            } else if (!/@/.test(value)) {
                error = 'Password must contain the "@" symbol';
            } else {
                error = '';
            }
        } else if (name === 'confirmPassword') {
            if (formData.password !== value) {
                error = 'Passwords do not match';
            } else {
                error = '';
            }
        }
        else if (name === 'phoneNumber') {
            if (!/^(\+923\d{9})$/.test(value)) {
                error = 'Phone number must be 11 digits long and start with "+923XXXXXXXXX"';
            }
            else {
                error = '';
            }
        }
        else if (name === 'registrationNo') {
            if (!/^[A-Za-z]{2}\d{2}-[A-Za-z]{3}-\d{3}$/.test(value)) {
                error = 'Registration number must be in the format FA20-BSE-001 / SP20-BSE-001';
            } else {
                error = '';
            }
        }
        else if (name === 'email') {
            if (!value.endsWith('@gmail.com')) {
                error = 'Email must end with @gmail.com';
            } else {
                error = '';
            }
        } 

    
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: error });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading2(true);

        const formErrors = Object.values(errors);
        const hasError = formErrors.some((error) => error !== '');

        if (hasError) {
            setLoading2(false);
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
                president: 'no',
                type: 'user',
                societyid: 'none',
                password: formData.password,
            });
            await sendEmailVerification(user);
            alert('Verify email to complete registration');
            navigate('/login');
            setLoading2(false);
        } catch (error) {
            console.error('Error registering user:', error.message);
            alert('Getting an error to complete your registration');
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
                            <center><h3>Registration</h3></center>
                            <form onSubmit={handleSubmit}>
                                <div className="inputdiv">
                                    <label>Name:</label><br />
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                                    {errors.name && <p className='errormsg'>{errors.name}</p>}
                                </div>
                                <div className="inputdiv">
                                    <label>Email:</label><br />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                                    {errors.email && <p className='errormsg'>{errors.email}</p>}
                                </div>
                                <div className="inputdiv">
                                    <label>Select Department:</label><br />
                                    <select
                                        name="program"
                                        value={formData.program}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option disabled value="">Select Program</option>
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
                                <div className="inputdiv">
                                    <label>Registration No:</label><br />
                                    <input type="text" name="registrationNo" value={formData.registrationNo} onChange={handleChange} required />
                                    {errors.registrationNo && <p className='errormsg'>{errors.registrationNo}</p>}
                                </div>
                                <div className="inputdiv">
                                    <label>Phone Number:</label><br />
                                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                                    {errors.phoneNumber && <p className='errormsg'>{errors.phoneNumber}</p>}
                                </div>
                                <div className="inputdiv">
                                    <label>Password:</label><br />
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                                    {errors.password && <p className='errormsg'>{errors.password}</p>}
                                </div>
                                <div className="inputdiv">
                                    <label>Confirm Password:</label><br />
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                                    {errors.confirmPassword && <p className='errormsg'>{errors.confirmPassword}</p>}
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
