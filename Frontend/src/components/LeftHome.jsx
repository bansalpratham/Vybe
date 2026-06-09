import React from 'react'
import logo from '../assets/logo.png'
import { FaRegHeart } from "react-icons/fa";
import dp from "../assets/dp.png"
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import OtherUser from './OtherUser';
import { useNavigate } from 'react-router-dom';

function LeftHome() {
    const {userData , suggestedUsers} = useSelector(state=>state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [unreadCount, setUnreadCount] = React.useState(0)
    
    const handleLogOut = async()=>{
        try {
            await axios.get(`${serverUrl}/api/auth/signout`,{withCredentials: true})
            dispatch(setUserData(null))
            navigate("/signin")
        } catch (error) {
            console.log(error)
        }
    }

    React.useEffect(() => {
        const checkNotifications = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/notification`, { withCredentials: true })
                const unread = res.data.filter(n => !n.isRead).length
                setUnreadCount(unread)
            } catch (err) {
                console.log(err)
            }
        }
        if (userData) {
            checkNotifications()
        }
    }, [userData])

  return (
    <div className='w-[25%] hidden lg:flex flex-col min-h-screen bg-neutral-950 border-r border-white/5 py-6 px-4 gap-6 sticky top-0 h-screen'>
      {/* BRAND HEADER */}
      <div className='w-full flex items-center justify-between px-2'>
        <img src={logo} alt="VYBE logo" className='w-22 cursor-pointer' onClick={() => navigate("/")} />
        <div 
          className="p-2 hover:bg-white/5 rounded-full cursor-pointer transition-colors duration-200 relative" 
          onClick={() => navigate("/notifications")}
        >
          <FaRegHeart className='text-white w-6 h-6' />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
          )}
        </div>
      </div>
      
      {/* ACTIVE USER WIDGET */}
      <div className='flex items-center w-full justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/5'>
        <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate(`/profile/${userData?.userName}`)}>
          <div className='w-14 h-14 rounded-full overflow-hidden border border-white/10'>
            <img src={userData?.profileImage || dp} alt="User Avatar" className='w-full h-full object-cover' />
          </div>
          <div className="flex flex-col">
            <div className='text-[16px] text-white font-bold tracking-wide hover:underline'>{userData?.userName}</div>
            <div className='text-[13px] text-gray-400 font-medium truncate max-w-28'>{userData?.name}</div>
          </div>
        </div>
        <button 
          className='text-[13px] text-red-400 font-bold hover:text-red-300 transition-colors duration-200 cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-red-500/10' 
          onClick={handleLogOut}
        >
          Logout
        </button>
      </div>

      {/* SUGGESTED USERS CONTAINER */}
      <div className='w-full flex flex-col gap-4 mt-4'>
        <h2 className='text-white font-bold text-[17px] tracking-wider px-2'>SUGGESTIONS</h2>
        <div className="flex flex-col gap-3">
          {suggestedUsers && suggestedUsers.slice(0,4).map((user,index)=>(
            <OtherUser key={user?._id || index} user={user} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default LeftHome
