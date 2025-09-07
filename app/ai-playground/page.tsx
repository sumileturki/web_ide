import { Header } from '@/features/home/component/header'
import React from 'react'

const PageAi = () => {
  return (
    <>
    <Header/>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">🤖 AI Page</h1>
        <p className="text-gray-700 text-lg mb-6">The system is currently in working state...</p>
        <div className="animate-pulse h-4 w-64 bg-blue-200 rounded-full mx-auto"></div>
      </div>
    </div>
    </>
  )
}

export default PageAi
