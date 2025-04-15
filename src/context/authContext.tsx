import { createContext, useState, ReactNode, useEffect } from 'react';
import { IFriend, IGroup, IUser } from '../types/IUser';
import axios from '../utils/axios';
import socket from '../utils/socket';



interface authContextProps {
    setFriends: React.Dispatch<React.SetStateAction<IFriend[]>>;
    setGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;
    friends: IFriend[];
    groups: IGroup[];
    user: IUser;
    isAuthenticated: boolean;
    login: (user: IUser) => void;
    logout: () => void;

}

export const authContext = createContext<authContextProps | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [friends, setFriends] = useState<IFriend[]>([]);
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [user, setUser] = useState<IUser>({
        id: 0,
        username: "",
        email: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (userData: IUser) => {
        console.log("This is the users data: ", userData);
        await fetchUserDataOnLogin();
        setUser(userData)
        socket.emit("join_user", userData.id);
    }
    const logout = async () => {
        try {
            await axios.post("/auth/logout", {}, { withCredentials: true }); // Optional logout route
        } catch (err) {
            console.error("Logout error", err);
        }
        setUser({
            id: 0,
            username: "",
            email: "",
        });
        setFriends([])
        setGroups([])
        setIsAuthenticated(false)
    };

    const fetchUserData = async () => {
        try {
            setLoading(true)
            const response = await axios.get("/auth/user", { withCredentials: true });
            const userData: IUser = response.data.user;
            setUser(userData);
            setFriends(response.data.friends)
            setGroups(response.data.groups)
            setIsAuthenticated(true)
            socket.emit("join_user", userData.id);


            console.log("data:", userData);
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false)
        }
    };
    const fetchUserDataOnLogin = async () => {
        try {
            setLoading(true)
            const response = await axios.get("/auth/user", { withCredentials: true });
            setFriends(response.data.friends)
            setGroups(response.data.groups)
            setIsAuthenticated(true)
        } catch (error) {
            console.error("Error fetching user:", error);

        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        fetchUserData();

    }, []);



    if (loading)
        return <div>Loading...</div>;


    return (
        <authContext.Provider
            value={{
                setFriends,
                setGroups,
                friends,
                groups,
                user,
                isAuthenticated,
                login,
                logout,

            }}>
            {children}
        </authContext.Provider>
    );
};

