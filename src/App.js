import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrivateAdminRoute from './Auth/PrivateAdminRoute';
import PrivateuserRoute from './Auth/PrivateuserRoute';
import Registration from './Components/Registeration';
import Login from './Components/Login';
import Home from './Components/Home';
import Forget from './Components/Forget';
import UsersList from './Admin/Userslist';
import AddScholarship from './Admin/AddScholarship';
import Scholarshiplist from './Admin/Scholarshiplist';
import Scholarshiplistforstudent from './Components/Scholarshiplistforstudent';
import Facultydashboard from './Admin/Facultydashboard';
import Addnews from './Admin/Addnews';
import Dashboard from './Components/Dashboard';
import ApplyScholarship from './Components/ApplyScholarship';
import Status from './Components/Status';
import Applications from './Admin/Applications';
import Applicationdetails from './Admin/Applicationdetails';
import Activities from './Admin/Activities';
import AddSocieties from './Admin/AddSocieties';
import Societies from './Admin/Societies';
import Societieslist from './Components/Societieslist';
import AddnewActivity from './Admin/AddnewActivity';
import SocietyActivities from './Components/SocietyActivities';
import { app } from './firebase';
import { ref, onValue } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Createevent from './Components/Createevent';
import AddNotification from './Admin/AddNotification';


const auth = getAuth(app);
const database = getDatabase(app);

const App = () => {
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        const userRef = ref(database, `userdata/${userId}/type`);
        onValue(userRef, (snapshot) => {
          const userType = snapshot.val();
          setUserType(userType);
          setLoading(false);
        });
      } else {
        setUserType(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return   <div className='loading-indashboard'> {loading && <div className="loading-spinner-indashboard"></div>}
    <h4>Loading...</h4></div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path='/Forget' element={<Forget />} />
        

        <Route element={<PrivateAdminRoute isAdmin={userType === 'admin'} />}>
          <Route path="/Facultydashboard" element={<Facultydashboard />} />
          <Route path="/Addnews" element={<Addnews />} />
          <Route path="/Userslist" element={<UsersList />} />
          <Route path="/AddScholarship" element={<AddScholarship />} />
          <Route path="/Applications" element={<Applications />} />
          <Route path="/Applicationdetails/:id" element={<Applicationdetails />} />
          <Route path="/Scholarshiplist" element={<Scholarshiplist />} />
          <Route path="/Activities" element={<Activities />} />
          <Route path="/AddSocieties" element={<AddSocieties />} />
          <Route path="/Societies" element={<Societies />} />
          <Route path="/AddnewActivity" element={<AddnewActivity />} />
          <Route path="/AddNotification" element={<AddNotification />} />
        
        </Route>

        <Route element={<PrivateuserRoute isUser={userType === 'user'} />}>
          <Route path='/Status' element={<Status />} />
          <Route path='/Scholarshiplistforstudent' element={<Scholarshiplistforstudent />} />
          <Route path='/ApplyScholarship' element={<ApplyScholarship />} />
          <Route path='/Societieslist' element={<Societieslist />} />
          <Route path='/SocietyActivities' element={<SocietyActivities />} />
          <Route path='/Dashboard' element={<Dashboard />} />
          <Route path='/Createevent' element={<Createevent />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/Dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
