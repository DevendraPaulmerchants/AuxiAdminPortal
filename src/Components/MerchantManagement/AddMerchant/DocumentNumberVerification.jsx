import React, { useState } from 'react';
import style from '../Merchants.module.css';
import { handleGSTNumber, handlePANCardNumber } from '../../InputValidation/InputValidation';
import { FcCancel, FcOk } from 'react-icons/fc';

function DocumentNumberVerification({
    gstNumber, setGSTNumber, setIsvalidGst, isvalidGst,
    panNumber, setPANnumber, setIsValidPAN, isValidPAN,
    panData, setPanData
}) {
    const [isLoading, setIsLoading] = useState(false);

    return <div className={style.name_email_parent_container}>
        <div className={style.name_label_input_contaner}>
            <label>PAN Number* </label>
            <input type='text' required placeholder='Enter PAN number' minLength={10} maxLength={10} value={panNumber}
                onChange={(e) => {
                    handlePANCardNumber(e, setPANnumber, setIsValidPAN, setIsLoading, setPanData)
                }}
            />
            {!isValidPAN && panNumber.length > 0 && <p className={style.not_valid_text}>please type valid PAN number</p>}
            {isLoading && <p>Loading...</p>}
            {panData && !isLoading && panNumber.length === 10 && (
                panData?.pan_status === 'Active and operative' ?
                    <p className={style.verify_icon_text}><FcOk title='Verified' /> <b>Verified</b></p> :
                    <p className={style.not_verify_icon_text}><FcCancel title='Not Valid' /><b>Not Valid</b></p>
            )}

        </div>
        <div className={style.name_label_input_contaner}>
            <label>GST Number* </label>
            <input type='text' required placeholder='Enter GST number' maxLength={15} minLength={15} value={gstNumber}
                onChange={(e) => handleGSTNumber(e, setGSTNumber, setIsvalidGst)}
            />
            {!isvalidGst && gstNumber.length > 0 && <p className={style.not_valid_text}>please type valid GST number</p>}
        </div>
    </div>
}

export default DocumentNumberVerification