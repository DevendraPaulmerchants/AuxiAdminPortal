import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import style from "../Admin/Admin.module.css";
// import style1 from "../Merchants/Merchants.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import AddMarchantMargin from './AddMarchantMargin';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function MerchantMargin() {
    const { token } = useContextData();
    const [merchantMarginList, setmerchantMarginList] = useState(null);
    const [selectedmerchantMargin, setSelectedmerchantMargin] = useState(null);
    const [isNewmerchantMarginClick, setIsNewmerchantMarginClick] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    const getmerchantMarginLIst = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/schemes`, {
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
                setmerchantMarginList(data.data);
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    useEffect(() => {
        getmerchantMarginLIst()
    }, [])

    const filteredList = Array.isArray(merchantMarginList) ? merchantMarginList?.filter((list) => list.name?.toLowerCase().includes(searchText.toLowerCase())) : [];
    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const closeNewmerchantMarginPage = () => {
        setIsNewmerchantMarginClick(false);
        setSelectedmerchantMargin(null);
        document.body.style.overflow = "auto";
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
                    <p>Here is the complete breakdown of metal charges for each merchant</p>
                </div>
                <div className={style.add_merchants_and_filter}>
                    <button className={style1.primary_login_btn}
                        onClick={() => setIsNewmerchantMarginClick(true)}
                    >Add New Scheme</button>
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
                                <th>Scheme Name</th>
                                <th>Gold Margin(%)</th>
                                <th>Silver Margin(%)</th>
                                <th>Platinum Margin(%)</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedList?.length > 0 ? (
                                paginatedList?.map((val, id) => {
                                    return <tr key={id}>
                                        <td>{val.name}</td>
                                        {val.metal_margins?.filter(metal => metal.metal_type === "GOLD").map((metal, id) => (
                                            <td key={id}>
                                                <p>Buy:- {metal?.buy_margin}</p>
                                                <p>Sell:- {metal?.sell_margin}</p>
                                                <p>Transfer:- {metal?.transfer_margin}</p>
                                                <p>Conversion:- {metal?.conversion_margin}</p>
                                            </td>
                                        ))}
                                         {val.metal_margins?.filter(metal => metal.metal_type === "SILVER").map((metal, id) => (
                                            <td key={id}>
                                                <p>Buy:- {metal?.buy_margin}</p>
                                                <p>Sell:- {metal?.sell_margin}</p>
                                                <p>Transfer:- {metal?.transfer_margin}</p>
                                                <p>Conversion:- {metal?.conversion_margin}</p>
                                            </td>
                                        ))}
                                        {val.metal_margins?.filter(metal => metal.metal_type === "PLATINUM").map((metal, id) => (
                                            <td key={id}>
                                                <p>Buy:- {metal?.buy_margin}</p>
                                                <p>Sell:- {metal?.sell_margin}</p>
                                                <p>Transfer:- {metal?.transfer_margin}</p>
                                                <p>Conversion:- {metal?.conversion_margin}</p>
                                            </td>
                                        ))}

                                        <td><p style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setSelectedmerchantMargin(val);
                                                setIsNewmerchantMarginClick(true);
                                            }}
                                        ><MdEdit /></p></td>
                                    </tr>
                                })
                            ) : <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>No Data Found</td>
                            </tr>
                            }
                        </tbody>
                    </table>
                    {merchantMarginList?.length > rowsPerPage &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
        </div>
        {isNewmerchantMarginClick && <AddMarchantMargin
            close={closeNewmerchantMarginPage}
            selectedAccount={selectedmerchantMargin}
            updateList={getmerchantMarginLIst}
        />}
    </>

}

export default MerchantMargin;