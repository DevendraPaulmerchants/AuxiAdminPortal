import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import style from "../MerchantManagement/Merchants.module.css";
import style1 from "../Transactions/Transaction.module.css";
import { IoMdClose } from "react-icons/io";
import { dateAndTimeFormat } from '../../helperFunction/helper';

function CustomerDetails({ close, selectedCustomer }) {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return <div className={style.add_merchants_parent}>
        <div className={style.add_merchants_form_container}>
            <div className={style.add_merchants_header}>
                <h2>Customer Details</h2>
                <button className='back_button' onClick={close}><IoMdClose /></button>
            </div>
            {/* -------------- Customer Details -------------- */}
            <div className={style1.customer_detail_container}>
                <h2>Customer Details:</h2>
                <div className={style.list_details}>
                    <h4 className={style.merchant_name}>Name:<span>{selectedCustomer?.full_name || selectedCustomer?.first_name}</span></h4>
                    <h4 className={style.merchant_name}>Email:<span>{selectedCustomer?.email}</span></h4>
                    <h4 className={style.merchant_name}>Mobile:<span>{selectedCustomer?.phone}</span></h4>
                    <h4 className={style.merchant_name}>KYC Level:<span>{selectedCustomer?.kyc_level}</span></h4>
                    <h4 className={style.merchant_name}>KYC Status:<span>{selectedCustomer?.kyc_status}</span></h4>
                    <h4 className={style.merchant_name}>Created At:<span>{dateAndTimeFormat(selectedCustomer?.created_at)}</span></h4>
                </div>
            </div>
            {/* --------- Merchant Details --------------- */}
            <div className={style1.customer_detail_container}>
                <h2>Merchant Details:</h2>
                <div className={style.list_details}>
                    <h4 className={style.merchant_name}>Name:<span>{selectedCustomer?.merchant_name}</span></h4>
                    {selectedCustomer?.agent_name &&
                        <h4 className={style.merchant_name}>Agent Name:<span>{selectedCustomer?.agent_name}</span></h4>
                    }

                </div>
            </div>
            {/* ------------- Payment Details ---------- */}
            <div className={style1.customer_detail_container}>
                <h2>Wallets Details:</h2>
                <div className={style.list_details}>
                    {selectedCustomer?.wallets?.map((wallet_type, id) => (
                        <h4 className={style.merchant_name} key={wallet_type.id}>Avl. {wallet_type.wallet_type}:
                            {wallet_type.wallet_type !== 'FUND' && <span>{wallet_type.metal_quantity || 0} gm </span>
                            }
                            {wallet_type.wallet_type === 'FUND' && <span>{wallet_type.metal_quantity}</span>
                            }
                        </h4>
                    ))}
                </div>
            </div>
        </div>
    </div>
}

export default CustomerDetails;

CustomerDetails.propTypes = {
    close: PropTypes.func.isRequired,
    selectedCustomer: PropTypes.shape({
        full_name: PropTypes.string,
        first_name: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        kyc_level: PropTypes.string,
        kyc_status: PropTypes.string,
        created_at: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        merchant_name: PropTypes.string,
        agent_name: PropTypes.string,
        wallets: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                wallet_type: PropTypes.string,
                metal_quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            })
        )
    })
};


