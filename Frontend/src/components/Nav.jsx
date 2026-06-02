import React from 'react'
import { IoIosHome } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { RxVideo } from "react-icons/rx";
import { CiSquarePlus } from "react-icons/ci";
import dp from "../assets/dp.png"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Nav() {
  const navigate = useNavigate()
  const {userData} = useSelector(state=>state.user)
  return (
    <div className='w-[90%] lg:w-[40%] h-20 bg-black flex justify-around items-center fixed bottom-5 rounded-full shadow-2xl shadow-[#000000] z-100'>
     <div onClick={()=>navigate("/")}> <IoIosHome className='text-white w-6.25 h-6.25 cursor-pointer' /></div>
     <div ><FaSearch className='text-white w-6.25 h-6.25 cursor-pointer' /></div>
     <div onClick={()=>navigate("/upload")}><CiSquarePlus className='text-white w-6.25 h-6.25 cursor-pointer' /></div>
     <div onClick={()=>navigate("/loops")} ><RxVideo className='text-white w-6.25 h-6.25 cursor-pointer' /></div>
      <div className='w-10 h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${userData.userName}`)}>
             <img src={userData.profileImage||dp} alt="" className='w-full object-cover' />
         </div>
    </div>
  )
}

export default Nav
