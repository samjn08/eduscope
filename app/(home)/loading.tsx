import React from 'react'

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-[#091222]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <svg
          className="animate-spin h-12 w-12 text-blue-500 dark:text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>

        {/* Loading Text */}
        <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">Loading...</p>
      </div>
    </div>
  )
}

export default Loading
