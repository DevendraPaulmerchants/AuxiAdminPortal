import React, { useState } from 'react';
import style from "./Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { useContextData } from '../Context/Context';
import { data, useNavigate } from 'react-router-dom';
import { APIPATH } from '../apiPath/apipath';

function ApproveKYC({ close,merchantId,updateList,docId}) {
    const {token} =useContextData()
    const [approvalDescription, setApprovalDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [buttonText,setButtonText]=useState("")

    // const kycApproveData={
    //     merchant_id:merchantId,
    //     kyc_status:true,
    //     verification_status:"VERIFIED",
    // }  
    // const kycRejectData={
    //     merchant_id:merchantId,
    //     kyc_status:false,
    //     verification_status:"REJECTED",
    //     rejected_reason:approvalDescription,
    // }  

    const finalData = {
        merchant_id: merchantId,
        comment:approvalDescription,
        // kyc_status: buttonText === "VERIFIED",
        // verification_status:buttonText,
        // ...(buttonText === "REJECTED" && { rejected_reason: approvalDescription }),
      };
      
    const navigate=useNavigate();
    const handleKycRequest=(e)=>{
        e.preventDefault();
        setIsLoading(true);
        const url= buttonText === "VERIFIED" ?`${APIPATH}/api/v1/admin/merchants/kyc/verify`:`${APIPATH}/api/v1/admin/merchants/kyc/reject`
        fetch(url,{
            headers:{
                'Authorization':`Barear ${token}`,
                'Content-Type':"Application/json"
            },
            method:"PATCH",
            body:JSON.stringify(finalData),
            mode:"cors"
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            if(data.statusCode !== 201 && data.statusCode !== 200){
                alert(data.message);
                return;
            }
            alert(data.message);
            updateList();
            close();
            navigate('/approved-merchants');
        })
        .catch((err)=>{
            console.error(err);
            alert(data.message);
            return
        }).finally(()=>setIsLoading(false))
    }

    // const rejectKycRequest=(e)=>{
    //     e.preventDefault();
    //     setIsLoading(true);
    //     fetch(`${APIPATH}/api/v1/admin/merchant/kyc/reject`,{
    //         headers:{
    //             'Authorization':`Barear ${token}`,
    //             'Content-Type':"Application/json"
    //         },
    //         method:"PATCH",
    //         body:JSON.stringify(kycApproveData),
    //         mode:"cors"
    //     })
    //     .then((res)=>res.json())
    //     .then((data)=>{
    //         console.log(data);
    //         alert(data.message);
    //         close();
    //     })
    //     .catch((err)=>{
    //         console.error(err);
    //         alert(data.message);
    //         return
    //     }).finally(()=>setIsLoading(false))
    // }

    return  <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    <h2>Approve/Reject the KYC of this merchant</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e)=>handleKycRequest(e)}>
                    <div className={style.name_label_input_contaner}>
                        <label>Comments </label>
                        <textarea type='text' required placeholder='Enter description' maxLength={150} value={approvalDescription}
                            onChange={(e) => setApprovalDescription(e.target.value)}
                            style={{ width: "96%" }} />
                    </div>
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> : <div className={style.approve_and_reject_btn_container}>
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}
                            onClick={()=>setButtonText("REJECTED")}
                            // onClick={(e)=>rejectKycRequest(e)}
                            >Reject</button>
                        </div>
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}
                            onClick={()=>setButtonText("VERIFIED")}
                            // onClick={(e)=>handleKycRequest(e)}
                            >Approve</button>
                        </div>
                    </div>
                    }
                </form>
            </div>
        </div>
    
}

export default ApproveKYC;