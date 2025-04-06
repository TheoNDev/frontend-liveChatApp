import { useContext } from "react";
import { authContext } from "../context/authContext";

export const useAuthContext = () => {
    const context = useContext(authContext);
    if (!context) throw new Error('useauthContext must be used within a authContextProvider');
    return context;
};