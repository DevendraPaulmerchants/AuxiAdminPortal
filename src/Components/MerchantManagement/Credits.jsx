import React, { useEffect, useState } from 'react';
import style from "../Admin/Admin.module.css";
import style1 from "./Merchants.module.css";
import { GoEye } from "react-icons/go";
import { TbDotsVertical } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import Switch from '@mui/material/Switch';
import AddCredits from './AddCredits';
import Model from "react-modal";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function Credits() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [])


  const { token } = useContextData();
  const [creditList, setCreditList] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [addCreditForm, setAddCreditForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [isCreditMenuOpen, setIsCreditMenuOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const closeCreditMenu = () => {
    setIsCreditMenuOpen(false);
  };

  const fetchCrditList = () => {
    setIsLoading(true);
    fetch(`${APIPATH}/api/v1/admin/merchants/credits`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: 'GET',
      mode: "cors"
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setCreditList(data.data);
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => setIsLoading(false))
  };

  useEffect(() => {
    fetchCrditList();
  }, []);

  const filteredList = creditList && creditList?.filter((list) => (list.merchant_name || list.id)?.toLowerCase().includes(searchText.toLowerCase()))

  const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // const openAddCreditForm = () => {
  //   setAddCreditForm(true);
  // };

  const closeAddCreditForm = () => {
    setAddCreditForm(false);
    // fetchCrditList();
    setSelectedMerchant(null)
  };

  const openCreditMenu = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setIsCreditMenuOpen(true);
  };

  return (
    <>
      <div className={style.merchants_parent}>
        <div className={style.merchants_parent_subheader}>
          <div className={style.search_input_field}>
            <input
              type='text'
              placeholder='Search by merchant'
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
            <p>Approved credits requests</p>
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
            <table className={style.merchants_list_container}>
              <thead>
                <tr>
                  <th>Merchant Name</th>
                  <th>Total Credits</th>
                  <th>Available Credits</th>
                  <th>Used Credits</th>
                  {/* <th>Approval</th> */}
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList?.length > 0 ? (
                  paginatedList?.map((val, id) => (
                    <tr key={id} style={{ position: "relative" }}>
                      <td>{val.merchant_name || "Merchants name"}</td>
                      <td>{val.total_credit || "0"}</td>
                      <td>{val.available_credit || "0"}</td>
                      <td>{val.used_credit || "0"}</td>
                      {/* <td>{val.approval || "Pending"}</td> */}
                      <td>
                        <Switch checked={val.status === "ACTIVE"} />
                      </td>
                      <td>
                        <p
                          style={{ cursor: "pointer", fontSize: "24px" }}
                          onClick={(e) => { openCreditMenu(e); setSelectedMerchant(val.merchant_id) }}
                        >
                          <FaPlus />
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
            {creditList?.length > rowsPerPage &&
              <div className={style.pagination_parent}>
                <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                <span className={style.pagination_parent_pageno}>{currentPage}</span>
                <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
              </div>
            }
          </>
        )}
      </div>

      {isCreditMenuOpen && (
        <Model
          isOpen={isCreditMenuOpen}
          onRequestClose={closeCreditMenu}
          style={{
            overlay: { backgroundColor: 'transparent' },
            content: {
              position: "absolute",
              top: `${modalPosition.top}px`,
              left: `calc(${modalPosition.left}px - 1rem)`,
              boxShadow: "0 0 10px 10px rgba(38, 38, 38, 0.5)",
              height: "fit-content",
              width: "100px",
              padding: "10px",
              borderRadius: "5px",
            }
          }}
        >
          <ul className={style.user_menu_list}>
            <li onClick={() => { setAddCreditForm(true); closeCreditMenu() }}>Add Credits</li>
            {/* <li onClick={()=>{closeCreditMenu();}}>View Details</li> */}
          </ul>
        </Model>
      )}

      {addCreditForm && <AddCredits close={closeAddCreditForm}
        selectedMerchant={selectedMerchant}
        updateList={fetchCrditList}
      />}
    </>
  );
}

export default Credits;
