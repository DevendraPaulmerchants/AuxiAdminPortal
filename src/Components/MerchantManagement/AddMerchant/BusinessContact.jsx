import style from '../Merchants.module.css';
import { handleEmailChange, handleInputChangeWithAlphabetOnly } from '../../InputValidation/InputValidation';
import { useMask } from '@react-input/mask';

function BusinessContact({
    ownerName, setOwnerName,
    ownerMobile, setOwnerMobile,
    isValidOwnerMobile, setIsValidOwnerMobile,
    ownerEmail, setOwnerEmail,
    isValidOwnerEmail, setIsValidOwnerEmail,
    primaryContactName, setPrimaryContactName,
    primaryContactMobile, setPrimaryContactMobile, isValidPMobile, setIsValidPMobile,
    primaryContactEmail, setPrimaryContactEmail, isValidEmail, setIsValidEmail
}) {
    const inputRef = useMask({
        mask: "+91-__________",
        replacement: { _: /\d/ },
    });
    const inputOwnerRef = useMask({
        mask: "+91-__________",
        replacement: { _: /\d/ },
    });

    return <div className={style.add_merchants_bussiness_address}>
        <h3>Business Contact Details</h3>
        <h4>Owner Contact</h4>
        <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
                <label>Name* </label>
                <input type='text' required placeholder='Enter owner name' maxLength={30} value={ownerName}
                    onChange={(e) => handleInputChangeWithAlphabetOnly(e, setOwnerName)}
                />
            </div>
            <div className={style.name_label_input_contaner}>
                <label>Mobile* </label>
                <input ref={inputOwnerRef} required placeholder='Enter owner mobile' value={ownerMobile}
                    onChange={(e) => {
                        const value = e.target.value;
                        setOwnerMobile(e.target.value)
                        if (value.length <= 13) {
                            setIsValidOwnerMobile(false)
                        }
                        if (value.length === 14) {
                            setIsValidOwnerMobile(true)
                        }
                    }}
                />
                {!isValidOwnerMobile && ownerMobile.length > 0 && <p className={style.not_valid_text}>Please type valid mobile number</p>}
            </div>
        </div>
        <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
                <label>Email* </label>
                <input type='email' required placeholder='Enter owner email' maxLength={40} value={ownerEmail}
                    onChange={(e) => handleEmailChange(e, setOwnerEmail, setIsValidOwnerEmail)}
                />
                {!isValidOwnerEmail && ownerEmail.length > 0 && <p className={style.not_valid_text}>Please type valid Email</p>}
            </div>
        </div>
        <hr />
        {/* --------------- Business Contact ---------- */}
        <h4>Primary Point of Contact (POC)</h4>
        <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
                <label>Name* </label>
                <input type='text' required placeholder='Enter primary contact person’s name' maxLength={30} value={primaryContactName}
                    onChange={(e) => handleInputChangeWithAlphabetOnly(e, setPrimaryContactName)}
                />
            </div>
            <div className={style.name_label_input_contaner}>
                <label>Mobile* </label>
                <input ref={inputRef} required placeholder='Enter primary contact person`s mobile' value={primaryContactMobile}
                    onChange={(e) => {
                        const value = e.target.value;
                        setPrimaryContactMobile(e.target.value)
                        if (value.length <= 13) {
                            setIsValidPMobile(false)
                        }
                        if (value.length === 14) {
                            setIsValidPMobile(true)
                        }
                    }}
                />
                {!isValidPMobile && primaryContactMobile.length > 0 && <p className={style.not_valid_text}>Please type valid mobile number</p>}
            </div>
        </div>
        <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
                <label>Email* </label>
                <input type='email' required placeholder='Enter primary contact person`s email' maxLength={40} value={primaryContactEmail}
                    onChange={(e) => handleEmailChange(e, setPrimaryContactEmail, setIsValidEmail)}
                />
                {!isValidEmail && primaryContactEmail.length > 0 && <p className={style.not_valid_text}>Please type valid Email</p>}
            </div>
        </div>
    </div>
}

export default BusinessContact