import React from 'react'
import Header from './components/Header'
import EvaluationForm from './components/EvaluationForm'
import EvaluationSearch from './components/EvaluationSearch'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_50%)]"></div>
      <div className="relative max-w-5xl mx-auto px-6 pb-16">
        <Header />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <EvaluationForm />
          <EvaluationSearch />
        </div>

        <div className="text-center text-blue-200 mt-10">
          Need to check connectivity? <a href="/test" className="underline hover:text-white">Open the tester</a>
        </div>
      </div>
    </div>
  )
}

export default App
