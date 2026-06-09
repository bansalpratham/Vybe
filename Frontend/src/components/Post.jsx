import React, { useState } from 'react'
import dp from "../assets/dp.png"
import VideoPlayer from './VideoPlayer'
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark } from "react-icons/fa"
import { MdOutlineComment } from "react-icons/md"
import { IoSend } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setPostData } from '../redux/postSlice'
import { setUserData } from '../redux/userSlice'
import FollowButton from './FollowButton'

function Post({ post }) {
  const { userData } = useSelector(state => state.user)
  const { postData } = useSelector(state => state.post)

  const [showComment, setShowComment] = useState(false)
  const [message, setMessage] = useState("")

  const dispatch = useDispatch()

  const handleLike = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/post/like/${post._id}`,
        { withCredentials: true }
      )

      const updatedPost = result.data

      const updatedPosts = postData.map(p =>
        p._id === post._id ? updatedPost : p
      )

      dispatch(setPostData(updatedPosts))
    } catch (error) {
      console.log(error)
    }
  }

  const handleSaved = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/post/saved/${post._id}`,
        { withCredentials: true }
      )

      dispatch(setUserData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  const handleComment = async () => {
    if (!message.trim()) return

    try {
      const result = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { message },
        { withCredentials: true }
      )

      const updatedPost = result.data

      const updatedPosts = postData.map(p =>
        p._id === post._id ? updatedPost : p
      )

      dispatch(setPostData(updatedPosts))
      setMessage("")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-[90%] flex flex-col gap-2.5 bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl pb-5'>

      {/* Header */}
      <div className='w-full h-20 flex justify-between items-center px-2.5'>
        <div className='flex items-center md:gap-5 gap-2.5'>
          <div className='w-10 h-10 md:w-15 md:h-15 border-2 border-black rounded-full overflow-hidden'>
            <img
              src={post.author?.profileImage || dp}
              alt=""
              className='w-full h-full object-cover'
            />
          </div>

          <div className='w-37.5 font-semibold truncate'>
            {post.author?.userName}
          </div>
        </div>

        {String(userData?._id) !== String(post.author?._id) && (
          <FollowButton
            tailwind="px-2.5 w-15 md:w-20 py-1.25 h-7.5 md:h-10 bg-black text-white rounded-2xl"
            targetUserId={post.author?._id}
          />
        )}
      </div>

      {/* Image Post */}
      {post.mediaType === "image" && (
        <>
          <div className='w-[90%] flex justify-center'>
            <img
              src={post.media}
              alt=""
              className='w-[80%] rounded-2xl object-cover'
            />
          </div>

          {post.caption && (
            <div className="w-full px-5 text-sm">
              <span className="font-semibold mr-2">
                {post.author?.userName}
              </span>
              <span className="text-gray-700">
                {post.caption}
              </span>
            </div>
          )}
        </>
      )}

      {/* Video Post */}
      {post.mediaType === "video" && (
        <>
          <div className='w-[80%] flex justify-center'>
            <VideoPlayer media={post.media} />
          </div>

          {post.caption && (
            <div className="w-full px-5 text-sm">
              <span className="font-semibold mr-2">
                {post.author?.userName}
              </span>
              <span className="text-gray-700">
                {post.caption}
              </span>
            </div>
          )}
        </>
      )}

      {/* Action Buttons */}
      <div className='w-full flex justify-between items-center px-5 mt-2.5'>
        <div className='flex items-center gap-4'>
          {(post.likes || []).includes(userData?._id) ? (
            <FaHeart
              className='w-6 h-6 text-red-500 cursor-pointer'
              onClick={handleLike}
            />
          ) : (
            <FaRegHeart
              className='w-6 h-6 cursor-pointer'
              onClick={handleLike}
            />
          )}

          {userData?.saved?.includes(post?._id) ? (
            <FaBookmark
              className='w-6 h-6 cursor-pointer'
              onClick={handleSaved}
            />
          ) : (
            <FaRegBookmark
              className='w-6 h-6 cursor-pointer'
              onClick={handleSaved}
            />
          )}

          <MdOutlineComment
            className='w-6 h-6 cursor-pointer'
            onClick={() => setShowComment(!showComment)}
          />
        </div>

        <div className='text-sm text-gray-600'>
          {(post.likes || []).length} likes
        </div>
      </div>

      {/* Comment Input */}
      {showComment && (
        <div className='w-full px-5 flex items-center gap-2'>
          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Add a comment...'
            className='flex-1 border rounded-lg px-3 py-2 outline-none'
          />

          <IoSend
            className='cursor-pointer w-5 h-5'
            onClick={handleComment}
          />
        </div>
      )}

      {/* Comments */}
      <div className='w-full px-5'>
        {post.comments?.map((comment, index) => (
          <div key={index} className='text-sm mt-2'>
            <span className='font-semibold mr-2'>
              {comment.author?.userName}
            </span>
            {comment.message}
          </div>
        ))}
      </div>

    </div>
  )
}

export default Post