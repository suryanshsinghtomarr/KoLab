import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { user, signOut } = useAuth()
  return <header className="navbar"><Link className="brand" to="/">CodeTogether</Link><nav>{user && <><Link to="/dashboard">Dashboard</Link><span>Hi, {user.name}</span><button className="link-button" onClick={signOut}>Log out</button></>}</nav></header>
}
