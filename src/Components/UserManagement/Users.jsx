import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdEdit, MdOutlineAdd } from "react-icons/md";
import style from "../Admin/Admin.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import Switch from '@mui/material/Switch';
import AddUser from "./AddNewUser";
import { APIPATH } from "../apiPath/apipath";
import { useContextData } from "../Context/Context";
import { dateFormat } from "../../helperFunction/helper";
// import AddNewuser from "./Newuser";

const Users = () => {
    const {token}=useContextData();
    const [searchText, setSearchText] = useState("");
    const [userList, setuserList] = useState(null);
    const [selecteduser, setSelecteduser] = useState(null);
    const [isNewuserClick, setIsNewuserClick] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    const getuserList = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/users`, {
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
                setuserList(data.data);
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    useEffect(() => {
        getuserList();
    }, []);

    const filteredList = userList && userList?.filter((list) => list.name?.toLowerCase().includes(searchText.toLowerCase()))

    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const closeNewuser = () => {
        setIsNewuserClick(false);
        selecteduser && setSelecteduser(null);
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
                    <p>List of all previously added portal users</p>
                </div>
                <div className={style.add_merchants_and_filter}>
                    <button className={style1.primary_login_btn} style={{ padding: "0 40px" }}
                        onClick={() => setIsNewuserClick(true)}
                    ><MdOutlineAdd />Add user</button>
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Department</th>
                                <th>Role Name</th>
                                <th>Created At</th>
                                <th>Status</th>
                                <th>Last LogIn At</th>
                                <th>Updated At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedList?.length > 0 ? (
                                paginatedList?.map((val, id) => {
                                    return <tr key={id}>
                                        <td>{val.name}</td>
                                        <td>{val.email}</td>
                                        <td>{val.phone?.includes("-") ? val.phone.split("-")[1] : val.phone}</td>
                                        <td>{val.role_name}</td>
                                        <td>{val?.designation}</td>
                                        <td>{dateFormat(val.created_at)}</td>
                                        <td>
                                            <Switch checked={val.status.toLowerCase() === "active"}
                                                onChange={() => {
                                                    // handleStatusChange(val.status,val.kyc_status ,val.merchant_agent_users_id)
                                                }} />
                                        </td>
                                        <td>{dateFormat(val.last_login_at)}</td>
                                        <td>{dateFormat(val.updated_at)}</td>
                                        {/* <td>{val.created_at.split("T")[0]}</td> */}
                                        <td><p className={style1.action_button}
                                            onClick={() => setSelecteduser(val)}
                                        ><MdEdit /></p></td>
                                    </tr>
                                })
                            ) : <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>No Data Found</td>
                            </tr>
                            }
                        </tbody>
                    </table>
                </div>
                    {userList?.length > rowsPerPage &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
        </div>
        {isNewuserClick && <AddUser close={closeNewuser} updateList={getuserList} />}
        {selecteduser && <AddUser close={closeNewuser} updateList={getuserList} selecteduser={selecteduser} />}
    </>
};


export default Users;
