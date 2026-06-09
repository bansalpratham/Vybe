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

function SignUp() {
  const [focusedField, setFocusedField] = useState("")
  const [showPassword,setShowPassword] = useState(false)
  const [loading,setLoading] = useState(false)
  const [name,setName] = useState("")
  const [userName,setUserName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [err,setErr] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignUp = async()=>{
    if (!name || !userName || !email || !password) {
      setErr("All fields are required")
      return
    }
    setLoading(true)
    setErr("")
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`,{name,userName,email,password},{withCredentials: true})
      dispatch(setUserData(result.data))
      setLoading(false)
    } catch (error) {
      setErr(error.response?.data?.message || "Sign up failed")
      console.log(error)  
      setLoading(false)    
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
        <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-6 gap-5 justify-center'>
          <div className='flex gap-2 items-center text-[22px] font-bold mt-2'>
            <span>Sign Up to</span>
            <img src={logo} alt="VYBE" className='w-18' />
          </div>

          {/* Full Name Input */}
          <div className={containerClass('name')}>
            <label htmlFor="name" className={labelClass('name', name)}>Full Name</label>
            <input 
              type="text" 
              id='name' 
              className='w-full h-full rounded-2xl px-4 outline-none border-0 text-[15px]' 
              required 
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField("")}
              onChange={(e) => setName(e.target.value)} 
              value={name} 
            />
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

          {/* Email Input */}
          <div className={containerClass('email')}>
            <label htmlFor="email" className={labelClass('email', email)}>Email Address</label>
            <input 
              type="email" 
              id='email' 
              className='w-full h-full rounded-2xl px-4 outline-none border-0 text-[15px]' 
              required 
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField("")}
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
            />
          </div>

          {/* Password Input */}
          <div className={containerClass('password')}>
            <label htmlFor="password" className={labelClass('password', password)}>Password (Min 6 chars)</label>
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

          {err && <p className='text-red-500 text-sm font-semibold'>{err}</p>}
          
          <button 
            className='w-[80%] py-3 bg-black hover:bg-neutral-800 text-white font-semibold text-[16px] cursor-pointer rounded-2xl mt-2 transition-all duration-200 active:scale-98 shadow-md flex justify-center items-center'
            onClick={handleSignUp} 
            disabled={loading}
          >
            {loading ? <ClipLoader size={22} color='white' /> : "Sign Up"}
          </button>
          
          <p 
            className='cursor-pointer text-[14px] text-gray-500 hover:text-black transition-colors font-medium mt-1'
            onClick={() => navigate("/signin")}
          >
            Already Have An Account? <span className='text-black font-bold border-b border-black pb-0.5 hover:border-b-2'>Sign In</span>
          </p>

        </div>
        
        <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center bg-black flex-col gap-3 text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black'>
          <img src={logo1} alt="VYBE logo" className='w-[35%]' />
          <p className="tracking-widest text-sm text-gray-400 font-bold">NOT JUST A PLATFORM, IT'S A VYBE</p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
