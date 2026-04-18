import { useState } from 'react'
import Header from '../components/Header'
import './Register.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
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
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
      const response = await fetch(`${API_BASE_URL}/api/auth/register/verify`, {
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
      window.location.href = '/?auth=signup'
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
        <section className="register-visual" aria-label="Shopping offer">
          <div>
            <p>Exclusive</p>
            <h1>Create your account and unlock better shopping.</h1>
            <span>Fast checkout, fresh deals, and your cart saved in one place.</span>
          </div>
        </section>

        <section className="register-card">
          <p className="auth-eyebrow">Start for free</p>
          <h2>Create an account</h2>
          <p className="auth-copy">Enter your details below</p>

          <form className="register-form" onSubmit={otpStep ? handleVerifyOtp : handleSubmit}>
            {!otpStep ? (
              <>
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>

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
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="6"
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

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? otpStep ? 'Verifying OTP...' : 'Sending OTP...'
                : otpStep ? 'Verify OTP' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have account? <a href="/login">Log in</a>
          </p>
        </section>
      </main>
    </div>
  )
}

export default Register
