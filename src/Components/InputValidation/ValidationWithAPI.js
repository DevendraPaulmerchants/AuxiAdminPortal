import { APIPATH } from "../apiPath/apipath";

export const validatePANNumberWithAPI = async (pan) => {
    //  const { token } = useContextData();
    const token =localStorage.getItem('token');
    // http://103.171.97.105:8078/external-module/external/pan_details_v2  Advance API Link
    // http://103.171.97.105:8078/external-module/external/pan_basic_v1 Basic API Link
    const url=`${APIPATH}/api/v1/admin/digitaps/verify-pan`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization':`Basic ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ client_ref_num:pan,pan:pan }),
        mode:'cors'
    });
    const data = await response.json();
    console.log("PAN API Response:", data);
    return data.data.result;
};
