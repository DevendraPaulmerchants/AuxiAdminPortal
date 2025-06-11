import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import style from "../Admin/Admin.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import styles from "./AccessManagement.module.css"
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import AddNewRole from './AddNewRole';

function Role() {
    const { token } = useContextData();
    const [roleList, setRoleList] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [isNewRoleClick, setIsNewRoleClick] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    const getRoleLIst = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/departments`, {
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
                setRoleList(data.data);
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    useEffect(() => {
        getRoleLIst()
    }, [])

    const filteredList = Array.isArray(roleList) ? roleList?.filter((list) => list.name?.toLowerCase().includes(searchText.toLowerCase())) : [];

    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const closeNewRolePage = () => {
        setIsNewRoleClick(false);
        setSelectedRole(null);
    }

    return <>
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                <div className={style.search_input_field}>
                    <input type='text' placeholder='Search by name...' maxLength={12} value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                    <IoSearch />
                </div>
                <div>
                    <p>Below is the complete list of all departments.</p>
                </div>
                <div className={style.add_merchants_and_filter}>
                    <button className={style1.primary_login_btn}
                        onClick={() => setIsNewRoleClick(true)}
                    >Add Department</button>
                </div>
            </div>
            {isLoading ? <div className={style1.loader_container}>
                <div className={style1.loader_item}>
                    <img src='/gold-coin.png' alt='Gold Coin' />
                </div>
            </div> :
                <>
                    <div className={style.table_wrapper}>
                        <table className={style.merchants_list_container}>
                            <thead>
                                <tr>
                                    <th>Department</th>
                                    <th>Description</th>
                                    <th>Permission</th>
                                    <th>Created</th>
                                    <th>Updated</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList?.length > 0 ? (
                                    paginatedList?.map((val, id) => {
                                        return <tr key={id}>
                                            <td>{val.name}</td>
                                            <td><p style={{ width: '300px', whiteSpace: 'break-spaces', margin: 'auto' }}>
                                                {val.description}
                                            </p>
                                            </td>
                                            <td>
                                                {val.permissions_names &&
                                                    <div className={styles.current_value}>
                                                        {val.permissions_names?.slice(0, 1).map((perm, id) => (
                                                            <p key={id}>{perm}{" "}...</p>
                                                        ))}
                                                        <div className={styles.on_hover}>
                                                            {val.permissions_names?.map((perm, id) => (
                                                                <p key={id}>{perm}</p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                }
                                                {/* {val.permissions_names ? val.permissions_names :
                                                    <>
                                                        {val.permissions_names?.slice(0, 1).map((perm, id) => (
                                                            <p key={id}>{perm}{" "}...</p>
                                                        ))}
                                                        <div className={styles.on_hover}>
                                                            {val.permissions_names?.map((perm, id) => (
                                                                <p key={id}>{perm}</p>
                                                            ))}
                                                        </div>
                                                    </>
                                                } */}

                                            </td>

                                            <td>{val.created_at?.split("T")[0]}</td>
                                            <td>{val.updated_at?.split("T")[0]}</td>
                                            <td><p style={{ cursor: "pointer" }}
                                                onClick={() => setSelectedRole(val)}
                                            ><MdEdit /></p></td>
                                        </tr>
                                    })
                                ) : <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>No Data Found</td>
                                </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    {roleList?.length > rowsPerPage &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
        </div>
        {(isNewRoleClick || selectedRole) && <AddNewRole
            selectedRole={selectedRole}
            close={closeNewRolePage}
            updateList={getRoleLIst}
        />}
    </>
}

export default Role;