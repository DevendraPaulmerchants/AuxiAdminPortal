import React, { useState } from 'react';
import style from "./Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { useContextData } from '../Context/Context';
import { data, useNavigate } from 'react-router-dom';
import { APIPATH } from '../apiPath/apipath';

function ApproveThisDocument({ close,docId,merchantId,updateList}) {
    const {token} =useContextData()
    const [approvalDescription, setApprovalDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const rejectedData={
        merchant_id:merchantId,
        kyc_rejection_reason:approvalDescription,
    }    
    const handleCreditAction=(e)=>{
        e.preventDefault();
        console.log(rejectedData);
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/merchants/kyc/documents/${docId}/reject`,{
            headers:{
                'Authorization':`Barear ${token}`,
                'Content-Type':"Application/json"
            },
            method:"PATCH",
            body:JSON.stringify(rejectedData),
            mode:"cors"
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            if(data.statusCode !== 200){
                alert(data.message);
                return;
            }
            alert(data.message);
            close();
            updateList();
        })
        .catch((err)=>{
            console.error(err);
            alert(data.message);
            return
        }).finally(()=>setIsLoading(false))
    }

    return  <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container}>
                <div className={style.add_merchants_header}>
                    <h2>Approve credits for the merchant</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e)=>handleCreditAction(e)}>
                    <div className={style.name_label_input_contaner}>
                        <label>Rejected Comments </label>
                        <textarea type='text' required placeholder='Enter description' maxLength={150} value={approvalDescription}
                            onChange={(e) => setApprovalDescription(e.target.value)}
                            style={{ width: "96%" }} />
                    </div>
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> : <div className={style.approve_and_reject_btn_container}>
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}
                            // onClick={()=>setApprovalStatus("REJECTED")}
                            >Reject</button>
                        </div>
                        {/* <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}
                            onClick={()=>setApprovalStatus("APPROVED")}
                            >Approved</button>
                        </div> */}
                    </div>
                    }
                </form>
            </div>
        </div>
    
}

export default ApproveThisDocument;