import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUserData } from '../redux/userSlice'
import { IoMdArrowBack } from "react-icons/io";
import dp from "../assets/dp.png"
import Nav from '../components/Nav'
import FollowButton from '../components/FollowButton'
import Post from '../components/Post'

function Profile() {

    const { userName } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [postType , setPostType] = useState("posts")

    const { profileData, userData } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)

    const handleProfile = async () => {
    try {

        const result = await axios.get(
            `${serverUrl}/api/user/getProfile/${userName}`,
            { withCredentials: true }
        )

        dispatch(setProfileData(result.data))

    } catch (error) {
        console.log(error)
    }
}

    const handleLogOut = async () => {
        try {

            await axios.get(
                `${serverUrl}/api/auth/signout`,
                { withCredentials: true }
            )

            dispatch(setUserData(null))

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleProfile()
    }, [userName])

    return (

        <div className='w-full min-h-screen bg-black'>

            {/* TOP BAR */}

            <div className='w-full h-20 flex justify-between items-center px-7.5 text-white'>

                <div onClick={() => navigate("/")}>
                    <IoMdArrowBack className='text-white w-6.25 h-6.25 cursor-pointer' />
                </div>

                <div className='font-semibold text-[20px]'>
                    {profileData?.userName}
                </div>

                <div
                    className='font-semibold cursor-pointer text-[20px] text-blue-500'
                    onClick={handleLogOut}
                >
                    Log Out
                </div>

            </div>

            {/* PROFILE SECTION */}

            <div className='w-full h-37.5 flex items-start gap-5 lg:gap-12.5 pt-5 px-2.5 justify-center'>

                <div className='w-20 h-20 md:w-35 md:h-35 border-2 border-black rounded-full cursor-pointer overflow-hidden'>

                    <img
                        src={profileData?.profileImage || dp}
                        alt=""
                        className='w-full h-full object-cover'
                    />

                </div>

                <div>

                    <div className='font-semibold text-[22px] text-white'>
                        {profileData?.name}
                    </div>

                    <div className='text-[17px] text-[#ffffffe8]'>
                        {profileData?.profession || "New User"}
                    </div>

                    <div className='text-[17px] text-[#ffffffe8]'>
                        {profileData?.bio}
                    </div>

                </div>

            </div>

            {/* STATS */}

            <div className='w-full h-25 flex items-center justify-center gap-10 md:gap-15 px-[20%] pt-7.5 text-white'>

                {/* POSTS */}

                <div>

                    <div className='text-white text-[22px] md:text-[30px] font-semibold'>
                        {profileData?.posts?.length || 0}
                    </div>

                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>
                        Posts
                    </div>

                </div>

                {/* FOLLOWERS */}

                <div>

                    <div className='flex items-center justify-center gap-5'>

                        <div className='flex relative'>

                            {profileData?.followers?.slice(0, 3).map((user, index) => (

                                <div
                                    key={user?._id || index}
                                    style={{ left: `${index * 9}px` }}
                                    className='w-10 h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden absolute'
                                >

                                    <img
                                        src={user?.profileImage || dp}
                                        alt=""
                                        className='w-full h-full object-cover'
                                    />

                                </div>

                            ))}

                        </div>

                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>
                            {profileData?.followers?.length || 0}
                        </div>

                    </div>

                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>
                        Followers
                    </div>

                </div>

                {/* FOLLOWING */}

                <div>

                    <div className='flex items-center justify-center gap-5'>

                        <div className='flex relative'>

                            <div className='w-10 h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden'>

                                <img
                                    src={profileData?.profileImage || dp}
                                    alt=""
                                    className='w-full h-full object-cover'
                                />

                            </div>

                            <div className='w-10 h-10 border-2 absolute border-black rounded-full cursor-pointer left-2.25 overflow-hidden'>

                                <img
                                    src={profileData?.profileImage || dp}
                                    alt=""
                                    className='w-full h-full object-cover'
                                />

                            </div>

                            <div className='w-10 h-10 border-2 border-black rounded-full absolute cursor-pointer left-4.5 overflow-hidden'>

                                <img
                                    src={profileData?.profileImage || dp}
                                    alt=""
                                    className='w-full h-full object-cover'
                                />

                            </div>

                        </div>

                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>
                            {profileData?.following?.length || 0}
                        </div>

                    </div>

                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>
                        Following
                    </div>

                </div>

            </div>

            {/* BUTTONS */}

            <div className='w-full h-20 flex justify-center items-center gap-5 mt-2.5'>

                {profileData?._id === userData?._id && (

                    <button
                        className='px-2.5 min-w-37.5 py-1.25 h-10 bg-[white] cursor-pointer rounded-2xl'
                        onClick={() => navigate("/editprofile")}
                    >
                        Edit Profile
                    </button>

                )}

                {profileData?._id &&
                    profileData?._id !== userData?._id && (

                        <>
                            <FollowButton
                                tailwind='px-2.5 min-w-37.5 py-1.25 h-10 bg-[white] cursor-pointer rounded-2xl'
                                targetUserId={profileData._id}
                                onFollowChange={handleProfile}
                            />

                            <button className='px-2.5 min-w-37.5 py-1.25 h-10 bg-[white] cursor-pointer rounded-2xl'>
                                Message
                            </button>
                        </>
                    )}

            </div>

            {/* POSTS */}

            <div className='w-full min-h-screen flex justify-center'>

                <div className='w-full max-w-225 flex flex-col items-center rounded-t-[30px] bg-white relative gap-5 pt-7.5 pb-25'>
{profileData?._id === userData?._id && <div className='w-[60%] max-w-100 h-20 bg-[white] rounded-full flex justify-center items-center gap-2.5'>
            <div className={` ${postType==="posts"?"bg-black text-white shadow-2xl shadow-black":""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={()=>setPostType("posts")}>Posts</div>
          
            <div className={` ${postType==="saved"?"bg-black text-white shadow-2xl shadow-black":""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={()=>setPostType("saved")}>Saved</div>
          
        </div>}
                    <Nav />

                    {profileData?._id === userData?._id && (
    <>

        {postType === "posts" &&
            postData?.map((post, index) => (

                post?.author?._id === profileData?._id && (

                    <Post
                        key={post?._id || index}
                        post={post}
                    />

                )

            ))
        }

        {postType === "saved" && postData?.filter(p => userData?.saved?.includes(p._id)).map((post, index) => (
                <Post
                    key={post?._id || index}
                    post={post}
                />
            ))}

    </>
)}

   {profileData?._id != userData?._id && (
        postData.map((post,index)=>(
            post.author?._id == profileData?._id && <Post post={post} />
        ))
)}

                   

                </div>

            </div>

        </div>
    )
}

export default Profile