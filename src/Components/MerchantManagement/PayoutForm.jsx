import React, { useState } from 'react';
import style from "./Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { useContextData } from '../Context/Context';
import { useNavigate } from 'react-router-dom';
import { APIPATH } from '../apiPath/apipath';

function PayoutForm({ close, creditId }) {
    const { token } = useContextData()
    const [rfNumber, setRfNumber] = useState('');
    const [pgStatus,setPgStatus]=useState('')
    const [approvalDescription, setApprovalDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState("");

    const approvalData = {
        comment: approvalDescription,
        status: approvalStatus,
    }
    const navigate = useNavigate();

    const handleCreditAction = (e) => {
        e.preventDefault();
        console.log(approvalData);
        setIsLoading(true);
        // fetch(`${APIPATH}/api/v1/admin/merchants/credits/requests/${creditId}/approve`, {
        //     headers: {
        //         'Authorization': `Barear ${token}`,
        //         'Content-Type': "Application/json"
        //     },
        //     method: "PATCH",
        //     body: JSON.stringify(approvalData),
        //     mode: "cors"
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         console.log(data);
        //         alert(data.message);
        //         close();
        //         navigate("/approved_credits");
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //     }).finally(() => setIsLoading(false))
    }

    return (
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ maxWidth: '900px' }}>
                <div className={style.add_merchants_header}>
                    <h2>Approve Payment for the Customer</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => handleCreditAction(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>PG UTR/Reference Number*</label>
                            <input type='text' required placeholder='Enter UTR/Reference no.' maxLength={30} value={rfNumber}
                                onChange={(e) => setRfNumber(e.target.value)}
                                style={{ width: "96%" }} />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Gateway Status*</label>
                            <select required value={pgStatus} onChange={(e)=>setPgStatus(e.target.value)}>
                                <option value="" disabled>Select Status</option>
                                <option value="SUCCESS">Success</option>
                                <option value="FAILED">Failed</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className={style.name_label_input_contaner}>
                        <label>Remarks</label>
                        <textarea type='text' required placeholder='Enter description' maxLength={150} value={approvalDescription}
                            onChange={(e) => setApprovalDescription(e.target.value)}
                            style={{ width: "98%" }} />
                    </div>
                    <br />
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> : <div className={style.approve_and_reject_btn_container}>
                        {/* <div className={style.add_merchats_btn_container}> */}
                        <button className={style.primary_login_btn}>Submit</button>
                        {/* </div> */}
                    </div>
                    }
                </form>
            </div>
        </div>
    )
}

export default PayoutForm;