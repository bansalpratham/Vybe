import React from 'react'
import { IoIosHome } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { RxVideo } from "react-icons/rx";
import { CiSquarePlus } from "react-icons/ci";
import dp from "../assets/dp.png"
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Nav() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const {userData} = useSelector(state=>state.user)

  const isActive = (path) => currentPath === path
  const isProfileActive = currentPath.startsWith('/profile') || currentPath === '/editprofile'

  const activeIconClass = 'text-blue-400 scale-120 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] transition-all duration-300 cursor-pointer'
  const inactiveIconClass = 'text-white/60 hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer'

  return (
    <div className='w-[90%] lg:w-[40%] h-18 bg-black/60 backdrop-blur-md flex justify-around items-center fixed bottom-5 rounded-full border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] z-100'>
      <div onClick={() => navigate("/")} className="p-2">
        <IoIosHome className={isActive('/') ? activeIconClass : inactiveIconClass} size={26} />
      </div>
      
      <div onClick={() => navigate("/search")} className="p-2">
        <FaSearch className={isActive('/search') ? activeIconClass : inactiveIconClass} size={22} />
      </div>
      
      <div onClick={() => navigate("/upload")} className="p-2">
        <CiSquarePlus className={isActive('/upload') ? activeIconClass : inactiveIconClass} size={28} />
      </div>
      
      <div onClick={() => navigate("/loops")} className="p-2">
        <RxVideo className={isActive('/loops') ? activeIconClass : inactiveIconClass} size={24} />
      </div>
      
      <div 
        className={`w-9 h-9 rounded-full cursor-pointer overflow-hidden transition-all duration-300 hover:scale-115 ${
          isProfileActive ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-black' : 'border border-white/20'
        }`} 
        onClick={() => navigate(`/profile/${userData.userName}`)}
      >
        <img src={userData.profileImage || dp} alt="Profile" className='w-full h-full object-cover' />
      </div>
    </div>
  )
}

export default Nav
