import React, { useState } from 'react'
import logo from '../assets/logo2.png'
import logo1 from '../assets/logo.png'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios'
import { serverUrl } from '../App';
import { ClipLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignIn() {
  const [focusedField, setFocusedField] = useState("")
  const [showPassword,setShowPassword] = useState(false)
  const [loading,setLoading] = useState(false)
  const [userName,setUserName] = useState("")
  const [password,setPassword] = useState("")
  const [err,setErr] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignIn = async()=>{
    if (!userName || !password) {
      setErr("Please fill in all fields")
      return
    }
    setLoading(true)
    setErr("")
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signin`,{userName,password},{withCredentials: true})
      dispatch(setUserData(result.data))
      setLoading(false)
    } catch (error) {
      console.log(error)  
      setLoading(false)  
      setErr(error.response?.data?.message || "Sign in failed")  
    }
  }

  const labelClass = (field, value) => {
    const isActive = value || focusedField === field
    return `text-gray-500 absolute left-4 px-1.5 bg-white text-[14px] transition-all duration-200 pointer-events-none select-none ${
      isActive ? "-top-2.5 text-xs text-black font-bold" : "top-3.5"
    }`
  }

  const containerClass = (field) => {
    const isFocused = focusedField === field
    return `relative flex items-center justify-start w-[90%] h-13 rounded-2xl border-2 transition-all duration-200 ${
      isFocused ? 'border-black ring-2 ring-black/5' : 'border-gray-300'
    }`
  }

  return (
    <div className="w-full h-screen bg-linear-to-b from-black to-gray-900 flex flex-col justify-center items-center">
      <div className='w-[90%] lg:max-w-[60%] h-150 bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23] shadow-2xl'>
        <div className='w-full lg:w-[50%] justify-center h-full bg-white flex flex-col items-center p-6 gap-6'>
          <div className='flex gap-2 items-center text-[22px] font-bold mt-6'>
            <span>Sign In to</span>
            <img src={logo} alt="VYBE" className='w-18' />
          </div>

          {/* Username Input */}
          <div className={containerClass('userName')}>
            <label htmlFor="userName" className={labelClass('userName', userName)}>Username</label>
            <input 
              type="text" 
              id='userName' 
              className='w-full h-full rounded-2xl px-4 outline-none border-0 text-[15px]' 
              required 
              onFocus={() => setFocusedField("userName")}
              onBlur={() => setFocusedField("")}
              onChange={(e) => setUserName(e.target.value)} 
              value={userName} 
            />
          </div>

          {/* Password Input */}
          <div className={containerClass('password')}>
            <label htmlFor="password" className={labelClass('password', password)}>Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              id='password' 
              className='w-full h-full rounded-2xl px-4 pr-12 outline-none border-0 text-[15px]' 
              required 
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField("")}
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
            />
            <div className="absolute right-4 cursor-pointer text-gray-500 hover:text-black transition-colors">
              {!showPassword ? (
                <FaEye size={20} onClick={() => setShowPassword(true)} />
              ) : (
                <FaEyeSlash size={20} onClick={() => setShowPassword(false)} />
              )}
            </div>
          </div>

          <div 
            className='w-[90%] px-2 text-[14px] font-semibold text-gray-500 hover:text-black cursor-pointer transition-colors self-start ml-4' 
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </div>

          {err && <p className='text-red-500 text-sm font-semibold'>{err}</p>}

          <button 
            className='w-[80%] py-3 bg-black hover:bg-neutral-800 text-white font-semibold text-[16px] cursor-pointer rounded-2xl mt-4 transition-all duration-200 active:scale-98 shadow-md flex justify-center items-center'
            onClick={handleSignIn} 
            disabled={loading}
          >
            {loading ? <ClipLoader size={22} color='white' /> : "Sign In"}
          </button>
          
          <p 
            className='cursor-pointer text-[14px] text-gray-500 hover:text-black transition-colors font-medium mt-2'
            onClick={() => navigate("/signup")}
          >
            New to Vybe? <span className='text-black font-bold border-b border-black pb-0.5 hover:border-b-2'>Sign Up</span>
          </p>

        </div>
        
        <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center bg-black flex-col gap-3 text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl'>
          <img src={logo1} alt="VYBE logo" className='w-[35%]' />
          <p className="tracking-widest text-sm text-gray-400 font-bold">NOT JUST A PLATFORM, IT'S A VYBE</p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
