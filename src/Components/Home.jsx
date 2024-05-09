
import React, { useState } from 'react';
import './Home.css';
import { BiBookReader } from "react-icons/bi";
import { PiStudentBold } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };
  const handleClick0 = () => {
    const cuiportallink = 'https://swl-cms.comsats.edu.pk:8082/';
    window.open(cuiportallink, '_blank');
  };
  return (

    <div className='homepage'>

      <div className="topsection">
        <div className="images">
          <img className='bblockimage' src='./bblock.png' alt="Dynamic Image" />
          <div class="color-overlay"></div>
          <img className='logoimage' src='./cuilogo.png' alt="Dynamic Image" />
        </div>

        <div className="rightsection">
          <div className="logosection"><h3>COMSATS UNIVERSITY ISLAMABAD</h3></div>
          <div className="slogen"><h1>CSMS</h1>
            <p className='slogentext'>COMSATS University Islamabad Scholarship Management System</p>
          </div>
        </div>

      </div>
      <div className="mainsectionhome">
        <div className="leftsideofmainsection">

          <div className="campusimagearea">
            <h3 className='campustext'>Sahiwal Campus</h3>
            <div className="campusimagesection">
              <img className='campusimg' src='./1.png' alt="Dynamic Image" />
              <img className='campusimg' src='./2.png' alt="Dynamic Image" />
            </div>
            <div className="campusimagesection">
              <img className='campusimg' src='./3.png' alt="Dynamic Image" />
              <img className='campusimg' src='./4.png' alt="Dynamic Image" />
            </div>
            <div className="campusimagesection">
              <img className='campusimg' src='./5.png' alt="Dynamic Image" />
              <img className='campusimg' src='./6.png' alt="Dynamic Image" />
            </div>
          </div>
        </div>
        <div className="midsideofmainsection">
          <h2>CUI Scholarship & Activities Portal</h2>
          <div className="cardareas">
            <div className="card" onClick={handleClick0}>
              <BiBookReader className='modulelogo' />
              <p className='modulename'>University Student Portal</p>
            </div>
            <div className="card" onClick={handleClick}>
              <PiStudentBold className='modulelogo' />
              <p className='modulename'> Scholarship & Activities Portal</p>
            </div>

          </div>
          <h3 >CUOnline Introduction</h3>
          <p className='cuiintro'>CUOnline Principal Seat is responsible to automate all major COMSATS University processes under one umbrella as per rules regulations and policies of COMSATS University. It provides pure "Web Based" anytime/anywhere access to the administrative, transactional and academic process needed to manage day to day affairs of COMSATS University along with its 7 Regular Campuses and Virtual Campus.</p>
          <h3 className='websiteslinks'>Explore Websites</h3>
          <a href="www.comsats.edu.pk">www.comsats.edu.pk</a><br />
          <a href="http://cuonline.comsats.edu.pk/">http://cuonline.comsats.edu.pk/</a><br />
          <a href="admissions.comsats.edu.pk">admissions.comsats.edu.pk</a>
        </div>
        <div className="rightsideofmainsection">

          <img className='bblockimage' src='./bblock.png' alt="Dynamic Image" />
          <h3 className='campustext2'>Sahiwal Campus</h3>
          <p className='unidescription'>The COMSATS University Islamabad (CUI), which received its Charter from the Federal Government in August 2000, as a Degree Awarding Institute (DAI) in the public sector. The CU is up gradated as university by the name of "Comsats University" through an act of the Parliament in April 2018.</p>


        </div>
      </div>

      <div className="bottom">
        <p className='footer-credit'>Copyright © 2020, All Rights Reserved by CUOnline-COMSATS</p>
      </div>
    </div>
  );
};

export default Home;
