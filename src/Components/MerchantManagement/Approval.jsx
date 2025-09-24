import React, { useEffect, useState } from 'react';
import style1 from './Merchants.module.css';
import style from "../Admin/Admin.module.css";
import { IoSearch } from "react-icons/io5";
import { GoEye } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function Approval() {
  const { token } = useContextData();
  const [merchantPendingCreditList, setMerchantPendingCreditList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const getApprovalRequest = () => {
    fetch(`${APIPATH}/api/v1/admin/merchants/credits/requests`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "Application/json"
      },
      method: "GET",
      mode: "cors"
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMerchantPendingCreditList(data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      })
  }
  useEffect(() => {
    getApprovalRequest();
  }, [])

  const filteredList = Array.isArray(merchantPendingCreditList) ? merchantPendingCreditList?.filter((list) => (list.merchant_name || list.id)?.toLowerCase().includes(searchText.toLowerCase())) : [];

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
  const selectedCreditList = (Id) => {
    navigate(`/requested_credits/${Id}`);
  }

  return <div className={style.merchants_parent}>
      <div className={style.merchants_parent_subheader}>
        <div className={style.search_input_field}>
          <input
            type='text'
            placeholder='Search by merchant name'
            maxLength={12}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
          <IoSearch />
        </div>
        <div>
          <p>Pending credits requests</p>
        </div>
        <div>
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
          <div className={style.table_wrapper}>
            <table className={style.merchants_list_container}>
              <thead>
                <tr>
                  <th>Merchant Name</th>
                  {/* <th>Transaction Type</th> */}
                  <th>Payment Method</th>
                  <th>Reference Id</th>
                  <th>Req. Credits</th>
                  <th>Payment Status</th>
                  <th>Approval Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList?.length > 0 ? (
                  paginatedList?.map((val, id) => (
                    <tr key={id} style={{ position: "relative" }}>
                      <td>{val.merchant_name || "Merchants name"}</td>
                      <td>{val.payment_method || "Cash"}</td>
                      <td>{val.payment_reference_id || "1234"}</td>
                      <td>{val.amount || "0"}</td>
                      <td>{val.payment_status || "Pending"}</td>
                      <td>{val.approval_status || "Pending"}</td>
                      <td>
                        <p className={style1.action_button}
                          onClick={() => { selectedCreditList(val.id)}}>
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
          </div>
          {merchantPendingCreditList?.length > rowsPerPage &&
            <div className={style.pagination_parent}>
              <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
              <span className={style.pagination_parent_pageno}>{currentPage}</span>
              <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
            </div>
          }
        </>
      )}
    </div>

 
}

export default Approval;