export const validatePANNumberWithAPI = async (pan) => {
    // http://103.171.97.105:8078/external-module/external/pan_details_v2  Advance API Link
    // http://103.171.97.105:8078/external-module/external/pan_basic_v1 Basic API Link 
    const url=`http://103.171.97.105:8078/external-module/external/pan_details_v2`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 
            'X-Client-ID':"auxi-vault5cf58610-8d34-4f3c-9666-b073a64fdd8d",
            'X-Client-Secret':"Y7a4s-YPd5lbd2mtMjuvWSKekeKvjsNzVPjvYHicEcI",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pan_no:pan }),
        mode:'cors'
    });
    const data = await response.json();
    console.log("PAN API Response:", data);
    return data.data.result;
};