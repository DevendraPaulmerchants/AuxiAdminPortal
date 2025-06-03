import React, { useEffect, useState } from 'react';
import { IoEye, IoSearch } from "react-icons/io5";
import style from "../Admin/Admin.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import { TbDotsVertical } from 'react-icons/tb';
import Model from "react-modal";
import { APIPATH } from '../apiPath/apipath';
import UpdateMetal from './UpdateMetal';
import { useContextData } from '../Context/Context';

function Metal() {
    const {token}=useContextData();
    const [metalList, setmetalList] = useState(null);
    const [selectedMetal,setSelectedMetal]=useState(null);
    const [isUpdateClick,setIsUpdateClick]=useState(false);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isCreditMenuOpen, setIsCreditMenuOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 15;


    const getmetalLIst = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/storages/metal`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'Application/json'
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setmetalList(data.data);
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    useEffect(() => {
        getmetalLIst()
    }, [])

    const filteredList =metalList?.filter((list) => list.metal_type?.toLowerCase().includes(searchText.toLowerCase()));
    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const openCreditMenu = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setModalPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        setIsCreditMenuOpen(true);
    };
    const closeCreditMenu = () => {
        setIsCreditMenuOpen(false);
      };
    const closeUpdateForm=()=>{
        setSelectedMetal(null);
        setIsUpdateClick(false);
        document.body.style.overflow='auto';
    }  

    return <>
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                <div className={style.search_input_field}>
                    <input type='text' placeholder='Search by metal name...' maxLength={12} value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                    <IoSearch />
                </div>
                <div>
                    <p>Below is the detailed breakdown of metal weights and availability.</p>
                </div>
                <div>

                </div>
            </div>
            {isLoading ? <div className={style1.loader_container}>
                <div className={style1.loader_item}>
                    <img src='/gold-coin.png' alt='Gold Coin' />
                </div>
            </div> :
                <>
                    <table className={style.merchants_list_container}>
                        <thead>
                            <tr>
                                <th>Metal Type</th>
                                <th>Physical wt.(gm)</th>
                                <th>Digital wt.(gm)</th>
                                <th>Available(gm)</th>
                                <th>Vault Provider</th>
                                <th>Location</th>
                                <th>Insured</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedList?.length > 0  ? (
                                paginatedList?.map((val, id) => {
                                    return <tr key={id}>
                                        <td>{val?.metal_type}</td>
                                        <td>{val?.total_physical_weight}</td>
                                        <td>{val?.digital_equivalent_weight}</td>
                                        <td>{val?.available_weight}</td>
                                        <td>{val?.vault_provider}</td>
                                        <td>{val?.storage_location}</td>
                                        <td>{val?.is_active ? <p>✅</p> : <p>❌</p>}</td>
                                        <td>
                                            <p style={{ cursor: "pointer", fontSize: "24px" }}
                                                onClick={(e) => { openCreditMenu(e);setSelectedMetal(val) }}
                                            >
                                                <IoEye />
                                            </p>
                                        </td>
                                    </tr>
                                })
                            ) : <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>No Data Found</td>
                            </tr>
                            }
                        </tbody>
                    </table>
                    {metalList?.length > rowsPerPage &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
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
              left: `calc(${modalPosition.left}px - 2rem)`,
              boxShadow: "0 0 10px 10px rgba(38, 38, 38, 0.5)",
              height: "fit-content",
              width: "100px",
              padding: "10px",
              borderRadius: "5px",
            }
          }}
        >
          <ul className={style.user_menu_list}>
            <li onClick={()=>{closeCreditMenu();setIsUpdateClick(true)}}>Update</li>
            <li onClick={()=>{closeCreditMenu();}}>View Details</li>
          </ul>
        </Model>
      )}
      {isUpdateClick && <UpdateMetal 
      close={closeUpdateForm} 
      selectedMetal={selectedMetal}
      updateList={getmetalLIst} />}
    </>
}

export default Metal;