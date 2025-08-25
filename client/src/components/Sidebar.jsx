import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'
import toast from 'react-hot-toast'

const Sidebar = ({ isMenuOpen, setisMenuOpen }) => {

    const { chats, selectedchats, theme, setTheme, user, navigate, setselectedChat, craeteNewchat, axios, setChats, fetchUsersChats, setToken } = useAppContext()
    const [search, setsearch] = useState("")

    const logOut = () => {
        localStorage.removeItem('token')
        setToken(null);
        toast.success('Logged Out SucessFully ')
    }

    const deleteChat = async (e, chatId) => {
        try {
            e.stopPropagation();
            const confirm = window.confirm('Are You Sure You Want to delete this chat ?')
            if (!confirm) return
            const { data } = await axios.post('/api/chat/delete', { chatId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }

            })
            if (data.sucess) {
                setChats(prev => prev.filter(chat => chat._id !== chatId))
                await fetchUsersChats();
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    return (
        <div
            className={`
    flex flex-col h-screen min-w-72 p-5 
    bg-white dark:bg-gradient-to-b dark:from-[#1a1a1d] dark:to-[#0d0d0f] 
    border-r border-gray-200 dark:border-[#80609f]/30 
    transition-all duration-500 max-md:absolute left-0 z-1 ${!isMenuOpen && 'max-md:-translate-x-full'}
  `}
        >


            <img src={theme === "dark" ? assets.logo_full : assets.logo_full_dark} className='w-full max-w-48:' alt="" />
            <button onClick={craeteNewchat} className='flex justify-center items-center w-full py-2 mt-10 text-white  bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer'><span className='mr-2 text-xl'>+</span>New Chat</button>
            <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md'>
                <img src={assets.search_icon} className='w-4 not-dark:invert' alt="" />
                <input onChange={(e) => setsearch(e.target.value)} value={search} type="text" placeholder='Search Conversations' className='text-xs placeholder:text-gray-400 outline-none' />
            </div>

            {chats.length > 0 && <p className='mt-4 text-sm'>Recent Chats</p>}
            <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3'>
                {
                    chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLocaleLowerCase()) : chat.name.toLowerCase().includes(search.toLocaleLowerCase())).map((chat) => (
                        <div onClick={() => { navigate("/"); setselectedChat(chat); setisMenuOpen(false) }} key={chat._id} className='p-2 px-4 dark:bg-[#57317c]/10 border border-gray-300 dark:border-[#80609f]/15 rounded-md cursor-pointer flex justify-between group'>
                            <div>
                                <p className='truncate w-full'> {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}</p>
                                <p className='text-xs text-gray-500 dark:text-[#B1A6C0]'>{moment(chat.updatedAt).fromNow()}</p>
                            </div>
                            <img onClick={e => toast.promise(deleteChat(e, chat._id), { loading: 'deleting...' })} src={assets.bin_icon} className='hidden group-hover:block w-4 cursor-pointer not-dark:invert' alt="" />
                        </div>
                    ))
                }
            </div>

            {/* <div onClick={() => { navigate("/community"); setisMenuOpen(false) }} className='flex items-center gap-2 p-3 mt-4  border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'>
                <img src={assets.gallery_icon} className='w-4.5 not-dark:invert' alt="" />
                <div className='flex flex-col text-sm'>
                    <p>Coummunity Images</p>
                </div>
            </div> */}


            <div onClick={() => { navigate("/credits"); setisMenuOpen(false) }} className='flex items-center gap-2 p-3 mt-4  border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'>
                <img src={assets.diamond_icon} className='w-4.5 dark:invert' alt="" />
                <div className='flex flex-col text-sm'>
                    <p>credits : {user?.credits}</p>
                    <p className='text-xs text-gray-400'>Purchase Credits to use quickgpt</p>
                </div>
            </div>



            <div className='flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md'>
                <div className='flex items-center gap-2 text-sm'>
                    <img src={assets.theme_icon} className='w-4 not-dark:invert' alt="" />
                    <p>Dark Mode</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={theme === "dark"}
                        onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="sr-only peer"
                    />

                    <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-colors"></div>

                    <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
                </label>
            </div>


            <div className='flex items-center gap-3 p-3 mt-4  border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group'>
                <img src={assets.user_icon} className='w-7 rounded-full not-dark:invert' alt="" />
                <p className='flex-1 text-sm dark:text-primary truncate'>{user ? user.name : "Login Your Account"}</p>
                {user && <img onClick={logOut} src={assets.logout_icon} className='h-5 cursor-pointer hidden not-dark:invert group-hover:block'></img>}
            </div>

            <img onClick={() => setisMenuOpen(false)} src={assets.close_icon} className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' alt="" />
        </div>
    )
}

export default Sidebar