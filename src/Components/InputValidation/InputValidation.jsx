import { validatePANNumberWithAPI } from "./ValidationWithAPI";

export const CamelCase = (str) => {
    if (typeof str !== 'string') return '';
    let finalString = [];
    const requiredString = str.split(" ");
    for (var i = 0; i < requiredString.length; i++) {
        finalString.push(
            requiredString[i].charAt(0).toUpperCase() + requiredString[i].slice(1).toLowerCase()
        );
    }
    return finalString.join(" ");
}

export const capitalizeWord = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const handleInputChangeWithAlphabetOnly = (e, setValue) => {
    const input = e.target.value;
    const isAlphabetic = /^[a-zA-Z\s]*$/.test(input);
    const sanitizedValue = input.replace(/^\s+|\s+(?=\s)/g, '').replace(/[0-9]/g, '');
    setValue(CamelCase(sanitizedValue));
    // setValid(isAlphabetic);
};
const IsValidemail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export const handleEmailChange = (e, setValue, setValid) => {
    const email = e.target.value;
    setValue(email);
    if (IsValidemail.test(email)) {
        setValid(true);
    }
    else {
        setValid(false);
    }
}
export const handleInputChangeWithNumericValueOnly = (e, setValue) => {
    const input = e.target.value;
    const isAlphabetic = /^[0-9\s]*$/.test(input);
    const sanitizedValue = input.replace(/^\s+|\s+(?=\s)/g, '').replace(/[a-zA-Z]/g, '');
    setValue(CamelCase(sanitizedValue));
    // setValid(isAlphabetic);
};

export const handlePANCardNumber = async (e, setValue, setValid, isLoading, panData) => {
    const input = e.target.value.toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    setValue(input);
    if (panRegex.test(input)) {
        setValid(true);
        if (input.length === 10) {
            try {
                isLoading(true)
                const res = await validatePANNumberWithAPI(input);
                console.log(res);
                panData(res);
                isLoading(false);
            } catch (error) {
                console.error("PAN validation failed:", error);
            }
        }
    } else {
        setValid(false);
    }
};


export const handleGSTNumber = (e, setValue, setValid) => {
    const input = e.target.value.toUpperCase();
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    setValue(input);
    setValid(gstRegex.test(input));
};


export const handleIFSC = (e, setValue, setValid) => {
    const input = e.target.value.toUpperCase();
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    setValue(input);
    if (ifscRegex.test(input)) {
        setValid(true)
    } else {
        setValid(false)
    }
}
export const handleUpiId = (e, setValue, setIsValid) => {
    const value = e.target.value.toLowerCase();
    setValue(value);
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    const isValid = upiRegex.test(value);
    setIsValid(isValid);
};
