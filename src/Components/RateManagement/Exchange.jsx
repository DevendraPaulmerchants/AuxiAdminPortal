import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import style from "../Admin/Admin.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import { dateAndTimeFormat } from '../../helperFunction/helper';
import AddNewRate from './AddNewRate';
import { MdOutlineAdd, MdRefresh } from 'react-icons/md';

function Exchange() {
    const { token } = useContextData();
    const [exchangeList, setexchangeList] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [addManual, setAddManual] = useState(false);
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
                setexchangeList(data.data || []);
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

    // Ensure exchangeList is always an array for filtering
    const safeExchangeList = Array.isArray(exchangeList) ? exchangeList : [];

    const filteredList = safeExchangeList.filter((list) => list.metalType?.toLowerCase().includes(searchText.toLowerCase()));
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
                {/* <div className={style.search_input_field}>
                    <input type='text' placeholder='Search by metal name...' maxLength={12} value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                    <IoSearch />
                </div> */}
                <div>
                    <p>Metal rates fetched from the official source</p>
                </div>
                <div className={style.add_merchants_and_filter} style={{ width: '350px' }}>
                    <button className={style1.primary_login_btn}
                        onClick={() => {
                            console.log("Add manually");
                            setAddManual(true)
                        }}
                    ><MdOutlineAdd /> Add Manually</button>
                    <button className={style1.primary_login_btn}
                        onClick={() => getexchangeLIst()}
                    ><MdRefresh  />Refresh</button>

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
                                    <th>Source</th>
                                    <th>Source URL</th>
                                    <th>Purity</th>
                                    <th>Unit</th>
                                    <th>Rate(INR)/gm</th>
                                    <th>Fetched at</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList?.length > 0 ? (
                                    paginatedList?.map((val)=>(
                                        <tr key={val.id} >
                                            <td>{val.metalType}</td>
                                            <td>{val.exchangeRate?.source_name}</td>
                                            <td>{val.exchangeRate?.source_url}</td>
                                            <td>{val.exchangeRate?.purity}</td>
                                            <td>{val.exchangeRate?.unit}</td>
                                            <td>{val.exchangeRate?.exchange_rate_to_inr}</td>
                                            {/* <td>{val.exchangeRate?.RateDate} {exchangeList?.RateTime}</td> */}
                                            <td>{dateAndTimeFormat(val.exchangeRate?.fetched_at)}</td>
                                        </tr>
                                    ))
                                    // <>
                                    //     <tr >
                                    //         <td>Gold</td>
                                    //         <td>{exchangeList?.source}</td>
                                    //         <td>{exchangeList?.source_url}</td>
                                    //         <td>{exchangeList?.Purity}</td>
                                    //         <td>gm</td>
                                    //         <td>{exchangeList?.GoldRatePerGram}</td>
                                    //         <td>{exchangeList?.RateDate} {exchangeList?.RateTime}</td>
                                    //         {/* <td>{dateAndTimeFormat(val?.fetched_at)}</td> */}
                                    //     </tr>
                                    //     <tr >
                                    //         <td>Silver</td>
                                    //         <td>{exchangeList?.source}</td>
                                    //         <td>{exchangeList?.source_url}</td>
                                    //         <td>{exchangeList?.Purity}</td>
                                    //         <td>gm</td>
                                    //         <td>{exchangeList?.SilverRatePerGram}</td>
                                    //         <td>{exchangeList?.RateDate} {exchangeList?.RateTime}</td>
                                    //         {/* <td>{dateAndTimeFormat(val?.fetched_at)}</td> */}
                                    //     </tr>
                                    // </>
                                ) : <tr>
                                    <td colSpan="7">No Data Found</td>
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
        {addManual && <AddNewRate close={()=>setAddManual(false)} updateList={getexchangeLIst} />}
    </>
    
}

export default Exchange;