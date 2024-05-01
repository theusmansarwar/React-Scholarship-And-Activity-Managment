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


const AddSocieties = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        PresidentName: '',
        PresidentEmail: '',
        PresidentRegNo: '',


    });

    const [loading2, setLoading2] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading2(true);

        try {


            const usersRef = ref(database, 'Societies');
            await push(usersRef, {
                title: formData.title,
                description: formData.description,
                PresidentName: formData.PresidentName,
                PresidentEmail: formData.PresidentEmail,
                PresidentRegNo: formData.PresidentRegNo,
              
            });
            alert('Society Registered Successfully ');
            navigate('/Activities');
        } catch (error) {
            console.error('Error in Society Redistering:', error.message);
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
            <div className="form-area4">
                <center><h3>Create New Society</h3></center>
                <form onSubmit={handleSubmit}>
                    <div className="inputdiv">
                        <label>
                            Society Name: </label><br />
                        <input type="text" name="title" value={formData.title} onChange={handleChange} />
                    </div>
                    <div className="inputdiv">
                        <label>
                            Description: </label><br />
                        <textarea type="text" name="description" value={formData.description} onChange={handleChange} />

                    </div>

                    < div className="inputdiv">
                        <label>
                            President Name: </label><br />
                        <input type="text" name="PresidentName" value={formData.PresidentName} onChange={handleChange} />
                    </div>
                    < div className="inputdiv">
                        <label>
                            President Email: </label><br />
                        <input type="text" name="PresidentEmail" value={formData.PresidentEmail} onChange={handleChange} />
                    </div>
                    < div className="inputdiv">
                        <label>
                            President RegNo: </label><br />
                        <input type="text" name="PresidentRegNo" value={formData.PresidentRegNo} onChange={handleChange} />
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