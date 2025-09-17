export const validatePANNumberWithAPI = async (pan) => {
    // http://103.171.97.105:8078/external-module/external/pan_details_v2  Advance API Link
    // http://103.171.97.105:8078/external-module/external/pan_basic_v1 Basic API Link 
    const url=`https://svcdemo.digitap.work/validation/kyc/v1/pan_details_plus`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 
            'Authorization':`Basic MTU4Mjk1MDE6NEFzRmxFYXQ4aXNlc0R0T0ptMXhOTjMyM2o0V2JaUUg=`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ client_ref_num:pan,pan:pan }),
        mode:'cors'
    });
    const data = await response.json();
    console.log("PAN API Response:", data);
    return data.result;
};