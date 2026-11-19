import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const isRoom = location.pathname.startsWith('/rooms/')
  const isHome = location.pathname === '/'
  return <header className="navbar"><div className="navbar-inner"><Link className="brand" to="/" aria-label="KoLab home"><span>Ko</span><strong>Lab</strong></Link><nav>{user && <>{!isHome && <Link to="/">Home</Link>}<Link to="/dashboard">Dashboard</Link><span className="nav-greeting">Hi, {user.name}</span>{!isRoom && <button className="link-button" onClick={signOut}>Log out</button>}</>}</nav></div></header>
}
