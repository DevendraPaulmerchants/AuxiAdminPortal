import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import style from "../Admin/Admin.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import AddNewGlobalMargin from './AddNewGlobalMargin';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function Global() {
    const {token}=useContextData();
    const [globalList, setGlobalList] = useState(null);
    const [selectedGlobal, setSelectedGlobal] = useState(null);
    const [isNewGlobalClick, setIsNewGlobalClick] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    const getGlobalLIst = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/margins/globals`, {
            headers: {
               'Authorization':`Bearer ${token}`,
               'Content-Type':'Application/json'
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setGlobalList(data.data);
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    useEffect(() => {
        getGlobalLIst()
    }, [])

    const filteredList = globalList && globalList?.filter((list) => list.metal_type?.toLowerCase().includes(searchText.toLowerCase()));
    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const closeNewGlobalPage = () => {
        setIsNewGlobalClick(false);
        setSelectedGlobal(null);
        document.body.style.overflow = "auto";
    }
    const closeAfterAPICall = () => {
        getGlobalLIst();
        closeNewGlobalPage();
        document.body.style.overflow = "auto";
    }
    return <>
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                <div className={style.search_input_field}>
                    <input type='text' placeholder='Search by metal name...' maxLength={12} value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                    <IoSearch />
                </div>
                <div>
                    <p>Below is the complete list of all applicable charges for metals</p>
                </div>
                <div className={style.add_merchants_and_filter}>
                    <button className={style1.primary_login_btn}
                        onClick={() => setIsNewGlobalClick(true)}
                    >Add New Margin</button>
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
                                <th>Metal Type</th>
                                <th>Platform Charge(INR)</th>
                                <th>Margin(%)</th>
                                <th>GST(%)</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedList?.length > 0 ? (
                                paginatedList?.map((val, id) => {
                                    return <tr key={id}>
                                        <td>{val?.metal_type}</td>
                                        <td>
                                            <p>Buy:- {val?.buy_platform_charge_fee}</p>
                                            <p>Sell:- {val?.sell_platform_charge_fee}</p>
                                            <p>Transfer:- {val?.transfer_platform_charge_fee}</p>
                                            <p>Conversion:- {val?.conversion_platform_charge_fee}</p>
                                        </td>
                                        <td>
                                            <p>Buy:- {val?.buy_margin}</p>
                                            <p>Sell:- {val?.sell_margin}</p>
                                            <p>Transfer:- {val?.transfer_margin}</p>
                                            <p>Conversion:- {val?.conversion_margin}</p>
                                        </td>
                                        <td>
                                            <p>Buy:- {val?.buy_gst}</p>
                                            <p>Sell:- {val?.sell_gst}</p>
                                            <p>Transfer:- {val?.transfer_gst}</p>
                                            <p>Conversion:- {val?.conversion_gst}</p>
                                        </td>
                                        <td><p style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setSelectedGlobal(val);
                                                setIsNewGlobalClick(true);
                                            }}
                                        ><MdEdit /></p></td>
                                    </tr>
                                })
                            ) : <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>No Data Found</td>
                            </tr>
                            }
                        </tbody>
                    </table>
                    {globalList?.length > rowsPerPage &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
        </div>
        {isNewGlobalClick && <AddNewGlobalMargin
            close={closeNewGlobalPage}
            closeAfterAPICall={closeAfterAPICall}
            selectedAccount={selectedGlobal} />}
    </>
}

export default Global;