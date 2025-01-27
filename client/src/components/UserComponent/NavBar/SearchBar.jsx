import React, { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef(null)

  const handleSearchClick = () => {
    setIsExpanded(true)
  }

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Implement your search logic here
  }

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setIsExpanded(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handleClickOutside]) // Added handleClickOutside to dependencies

  return (
    <div className="flex justify-end">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center bg-white border border-gray-300 rounded-full overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "w-64" : "w-10"
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleInputChange}
            className={`w-full py-2 pl-4 pr-10 focus:outline-none ${
              isExpanded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
          />
          <button
            type="submit"
            className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center bg-transparent"
            onClick={handleSearchClick}
          >
            <Search className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchBar

