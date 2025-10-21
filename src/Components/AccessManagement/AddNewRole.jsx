import React, { useState, useEffect } from 'react';
// import style from "../Merchants/Merchants.module.css";
import style from "../MerchantManagement/Merchants.module.css";
import Select from "react-select";
import { IoMdClose } from "react-icons/io";
// import { handleInputChangeWithAlphabetOnly } from '../InputValidation/InputValidation';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function AddNewRole({ close, selectedRole, updateList }) {
    console.log("selectedRole", selectedRole);
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const { token } = useContextData();
    const [name, setName] = useState(selectedRole?.name || "")
    const [description, setDescription] = useState(selectedRole?.description || "");
    const [permissionList, setPermissionList] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [selectPermission, setSelectPermission] = useState({
        permissions_names: [],
        permissions_ids: [],
    })

    const getPermissionList = () => {
        fetch(`${APIPATH}/api/v1/admin/permissions`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'Application/json'
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setPermissionList(data.data);
            })
            .catch((err) => {
                console.error(err)
            })
    }
    useEffect(() => {
        getPermissionList();
    }, []);

    const permissionOptions = permissionList?.map(permission => ({
        value: permission.id,
        label: `${permission.name}`
    }));
    const handlePermissionChange = (selectedOptions) => {
        const permissions_names = selectedOptions.map(option => option.label.split(" - ")[0]);
        const permissions_ids = selectedOptions.map(option => option.value);

        setSelectPermission({ permissions_names, permissions_ids });
    };

    const newRoleData = {
        name: name,
        description: description,
        permissions_names: selectPermission.permissions_names,
        permissions_ids: selectPermission.permissions_ids
    };
    const addPermission = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = selectedRole ? `${APIPATH}/api/v1/admin/departments/${selectedRole.id}` : `${APIPATH}/api/v1/admin/departments`;
        const method = selectedRole ? 'PATCH' : 'POST';
        fetch(url, {
            headers: {
                "Authorization": `Barear ${token}`,
                "Content-Type": "application/json"
            },
            method: method,
            mode: "cors",
            body: JSON.stringify(newRoleData)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                if (data.statusCode !== 201 && data.statusCode !== 200) {
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


    return  <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} >
                <div className={style.add_merchants_header}>
                    {/* <h2>Add Department</h2> */}
                    <h2> {selectedRole ? "Update Department" : "Add Department"}</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => addPermission(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label> Department Name* </label>
                            <input type='text' required placeholder='Enter Department Name' minLength={3} maxLength={30} value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Descriptions* </label>
                            <textarea type='text' required placeholder='Short Description of Department ' maxLength={200} value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={style.name_label_input_contaner}>
                        <div className={style.name_label_input_contaner}>
                            <label>Permissions* </label>
                            <Select
                                options={permissionOptions}
                                isMulti
                                onChange={handlePermissionChange}
                                defaultValue={
                                    selectedRole?.permissions_ids && selectedRole?.permissions_names
                                        ? selectedRole.permissions_ids.map((id, index) => ({
                                            value: id,
                                            label: selectedRole.permissions_names[index] || id, // fallback to id if label missing
                                        }))
                                        : []
                                }

                                placeholder="Select Permissions..."
                            />
                        </div>
                    </div>

                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>{selectedRole ? "Update" : "Add"}</button>
                        </div>
                    }
                </form>
            </div>
        </div>
    
}

export default AddNewRole; 