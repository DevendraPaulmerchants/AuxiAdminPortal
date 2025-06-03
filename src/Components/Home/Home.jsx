import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import style1 from "../Admin/Admin.module.css";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

const Home = () => {
  const { token } = useContextData();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [merchant, setMerchant] = useState(null);
  const [selectedmerchant, setSelectedMerchant] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
  
        // Construct the URL dynamically based on the filters
        let url = `${APIPATH}/api/v1/admin/dashboard`;
        const queryParams = [];
  
        if (selectedmerchant) {
          queryParams.push(`merchant_id=${selectedmerchant}`);
        }
        if (startDate) {
          queryParams.push(`start_date=${startDate}`);
        }
        if (endDate) {
          queryParams.push(`end_date=${endDate}`);
        }
  
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
  
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Replace with your token
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        console.log(result);
        setData(result.data); // Adjust based on the API response structure
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [selectedmerchant, startDate, endDate]); // Dependency array includes selectedmerchant, startDate, and endDate
  // Merchant List ----------------------------
  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${APIPATH}/api/v1/admin/merchant/list`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // Assuming the API returns an array of data
        console.log(result)
        setMerchant(result.data); // Adjust based on the API response structure
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMerchant();
  }, [])

  return (
    <div className={style1.merchants_parent}>
      <div className={styles.container}>
        <div className={styles.filters}>
          <input type="date" value={startDate} 
          // min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} min={startDate} disabled={!startDate}
            onChange={(e) => setEndDate(e.target.value)} />
          <select onChange={(e) => setSelectedMerchant(e.target.value)} className={styles.select}>
            <option value="">All Merchants</option>
            {merchant?.map((merchant) => (
              <option key={merchant.merchant_id} value={merchant.merchant_id}>
                {merchant.merchant_name}
              </option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className={styles.grid}>
            <div className={styles.card}>
              <p className={styles.label}>Total Revenue</p>
              <h2 className={styles.value}>{data?.revenue?.toFixed(2) || 0}</h2>
            </div>
            <div className={styles.card}>
              <p className={styles.label}>Total Credit Issued</p>
              <h2 className={styles.value}>{data?.credits_issued || 0}</h2>
            </div>
            <div className={styles.card}>
              <p className={styles.label}>Total Credit Consumed</p>
              <h2 className={styles.value}>{data?.credits_consumed || 0}</h2>
            </div>
            <div className={styles.card}>
              <p className={styles.label}>Total Transactions</p>
              <h2 className={styles.value}>{data?.total_txns || 0}</h2>
            </div>
            <div className={styles.card}>
              <p className={styles.label}>Buy Transactions</p>
              <h2 className={styles.value}>{data?.buy_txns || 0}</h2>
            </div>
            <div className={styles.card}>
              <p className={styles.label}>Sell Transactions</p>
              <h2 className={styles.value}>{data?.sell_txns || 0}</h2>
            </div>
            <div className={styles.card}>
              <p className={styles.label}>Transfer Transactions</p>
              <h2 className={styles.value}>{data?.transfer_txns || 0}</h2>
            </div>
            <div className={styles.card}>
              <p className={styles.label}>Convert Transactions</p>
              <h2 className={styles.value}>{data?.convert_txns || 0}</h2>
            </div>
            <div className={styles.card}>
              <p className={styles.label}>New Merchants</p>
              <h2 className={styles.value}>{data?.new_merchant || 0}</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;