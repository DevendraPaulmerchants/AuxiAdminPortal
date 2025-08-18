import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import style from "../MerchantManagement/Merchants.module.css";
import style1 from "./Margin.module.css";
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function AddMarchantMargin({ close, selectedAccount, updateList }) {

    const { token } = useContextData();
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        }
    }, []);
    // const [metalType, setMetalType] = useState(selectedAccount?.metal_type || "");
    // const [margin, setMargin] = useState(selectedAccount?.margin || 0);
    const [schemeName, setSchemeName] = useState(selectedAccount?.name || '')
    // ----------- Gold --------------------------
    const [goldbuymargin, setGoldbuymargin] = useState(selectedAccount?.metal_margins[0]?.buy_margin || 0);
    const [goldsellmargin, setGoldsellmargin] = useState(selectedAccount?.metal_margins[0]?.sell_margin || 0);
    const [goldtransfermargin, setGoldtransfermargin] = useState(selectedAccount?.metal_margins[0]?.transfer_margin || 0);
    const [goldconversionmargin, setGoldconversionmargin] = useState(selectedAccount?.metal_margins[0]?.conversion_margin || 0);
    // ---------------------- Silver ---------------------
    const [silverbuymargin, setSilverbuymargin] = useState(selectedAccount?.metal_margins[2]?.buy_margin || 0);
    const [silversellmargin, setSilversellmargin] = useState(selectedAccount?.metal_margins[2]?.sell_margin || 0);
    const [silvertransfermargin, setSilvertransfermargin] = useState(selectedAccount?.metal_margins[2]?.transfer_margin || 0);
    const [silverconversionmargin, setSilverconversionmargin] = useState(selectedAccount?.metal_margins[2]?.conversion_margin || 0);
    // ----------- Platinum --------------------------
    const [platinumbuymargin, setPlatinumbuymargin] = useState(selectedAccount?.metal_margins[1]?.buy_margin || 0);
    const [platinumsellmargin, setPlatinumsellmargin] = useState(selectedAccount?.metal_margins[1]?.sell_margin || 0);
    const [platinumtransfermargin, setPlatinumtransfermargin] = useState(selectedAccount?.metal_margins[1]?.transfer_margin || 0);
    const [platinumconversionmargin, setPlatinumconversionmargin] = useState(selectedAccount?.metal_margins[1]?.conversion_margin || 0);

    const [isLoading, setIsLoading] = useState(false);

    console.log(selectedAccount);
    // const id = metalType === "gold"
    //     ? selectedAccount?.goldMarginId
    //     : metalType === "silver"
    //         ? selectedAccount?.silverMarginId
    //         : metalType === "platinum"
    //             ? selectedAccount?.platinumMarginId
    //             : null;


    const newMargin = {
        // metal_type: metalType,
        // merchant_id: selectedAccount?.merchant_id,
        // merchant_name:selectedAccount?.merchant_name,
        name: schemeName,
        metal_margins: [
            {
                metal_type: "GOLD",
                buy_margin: parseFloat(goldbuymargin),
                sell_margin: parseFloat(goldsellmargin),
                conversion_margin: parseFloat(goldconversionmargin),
                transfer_margin: parseFloat(goldtransfermargin)
            },
            {
                metal_type: "PLATINUM",
                buy_margin: parseFloat(platinumbuymargin),
                sell_margin: parseFloat(platinumsellmargin),
                conversion_margin: parseFloat(platinumconversionmargin),
                transfer_margin: parseFloat(platinumtransfermargin)
            },
            {
                metal_type: "SILVER",
                buy_margin: parseFloat(silverbuymargin),
                sell_margin: parseInt(silversellmargin),
                conversion_margin: parseFloat(silverconversionmargin),
                transfer_margin: parseFloat(silvertransfermargin)
            }
        ]
    }

    const addPermission = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = selectedAccount ? `${APIPATH}/api/v1/admin/schemes?id=${selectedAccount?.id}`
            : `${APIPATH}/api/v1/admin/schemes`;
        const method = selectedAccount ? "PATCH" : "POST";
        fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: method,
            mode: "cors",
            body: JSON.stringify(newMargin)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setIsLoading(false);
                alert(data.message);
                close();
                updateList();
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }


    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} >
                <div className={style.add_merchants_header}>
                    {selectedAccount ? <h2>Edit Existing Scheme</h2> : <h2>Create New Scheme</h2>}
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => addPermission(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Merchant Name*</label>
                            <input type='text' required placeholder='Enter scheme name..'
                                readOnly={selectedAccount}
                                value={schemeName}
                                onChange={(e) => setSchemeName(e.target.value)}
                            />
                        </div>
                        {/* <div className={style.name_label_input_contaner}>
                            <label>Select Metal Type* </label>
                            <select required value={metalType} onChange={(e) => setMetalType(e.target.value)}>
                                <option value="" disabled>Select Metal</option>
                                <option value="GOLD">Gold</option>
                                <option value="SILVER">Silver</option>
                                <option value="PLATINUM">Platinum</option>
                            </select>
                        </div> */}
                    </div>
                    {/* ----------- Gold Margin -------------------- */}
                    <h2 className={style1.metal_margin_type}>Gold Margin</h2>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Buy*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Margin in %' min={0} max={10} value={goldbuymargin}
                                onChange={(e) => setGoldbuymargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Sell*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Margin in %' min={0} max={10} value={goldsellmargin}
                                onChange={(e) => setGoldsellmargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Transfer*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Margin in %' min={0} max={10} value={goldtransfermargin}
                                onChange={(e) => setGoldtransfermargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Conversion*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Margin in %' min={0} max={10} value={goldconversionmargin}
                                onChange={(e) => setGoldconversionmargin(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* ------------- Silver Margin ---------- */}
                    <h2 className={style1.metal_margin_type}>Silver Margin</h2>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Buy*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Margin in %' min={0} max={10} value={silverbuymargin}
                                onChange={(e) => setSilverbuymargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Sell*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Margin in %' min={0} max={10} value={silversellmargin}
                                onChange={(e) => setSilversellmargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Transfer*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Margin in %' min={0} max={10} value={silvertransfermargin}
                                onChange={(e) => setSilvertransfermargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Conversion*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Margin in %' min={0} max={10} value={silverconversionmargin}
                                onChange={(e) => setSilverconversionmargin(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* ------------------ Platinum Margin ----------- */}
                    <h2 className={style1.metal_margin_type}>Platinum Margin</h2>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Buy*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Margin in %' min={0} max={10} value={platinumbuymargin}
                                onChange={(e) => setPlatinumbuymargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Sell*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Margin in %' min={0} max={10} value={platinumsellmargin}
                                onChange={(e) => setPlatinumsellmargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Transfer*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Margin in %' min={0} max={10} value={platinumtransfermargin}
                                onChange={(e) => setPlatinumtransfermargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Conversion*</label>
                            <input type='decimal' style={{width:'85%'}} required placeholder='Margin in %' min={0} max={10} value={platinumconversionmargin}
                                onChange={(e) => setPlatinumconversionmargin(e.target.value)}
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
    </>
}

export default AddMarchantMargin;