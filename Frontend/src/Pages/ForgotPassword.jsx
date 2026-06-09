import axios from 'axios'
import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { serverUrl } from '../App'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
    const navigate = useNavigate()
    const [step,setStep] = useState(1)
    const [focusedField, setFocusedField] = useState("")
    
    const [email,setEmail] = useState("")
    const [otp,setOtp] = useState("")
    const [newPassword,setNewPassword] = useState("")
    const [confirmNewPassword,setConfirmNewPassword] = useState("")
    const [loading,setLoading] = useState(false)
    const [err,setErr] = useState("")

    const handleStep1 = async()=>{
        if (!email) {
            setErr("Email is required")
            return
        }
        setLoading(true)
        setErr("")
        try {
           const result = await axios.post(`${serverUrl}/api/auth/sendOtp`,{email},{withCredentials: true})
           console.log(result.data)
           setStep(2)
           setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setErr(error.response?.data?.message || "Failed to send OTP")
        }
    }

    const handleStep2 = async()=>{
        if (!otp) {
            setErr("OTP is required")
            return
        }
        setLoading(true)
        setErr("")
        try {
           const result = await axios.post(`${serverUrl}/api/auth/verifyOtp`,{email,otp},{withCredentials: true})
           console.log(result.data)
           setStep(3)
           setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setErr(error.response?.data?.message || "Invalid OTP")
        }
    }

    const handleStep3 = async()=>{
          if (!newPassword || !confirmNewPassword) {
              setErr("All fields are required")
              return
          }
          if (newPassword !== confirmNewPassword)
          {
              return setErr("Passwords Do not match")
          }
          setErr("")
          setLoading(true)
        try {
           const result = await axios.post(`${serverUrl}/api/auth/resetPassword`,{email,password:newPassword},{withCredentials: true})
           console.log(result.data)
           setLoading(false)
           navigate("/signin")
        } catch (error) {
            console.log(error)
            setLoading(false)
            setErr(error.response?.data?.message || "Password reset failed")
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
    <div className='w-full h-screen bg-linear-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
      
      {/* STEP 1: Enter Email */}
      {step===1 && (
        <div className='w-[90%] max-w-120 p-8 bg-white rounded-2xl flex justify-center items-center flex-col border border-white/10 shadow-2xl gap-5'>
          <h2 className='text-[26px] font-bold text-black text-center mb-2'>Forgot Password</h2>
          
          <div className={containerClass('email')}>
            <label htmlFor="email" className={labelClass('email', email)}>Email Address</label>
            <input 
              type="email" 
              id='email' 
              className='w-full h-full rounded-2xl px-4 outline-none border-0 text-[15px]' 
              required 
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField("")}
              onChange={(e)=>setEmail(e.target.value)} 
              value={email} 
            />
          </div>
          
          {err && <p className='text-red-500 text-sm font-semibold'>{err}</p>}
          
          <button 
            className='w-[80%] py-3 bg-black hover:bg-neutral-800 text-white font-semibold text-[16px] cursor-pointer rounded-2xl transition-all duration-200 active:scale-98 shadow-md flex justify-center items-center'
            disabled={loading} 
            onClick={handleStep1} 
          >
            {loading ? <ClipLoader size={22} color='white' /> : "Send OTP"}
          </button>
          
          <p 
            className='cursor-pointer text-[14px] text-gray-500 hover:text-black transition-colors font-medium border-b border-transparent hover:border-black pb-0.5 mt-2'
            onClick={() => navigate("/signin")}
          >
            Back to Sign In
          </p>
        </div>
      )}

      {/* STEP 2: Enter OTP */}
      {step===2 && (
        <div className='w-[90%] max-w-120 p-8 bg-white rounded-2xl flex justify-center items-center flex-col border border-white/10 shadow-2xl gap-5'>
          <h2 className='text-[26px] font-bold text-black text-center mb-2'>Verify OTP</h2>
          
          <div className={containerClass('otp')}>
            <label htmlFor="otp" className={labelClass('otp', otp)}>Enter 4-Digit OTP</label>
            <input 
              type="text" 
              id='otp' 
              className='w-full h-full rounded-2xl px-4 outline-none border-0 text-[15px]' 
              required 
              onFocus={() => setFocusedField("otp")}
              onBlur={() => setFocusedField("")}
              onChange={(e)=>setOtp(e.target.value)} 
              value={otp} 
            />
          </div>
          
          {err && <p className='text-red-500 text-sm font-semibold'>{err}</p>}
          
          <button 
            className='w-[80%] py-3 bg-black hover:bg-neutral-800 text-white font-semibold text-[16px] cursor-pointer rounded-2xl transition-all duration-200 active:scale-98 shadow-md flex justify-center items-center'
            disabled={loading} 
            onClick={handleStep2} 
          >
            {loading ? <ClipLoader size={22} color='white' /> : "Submit OTP"}
          </button>
          
          <p 
            className='cursor-pointer text-[14px] text-gray-500 hover:text-black transition-colors font-medium border-b border-transparent hover:border-black pb-0.5 mt-2'
            onClick={() => { setStep(1); setErr(""); }}
          >
            Request New OTP
          </p>
        </div>
      )}

      {/* STEP 3: Reset Password */}
      {step===3 && (
        <div className='w-[90%] max-w-120 p-8 bg-white rounded-2xl flex justify-center items-center flex-col border border-white/10 shadow-2xl gap-5'>
          <h2 className='text-[26px] font-bold text-black text-center mb-2'>Reset Password</h2>
          
          <div className={containerClass('newPassword')}>
            <label htmlFor="newPassword" className={labelClass('newPassword', newPassword)}>Enter New Password</label>
            <input 
              type="password" 
              id='newPassword' 
              className='w-full h-full rounded-2xl px-4 outline-none border-0 text-[15px]' 
              required 
              onFocus={() => setFocusedField("newPassword")}
              onBlur={() => setFocusedField("")}
              onChange={(e)=>setNewPassword(e.target.value)} 
              value={newPassword} 
            />
          </div>
          
          <div className={containerClass('confirmNewPassword')}>
            <label htmlFor="confirmNewPassword" className={labelClass('confirmNewPassword', confirmNewPassword)}>Confirm Password</label>
            <input 
              type="password" 
              id='confirmNewPassword' 
              className='w-full h-full rounded-2xl px-4 outline-none border-0 text-[15px]' 
              required 
              onFocus={() => setFocusedField("confirmNewPassword")}
              onBlur={() => setFocusedField("")}
              onChange={(e)=>setConfirmNewPassword(e.target.value)} 
              value={confirmNewPassword} 
            />
          </div>
          
          {err && <p className='text-red-500 text-sm font-semibold'>{err}</p>}
          
          <button 
            className='w-[80%] py-3 bg-black hover:bg-neutral-800 text-white font-semibold text-[16px] cursor-pointer rounded-2xl transition-all duration-200 active:scale-98 shadow-md flex justify-center items-center'
            disabled={loading} 
            onClick={handleStep3} 
          >
            {loading ? <ClipLoader size={22} color='white' /> : "Reset Password"}
          </button>
        </div>
      )}

    </div>
  )
}

export default ForgotPassword
