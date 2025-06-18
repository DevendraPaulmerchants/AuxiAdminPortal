import React, { useEffect, useState } from 'react';
import style from "../Admin/Admin.module.css";
import style1 from "./Transaction.module.css";
import styles from "../MerchantManagement/Merchants.module.css";
import { IoSearch } from "react-icons/io5";
import { APIPATH } from '../apiPath/apipath';
import MetalDetails from './MetalDetails';
import { useContextData } from '../Context/Context';
import { MdContentCopy } from 'react-icons/md';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdDownload } from 'react-icons/io';
import { FcCancel, FcClock, FcOk } from 'react-icons/fc';
import { dateAndTimeFormat } from '../../helperFunction/helper';
import { useLocation } from 'react-router-dom';

function CreditTransaction() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [])

  const { token } = useContextData();
  const {state}=useLocation();
  console.log(state);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isloading, setIsLoading] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [openMetalPage, setOpenMetalPage] = useState(false);
  const [pagesData, setPagesData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [direction, setDirection] = useState("");
  const [transactionType, setTransactionType] = useState(state || "");
  const [cursors, setCursors] = useState('');
  const [nextCursor, setNextCursor] = useState('');
  const [prevCursor, setPrevCursor] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const url = `${APIPATH}/api/v1/admin/transactions/credit?order_type=${transactionType}&start_date=${startDate ? startDate : ''}&end_date=${endDate ? endDate : ''}&direction=${direction ? direction : ''}&cursor=${cursors ? cursors : ''}&download=false`;
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
  }, [token, transactionType, startDate, endDate, direction, cursors]);

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

  const paginatedList = pagesData?.filter((list) =>
    list?.merchant_name?.toLowerCase().includes(searchText.toLowerCase()) &&
  (transactionType === "" || list?.transaction_type === transactionType)
  ) || [];


  const closeDetailsPage = () => {
    setOpenMetalPage(false);
    setSelectedMetal(null);
  }

  const handleCopy = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // Modern approach using Clipboard API
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
          alert('Text copied to clipboard successfully');
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
      const response = await fetch(`${APIPATH}/api/v1/admin/transactions/credit?start_date=${startDate ? startDate : ''}&end_date=${endDate ? endDate : ''}&direction=${direction ? direction : ''}&cursor=${cursors ? cursors : ''}&download=true`, {
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

      <div className={style.merchants_parent_subheader}>
        <div className={style.search_input_field}>
          <input type='text' placeholder='Search by merchant name' maxLength={12} value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
          <IoSearch />
        </div>
        <div className={style1.start_date_and_end_date}>
          <div>
            <p>Filter :</p>
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
          {/* <label htmlFor="Transaction Type">Order Type: </label> */}
          <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
            <option value="all" disabled>Select Order Type</option>
            <option value="">All</option>
            <option value="DEBIT">Debit</option>
            <option value="CREDIT">Credit</option>
          </select>
        </div>
        <div className={style1.transaction_record_download}>
          <IoMdDownload title='Download Records' onClick={downloadRecords} />
        </div>
      </div>
      {isloading ? <div className={styles.loader_container}><div className={styles.loader_item}></div></div> :
        <>
          <div className={style.table_wrapper}>
            <table className={style.merchants_list_container}>
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>Merchnat Name</th>
                  <th>Amount</th>
                  <th>Remaining Credits</th>
                  <th>Description</th>
                  <th>Order type</th>
                  <th>Created at</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList?.length > 0 ? (
                  paginatedList?.map((val, id) => {
                    return <tr key={id}>
                      <td>XXXX{val.id?.slice(-4)}
                        <MdContentCopy
                          style={{ cursor: "pointer" }}
                          onClick={() => handleCopy(val.id)}
                          title="Copy ID"
                        />
                      </td>
                      <td>{val.merchant_name}</td>
                      <td>{parseFloat(val.amount)}</td>
                      <td>{parseFloat(val.remaining_credits)}</td>
                      <td>{val.description}</td>
                      <td>{val.transaction_type}</td>
                      <td>{dateAndTimeFormat(val.created_at)}</td>
                      <td>
                        {val.status === "COMPLETED" && <FcOk title='Completed' />}
                        {val.status === "PENDING" && <FcClock title='Pending' />}
                        {val.status === "FAILED" && <FcCancel title='Failed' />}
                      </td>
                    </tr>
                  })
                ) : <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>No Data Found</td>
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

    {openMetalPage && <MetalDetails selectedMetal={selectedMetal} close={closeDetailsPage} />}
  </>
}

export default CreditTransaction;
