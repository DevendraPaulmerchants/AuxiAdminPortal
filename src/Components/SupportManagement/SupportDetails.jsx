import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import style from "../MerchantManagement/Merchants.module.css";
import style1 from "../Admin/Admin.module.css"
import { IoMdArrowRoundBack } from "react-icons/io";
import { APIPATH } from '../apiPath/apipath';

function SupportDetails() {
    const { id } = useParams();
    console.log(id);
    const [supportDetails, setSupportDetails] = useState(null);
    const [isloading, setIsLoading] = useState(false);

    const getSupportDetails = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/ticket?id=${id}`, {
            headers: {
                'Authorization': "",
                'Content-Type': "application/json",
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setSupportDetails(data.data[0]);
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
        getSupportDetails()
    }, [id]);

    return <>
        <div className={style1.merchants_parent}>
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
                                            {supportDetails?.merchant_name}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Category:
                                        <span>
                                            {supportDetails?.category}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Subject:
                                        <span>
                                            {supportDetails?.subject}
                                        </span>
                                    </h4>
                                </td>
                            </tr>
                            <tr className={style.merchant_details_page_row}>
                                <td>
                                    <h4 className={style.merchant_name}>Priority
                                        <span>
                                            {supportDetails?.priority}
                                        </span>
                                    </h4>
                                </td>
                                <td colSpan={2}>
                                    <h4 className={style.merchant_name}>Description:
                                        <span>
                                            {supportDetails?.description}
                                        </span>
                                    </h4>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                    <div className={style.add_merchats_btn_container}>
                        <button className={style.primary_login_btn}
                            onClick={() => { }}
                        >{supportDetails?.status}</button>
                    </div>
                </>

            }
        </div>
    </>
}

export default SupportDetails;