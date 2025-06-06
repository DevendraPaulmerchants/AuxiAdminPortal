import React, { useEffect, useState } from 'react';
import style from "../Admin/Admin.module.css";
import style1 from "./Transaction.module.css";
import styles from "../MerchantManagement/Merchants.module.css";
import { IoEye, IoSearch } from "react-icons/io5";
import { APIPATH } from '../apiPath/apipath';
import MetalDetails from './MetalDetails';
import { useContextData } from '../Context/Context';
import { MdContentCopy } from 'react-icons/md';
import { FcCancel, FcFlashOn, FcOk } from "react-icons/fc";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdDownload } from "react-icons/io";
import { useLocation } from 'react-router-dom';

function GoldTransaction() {
  const { token } = useContextData();
  const { state } = useLocation();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsLoading] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [openMetalPage, setOpenMetalPage] = useState();
  const [pagesData, setPagesData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionType, setTransactionType] = useState(state || "");
  const [direction, setDirection] = useState('');
  const [cursors, setCursors] = useState('');
  const [nextCursor, setNextCursor] = useState('');
  const [prevCursor, setPrevCursor] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const url = `${APIPATH}/api/v1/admin/transactions/metal?order_type=${transactionType}&metal_type=GOLD&start_date=${startDate}&end_date=${endDate}&direction=${direction}&cursor=${cursors}&download=false`;
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
  }, [token, transactionType, startDate, endDate, cursors, direction]);

  useEffect(() => {
    setCursors('');
    setDirection('');
    setCurrentPage(1);
  }, [transactionType, startDate, endDate]);

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

  const paginatedList = pagesData?.filter((list) => {
    const name = list?.customer_name?.toLowerCase() || '';
    const id = String(list?.customer_id || '').toLowerCase();
    return name.includes(searchText.toLowerCase()) || id.includes(searchText.toLowerCase());
  }) || [];


  const closeDetailsPage = () => {
    setOpenMetalPage(false);
    setSelectedMetal(null);
    document.body.style.overflow = "auto";
  }

 const handleCopy = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      alert('Text copied to clipboard successfully.');
    } else {
      // Fallback for insecure contexts or older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;

      // Avoid scrolling to bottom
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


  const downloadRecords = async () => {
    if (paginatedList?.length === 0) {
      alert("No records to download");
      return;
    }
    try {
      const response = await fetch(`${APIPATH}/api/v1/admin/transactions/metal
        ?order_type=${transactionType}
        &metal_type=GOLD&start_date=${startDate ? startDate : ''}
        &end_date=${endDate ? endDate : ''}&download=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        method: 'GET',
        mode: 'cors'
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'metal-transactions.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading records:", error);
    }
  };

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
                <p>Filter by date:</p>
              </div>
              <div>
                <DatePicker className={style1.date_input}
                  placeholderText='Select start date'
                  maxDate={new Date()}
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date?.toISOString()?.split("T")[0]);
                  }}
                />
              </div>
              <div>
                <DatePicker className={style1.date_input}
                  disabled={!startDate}
                  minDate={startDate}
                  maxDate={new Date()}
                  selected={endDate}
                  onChange={(date) => setEndDate(date?.toISOString()?.split("T")[0])}
                  placeholderText='Select end date' />
              </div>
            </div>
            <div className={style1.transaction_type_input}>
              <label htmlFor="Order Type">Order Type: </label>
              <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                <option value="all" disabled>Select Order Type</option>
                <option value="">All</option>
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
                <option value="TRANSFER">Transfer</option>
                <option value="CONVERSION">Conversion</option>
              </select>
            </div>
            <div className={style1.transaction_record_download}>
              <IoMdDownload title='Download Records' onClick={downloadRecords} />
            </div>
          </div>
          <table className={style.merchants_list_container}>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Customer Id</th>
                <th>Customer Name</th>
                <th>Metal Quantity(gm)</th>
                <th>Order Type</th>
                <th>Created at</th>
                <th>Total Price</th>
                <th>Order Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList?.length > 0 ? (
                paginatedList?.map((val, id) => {
                  return <tr key={id}>
                    <td>XXXX{val.id?.slice(-4)}<MdContentCopy
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCopy(val.id)}
                      title="Copy ID"
                    /></td>
                    <td>XXXX{val.customer_id?.slice(-4)}</td>
                    <td>{val.customer_name}</td>
                    <td>{parseFloat(val.metal_quantity_grams)}</td>
                    <td>{val.order_type}</td>
                    <td>{`${val.created_at?.split("T")[0]} ${val.created_at?.split("T")[1]?.split(".")[0]}`}</td>
                    <td>{parseFloat(val.total_amount_after_tax)?.toFixed(2)}</td>
                    <td>
                      {val.order_status === "COMPLETED" && <FcOk title='Completed' />}
                      {val.order_status === "PENDING" && <FcFlashOn title='Pending' />}
                      {val.order_status === "FAILED" && <FcCancel title='Failed' />}
                    </td>
                    <td><p style={{ cursor: "pointer" }}>
                      <IoEye onClick={() => { setSelectedMetal(val); setOpenMetalPage(true) }} />
                    </p></td>
                  </tr>
                })
              ) : <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>No Data Found</td>
              </tr>
              }
            </tbody>
          </table>
          <div className={style.pagination_parent}>
            <button onClick={handlePrev} disabled={!prevCursor} >&lt;</button>
            <span className={style.pagination_parent_pageno}>{currentPage}</span>
            <button onClick={handleNext} disabled={!nextCursor} >&gt;</button>
          </div>

        </>
      }
    </div>

    {openMetalPage && <MetalDetails selectedMetal={selectedMetal} close={closeDetailsPage} />}
  </>
}

export default GoldTransaction;
