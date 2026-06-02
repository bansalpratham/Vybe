import React, { useState } from 'react'
import dp from "../assets/dp.png"
import VideoPlayer from './VideoPlayer'
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart } from "react-icons/fa6";
import { MdOutlineComment } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import axios from 'axios';
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';

function Post({post}) {
  const {userData} = useSelector(state=>state.user)
  const {postData} = useSelector(state=>state.post)
  const [showComment,setShowComment] = useState(false)
  const [message,setMessage] = useState("")

  const dispatch = useDispatch()

  const handleLike = async()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`,{withCredentials: true})
      const updatedPost = result.data

      const updatedPosts = postData.map(p=>p._id==post._id?updatedPost:p)
      dispatch(setPostData(updatedPosts))
    } catch (error) {
      console.log(error)
    }
  }

  const handleSaved = async()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/post/saved/${post._id}`,{withCredentials: true})
      dispatch(setUserData(result.data))
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleComment = async () => {
  try {
    const result = await axios.post(
      `${serverUrl}/api/post/comment/${post._id}`,
      { message },
      { withCredentials: true }
    );

    const updatedPost = result.data;
    const updatedPosts = postData.map(p =>
      p._id === post._id ? updatedPost : p
    );

    dispatch(setPostData(updatedPosts));
    setMessage("");
  } catch (error) {
    console.log(error);
  }
};

 
  return (
    <div className='w-[90%] flex flex-col gap-2.5 bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl pb-5'>
      <div className='w-full h-20 flex justify-between items-center px-2.5'>
        <div className='flex justify-center items-center md:gap-5 gap-2.5'>
     <div className='w-10 h-10 md:w-15 md:h-15 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
            <img src={post.author?.profileImage || dp} alt="" className='w-full object-cover' />
        </div>
        <div className='w-37.5 font-semibold truncate'>{post.author.userName}</div>
        </div>
        {String(userData._id) !== String(post.author._id) && (
  <FollowButton
    tailwind="px-2.5 w-15 md:w-20 py-1.25 h-7.5 md:h-10 bg-black text-white rounded-2xl"
    targetUserId={post.author._id}
  />
)}
      </div>
      <div className='w-[90%] flex items-center justify-center'>
  {post.mediaType=="image" && <div className='w-[90%] flex items-center justify-center'>
    <img src={post.media} alt=""  className='w-[80%] rounded-2xl object-cover ' />
    </div>}

    {post.mediaType=="video" && <div className='w-[80%] flex flex-col items-center justify-center '>
      <VideoPlayer media={post.media} />
    </div>}
    
        </div> 

      <div className='w-full h-15 flex justify-between items-center px-5 mt-2.5'>
        <div className='flex justify-center items-center gap-2.5'>
      <div className='flex justify-center items-center gap-1.25'>
  {!post.likes.includes(userData._id) ? (
    <FaRegHeart
      className='w-6.25 h-6.25 cursor-pointer'
      onClick={handleLike}
    />
  ) : (
    <FaHeart
      className='w-6.25 h-6.25 text-red-500 cursor-pointer'
      onClick={handleLike}
    />
  )}

  <span>{post.likes.length}</span>
</div>

      <div className='flex justify-center items-center gap-1.25' onClick={()=>setShowComment(prev=>!prev)} >
<MdOutlineComment
  className='w-6.25 h-6.25 cursor-pointer'
  onClick={() => setShowComment(prev => !prev)}
/>
<span>{post.comments.length}</span>
      </div>
        </div>
        <div onClick={handleSaved}>
      {!userData.saved.includes(post?._id) && <FaRegBookmark className='w-6.25 cursor-pointer h-6.25' />}
      {userData.saved.includes(post?._id) && <FaBookmark className='w-6.25 cursor-pointer h-6.25' />}
        </div>
      </div>

      {post.caption && (
  <div className="w-full px-5 mt-1 text-sm">
    <span className="font-semibold mr-2">
      {post.author.userName}
    </span>
    <span className="text-gray-700">
      {post.caption}
    </span>
  </div>
)}

        {showComment && 
        <div className='w-full flex flex-col gap-7.5 pb-5'>
       <div className='w-full h-20 flex items-center justify-between px-5 relative'>
        <div className='w-10 h-10 md:w-15 md:h-15 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
          <img src={post.author?.profileImage || dp} alt="" className='w-full object-cover' />
        </div> 
        <input type="text" className='px-2.5 border-b-2 border-b-gray-500 w-[90%] outline-none h-10' placeholder='Write Comment....' onChange={(e)=>setMessage(e.target.value)} value={message} />
        <button className='absolute right-5'><IoSend className='w-6.25 h-6.25' onClick={(handleComment)} /></button>
        </div>

          <div className="w-full max-h-75 overflow-auto">
  {post.comments?.map((com, index) => (
    <div key={index} className="w-full px-5 py-5 flex items-center gap-5 border-b-2 border-b-gray-200">
      <div className="w-10 h-10 border-2 border-black rounded-full overflow-hidden">
        <img
          src={com.author?.profileImage || dp}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col">
        <span className="font-semibold text-sm">
          {com.author?.userName || "Unknown user"}
        </span>
        <span className="text-sm text-gray-700">
          {com.message}
        </span>
      </div>

    </div>
  ))}
</div>

        </div>
        }

    </div>
  )
}

export default Post
