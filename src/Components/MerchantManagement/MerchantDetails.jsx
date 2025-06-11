import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import style from "./Merchants.module.css";
import style1 from "../Admin/Admin.module.css"
// import { IoMdClose } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import AddMerchants from './AddMerchants';
// import ApproveKYC from './KycApprove';

function MerchantDetails() {
    const { token } = useContextData();
    const { merchantId } = useParams();
    const [selectedMerchant, setSelectedMerchant] = useState(null);
    const [isloading, setIsLoading] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [showImageUrl, setShowImageUrl] = useState("");
    const [isUpdateClicked, setIsUpdateClicked] = useState(false);

    const getSelectedMerchantDetails = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/merchants/?id=${merchantId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json",
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data[0]);
                setSelectedMerchant(data.data[0]);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setIsLoading(false))
    }
    useEffect(() => {
        getSelectedMerchantDetails()
    }, [])
    const navigate = useNavigate();
    // const [isveryfied, setIsVerified] = useState(false);

    // const openverifyandrejectKycpage = () => {
    //     setIsVerified(true);
    // }
    // const closeverifyandrejectKycpage = () => {
    //     setIsVerified(false);
    // }
    const closeUpdatePage = () => {
        setIsUpdateClicked(false);
    }
    return <>
        <div className={style1.merchants_parent}>
            <div>
                <div className={style.add_merchants_header}>
                    <h2 onClick={() => navigate(-1)}><IoMdArrowRoundBack /></h2>
                </div>
                {isloading ? <div className={style.loader_container}><div className={style.loader_item}>
                    <img src='/gold-coin.png' alt='loading...' />
                </div></div> :
                    <>
                        <table className={style.merchant_details_page_table}>
                            <tbody>
                                <tr className={style.merchant_details_page_row}>
                                    <td>
                                        <h4 className={style.merchant_name}>Merchant`s Name:
                                            <span>
                                                {selectedMerchant?.merchant_name}
                                            </span>
                                        </h4>
                                    </td>
                                    <td>
                                        <h4 className={style.merchant_name}> Primary person name:
                                            <span>
                                                {selectedMerchant?.primary_person_name}
                                            </span>
                                        </h4>
                                    </td>
                                    <td>
                                        <h4 className={style.merchant_name}>Primary person email:
                                            <span>
                                                {selectedMerchant?.primary_person_email}
                                            </span>
                                        </h4>
                                    </td>
                                    <td>
                                        <h4 className={style.merchant_name}>Primary person mobile:
                                            <span>
                                                {selectedMerchant?.primary_person_mobile}
                                            </span>
                                        </h4>
                                    </td>
                                </tr>
                                <tr className={style.merchant_details_page_row}>
                                    {/* <td>
                                        <h4 className={style.merchant_name}>GST:
                                            <span>
                                                {selectedMerchant?.gst_no}
                                            </span>
                                        </h4>
                                    </td> */}
                                    <td>
                                        <h4 className={style.merchant_name}>Address:
                                            <span>
                                                <p>{selectedMerchant?.address_street}</p>
                                                {" "}{selectedMerchant?.address_district},
                                                {" "}{selectedMerchant?.address_state},
                                                {" "}{selectedMerchant?.address_pincode}
                                            </span>
                                        </h4>
                                    </td>
                                </tr>
                                <tr className={style.merchant_details_page_row}>
                                    <td>
                                        <h4 className={style.merchant_name}>Kyc Status:
                                            <span>
                                                {selectedMerchant?.kyc_status === 0 ? "Not Approved" : " Approved"}
                                            </span>
                                        </h4>
                                    </td>
                                    <td>
                                        {selectedMerchant?.kyc_status === 0 &&
                                            <h4 className={style.merchant_name}>Kyc Rejected comments:
                                                <span>
                                                    {selectedMerchant?.rejected_reason}
                                                </span>
                                            </h4>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {/* <div className={style.merchant_details_document}>
                            <h4 className={style.merchant_name}>Business document:
                                <span className={style.merchant_document_image}>
                                    <img src={selectedMerchant?.business_document_url} alt='' />
                                </span>
                            </h4>

                            <h4 className={style.merchant_name}>PAN document:
                                <span className={style.merchant_document_image}>
                                    <img src={selectedMerchant?.pan_document_url} alt='' />
                                </span>
                            </h4>
                        </div> */}
                        {/* Uploded document */}
                        <h2 className={style.uploaded_docement_title}>Uploaded Document</h2>
                        <div className={style.merchant_details_document}>
                            {selectedMerchant?.kyc_documents?.map((doc, id) => (
                                <h4 className={style.merchant_name} key={doc.id}>{doc?.document_type} :
                                    <div className={style.merchant_document_image}>
                                        <img src={doc?.document_url} alt=''
                                            onDoubleClick={() => {
                                                setShowImageUrl(doc?.document_url);
                                                setShowImage(true);
                                            }}
                                        />
                                        <p className={`${style.document_kyc_status} ${style[doc?.kyc_status?.toLowerCase()]}`}>
                                            {doc?.kyc_status === "VERIFIED" && "✅"}
                                            {doc?.kyc_status === "REJECTED" && "❌"}
                                            {doc?.kyc_status === "PENDING" && "Pending"}
                                        </p>
                                    </div>
                                    {/* <div className={style.add_merchats_btn_container}>
                                        <button className={style.primary_login_btn}
                                            onClick={() => ApproveDocument(doc.id, doc.kyc_status)}
                                        >Approve</button>
                                        <button className={style.primary_login_btn}
                                            disabled={doc.kyc_status === "VERIFIED"}
                                            onClick={()=>{setIsKYCRejectClicked(true);setSelectedDocId(doc.id)}}
                                        >Reject</button>
                                    </div> */}
                                </h4>
                            ))}
                        </div>
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}
                                onClick={() => setIsUpdateClicked(true)}
                            >
                                Update Details
                            </button>
                            <button className={style.primary_login_btn}
                            // onClick={() => { openverifyandrejectKycpage() }}
                            >
                                {selectedMerchant?.kyc_status ? "✅ KYC Verified" : " ❌ Not Verified"}</button>
                        </div>
                    </>
                }
            </div>
        </div>
        {showImage && <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "500px", width: "600px" }}>
                <div className={style.add_merchants_header}>
                    <h2 className={style1.back_arrow} onClick={() => {
                        setShowImage(false);
                    }}><IoMdArrowRoundBack /></h2>
                </div>
                <div className={style1.agent_document_image}>
                    <img src={showImageUrl} alt='' />
                </div>
            </div>
        </div>}
        {isUpdateClicked && <AddMerchants close={closeUpdatePage} selectedMerchant={selectedMerchant} updateList={getSelectedMerchantDetails} />}

        {/* {isveryfied && <ApproveKYC close={closeverifyandrejectKycpage}
            merchantId={merchantId} updateList={getSelectedMerchantDetails} />} */}
    </>
}

export default MerchantDetails;