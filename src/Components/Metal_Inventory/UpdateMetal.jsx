import React, { useState } from 'react';
import style from "../MerchantManagement/Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { handleInputChangeWithAlphabetOnly, handleInputChangeWithNumericValueOnly, } from '../InputValidation/InputValidation';
import { APIPATH } from '../apiPath/apipath';

function UpdateMetal({ close, selectedMetal,updateList }) {
    document.body.style.overflow = "hidden";
    console.log(selectedMetal)
    const [metalName, setMetalName] = useState(selectedMetal?.metal_type || '');
    const [physicalWeight, setPhysicalWeight] = useState(selectedMetal?.total_physical_weight || '');
    const [vaultproviderName,setVaultProviderName]=useState(selectedMetal?.vault_provider || "");
    const [storageLocation,setStorageLocation]=useState(selectedMetal?.storage_location || "")
    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false);

    const updatedData = {
        // id: selectedMetal?.id,
        metal_type: metalName,
        total_physical_weight: physicalWeight,
        vault_provider:vaultproviderName,
        storage_location:storageLocation,
        description: description,
    }

    const handleFormData = (e) => {
        e.preventDefault();
       fetch(`${APIPATH}/api/v1/admin/storage/${selectedMetal?.metal_type.toLowerCase()}?id=${selectedMetal?.id}`,{
        headers:{
            'Authorization':`Barear `,
            'Content-Type':'Application/json'
        },
        method:'PATCH',
        body:JSON.stringify(updatedData),
        mode:'cors'
       }).then((res)=>res.json())
       .then((data)=>{
        console.log(data);
        alert(data.message);
        close();
        updateList();
       })
       .catch(err=>console.error(err))
       .finally(()=>setIsLoading(false))

    }

    return (
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} >
                <div className={style.add_merchants_header}>
                    <h2>Update Metal Details</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => {
                    handleFormData(e);
                    setIsLoading(true)
                }}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Metal Type* </label>
                            <input type='text' required placeholder='Enter metal name' maxLength={30} value={metalName}
                                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setMetalName)}
                                readOnly
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Physical Weight* </label>
                            <input type='text' required placeholder='Enter wieght of metal' maxLength={30} value={physicalWeight}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setPhysicalWeight)}
                            />
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Vault provider* </label>
                            <input type='text' required placeholder='Enter vault provider name' maxLength={50} value={vaultproviderName}
                                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setVaultProviderName)}
        
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Storage Location*</label>
                            <input type='text' required placeholder='Enter Storage location' maxLength={30} value={storageLocation}
                                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setStorageLocation)}
                            />
                        </div>
                    </div>
                    <div className={style.name_label_input_contaner}>
                        <div className={style.name_label_input_contaner} >
                            <label>Description </label>
                            <textarea type='text' placeholder='write description..' value={description} style={{width:"98%"}}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div >
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>Update</button>
                        </div>
                    }
                </form>
            </div>
        </div>
    )
}

export default UpdateMetal;