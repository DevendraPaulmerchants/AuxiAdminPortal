import React from 'react';
import style from "../MerchantManagement/Merchants.module.css";
// import style1 from "./Transaction.module.css";
import style1 from "../Transactions/Transaction.module.css";
import style2 from "./Metal.module.css"
import { IoMdClose } from "react-icons/io";
import { capitalizeWord } from '../InputValidation/InputValidation';
import { dateAndTimeFormat } from '../../helperFunction/helper';

function MetalLogsDetails({ close, selectedMetal }) {
    document.body.style.overflow = "hidden";
    console.log(selectedMetal);

    return <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container}>
                <div className={style.add_merchants_header}>
                    <h2>Details of <b>{capitalizeWord(selectedMetal?.action_type)}</b> transaction</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                {/* -------------- Customer Details -------------- */}
              
                {selectedMetal?.action_type === "BUY" &&
                    <div className={`${style1.customer_detail_container} ${style2.action_type}`}>
                        <div>
                            <h2>Metal :</h2>
                            <p>Name : {selectedMetal?.metal_type}</p>
                            <p>Weight : {selectedMetal?.weight || 0} gm</p>
                            <p>Rate : ₹ {selectedMetal?.price_per_unit?.toFixed(2) || 0}/gm</p>
                            <p>Paid By Customer : ₹ {selectedMetal?.total_value?.toFixed(2) || 0}</p>
                        </div>
                        <div>
                            <h2>After Transaction :</h2>
                            <p>Weight : {selectedMetal?.remaining_stock_weight || 0} gm</p>
                        </div>
                    </div>
                }
                 {selectedMetal?.action_type === "SELL" &&
                    <div className={`${style1.customer_detail_container} ${style2.action_type}`}>
                        <div>
                            <h2>Source Metal :</h2>
                            <p>Name : {selectedMetal?.metal_type}</p>
                            <p>Weight : {selectedMetal?.weight || 0} gm</p>
                            <p>Rate : ₹ {selectedMetal?.price_per_unit?.toFixed(2) || 0}/gm</p>
                            <p>Paid to Customer : ₹ {selectedMetal?.total_value?.toFixed(2) || 0}</p>
                        </div>
                        <div>
                            <h2>Remaining Source Metal :</h2>
                            <p>Weight : {selectedMetal?.remaining_stock_weight || 0} gm</p>
                        </div>
                    </div>
                }
                {selectedMetal?.action_type === "TRANSFER" &&
                    <div className={`${style1.customer_detail_container} ${style2.action_type}`}>
                        <div>
                            <h2>Source Metal :</h2>
                            <p>Name : {selectedMetal?.source_metal_type}</p>
                            <p>Weight : {selectedMetal?.source_weight || 0} gm</p>
                            <p>Total Cost : ₹ {selectedMetal?.source_metal_cost || 0}</p>
                        </div>
                        <div>
                            <h2>Target Metal :</h2>
                            <p>{selectedMetal?.target_metal_type}</p>
                            <p>{selectedMetal?.target_weight || 0} gm</p>
                        </div>
                    </div>
                }
                <div className={style1.customer_detail_container}>
                    <h2>Remarks:</h2>
                    <p>{selectedMetal?.remarks}</p>
                </div>
                <div className={style1.customer_detail_container}>
                    <h2>Transaction Status:</h2>
                    <p>{selectedMetal?.transaction_status}</p>
                </div>
                <div className={style1.customer_detail_container} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h2>Initiated At:</h2>
                        <p>{dateAndTimeFormat(selectedMetal?.created_at)}</p>
                    </div>
                    <div>
                        <h2>Updated At:</h2>
                        <p>{dateAndTimeFormat(selectedMetal?.updated_at)}</p>
                    </div>
                </div>
                {/* --------- Merchant Details --------------- */}
               
            </div>
        </div>

}

export default MetalLogsDetails; 