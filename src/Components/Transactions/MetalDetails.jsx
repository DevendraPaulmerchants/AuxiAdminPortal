import React, { useEffect } from 'react';
import style from "../MerchantManagement/Merchants.module.css";
import style1 from "./Transaction.module.css";
import { IoMdClose } from "react-icons/io";
import { dateAndTimeFormat } from '../../helperFunction/helper';

function MetalDetails({ close, selectedMetal }) {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container}>
                <div className={style.add_merchants_header}>
                    <h2>Metal/Customer Details</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                {/* -------------- Customer Details -------------- */}
                <div className={style1.customer_detail_container}>
                    <h2>Customer Details:</h2>
                    <div className={style1.details_container}>
                        <h4 className={style.merchant_name}>Name:
                            <span>
                                {selectedMetal?.customer_name}
                            </span>
                        </h4>

                        <h4 className={style.merchant_name}>Email:
                            <span>
                                {selectedMetal?.customer_email}
                            </span>
                        </h4>

                        <h4 className={style.merchant_name}>Mobile:
                            <span>
                                {selectedMetal?.customer_phone}
                            </span>
                        </h4>
                    </div>

                </div>
                {/* --------- Merchant Details --------------- */}
                <div className={style1.customer_detail_container}>
                    <h2>Merchant Details:</h2>
                    <div className={style1.details_container}>
                        <h4 className={style.merchant_name}>Name:
                            <span>
                                {selectedMetal?.merchant_name}
                            </span>
                        </h4>

                        <h4 className={style.merchant_name}>Price/gm:
                            <span>
                                {parseFloat(selectedMetal?.metal_price_per_gram).toFixed(2)}
                            </span>
                        </h4>

                        <h4 className={style.merchant_name}>Quantity (in gm):
                            <span>
                                {parseFloat(selectedMetal?.metal_quantity_grams).toFixed(2)}
                            </span>
                        </h4>

                        <h4 className={style.merchant_name}>Profit Margin(%):
                            <span>
                                {parseFloat(selectedMetal?.merchant_margin).toFixed(2)}
                            </span>
                        </h4>

                        <h4 className={style.merchant_name}>Profit Amount:
                            <span>
                                {parseFloat(selectedMetal?.merchant_profit).toFixed(2)}
                            </span>
                        </h4>
                    </div>

                </div>
                {/* ------------- Payment Details ---------- */}
                <div className={style1.customer_detail_container}>
                    <h2>Payment Details:</h2>
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
                    <h2>Services Charges:</h2>
                    <div className={style1.details_container}>
                        <h4 className={style.merchant_name}>Platform fee:
                            <span>
                                {parseFloat(selectedMetal?.platform_charge_fee).toFixed(2)}
                            </span>
                        </h4>
                        <h4 className={style.merchant_name}>GST(%):
                            <span>
                                {parseFloat(selectedMetal?.gst).toFixed(2)}
                            </span>
                        </h4>
                        <h4 className={style.merchant_name}>Profit Margin(%):
                            <span>
                                {parseFloat(selectedMetal?.platform_margin).toFixed(2)}
                            </span>
                        </h4>
                        <h4 className={style.merchant_name}>Profit Amount:
                            <span>
                                {parseFloat(selectedMetal?.platform_profit).toFixed(2)}
                            </span>
                        </h4>
                    </div>
                </div>
                {/* ------------------ Price Details ---------- */}
                <div className={style1.customer_detail_container}>
                    <h2>Cost breakdown:</h2>
                    <div className={style1.details_container}>
                        <h4 className={style.merchant_name}>Total Price(without GST):
                            <span>
                                {parseFloat(selectedMetal?.total_amount_before_tax).toFixed(2)}
                            </span>
                        </h4>
                        <h4 className={style.merchant_name}>GST Amount:
                            <span>
                                {parseFloat(selectedMetal?.gst_amount).toFixed(2)}
                            </span>
                        </h4>
                        <h4 className={style.merchant_name}>Total Price(with GST):
                            <span>
                                <b>{parseFloat(selectedMetal?.total_amount_after_tax).toFixed(2)}</b>
                            </span>
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default MetalDetails; 