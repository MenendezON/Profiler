import { useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Minimal chart kit following the data-viz rules used in Profiler:
 * thin marks (<= 24px), 4px rounded data end / square at the baseline, recessive axes,
 * a hover/focus tooltip on every mark, values in text colors (never the series color),
 * and a table view under each chart.
 */

export const SERIES = { brand: '#4f46e5', s1: '#257de0', s2: '#f47230', s3: '#00b894' }

interface Tip { x: number; y: number; content: ReactNode }

function useTooltip() {
  const ref = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<Tip | null>(null)
  const show = (e: React.MouseEvent | React.FocusEvent, content: ReactNode) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    const target = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = 'clientX' in e ? e.clientX - box.left : target.left + target.width / 2 - box.left
    const y = 'clientY' in e ? e.clientY - box.top : target.top - box.top
    setTip({ x, y, content })
  }
  const hide = () => setTip(null)
  const node = tip && (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
      style={{ left: tip.x, top: tip.y - 8 }}
    >
      {tip.content}
    </div>
  )
  return { ref, show, hide, node }
}

/** Horizontal bars, one series. Value at the tip, hover tooltip. */
export function BarList({ rows, color = SERIES.brand, format = (v) => String(v), suffix, label }: {
  rows: { label: string; value: number; note?: string }[]
  color?: string
  format?: (v: number) => string
  suffix?: (row: { label: string; value: number; note?: string }) => ReactNode
  label: string
}) {
  const { ref, show, hide, node } = useTooltip()
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <div ref={ref} className="relative" role="list" aria-label={label}>
      {rows.map((r) => (
        <div key={r.label} role="listitem" className="grid grid-cols-[8.5rem_1fr] items-center gap-3 py-1.5 text-sm sm:grid-cols-[10rem_1fr]">
          <span className="truncate text-slate-600" title={r.label}>{r.label}</span>
          <div className="flex items-center gap-2">
            <div
              tabIndex={0}
              onMouseMove={(e) => show(e, <><strong>{r.label}</strong> · {format(r.value)}{r.note ? ` · ${r.note}` : ''}</>)}
              onMouseLeave={hide}
              onFocus={(e) => show(e, <><strong>{r.label}</strong> · {format(r.value)}{r.note ? ` · ${r.note}` : ''}</>)}
              onBlur={hide}
              className="-my-2 flex min-w-1 flex-1 items-center py-2 outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
              style={{ maxWidth: `${(r.value / max) * 100}%` }}
              aria-label={`${r.label}: ${format(r.value)}`}
            >
              <div className="h-4 w-full rounded-r-[4px]" style={{ background: r.value ? color : 'transparent', minWidth: r.value ? 2 : 0 }} />
            </div>
            <span className="shrink-0 text-xs font-medium tabular-nums text-slate-700">{format(r.value)}</span>
            {suffix?.(r)}
          </div>
        </div>
      ))}
      {node}
    </div>
  )
}

/** Vertical columns over time, one series. Only the peak is labelled; everything is in the tooltip/table. */
export function ColumnChart({ points, color = SERIES.brand, label, height = 160 }: {
  points: { label: string; short: string; value: number }[]
  color?: string
  label: string
  height?: number
}) {
  const { ref, show, hide, node } = useTooltip()
  const max = Math.max(1, ...points.map((p) => p.value))
  const peak = points.reduce((best, p, i) => (p.value > points[best].value ? i : best), 0)
  const ticks = [0, Math.ceil(max / 2), max]
  return (
    <div ref={ref} className="relative" aria-label={label} role="img">
      <div className="flex gap-2">
        <div className="flex flex-col justify-between pb-5 text-right text-[11px] tabular-nums text-slate-400" style={{ height: height + 20 }}>
          {[...ticks].reverse().map((t, i) => <span key={i}>{t}</span>)}
        </div>
        <div className="flex-1">
          <div className="relative flex items-end gap-0.5 border-b border-slate-200" style={{ height }}>
            {ticks.slice(1).map((t) => (
              <div key={t} className="pointer-events-none absolute inset-x-0 border-t border-slate-100" style={{ bottom: `${(t / max) * 100}%` }} />
            ))}
            {points.map((p, i) => (
              <div
                key={p.label}
                tabIndex={0}
                onMouseMove={(e) => show(e, <><strong>{p.label}</strong> · {p.value}</>)}
                onMouseLeave={hide}
                onFocus={(e) => show(e, <><strong>{p.label}</strong> · {p.value}</>)}
                onBlur={hide}
                aria-label={`${p.label}: ${p.value}`}
                className="group relative flex h-full flex-1 items-end justify-center outline-none focus-visible:bg-brand-50"
              >
                {i === peak && p.value > 0 && (
                  <span className="absolute text-[11px] font-medium tabular-nums text-slate-700" style={{ bottom: `calc(${(p.value / max) * 100}% + 4px)` }}>{p.value}</span>
                )}
                <div
                  className="w-full max-w-6 rounded-t-[4px] transition-opacity group-hover:opacity-80"
                  style={{ height: `${(p.value / max) * 100}%`, background: color, minHeight: p.value ? 2 : 0 }}
                />
              </div>
            ))}
          </div>
          <div className="mt-1 flex gap-0.5 text-[11px] text-slate-400">
            {points.map((p) => (
              <span key={p.label} className="flex-1 overflow-visible whitespace-nowrap text-left">{p.short}</span>
            ))}
          </div>
        </div>
      </div>
      {node}
    </div>
  )
}

/** One whole split into parts (tall segmented bar): values printed inside, legend below. */
export function SegmentedBar({ parts, label }: { parts: { label: string; value: number; color: string }[]; label: string }) {
  const { ref, show, hide, node } = useTooltip()
  const total = parts.reduce((a, p) => a + p.value, 0)
  return (
    <div ref={ref} className="relative">
      <div className="flex h-7 gap-0.5" role="img" aria-label={`${label}: ${parts.map((p) => `${p.label} ${p.value}`).join(', ')}`}>
        {total === 0 ? (
          <div className="h-full w-full rounded bg-slate-100" />
        ) : (
          parts.filter((p) => p.value > 0).map((p) => {
            const share = Math.round((p.value / total) * 100)
            return (
              <div
                key={p.label}
                tabIndex={0}
                onMouseMove={(e) => show(e, <><strong>{p.label}</strong> · {p.value} ({share}%)</>)}
                onMouseLeave={hide}
                onFocus={(e) => show(e, <><strong>{p.label}</strong> · {p.value} ({share}%)</>)}
                onBlur={hide}
                className="flex h-full items-center rounded px-2 text-xs font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-slate-900/40"
                style={{ width: `${(p.value / total) * 100}%`, background: p.color }}
              >
                {share >= 12 ? p.value : ''}
              </div>
            )
          })
        )}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ background: p.color }} />{p.label}
          </li>
        ))}
      </ul>
      {node}
    </div>
  )
}

/** "Show as table" disclosure under a chart. */
export function TableView({ head, rows, className }: { head: string[]; rows: (string | number)[][]; className?: string }) {
  return (
    <details className={cn('mt-3 text-xs', className)}>
      <summary className="cursor-pointer text-slate-500 hover:text-slate-800">Show as table</summary>
      <table className="mt-2 w-full text-left">
        <thead className="text-slate-500"><tr>{head.map((h) => <th key={h} className="py-1 pr-3 font-medium">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="py-1 pr-3 tabular-nums">{c}</td>)}</tr>)}
        </tbody>
      </table>
    </details>
  )
}
