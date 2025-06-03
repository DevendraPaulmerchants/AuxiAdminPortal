import React, { useState } from 'react';
import style from "./Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { handleInputChangeWithAlphabetOnly } from '../InputValidation/InputValidation';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function FilterMerchants({ close }) {
    const {token}=useContextData();
    document.body.style.overflow="hidden"; 
    const [merchantName, setMerchantName] = useState("");
    const [merchantId, setMerchantId] = useState("");
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const filterData={
        merchant_name:merchantName,
        merchant_Id:merchantId,
        from_date:fromDate,
        to_date:toDate
    }
    const filteMerchantList = (e) => {
        e.preventDefault();
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/merchant/filter`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "Application/json"
            },
            method: "POST",
            body: JSON.stringify(filterData),
            mode: 'cors'
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setIsLoading(false);
            }).catch((err) => {
                console.error(err);
                setIsLoading(false);
            })
    }

    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    <h2>Filter Merchants</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => filteMerchantList(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Merchant Name</label>
                            <input type='text' required placeholder='Enter merchant name' maxLength={50} value={merchantName}
                                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setMerchantName)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>MerchantId</label>
                            <input type='text' required placeholder='Enter merchantsId' maxLength={20} value={merchantId}
                                onChange={(e) => setMerchantId(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>From date </label>
                            <input type='date' required placeholder='from date' value={fromDate}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>To date </label>
                            <input type='date' required placeholder='to date' maxLength={40} value={toDate}
                                min={fromDate}
                                onChange={(e) => setToDate(e.target.value)}
                                disabled={!fromDate}
                            />

                        </div>
                    </div>
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>Apply</button>
                        </div>
                    }

                </form>
            </div>
        </div>
    </>
}

export default FilterMerchants;