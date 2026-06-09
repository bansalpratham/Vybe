import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import ForgotPassword from './Pages/ForgotPassword'
import Home from './Pages/Home'
import { useSelector } from 'react-redux'
import getCurrentUser from './hooks/getCurrentUser'
import getSuggestedUsers from './hooks/getSuggestedUsers'
import Profile from './Pages/Profile'
import EditProfile from './Pages/EditProfile'
import Upload from './Pages/Upload'
import getAllPost from './hooks/getAllPost'
import Loops from './Pages/Loops'
import getAllLoops from './hooks/getAllLoops'
import Story from './Pages/Story'
import getAllStories from './hooks/getAllStories'
export const serverUrl = "http://localhost:8000"
function App() {
  getCurrentUser()
  getSuggestedUsers()
  getAllPost()
  getAllLoops()
  getAllStories()
  const {userData} = useSelector(state=>state.user)
  return (
    <Routes>
      <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"} />} />
      <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"} />} />
      <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"} />} />
      <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"} />} />
      <Route path='/profile/:userName' element={userData?<Profile/>:<Navigate to={"/signin"} />} />
    <Route path='/editprofile' element={userData?<EditProfile/>:<Navigate to={"/signin"} />} />
      <Route path='/upload' element={userData?<Upload/>:<Navigate to={"/signin"} />} />
    <Route path='/loops' element={userData?<Loops/>:<Navigate to={"/signin"} />} />
    <Route path='/story/:userName' element={userData?<Story/>:<Navigate to={"/signin"} />} />
    </Routes>
  )
}

export default App
