import React, { lazy, useEffect, useState } from 'react';
import { useLocation, useNavigate, } from 'react-router-dom';
import style from "../Admin/Admin.module.css";
import style1 from "./Merchants.module.css";
import { GoEye } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import Switch from '@mui/material/Switch';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import { dateFormat } from '../../helperFunction/helper';
const AddMerchant = lazy(() => import('./AddMerchant/AddMerchant'));

function MerchantsList() {

    const { token } = useContextData();
    const { state } = useLocation();

    const [searchText, setSearchText] = useState("");
    const [merchantList, setMerchantList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    const [isAddMerchnatsClick, setIsMerchantsClick] = useState(false);
    const [isFilterClick, setIsFilterClick] = useState(false);
    const [merchantStatus, setMerchantStatus] = useState(state || "");

    const fetchMerchantList = () => {
        setIsLoading(true)
        fetch(`${APIPATH}/api/v1/admin/merchants`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: 'GET',
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setMerchantList(data.data);
            })
            .catch((err) => {
                console.log(err);
            }).finally(() => {
                setIsLoading(false)
            })
    }
    useEffect(() => {
        fetchMerchantList();
    }, []);

    const openAddMerchantsForm = () => {
        setIsMerchantsClick(true);
    }
    const closeAddMerchantsForm = () => {
        setIsMerchantsClick(false);
    }

    const filteredList = Array.isArray(merchantList) ? merchantList?.filter((list) => {
        if (merchantStatus === 'ACTIVE' && list.status !== 'ACTIVE') return false;
        if (merchantStatus === 'INACTIVE' && list.status !== 'INACTIVE') return false;
        return list.merchant_name?.toLowerCase().includes(searchText.toLowerCase())
    }) : [];

    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const navigate = useNavigate();
    const selectedMerchant = (merchantId) => {
        navigate(`/approved-merchants/${merchantId}`);
    }

    const changeStatusOfSelectedMerchant = (merchantId, currentStatus) => {
        const confirm = window.confirm("Do you really want to change the status of this merchant?");
        if (!confirm) {
            return;
        }
        const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const formData = new FormData();
        formData.append('jsonData', JSON.stringify({ status: newStatus }));

        fetch(`${APIPATH}/api/v1/admin/merchants?id=${merchantId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'application/json',
            },
            method: 'PATCH',
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.statusCode === 200) {
                    alert(`Merchant status updated to ${newStatus}`);
                    fetchMerchantList();
                    return;
                }
                if (data.statusCode === 400) {
                    alert(data.message);
                    return;
                }
                else {
                    alert('Failed to update merchant status');
                    return
                }
            })
            .catch((err) => {
                console.error(err);
                alert('An error occurred while updating the status');
            });
    };

    return <>
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                <div className={style.search_input_field}>
                    <input type='text' placeholder='Search by name..' maxLength={12} value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                    <IoSearch />
                </div>
                <div>
                    <label>Filter By Status : </label>
                    <select className={style.merchants_select} value={merchantStatus}
                        onChange={(e) => { setMerchantStatus(e.target.value) }}>
                        <option value="" disabled>Select Status</option>
                        <option value="all">All</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="ACTIVE">Active</option>
                    </select>
                </div>
                <div className={style.add_merchants_and_filter}>
                    <button onClick={openAddMerchantsForm} className={style1.primary_login_btn}>Add Merchant</button>
                    {/* <button onClick={openFilteredForm} className={style1.primary_login_btn} style={{ padding: "0px 40px" }}>Filter</button> */}
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
                                    <th>Mobile</th>
                                    <th>Avl. Credits</th>
                                    <th>KYC Status</th>
                                    <th>Created At</th>
                                    <th>Active/Inactive</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList?.length > 0 ? (
                                    paginatedList?.map((val, id) => {
                                        return <tr key={id}>
                                            <td>{val.merchant_name}</td>
                                            <td>{val.primary_person_email}</td>

                                            <td>
                                                {val.primary_person_mobile?.includes('-')
                                                    ? val.primary_person_mobile.split('-')[1]
                                                    : val.primary_person_mobile}
                                            </td>
                                            <td>{val.available_credit}</td>
                                            <td>{val?.kyc_status ? "Approved" : "Pending"}</td>
                                            <td>{dateFormat(val.created_at)}</td>
                                            <td>
                                                <Switch
                                                    checked={val.status === "ACTIVE"}
                                                    onChange={() => changeStatusOfSelectedMerchant(val.merchant_id, val.status)}
                                                />
                                            </td>
                                            <td><p style={{ cursor: "pointer" }}
                                                onClick={() => selectedMerchant(val.merchant_id)}
                                            ><GoEye /></p></td>
                                        </tr>
                                    })
                                ) : <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>No Data Found</td>
                                </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    {merchantList?.length > rowsPerPage &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
        </div>
        {/* {isAddMerchnatsClick && <AddMerchants close={closeAddMerchantsForm} updateList={fetchMerchantList} />} */}
        {isAddMerchnatsClick && <AddMerchant close={closeAddMerchantsForm} updateList={fetchMerchantList} />}
    </>
}

export default MerchantsList;