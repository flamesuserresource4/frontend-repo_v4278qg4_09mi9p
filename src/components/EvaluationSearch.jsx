import React, { useEffect, useState } from 'react'

function EvaluationSearch() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [teacherName, setTeacherName] = useState('')
  const [role, setRole] = useState('')
  const [term, setTerm] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/api/evaluations/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_name: teacherName || undefined,
          evaluator_role: role || undefined,
          term: term || undefined,
        }),
      })
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { search() }, [])

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">Browse Evaluations</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input placeholder="Teacher name" value={teacherName} onChange={e=>setTeacherName(e.target.value)} className="rounded bg-slate-900/60 border border-slate-700 px-3 py-2" />
        <input placeholder="Evaluator role" value={role} onChange={e=>setRole(e.target.value)} className="rounded bg-slate-900/60 border border-slate-700 px-3 py-2" />
        <input placeholder="Term" value={term} onChange={e=>setTerm(e.target.value)} className="rounded bg-slate-900/60 border border-slate-700 px-3 py-2" />
        <button onClick={search} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500">{loading ? 'Searching...' : 'Search'}</button>
      </div>

      <div className="space-y-3 max-h-80 overflow-auto pr-1">
        {items.length === 0 && (
          <div className="text-blue-200">No evaluations found yet.</div>
        )}
        {items.map(item => (
          <div key={item.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-semibold">{item.teacher_name} • {item.course}</div>
              <div className="text-sm text-blue-200">Overall: <span className="text-white font-semibold">{item.overall_score}</span></div>
            </div>
            <div className="text-sm text-blue-200 mt-1">By {item.evaluator_name} ({item.evaluator_role}) • {item.term}</div>
            {item.comments && <div className="text-sm mt-2">“{item.comments}”</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EvaluationSearch
