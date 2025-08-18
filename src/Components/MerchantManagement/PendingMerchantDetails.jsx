import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import style from "./Merchants.module.css";
import style1 from "../Admin/Admin.module.css"
import { IoMdArrowRoundBack } from "react-icons/io";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import ApproveKYC from './KycApprove';
import ApproveThisDocument from './DocumentApprove';
import AddMerchant from './AddMerchant/AddMerchant';

function PendingMerchantDetails() {
    const { token } = useContextData();
    const { Id } = useParams();
    const location = useLocation();
    const queryParam = new URLSearchParams(location.search);
    const status = queryParam.get('verification_status');
    // console.log(Id,status);

    const [selectedMerchant, setSelectedMerchant] = useState(null);
    const [isloading, setIsLoading] = useState(false);
    const [isKYCRejectClicked, setIsKYCRejectClicked] = useState(false);
    const [selectedDocId, setSelectedDocId] = useState("");
    const [showImage, setShowImage] = useState(false);
    const [showImageUrl, setShowImageUrl] = useState("");
    const [isveryfied, setIsVerified] = useState(false);
    const [isUpdateClicked, setIsUpdateClicked] = useState(false);

    const getSelectedMerchantDetails = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/merchants?id=${Id}&verification_status=${status}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json",
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data.data[0]);
                setSelectedMerchant(data.data[0]);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        getSelectedMerchantDetails();
    }, []);

    const navigate = useNavigate();

    const approveDocument = (id, kycStatus) => {
        if (kycStatus === 'VERIFIED') {
            alert("KYC has already been verified. No further action is required.");
            return;
        }
        const confirm = window.confirm("Are you sure you want to verify this document?");
        if (!confirm) return;
        else {
            fetch(`${APIPATH}/api/v1/admin/merchants/kyc/documents/${id}/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': "application/json",
                },
                method: "PATCH",
                body: JSON.stringify({ merchant_id: Id }),
                mode: "cors"
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    getSelectedMerchantDetails();
                    setShowImage(null)
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => setIsLoading(false))
        }
    }
    const closeKYCReject = () => {
        setIsKYCRejectClicked(false);
        setShowImage(null)
    }
    const openverifyandrejectKycpage = () => {
        if (selectedMerchant?.kyc_documents[0].kyc_status === 'PENDING' || selectedMerchant?.kyc_documents[1].kyc_status === 'PENDING') {
            alert("Please verify or reject the Uploaded documents before proceeding.");
            return;
        }
        if (selectedMerchant?.kyc_documents[0].kyc_status === 'REJECTED' || selectedMerchant?.kyc_documents[1].kyc_status === 'REJECTED') {
            alert("Please verify the rejected documents before proceeding.");
            return;
        }
        setIsVerified(true);
    }
    const closeverifyandrejectKycpage = () => {
        setIsVerified(false);
        // navigate('/pending_merchants');
    }
    const closeUpdatePage = () => {
        setIsUpdateClicked(false);
    }
    return <>
        <div className={style1.merchants_parent}>
            <div>
                <div className={style.add_merchants_header}>
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
                            <h4 className={style.merchant_name}>Primary person mobile:<span>{selectedMerchant?.primary_person_mobile}</span></h4>
                            <h4 className={style.merchant_name}>Scheme Name:<span>
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
                        </div>
                        <h2 className={style.uploaded_docement_title}>Uploaded Document</h2>
                        <div className={style.merchant_details_document}>
                            {selectedMerchant?.kyc_documents?.map((doc, id) => (
                                <h4 key={doc.id}>{doc?.document_type} :
                                    <div className={style.merchant_document_image}>
                                        <img src={doc?.document_url} alt=''
                                            onClick={() => {
                                                setShowImageUrl(doc?.document_url);
                                                setShowImage(doc);
                                            }}
                                        />
                                        <p className={`${style.document_kyc_status} ${style[doc?.kyc_status?.toLowerCase()]}`}>
                                            {doc?.kyc_status === "VERIFIED" && "✅"}
                                            {doc?.kyc_status === "REJECTED" && "❌"}
                                            {doc?.kyc_status === "PENDING" && "🕓"}
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
                            <button className={style.primary_login_btn}
                                onClick={() => { openverifyandrejectKycpage() }}
                            // disabled={selectedMerchant?.kyc_documents[0].kyc_status === 'PENDING'
                            //     && selectedMerchant?.kyc_documents[1].kyc_status === 'PENDING'
                            // } 
                            >
                                {selectedMerchant?.kyc_status ? "✅ KYC Verified" : "Verify KYC"}                            </button>
                        </div>

                    </>
                }
            </div>
        </div>
        {showImage && <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "500px", width: "600px" }}>
                <div className={style.add_merchants_header}>
                    <h2 className={style1.back_arrow} onClick={() => {
                        setShowImage(null);
                    }}><IoMdArrowRoundBack /></h2>
                </div>
                <div className={style1.agent_document_image}>
                    {/* <img src={showImageUrl} alt='' /> */}
                    <iframe className={style1.open_file}
                        src={showImageUrl}
                        title="PDF Preview"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                    />
                </div>
                {showImage?.kyc_status === "PENDING" &&
                    <div className={style.add_merchats_btn_container}>
                        <button className={style.primary_login_btn}
                            onClick={() => approveDocument(showImage?.id, showImage?.kyc_status)}
                        >Approve</button>
                        <button className={style.primary_login_btn}
                            disabled={showImage?.kyc_status === "VERIFIED"}
                            onClick={() => { setIsKYCRejectClicked(true); setSelectedDocId(showImage?.id) }}
                        >Reject</button>
                    </div>
                }
            </div>
        </div>}
        {isKYCRejectClicked && <ApproveThisDocument close={closeKYCReject} merchantId={Id} docId={selectedDocId} updateList={getSelectedMerchantDetails} />}
        {isveryfied && <ApproveKYC close={closeverifyandrejectKycpage}
            merchantId={Id} updateList={getSelectedMerchantDetails} />}
        {/* {isUpdateClicked && <AddMerchants close={closeUpdatePage} selectedMerchant={selectedMerchant} updateList={getSelectedMerchantDetails} />} */}
        {isUpdateClicked && <AddMerchant close={closeUpdatePage} updateList={getSelectedMerchantDetails} selectedMerchant={selectedMerchant} />}
    </>
}

export default PendingMerchantDetails;