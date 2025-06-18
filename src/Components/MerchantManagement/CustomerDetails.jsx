import React, { useEffect } from 'react';
import style from "../MerchantManagement/Merchants.module.css";
import style1 from "../Transactions/Transaction.module.css";
import { IoMdClose } from "react-icons/io";
import { dateAndTimeFormat } from '../../helperFunction/helper';

function CustomerDetails({ close, selectedCustomer }) {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);


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
                                        {dateAndTimeFormat(selectedCustomer?.created_at)}
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
                            {selectedCustomer?.agent_name &&
                                <td>
                                    <h4 className={style.merchant_name}>Agent Name:
                                        <span>
                                            {selectedCustomer?.agent_name}
                                        </span>
                                    </h4>
                                </td>
                            }

                        </tr>
                    </tbody>
                </table>
            </div>
            {/* ------------- Payment Details ---------- */}
            <div className={style1.customer_detail_container}>
                <h2>Wallets Details:</h2>
                <table className={style.merchant_details_page_table}>
                    <tbody>
                        <tr className={style.merchant_details_page_row}>
                            {selectedCustomer?.wallets?.map((wallet_type, id) => (
                                <td key={wallet_type.id}>
                                    <h4 className={style.merchant_name}>Avl. {wallet_type.wallet_type}:
                                        {wallet_type.wallet_type !== 'FUND' &&
                                            <span>{wallet_type.metal_quantity || 0} gm </span>
                                        }
                                        {wallet_type.wallet_type === 'FUND' &&
                                            <span>{wallet_type.metal_quantity}</span>
                                        }
                                    </h4>
                                </td>
                            ))}
                            {/* <td>
                                <h4 className={style.merchant_name}>Avl. Silver:
                                    <span>
                                        {selectedCustomer?.customer_payment_status}
                                    </span>
                                </h4>
                            </td> */}

                            {/* <td>
                                <h4 className={style.merchant_name}>Avl. Platinum:
                                    <span>
                                        {selectedCustomer?.customer_payment_reference}
                                    </span>
                                </h4>
                            </td> */}
                            {/* <td>
                                <h4 className={style.merchant_name}>Fund Balance:
                                    <span>
                                        {selectedCustomer?.customer_payment_reference}
                                    </span>
                                </h4>
                            </td> */}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}

export default CustomerDetails