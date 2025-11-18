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
    const [pagesData, setPagesData] = useState(null);
    const [direction, setDirection] = useState('');
    const [cursors, setCursors] = useState('');
    const [nextCursor, setNextCursor] = useState('');
    const [prevCursor, setPrevCursor] = useState('');

    // Fetching metal logs data from API
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const url = `${APIPATH}/api/v1/admin/storages/metal/logs?order_type=${transactionType ? transactionType : ''}&metal_type=${metalType ? metalType : ''}&start_date=${startDate ? startDate : ''}&end_date=${endDate ? endDate : ''}`;
                const res = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'Application/json'
                    },
                    method: 'GET',
                    mode: 'cors'
                });
                const data = await res.json();
                setPagesData(data.data || []);
                setNextCursor(data.hasNextPage ? data.nextCursor : '');
                setPrevCursor(data.hasPrevPage ? data.prevCursor : '');
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [token, transactionType, startDate, endDate, cursors, direction, metalType]);


    // Resetting pagination when filters change
    useEffect(() => {
        setCursors('');
        setDirection('');
        setCurrentPage(1);
    }, [transactionType, startDate, endDate]);

    // Handling pagination Next button click
    const handleNext = () => {
        if (nextCursor) {
            setCursors(nextCursor);
            setDirection('next');
            setCurrentPage(prev => prev + 1);
        }
    };

    // Handling pagination Next button click
    const handlePrev = () => {
        if (prevCursor) {
            setCursors(prevCursor);
            setDirection('prev');
            setCurrentPage(prev => prev - 1);
        }
    };

    // Filtering the paginated list based on search text and account status
    const paginatedList = pagesData?.filter((list) => {
        // const name = list?.customer_name?.toLowerCase() || '';
        const orderId = String(list?.order_id || '').toLowerCase();
        const id = String(list?.customer_id || '').toLowerCase();
        const mType = list?.metal_type?.toLowerCase() || '';
        const trType = list?.action_type?.toLowerCase() || '';

        const matchesSearch =
            orderId.includes(searchText.toLowerCase()) ||
            id.includes(searchText.toLowerCase());

        const matchesMetalType =
            !metalType || mType === metalType.toLowerCase();
        const matchesTransactionType =
            !transactionType || trType === transactionType.toLowerCase();

        return matchesSearch && matchesTransactionType && matchesMetalType;
    }) || [];


    const closeSelectedPage = () => {
        setSelectedMetal(null);
        // document.body.style.overflow = 'auto';
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
                            <option value="all" disabled>Select Metal</option>
                            <option value="">All</option>
                            <option value="GOLD">Gold</option>
                            <option value="SILVER">Silver</option>
                        </select>
                    </div>
                    <div className={style2.transaction_type_input}>
                        <select value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)} >
                            <option value="all" disabled>Select Transaction Type</option>
                            <option value="">All</option>
                            <option value="SELL">Sell</option>
                            <option value="BUY">Buy</option>
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
                                    <th>Price/gm</th>
                                    <th>(W.A.C) before Trans.(₹)</th>
                                    <th>Amount(₹)</th>
                                    <th>(W.A.C) After Trans.(₹)</th>
                                    <th>Trans. Type</th>
                                    <th>Remaining Stock Weight</th>
                                    <th>Requested at</th>
                                    {/* <th>Updated at</th> */}
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
                                            <td>{val.price_per_unit}</td>
                                            <td>{val.wac_before}</td>
                                            <td>{val.total_value}</td>
                                            <td>{val.wac_after}</td>
                                            <td>
                                                {capitalizeWord(val.action_type)}
                                            </td>
                                            <td>{Number.parseFloat(val.remaining_stock_weight).toFixed(6)}</td>
                                            <td>{dateAndTimeFormat(val.created_at)}</td>
                                            {/* <td>{dateAndTimeFormat(val.updated_at)}</td> */}
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
                    <div className={style.pagination_parent}>
                        <button onClick={handlePrev} disabled={currentPage === 1 || !prevCursor} >&lt;</button>
                        <span className={style.pagination_parent_pageno}>{currentPage}</span>
                        <button onClick={handleNext} disabled={!nextCursor} >&gt;</button>
                    </div>
                </>
            }
        </div>
        {selectedMetal && <MetalLogsDetails close={closeSelectedPage} selectedMetal={selectedMetal} />}
    </>
}

export default MetalLogs;