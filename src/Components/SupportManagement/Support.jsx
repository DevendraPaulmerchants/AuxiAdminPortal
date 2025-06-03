import React, { useCallback, useEffect, useState } from 'react';
import style1 from "../MerchantManagement/Merchants.module.css"
import style from "../Admin/Admin.module.css";
import { IoSearch } from "react-icons/io5";
import { GoEye } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function Support() {
  const { token } = useContextData();
  const [supportList, setSupportList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const getSupportRequest = useCallback(() => {
    fetch(`${APIPATH}/api/v1/admin/ticket`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "Application/json"
      },
      method: "GET",
      mode: "cors"
    })
      .then((res) => res.json())
      .then((data) => {
        setSupportList(data.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, [token,startDate,endDate])
  useEffect(() => {
    getSupportRequest();
  }, [getSupportRequest])

  const filteredList = supportList?.filter((list) => list.merchant_name?.toLowerCase().includes(searchText.toLowerCase()));

  const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const navigate = useNavigate();
  const selectedSupportList = (Id) => {
    navigate(`/support/${Id}`);
  }

  return <>
    <div className={style.merchants_parent}>
      <div className={style.merchants_parent_subheader}>
        <div className={style.search_input_field}>
          <input
            type='text'
            placeholder='Search by name or email..'
            maxLength={12}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
          <IoSearch />
        </div>
        <div className={style.date_filter_container}>
          <label>
            Start Date:{" "}
            <input
              type="date"
              value={startDate}
              max={endDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            />
          </label>
          <label style={{ marginLeft: "1rem" }}>
            End Date:{" "}
            <input
              type="date"
              value={endDate}
              disabled={startDate === ""}
              min={startDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
            />
          </label>
        </div>
      </div>
      {isLoading ? (
        <div className={style1.loader_container}>
          <div className={style1.loader_item}>
            <img src='/gold-coin.png' alt='Gold Coin' />
          </div>
        </div>
      ) : (
        <>
          <table className={style.merchants_list_container}>
            <thead>
              <tr>
                <th>Merchant Name</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList?.length > 0 ? (
                paginatedList?.map((val, id) => (
                  <tr key={id} style={{ position: "relative" }}>
                    <td>{val.merchant_name}</td>
                    <td>{val.category}</td>
                    <td style={{ maxWidth: "200px" }}>{val.subject}</td>
                    <td>{val.priority}</td>
                    <td>{val.status}</td>
                    <td>
                      <p style={{ cursor: "pointer", fontSize: "24px" }}
                        onClick={() => { selectedSupportList(val.id); }}
                      >
                        <GoEye />
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>No Data Found</td>
                </tr>
              )}
            </tbody>
          </table>
          {supportList?.length > rowsPerPage &&
            <div className={style.pagination_parent}>
              <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
              <span className={style.pagination_parent_pageno}>{currentPage}</span>
              <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
            </div>
          }
        </>
      )}
    </div>

  </>
}

export default Support;