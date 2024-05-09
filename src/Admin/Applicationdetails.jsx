import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { app } from '../firebase';
const database = getDatabase(app);



const Applicationdetails = () => {

  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const databaseRef = ref(getDatabase(app), `applications/${id}`);

    const onDataChange = (snapshot) => {
      const data = snapshot.val();
      setApplication(data);
    };

    onValue(databaseRef, onDataChange);

    return () => {

    };
  }, [id]);

  if (!application) {
    return <p>Loading...</p>;
  }
  const handleAccept = () => {
    const isConfirmed = window.confirm('Are you sure you want to accept this application?');
    if (isConfirmed) {
      const updates = {};
      updates[`applications/${id}/status`] = 'accepted';
      update(ref(getDatabase(app)), updates);
    }
  };
  const handleReject = () => {
    const isConfirmed = window.confirm('Are you sure you want to Reject this application?');
    if (isConfirmed) {
      const updates = {};
      updates[`applications/${id}/status`] = 'rejected';
      update(ref(getDatabase(app)), updates);
    }
  };
  return (

    <div className="main-area-div">
      <div className="top-heading-area">
        <div className="left-logo-side">
          <img className='campusimg1' src='./cuilogo.png' alt="Dynamic Image" />
          <h3 className='university-logo-text'>CUI Scholarship & Activities Portal</h3>
        </div>
        <div className="right-logo-side"></div>
      </div>
      <div className='sub-area-div'>

        <div className="form-area6">
          <center><h2>Application Details</h2></center>
          <div className='leftsidecontentscholarship'>
            <p className='Scholarship-det-text'>
              <strong className='strong'>Title:</strong>{application.title}
            </p>
            <p className='Scholarship-det-text'>
              <strong className='strong'>Applicant Name:</strong> {application.name}
            </p>
            <p className='Scholarship-det-text'>
              <strong className='strong'>Reg No:</strong> {application.registrationNo}
            </p>
            <p className='Scholarship-det-text'>
              <strong className='strong'>Email:</strong> {application.email}
            </p>
            <p className='Scholarship-det-text'>
              <strong className='strong'>Status:</strong> {application.status}
            </p>
            <button className='view-btn' >
              <a className='link-view' href={application.fileURL} target="_blank" rel="noopener noreferrer">
                View Documents
              </a>
            </button>
            <button className='accept-btn' onClick={handleAccept}>
              Accept
            </button>
            <button className='reject-btn' onClick={handleReject} >
              Reject
            </button>
            <div className="centeredtextarea">
              <p className="simpletext">
                Back to <Link className="simpletextlink" to="/Applications">Applications</Link>
              </p>
            </div>

          </div>


        </div>
      </div>
      <div className="bottom">
        <p className='footer-credit'>Copyright © 2020, All Rights Reserved by CUOnline-COMSATS</p>
      </div>
    </div>
  );
};

export default Applicationdetails;
