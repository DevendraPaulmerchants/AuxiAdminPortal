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


function CustomerList() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }, [])

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

    const rowsPerPage = 8;

    const fetchCustomers = async () => {
        setIsLoading(true)
        try {
            const url = `${APIPATH}/api/v1/admin/merchants/customers?merchant_id=${selectedMerchant}&account_status=${accountStatus}&start_date=${startDate}&end_date=${endDate}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method:'GET',
                mode:'cors'
            });
            const result = await response.json();
            setCustomer(result.data);
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching customers:", error);
            setCustomer([]);
            setIsLoading(false)
        }

    };

    useEffect(() => {
        fetchCustomers();
    }, [startDate, endDate, selectedMerchant, accountStatus, token]);

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

    const filteredList = Array.isArray(customer)
        ? customer.filter((list) =>
            list.first_name?.toLowerCase().includes(searchText.toLowerCase())
        )
        : [];

    const totalPages = Math.ceil(filteredList.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const [openDetailPage, setOpenDetailPage] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    
    const openDPage = (val) => {
        setOpenDetailPage(true);
        setSelectedCustomer(val)
    }
    const closeDPage = () => {
        setOpenDetailPage(false);
        setSelectedCustomer(null);
    }

    return (
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                <div className={style.search_input_field}>
                    <input
                        type="text"
                        placeholder="Search by customer name.."
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
                                    <th>Customer Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Merchant Name</th>
                                    <th>Create At</th>
                                    <th>KYC Status</th>
                                    <th>A/C Status</th>
                                    <th>More</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList.length > 0 ? (
                                    paginatedList.map((val, id) => (
                                        <tr key={id}>
                                            <td>{val.full_name || val.first_name}</td>
                                            <td>{val.email}</td>
                                            <td>{val.phone}</td>
                                            <td>{val.merchant_name}</td>
                                            <td>{dateFormat(val.created_at)}</td>
                                            <td>{val.kyc_status}</td>
                                            <td>
                                                <Switch checked={val.account_status === 'ACTIVE'} />
                                            </td>
                                            <td>
                                                <p style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        openDPage(val);
                                                    }}
                                                >
                                                    <IoMdEye />
                                                </p>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center" }}>
                                            No Data Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {paginatedList.length > 0 &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>
                                &lt;
                            </button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>
                                &gt;
                            </button>
                        </div>
                    }
                </>
            }
            {openDetailPage && <CustomerDetails close={closeDPage} selectedCustomer={selectedCustomer} />}
        </div>
    );
}

export default CustomerList;
