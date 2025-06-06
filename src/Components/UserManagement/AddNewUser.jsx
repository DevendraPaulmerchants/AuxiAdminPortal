import React, { useEffect, useState } from 'react';
import style from "../MerchantManagement/Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { useMask } from "@react-input/mask";
import Select from "react-select";
import { handleEmailChange, handleInputChangeWithAlphabetOnly, } from '../InputValidation/InputValidation';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function AddUser({ close, updateList, selecteduser }) {
    const { token } = useContextData();
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    const [name, setName] = useState(selecteduser?.name || "");
    const [userEmail, setUserEmail] = useState(selecteduser?.email || "");
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [mobile, setMobile] = useState(selecteduser?.phone || "");
    const [isValidMobile, setIsValidMobile] = useState(true);
    const [roleList, setRoleList] = useState(null);
    const [roleId, setRoleId] = useState(selecteduser?.role_id || "");
    const [roleName, setRoleName] = useState(selecteduser?.role_name || "");
    const [permissionList, setPermissionList] = useState(null);

    const [selectPermission, setSelectPermission] = useState([{
        permissions_names: "",
        permissions_ids: "",
    }
    ])

    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useMask({
        mask: "+91-__________",
        replacement: { _: /\d/ },
    });

    useEffect(() => {
        fetch(`${APIPATH}/api/v1/admin/departments`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: 'GET',
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                setIsLoading(false);
                setRoleList(data.data)
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)
            })
    }, [])
    // Get all Permissions according to role ------------------------------------------------------

    useEffect(() => {
        if (!roleId) return;
        fetch(`${APIPATH}/api/v1/admin/permissions?id=${roleId}`, {
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
    }, [roleId])

    const permissionOptions = permissionList?.map(permission => ({
        value: permission.id,
        label: `${permission.name}`
    }));
    const handlePermissionChange = (selectedOptions) => {
        const permissions_names = selectedOptions.map(option => option.label.split(" - ")[0]);
        const permissions_ids = selectedOptions.map(option => option.value);

        setSelectPermission({ permissions_names, permissions_ids });
    };

    const newUser = {
        name: name,
        email: userEmail,
        phone: mobile,
        department_id: roleId,
        user_type: 2,
        designation: roleName,
        permissions_ids: selectPermission.permissions_ids,
        permissions_names: selectPermission.permissions_names,
    }
    const handleFormData = (e) => {
        e.preventDefault();
        if (!isValidEmail) {
            alert("Please enter valid email")
            return;
        }
        if (!isValidMobile) {
            alert("Please enter valid mobile");
            return;
        }
        const url = selecteduser ? `${APIPATH}/api/v1/admin/users?id=${selecteduser?.id}` : `${APIPATH}/api/v1/admin/users`;
        const method = selecteduser ? "PATCH" : "POST";
        setIsLoading(true)
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: method,
            body: JSON.stringify(newUser),
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.statusCode !== 201 && data.statusCode !== 200) {
                    alert(data.message);
                    return;
                }
                else {
                    alert(data.message);
                    close();
                    updateList();
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setIsLoading(false))
    }

    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    <h2>{selecteduser ? "Update this User" : "Add new Portal User"}</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => {
                    handleFormData(e)
                }}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Name* </label>
                            <input type='text' required placeholder='Enter user name' maxLength={50} value={name}
                                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setName)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Mobile* </label>
                            <input ref={inputRef} required placeholder='Enter user mobile ' value={mobile}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setMobile(e.target.value)
                                    if (value.length <= 13) {
                                        setIsValidMobile(false)
                                    }
                                    if (value.length === 14) {
                                        setIsValidMobile(true)
                                    }
                                }}
                            />
                            {!isValidMobile && <p className={style.not_valid_text}>Please type valid Mobile</p>}
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Email* </label>
                            <input type='email' required placeholder='Enter user email' maxLength={40} value={userEmail}
                                onChange={(e) => handleEmailChange(e, setUserEmail, setIsValidEmail)}
                            />
                            {!isValidEmail && <p className={style.not_valid_text}>Please type valid Email</p>}
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Select Department* </label>
                            <select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                                <option value="" disabled>Select Department</option>
                                {roleList?.map((role, id) => {
                                    return <option key={role.id} value={role.id}>{role.name}</option>
                                })}
                            </select>
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Enter Role Name* </label>
                            <input type='text' required placeholder='Enter role name' maxLength={50} value={roleName}
                                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setRoleName)}
                            />
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Permissions* </label>
                            <Select
                                options={permissionOptions}
                                isMulti
                                onChange={handlePermissionChange}
                                defaultValue={
                                    selecteduser?.permissions_ids?.map((id, index) => ({
                                        value: id,
                                        label: selecteduser.permissions_names[index],
                                    })) || []
                                }
                                classNamePrefix="select"
                                placeholder="Select Permissions..."
                            />
                        </div>
                    </div>

                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>{selecteduser ? "Update" : "Add"}</button>
                        </div>
                    }
                </form>
            </div>
        </div>
    </>
}

export default AddUser;