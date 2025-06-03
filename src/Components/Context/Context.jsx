import React, { createContext, useState, useContext, useEffect, useMemo } from "react";

const Context = createContext();

export const DataProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    // Load token from localStorage on first mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Save token to localStorage whenever it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        }
    }, [token]);

    // ✅ Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({ token, setToken }), [token]);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    );
};

export const useContextData = () => useContext(Context);
