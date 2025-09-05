import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import style from "../MerchantManagement/Merchants.module.css";
import style1 from "./Margin.module.css";
import { handleInputChangeWithNumericValueOnly } from '../InputValidation/InputValidation';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function AddNewGlobalMargin({ close, selectedAccount, closeAfterAPICall }) {
    const { token } = useContextData();
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        }
    }, []);

    console.log(selectedAccount)
    const [metalType, setMetalType] = useState(selectedAccount?.metal_type || "");
    //  GST ------------------------------------
    const [buygst, setBuyGst] = useState(selectedAccount?.buy_gst || "");
    const [sellgst, setSellgst] = useState(selectedAccount?.sell_gst || "");
    const [transfergst, setTransfergst] = useState(selectedAccount?.transfer_gst || "");
    const [conversiongst, setConversiongst] = useState(selectedAccount?.conversion_gst || "");
    // Plateform ------------------------
    const [buyplatformChanrge, setBuyPlatformCharge] = useState(selectedAccount?.buy_platform_charge_fee || "");
    const [sellplateformCharge, setSellplateformCharge] = useState(selectedAccount?.sell_platform_charge_fee || "");
    const [transferplateformcharge, setTransferplateformcharge] = useState(selectedAccount?.transfer_platform_charge_fee || "");
    const [conversionplateformcharge, setConversionplateformcharge] = useState(selectedAccount?.conversion_platform_charge_fee || "")
    // Margin ------------------------------
    const [buyMargin, setBuyMargin] = useState(selectedAccount?.buy_margin || "");
    const [sellMargin, setSellMargin] = useState(selectedAccount?.sell_margin || "");
    const [transferMargin, setTransferMargin] = useState(selectedAccount?.transfer_margin || "");
    const [conversionMargin, setConversionMargin] = useState(selectedAccount?.conversion_margin || "")

    const [isLoading, setIsLoading] = useState(false);


    const newData = {
        metal_type: metalType,
        buy_gst: parseFloat(buygst),
        sell_gst: parseFloat(sellgst),
        conversion_gst: parseFloat(conversiongst),
        transfer_gst: parseFloat(transfergst),
        buy_margin: parseFloat(buyMargin),
        sell_margin: parseFloat(sellMargin),
        transfer_margin: parseFloat(transferMargin),
        conversion_margin: parseFloat(conversionMargin),
        buy_platform_charge_fee: parseFloat(buyplatformChanrge),
        sell_platform_charge_fee: parseFloat(sellplateformCharge),
        transfer_platform_charge_fee: parseFloat(transferplateformcharge),
        conversion_platform_charge_fee: parseFloat(conversionplateformcharge),
    }
    const addPermission = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = selectedAccount ? `${APIPATH}/api/v1/admin/margins/global?id=${selectedAccount.id}`
            : `${APIPATH}/api/v1/admin/margins/global`;
        const method = selectedAccount ? "PATCH" : "POST";
        fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: method,
            mode: "cors",
            body: JSON.stringify(newData)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                if (data.statusCode === 400) {
                    alert(data.message);
                    return;
                }
                alert(data.message);
                closeAfterAPICall();
            })
            .catch((err) => {
                console.log(err);
            }).finally(() => setIsLoading(false))
    }


    return (
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    <h2>Update Rate Margins</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => addPermission(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Select Metal Type* </label>
                            <select required value={metalType} onChange={(e) => setMetalType(e.target.value)}
                                disabled={selectedAccount}
                            >
                                <option value="" disabled>Select Metal</option>
                                <option value="GOLD">Gold</option>
                                <option value="SILVER">Silver</option>
                                {/* <option value="PLATINUM">Platinum</option> */}
                            </select>
                        </div>
                    </div>
                    {/* ----------GST ------------ */}
                    <h2 className={style1.metal_margin_type}>GST(%)</h2>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Buy*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='GST in %' min={0} max={10}
                                value={buygst}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setBuyGst)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Sell*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='GST in %' min={0} max={10}
                                value={sellgst}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setSellgst)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Transfer*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='GST in %' min={0} max={10}
                                value={transfergst}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setTransfergst)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Conversion*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='GST in %' min={0} max={10}
                                value={conversiongst}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setConversiongst)}
                            />
                        </div>
                    </div>
                    {/* <h2 className={style1.metal_margin_type}>Plateform Charges</h2>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Buy*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Plateform Charge in %' min={0} max={10}
                                value={buyplatformChanrge}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setBuyPlatformCharge)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Sell*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Plateform Charge in %' min={0} max={10}
                                value={sellplateformCharge}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setSellplateformCharge)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Transfer*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Plateform Charge in %' min={0} max={10}
                                value={transferplateformcharge}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setTransferplateformcharge)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Conversion*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Plateform Charge in %' min={0} max={10}
                                value={conversionplateformcharge}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setConversionplateformcharge)}
                            />
                        </div>
                    </div> */}
                    <h2 className={style1.metal_margin_type}>Margin(%)</h2>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Buy*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Margin in %' min={0} max={10} value={buyMargin}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setBuyMargin)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Sell*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Plateform Charge in %' min={0} max={10}
                                value={sellMargin}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setSellMargin)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Transfer*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Plateform Charge in %' min={0} max={10}
                                value={transferMargin}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setTransferMargin)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Conversion*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Plateform Charge in %' min={0} max={10}
                                value={conversionMargin}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setConversionMargin)}
                            />
                        </div>
                    </div>

                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>
                                {selectedAccount ? "Update" : "Add"}
                            </button>
                        </div>
                    }
                </form>
            </div>
        </div>
    )
}

export default AddNewGlobalMargin;