import React, { lazy, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import style from "./Merchants.module.css";
import style1 from "../Admin/Admin.module.css"

import { IoMdArrowRoundBack } from "react-icons/io";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

// import AddMerchant from './AddMerchant/AddMerchant';
const AddMerchant = lazy(() => import('./AddMerchant/AddMerchant'));
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
                <div className={style.add_merchants_header} style={{ background: 'transparent' }}>
                    <button className='back_button' onClick={() => navigate(-1)}><IoMdArrowRoundBack /></button>
                </div>
                {isloading ? <div className={style.loader_container}><div className={style.loader_item}>
                    <img src='/gold-coin.png' alt='loading...' />
                </div></div> :
                    <>
                        <div className={style.list_details}>
                            <h4 className={style.merchant_name}>Merchant`s Name:<span>{selectedMerchant?.merchant_name}</span></h4>
                            <h4 className={style.merchant_name}> Primary person name:<span>{selectedMerchant?.primary_person_name}</span></h4>
                            <h4 className={style.merchant_name}>Primary person email:<span>{selectedMerchant?.primary_person_email}</span></h4>
                            <h4 className={style.merchant_name}>Primary person mobile:<span>{selectedMerchant?.primary_person_mobile}</span>
                            </h4><h4 className={style.merchant_name}>Scheme name:<span>
                                <Link to='/scheme_list' state={{ schemeName: selectedMerchant?.scheme_name }}>
                                    {selectedMerchant?.scheme_name}
                                </Link>
                            </span>
                            </h4>
                            <h4 className={style.merchant_name}>Address:
                                <span>
                                    <p>{selectedMerchant?.address_street}</p>
                                    {" "}{selectedMerchant?.address_district},
                                    {" "}{selectedMerchant?.address_state},
                                    {" "}{selectedMerchant?.address_pincode}
                                </span>
                            </h4>
                            <h4 className={style.merchant_name}>Kyc Status:
                                <span>
                                    {selectedMerchant?.kyc_status === 0 ? "Not Approved" : " Approved"}
                                </span>
                            </h4>

                            {selectedMerchant?.kyc_status === 0 &&
                                <h4 className={style.merchant_name}>Kyc Rejected comments:
                                    <span>
                                        {selectedMerchant?.rejected_reason}
                                    </span>
                                </h4>
                            }
                        </div>
                        {/*----------------------- Uploded document --------------------------- */}
                        <h2 className={style.uploaded_docement_title}>Uploaded Document</h2>
                        <div className={style.merchant_details_document}>
                            {selectedMerchant?.kyc_documents?.map((doc, id) => (
                                <h4 key={doc.id}>{doc?.document_type} :
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
                                </h4>
                            ))}
                        </div>
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}
                                onClick={() => setIsUpdateClicked(true)}
                            >
                                Update Details
                            </button>
                            <button className={style.primary_login_btn}>
                                {selectedMerchant?.kyc_status ? "✅ KYC Verified" : " ❌ Not Verified"}</button>
                        </div>
                    </>
                }
            </div >
        </div >
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
        </div>
        }
        {/* {isUpdateClicked && <AddMerchants close={closeUpdatePage} selectedMerchant={selectedMerchant} updateList={getSelectedMerchantDetails} />} */}
        {isUpdateClicked && <AddMerchant close={closeUpdatePage} updateList={getSelectedMerchantDetails} selectedMerchant={selectedMerchant} />}
    </>
}

export default MerchantDetails;