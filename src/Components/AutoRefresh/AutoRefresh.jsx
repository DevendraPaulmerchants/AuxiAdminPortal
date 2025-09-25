import React, { useEffect, useState } from 'react';
import style from "../Admin/Admin.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import { IoSearch } from "react-icons/io5";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import { MdEdit } from 'react-icons/md';
import AddNewRefreshKey from './AddNewRefreshKey';
import { dateAndTimeFormat, dateFormat } from '../../helperFunction/helper';

function AutoRefreshList() {

    const { token } = useContextData();
    const [searchText, setSearchText] = useState("");
    const [merchantList, setMerchantList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    const [isAddMerchnatsClick, setIsMerchantsClick] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const fetchAutoRefreshList = () => {
        setIsLoading(true)
        fetch(`${APIPATH}/api/v1/admin/environment`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: 'GET',
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                setMerchantList(data.data);
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)
            })
    }

    useEffect(() => {
        fetchAutoRefreshList();
    }, [])

    const openAddMerchantsForm = () => {
        setIsMerchantsClick(true);
    }

    const closeAddMerchantsForm = () => {
        setIsMerchantsClick(false);
        setSelectedRow(null)
    }

    const filteredList = Array.isArray(merchantList) ? merchantList?.filter((list) => list.type?.toLowerCase().includes(searchText.toLowerCase())) : [];
    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <>
            <div className={style.merchants_parent}>
                <div className={style.merchants_parent_subheader}>
                    <div className={style.search_input_field}>
                        <input
                            type='text'
                            placeholder='Search by name..'
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
                        <p>Added environment settings</p>
                    </div>
                    <div className={style.add_merchants_and_filter}>
                        <button onClick={openAddMerchantsForm} className={style1.primary_login_btn}>Add New Scheduler</button>
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
                                        <th>Setting Name</th>
                                        <th>Interval Value</th>
                                        <th>Time Unit</th>
                                        <th>Description</th>
                                        <th>Last Updated</th>
                                        <th>Updated By</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className={style1.full_width_tbody}>
                                    {paginatedList?.length > 0 ? (
                                        paginatedList.map((val, id) => (
                                            <tr key={id} className={style1.full_width_row}>
                                                <td>{val.key}</td>
                                                <td>
                                                    {val?.value}
                                                </td>
                                                <td>
                                                    {val?.time_unit}
                                                </td>
                                                <td>
                                                    {val?.description}
                                                </td>
                                                <td>{dateFormat(val?.updated_at)}</td>
                                                <td>{val?.updated_by}</td>
                                                <td>
                                                    <p className={style1.action_button}
                                                        onClick={() => setSelectedRow(val)}
                                                    >
                                                        <MdEdit  />
                                                    </p>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className={style1.no_data_text}>No Data Found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {merchantList?.length > rowsPerPage && (
                            <div className={style.pagination_parent}>
                                <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                                <span className={style.pagination_parent_pageno}>{currentPage}</span>
                                <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {isAddMerchnatsClick && (
                <AddNewRefreshKey
                    close={closeAddMerchantsForm}
                    updateList={fetchAutoRefreshList}
                />
            )}
            {selectedRow && (
                <AddNewRefreshKey
                    close={closeAddMerchantsForm}
                    selectedRow={selectedRow}
                    updateList={fetchAutoRefreshList}
                />
            )}
        </>
    );
}

export default AutoRefreshList;
