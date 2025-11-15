import React, { useEffect, useState } from 'react';
import { IoEye, IoSearch } from "react-icons/io5";
import style from "../Admin/Admin.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import style2 from "../Transactions/Transaction.module.css";
// import styles from './Metal.module.css'
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import MetalLogsDetails from './MetalLogsDetails';
import { useLocation } from 'react-router-dom';
import { capitalizeWord } from '../InputValidation/InputValidation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { dateAndTimeFormat } from '../../helperFunction/helper';
import { FcCancel, FcClock, FcOk, FcSportsMode } from 'react-icons/fc';

function MetalLogs() {
    const { token } = useContextData();
    const { state } = useLocation();
    console.log(state)
    const [metalList, setmetalList] = useState(null);
    const [selectedMetal, setSelectedMetal] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [metalType, setMetalType] = useState("");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [transactionType, setTransactionType] = useState(state || "");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;


    const getmetalLogs = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/storages/metal/logs`, {
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
                setmetalList(data.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        getmetalLogs();
    }, [transactionType, startDate, endDate, metalType]);

    const filteredList = metalList?.filter((list) => list.order_id?.toLowerCase().includes(searchText.toLowerCase())
        && (transactionType === "" || list?.transaction_type === transactionType)
    );

    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const closeSelectedPage = () => {
        setSelectedMetal(null);
        document.body.style.overflow = 'auto'
    }

    return <>
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                <div className={style.merchants_filters_section}>
                    <div className={style.search_input_field}>
                        <input type='text' placeholder='Search by orderId/CustomerId' maxLength={40} value={searchText}
                            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                        <IoSearch />
                    </div>
                    <div className={style2.start_date_and_end_date}>
                        <div>
                            <DatePicker className={style2.date_input}
                                placeholderText='Select start date'
                                maxDate={new Date()}
                                selected={startDate}
                                onChange={(date) => {
                                    setStartDate(date?.toLocaleDateString()?.split("T")[0]);
                                }}
                            />
                        </div>
                        <div>
                            <DatePicker className={style2.date_input}
                                disabled={!startDate}
                                minDate={startDate}
                                maxDate={new Date()}
                                selected={endDate}
                                onChange={(date) => setEndDate(date?.toLocaleDateString()?.split("T")[0])}
                                placeholderText='Select end date'
                            />
                        </div>
                    </div>
                    <div className={style2.transaction_type_input}>
                        <select value={metalType}
                            onChange={(e) => setMetalType(e.target.value)} >
                            <option value="" disabled>Select Metal</option>
                            <option value="ALL">All</option>
                            <option value="GOLD">GOLD</option>
                            <option value="SILVER">SILVER</option>
                        </select>
                    </div>
                    <div className={style2.transaction_type_input}>
                        <select value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)} >
                            <option value="all" disabled>Select Transaction Type</option>
                            <option value="">All</option>
                            <option value="DEBIT">Debit</option>
                            <option value="CREDIT">Credit</option>
                            <option value="TRANSFER">Transfer</option>
                            <option value="CONVERSION">Conversion</option>
                        </select>
                    </div>
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
                                    <th>Order Id</th>
                                    {/* <th>Merchant Name</th> */}
                                    <th>Customer Id</th>
                                    <th>Metal Type</th>
                                    <th>Weight(g)</th>
                                    <th>(W.A.C) before Trans.(₹)</th>
                                    <th>Amount(₹)</th>
                                    <th>(W.A.C) After Trans.(₹)</th>
                                    <th>Trans. Type</th>
                                    <th>Remaining Stock Weight</th>
                                    <th>Requested at</th>
                                    <th>Updated at</th>
                                    <th>Transaction status</th>
                                    {/* <th>Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList?.length > 0 ? (
                                    paginatedList?.map((val, id) => {
                                        return <tr key={val.id}>
                                            <td>
                                                {val.order_id ? `XXXX${val.order_id.slice(-4)}` : ""}
                                            </td>
                                            {/* <td>
                                                {val.merchant_name}
                                            </td> */}
                                            <td>
                                                {val.customer_id}
                                            </td>
                                            <td>{val?.metal_type}</td>

                                            <td>
                                                {Number.parseFloat(val.weight).toFixed(6)}
                                            </td>
                                            <td>{val.wac_before}</td>
                                            <td>{val.total_value}</td>
                                            <td>{val.wac_after}</td>
                                            <td>
                                                {capitalizeWord(val.action_type)}
                                            </td>
                                            <td>{Number.parseFloat(val.remaining_stock_weight).toFixed(6)}</td>
                                            <td>{dateAndTimeFormat(val.created_at)}</td>
                                            <td>{dateAndTimeFormat(val.updated_at)}</td>
                                            <td title={capitalizeWord(val.transaction_status)} >
                                                {val.transaction_status === "COMPLETED" && <FcOk fontSize={24} />}
                                                {val.transaction_status === 'PROCESSING' && <FcSportsMode fontSize={24} />}
                                                {val.transaction_status === "PENDING" && <FcClock fontSize={24} />}
                                                {val.transaction_status === "FAILED" && <FcCancel fontSize={24} />}
                                            </td>
                                            {/* <td>
                                                <p className={style1.action_button}
                                                    onClick={() => { setSelectedMetal(val); }}
                                                >
                                                    <IoEye />
                                                </p>
                                            </td> */}
                                        </tr>
                                    })
                                ) : <tr>
                                    <td colSpan="9" style={{ textAlign: "center" }}>No Data Found</td>
                                </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    {metalList?.length > rowsPerPage &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
        </div>
        {selectedMetal && <MetalLogsDetails close={closeSelectedPage} selectedMetal={selectedMetal} />}
    </>
}

export default MetalLogs;