import React from 'react';
import style from '../MerchantManagement/Merchants.module.css';

function Loader() {

    return <div className={style.loader_container}><div className={style.loader_item}>
        <img src='/gold-coin.png' alt='Loading' />
    </div></div>
}

export default Loader;