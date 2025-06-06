import React, { useEffect, useState } from 'react';
import { useContextData } from '../Context/Context';
import styles from './NewHome.module.css'; // Import CSS for stylingfrom 
import style1 from "../Admin/Admin.module.css";
import style2 from "../MerchantManagement/Merchants.module.css"
import { FaUsers, FaMoneyBillWave, FaShoppingCart, FaCoins, FaExchangeAlt } from 'react-icons/fa'; // Import icons
import { APIPATH } from '../apiPath/apipath';
import { useNavigate } from 'react-router-dom';


const NewHome = () => {
    const { token } = useContextData();
    const [report, setReport] = useState(null); // State to store the API response
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState('');
    const [merchant, setMerchant] = useState(null);
    const [selectedmerchant, setSelectedMerchant] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // State to track loading
    const [error, setError] = useState(null); // State to track errors

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                let url = `${APIPATH}/api/v1/admin/dashboard/summary`;
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
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();
                console.log(result);
                if (result.error) {
                    alert(result.error);
                    localStorage.removeItem("token");
                    window.location.reload();
                    return;
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setReport(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedmerchant, startDate, endDate, token]);

    // Merchant List ----------------------------
    useEffect(() => {
        const fetchMerchant = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${APIPATH}/api/v1/admin/merchants/list`, {
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
                console.log(result)
                setMerchant(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMerchant();
    }, [token])

    const navigate = useNavigate();

    return (
        <div className={style1.merchants_parent}>
            <div className={styles.filters}>
                <p>Filters: </p>
                <div>
                    <label htmlFor="Start Date">Start Date: </label>
                    <input type="date" value={startDate}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="End Date">End Date: </label>
                    <input type="date" value={endDate} min={startDate} max={new Date().toISOString().split('T')[0]} disabled={!startDate}
                        onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <select onChange={(e) => setSelectedMerchant(e.target.value)} className={styles.select}>
                    <option value="" disabled>Select Merchant</option>
                    <option value="">All</option>
                    {merchant?.map((merchant) => (
                        <option key={merchant.id} value={merchant.id}>
                            {merchant.merchant_name}
                        </option>
                    ))}
                </select>
            </div>
            {isLoading ? <div className={style2.loader_container}>
                <div className={style2.loader_item}></div></div> :
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <p className={styles.label}>🧑‍💼 Merchant</p>
                        <div className={styles.value_container}
                            onClick={(e) => {
                                const active = "ALL";
                                navigate(`/merchant/Status/${active}`)

                            }}
                        >
                            <h2 className={styles.value}>Total</h2>
                            <h2 className={styles.value}>{report?.merchant_widget?.total || 0}🧑‍🤝‍🧑</h2>
                        </div>
                        <div className={styles.value_container}
                            onClick={(e) => {
                                const active = "ACTIVE";
                                navigate(`/merchant/Status/${active}`)
                            }}
                        >
                            <h2 className={styles.value}>Active</h2>
                            <h2 className={styles.value}>{report?.merchant_widget?.active || 0}🟢</h2>
                        </div>
                        <div className={styles.value_container}
                            onClick={(e) => {
                                const active = "INACTIVE";
                                navigate(`/merchant/Status/${active}`)
                            }}
                        >
                            <h2 className={styles.value}>InActive</h2>
                            <h2 className={styles.value}>{report?.merchant_widget?.inactive || 0}🔴</h2>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <p className={styles.label}>👥 Customer </p>
                        <div className={styles.value_container}
                            onClick={(e) => {
                                const active = "";
                                navigate(`/customer_list`, { state: active })
                            }}
                        >
                            <h2 className={styles.value}>Total</h2>
                            <h2 className={styles.value}>{report?.customer_widget?.total || 0}🧑‍🤝‍🧑</h2>
                        </div>
                        <div className={styles.value_container}
                            onClick={(e) => {
                                const active = "ACTIVE";
                                navigate(`/customer_list`, { state: active })
                            }}
                        >
                            <h2 className={styles.value}>Active</h2>
                            <h2 className={styles.value}>{report?.customer_widget?.active || 0}🟢</h2>
                        </div>
                        <div className={styles.value_container}
                            onClick={(e) => {
                                const active = "INACTIVE";
                                navigate(`/customer_list`, { state: active })
                            }}
                        >
                            <h2 className={styles.value}>InActive</h2>
                            <h2 className={styles.value}>{report?.customer_widget?.inactive || 0}🔴</h2>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <p className={styles.label}>💳 Credits</p>
                        <div className={styles.value_container}
                            onClick={(e) => {
                                navigate(`/approved_credits`)
                            }}
                        >
                            <h2 className={styles.value}>Issued</h2>
                            <h2 className={styles.value}>{report?.credit_widget?.total_issued || 0}</h2>
                        </div>
                        <div className={styles.value_container}
                            onClick={(e) => {
                                navigate(`/credits_transactions`)
                            }}
                        >
                            <h2 className={styles.value}>Consumed</h2>
                            <h2 className={styles.value}>{report?.credit_widget?.total_consumed || 0}</h2>
                        </div>
                        <div className={styles.value_container}
                            onClick={(e) => {
                                navigate(`/requested_credits`)
                            }}
                        >
                            <h2 className={styles.value}>Pending Req.</h2>
                            <h2 className={styles.value}>{report?.credit_widget?.pending_approval || 0}</h2>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <p className={styles.label}>💳 Queries</p>
                        <div className={styles.value_container}
                            onClick={(e) => {
                                navigate(`/raised_tickets`, { state: 'PENDING' })
                            }}
                        >
                            <h2 className={styles.value}>Pending</h2>
                            <h2 className={styles.value}>{report?.queries_widget?.queries_pending || 0}⏳</h2>
                        </div>
                        <div className={styles.value_container}
                            onClick={(e) => {
                                navigate(`/raised_tickets`, { state: 'RESOLVED' })
                            }}
                        >
                            <h2 className={styles.value}>Resolved</h2>
                            <h2 className={styles.value}>{report?.queries_widget?.queries_completed || 0}✅</h2>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <p className={styles.label}>✅ Transaction</p>
                        <table>
                            <tbody>
                                <tr className={styles.row_hover}
                                  onClick={(e) => {
                                        navigate(`/metal_logs`, { state: '' })
                                    }}>
                                    <td><h2 className={styles.value}>Total</h2></td>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.total?.count}</h2></td>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.total?.amount?.toFixed(2) || 0}</h2></td>
                                </tr>
                                <tr className={styles.row_hover}
                                  onClick={(e) => {
                                        navigate(`/metal_logs`, { state: 'SELL' })
                                    }}>
                                    <td><h2 className={styles.value}>Sell</h2></td>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.sell?.count}</h2></td>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.sell?.amount?.toFixed(2) || 0}</h2></td>
                                </tr>
                                <tr className={styles.row_hover}
                                  onClick={(e) => {
                                        navigate(`/metal_logs`, { state: 'BUY' })
                                    }}>
                                    <td><h2 className={styles.value}>Buy</h2></td>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.buy?.count}</h2></td>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.buy?.amount?.toFixed(2) || 0}</h2></td>
                                </tr>
                                <tr className={styles.row_hover}
                                  onClick={(e) => {
                                        navigate(`/metal_logs`, { state: 'TRANSFER' })
                                    }}>
                                    <td><h2 className={styles.value}>Transfer</h2></td>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.transfer?.count}</h2></td>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.transfer?.amount?.toFixed(2) || 0}</h2></td>
                                </tr>
                                <tr className={styles.row_hover}
                                  onClick={(e) => {
                                        navigate(`/metal_logs`, { state: 'CONVERSION' })
                                    }}>
                                    <td><h2 className={styles.value}>Conversion</h2></td>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.conversion?.count}</h2></td>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.conversion?.amount?.toFixed(2) || 0}</h2></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.card}>
                        <p className={styles.label}>🏅 Gold</p>
                        <table>
                            <tbody>
                                <tr className={styles.row_hover}
                                    onClick={(e) => {
                                        navigate(`/gold_transactions`, { state: 'BUY' })
                                    }}
                                >
                                    <td><h2 className={styles.value}>Buy</h2></td>
                                    <td><h2 className={styles.value}>{report?.metal_widget?.gold?.buy_gold_quantity || 0}g</h2></td>
                                    <td><h2 className={styles.value}>{(report?.metal_widget?.gold?.buy_gold_amount || 0)?.toFixed(2)}</h2></td>
                                </tr>
                                <tr className={styles.row_hover}
                                    onClick={(e) => {
                                        navigate(`/gold_transactions`, { state: 'SELL' })
                                    }}
                                >
                                    <td><h2 className={styles.value}>Sell</h2></td>
                                    <td><h2 className={styles.value}>{report?.metal_widget?.gold?.sell_gold_quantity || 0}g</h2></td>
                                    <td><h2 className={styles.value}>{(report?.metal_widget?.gold?.sell_gold_amount || 0)?.toFixed(2)}</h2></td>
                                </tr>
                                <tr className={styles.row_hover}
                                    onClick={(e) => {
                                        navigate(`/gold_transactions`, { state: 'TRANSFER' })
                                    }}
                                >
                                    <td><h2 className={styles.value}>Transfer</h2></td>
                                    <td><h2 className={styles.value}>{report?.metal_widget?.gold?.transfer_gold_quantity || 0}g</h2></td>
                                    <td><h2 className={styles.value}>{(report?.metal_widget?.gold?.transfer_gold_amount || 0)?.toFixed(2)}</h2></td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                    <div className={styles.card}>
                        <p className={styles.label}>🥈 Silver</p>
                        <table>
                            <tbody>
                                <tr className={styles.row_hover}
                                    onClick={(e) => {
                                        navigate(`/silver_transactions`, { state: 'BUY' })
                                    }}
                                >
                                    <td><h2 className={styles.value}>Buy</h2></td>
                                    <td><h2 className={styles.value}>{report?.metal_widget?.silver?.buy_silver_quantity || 0}g</h2></td>
                                    <td><h2 className={styles.value}>{(report?.metal_widget?.silver?.buy_silver_amount || 0)?.toFixed(2)}</h2></td>
                                </tr>
                                <tr className={styles.row_hover}
                                    onClick={(e) => {
                                        navigate(`/silver_transactions`, { state: 'SELL' })
                                    }}
                                >
                                    <td><h2 className={styles.value}>Sell</h2></td>
                                    <td><h2 className={styles.value}>{report?.metal_widget?.silver?.sell_silver_quantity || 0}g</h2></td>
                                    <td><h2 className={styles.value}>{(report?.metal_widget?.silver?.sell_silver_amount || 0)?.toFixed(2)}</h2></td>
                                </tr>
                                <tr className={styles.row_hover}
                                    onClick={(e) => {
                                        navigate(`/silver_transactions`, { state: 'TRANSFER' })
                                    }}>
                                    <td><h2 className={styles.value}>Transfer</h2></td>
                                    <td><h2 className={styles.value}>{report?.metal_widget?.silver?.transfer_silver_quantity || 0}g</h2></td>
                                    <td><h2 className={styles.value}>{(report?.metal_widget?.silver?.transfer_silver_amount || 0)?.toFixed(2)}</h2></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.card} onClick={() => navigate('/silver')}>
                        <p className={styles.label}>🔁 Conversion</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.conversion?.gold_to_silver?.gold_quantity || 0}g🏅</h2></td>
                                    <td><h2 className={styles.value}>➡️</h2></td>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.conversion?.gold_to_silver?.silver_quantity || 0}g🥈</h2></td>
                                </tr>
                                <tr>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.conversion?.silver_to_gold?.silver_quantity || 0}g🥈</h2></td>
                                    <td><h2 className={styles.value}>➡️</h2></td>
                                    <td><h2 className={styles.value}>{report?.transaction_widget?.conversion?.silver_to_gold?.gold_quantity || 0}g🏅</h2></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </div>
    );
};

export default NewHome;