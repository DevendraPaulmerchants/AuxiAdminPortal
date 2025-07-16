import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import style from "./Merchants.module.css";
import style1 from "../Admin/Admin.module.css"
import { IoMdArrowRoundBack } from "react-icons/io";
import ChatWithMerchant from './ChatWithMerchant';
import ApprovalForm from './ApprovalForm';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function CreditDetails() {
    const { token } = useContextData();
    const { id } = useParams();
    const [creditDetails, setCreditDetails] = useState(null);
    const [isloading, setIsLoading] = useState(false);
    const [isApprovebtnClick, setIsApprovebtnClick] = useState(false)

    const getCreditDetails = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/merchants/credits/requests?id=${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json",
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setCreditDetails(data?.data[0]);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    const navigate = useNavigate();
    useEffect(() => {
        getCreditDetails()
    }, [id]);

    const openApproveForm = () => {
        setIsApprovebtnClick(true)
    }
    const closeApproveForm = () => {
        setIsApprovebtnClick(false)
    }
    const [paymentClick, setPaymentClick] = useState(false);
    const data = {
        status: "SUCCESSFUL",
        comment: "Payment verified in HDFC bank statement on 2025-04-30."
    }
    const handlePaymentRequest = () => {
        setPaymentClick(true)
        const url = `https://uat.magicalvacation.com/api/v1/admin/merchants/credits/requests/${creditDetails.id}/verify-payment`;
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'Application/json'
            },
            method: 'PATCH',
            body:JSON.stringify(data),
            mode: 'cors'
        }).then((res) => res.json())
            .then((data) => {
                alert(data.message);
                getCreditDetails();
            })
            .catch((err) => {
                alert(err)
            })
            .finally(() => setPaymentClick(false))
    }

    return <>
        <div className={style1.merchants_parent}>
            <div className={style1.credit_details_and_chat}>
                <div className={style1.credit_details_container}>
                    <div className={style.add_merchants_header}>
                        <h2 style={{ cursor: "pointer" }} onClick={() => {
                            navigate(-1)
                        }}><IoMdArrowRoundBack /></h2>
                    </div>
                    {isloading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Loading' />
                    </div></div> :
                        <>
                            <table className={style.merchant_details_page_table}>
                                <tbody>
                                    <tr className={style.merchant_details_page_row}>
                                        <td>
                                            <h4 className={style.merchant_name}>Merchant`s Name:
                                                <span>
                                                    {creditDetails?.merchant_name}
                                                </span>
                                            </h4>
                                        </td>
                                        <td>
                                            <h4 className={style.merchant_name}>Requested Credits:
                                                <span>
                                                    {creditDetails?.amount}
                                                </span>
                                            </h4>
                                        </td>

                                    </tr>
                                    <tr className={style.merchant_details_page_row}>
                                        <td>
                                            <h4 className={style.merchant_name}>Transaction Type:
                                                <span>
                                                    {creditDetails?.transaction_type}
                                                </span>
                                            </h4>
                                        </td>
                                        <td>
                                            <h4 className={style.merchant_name}>Payment Method:
                                                <span>
                                                    {creditDetails?.payment_method}
                                                </span>
                                            </h4>
                                        </td>
                                    </tr>
                                    <tr className={style.merchant_details_page_row}>
                                        <td>
                                            <h4 className={style.merchant_name}>Approval Status:
                                                <span>
                                                    {creditDetails?.approval_status}
                                                </span>
                                            </h4>
                                        </td>
                                        <td>
                                            <h4 className={style.merchant_name}>Payment Status:
                                                <span>
                                                    {creditDetails?.payment_status}
                                                </span>
                                            </h4>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className={style.add_merchats_btn_container}>
                                {paymentClick ? <div className={style.loader_container}><div className={style.loader_item}>
                                    <img src='/gold-coin.png' alt='Loading' />
                                </div></div> :
                                    <button className={style.primary_login_btn}
                                        onClick={handlePaymentRequest}
                                    >
                                        {creditDetails?.payment_status === 'SUCCESSFUL' && ' ✅Verified'}
                                        {creditDetails?.payment_status === 'FAILED' && '❌Rejected'}
                                        {creditDetails?.payment_status === 'PENDING' && 'Verify Payment'}
                                    </button>
                                }
                                <button className={style.primary_login_btn}
                                    disabled={creditDetails?.approval_status.toLowerCase() !== "pending"}
                                    onClick={openApproveForm}
                                >{creditDetails?.approval_status.toLowerCase() === "pending" ? "Approve Credits" : "Approved"}</button>

                            </div>
                        </>

                    }

                </div>
                {/* <div className={style1.credit_chat_detail}>
                    <ChatWithMerchant />
                </div> */}
            </div>
        </div>
        {isApprovebtnClick && <ApprovalForm
            close={closeApproveForm}
            merchantId={creditDetails?.merchant_id}
            creditId={creditDetails?.id}
        />}
    </>
}

export default CreditDetails;