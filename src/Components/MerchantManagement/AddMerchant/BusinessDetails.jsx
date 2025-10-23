import React, { useEffect, useState } from 'react';
import style from '../Merchants.module.css';
import { APIPATH } from '../../apiPath/apipath';
import { useContextData } from '../../Context/Context';

function BusinessDetails({
    bussinessType, setBussinessType,
    businessNature, setBusinessNature,
    schemeId, setSchemeId
}) {
    const {token} =useContextData();
    const [schemeList, setSchemeList] = useState(null);

    useEffect(() => {
        fetch(`${APIPATH}/api/v1/admin/schemes`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'Application/json'
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setSchemeList(data.data);
            })
            .catch((err) => {
                console.error(err)
            })
    }, [token]);
    
    return <div className={style.add_merchants_bussiness_address}>
        <h3>Business Details</h3>
        <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
                <label>Business Type* </label>
                <select value={bussinessType} required onChange={(e) => setBussinessType(e.target.value)}>
                    <option value="" disabled>Select Business Type</option>
                    {/* <option value="retails">Retails</option> */}
                    <option value="Pvt. Ltd.">Private Limited Company (Pvt. Ltd.)</option>
                    <option value="Ltd.">Public Limited Company (Ltd.)</option>
                    <option value="OPC">One Person Company</option>
                    <option value="Partnership">Partnership</option>
                    <option value="LLP">Limited Liability Partnership</option>
                </select>
            </div>
            <div className={style.name_label_input_contaner}>
                <label>Business Nature* </label>
                <select value={businessNature} required onChange={(e) => setBusinessNature(e.target.value)}>
                    <option value="" disabled>Select Business Nature</option>
                    {/* <option value="retails">Retails</option> */}
                    <option value="IT Services">IT Services / Software Development</option>
                    <option value="Manufacturing">Manufacturing & Production</option>
                    <option value="Retail">Retail & E-commerce</option>
                    <option value="Marketing">Marketing & Advertising</option>
                    <option value="Financial Services">Financial Services</option>

                    {/* <!-- For Public Limited Company --> */}
                    <option value="Large-Scale Manufacturing">Large-Scale Manufacturing</option>
                    <option value="Infrastructure">Infrastructure & Construction</option>
                    <option value="Telecom">Telecommunications</option>
                    <option value="Banking">Banking & Finance</option>
                    <option value="Energy">Energy & Utilities</option>

                    {/* <!-- For One Person Company --> */}
                    <option value="Freelancing">Freelance Web Development</option>
                    <option value="Coaching">Personal Coaching & Training</option>
                    <option value="Digital Marketing">Content Creation / Digital Marketing</option>
                    <option value="Consultancy">Consultancy Services</option>
                    <option value="Handcrafted Sales">Handcrafted Product Sales</option>

                    {/* <!-- For Partnership --> */}
                    <option value="Law Firm">Law Firms</option>
                    <option value="Accounting">Chartered Accountants / Auditors</option>
                    <option value="Medical Practice">Local Clinics or Medical Practices</option>
                    <option value="Boutique Agency">Boutique Agencies</option>
                    <option value="Event Management">Event Management</option>

                    {/* <!-- For LLP --> */}
                    <option value="Tech Consulting">Tech or Business Consulting</option>
                    <option value="Interior Design">Interior Designing</option>
                    <option value="Educational Services">Educational Services</option>
                    <option value="Research">Research & Analytics</option>
                    <option value="Architecture">Architecture Firms</option>
                </select>
            </div>
            <div className={style.name_label_input_contaner}>
                <label>Scheme Type*</label>
                <select required value={schemeId} onChange={(e) => setSchemeId(e.target.value)}>
                    <option value="" disabled>Select Scheme</option>
                    {schemeList?.map((scheme, id) => (
                        <option key={id} value={scheme.id}>{scheme.name}</option>
                    ))}
                </select>
            </div>
        </div>
    </div>
}

export default BusinessDetails;