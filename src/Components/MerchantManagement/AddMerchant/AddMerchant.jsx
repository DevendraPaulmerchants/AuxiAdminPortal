import React, { useEffect, useState } from 'react';
import style from '../Merchants.module.css';
import Organization from './Organization';
import BusinessContact from './BusinessContact';
import BusinessAddress from './BusinessAddress';
import BusinessDocument from './BusinessDocument';
import { IoMdClose } from 'react-icons/io';
import PreviewDocument from './PreviewDocument';
import { APIPATH } from '../../apiPath/apipath';
import { useContextData } from '../../Context/Context';
import BusinessDetails from './BusinessDetails';
import DocumentNumberVerification from './DocumentNumberVerification';
import { CamelCase } from '../../InputValidation/InputValidation';
import { RiUserAddLine } from 'react-icons/ri';

function AddMerchant({ close, selectedMerchant, updateList }) {
    const { token } = useContextData();
    // Organition Document Verification -------------------
    const [panNumber, setPANnumber] = useState( '');
    const [isValidPAN, setIsValidPAN] = useState(selectedMerchant ? true : false);
    const [panData, setPanData] = useState(null);
    const [gstNumber, setGSTNumber] = useState('');
    const [isvalidGst, setIsvalidGst] = useState(true);
       // Business Document ------------------------------
    const [panDocument, setPanDocument] = useState();
    const [previewPAN, setPreviewPAN] = useState( '')
    const [bussinessDocument, setBussinessDocument] = useState();
    const [previewBuDoc, setPreviewBUDoc] = useState('');
    const [msmeCertificate, setMSMEDocument] = useState();
    const [previewMSME, setPreviewMSME] = useState('');

    useEffect(() => {
        if (selectedMerchant?.kyc_documents) {
            selectedMerchant.kyc_documents.forEach((doc) => {
                if (doc.document_type === 'GST') {
                    setGSTNumber(doc.document_number);
                    setPreviewBUDoc(doc.document_url);
                    setPreviewMSME(doc.document_url);
                }
                if (doc.document_type === 'PAN') {
                    setPANnumber(doc.document_number);
                    setPreviewPAN(doc.document_url);
                }
            });
        }
    }, [selectedMerchant]);

    // Organition Name ---------------------------
    const [organizatioNname, setOrganizationName] = useState(selectedMerchant?.merchant_name || '');
    const [preferredName, setPreferredName] = useState(selectedMerchant?.merchant_brand_name || '');
    // Business Contact ---------------------------------------
    // ------------ Owner Details ---------------------------
    const [ownerName, setOwnerName] = useState(selectedMerchant?.owner_name || '');
    const [ownerMobile, setOwnerMobile] = useState(selectedMerchant?.owner_mobile || '');
    const [isValidOwnerMobile, setIsValidOwnerMobile] = useState(true);
    const [ownerEmail, setOwnerEmail] = useState(selectedMerchant?.owner_email || '');
    const [isValidOwnerEmail, setIsValidOwnerEmail] = useState(true);
    // ---------------- POC details --------------------------------------
    const [primaryContactName, setPrimaryContactName] = useState(selectedMerchant?.primary_person_name || '');
    const [primaryContactMobile, setPrimaryContactMobile] = useState(selectedMerchant?.primary_person_mobile || '');
    const [isValidPMobile, setIsValidPMobile] = useState(true);
    const [primaryContactEmail, setPrimaryContactEmail] = useState(selectedMerchant?.primary_person_email || '');
    const [isValidEmail, setIsValidEmail] = useState(true);
    // Business Address -------------------------------
    const [street, setStreet] = useState(selectedMerchant?.address_street || '');
    const [stateName, setStateName] = useState(selectedMerchant?.address_state || '');
    const [districtName, setDistrictName] = useState(selectedMerchant?.address_district || '');
    const [pinCode, setPinCode] = useState(selectedMerchant?.address_pincode || '');

    // Communication Address ---------------------------
    const [secstreet, setsecStreet] = useState(selectedMerchant?.communication_address_street || '');
    const [secstateName, setsecStateName] = useState(selectedMerchant?.communication_address_state || '');
    const [secdistrictName, setsecDistrictName] = useState(selectedMerchant?.communication_address_district || '');
    const [secpinCode, setsecPinCode] = useState(selectedMerchant?.communication_address_pincode || '');
    // Business Details means type/scheme/nature -------------
    const [bussinessType, setBussinessType] = useState(selectedMerchant?.business_type || "");
    const [businessNature, setBusinessNature] = useState("");
    const [schemeId, setSchemeId] = useState(selectedMerchant?.scheme_id || "");



    // Preview Document ---------------------
    const [selectedUrl, setSelectedUrl] = useState('');
    const [maxView, setMaxView] = useState(false);
    // Loading the Submitting function--------------
    const [isLoading, setIsLoading] = useState(false);

    // Fetch the pan data address from the API if the PAN number is valid
    useEffect(() => {
        if (panData === null) return;
        console.log("Fetching PAN data for address", panData);
        setStreet(`${panData?.address?.building_name} ${panData?.address?.street_name} ${panData?.address?.locality}` || '');
        setStateName(panData?.address?.state || '');
        setDistrictName(CamelCase(panData?.address?.city) || '');
        setPinCode(panData?.address?.pincode || '');
    }, [panData]);

    // New Merchant Object ---------------------------
    const newMerchants = {
        merchant_name: organizatioNname,
        merchant_brand_name: preferredName,

        address_street: street,
        address_district: districtName,
        address_state: stateName,
        address_pincode: pinCode,

        communication_address_street: secstreet,
        communication_address_state: secstateName,
        communication_address_district: secdistrictName,
        communication_address_pincode: secpinCode,


        owner_name: ownerName,
        owner_email: ownerEmail,
        owner_mobile: ownerMobile?.split("-")[1],

        primary_person_name: primaryContactName,
        primary_person_email: primaryContactEmail,
        primary_person_mobile: primaryContactMobile?.split("-")[1],

        gst_no: gstNumber,
        pan_no: panNumber,

        business_type: bussinessType,
        business_nature: businessNature,

        scheme_id: schemeId
    }

    // Function to handle the Submitting data ------------
    const handleFormData = (e) => {
        e.preventDefault();
        if (!isValidPAN || !isValidOwnerMobile || !isValidOwnerEmail || !isValidPMobile || !isValidEmail) {
            alert('Please enter valid details');
            return;
        }
        setIsLoading(true)
        const formData = new FormData();
        formData.append('jsonData', JSON.stringify(newMerchants));
        formData.append("pan_document", panDocument);
        formData.append("business_document", bussinessDocument);
        // formData.append("msme_certificate", msmeCertificate);

        console.log('Form Data:', formData);
        console.log('New Merchant Data:', newMerchants);

        const url = selectedMerchant ? `${APIPATH}/api/v1/admin/merchants?id=${selectedMerchant.merchant_id}` : `${APIPATH}/api/v1/admin/merchants`
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            method: selectedMerchant ? 'PATCH' : 'POST',
            body: formData,
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.statusCode === 200 || data.statusCode === 201) {
                    alert(data.message);
                    console.log(data.message);
                    updateList();
                    close();
                } else {
                    alert(data.message);
                    console.log(data.message);
                    return;
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setIsLoading(false))
    }

    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container}>
                <div className={style.add_merchants_header}>
                    {selectedMerchant ? <h2>Update this merchant</h2> : <h2>Add new merchant</h2>}
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <div>
                    <form onSubmit={(e) => {
                        handleFormData(e)
                    }}>
                        <DocumentNumberVerification
                            gstNumber={gstNumber} setGSTNumber={setGSTNumber} isvalidGst={isvalidGst} setIsvalidGst={setIsvalidGst}
                            panNumber={panNumber} setPANnumber={setPANnumber} isValidPAN={isValidPAN} setIsValidPAN={setIsValidPAN}
                            panData={panData} setPanData={setPanData}
                        />
                        <hr />
                        <Organization
                            organizatioNname={organizatioNname}
                            setOrganizationName={setOrganizationName}
                            preferredName={preferredName}
                            setPreferredName={setPreferredName}
                        />
                        <BusinessContact
                            ownerName={ownerName} setOwnerName={setOwnerName}
                            ownerMobile={ownerMobile} setOwnerMobile={setOwnerMobile}
                            isValidOwnerMobile={isValidOwnerMobile} setIsValidOwnerMobile={setIsValidOwnerMobile}
                            ownerEmail={ownerEmail} setOwnerEmail={setOwnerEmail}
                            isValidOwnerEmail={isValidOwnerEmail} setIsValidOwnerEmail={setIsValidOwnerEmail}

                            primaryContactName={primaryContactName} setPrimaryContactName={setPrimaryContactName}
                            primaryContactMobile={primaryContactMobile} setPrimaryContactMobile={setPrimaryContactMobile}
                            isValidPMobile={isValidPMobile} setIsValidPMobile={setIsValidPMobile}
                            primaryContactEmail={primaryContactEmail} setPrimaryContactEmail={setPrimaryContactEmail}
                            isValidEmail={isValidEmail} setIsValidEmail={setIsValidEmail}
                        />
                        <BusinessDetails
                            bussinessType={bussinessType} setBussinessType={setBussinessType}
                            businessNature={businessNature} setBusinessNature={setBusinessNature}
                            schemeId={schemeId} setSchemeId={setSchemeId}

                        />
                        <hr />
                        <BusinessAddress
                            street={street} setStreet={setStreet}
                            stateName={stateName} setStateName={setStateName}
                            districtName={districtName} setDistrictName={setDistrictName}
                            pinCode={pinCode} setPinCode={setPinCode}
                            // Communication Address ---------------------------
                            secstreet={secstreet} setsecStreet={setsecStreet}
                            secstateName={secstateName} setsecStateName={setsecStateName}
                            secdistrictName={secdistrictName} setsecDistrictName={setsecDistrictName}
                            secpinCode={secpinCode} setsecPinCode={setsecPinCode}
                        />
                        <BusinessDocument
                            setPanDocument={setPanDocument}
                            previewPAN={previewPAN} setPreviewPAN={setPreviewPAN}

                            setBussinessDocument={setBussinessDocument}
                            previewBuDoc={previewBuDoc} setPreviewBUDoc={setPreviewBUDoc}

                            setMSMEDocument={setMSMEDocument}
                            previewMSME={previewMSME} setPreviewMSME={setPreviewMSME}

                            selectedUrl={selectedUrl} setSelectedUrl={setSelectedUrl}
                            maxView={maxView} setMaxView={setMaxView}
                        />
                        {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                            <img src='/gold-coin.png' alt='Gold loading...' />
                        </div></div> :
                            <div className={style.add_merchats_btn_container}>
                                <button className={style.primary_login_btn}><RiUserAddLine />
                                    {selectedMerchant ? 'Update Merchant' : 'Create Merchant'}
                                </button>
                            </div>
                        }
                    </form>
                </div>
            </div>
        </div>
        {maxView &&
            <PreviewDocument
                setMaxView={setMaxView}
                setSelectedUrl={setSelectedUrl}
                selectedUrl={selectedUrl}
            />
        }
    </>
}

export default AddMerchant;
