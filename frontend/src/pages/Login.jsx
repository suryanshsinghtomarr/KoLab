import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as authApi from '../api/authApi'
import { useAuth } from '../context/useAuth'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' }); const [error, setError] = useState(''); const navigate = useNavigate(); const { signIn } = useAuth()
  const submit = async (e) => { e.preventDefault(); setError(''); try { const { data } = await authApi.login(form); signIn(data); navigate('/') } catch (err) { setError(err.response?.data?.message || 'Unable to log in') } }
  return <AuthForm title="Welcome back" subtitle="Sign in to your coding rooms." fields={form} setFields={setForm} submit={submit} error={error} button="Log in" footer={<>New here? <Link to="/register">Create an account</Link></>} />
}

export function AuthForm({ title, subtitle, fields, setFields, submit, error, button, footer, register = false }) {
  return <main className="auth-page"><form className="card auth-card" onSubmit={submit}><p className="eyebrow">CODETOGETHER</p><h1>{title}</h1><p className="muted">{subtitle}</p>{register && <label>Name<input required value={fields.name} onChange={(e) => setFields({ ...fields, name: e.target.value })} /></label>}<label>Email<input required type="email" value={fields.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} /></label><label>Password<input required minLength="6" type="password" value={fields.password} onChange={(e) => setFields({ ...fields, password: e.target.value })} /></label>{error && <p className="error">{error}</p>}<button className="primary" type="submit">{button}</button><p className="form-footer">{footer}</p></form></main>
}
