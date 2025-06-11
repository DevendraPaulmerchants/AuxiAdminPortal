import React, { useState } from 'react'
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
import style from '../Admin/Admin.module.css'
import styles from './Reports.module.css'
import { MdKeyboardBackspace } from 'react-icons/md';
import { BiTransfer } from 'react-icons/bi';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import InvoiceConfirmation from './InvoiceConfirmation';
import { dateAndTimeFormat } from '../../helperFunction/helper';

function ReportsDetails() {
    const { state } = useLocation();
    const [isDownloadClicked, setIsDownloadClicked] = useState(false);
    console.log("state", state);
    const navigate = useNavigate();

    const closeDownloadConfirmation = () => {
        setIsDownloadClicked(false);
    }

    return <>
        <div className={style.merchants_parent}>
            <p className={styles.back_arrow}>
                <MdKeyboardBackspace title='Back to Reports List'
                    onClick={() => {
                        navigate(-1);
                    }}
                />
                <FaRegShareFromSquare title='Download & Share Invoice'
                    onClick={() => {
                        setIsDownloadClicked(true);
                    }}
                />
            </p>
            <div className={styles.reports_details_container}>

                {/* --------- Customer Details ----------------------- */}
                <div className={styles.customer_details}>
                    <h2>Customer Details</h2>
                    <div className={styles.customer_details_container}>
                        <div className={styles.customer_details_row}>
                            <div className={styles.customer_details_label}>Full Name</div>
                            <div className={styles.customer_details_value}>{state?.customer_name}</div>
                        </div>
                        <div className={styles.customer_details_row}>
                            <div className={styles.customer_details_label}>Email</div>
                            <div className={styles.customer_details_value}>{state?.customer_email}</div>
                        </div>
                        <div className={styles.customer_details_row}>
                            <div className={styles.customer_details_label}>Phone Number</div>
                            <div className={styles.customer_details_value}>{state?.customer_phone}</div>
                        </div>
                        <div className={styles.customer_details_row}>
                            <div className={styles.customer_details_label}>Merchant Name</div>
                            <div className={styles.customer_details_value}>{state?.merchant_name}</div>
                        </div>

                    </div>
                </div>
                {/* ------------- Receiver Bank Details ----------------- */}
                {state?.order_type === "TRANSFER" &&
                    <div className={styles.customer_details}>
                        <h2>Receiver Details</h2>
                        <div className={styles.customer_details_container}>
                            <div className={styles.customer_details_row}>
                                <div className={styles.customer_details_label}>Full Name</div>
                                <div className={styles.customer_details_value}>{state?.receiver_name}</div>
                            </div>
                            <div className={styles.customer_details_row}>
                                <div className={styles.customer_details_label}>Email</div>
                                <div className={styles.customer_details_value}>{state?.receiver_email}</div>
                            </div>
                            <div className={styles.customer_details_row}>
                                <div className={styles.customer_details_label}>Phone</div>
                                <div className={styles.customer_details_value}>{state?.receiver_phone}</div>
                            </div>
                        </div>
                    </div>
                }
                {/*-------------- Transaction Details -------------------- */}
                <div className={styles.customer_details}>
                    <h2>Transaction Details</h2>
                    <div className={styles.customer_details_container}>
                        <div className={styles.customer_details_row}>
                            <div className={styles.customer_details_label}>Transaction Id</div>
                            <div className={styles.customer_details_value}>{state?.order_id}</div>
                        </div>
                        <div className={styles.customer_details_row}>
                            <div className={styles.customer_details_label}>Type</div>
                            <div className={styles.customer_details_value}>{state?.order_type}</div>
                        </div>
                        <div className={styles.customer_details_row}>
                            <div className={styles.customer_details_label}>Date & Time</div>
                            <div className={styles.customer_details_value}>{dateAndTimeFormat(state?.created_at)}</div>
                        </div>
                        <div className={styles.customer_details_row}>
                            <div className={styles.customer_details_label}>Payment Mode</div>
                            <div className={styles.customer_details_value}>{state?.payment_mode}</div>
                        </div>
                        <div className={styles.customer_details_row}>
                            <div className={styles.customer_details_label}>Status</div>
                            <div className={styles.customer_details_value}>{state?.order_status}</div>
                        </div>

                    </div>
                </div>
                {/* ---------------- Metal Details -------------- */}
                <div className={styles.customer_details}>
                    <h2>Metal Details</h2>
                    <div className={styles.metal_conversion_container}>
                        <div className={styles.customer_details_container}>
                            <div className={styles.customer_details_row}>
                                <div className={styles.customer_details_label}>Metal</div>
                                <div className={styles.customer_details_value}>{state?.metal_type}</div>
                            </div>
                            <div className={styles.customer_details_row}>
                                <div className={styles.customer_details_label}>Quantity</div>
                                <div className={styles.customer_details_value}>{state?.metal_quantity_grams} gm</div>
                            </div>
                            <div className={styles.customer_details_row}>
                                <div className={styles.customer_details_label}>Current Rate</div>
                                <div className={styles.customer_details_value}>₹ {state?.metal_price_per_gram}/gm</div>
                            </div>
                            <div className={styles.customer_details_row}>
                                <div className={styles.customer_details_label}>Gross Value</div>
                                <div className={styles.customer_details_value}>₹ {parseFloat(state?.sub_total).toFixed(2)}</div>
                            </div>
                        </div>
                        {state?.order_type === "CONVERSION" &&
                            <p>
                                <BiTransfer />
                            </p>
                        }
                        {state?.order_type === "CONVERSION" &&
                            <div className={styles.customer_details_container}>
                                <div className={styles.customer_details_row}>
                                    <div className={styles.customer_details_label}>Metal</div>
                                    <div className={styles.customer_details_value}>{state?.metal_type}</div>
                                </div>
                                <div className={styles.customer_details_row}>
                                    <div className={styles.customer_details_label}>Quantity</div>
                                    <div className={styles.customer_details_value}>{state?.metal_quantity_grams} gm</div>
                                </div>
                                <div className={styles.customer_details_row}>
                                    <div className={styles.customer_details_label}>Current Rate</div>
                                    <div className={styles.customer_details_value}>₹ {state?.metal_price_per_gram}/gm</div>
                                </div>
                                <div className={styles.customer_details_row}>
                                    <div className={styles.customer_details_label}>Gross Value</div>
                                    <div className={styles.customer_details_value}>₹ {parseFloat(state?.sub_total).toFixed(2)}</div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {/* ------------------ Financial Breakdown Container -------- */}
                <div className={styles.customer_details}>
                    <h2>Financial Breakdown</h2>
                    <div className={styles.customer_details_container}>
                        <div className={styles.customer_details_row}>
                            <div className={styles.customer_details_label}>Amount</div>
                            <div className={styles.customer_details_value}>₹ {parseFloat(state?.sub_total).toFixed(2)}</div>
                        </div>
                        <div className={styles.customer_details_row}>
                            <div className={styles.customer_details_label}>GST(%)</div>
                            <div className={styles.customer_details_value}>₹ {parseFloat(state?.gst).toFixed(2)}</div>
                        </div>
                        <div className={styles.customer_details_row}>
                            <div className={styles.customer_details_label}>GST Amount</div>
                            <div className={styles.customer_details_value}>₹ {parseFloat(state?.gst_amount).toFixed(2)}</div>
                        </div>
                        <div className={styles.customer_details_row}>
                            <div className={styles.customer_details_label}>Total Amount(Including GST)</div>
                            <div className={styles.customer_details_value}><b>₹ {parseFloat(state?.total_amount_after_tax).toFixed(2)}</b></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {isDownloadClicked && <InvoiceConfirmation close={closeDownloadConfirmation}
            customerName={state?.customer_name}
            customerEmail={state?.customer_email}
        />}
    </>
}

export default ReportsDetails;