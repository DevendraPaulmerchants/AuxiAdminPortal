import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import { APIPATH } from "../apiPath/apipath";

const Context = createContext();

export const DataProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [merchantList, setMerchantList] = useState([]);
    const [merchantLoading, setMerchantLoading] = useState(false);

    // Load token from localStorage on first mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Save token to localStorage 
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        }
    }, [token]);

    // Merchant List ----------------------------
    useEffect(() => {
        if (!token) return;
        setMerchantLoading(true);
        fetch(`${APIPATH}/api/v1/admin/merchants/list`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setMerchantList(data.data);
            })
            .catch((err) => {
                console.error("Error fetching merchant list:", err);
            })
            .finally(() => {
                setMerchantLoading(false);
            });
    }, [token]);


    // ✅ Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({ token, setToken, merchantLoading, merchantList }), [token, merchantLoading, merchantList]);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    );
};

export const useContextData = () => useContext(Context);
