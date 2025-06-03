import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import style from "../Admin/Admin.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function Exchange() {
        const {token} = useContextData();
    
    const [exchangeList, setexchangeList] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 15;

    const getexchangeLIst = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/rates/exchange`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'Application/json'
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setexchangeList(data.data);
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    useEffect(() => {
        getexchangeLIst()
    }, [])

    const filteredList = exchangeList && exchangeList?.filter((list) => list.source_name?.toLowerCase().includes(searchText.toLowerCase()));
    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return <>
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                <div className={style.search_input_field}>
                    <input type='text' placeholder='Search by metal name...' maxLength={12} value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                    <IoSearch />
                </div>
                <div>
                    <p>Here is the complete list of metal rates fetched from the official source</p>
                </div>
                <div className={style.add_merchants_and_filter}>
                    <button className={style1.primary_login_btn}
                        onClick={() => getexchangeLIst()}
                    >Refresh</button>
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
                                <th>Metal</th>
                                <th>Source</th>
                                <th>Source URL</th>
                                <th>Purity</th>
                                <th>Unit</th>
                                <th>Rate(INR)/gm</th>
                                <th>Fetched at</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedList ? (
                                paginatedList?.map((val, id) => {
                                    return <tr key={id}>
                                        <td>{val?.commodity}</td>
                                        <td>{val?.source_name}</td>
                                        <td>{val?.source_url}</td>
                                        <td>{val?.purity}</td>
                                        <td>{val?.unit}</td>
                                        <td>{val?.exchange_rate_to_inr.toFixed(2)}</td>
                                        <td>{val?.fetched_at?.split("T")[0]}</td>
                                    </tr>
                                })
                            ) : <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>No Data Found</td>
                            </tr>
                            }
                        </tbody>
                    </table>
                    {exchangeList?.length > rowsPerPage &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
        </div>
    </>
}

export default Exchange;