import style from '../Merchants.module.css';
import style1 from '../FIle.module.css';
import { CgMaximizeAlt } from 'react-icons/cg';

function BusinessDocument({ selectedMerchant,
    previewPAN, setPreviewPAN, setPanDocument,
    previewBuDoc, setPreviewBUDoc, setBussinessDocument,
    previewMSME,setPreviewMSME,setMSMEDocument,
    setSelectedUrl, setMaxView
}) {

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
     const handleMSMEDocument = (e) => {
        const file = e.target.files[0];
        const fileUrl = URL.createObjectURL(file);
        setPreviewMSME(fileUrl)
        setMSMEDocument(file)
    }
    return <>
        <div className={style.add_merchants_bussiness_address}>
            <h3>Upload Document </h3>
            <div className={style.name_email_parent_container}>
                {/* Upload Pan Card */}
                <div className={style.name_label_input_contaner}>
                    <label>Upload PAN* </label>
                    <input 
                    
                        type='file'
                        required={!selectedMerchant}
                        accept='application/pdf*'
                        onChange={handlePanDocument}
                    />
                    <p style={{ fontSize: '10px' }}>Kindly upload your document as a PDF/Image file only.</p>

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
                {/* Upload GST Certificate ------- */}
                <div className={style.name_label_input_contaner}>
                    <label>Upload GST Certificate* </label>
                    <input 
                    // style={{ width: "97%" }}
                        type='file'
                        required={!selectedMerchant}
                        accept='application/pdf*'
                        onChange={handleBussinessDocument}
                    />
                    <p style={{ fontSize: '10px' }}>Kindly upload your document as a PDF/Image file only.</p>

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
                {/* Upload MSME Certificate ------------ */}
                <div className={style.name_label_input_contaner}>
                    <label>Upload MSME Certificate* </label>
                    <input 
                    // style={{ width: "97%" }}
                        type='file'
                        required={!selectedMerchant}
                        accept='application/pdf*'
                        onChange={handleMSMEDocument}
                    />
                    <p style={{ fontSize: '10px' }}>Kindly upload your document as a PDF/Image file only.</p>

                    {previewMSME &&
                        <div className={style1.file_mini_view}>
                            <iframe className={style.mini_file}
                                src={previewMSME}
                                title="Business Document PDF Preview"
                                width='100%'
                                height='100px'
                                frameborder="0">
                            </iframe>
                            <p className={style1.max_view}
                                onClick={() => {
                                    setSelectedUrl(previewMSME);
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
    </>
}

export default BusinessDocument