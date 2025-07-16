import React, { useEffect, useState } from 'react';
import style from "./Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { handleInputChangeWithAlphabetOnly, handleInputChangeWithNumericValueOnly } from '../InputValidation/InputValidation';
import { useContextData } from '../Context/Context';
import { APIPATH } from '../apiPath/apipath';

function AddCredits({ close, selectedMerchant, updateList }) {
    const { token } = useContextData();
    const [creditsPoint, setCreditsPoints] = useState();
    const [description, setDescription] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [referenceId, setReferenceId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const creditData = {
        merchant_id: selectedMerchant,
        amount: parseInt(creditsPoint),
        description: description,
        transaction_type: transactionType,
        payment_reference_id: referenceId,
        payment_method: paymentMethod
    }
    
    const addCredit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/merchants/credits/requests`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: 'POST',
            mode: "cors",
            body: JSON.stringify(creditData)
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode !== 201) {
                    alert(data.message);
                    setIsLoading(false);
                    return;
                }
                console.log(data.data);
                alert(data.message);
                setIsLoading(false);
                close();
                updateList();
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    <h2>Add credit to merchants</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => addCredit(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Credit points* </label>
                            <input type='text' required placeholder='Enter credits' min={1} max={100000} maxLength={8} value={creditsPoint}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setCreditsPoints)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Descriptions (optional) </label>
                            <textarea type='text' required placeholder='Enter descriptions' maxLength={200} value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Transaction Type* </label>
                            <select required value={transactionType} onChange={(e) => setTransactionType(e.target.value)} style={{ width: "106%" }} >
                                <option value="" disabled>Select Transaction Type</option>
                                <option value="manual_credit">Manual Credit</option>
                                <option value="Cash">Cash</option>
                                <option value="Cheque"> Cheque</option>
                            </select>
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Payment Reference Id* </label>
                            <input type='text' required placeholder='Enter merchant name' maxLength={200} value={referenceId}
                                onChange={(e) => setReferenceId(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={style.name_label_input_contaner}>
                        <label>Payment Method* </label>
                        <select required value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option value="" disabled>Select payment method</option>
                            <option value="UPI">UPI</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="CREDIT_CARD"> Credit Card</option>
                        </select>
                    </div>
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>Add Credits</button>
                        </div>
                    }
                </form>
            </div>
        </div>
    </>
}

export default AddCredits;