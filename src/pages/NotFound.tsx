import { Link } from 'react-router'
import { Button } from '@/components/ui'

export function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link to="/dashboard"><Button variant="secondary">Back to dashboard</Button></Link>
    </div>
  )
}
