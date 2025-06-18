import React, { useEffect, useState } from 'react';
import style from "./Reports.module.css";
import { FaCheckCircle } from 'react-icons/fa';
import { useContextData } from '../Context/Context';
import { APIPATH } from '../apiPath/apipath';

function InvoiceConfirmation({close,customerName,orderId}) {
    const {token}=useContextData();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

// download invoice function ---------------------------------
    const handleDownload=()=>{
        console.log("Download Invoice");
        setIsLoading(true);
        const url=`${APIPATH}/api/v1/admin/transactions/${orderId}/invoice/resend`
        fetch(url,{
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method:'GET',
            mode:'cors'
        })
        .then(((res)=>res.json()))
        .then((data)=>{
             alert(data.message);
            close();
        }).catch((err)=>{
            console.error("Error Sending invoice:", err);
        })
        .finally(()=>setIsLoading(false))
    }

    return <>
        <div className={style.invoice_confirmation_container}>
            <div className={style.invoice_confirmation_content}>
                <h1><FaCheckCircle fontSize={50} /></h1>
                <h2>Confirm Send Invoice?</h2>
                <p>Are you sure you want to send invoice to
                    <b style={{ color: '#1F342F' }}> {customerName}</b>.
                </p>
                { isLoading ? <p className={style.loading_text}>Sending Invoice...</p> :
                <div className={style.invoice_confirmation_buttons}>
                    <button className={style.cancel_button} onClick={close}>Cancel</button>
                    <button className={style.confirm_button} onClick={handleDownload} >Confirm</button>
                </div>
                }
            </div>
        </div>
    </>
}

export default InvoiceConfirmation