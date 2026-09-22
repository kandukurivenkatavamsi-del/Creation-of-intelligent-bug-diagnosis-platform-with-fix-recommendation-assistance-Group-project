import React, { useState } from 'react'
import client from '../api/client'

const SAMPLE_DIFFS = [
  {
    label: 'Auth Change (High Risk)',
    message: 'Fix null check in UserService after OAuth token refresh',
    diff: `- user = getUserById(id)
+ user = getUserById(id) if id else None
  accountId = user.getAccountId()
- session.token = generateToken(user)
+ session.token = generateToken(user, expires=3600)
+ if not session.token:
+     raise AuthException("Token generation failed")`
  },
  {
    label: 'UI Typo Fix (Low Risk)',
    message: 'Fix typo in dashboard label',
    diff: `- <span>Totel Bugs</span>
+ <span>Total Bugs</span>`
  },
  {
    label: 'Database Migration (High Risk)',
    message: 'Add index to bugs table for performance',
    diff: `+ ALTER TABLE bugs ADD INDEX idx_severity (severity);
+ ALTER TABLE bugs DROP COLUMN deprecated_field;
+ UPDATE bugs SET status = 'Open' WHERE status IS NULL;`
  }
]

const RISK_COLORS = {
  High: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700',
  Medium: 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700',
  Low: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700',
}

export default function BugPrediction() {
  const [commitMessage, setCommitMessage] = useState('')
  const [commitDiff, setCommitDiff] = useState('')
  const [author, setAuthor] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadSample = (sample) => {
    setCommitMessage(sample.message)
    setCommitDiff(sample.diff)
    setResult(null)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!commitDiff.trim()) {
      setError('Please paste a git commit diff.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await client.post('/predict', {
        commit_diff: commitDiff,
        commit_message: commitMessage,
        author: author || 'Unknown',
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Bug Prediction</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Paste a git commit diff to predict bug risk before the change reaches production.
        </p>
      </div>

      {/* Sample cases */}
      <div className="panel p-4">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-3 uppercase tracking-wider">Load a sample</p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_DIFFS.map((s) => (
            <button
              key={s.label}
              onClick={() => loadSample(s)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-violet-400/50 dark:hover:bg-violet-500/10 dark:hover:text-violet-200 transition-all font-medium"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input form */}
      <div className="panel p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Commit Message</label>
            <input
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="e.g. Fix null check in UserService"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Author</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. developer@company.com"
              className="input-field"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Git Commit Diff</label>
          <textarea
            value={commitDiff}
            onChange={(e) => setCommitDiff(e.target.value)}
            placeholder="Paste your git diff here..."
            rows={10}
            className="input-field w-full font-mono text-xs leading-relaxed resize-y p-3.5"
          />
        </div>
        {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary w-full py-2.5"
        >
          {loading ? 'Analyzing commit risk...' : 'Analyze Commit Risk'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className={`panel p-5 border ${RISK_COLORS[result.risk_level]}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-1">Risk Level</p>
                <p className={`text-2xl font-bold`}>{result.risk_level}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Risk Score</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{result.risk_score}<span className="text-base font-normal text-slate-500 dark:text-slate-400">/100</span></p>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${result.risk_level === 'High' ? 'bg-red-500' : result.risk_level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${result.risk_score}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="panel p-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Risk Reasons</h3>
              <ul className="space-y-1.5">
                {result.risk_reasons.map((r, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel p-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Vulnerable Areas</h3>
              <ul className="space-y-1.5">
                {result.vulnerable_areas.map((a, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel p-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Recommended Tests</h3>
            <ul className="space-y-1.5">
              {result.recommended_tests.map((t, i) => (
                <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="panel p-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Summary</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">{result.summary}</p>
          </div>
        </div>
      )}
    </div>
  )
}

