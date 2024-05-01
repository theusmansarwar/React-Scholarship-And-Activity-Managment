import React, { useState } from 'react';
import { app } from '../firebase';
import { getDatabase, ref, push } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';
const database = getDatabase(app);



const AddScholarship = () => {
    const [formData, setFormData] = useState({
        scholarshipType: '',
        scholarshipTitle: '',
        eligibilityCriteria: '',
        scholarshipAmount: '',
        newInput: '',
        newInput2: '',
    });
    const [loading2, setLoading2] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        setLoading2(true);
        e.preventDefault();
        console.log('Form submitted:', formData);
        const newData = {
            eligibilityCriteria: formData.eligibilityCriteria,
            scholarshipAmount: formData.scholarshipAmount,
        };


        if (formData.newInput) {
            newData.scholarshipType = formData.newInput;
        } else {
            newData.scholarshipType = formData.scholarshipType;
        }

        if (formData.newInput2) {
            newData.scholarshipTitle = formData.newInput2;
        } else {
            newData.scholarshipTitle = formData.scholarshipTitle;
        }
        try {



            const usersRef = ref(database, 'Scholarshipdata');

            push(usersRef, newData);



            alert('Scholarship Added ');
            navigate('/Scholarshiplist');
        } catch (error) {
            console.error('Error registering user:', error.message);
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

                <div className="form-area5">
                    <form onSubmit={handleSubmit}>
                        <div className="inputdiv">
                            <label>
                                Scholarship Type:<br />
                                <select name="scholarshipType" value={formData.scholarshipType} onChange={handleInputChange}>
                                    <option value="">Select Scholarship Type</option>
                                    <option value="Campus Based Merit Scholarship">Campus Based Merit Scholarship</option>
                                    <option value="Special Subsidy for Newly Admitted Students">Special Subsidy for Newly Admitted Students</option>
                                    <option value="Campus Scholarship">Campus Scholarship</option>
                                    <option value="External Funded Scholarship">External Funded Scholarship</option>
                                    <option >Add new type</option>
                                </select>
                            </label>
                            <br />
                            {formData.scholarshipType === 'Add new type' ? (
                                <label>
                                    Add New Type:<br />
                                    <input
                                        type="text"
                                        name="newInput"
                                        value={formData.newInput}
                                        onChange={handleInputChange}
                                        placeholder={`Enter New ${formData.scholarshipType ? 'Type' : 'Title'}`}
                                    />
                                </label>
                            ) : null}
                        </div>

                        <div className="inputdiv">
                            <label>
                                Scholarship Title:<br />
                                <select name="scholarshipTitle" value={formData.scholarshipTitle} onChange={handleInputChange}>
                                    <option value="">Select Scholarship Title</option>
                                    <option value="Top 1st Board Position Holder ">Top 1st Board Position Holder</option>
                                    <option value="Merit/ Talent Hunt Scholarship (For FSc, ICS, A-level candidates)">Merit/ Talent Hunt Scholarship(For FSc, ICS, A-level candidates) </option>
                                    <option value='Merit/ Talent Hunt Scholarship (Only for DAE candidates)'>Merit/ Talent Hunt Scholarship (Only for DAE candidates)</option>
                                    <option value='Merit/ Talent Hunt Scholarship for BS(Bioinformatics),BS(Business Administration), BS(English),BS(Food Science & Nutrition), BS(Biotechnology), BS(Biochemistry) and BS(Mathematics) Programs'>Merit/ Talent Hunt Scholarship for BS(Bioinformatics),BS(Business Administration), BS(English),BS(Food Science & Nutrition),BS(Biotechnology), BS(Biochemistry) and BS(Mathematics) Programs</option>
                                    <option value='Merit/ Talent Hunt Scholarship for BS(Biotechnology), BS(Food Science & Nutrition) and BS(Biochemistry)'>Merit/ Talent Hunt Scholarship for BS(Biotechnology), BS(Food Science & Nutrition) and BS(Biochemistry)</option>
                                    <option value='Special Subsidy for BS(Mathematics),BS(Bioinformatics), BS(Business Administration),BS(Mathematics) and BS(English) Programs'>Special Subsidy for BS(Mathematics),S(Bioinformatics), BS(Business Administration),BS(Mathematics) and BS(English) Programs</option>
                                    <option value='Special Scholarship/Financial Assistance for students of Punjab Daanish School System'>Special Scholarship/Financial Assistance for students of Punjab Daanish School System</option>
                                    <option value='Kinship / Sibling Concessions'>Kinship / Sibling Concessions</option>
                                    <option value='Benazir Undergraduate Scholarship Project under Higher Education Commission'>Benazir Undergraduate Scholarship Projectunder Higher Education Commission</option>
                                    <option value='Scotland Pakistan Scholarships(Health Sciences Discipline - BS Programs)(STEM Discipline - MS Programs)for Females Only'>Scotland Pakistan Scholarships(Health Sciences Discipline - BS Programs)(STEM Discipline - MS Programs)for Females Only</option>
                                    <option value='Punjab Educational Endowment Fund (PEEF) Scholarships'>Punjab Educational Endowment Fund (PEEF) Scholarships</option>
                                    <option value='Ihsan Trust (Meezan Bank) Qarz-e-Hasna'> Ihsan Trust (Meezan Bank) Qarz-e-Hasna</option>
                                    <option value='Baluchistan Educational Endowment Fund (BEEF) Scholarships'>Baluchistan Educational Endowment Fund (BEEF) Scholarships</option>
                                    <option value='Government Benevolent Fund Scholarships'>Government Benevolent Fund Scholarships</option>
                                    <option value='Punjab Worker Welfare Fund Scholarships'>Punjab Worker Welfare Fund Scholarships</option>
                                    <option value='National Bank of Pakistan Qarz-e-Hasnaa'>National Bank of Pakistan's Qarz-e-Hasnaa</option>
                                    <option >Add new Tittle </option>
                                </select>
                            </label>

                            <br />
                            {formData.scholarshipTitle === 'Add new Tittle' ? (

                                <label> Add New tittle:<br />
                                    <input
                                        type="text"
                                        name="newInput2"
                                        value={formData.newInput2}
                                        onChange={handleInputChange}
                                        placeholder={`Enter New ${formData.scholarshipTitle ? 'Type' : 'Title'}`}
                                    />
                                </label>
                            ) : null}

                        </div>

                        <div className="inputdiv">
                            <label>
                                Eligibility Criteria:<br />
                                <textarea
                                    type="text"
                                    name="eligibilityCriteria"
                                    value={formData.eligibilityCriteria}
                                    onChange={handleInputChange}
                                    placeholder="Enter Eligibility Criteria"
                                />
                            </label>
                            <br />
                        </div>

                        <div className="inputdiv">
                            <label>
                                Scholarship Amount:<br />
                                <input
                                    type="text"
                                    name="scholarshipAmount"
                                    value={formData.scholarshipAmount}
                                    onChange={handleInputChange}
                                    placeholder="Enter Scholarship Amount"
                                />
                            </label>
                        </div>


                        <br />
                        <button className="submitbtn" type="submit">Submit</button>

                        <div className="centeredtextarea">
                            <p className="simpletext">
                                Back to <Link className="simpletextlink" to="/Scholarshiplist">Scholarships</Link>
                            </p>
                        </div>
                    </form>
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

export default AddScholarship;
