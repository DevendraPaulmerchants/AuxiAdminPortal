import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import style from "../Admin/Admin.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import { dateFormat } from '../../helperFunction/helper';

function AuxiRate() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    }, [])
    const { token } = useContextData();
    const [exchangeList, setexchangeList] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 15;

    const getexchangeLIst = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/rates/auxi`, {
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

    const filteredList = Array.isArray(exchangeList)
        ? exchangeList.filter((list) => list.metal_type?.toLowerCase().includes(searchText.toLowerCase()))
        : [];

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
                    <p>Metal rates after applying all charges.</p>
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
                <div className={style.table_wrapper}>
                    <table className={style.merchants_list_container}>
                        <thead>
                            <tr>
                                <th>Metal</th>
                                <th>Unit</th>
                                <th>Original Rate(INR)</th>
                                <th>Buy Rate(INR)</th>
                                <th>Sell Rate(INR)</th>
                                <th>Transfer Rate(INR)</th>
                                <th>Conversion Rate(INR)</th>
                                <th>Updated at</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedList.length > 0 ? (
                                paginatedList?.map((val, id) => {
                                    return <tr key={id}>
                                        <td>{val?.metal_type}</td>
                                        <td>{val?.unit}</td>
                                        <td>{val?.original_rate?.toFixed(2)}</td>
                                        <td>{val?.buy_rate?.toFixed(2)}</td>
                                        <td>{val?.sell_rate?.toFixed(2)}</td>
                                        <td>{val.transfer_rate?.toFixed(2)}</td>
                                        <td>{val?.conversion_rate?.toFixed(2)}</td>
                                        <td>{dateFormat(val?.updated_at)}</td>
                                    </tr>
                                })
                            ) : <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>No Data Found</td>
                            </tr>
                            }
                        </tbody>
                    </table>
                </div>
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

export default AuxiRate;