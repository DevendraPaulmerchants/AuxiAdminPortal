import React, { useState, useEffect } from 'react';
// import style from "../Merchants/Merchants.module.css";
import style from "../MerchantManagement/Merchants.module.css";
import style1 from "./AutoRefresh.module.css";
import { IoMdClose } from "react-icons/io";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function AddNewRefreshKey({ close, selectedRow, updateList }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        }
    }, []);
    const { token } = useContextData();
    const [keyName, setKeyName] = useState(selectedRow?.key || "");
    const [timeUnit, setTimeUnit] = useState(selectedRow?.time_unit || "");
    const [minutes, setMinutes] = useState(selectedRow?.value || "");
    const [type, setType] = useState(selectedRow?.type || "");
    const [description, setDescription] = useState(selectedRow?.description || "");
    const [category, setCategory] = useState(selectedRow?.category || "");

    const [isLoading, setIsLoading] = useState(false);

    const newData = {
        key: keyName,
        time_unit: timeUnit,
        value: minutes,
        type: type,
        description: description,
        category: category,
    }

    const addNewRefresh = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = selectedRow ? `${APIPATH}/api/v1/admin/bank/account?id=${selectedRow.id}`
            : `${APIPATH}/api/v1/admin/environment`;
        const method = selectedRow ? "PATCH" : "POST";
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
                setIsLoading(false);
                updateList();
                close();
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }


    return (
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} >
                <div className={style.add_merchants_header}>
                    <h2>{selectedRow ? 'Update this Scheduler':'Add New Scheduler'}</h2>
                    <h3 ><IoMdClose onClick={close} /></h3>
                </div>
                <form onSubmit={(e) => addNewRefresh(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Key* </label>
                            {/* <input type='text' required placeholder='Enter Key ' minLength={3} maxLength={30} value={keyName}
                                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setKeyName)}
                            /> */}
                            <select required onChange={(e => setKeyName(e.target.value))} value={keyName}>
                                <option value="" disabled>Select Key</option>
                                <option value="RATE_REFRESH_INTERVAL">RATE REFRESH INTERVAL</option>
                                <option value="RATE_REFRESH_TIME">Rate Refresh Time</option>
                            </select>
                        </div>
                        <div className={style.name_label_input_contaner}>
                            {/* <label htmlFor="">Value</label> */}
                            <div className={style1.input_and_label_for_new_refresh}>
                                <div>
                                    <label>Time Unit*</label>
                                    <select required value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)} >
                                        <option value="" disabled>Select Time Unit</option>
                                        <option value="HOURS">Hour</option>
                                        <option value="MINUTES">Minute</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Value* </label>
                                    <input type='number' required placeholder='00' min={0} max={59} value={minutes}
                                        onChange={(e) => setMinutes(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Type* </label>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="" disabled>Select Type</option>
                                <option value="STRING">String</option>
                                <option value="NUMBER">Number</option>
                                <option value="BOOLEAN">Boolean</option>
                                <option value="JSON">Json</option>
                                <option value="TIME">Time</option>
                                <option value="DATETIME">Datetime</option>

                            </select>
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Category* </label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="" disabled>Select Category</option>
                                <option value="CRON">Cron</option>
                                <option value="UI">Ui</option>
                                <option value="SECURITY">Security</option>
                            </select>

                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Description </label>
                            <textarea type='text' required placeholder='Enter bank holder name' minLength={3} maxLength={300} value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>
                                {selectedRow ? "Update" : "Add"}
                            </button>
                        </div>
                    }
                </form>
            </div>
        </div>
    );
}

export default AddNewRefreshKey;