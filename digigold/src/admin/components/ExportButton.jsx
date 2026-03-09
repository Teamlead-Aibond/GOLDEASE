import { useState } from 'react'

export default function ExportButton({ onExport, label = 'Export CSV' }) {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')

  const handleExport = async () => {
    setExporting(true)
    setError('')
    try {
      await onExport()
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleExport}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#6B1532] to-[#4A0E23] border border-[#6B1532] rounded-xl text-white text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {exporting ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        {exporting ? 'Exporting...' : label}
      </button>
      {error && (
        <p className="absolute top-full mt-1 text-red-500 text-xs whitespace-nowrap">{error}</p>
      )}
    </div>
  )
}
