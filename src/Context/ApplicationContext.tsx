import React, { createContext, useContext, useState } from "react";

interface Application {
    id: string;
    formId: string;
    data: any;
}

interface ApplicationContextProps {
    applications: Application[];
    addApplication: (app: Application) => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const ApplicationContext = createContext<ApplicationContextProps | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const addApplication = (app: Application) => {
        setApplications((prev) => [...prev, app]);
    };
    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <ApplicationContext.Provider value={{
            applications,
            addApplication,
            isDarkMode,
            toggleDarkMode
        }}>
            {children}
        </ApplicationContext.Provider>
    );
};

export const useApplicationContext = () => {
    const context = useContext(ApplicationContext);
    if (!context) throw new Error("useApplicationContext must be used within ApplicationProvider");
    return context;
};
