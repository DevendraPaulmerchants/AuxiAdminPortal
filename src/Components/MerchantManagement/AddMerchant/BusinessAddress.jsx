import React, { useEffect, useState } from 'react';
import style from '../Merchants.module.css';
import { handleInputChangeWithNumericValueOnly } from '../../InputValidation/InputValidation';

function BusinessAddress({
    stateName, setStateName,
    districtName, setDistrictName,
    pinCode, setPinCode,
    street, setStreet,
    secstreet, setsecStreet,
    secstateName, setsecStateName,
    secdistrictName, setsecDistrictName,
    secpinCode, setsecPinCode
}) {
    const [stateList, setStateList] = useState(null);
    const [districtList, setDistrictList] = useState(null);
    const [secdistrictList, setSecDistrictList] = useState(null);

    useEffect(() => {
        if (!!stateList) return
        fetch("https://countriesnow.space/api/v0.1/countries/states", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ country: "India" })
        })
            .then(res => res.json())
            .then(data => {
                setStateList(data.data.states)
            })
            .catch(err => console.error(err));

    }, [])

    useEffect(() => {
        if (stateName === "" || !stateName) return;
        fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ country: "India", state: stateName }),
        })
            .then((res) => res.json())
            .then((data) => {
                setDistrictList(data.data);
            })
            .catch((err) => console.error(err));
    }, [stateName]);

    // Secondary District or City Address
    useEffect(() => {
        if (secstateName === "" || !secstateName) return;
        fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ country: "India", state: secstateName }),
        })
            .then((res) => res.json())
            .then((data) => {
                setSecDistrictList(data.data);
            })
            .catch((err) => console.error(err));
    }, [secstateName]);

    return <div className={style.add_merchants_bussiness_address}>
        <h3>Business Primary Address (Address from PAN)</h3>
        <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
                <label>State* </label>
                <select required value={stateName} onChange={(e) => setStateName(e.target.value)}>
                    <option value="" disabled>Select State</option>
                    {stateList?.map((state, id) => (
                        <option key={id} value={state.name}>{state.name}</option>
                    ))}
                </select>
            </div>
            <div className={style.name_label_input_contaner}>
                <label>City* </label>
                <select required value={districtName} onChange={(e) => setDistrictName(e.target.value)}>
                    <option value="" disabled>Select City</option>
                    {districtList?.map((district, id) => (
                        <option key={id} value={district}>{district}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
                <label>Pincode* </label>
                <input type='text' required placeholder='Enter pincode' maxLength={6} minLength={6} value={pinCode}
                    onChange={(e) => handleInputChangeWithNumericValueOnly(e, setPinCode)}
                />
            </div>
            <div className={style.name_label_input_contaner}>
                <label>Address* </label>
                <input type='text' required placeholder='Enter street address' maxLength={30} value={street}
                    onChange={(e) => setStreet(e.target.value)}
                />
            </div>
        </div>
        <h3>Business Communication Address</h3>
        <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
                <label>State* </label>
                <select required value={secstateName} onChange={(e) => setsecStateName(e.target.value)}>
                    <option value="" disabled>Select State</option>
                    {stateList?.map((state, id) => (
                        <option key={id} value={state.name}>{state.name}</option>
                    ))}
                </select>
            </div>
            <div className={style.name_label_input_contaner}>
                <label>City* </label>
                <select required value={secdistrictName} onChange={(e) => setsecDistrictName(e.target.value)}>
                    <option value="" disabled>Select City</option>
                    {secdistrictList?.map((district, id) => (
                        <option key={id} value={district}>{district}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
                <label>Pincode* </label>
                <input type='text' required placeholder='Enter pincode' maxLength={6} minLength={6} value={secpinCode}
                    onChange={(e) => handleInputChangeWithNumericValueOnly(e, setsecPinCode)}
                />
            </div>
            <div className={style.name_label_input_contaner}>
                <label>Address* </label>
                <input type='text' required placeholder='Enter street address' maxLength={30} value={secstreet}
                    onChange={(e) => setsecStreet(e.target.value)}
                />
            </div>
        </div>
    </div>
}

export default BusinessAddress;