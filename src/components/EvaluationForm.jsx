import React, { useEffect, useMemo, useState } from 'react'

const roles = [
  'dean',
  'chairperson',
  'subject coordinator',
  'principal',
  'president',
  'vice president',
  'teacher',
]

function EvaluationForm() {
  const [backendUrl] = useState(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    evaluator_name: '',
    evaluator_role: roles[0],
    teacher_name: '',
    course: '',
    section: '',
    term: 'AY 2025-2026',
    teaching_effectiveness: 3,
    classroom_management: 3,
    content_knowledge: 3,
    professionalism: 3,
    comments: ''
  })

  const overall = useMemo(() => {
    const s = [
      Number(form.teaching_effectiveness),
      Number(form.classroom_management),
      Number(form.content_knowledge),
      Number(form.professionalism),
    ]
    return (s.reduce((a,b)=>a+b,0) / 4).toFixed(2)
  }, [form])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${backendUrl}/api/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          teaching_effectiveness: Number(form.teaching_effectiveness),
          classroom_management: Number(form.classroom_management),
          content_knowledge: Number(form.content_knowledge),
          professionalism: Number(form.professionalism),
        })
      })
      if(!res.ok) throw new Error(`Failed: ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">Submit an Evaluation</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-200 mb-1">Evaluator Name</label>
          <input name="evaluator_name" value={form.evaluator_name} onChange={handleChange} className="w-full rounded bg-slate-900/60 border border-slate-700 px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Evaluator Role</label>
          <select name="evaluator_role" value={form.evaluator_role} onChange={handleChange} className="w-full rounded bg-slate-900/60 border border-slate-700 px-3 py-2">
            {roles.map(r => (<option key={r} value={r}>{r}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Teacher Name</label>
          <input name="teacher_name" value={form.teacher_name} onChange={handleChange} className="w-full rounded bg-slate-900/60 border border-slate-700 px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Course</label>
          <input name="course" value={form.course} onChange={handleChange} className="w-full rounded bg-slate-900/60 border border-slate-700 px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Section</label>
          <input name="section" value={form.section} onChange={handleChange} className="w-full rounded bg-slate-900/60 border border-slate-700 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Term</label>
          <input name="term" value={form.term} onChange={handleChange} className="w-full rounded bg-slate-900/60 border border-slate-700 px-3 py-2" />
        </div>

        {[['teaching_effectiveness','Teaching Effectiveness'],['classroom_management','Classroom Management'],['content_knowledge','Content Knowledge'],['professionalism','Professionalism']].map(([key,label]) => (
          <div key={key} className="md:col-span-1">
            <label className="block text-sm text-blue-200 mb-1">{label}: {form[key]}</label>
            <input type="range" min="1" max="5" name={key} value={form[key]} onChange={handleChange} className="w-full" />
          </div>
        ))}

        <div className="md:col-span-2">
          <label className="block text-sm text-blue-200 mb-1">Comments</label>
          <textarea name="comments" value={form.comments} onChange={handleChange} className="w-full rounded bg-slate-900/60 border border-slate-700 px-3 py-2" rows={3} />
        </div>

        <div className="md:col-span-2 flex items-center justify-between">
          <div className="text-blue-200">Overall Score: <span className="font-semibold text-white">{overall}</span></div>
          <button disabled={submitting} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-4 text-sm text-blue-200">Saved. ID: <span className="text-white font-mono">{result.id}</span> • Overall: <span className="text-white font-semibold">{result.overall_score}</span></div>
      )}
      {error && (
        <div className="mt-4 text-sm text-red-300">{error}</div>
      )}
    </div>
  )
}

export default EvaluationForm
