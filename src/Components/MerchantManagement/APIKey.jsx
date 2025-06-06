import React, { useEffect, useState } from 'react';
import style from "../Admin/Admin.module.css";
import style1 from "./Merchants.module.css";
import { GoEye } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { FiRefreshCw } from "react-icons/fi";
import { MdBlock, MdContentCopy, MdDelete } from "react-icons/md";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function APIKey() {
  const { token } = useContextData();
  const [searchText, setSearchText] = useState("");
  const [apiList, setAPILIst] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedKey, setCopiedKey] = useState(null);
  const rowsPerPage = 8;

  const fetchAPILIst = () => {
    setIsLoading(true);
    fetch(`${APIPATH}/api/v1/admin/merchants/api-keys`, {
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
        setAPILIst(data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAPILIst();
  }, []);

  const filteredList = apiList && apiList?.filter((list) => list?.merchant_name?.toLowerCase().includes(searchText.toLowerCase()));

  const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleCopy = (key, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(key).then(() => {
        setCopiedKey(id);
        setTimeout(() => setCopiedKey(null), 2000);
      }).catch(err => {
        console.error('Error copying text: ', err);
      });
    } else {
      console.error('Clipboard API is not supported in this environment.');
      const textArea = document.createElement('textarea');
      textArea.value = key;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedKey(id);
        setTimeout(() => setCopiedKey(null), 2000);
      } catch (err) {
        console.error('Fallback copy failed: ', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <>
      <div className={style.merchants_parent}>
        <div className={style.merchants_parent_subheader}>
          <div className={style.search_input_field}>
            <input
              type='text'
              placeholder='Search by name or email..'
              maxLength={12}
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }}
            />
            <IoSearch />
          </div>
          <div>
            <p>Below is the complete list of approved merchants API Key(Test/Live)</p>
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
                  <th>API Key (Regenerate/Copy/Block)</th>
                  <th>API Secret Key (Regenerate/Copy/Block)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.length > 0 ? (
                  paginatedList?.map((val, id) => (
                    <tr key={id}>
                      <td>{val.merchant_name}</td>
                      <td>
                        <p className={style1.api_key_value_icon}>
                          <span><b>Test: </b>{val.test_api_key?.slice(0, 15) + "..."}</span>
                          <span className={style1.api_key_icon}><FiRefreshCw /></span>
                          <span className={style1.api_key_icon} onClick={() => handleCopy(val.test_api_key, `test-${id}`)}>
                            <MdContentCopy />
                          </span>
                          {copiedKey === `test-${id}` && <span className={style1.copied_message}>Copied!</span>}
                          <span className={`${style1.api_key_icon} ${style1.api_key_block}`}><MdBlock /></span>
                        </p>
                        <p className={style1.api_key_value_icon}>
                          <span><b>Live: </b>{val.live_api_key?.slice(0, 15) + "..."}</span>
                          <span className={style1.api_key_icon}><FiRefreshCw /></span>
                          <span className={style1.api_key_icon} onClick={() => handleCopy(val.live_api_key, `live-${id}`)}>
                            <MdContentCopy />
                          </span>
                          {copiedKey === `live-${id}` && <span className={style1.copied_message}>Copied!</span>}
                          <span className={`${style1.api_key_icon} ${style1.api_key_block}`}><MdBlock /></span>
                        </p>
                      </td>
                      <td>
                        <p className={style1.api_key_value_icon}>
                          <span><b>Test: </b>{val.test_api_secret_key?.slice(0, 15) + "..."}</span>
                          <span className={style1.api_key_icon}><FiRefreshCw /></span>
                          <span className={style1.api_key_icon} onClick={() => handleCopy(val.test_api_secret_key, `test-secret-${id}`)}>
                            <MdContentCopy />
                          </span>
                          {copiedKey === `test-secret-${id}` && <span className={style1.copied_message}>Copied!</span>}
                          <span className={`${style1.api_key_icon} ${style1.api_key_block}`}><MdBlock /></span>
                        </p>
                        <p className={style1.api_key_value_icon}>
                          <span><b>Live: </b>{val.live_api_secret_key?.slice(0, 15) + "..."}</span>
                          <span className={style1.api_key_icon}><FiRefreshCw /></span>
                          <span className={style1.api_key_icon} onClick={() => handleCopy(val.live_api_secret_key, `live-secret-${id}`)}>
                            <MdContentCopy />
                          </span>
                          {copiedKey === `live-secret-${id}` && <span className={style1.copied_message}>Copied!</span>}
                          <span className={`${style1.api_key_icon} ${style1.api_key_block}`}><MdBlock /></span>
                        </p>
                      </td>
                      <td><p style={{ cursor: "pointer", fontSize: "20px" }}><MdDelete /></p></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No Data Found</td>
                  </tr>
                )}
              </tbody>
            </table>
            {apiList?.length > rowsPerPage &&
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
  );
}

export default APIKey;
