import React, { useEffect, useState } from 'react';
import style from "../MerchantManagement/Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function AddNewPermission({ close, selectedPermission, updateList }) {
    console.log("selectedPermission", selectedPermission);
    const { token } = useContextData();
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    const [name, setName] = useState(selectedPermission?.name || "")
    const [description, setDescription] = useState(selectedPermission?.description || "");
    const [isLoading, setIsLoading] = useState(false);

    const NewPermissionData = {
        name: name,
        description: description
    }
    const addPermission = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = selectedPermission ? `${APIPATH}/api/v1/admin/permissions/${selectedPermission.id}` : `${APIPATH}/api/v1/admin/permissions`;
        const method = selectedPermission ? 'PATCH' : 'POST';
        fetch(url, {
            headers: {
                "Authorization": `Barear ${token}`,
                "Content-Type": "application/json"
            },
            method: method,
            mode: "cors",
            body: JSON.stringify(NewPermissionData)
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


    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    <h2>
                        {selectedPermission ? 'Update Permission' : 'Add New Permission'}
                    </h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => addPermission(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label> Department Name* </label>
                            <input type='text' required placeholder='Enter Name' minLength={3} maxLength={30} value={name}
                                // onChange={(e) => handleInputChangeWithAlphabetOnly(e, setName)}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Descriptions* </label>
                            <textarea type='text' required placeholder='Enter descriptions' maxLength={200} value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>
                                {selectedPermission ? 'Update':'Add'}</button>
                        </div>
                    }
                </form>
            </div>
        </div>
    </>
}

export default AddNewPermission;