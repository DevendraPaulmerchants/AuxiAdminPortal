import React, { useState } from 'react';
import style from '../MerchantManagement/Merchants.module.css';
import styles from './RateManagement.module.css';
import { handleInputChangeWithNumericValueOnly } from '../InputValidation/InputValidation';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { APIPATH } from '../apiPath/apipath';
import { useContextData } from '../Context/Context';

function AddNewRate({ close,updateList }) {
  const { token } = useContextData()
  const [goldRate, setGoldRate] = useState('');
  const [silverRate, setSilverRate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const rateData = {
    GOLD: goldRate,
    SILVER: silverRate
  }

  const handleCreditAction = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(`${APIPATH}/api/v1/admin/rates`, {
      headers: {
        'Authorization': `Barear ${token}`,
        'Content-Type': "Application/json"
      },
      method: "POST",
      body: JSON.stringify(rateData),
      mode: "cors"
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert(data.message);
        close();
        updateList();
        navigate("/exchange");
      })
      .catch((err) => {
        console.error(err);
      }).finally(() => setIsLoading(false))
  }

  return <div className={style.add_merchants_parent}>
    <div className={style.add_merchants_form_container} style={{ maxWidth: '500px' }}>
      <div className={style.add_merchants_header}>
        <h2>Add Metal rate Manually</h2>
        <h3 onClick={close}><IoMdClose /></h3>
      </div>
      <form onSubmit={(e) => handleCreditAction(e)}>
        <div className={styles.metal_and_rate}>
          <h3>Gold</h3>
          <input type='text' placeholder='Enter gold rate' required value={goldRate} onChange={(e) => handleInputChangeWithNumericValueOnly(e, setGoldRate)} />
        </div>
        <div className={styles.metal_and_rate}>
          <h3>Silver</h3>
          <input type='text' placeholder='Enter silver rate' required value={silverRate} onChange={(e) => handleInputChangeWithNumericValueOnly(e, setSilverRate)} />
        </div>
        {isLoading ? <div className={style.loader_container} style={{margin:'0',padding:'0'}}><div className={style.loader_item}>
          <img src='/gold-coin.png' alt='Gold loading...' />
        </div></div> : <div className={style.approve_and_reject_btn_container}>
          <button className={style.primary_login_btn}>Submit</button>
        </div>
        }
      </form>
    </div>
  </div>

}

export default AddNewRate;