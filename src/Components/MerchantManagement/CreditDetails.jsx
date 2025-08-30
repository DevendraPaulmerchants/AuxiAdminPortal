import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import style from "./Merchants.module.css";
import style1 from "../Admin/Admin.module.css"
import { IoMdArrowRoundBack } from "react-icons/io";
import ChatWithMerchant from './ChatWithMerchant';
import ApprovalForm from './ApprovalForm';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import PaymentApproval from './PaymentApproval';

function CreditDetails() {
    const { token } = useContextData();
    const { id } = useParams();
    const [creditDetails, setCreditDetails] = useState(null);
    const [isloading, setIsloading] = useState(false);
    const [isApprovebtnClick, setIsApprovebtnClick] = useState(false);
    const [paymentClick, setPaymentClick] = useState(false);

    const getCreditDetails = () => {
        setIsloading(true);
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
                setIsloading(false)
            })
    }
    const navigate = useNavigate();
    useEffect(() => {
        if (!id) return;
        getCreditDetails()
    }, [id]);

    const openApproveForm = () => {
        setIsApprovebtnClick(true)
    }
    const closeApproveForm = () => {
        setIsApprovebtnClick(false)
    }
    

    const handlePaymentPage = () => {
        setPaymentClick(true)
    }

    return <>
        <div className={style1.merchants_parent}>
            <div className={style1.credit_details_and_chat}>
                <div className={style1.credit_details_container} style={{ width: '100%' }}>
                    <div className={style.add_merchants_header}>
                        <button className='back_button'
                            onClick={() => {
                                navigate(-1)
                            }}><IoMdArrowRoundBack /></button>
                    </div>
                    {isloading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Loading' />
                    </div></div> :
                        <>
                            <div className={style.list_details}>
                                <h4 className={style.merchant_name}>Merchant`s Name:<span>{creditDetails?.merchant_name}</span></h4>
                                <h4 className={style.merchant_name}>Requested Credits:<span>{creditDetails?.amount}</span></h4>
                                <h4 className={style.merchant_name}>Transaction Type:<span>{creditDetails?.transaction_type}</span></h4>
                                <h4 className={style.merchant_name}>Payment Method:<span>{creditDetails?.payment_method}</span></h4>
                                <h4 className={style.merchant_name}>Approval Status:<span>{creditDetails?.approval_status}</span></h4>
                                <h4 className={style.merchant_name}>Payment Status:<span>{creditDetails?.payment_status}</span></h4>
                            </div>
                            <div className={style.add_merchats_btn_container}>
                                {paymentClick ? <div className={style.loader_container}><div className={style.loader_item}>
                                    <img src='/gold-coin.png' alt='Loading' />
                                </div></div> :
                                    <button className={style.primary_login_btn} onClick={()=>handlePaymentPage()}>
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
            creditId={creditDetails?.id}
        />}
        {paymentClick && <PaymentApproval
            close={() => setPaymentClick(false)}
            creditId={creditDetails?.id}
            getCreditDetails={getCreditDetails}
        />}
    </>
}

export default CreditDetails;