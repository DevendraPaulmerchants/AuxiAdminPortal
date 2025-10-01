import React, { useEffect } from 'react';
import style from "../MerchantManagement/Merchants.module.css";
import style1 from "./Transaction.module.css";
import { IoMdClose } from "react-icons/io";
import { dateAndTimeFormat } from '../../helperFunction/helper';

function MetalDetails({ close, selectedMetal }) {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        console.log(selectedMetal)
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container}>
                <div className={style.add_merchants_header}>
                    <h2>Metal/Customer Details</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                {/* -------------- Customer Details -------------- */}
                <div className={style1.customer_detail_container}>
                    <h2>Merchant & Customer Details:</h2>
                    <div className={style1.details_container}>
                        <h4 className={style.merchant_name}>Merchant Name:
                            <span>
                                {selectedMetal?.merchant_name}
                            </span>
                        </h4>
                        <h4 className={style.merchant_name}>Customer Name:
                            <span>
                                {selectedMetal?.customer_name}
                            </span>
                        </h4>
                        {selectedMetal?.customer_email &&
                            <h4 className={style.merchant_name}>Customer Email:
                                <span>
                                    {selectedMetal?.customer_email}
                                </span>
                            </h4>
                        }

                        <h4 className={style.merchant_name}>Customer Mobile:
                            <span>
                                {selectedMetal?.customer_phone}
                            </span>
                        </h4>
                        
                    </div>

                </div>
                {/* --------- Merchant Details --------------- */}
                <div className={style1.customer_detail_container}>
                    <h2>Rate Calculation Breakdown:</h2>
                    <div className={style1.details_container}>
                        <div className={style1.new_rate_details}>
                            <div className={style1.rate_value}>
                                <p>Exchange rate(per gram):</p>
                                <p>₹ {parseFloat(selectedMetal?.exchange_rate_per_gram).toFixed(2)}</p>
                            </div>
                            <div className={style1.rate_value}>
                                <p>Applied Margin({selectedMetal?.margin_percentage_exchange_rate}%):</p>
                                <p>₹ {parseFloat(selectedMetal?.margin_amount_exchange_rate).toFixed(2)}</p>
                            </div>
                            <div className={style1.rate_value}>
                                <p>Final Rate(per gram):</p>
                                <p>₹ {parseFloat(selectedMetal?.metal_price_per_gram).toFixed(2)}</p>
                            </div>
                            <div className={style1.rate_value}>
                                <p>Total Weight:</p>
                                <p>{(selectedMetal?.metal_quantity_grams)}g</p>
                            </div>
                        </div>
                        <div className={style1.new_rate_details}>
                            <div className={style1.rate_value}>
                                <p>Subtotal({(selectedMetal?.metal_quantity_grams)}g * {parseFloat(selectedMetal?.metal_price_per_gram).toFixed(2)}):</p>
                                <p>₹ {parseFloat(selectedMetal?.total_amount_before_tax).toFixed(2)}</p>
                            </div>
                            <div className={style1.rate_value}>
                                <p>GST({selectedMetal?.gst}%):</p>
                                <p>₹ {parseFloat(selectedMetal?.gst_amount).toFixed(2)}</p>
                            </div>
                            <div className={style1.rate_value}>
                                <p>Total Amount:</p>
                                <p>₹ {parseFloat(selectedMetal?.total_amount_after_tax).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                </div>
                {/* ------------- Payment Details ---------- */}
                <div className={style1.customer_detail_container}>
                    <h2>Transaction Details:</h2>
                    <div className={style1.details_container}>
                        {selectedMetal?.payment_mode &&
                            <h4 className={style.merchant_name}>Payment Mode:
                                <span>
                                    {selectedMetal?.payment_mode}
                                </span>
                            </h4>
                        }
                        <h4 className={style.merchant_name}>Customer Payment Status:
                            <span>
                                {selectedMetal?.customer_payment_status}
                            </span>
                        </h4>
                        {selectedMetal?.payment_failure_reason !== null &&
                            <h4 className={style.merchant_name}>Payment Failure Reason:
                                <span>
                                    {selectedMetal?.payment_failure_reason}
                                </span>
                            </h4>}
                        {selectedMetal?.customer_payment_reference &&
                            <h4 className={style.merchant_name}>Customer Payment referenceId:
                                <span>
                                    {selectedMetal?.customer_payment_reference}
                                </span>
                            </h4>
                        }
                        {selectedMetal?.merchant_transaction_id &&
                            <h4 className={style.merchant_name}>Merchant Payment referenceId:
                                <span>
                                    {selectedMetal?.merchant_transaction_id}
                                </span>
                            </h4>
                        }
                        {selectedMetal?.pg_transaction_id &&
                            <h4 className={style.merchant_name}>PG Payment referenceId:
                                <span>
                                    {selectedMetal?.pg_transaction_id}
                                </span>
                            </h4>
                        }
                        <h4 className={style.merchant_name}>Requested date:
                            <span>
                                {dateAndTimeFormat(selectedMetal?.created_at)}
                            </span>
                        </h4>
                    </div>
                </div>
                {/* ------------- Platform Details --------- */}
                <div className={style1.customer_detail_container}>
                    <h2>Profit Sharing Breakdown:</h2>
                    <div className={style1.details_container}>
                        <div className={style1.details_container}>
                            <div className={style1.rate_value}>
                                <p>Total Margin Amount:</p>
                                <p>₹ {parseFloat(selectedMetal?.platform_profit).toFixed(2)}</p>
                            </div>
                            <div className={style1.rate_value}>
                                <p>Paul Gold Share:</p>
                                <p>₹ {parseFloat(selectedMetal?.platform_profit - selectedMetal?.merchant_profit).toFixed(2)}</p>
                            </div>
                            <div className={style1.rate_value}>
                                <p>Merchant Share({selectedMetal?.merchant_margin}%):</p>
                                <p>₹ {parseFloat(selectedMetal?.merchant_profit).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MetalDetails; 