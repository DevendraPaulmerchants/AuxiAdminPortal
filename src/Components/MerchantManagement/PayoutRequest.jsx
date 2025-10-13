import React, { useState, useEffect } from 'react';
import style from "../Admin/Admin.module.css";
import style1 from './Merchants.module.css';
import style2 from '../Transactions/Transaction.module.css'
import { IoMdEye } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import CustomerDetails from './CustomerDetails';
import { Switch } from '@mui/material';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { dateFormat } from '../../helperFunction/helper';
import { MdContentCopy } from 'react-icons/md';
import PayoutForm from './PayoutForm';


function PayoutRequest() {
    const { token } = useContextData();
    const { state } = useLocation();
    const [customer, setCustomer] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [merchantList, setMerchantList] = useState(null);
    const [selectedMerchant, setSelectedMerchant] = useState("");
    const [accountStatus, setAccountStatus] = useState(state || "");
    const [isLoading, setIsLoading] = useState(true);
    const [openDetailPage, setOpenDetailPage] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    // const rowsPerPage = 10;

    const [direction, setDirection] = useState('');
    const [cursors, setCursors] = useState('');
    const [nextCursor, setNextCursor] = useState('');
    const [prevCursor, setPrevCursor] = useState('');

    const fetchCustomers = async () => {
        setIsLoading(true)
        try {
            const url = `${APIPATH}/api/v1/admin/transactions/withdraw-requests?start_date=${startDate?startDate:''}&end_date=${endDate?endDate:''}&direction=${direction}&cursor=${cursors}&limit=null`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: 'GET',
                mode: 'cors'
            });
            const result = await response.json();
            console.log(result.data)
            setCustomer(result.data);
            setNextCursor(result.hasNextPage ? result.nextCursor : '');
            setPrevCursor(result.hasPrevPage ? result.prevCursor : '');
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching customers:", error);
            setCustomer([]);
            setIsLoading(false)
        }

    };

    useEffect(() => {
        fetchCustomers();
    }, [startDate, endDate, selectedMerchant, accountStatus, token, cursors, direction]);

    const handleNext = () => {
        if (nextCursor) {
            setCursors(nextCursor);
            setDirection('next');
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (prevCursor) {
            setCursors(prevCursor);
            setDirection('prev');
            setCurrentPage(prev => prev - 1);
        }
    };

    // Merchant List ----------------------------
    useEffect(() => {
        if (!customer) return;
        const fetchMerchant = async () => {
            try {
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
                console.error("Error fetching merchant list:", err);
            }
        };
        fetchMerchant();
    }, [token])


    const filteredList = customer?.filter((list) => {
        const name = list?.first_name?.toLowerCase() || '';
        const id = String(list?.customer_id || '').toLowerCase();
        return name.includes(searchText.toLowerCase()) || id.includes(searchText.toLowerCase());
    }) || [];


    const openDPage = (val) => {
        setOpenDetailPage(true);
        setSelectedCustomer(val)
    }
    const closeDPage = () => {
        setOpenDetailPage(false);
        setSelectedCustomer(null);
    }
    // ------------ Copy the CustomerId ---------------------------
    const handleCopy = async (text) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                alert('Text copied to clipboard successfully.');
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = text;

                textArea.style.position = 'fixed';
                textArea.style.top = 0;
                textArea.style.left = 0;
                textArea.style.opacity = 0;

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                if (successful) {
                    alert('Text copied to clipboard successfully.');
                } else {
                    throw new Error('Fallback copy command was unsuccessful.');
                }

                document.body.removeChild(textArea);
            }
        } catch (err) {
            console.error('Error copying text: ', err);
        }
    };
    // -------------- Change the Account status of the Customer ---------------
    const changeStatusOfCustomer = (id, status) => {
        const accStatus = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        fetch(`${APIPATH}/api/v1/admin/merchants/customers/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            method: 'PATCH',
            body: JSON.stringify({ account_status: accStatus }),
            mode: 'cors'
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                fetchCustomers();
            })
    }

    return (
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                <div className={style.search_input_field}>
                    <input
                        type="text"
                        placeholder="Search by customerId"
                        maxLength={12}
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
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
                <div className={style.date_filter_container}>
                    <select onChange={(e) => setSelectedMerchant(e.target.value)} className={style.select_input} value={selectedMerchant}>
                        <option value="all" disabled>Select Merchant</option>
                        <option value="">All</option>
                        {merchantList?.map((merchant) => (
                            <option key={merchant.id} value={merchant.id}>
                                {merchant.merchant_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={style.date_filter_container}>
                    <select value={accountStatus} onChange={(e) => setAccountStatus(e.target.value)} className={style.select_input}>
                        <option value="all" disabled>Select A/C Status</option>
                        <option value="">All</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>
            </div>
            {isLoading ? <div className={style1.loader_container}>
                <div className={style1.loader_item}></div></div> :
                <>
                    <div className={style.table_wrapper}>
                        <table className={style.merchants_list_container}>
                            <thead>
                                <tr>
                                    <th>Order Id</th>
                                    <th>Customer Id</th>
                                    <th>Acc No./UPI</th>
                                    <th>IFSC</th>
                                    <th>Create At</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>More</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredList.length > 0 ? (
                                    filteredList.map((val) => (
                                        <tr key={val.id}>
                                            <td>XXXX{(val.order_id).slice(-4)}<MdContentCopy
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleCopy(val.order_id)}
                                                title="Copy Customer Id"
                                            /></td>
                                            <td>{(val.customer_id || val.id)}</td>
                                            <td>{val.account_number || val.upi}</td>
                                            <td>{val.ifsc_code}</td>
                                            <td>{dateFormat(val.created_at)}</td>
                                            <td>{val.amount}</td>
                                            <td>{val.status}</td>
                                            {/* <td>
                                                <Switch checked={val.account_status === 'ACTIVE'}
                                                    onClick={() => changeStatusOfCustomer(val.customer_id, val.account_status)}
                                                />
                                            </td> */}
                                            <td>
                                                <button className={style1.action_button}
                                                    onClick={() => {
                                                        openDPage(val);
                                                    }}
                                                >
                                                    <IoMdEye />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: "center" }}>
                                            No Data Found
                                        </td>
                                    </tr>
                                )}
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
            {openDetailPage && <PayoutForm close={closeDPage} selectedCustomer={selectedCustomer} />}
        </div>
    );
}

export default PayoutRequest;
