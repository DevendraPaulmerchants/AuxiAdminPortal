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
import { APIPATH } from '../apiPath/apipath';
import { useNavigate } from 'react-router-dom';
import { dateAndTimeFormat } from '../../helperFunction/helper';

function CustomerReports() {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [])

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
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const url = `${APIPATH}/api/v1/admin/reports/customer-transactions?start_date=${startDate}&end_date=${endDate}&download=false&merchant_id=${selectedMerchant}`;
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
    const name = list?.customer_name?.toLowerCase() || '';
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
      const response = await fetch(`${APIPATH}/api/v1/admin/reports/customer-transactions?start_date=${startDate}&end_date=${endDate}&download=true&merchant_id=${selectedMerchant}`, {
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
      a.download = 'Customer-Report.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading records:", error);
    }
  }
  // ------------- More Details Logic ------------------------------------
  const navigate = useNavigate();
  const handleMoreDetails = (order) => {
    navigate(`/customer-reports/details`, { state: order });
  }

  return <>
    <div className={style.merchants_parent}>
      {isloading ? <div className={styles.loader_container}><div className={styles.loader_item}></div></div> :
        <>
          <div className={style.merchants_parent_subheader}>
            <div className={style.search_input_field}>
              <input type='text' placeholder='Search by customer' maxLength={12} value={searchText}
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
                  <th>Customer Name</th>
                  <th>Merchant Name</th>
                  <th>Txn. Type</th>
                  <th>Metal</th>
                  <th>Metal Qnt.</th>
                  <th>Rate(/gm)</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Status</th>
                  <th>more</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList?.length > 0 ? (
                  paginatedList?.map((val, id) => {
                    return <tr key={id}>
                      <td>XXXX{val.order_id?.slice(-4)}</td>
                      <td>{dateAndTimeFormat(val.created_at)}</td>
                      <td>{val.customer_name}</td>
                      <td>{val.merchant_name}</td>
                      <td>{val.order_type}</td>
                      <td>{val.metal_type}</td>
                      <td>{val.metal_quantity_grams}</td>
                      <td>{val.metal_price_per_gram}</td>
                      <td>{parseFloat(val.total_amount_after_tax || 0)?.toFixed(2)}</td>
                      <td>{val.customer_payment_status}</td>
                      <td>
                        {val.order_status === "COMPLETED" && <FcOk title='Completed' />}
                        {val.order_status === "PENDING" && <FcFlashOn title='Pending' />}
                        {val.order_status === "FAILED" && <FcCancel title='Failed' />}
                      </td>
                      <td><p style={{ cursor: "pointer" }}>
                        <IoEye onClick={() => handleMoreDetails(val)} />
                      </p></td>
                    </tr>
                  })
                ) : <tr>
                  <td colSpan="12" style={{ textAlign: "center" }}>No Data Found</td>
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

export default CustomerReports;