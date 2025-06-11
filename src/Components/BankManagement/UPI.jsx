import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import style from "../Admin/Admin.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import { Switch } from '@mui/material';
import AddNewUPI from './AddNewUPI';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import { dateFormat } from '../../helperFunction/helper';

function UPI() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const { token } = useContextData();
    const [UPIList, setUPIList] = useState(null);
    const [selectedUPI, setSelectedUPI] = useState(null);
    const [isNewUPIClick, setIsNewUPIClick] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    const getUPILIst = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/accounts/upis`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setUPIList(data.data);
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    useEffect(() => {
        getUPILIst()
    }, [])

    const filteredList = UPIList && UPIList?.filter((list) => list.account_holder_type?.toLowerCase().includes(searchText.toLowerCase()));
    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const closeNewUPIPage = () => {
        setIsNewUPIClick(false);
        setSelectedUPI(null);
        // getUPILIst();
        document.body.style.overflow = "auto";
    }
    const handlePrimaryAccount = (Id, status) => {
        const confirm = window.confirm("Are You sure to make this Account Primary ?");
        if (!confirm) {
            return;
        }
        setIsLoading(true);
        const Svalue = status === false ? true : false;
        const url = `${APIPATH}/api/v1/admin/accounts/upi?id=${Id}`;
        fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: 'PATCH',
            mode: "cors",
            body: JSON.stringify({ is_primary: Svalue })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                alert(data.message)
                getUPILIst();
            })
            .catch((err) => {
                console.log(err);
            }).finally(() => {
                setIsLoading(false)
            })

    }

    return <>
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                <div className={style.search_input_field}>
                    <input type='text' placeholder='Search by name...' maxLength={12} value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                    <IoSearch />
                </div>
                <div>
                    <p>Below is the complete list of previously added UPI IDs</p>
                </div>
                <div className={style.add_merchants_and_filter}>
                    <button className={style1.primary_login_btn}
                        onClick={() => setIsNewUPIClick(true)}
                    >Add New UPI</button>
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
                                    <th>Holder Type</th>
                                    <th>UPI Id</th>
                                    <th>Mobile</th>
                                    <th>Created At</th>
                                    <th>Primary</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList?.length > 0 ? (
                                    paginatedList?.map((val, id) => {
                                        return <tr key={id}>
                                            <td>{val.account_holder_type}</td>
                                            <td>{val.upi_id}</td>
                                            <td>{val.linked_mobile_number}</td>
                                            <td>{dateFormat(val.created_at)}</td>
                                            <td>
                                                <Switch checked={val?.is_primary}
                                                    onChange={() => {
                                                        handlePrimaryAccount(val.id, val.is_primary)
                                                    }}
                                                />
                                            </td>
                                            <td><p style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    setSelectedUPI(val);
                                                    setIsNewUPIClick(true);
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
                    </div>
                    {UPIList?.length > rowsPerPage &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
        </div>
        {isNewUPIClick && <AddNewUPI
            close={closeNewUPIPage}
            selectedAccount={selectedUPI}
            updateList={getUPILIst}
        />}
    </>
}

export default UPI;