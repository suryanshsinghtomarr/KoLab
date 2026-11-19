import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Room from './pages/Room'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

export default function App() {
  return <AuthProvider><BrowserRouter><Navbar /><Routes><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route element={<ProtectedRoute />}><Route path="/" element={<Home />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/rooms/:roomId" element={<Room />} /></Route><Route path="*" element={<NotFound />} /></Routes></BrowserRouter></AuthProvider>
}
