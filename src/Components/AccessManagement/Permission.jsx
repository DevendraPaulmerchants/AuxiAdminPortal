import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import style from "../Admin/Admin.module.css";
// import style1 from "../Merchants/Merchants.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import AddNewPermission from "./AddNewPermission";
import { APIPATH } from "../apiPath/apipath";
import { useContextData } from "../Context/Context";

const Permission = () => {
    const {token} =useContextData();
    const [searchText, setSearchText] = useState("");
    const [permissionList, setPermissionList] = useState(null);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [isNewPerMissionClick, setIsNewPermissionClick] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    const getPermissionList = () => {
        setIsLoading(true);
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
            .finally(() => {
                setIsLoading(false);
            })
    }
    useEffect(() => {
        getPermissionList();
    }, []);

    const filteredList = permissionList && permissionList?.filter((list) => list.name?.toLowerCase().includes(searchText.toLowerCase()))

    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const closeNewPermission = () => {
        setIsNewPermissionClick(false);
        setSelectedPermission(null);
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
                    <p>Below is the complete list of all permissions along with their descriptions</p>
                </div>
                <div className={style.add_merchants_and_filter}>
                    {/* <button className={style1.primary_login_btn} onClick={() => setIsNewPermissionClick(true)}>Add Permission</button> */}
                </div>
            </div>
            {isLoading ? <div className={style1.loader_container}>
                <div className={style1.loader_item}>
                    <img src='/gold-coin.png' alt='Gold Coin' />
                </div>
            </div> :
                <>
                    <table className={style.merchants_list_container}>
                        <thead>
                            <tr>
                                <th>Permission`s Name</th>
                                <th>Description</th>
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
                                        <td>{val.description}</td>
                                        <td>{val.created_at.split("T")[0]}</td>
                                        <td>{val.updated_at.split("T")[0]}</td>
                                        <td><p style={{ cursor: "pointer" }}
                                            onClick={() => setSelectedPermission(val)}
                                        ><MdEdit /></p></td>
                                    </tr>
                                })
                            ) : <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>No Data Found</td>
                            </tr>
                            }
                        </tbody>
                    </table>
                    {permissionList?.length > rowsPerPage &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
        </div>
        {(isNewPerMissionClick || selectedPermission ) && <AddNewPermission
            selectedPermission={selectedPermission}
            close={closeNewPermission}
            updateList={getPermissionList}
        />}
    </>
};


export default Permission;
