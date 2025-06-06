import React, { useEffect } from 'react';
import style from "../MerchantManagement/Merchants.module.css";
import style1 from "../Transactions/Transaction.module.css";
import { IoMdClose } from "react-icons/io";
import { format } from 'date-fns';

function CustomerDetails({ close, selectedCustomer }) {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const formattedDate = selectedCustomer?.created_at
        ? format(new Date(selectedCustomer.created_at), 'dd-MM-yyyy HH:mm:ss')
        : '-';


    return <div className={style.add_merchants_parent}>
        <div className={style.add_merchants_form_container} style={{ width: "80%" }}>
            <div className={style.add_merchants_header}>
                <h2>Customer Details</h2>
                <h3 onClick={close}><IoMdClose /></h3>
            </div>
            {/* -------------- Customer Details -------------- */}
            <div className={style1.customer_detail_container}>
                <h2>Customer Details:</h2>
                <table className={style.merchant_details_page_table}>
                    <tbody>
                        <tr className={style.merchant_details_page_row}>
                            <td>
                                <h4 className={style.merchant_name}>Name:
                                    <span>
                                        {selectedCustomer?.full_name || selectedCustomer?.first_name}
                                    </span>
                                </h4>
                            </td>
                            <td>
                                <h4 className={style.merchant_name}>Email:
                                    <span>
                                        {selectedCustomer?.email}
                                    </span>
                                </h4>
                            </td>
                            <td>
                                <h4 className={style.merchant_name}>Mobile:
                                    <span>
                                        {selectedCustomer?.phone}
                                    </span>
                                </h4>
                            </td>
                            <td>
                                <h4 className={style.merchant_name}>KYC Level:
                                    <span>
                                        {selectedCustomer?.kyc_level}
                                    </span>
                                </h4>
                            </td>
                            <td>
                                <h4 className={style.merchant_name}>KYC Status:
                                    <span>
                                        {selectedCustomer?.kyc_status}
                                    </span>
                                </h4>
                            </td>
                            <td>
                                <h4 className={style.merchant_name}>Created At:
                                    <span>
                                        {formattedDate}
                                    </span>
                                </h4>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* --------- Merchant Details --------------- */}
            <div className={style1.customer_detail_container}>
                <h2>Merchant Details:</h2>
                <table className={style.merchant_details_page_table}>
                    <tbody>
                        <tr className={style.merchant_details_page_row}>
                            <td>
                                <h4 className={style.merchant_name}>Name:
                                    <span>
                                        {selectedCustomer?.merchant_name}
                                    </span>
                                </h4>
                            </td>
                            <td>
                                <h4 className={style.merchant_name}>Agent Name:
                                    <span>
                                        {selectedCustomer?.agent_name}
                                    </span>
                                </h4>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>
            {/* ------------- Payment Details ---------- */}
            <div className={style1.customer_detail_container}>
                <h2>Metal Details:</h2>
                <table className={style.merchant_details_page_table}>
                    <tbody>
                        <tr className={style.merchant_details_page_row}>
                            <td>
                                <h4 className={style.merchant_name}>Avl. Gold:
                                    <span>
                                        {selectedCustomer?.payment_mode}
                                    </span>
                                </h4>
                            </td>
                            <td>
                                <h4 className={style.merchant_name}>Avl. Silver:
                                    <span>
                                        {selectedCustomer?.customer_payment_status}
                                    </span>
                                </h4>
                            </td>

                            <td>
                                <h4 className={style.merchant_name}>Avl. Platinum:
                                    <span>
                                        {selectedCustomer?.customer_payment_reference}
                                    </span>
                                </h4>
                            </td>
                            <td>
                                <h4 className={style.merchant_name}>Fund Balance:
                                    <span>
                                        {selectedCustomer?.customer_payment_reference}
                                    </span>
                                </h4>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}

export default CustomerDetails