import React, {createContext, useContext, useState} from 'react';

interface SidebarContextType {
    isOpen: boolean;
    toggleSidebar: () => void;
    setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within SidebarProvider');
    }
    return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <SidebarContext.Provider value={{isOpen, toggleSidebar, setIsOpen}}>
            {children}
        </SidebarContext.Provider>
    );
};