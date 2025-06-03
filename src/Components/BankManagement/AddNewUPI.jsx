import React, { useState, useEffect } from 'react';
// import style from "../Merchants/Merchants.module.css";
import style from "../MerchantManagement/Merchants.module.css";
import Select from "react-select";
import { useMask } from "@react-input/mask";
import { IoMdClose } from "react-icons/io";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import { handleUpiId } from '../InputValidation/InputValidation';

function AddNewUPI({ close, selectedAccount, updateList }) {
    document.body.style.overflow = "hidden";
    const { token } = useContextData();
    const [upiId, setUPIid] = useState(selectedAccount?.upi_id || "");
    const [isValidUPI, setIsValidUPI] = useState(true);
    const [linkedMobile, setLinkedMobile] = useState(selectedAccount?.linked_mobile_number || "");
    const [isValidMobile, setIsValidMobile] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useMask({
        mask: "+91-__________",
        replacement: { _: /\d/ },
    });

    const newData = {
        upi_id: upiId,
        linked_mobile_number: linkedMobile?.split("-")[1]
    }
    const addPermission = (e) => {
        e.preventDefault();
        if (!isValidMobile) {
            alert("Please enter a valid mobile number");
            return;
        }
        setIsLoading(true);
        const url = selectedAccount ? `${APIPATH}/api/v1/admin/accounts/upi?id=${selectedAccount.id}`
            : `${APIPATH}/api/v1/admin/accounts/upi`;
        const method = selectedAccount ? "PATCH" : "POST";
        fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: method,
            mode: "cors",
            body: JSON.stringify(newData)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                if (data.statusCode !== 201) {
                    alert(data.message);
                    return;
                }
                setIsLoading(false);
                updateList();
                close();
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }


    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    <h2>Add New UPI</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => addPermission(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>UPI Id</label>
                            <input type='text' required placeholder='Enter UPI id' maxLength={20} value={upiId}
                                // onChange={(e) => setUPIid(e.target.value)}
                                onChange={(e) =>handleUpiId(e,setUPIid,setIsValidUPI)}
                            />
                            {!isValidUPI && <span className={style.not_valid_text}>Please enter a valid UPI id</span>}
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>UPI Linked Mobile* </label>
                            <input ref={inputRef} required placeholder='Enter mobile' value={linkedMobile}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setLinkedMobile(e.target.value)
                                    if (value.length <= 13) {
                                        setIsValidMobile(false)
                                    }
                                    if (value.length === 14) {
                                        setIsValidMobile(true)
                                    }
                                }}
                            />
                            {!isValidMobile && <span className={style.not_valid_text}>Please enter a valid mobile number</span>}
                        </div>
                    </div>
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>
                                {selectedAccount ? "Update UPI" : "Add UPI"}
                            </button>
                        </div>
                    }
                </form>
            </div>
        </div>
    </>
}

export default AddNewUPI;