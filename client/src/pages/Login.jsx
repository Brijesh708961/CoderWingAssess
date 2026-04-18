import { useState } from 'react'
import Header from '../components/Header'
import './Register.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpStep, setOtpStep] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not send OTP')
      }

      setOtpStep(true)
      setStatus({
        type: 'success',
        message: data.message || 'OTP sent to your email.',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, otp }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not verify OTP')
      }

      localStorage.setItem('user', JSON.stringify(data))
      window.location.href = '/?auth=login'
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page-shell">
      <Header />

      <main className="register-page">
        <section className="register-visual login-visual" aria-label="Shopping account">
          <div>
            <p>Exclusive</p>
            <h1>Welcome back to your shopping space.</h1>
            <span>Log in to continue your cart, track orders, and catch fresh deals.</span>
          </div>
        </section>

        <section className="register-card">
          <p className="auth-eyebrow">Good to see you</p>
          <h2>Log in to Exclusive</h2>
          <p className="auth-copy">Enter your details below</p>

          <form className="register-form" onSubmit={otpStep ? handleVerifyOtp : handleSubmit}>
            {!otpStep ? (
              <>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </label>
              </>
            ) : (
              <label>
                <span>Enter OTP</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6 digit OTP"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  minLength="6"
                  maxLength="6"
                  required
                />
              </label>
            )}

            {status.message && (
              <p className={`form-message ${status.type}`}>{status.message}</p>
            )}

            <div className="login-actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? otpStep ? 'Verifying OTP...' : 'Sending OTP...'
                  : otpStep ? 'Verify OTP' : 'Log In'}
              </button>
              <a href="/forgot-password">Forget Password?</a>
            </div>
          </form>

          <p className="auth-switch">
            New to Exclusive? <a href="/register">Create account</a>
          </p>
        </section>
      </main>
    </div>
  )
}

export default Login
