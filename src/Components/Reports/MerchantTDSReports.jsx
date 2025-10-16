import React, { useEffect, useState } from 'react';
import style from "../Admin/Admin.module.css";
import style1 from '../Transactions/Transaction.module.css';
import styles from "../MerchantManagement/Merchants.module.css";
import { IoSearch } from "react-icons/io5";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { IoMdDownload } from 'react-icons/io';
import { useContextData } from '../Context/Context';
import { FcCancel, FcFlashOn, FcOk, FcSportsMode } from 'react-icons/fc';
import { APIPATH } from '../apiPath/apipath';
import { dateAndTimeFormat } from '../../helperFunction/helper';


function MerchantsTDSReports() {

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

    // Merchant TDS Reports List ------------------------------------
    useEffect(() => {
        if (!token) return;
        console.log("API Count: ",cursors,direction)
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const url = `${APIPATH}/api/v1/admin/reports/merchant-transactions?start_date=${startDate?startDate:''}&end_date=${endDate?endDate:''}&download=false&merchant_id=${selectedMerchant}&direction=${direction}&cursor=${cursors}`;
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

    // ---------- Search Logic -------------------------------------
    const paginatedList = creditsData?.filter((list) => {
        const name = list?.merchant_name?.toLowerCase() || '';
        const id = String(list?.order_id || '').toLowerCase();
        return name.includes(searchText.toLowerCase()) || id.includes(searchText.toLowerCase());
    }) || [];

    // Pagination Logic Next button ------------------------------------
    const handleNext = () => {
        if (nextCursor) {
            setCursors(nextCursor);
            setDirection('next');
            setCurrentPage(prev => prev + 1);
        }
    };

    // Pagination Logic Previous button ------------------------------------
    const handlePrev = () => {
        if (prevCursor && currentPage > 1) {
            setCursors(prevCursor);
            setDirection('prev');
            setCurrentPage(prev => prev - 1);
        }
    };

    //------------- Downaload MerchantTDS Reports ------------------------------------
    const downloadRecords = async () => {
        if (creditsData?.length === 0) {
            alert("No records found to download");
            return;
        }
        try {
            const response = await fetch(`${APIPATH}/api/v1/admin/reports/merchant-transactions?start_date=${startDate}&end_date=${endDate}&download=true&merchant_id=${selectedMerchant}`, {
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
            a.download = 'Merchant-Tds-Report.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading records:", error);
        }
    }

    return <div className={style.merchants_parent}>
            {isloading ? <div className={styles.loader_container}><div className={styles.loader_item}></div></div> :
                <>
                    <div className={style.merchants_parent_subheader}>
                        <div className={style.search_input_field}>
                            <input type='text' placeholder='Search by orderId' maxLength={20} value={searchText}
                                onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                            <IoSearch />
                        </div>
                        <div className={style1.start_date_and_end_date}>
                            {/* <div>
                                <p>Filter:</p>
                            </div> */}
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
                            <IoMdDownload title='Download Records' className={styles.action_button} onClick={downloadRecords} />
                        </div>
                    </div>
                    <div className={style.table_wrapper}>
                        <table className={style.merchants_list_container}>
                            <thead>
                                <tr>
                                    <th>Order Id</th>
                                    <th>Date & Time</th>
                                    <th>Merchant Name</th>
                                    <th>Customer Name</th>
                                    <th>Metal</th>
                                    <th>Txn. Type</th>
                                    <th>Total Amount</th>
                                    <th>Credit Used</th>
                                    <th>Gross Profit</th>
                                    <th>TDS(%)</th>
                                    <th>TDS(Amt.)</th>
                                    <th>Net Profit</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList?.length > 0 ? (
                                    paginatedList?.map((val) => {
                                        return <tr key={val.id}>
                                            <td>XXXX{val.order_id?.slice(-4)}</td>
                                            <td>{dateAndTimeFormat(val.created_at)}</td>
                                            <td>{val.merchant_name}</td>
                                            <td>{val.customer_name}</td>
                                            <td>{val.metal_type}</td>
                                            <td>{val.order_type}</td>
                                            <td>{val.total_amount_after_tax}</td>
                                            <td>{val.total_amount_after_tax}</td>
                                            <td>{parseFloat(val.merchant_profit || 0)?.toFixed(2)}</td>
                                            <td>{parseFloat(val.merchant_tds_percentage || 0).toFixed(2)}</td>
                                            <td>{parseFloat(val.merchant_tds_amount || 0)?.toFixed(2)}</td>
                                            <td>{(parseFloat(val.merchant_profit || 0) - parseFloat(val.merchant_tds_amount || 0))?.toFixed(2)}</td>
                                            <td>
                                                {val.order_status === "COMPLETED" && <FcOk title='Completed' />}
                                                {val.order_status === "PENDING" && <FcFlashOn title='Pending' />}
                                                 {val.order_status === 'PROCESSING' && <FcSportsMode />}
                                                {val.order_status === "FAILED" && <FcCancel title='Failed' />}
                                            </td>
                                            {/* <td><p style={{ cursor: "pointer" }}>
                                            <IoEye />
                                        </p></td> */}
                                        </tr>
                                    })
                                ) : <tr>
                                    <td colSpan="13" style={{ textAlign: "center" }}>No Data Found</td>
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

}

export default MerchantsTDSReports;
