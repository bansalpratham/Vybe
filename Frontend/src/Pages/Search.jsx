import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import LeftHome from '../components/LeftHome'
import RightHome from '../components/RightHome'
import Nav from '../components/Nav'
import OtherUser from '../components/OtherUser'
import { FaSearch } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { ClipLoader } from 'react-spinners'

function Search() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `${serverUrl}/api/user/search?q=${query}`,
          { withCredentials: true }
        )
        setResults(response.data)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    }, 400) // 400ms debounce delay

    return () => clearTimeout(delayDebounce)
  }, [query])

  const handleClear = () => {
    setQuery("")
    setResults([])
  }

  return (
    <div className='w-full flex justify-center items-center bg-black min-h-screen'>
      <LeftHome />
      
      {/* Search Body */}
      <div className='lg:w-[50%] w-full bg-black min-h-screen lg:h-screen relative lg:overflow-y-auto flex flex-col'>
        <div className='w-full p-5 border-b border-white/5 flex flex-col gap-4 sticky top-0 bg-black/80 backdrop-blur-md z-10'>
          <h1 className='text-white text-2xl font-bold tracking-wide'>Search Profiles</h1>
          
          <div className='relative flex items-center w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/5 transition-all duration-200'>
            <FaSearch className='text-gray-400 mr-3' size={18} />
            <input
              type="text"
              placeholder="Search by username or name..."
              className='w-full h-full bg-transparent text-white outline-none border-0 text-[15px] placeholder:text-gray-500'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={handleClear} className='text-gray-400 hover:text-white transition-colors cursor-pointer'>
                <IoClose size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Results Container */}
        <div className='flex-1 w-full bg-white rounded-t-[50px] mt-2 p-6 flex flex-col items-center gap-4 relative pb-28 min-h-[75vh]'>
          <Nav />

          {loading ? (
            <div className='mt-20 flex flex-col items-center gap-3'>
              <ClipLoader color='black' size={40} />
              <p className='text-gray-500 font-semibold text-sm'>Searching Vybe...</p>
            </div>
          ) : query.trim() === "" ? (
            <div className='mt-20 flex flex-col items-center text-center px-6 gap-2'>
              <FaSearch size={48} className='text-gray-300' />
              <h3 className='text-[18px] font-bold text-gray-700 mt-2'>Find your friends</h3>
              <p className='text-gray-400 text-sm max-w-72'>Type a username or full name in the search bar above to see results.</p>
            </div>
          ) : results.length === 0 ? (
            <div className='mt-20 flex flex-col items-center text-center px-6 gap-2'>
              <IoClose size={48} className='text-red-300 border-2 border-red-100 rounded-full p-2 bg-red-50' />
              <h3 className='text-[18px] font-bold text-gray-700 mt-2'>No users found</h3>
              <p className='text-gray-400 text-sm max-w-72'>We couldn't find any user matching "{query}". Try checking the spelling.</p>
            </div>
          ) : (
            <div className='w-full max-w-140 flex flex-col gap-3 mt-4'>
              <p className='text-gray-400 font-bold text-[13px] tracking-wide mb-1'>SEARCH RESULTS ({results.length})</p>
              {results.map((user, index) => (
                <div key={user._id || index} className="w-full bg-black/95 rounded-2xl p-1 shadow-sm">
                  <OtherUser user={user} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <RightHome />
    </div>
  )
}

export default Search
