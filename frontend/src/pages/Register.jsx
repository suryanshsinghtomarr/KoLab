import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as authApi from '../api/authApi'
import { useAuth } from '../context/useAuth'
import { AuthForm } from './Login'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' }); const [error, setError] = useState(''); const navigate = useNavigate(); const { signIn } = useAuth()
  const submit = async (e) => { e.preventDefault(); setError(''); try { const { data } = await authApi.register(form); signIn(data); navigate('/') } catch (err) { setError(err.response?.data?.message || 'Unable to register') } }
  return <AuthForm title="Create your account" subtitle="Start collaborating in seconds." fields={form} setFields={setForm} submit={submit} error={error} button="Create account" register footer={<>Already registered? <Link to="/login">Log in</Link></>} />
}
