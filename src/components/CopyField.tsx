import { useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'

/** Read-only URL with copy + open buttons. */
export function CopyField({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 pl-3">
      <input readOnly value={value} aria-label={label} className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none" onFocus={(e) => e.currentTarget.select()} />
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}
        className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-900"
        title="Copy link"
      >
        {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
      </button>
      <a href={value} target="_blank" rel="noopener noreferrer" className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-900" title="Open">
        <ExternalLink className="size-4" />
      </a>
    </div>
  )
}
