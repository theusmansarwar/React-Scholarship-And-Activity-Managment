
import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '../firebase';
import './registeration.css';
import { useNavigate, Link } from 'react-router-dom';

const auth = getAuth(app);

const Forget = () => {
    const [email, setEmail] = useState('');
    const [isResetEmailSent, setIsResetEmailSent] = useState(false);

    const handleResetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setIsResetEmailSent(true);
        } catch (error) {
            console.error('Error sending reset email:', error.message);
        }
    };

    return (

        <div className="forgot-password-container">
            {isResetEmailSent ? (
                <p>Reset email sent. Please check your email inbox.</p>
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
                        <div className="form-area3">
                            <center><h3>Forget Password</h3></center>
                            <div className="inputdiv">
                                <label> Email:   </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <br />

                            <button className='submitbtn' onClick={handleResetPassword}>Reset Password</button>
                            <div className="centeredtextarea">
                                <p className='simpletext'>Back to <Link className='simpletextlink' to="/login">Login</Link></p></div>
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

export default Forget;
