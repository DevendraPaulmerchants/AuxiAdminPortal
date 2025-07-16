import React from 'react';
import style from '../Merchants.module.css';
import { handleInputChangeWithAlphabetOnly } from '../../InputValidation/InputValidation';

function Organization({organizatioNname,setOrganizationName,preferredName,setPreferredName}) {
    return <div className={style.name_email_parent_container}>
        <div className={style.name_label_input_contaner}>
            <label>Organization Name* </label>
            <input type='text' required placeholder="Enter organization name" maxLength={100} value={organizatioNname}
                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setOrganizationName)}
            />
        </div>
        <div className={style.name_label_input_contaner}>
            <label>Brand/Preferred Name* </label>
            <input type='text' required placeholder='Enter preferred name' maxLength={50} value={preferredName}
                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setPreferredName)}
            />
        </div>
    </div>
}

export default Organization;