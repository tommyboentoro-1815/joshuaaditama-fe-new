import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { login, setToken, isAuthenticated } from '../../helpers/adminApi'
import '../../Supports/admin.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (done || isAuthenticated()) return <Redirect to="/admin/dashboard" />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(username, password)
      setToken(res.data.token)
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__box">
        <div className="admin-login__title">Joshua Aditama — Admin</div>
        <form onSubmit={handleSubmit}>
          <div className="admin-login__field">
            <label className="admin-login__label">Username</label>
            <input
              className="admin-login__input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="admin-login__field">
            <label className="admin-login__label">Password</label>
            <input
              className="admin-login__input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button className="admin-login__btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          {error && <div className="admin-login__error">{error}</div>}
        </form>
      </div>
    </div>
  )
}

export default Login
