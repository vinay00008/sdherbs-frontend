import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axiosConfig';
import defaultLogo from '../assets/logo.png'; // Fallback to existing logo

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        logo: defaultLogo,
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/settings');
            if (res.data && res.data.logo) {
                setSettings(prev => ({ ...prev, logo: res.data.logo }));
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, loading, fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
