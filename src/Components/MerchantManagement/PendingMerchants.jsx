import React, { lazy, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from "../Admin/Admin.module.css";
import style1 from "./Merchants.module.css";
import { GoEye } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import Switch from '@mui/material/Switch';
import AddMerchants from './AddMerchants';
import FilterMerchants from './FilterMerchants';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import { dateFormat } from '../../helperFunction/helper';
const AddMerchant = lazy(() => import('./AddMerchant/AddMerchant'));

function PendingMerchants() {
    const { token } = useContextData();
    const [searchText, setSearchText] = useState("");
    const [merchantList, setMerchantList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    const [isAddMerchnatsClick, setIsMerchantsClick] = useState(false);
    const [isFilterClick, setIsFilterClick] = useState(false);

    const fetchMerchantList = () => {
        setIsLoading(true)
        fetch(`${APIPATH}/api/v1/admin/merchants?verification_status=PENDING,REJECTED`, {
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
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)
            })
    }

    useEffect(() => {
        fetchMerchantList();
    }, [])
    const openAddMerchantsForm = () => {
        setIsMerchantsClick(true);
    }
    const closeAddMerchantsForm = () => {
        setIsMerchantsClick(false);
        document.body.style.overflow = "auto";
    }
    const openFilteredForm = () => {
        setIsFilterClick(true);
    }
    const closeFilteredForm = () => {
        setIsFilterClick(false);
        document.body.style.overflow = "auto";
    }

    const filteredList = Array.isArray(merchantList) ? merchantList?.filter((list) => list.merchant_name?.toLowerCase().includes(searchText.toLowerCase())) : [];
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
    const selectedMerchant = (merchantId, status) => {
        navigate(`/pending_merchants/${merchantId}?verification_status=${status}`);
    }

    return <>
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                {/* <h2>Merchants List</h2> */}
                <div className={style.search_input_field}>
                    <input type='text' placeholder='Search by name' maxLength={12} value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                    <IoSearch />
                </div>
                <div>
                    <p>Review and verify the listed merchants.</p>
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
                                    {/* <th>Avl. Credits</th> */}
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
                                            <td>{val.primary_person_mobile}</td>
                                            {/* <td>{val.available_credit}</td> */}
                                            {/* <td>{val?.kyc_status !== Object ? "Approved":"Pending"}</td> */}
                                            <td>{val.verification_status}</td>
                                            <td>{dateFormat(val.created_at)}</td>
                                            <td>
                                                <Switch checked={val.status === "active"} />
                                            </td>
                                            <td><p style={{ cursor: "pointer" }}
                                                onClick={() => selectedMerchant(val.merchant_id, val.verification_status)}
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
        {/* {isFilterClick && <FilterMerchants close={closeFilteredForm} />} */}
        {isAddMerchnatsClick && <AddMerchant close={closeAddMerchantsForm} updateList={fetchMerchantList} />}
    </>
}

export default PendingMerchants;