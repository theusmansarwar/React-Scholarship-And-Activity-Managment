import React, { useState, useEffect } from 'react';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getDatabase, push, ref, set, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import './ApplyScholarship.css';

const ApplyScholarship = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scholarshipTitle = location.state?.scholarshipTitle;
  const database = getDatabase(app);
  const storage = getStorage(app);
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [loading2, setLoading2] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    pdfFile: null,
  });
  const [fileSelected, setFileSelected] = useState(false); // New state to track whether a file is selected

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        const userRef = ref(database, `userdata/${authUser.uid}`);
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              console.log('User Data:', data); 
              setUserData(data);
            } else {
              console.log('User data does not exist.');
            }
          })
          .catch((error) => {
            console.error('Error fetching user information:', error);
          })
          .finally(() => setLoading(false));
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []); // Empty dependency array

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      pdfFile: file,
    });
    setFileSelected(true); // Set fileSelected to true when a file is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading2(true);
    try {
      if (!formData.pdfFile) {
        alert('Please select a file.');
        return;
      }
      const storageRefInstance = storageRef(storage, `ScholarshipsData/${formData.pdfFile.name}`);
      const uploadTask = uploadBytes(storageRefInstance, formData.pdfFile);



      await uploadTask;
      const downloadURL = await getDownloadURL(storageRefInstance);
      if (!downloadURL) {
        alert('Error obtaining download URL. Please try again.');
        return;
      }
      const applicationsRef = push(ref(database, 'applications'));
      const applicationData = {
        title: scholarshipTitle,
        fileURL: downloadURL,
        status: 'pending',
        email: user.email,
        name: userData?.name || '',
        phoneNumber: userData?.phoneNumber || '',
        registrationNo: userData?.registrationNo || '',
      };
      await set(applicationsRef, applicationData);
      alert('Application Submitted');
      navigate('/Status');
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  };

  if (!userData) {
    return (
      <div className='main-area-div'>
        <div className='loading'>
          {loading && <div className="loading-spinner"></div>}
          <h4>Loading...</h4>
        </div>
      </div>
    );
  }

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
      <div className="sub-area-div">
        <div className="form-area4">
          <center>
            <h3>Apply For Scholarship</h3>
          </center>
          <br />
          <h6 className="Stittle">{scholarshipTitle}</h6>
          <div className="inputdiv">
            <label>Select Documents: </label>
            <input
              type="file"
              id="pdfFile"
              name="pdfFile"
              onChange={handleFileChange}
              required
            />
          </div>
          <br />

          
          <button className="submitbtn" onClick={handleSubmit} disabled={!fileSelected || uploadPercentage > 0}>
           Submit
          </button>
          <div className="centeredtextarea">
            <p className="simpletext">
              Back to <Link className="simpletextlink" to="/Scholarshiplistforstudent">Scholarships</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="bottom">
        <p className="footer-credit">
          Copyright © 2020, All Rights Reserved by CUOnline-COMSATS
        </p>
      </div>
    </div>
     )}
     </div>
  );
};
export default ApplyScholarship;
