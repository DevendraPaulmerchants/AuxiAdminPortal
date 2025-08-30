import React, { useState } from 'react';
import style from "./Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { useContextData } from '../Context/Context';

import { APIPATH } from '../apiPath/apipath';

function PaymentApproval({ close,creditId, getCreditDetails }) {

    const {token} =useContextData()
    const [approvalDescription, setApprovalDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [approvalStatus,setApprovalStatus]=useState("");

    const approvalData={
        comment:approvalDescription,
        status:approvalStatus,
    }
    
    const handleCreditAction=(e)=>{
        e.preventDefault();
        setIsLoading(true);
        const url = `${APIPATH}/api/v1/admin/merchants/credits/requests/${creditId}/verify-payment`;
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'Application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(approvalData),
            mode: 'cors'
        }).then((res) => res.json())
            .then((data) => {
                alert(data.message);
                close();
                getCreditDetails();
            })
            .catch((err) => {
                alert(err)
            })
            .finally(() => {
                setIsLoading(false);
            });
        }
    
    return (
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container}>
                <div className={style.add_merchants_header}>
                    <h2>Approve payment for the merchant</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e)=>handleCreditAction(e)}>
                    <div className={style.name_label_input_contaner}>
                        <label>Approval Comments </label>
                        <textarea type='text' required placeholder='Enter description' maxLength={150} value={approvalDescription}
                            onChange={(e) => setApprovalDescription(e.target.value)}
                            style={{ width: "96%" }} />
                    </div>
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> : <div className={style.approve_and_reject_btn_container}>
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}
                            onClick={()=>setApprovalStatus("REJECTED")}
                            >Reject</button>
                        </div>
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}
                            onClick={()=>setApprovalStatus("SUCCESSFUL")}
                            >Approve</button>
                        </div>
                    </div>
                    }
                </form>
            </div>
        </div>
    );
    
}

export default PaymentApproval;