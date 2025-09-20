import React, { useEffect, useState } from 'react';
import style from "../Admin/Admin.module.css";
import style1 from '../Transactions/Transaction.module.css';
import styles from "../MerchantManagement/Merchants.module.css";
import { IoEye, IoSearch } from "react-icons/io5";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { IoMdDownload } from 'react-icons/io';
import { useContextData } from '../Context/Context';
import { FcCancel, FcFlashOn, FcOk } from 'react-icons/fc';
import { MdContentCopy } from 'react-icons/md';
import { APIPATH } from '../apiPath/apipath';
import { dateAndTimeFormat } from '../../helperFunction/helper';

function CreditsReports() {
    const { token } = useContextData();
    const [creditsData, setCreditsData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [merchantList, setMerchantList] = useState([]);
    const [selectedMerchant, setSelectedMerchant] = useState("");
    const [isloading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [direction, setDirection] = useState('');
    const [cursors, setCursors] = useState('');
    const [nextCursor, setNextCursor] = useState('');
    const [prevCursor, setPrevCursor] = useState('');
    // ---------- Fetching Credit Ledger Data ----------------------------
    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const url = `${APIPATH}/api/v1/admin/reports/credit-ledger?start_date=${startDate}&end_date=${endDate}&download=false&merchant_id=${selectedMerchant}&direction=${direction}&cursor=${cursors}`;
                const res = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'Application/json'
                    },
                    method: 'GET',
                    mode: 'cors'
                });
                const data = await res.json();
                setCreditsData(data.data || []);
                setNextCursor(data.hasNextPage ? data.nextCursor : '');
                setPrevCursor(data.hasPrevPage ? data.prevCursor : '');
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [token, selectedMerchant, startDate, endDate, cursors, direction]);
    // ------------------ Merchant List ------------------
    useEffect(() => {
        const fetchMerchant = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${APIPATH}/api/v1/admin/merchants/list`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log(result)
                setMerchantList(result.data);
            } catch (err) {
                console.error(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMerchant();
    }, [token])
    // ------------------ Search and Pagination Logic ------------------
    const paginatedList = creditsData?.filter((list) => {
        const name = list?.merchant_name?.toLowerCase() || '';
        const id = String(list?.order_id || '').toLowerCase();
        return name.includes(searchText.toLowerCase()) || id.includes(searchText.toLowerCase());
    }) || [];
    // ------------------ Pagination Logic and Next Button ------------------
    const handleNext = () => {
        if (nextCursor) {
            setCursors(nextCursor);
            setDirection('next');
            setCurrentPage(prev => prev + 1);
        }
    };
    // ------------------ Previous Button Logic and Back Button ------------------
    const handlePrev = () => {
        if (prevCursor) {
            setCursors(prevCursor);
            setDirection('prev');
            setCurrentPage(prev => prev - 1);
        }
    };
    // ------------------ Download Records Logic ------------------
    const downloadRecords = async () => {
        if (creditsData?.length === 0) {
            alert("No records found to download");
            return;
        }
        try {
            const response = await fetch(`${APIPATH}/api/v1/admin/reports/credit-ledger?start_date=${startDate}&end_date=${endDate}&download=true&merchant_id=${selectedMerchant}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: "GET",
                mode: "cors"
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'Credit-Report.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading records:", error);
        }
    }

    return <>
        <div className={style.merchants_parent}>
            {isloading ? <div className={styles.loader_container}><div className={styles.loader_item}></div></div> :
                <>
                    <div className={style.merchants_parent_subheader}>
                        <div className={style.search_input_field}>
                            <input type='text' placeholder='Search by Merchant' maxLength={12} value={searchText}
                                onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                            <IoSearch />
                        </div>
                        <div className={style1.start_date_and_end_date}>
                            <div>
                                <p>Filter:</p>
                            </div>
                            <div>
                                <DatePicker className={style1.date_input}
                                    placeholderText='Select start date'
                                    maxDate={new Date()}
                                    selected={startDate}
                                    onChange={(date) => {
                                        setStartDate(date?.toLocaleDateString());
                                    }}
                                />
                            </div>
                            <div>
                                <DatePicker className={style1.date_input}
                                    disabled={!startDate}
                                    minDate={startDate}
                                    maxDate={new Date()}
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date?.toLocaleDateString())}
                                    placeholderText='Select end date' />
                            </div>
                        </div>
                        <div className={style1.transaction_type_input}>
                            <label htmlFor="Merchant"> </label>
                            <select value={selectedMerchant} onChange={(e) => setSelectedMerchant(e.target.value)}>
                                <option value="all" disabled>Select Merchant</option>
                                <option value=''>All</option>
                                {merchantList?.map((merchant, index) => (
                                    <option key={merchant.id} value={merchant.id}>{merchant.merchant_name}</option>))}
                            </select>
                        </div>
                        <div className={style1.transaction_record_download}>
                            <IoMdDownload title='Download Records' onClick={downloadRecords} />
                        </div>
                    </div>
                    <div className={style.table_wrapper}>
                        <table className={style.merchants_list_container}>
                            <thead>
                                <tr>
                                    <th>Txn. Id</th>
                                    <th>Date & Time</th>
                                    <th>Merchant Name</th>
                                    <th>Type</th>
                                    <th>Opening Balance</th>
                                    <th>Amount</th>
                                    <th>Description</th>
                                    <th>Remaining Balance</th>
                                    <th>Status</th>
                                    <th>More</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList?.length > 0 ? (
                                    paginatedList?.map((val, id) => {
                                        return <tr key={id}>
                                            <td>XXXX{val.order_id?.slice(-4)}</td>
                                            <td>{dateAndTimeFormat(val.created_at)}</td>
                                            <td>{val.merchant_name}</td>
                                            <td>{val.transaction_type}</td>
                                            <td>{val.opening_credits}</td>
                                            <td>{val.amount}</td>
                                            <td>{val.description}</td>
                                            <td>{val.remaining_credits}</td>
                                            <td>
                                                {val.status === "COMPLETED" && <FcOk title='Completed' />}
                                                {val.status === "PENDING" && <FcFlashOn title='Pending' />}
                                                {val.status === "FAILED" && <FcCancel title='Failed' />}
                                            </td>
                                            <td><p style={{ cursor: "pointer" }}>
                                                <IoEye />
                                            </p></td>
                                        </tr>
                                    })
                                ) : <tr>
                                    <td colSpan="10" style={{ textAlign: "center" }}>No Data Found</td>
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
    </>
}

export default CreditsReports