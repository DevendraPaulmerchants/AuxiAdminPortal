import React, { useEffect, useState } from 'react';
import style from "./Reports.module.css";
import { FaCheckCircle } from 'react-icons/fa';
import { useContextData } from '../Context/Context';

function InvoiceConfirmation({close,customerName}) {
    const {token}=useContextData();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleDownload=()=>{
        console.log("Download Invoice");
        setIsLoading(true);
        const url=''
        fetch(url,{
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method:'GET',
            mode:'cors'
        })
        .then(((res)=>res.blob()))
        .then((data)=>{
            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Customer-Invoice.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            console.log("Invoice Downloaded",data);
            close();
        }).catch((err)=>{
            console.error("Error downloading invoice:", err);
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
                { isLoading ? <p className={style.loading_text}>Downloading Invoice...</p> :
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