import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL
const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setselectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [token, setToken] = useState(localStorage.getItem("token") || null)
    const [loadingUser, setLoadingUser] = useState(true)

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/data", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (data.success) {
                setUser(data.user)
            } else {
                toast.error("some thing went wrong")
            }
        } catch (error) {
            toast.error(error?.message)
        } finally {
            setLoadingUser(false);
        }
    }

    const craeteNewchat = async () => {
        try {
            if (!user) return toast('Login to create a new Chat')
            navigate('/')
            await axios.get('/api/chat/create', { headers: {Authorization: `Bearer ${localStorage.getItem("token")}`} })
            await fetchUsersChats();
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUsersChats = async () => {
        try {
            const { data } = await axios.get('/api/chat/get', { headers: {Authorization: `Bearer ${localStorage.getItem("token")}`} })
            if (data.sucess) {
                setChats(data.chats)
                if (data.chats.length === 0) {
                    await craeteNewchat();
                    return fetchUsersChats()
                } else {
                    setselectedChat(data.chats[0])
                }
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
        localStorage.setItem("theme", theme)
    }, [theme])


    useEffect(() => {
        if (user) {

            fetchUsersChats()
        } else {
            setselectedChat([]);
            setselectedChat(null);
        }
    }, [])
    useEffect(() => {
        if (token) {

            fetchUser()
        } else {
            setUser(null)
            setLoadingUser(false)
        }
    }, [token])

    const value = {
        navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setselectedChat, theme, setTheme, craeteNewchat, loadingUser, fetchUsersChats, token, setToken, axios
    }
    return (
        <AppContext.Provider value={value}>
            {children}

        </AppContext.Provider>

    )
}

export const useAppContext = () => useContext(AppContext)