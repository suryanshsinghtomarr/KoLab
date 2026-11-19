import { Link } from 'react-router-dom'

export default function NotFound() {
  return <main className="page not-found"><p className="eyebrow">404</p><h1>Page not found</h1><p className="muted">The page you requested does not exist.</p><Link className="primary link-button" to="/">Return home</Link></main>
}
