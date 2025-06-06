import React, { memo, useEffect, useState } from 'react';
import style from "./Merchants.module.css";
import style1 from "./FIle.module.css";
import { IoMdClose } from "react-icons/io";
import { useMask } from "@react-input/mask";
import { handleEmailChange, handleGSTNumber, handleInputChangeWithAlphabetOnly, handleInputChangeWithNumericValueOnly, handlePANCardNumber } from '../InputValidation/InputValidation';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';
import { CgMaximizeAlt } from 'react-icons/cg';

function AddMerchants({ close, updatelist,selectedMerchant }) {
  const { token } = useContextData();
  useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = 'auto';
  };
}, []);
  const [organizatioNname, setOrganizationName] = useState(selectedMerchant?.merchant_name || '');
  const [preferredName, setPreferredName] = useState(selectedMerchant?.merchant_brand_name || '')
  const [primaryContactName, setPrimaryContactName] = useState(selectedMerchant?.primary_person_name || '');
  const [primaryContactMobile, setPrimaryContactMobile] = useState(selectedMerchant?.primary_person_mobile || '');
  const [isValidPMobile, setIsValidPMobile] = useState(true);
  const [primaryContacAlttMobile, setPrimaryContactAltMobile] = useState();
  const [isValidAltPMobile, setIsValidAltPMobile] = useState(true);
  const [primaryContactEmail, setPrimaryContactEmail] = useState(selectedMerchant?.primary_person_email || '');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [street, setStreet] = useState(selectedMerchant?.address_street || '');
  const [stateName, setStateName] = useState(selectedMerchant?.address_state || '');
  const [districtName, setDistrictName] = useState(selectedMerchant?.address_district || '');
  const [pinCode, setPinCode] = useState(selectedMerchant?.address_pincode || '');
  const [panNumber, setPANnumber] = useState( selectedMerchant?.kyc_documents?.[1]?.document_number || '');
  const [isValidPAN, setIsValidPAN] = useState(true);
  const [gstNumber, setGSTNumber] = useState(selectedMerchant?.kyc_documents?.[0]?.document_number || '');
  const [isvalidGst,setIsvalidGst]=useState(true);
  const [bussinessType, setBussinessType] = useState("");
  const [businessNature, setBusinessNature] = useState("");
  const [schemeList, setSchemeList] = useState(null);
  const [schemeId, setSchemeId] = useState(selectedMerchant?.scheme_id || "");
  const [panDocument, setPanDocument] = useState();
  const [previewPAN, setPreviewPAN] = useState(selectedMerchant?.kyc_documents?.[1]?.document_url || '')
  const [bussinessDocument, setBussinessDocument] = useState();
  const [previewBuDoc, setPreviewBUDoc] = useState(selectedMerchant?.kyc_documents?.[0]?.document_url ||'');
  const [ownerImage, setOwnerImage] = useState();
  const [businessImage, setBusinessImage] = useState();
  const [selectedUrl, setSelectedUrl] = useState('');
  const [maxView, setMaxView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useMask({
    mask: "+91-__________",
    replacement: { _: /\d/ },
  });

  const inputAltRef = useMask({
    mask: "+91-__________",
    replacement: { _: /\d/ },
  });
// new Merchnat object ------------------
  const newMerchants = {
    merchant_name: organizatioNname,
    merchant_brand_name: preferredName,
    address_street: street,
    address_district: districtName,
    address_state: stateName,
    address_pincode: pinCode,
    primary_person_name: primaryContactName,
    primary_person_email: primaryContactEmail,
    primary_person_mobile: primaryContactMobile?.split("-")[1],
    gst_no: gstNumber,
    pan_no: panNumber,
    business_type: bussinessType,
    scheme_id: schemeId
  }
  const handlePanDocument = (e) => {
    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setPreviewPAN(fileUrl)
    setPanDocument(file);
  }
  const handleBussinessDocument = (e) => {
    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setPreviewBUDoc(fileUrl)
    setBussinessDocument(file)
  }
  const handleOwnerImage = (e) => {
    const file = e.target.files[0];
    setOwnerImage(file)
  }
  const handleBusinessImage = (e) => {
    const file = e.target.files[0];
    setBusinessImage(file)
  }
  // Getting ShemeList
  useEffect(() => {
    if(!!schemeList) return;
    fetch(`${APIPATH}/api/v1/admin/schemes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'Application/json'
      },
      method: "GET",
      mode: "cors"
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setSchemeList(data.data);
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  const [stateList, setStateList] = useState(null);
  useEffect(() => {
    if(!!stateList) return
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ country: "India" })
    })
      .then(res => res.json())
      .then(data => {
        setStateList(data.data.states)
      })
      .catch(err => console.error(err));

  }, [])

  const [districtList, setDistrictList] = useState(null);
  useEffect(() => {
    if (stateName === "" || !stateName) return;
    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ country: "India", state: stateName }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDistrictList(data.data);
      })
      .catch((err) => console.error(err));
  }, [stateName]);

  const handleFormData = (e) => {
    e.preventDefault();
    if(!isValidPMobile && !isValidAltPMobile){
      alert("Please enter valid mobile number");
      return;
    }
    if (!isValidEmail) {
      alert("Please enter valid email");
      return;
    }
    if (!isValidPAN) {
      alert("Please enter valid PAN number..");
      return;
    }
    setIsLoading(true)
    const formData = new FormData();
    formData.append('jsonData', JSON.stringify(newMerchants));
    formData.append("pan_document", panDocument);
    formData.append("business_document", bussinessDocument);

    fetch(`${APIPATH}/api/v1/admin/merchants`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      method: 'POST',
      body: formData,
      mode: "cors"
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.statusCode !== 201) {
          alert(data.message);
          return
        }
        alert(data.message);
        updatelist();
        close();
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
          <h2>Add new merchant</h2>
          <h3 onClick={close}><IoMdClose /></h3>
        </div>
        <form onSubmit={(e) => {
          handleFormData(e)
        }}>
          <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
              <label>Organization Name* </label>
              <input type='text' required placeholder='Enter merchant name' maxLength={100} value={organizatioNname}
                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setOrganizationName)}
              />
            </div>
            <div className={style.name_label_input_contaner}>
              <label>Brand/Preferred Name* </label>
              <input type='text' required placeholder='Enter preferred name' maxLength={50} value={preferredName}
                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setPreferredName)}
              />
            </div>
          </div>
          <div className={style.add_merchants_bussiness_address}>
            <h3>Bussiness Contact</h3>
            <div className={style.name_email_parent_container}>
              <div className={style.name_label_input_contaner}>
                <label> Contact Name* </label>
                <input type='text' required placeholder='Enter primary contact person’s name' maxLength={30} value={primaryContactName}
                  onChange={(e) => handleInputChangeWithAlphabetOnly(e, setPrimaryContactName)}
                />
              </div>
              <div className={style.name_label_input_contaner}>
                <label> Contact Mobile* </label>
                <input ref={inputRef} required placeholder='Enter primary contact mobile' value={primaryContactMobile}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPrimaryContactMobile(e.target.value)
                    if (value.length <= 13) {
                      setIsValidPMobile(false)
                    }
                    if (value.length === 14) {
                      setIsValidPMobile(true)
                    }
                  }}
                />
                {!isValidPMobile && <p className={style.not_valid_text}>Please type valid mobile number</p>}
              </div>
            </div>
          </div>
          <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
              <label> Contact Alt. Mobile </label>
              <input ref={inputAltRef} placeholder='Enter primary Alt contact mobile' value={primaryContacAlttMobile}
                onChange={(e) => {
                  const value = e.target.value;
                  setPrimaryContactAltMobile(e.target.value)
                  if (value.length <= 13) {
                    setIsValidAltPMobile(false)
                  }
                  if (value.length === 14) {
                    setIsValidAltPMobile(true)
                  }
                }}
              />
              {!isValidAltPMobile && <p className={style.not_valid_text}>Please type valid mobile number</p>}
            </div>
            <div className={style.name_label_input_contaner}>
              <label> Contact Email* </label>
              <input type='email' required placeholder='Enter primary contact email' maxLength={40} value={primaryContactEmail}
                onChange={(e) => handleEmailChange(e, setPrimaryContactEmail, setIsValidEmail)}
              />
              {!isValidEmail && <p className={style.not_valid_text}>Please type valid Email</p>}
            </div>
          </div>
          <div className={style.add_merchants_bussiness_address}>
            <h3>Business Address</h3>
            <div className={style.name_email_parent_container}>
              <div className={style.name_label_input_contaner}>
                <label>Business Type* </label>
                <select value={bussinessType} required onChange={(e) => setBussinessType(e.target.value)}>
                  <option value="" disabled>Select Business Type</option>
                  {/* <option value="retails">Retails</option> */}
                  <option value="Pvt. Ltd.">Private Limited Company (Pvt. Ltd.)</option>
                  <option value="Ltd.">Public Limited Company (Ltd.)</option>
                  <option value="OPC">One Person Company</option>
                  <option value="Partnership">Partnership</option>
                  <option value="LLP">Limited Liability Partnership</option>
                </select>
              </div>
              <div className={style.name_label_input_contaner}>
                <label>Business Nature* </label>
                <select value={businessNature} required onChange={(e) => setBusinessNature(e.target.value)}>
                  <option value="" disabled>Select Business Nature</option>
                  {/* <option value="retails">Retails</option> */}
                  <option value="IT Services">IT Services / Software Development</option>
                  <option value="Manufacturing">Manufacturing & Production</option>
                  <option value="Retail">Retail & E-commerce</option>
                  <option value="Marketing">Marketing & Advertising</option>
                  <option value="Financial Services">Financial Services</option>

                  {/* <!-- For Public Limited Company --> */}
                  <option value="Large-Scale Manufacturing">Large-Scale Manufacturing</option>
                  <option value="Infrastructure">Infrastructure & Construction</option>
                  <option value="Telecom">Telecommunications</option>
                  <option value="Banking">Banking & Finance</option>
                  <option value="Energy">Energy & Utilities</option>

                  {/* <!-- For One Person Company --> */}
                  <option value="Freelancing">Freelance Web Development</option>
                  <option value="Coaching">Personal Coaching & Training</option>
                  <option value="Digital Marketing">Content Creation / Digital Marketing</option>
                  <option value="Consultancy">Consultancy Services</option>
                  <option value="Handcrafted Sales">Handcrafted Product Sales</option>

                  {/* <!-- For Partnership --> */}
                  <option value="Law Firm">Law Firms</option>
                  <option value="Accounting">Chartered Accountants / Auditors</option>
                  <option value="Medical Practice">Local Clinics or Medical Practices</option>
                  <option value="Boutique Agency">Boutique Agencies</option>
                  <option value="Event Management">Event Management</option>

                  {/* <!-- For LLP --> */}
                  <option value="Tech Consulting">Tech or Business Consulting</option>
                  <option value="Interior Design">Interior Designing</option>
                  <option value="Educational Services">Educational Services</option>
                  <option value="Research">Research & Analytics</option>
                  <option value="Architecture">Architecture Firms</option>
                </select>
              </div>
              <div className={style.name_label_input_contaner}>
                <label>Scheme Type*</label>
                <select required value={schemeId} onChange={(e) => setSchemeId(e.target.value)}>
                  <option value="" disabled>Select Scheme</option>
                  {schemeList?.map((scheme, id) => (
                    <option key={id} value={scheme.id}>{scheme.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={style.name_email_parent_container}>
              <div className={style.name_label_input_contaner}>
                <label>State* </label>
                <select required value={stateName} onChange={(e) => setStateName(e.target.value)}>
                  <option value="" disabled>Select State</option>
                  {stateList?.map((state, id) => (
                    <option key={id} value={state.name}>{state.name}</option>
                  ))}
                </select>
                {/* <input type='text' required placeholder='Enter state' maxLength={20} value={stateName}
                  onChange={(e) => handleInputChangeWithAlphabetOnly(e, setStateName)}
                /> */}
              </div>
              <div className={style.name_label_input_contaner}>
                <label>City* </label>
                <select required value={districtName} onChange={(e) => setDistrictName(e.target.value)}>
                  <option value="" disabled>Select City</option>
                  {districtList?.map((district, id) => (
                    <option key={id} value={district}>{district}</option>
                  ))}
                </select>
                {/* <input type='text' required placeholder='Enter district' maxLength={20} value={districtName}
                  onChange={(e) => handleInputChangeWithAlphabetOnly(e, setDistrictName)}
                /> */}
              </div>
            </div>
            <div className={style.name_email_parent_container}>
              <div className={style.name_label_input_contaner}>
                <label>Pincode* </label>
                <input type='text' required placeholder='Enter pincode' maxLength={6} minLength={6} value={pinCode}
                  onChange={(e) => handleInputChangeWithNumericValueOnly(e, setPinCode)}
                />
              </div>
              <div className={style.name_label_input_contaner}>
                <label>Street Address* </label>
                <input type='text' required placeholder='Enter street address' maxLength={30} value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
              <label>GST Number* </label>
              <input type='text' required placeholder='Enter GST number' maxLength={15} minLength={15} value={gstNumber}
                onChange={(e) => handleGSTNumber(e,setGSTNumber,setIsvalidGst)}
              />
              {!isvalidGst && <p className={style.not_valid_text}>please type valid GST number</p>}
            </div>
            <div className={style.name_label_input_contaner}>
              <label>PAN Number* </label>
              <input type='text' required placeholder='Enter PAN number' minLength={10} maxLength={10} value={panNumber}
                onChange={(e) => {
                  handlePANCardNumber(e, setPANnumber, setIsValidPAN)
                }}
              />
              {!isValidPAN && <p className={style.not_valid_text}>please type valid PAN number</p>}
            </div>
          </div>
          {/* ---------- DOcuments ------------------------------- */}
          <div className={style.add_merchants_bussiness_address}>
            <h3>Upload Document </h3>
            <div className={style.name_email_parent_container}>
              <div className={style.name_label_input_contaner}>
                <label>Upload PAN* </label>
                <input style={{ width: "97%" }}
                  type='file' required
                  accept='application/pdf*'
                  onChange={handlePanDocument}
                />
                <p style={{ fontSize: '10px' }}>Kindly upload your document as a PDF file only.</p>

                {previewPAN &&
                  <div className={style1.file_mini_view}>
                    <iframe className={style.mini_file}
                      src={previewPAN}
                      title="PAN PDF Preview"
                      width='100%'
                      height='100px'
                      frameborder="0">
                    </iframe>
                    <p className={style1.max_view}
                      onClick={() => {
                        setSelectedUrl(previewPAN);
                        setMaxView(true);
                      }}
                    >
                      <CgMaximizeAlt />
                    </p>
                  </div>
                }
              </div>
              <div className={style.name_label_input_contaner}>
                <label>Upload Bussiness Certificate* </label>
                <input style={{ width: "97%" }}
                  type='file' required
                  accept='application/pdf*'
                  onChange={handleBussinessDocument}
                />
                <p style={{ fontSize: '10px' }}>Kindly upload your document as a PDF file only.</p>

                {previewBuDoc &&
                  <div className={style1.file_mini_view}>
                    <iframe className={style.mini_file}
                      src={previewBuDoc}
                      title="Business Document PDF Preview"
                      width='100%'
                      height='100px'
                      frameborder="0">
                    </iframe>
                    <p className={style1.max_view}
                      onClick={() => {
                        setSelectedUrl(previewBuDoc);
                        setMaxView(true);
                      }}
                    >
                      <CgMaximizeAlt />
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>
          {/* <div className={style.add_merchants_bussiness_address}>
            <div className={style.name_email_parent_container}>
              <div className={style.name_label_input_contaner}>
                <label>Upload Owner Image* </label>
                <input style={{ width: "97%" }}
                  type='file' required
                  accept='/image/*'
                  onChange={handleOwnerImage}
                />
              </div>
              <div className={style.name_label_input_contaner}>
                <label>Upload Bussiness Location Image* </label>
                <input style={{ width: "97%" }}
                  type='file' required
                  accept='/image/*'
                  onChange={handleBusinessImage}
                />
              </div>
            </div>
          </div> */}

          {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
            <img src='/gold-coin.png' alt='Gold loading...' />
          </div></div> :
            <div className={style.add_merchats_btn_container}>
              <button className={style.primary_login_btn}>Create Merchant</button>
            </div>
          }
        </form>
      </div>
    </div>
    {maxView &&
      <div className={style1.preview_uploaded_file}>
        <div className={style1.open_file_dimension}>
          <p onClick={() => { setMaxView(false); setSelectedUrl(null) }} className={style1.pdf_close_icon}>X</p>
          <div className={style1.preview_pdf_file}>
            <iframe className={style1.open_file}
              src={selectedUrl}
              title="PDF Preview"
              width="100%"
              height="100%"
              frameBorder="0"
            />
          </div>
        </div>
      </div>
    }
  </>
}

export default AddMerchants;