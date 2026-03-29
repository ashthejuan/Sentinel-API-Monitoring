import { useState, useEffect, useRef } from 'react'
import { Activity, Bell, Globe, Trash2, Pause, Play, X, AlertTriangle, LogOut, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { supabase } from './supabaseClient'

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(null)
  const [error, setError] = useState('')

  const handleOAuthLogin = async (provider) => {
    setError('')
    setOauthLoading(provider)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      })
      if (error) throw error
    } catch (err) {
      setError(err.message)
      setOauthLoading(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        toast.success('Check your email for the confirmation link', { duration: 5000 })
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const oauthButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-3)',
    width: '100%',
    padding: 'var(--space-3) var(--space-4)',
    background: 'var(--color-bg-base)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--text-body)',
    fontWeight: 500,
    fontFamily: 'var(--font-display)',
    cursor: 'pointer',
    transition: 'border-color 150ms ease, background 150ms ease',
  }

  const inputStyle = {
    width: '100%',
    padding: 'var(--space-3) var(--space-4)',
    paddingLeft: '44px',
    background: 'var(--color-bg-base)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--text-body)',
    fontFamily: 'var(--font-display)',
    outline: 'none',
    transition: 'border-color 150ms ease',
    boxSizing: 'border-box',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        padding: 'var(--space-4)',
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            fontSize: 'var(--text-body)',
            fontFamily: 'var(--font-display)',
          },
        }}
      />
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: 'var(--space-6)',
          background: 'var(--color-bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
          animation: 'cardEntrance 400ms ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity size={24} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontSize: 'var(--text-title)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                margin: 0,
                marginBottom: 'var(--space-1)',
              }}
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p
              style={{
                fontSize: 'var(--text-body)',
                color: 'var(--color-text-secondary)',
                margin: 0,
              }}
            >
              {isSignUp ? 'Start monitoring your APIs' : 'Sign in to Sentinel'}
            </p>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            disabled={oauthLoading !== null}
            style={{
              ...oauthButtonStyle,
              opacity: oauthLoading !== null ? 0.7 : 1,
              cursor: oauthLoading !== null ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (oauthLoading === null) {
                e.target.style.borderColor = 'var(--color-border-hover)'
                e.target.style.background = 'var(--color-bg-surface)'
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--color-border)'
              e.target.style.background = 'var(--color-bg-base)'
            }}
          >
            <GitHubIcon />
            {oauthLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={oauthLoading !== null}
            style={{
              ...oauthButtonStyle,
              opacity: oauthLoading !== null ? 0.7 : 1,
              cursor: oauthLoading !== null ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (oauthLoading === null) {
                e.target.style.borderColor = 'var(--color-border-hover)'
                e.target.style.background = 'var(--color-bg-surface)'
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--color-border)'
              e.target.style.background = 'var(--color-bg-base)'
            }}
          >
            <GoogleIcon />
            {oauthLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          <span style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            or
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Email Field */}
          <div style={{ position: 'relative' }}>
            <Mail
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>

          {/* Password Field */}
          <div style={{ position: 'relative' }}>
            <Lock
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: '44px' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {showPassword ? (
                <EyeOff size={18} style={{ color: 'var(--color-text-muted)' }} />
              ) : (
                <Eye size={18} style={{ color: 'var(--color-text-muted)' }} />
              )}
            </button>
          </div>

          {/* Confirm Password (Sign Up only) */}
          {isSignUp && (
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3)',
                background: 'rgba(239, 68, 68, 0.12)',
                borderRadius: '8px',
              }}
            >
              <AlertTriangle size={16} style={{ color: 'var(--color-negative)', flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-body)', color: 'var(--color-negative)' }}>
                {error}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--color-accent)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: 'var(--text-body)',
              fontWeight: 500,
              fontFamily: 'var(--font-display)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'opacity 150ms ease',
            }}
          >
            {isLoading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Toggle Mode */}
        <div
          style={{
            marginTop: 'var(--space-5)',
            paddingTop: 'var(--space-5)',
            borderTop: '1px solid var(--color-border)',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setPassword('')
              setConfirmPassword('')
            }}
            style={{
              marginLeft: 'var(--space-2)',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-accent)',
              fontSize: 'var(--text-body)',
              fontWeight: 500,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isLoading }) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') onCancel()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        animation: 'fadeIn 150ms ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        ref={modalRef}
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: 'var(--space-6)',
          width: '100%',
          maxWidth: '400px',
          margin: 'var(--space-4)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
          animation: 'modalSlide 200ms ease-out',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-5)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--color-negative-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={20} style={{ color: 'var(--color-negative)' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: 'var(--text-title)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                margin: 0,
                marginBottom: 'var(--space-2)',
              }}
            >
              {title}
            </h3>
            <p
              style={{
                fontSize: 'var(--text-body)',
                color: 'var(--color-text-secondary)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {message}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: 'var(--space-3) var(--space-5)',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              fontSize: 'var(--text-body)',
              fontFamily: 'var(--font-display)',
              transition: 'border-color 150ms ease, color 150ms ease',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.borderColor = 'var(--color-border-hover)'
                e.target.style.color = 'var(--color-text-primary)'
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--color-border)'
              e.target.style.color = 'var(--color-text-secondary)'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: 'var(--space-3) var(--space-5)',
              background: 'var(--color-negative)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              fontSize: 'var(--text-body)',
              fontFamily: 'var(--font-display)',
              opacity: isLoading ? 0.7 : 1,
              transition: 'opacity 150ms ease',
            }}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

function EndpointCard({ endpoint, index, isSelected, onSelect, onRequestDelete, onToggleActive }) {
  const [hovered, setHovered] = useState(false)
  const [deleteHovered, setDeleteHovered] = useState(false)
  const [pauseHovered, setPauseHovered] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const handleDelete = (e) => {
    e.stopPropagation()
    onRequestDelete(endpoint)
  }

  const handleToggleActive = async (e) => {
    e.stopPropagation()
    if (isToggling) return

    setIsToggling(true)
    try {
      await onToggleActive(endpoint.id, endpoint.name, endpoint.is_active)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div
      onClick={() => onSelect(endpoint.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-bg-surface)',
        borderRadius: '12px',
        padding: 'var(--space-5) var(--space-6)',
        border: isSelected
          ? '2px solid #3b82f6'
          : '2px solid transparent',
        boxShadow: isSelected
          ? '0 0 0 1px rgba(59, 130, 246, 0.2), var(--shadow-card-hover)'
          : hovered
            ? 'var(--shadow-card-hover)'
            : 'var(--shadow-card)',
        outline: hovered && !isSelected
          ? '1px solid var(--color-border-hover)'
          : '1px solid var(--color-border)',
        transition: 'border 200ms ease, box-shadow 200ms ease, outline-color 200ms ease',
        animation: 'cardEntrance 400ms ease-out both',
        animationDelay: `${index * 60}ms`,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 'var(--space-3)',
          right: 'var(--space-3)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <button
          onClick={handleToggleActive}
          onMouseEnter={() => setPauseHovered(true)}
          onMouseLeave={() => setPauseHovered(false)}
          disabled={isToggling}
          style={{
            background: pauseHovered
              ? endpoint.is_active
                ? 'var(--color-warning-bg)'
                : 'var(--color-positive-bg)'
              : 'transparent',
            border: 'none',
            borderRadius: '6px',
            padding: '6px',
            cursor: isToggling ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 150ms ease',
          }}
          title={endpoint.is_active ? 'Pause monitoring' : 'Resume monitoring'}
        >
          {endpoint.is_active ? (
            <Pause
              size={14}
              style={{
                color: pauseHovered ? 'var(--color-warning)' : 'var(--color-text-muted)',
                opacity: isToggling ? 0.5 : 1,
              }}
            />
          ) : (
            <Play
              size={14}
              style={{
                color: pauseHovered ? 'var(--color-positive)' : 'var(--color-text-muted)',
                opacity: isToggling ? 0.5 : 1,
              }}
            />
          )}
        </button>
        <button
          onClick={handleDelete}
          onMouseEnter={() => setDeleteHovered(true)}
          onMouseLeave={() => setDeleteHovered(false)}
          style={{
            background: deleteHovered ? 'var(--color-negative-bg)' : 'transparent',
            border: 'none',
            borderRadius: '6px',
            padding: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 150ms ease',
          }}
          title="Remove endpoint"
        >
          <Trash2
            size={14}
            style={{
              color: deleteHovered ? 'var(--color-negative)' : 'var(--color-text-muted)',
            }}
          />
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          paddingRight: 'var(--space-6)',
        }}
      >
        <Globe
          size={16}
          style={{ color: 'var(--color-accent)', flexShrink: 0 }}
        />
        <span
          style={{
            fontSize: 'var(--text-title)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: 1.3,
          }}
        >
          {endpoint.name}
        </span>
      </div>

      <p
        style={{
          fontSize: 'var(--text-body)',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-mono)',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.5,
          wordBreak: 'break-all',
        }}
      >
        {endpoint.url}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 'auto',
        }}
      >
        {endpoint.is_active ? (
          <span
            style={{
              fontSize: 'var(--text-micro)',
              fontWeight: 500,
              color: 'var(--color-positive)',
              background: 'var(--color-positive-bg)',
              padding: '2px 8px',
              borderRadius: '999px',
            }}
          >
            ● Active
          </span>
        ) : (
          <span
            style={{
              fontSize: 'var(--text-micro)',
              fontWeight: 500,
              color: 'var(--color-negative)',
              background: 'var(--color-negative-bg)',
              padding: '2px 8px',
              borderRadius: '999px',
            }}
          >
            ○ Paused
          </span>
        )}
      </div>
    </div>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [endpoints, setEndpoints] = useState([])
  const [selectedEndpointId, setSelectedEndpointId] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [newName, setNewName] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newCheckInterval, setNewCheckInterval] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const [deleteConfirmEndpoint, setDeleteConfirmEndpoint] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const notificationRef = useRef(null)

  // Check for active session and listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return // Don't fetch if not logged in

    async function fetchEndpoints() {
      const { data } = await supabase.from('endpoints').select('*')
      setEndpoints(data ?? [])
    }

    async function fetchNotifications() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      setNotifications(data ?? [])
    }

    fetchEndpoints()
    fetchNotifications()

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          // Double check the notification belongs to this user
          if (payload.new.user_id === session.user.id) {
            setNotifications((prev) => [payload.new, ...prev])
            toast.error(`Alert: ${payload.new.message}`, {
              position: 'top-right',
              duration: 5000,
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session])

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRequestDelete = (endpoint) => {
    setDeleteConfirmEndpoint(endpoint)
  }

  const handleCancelDelete = () => {
    setDeleteConfirmEndpoint(null)
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirmEndpoint) return

    const { id, name } = deleteConfirmEndpoint
    setIsDeleting(true)

    const { error: notifError } = await supabase
      .from('notifications')
      .delete()
      .eq('endpoint_id', id)

    if (notifError) {
      toast.error(`Failed to remove ${name}`, {
        position: 'top-right',
        duration: 4000,
      })
      setIsDeleting(false)
      return
    }

    const { error } = await supabase.from('endpoints').delete().eq('id', id)

    if (error) {
      toast.error(`Failed to remove ${name}`, {
        position: 'top-right',
        duration: 4000,
      })
      setIsDeleting(false)
      return
    }

    setEndpoints((prev) => prev.filter((ep) => ep.id !== id))
    setSelectedEndpointId((prev) => (prev === id ? null : prev))
    setNotifications((prev) => prev.filter((n) => n.endpoint_id !== id))
    setDeleteConfirmEndpoint(null)
    setIsDeleting(false)
    toast.success(`${name} removed`, {
      position: 'top-right',
      duration: 3000,
      style: {
        background: 'var(--color-bg-elevated)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)',
      },
    })
  }

  const handleToggleActive = async (id, name, currentStatus) => {
    const newStatus = !currentStatus
    const { error } = await supabase
      .from('endpoints')
      .update({ is_active: newStatus })
      .eq('id', id)

    if (error) {
      toast.error(`Failed to update ${name}`, {
        position: 'top-right',
        duration: 4000,
      })
      return
    }

    setEndpoints((prev) =>
      prev.map((ep) => (ep.id === id ? { ...ep, is_active: newStatus } : ep))
    )
    toast.success(`${name} ${newStatus ? 'resumed' : 'paused'}`, {
      position: 'top-right',
      duration: 3000,
      style: {
        background: 'var(--color-bg-elevated)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)',
      },
    })
  }

  const handleAddEndpoint = async (e) => {
    e.preventDefault()
    setIsAdding(true)

    const { data, error } = await supabase
      .from('endpoints')
      .insert([
        {
          name: newName,
          url: newUrl,
          check_interval_minutes: newCheckInterval,
          is_active: true,
          user_id: session.user.id,
        },
      ])
      .select()

    if (error) {
      toast.error(`Failed to add endpoint: ${error.message}`)
    } else {
      toast.success('Endpoint added successfully!')
      setEndpoints((prev) => [...prev, data[0]])
      setNewName('')
      setNewUrl('')
      setNewCheckInterval(1)
    }
    setIsAdding(false)
  }

  const handleClearNotifications = async () => {
    if (notifications.length === 0) return

    const ids = notifications.map((n) => n.id)
    const { error } = await supabase.from('notifications').delete().in('id', ids)
    if (error) {
      toast.error('Failed to clear notifications')
      return
    }
    setNotifications([])
    toast.success('Notifications cleared', {
      position: 'top-right',
      duration: 2000,
      style: {
        background: 'var(--color-bg-elevated)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)',
      },
    })
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const grafanaDashboardUid = 'adhfn2f'
  const grafanaIframeSrc = selectedEndpointId
    ? `http://localhost:3000/d/${grafanaDashboardUid}/new-dashboard?orgId=1&kiosk=tv&var-endpoint_id=${selectedEndpointId}&refresh=5s&from=now-1h&to=now`
    : null

  // --- IF NOT LOGGED IN: SHOW AUTH UI ---
  if (!session) {
    return <AuthScreen />
  }

  // --- IF LOGGED IN: SHOW DASHBOARD ---
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-base)',
        padding: 'var(--space-8) var(--space-6)',
        fontFamily: 'var(--font-display)',
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            fontSize: 'var(--text-body)',
            fontFamily: 'var(--font-display)',
          },
        }}
      />

      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
          paddingBottom: 'var(--space-6)',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: 'var(--space-8)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          <Activity
            size={20}
            style={{ color: 'var(--color-accent)' }}
          />
          <h1
            style={{
              fontSize: 'var(--text-title)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Sentinel Dashboard
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div ref={notificationRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
              style={{
                background: notificationDropdownOpen ? 'var(--color-bg-surface)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 150ms ease',
              }}
            >
            <Bell
              size={20}
              style={{ color: notificationDropdownOpen ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
            />
            {notifications.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: 'var(--color-negative)',
                  color: 'var(--color-on-negative)',
                  fontSize: '10px',
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                  minWidth: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '999px',
                  padding: '0 4px',
                }}
              >
                {notifications.length > 99 ? '99+' : notifications.length}
              </span>
            )}
          </button>

          {notificationDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '360px',
                maxHeight: '480px',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
                zIndex: 1000,
                overflow: 'hidden',
                animation: 'dropdownSlide 200ms ease-out',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-4) var(--space-5)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <h3
                  style={{
                    fontSize: 'var(--text-body)',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    margin: 0,
                  }}
                >
                  Notifications
                </h3>
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearNotifications}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      fontSize: 'var(--text-micro)',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      transition: 'color 150ms ease, background 150ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--color-negative)'
                      e.target.style.background = 'var(--color-negative-bg)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--color-text-muted)'
                      e.target.style.background = 'transparent'
                    }}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}
              >
                {notifications.length === 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 'var(--space-8) var(--space-5)',
                      gap: 'var(--space-3)',
                    }}
                  >
                    <Bell
                      size={32}
                      style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}
                    />
                    <p
                      style={{
                        fontSize: 'var(--text-body)',
                        color: 'var(--color-text-muted)',
                        margin: 0,
                      }}
                    >
                      No notifications
                    </p>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      style={{
                        padding: 'var(--space-4) var(--space-5)',
                        borderBottom: index < notifications.length - 1 ? '1px solid var(--color-border)' : 'none',
                        display: 'flex',
                        gap: 'var(--space-3)',
                        transition: 'background 150ms ease',
                        cursor: 'default',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-surface)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'var(--color-negative-bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <AlertTriangle size={16} style={{ color: 'var(--color-negative)' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 'var(--text-body)',
                            color: 'var(--color-text-primary)',
                            margin: 0,
                            lineHeight: 1.4,
                            wordBreak: 'break-word',
                          }}
                        >
                          {notification.message}
                        </p>
                        <span
                          style={{
                            fontSize: 'var(--text-micro)',
                            color: 'var(--color-text-muted)',
                            marginTop: '4px',
                            display: 'block',
                          }}
                        >
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          </div>

          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-body)',
              fontFamily: 'var(--font-display)',
              transition: 'border-color 150ms ease, color 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--color-border-hover)'
              e.target.style.color = 'var(--color-text-primary)'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--color-border)'
              e.target.style.color = 'var(--color-text-secondary)'
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div
        style={{
          background: 'var(--color-bg-surface)',
          padding: 'var(--space-5) var(--space-6)',
          borderRadius: '12px',
          marginBottom: 'var(--space-6)',
          maxWidth: '1200px',
          margin: '0 auto var(--space-8)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-body)',
            fontWeight: 500,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginTop: 0,
            marginBottom: 'var(--space-4)',
          }}
        >
          Add New Endpoint
        </h3>
        <form
          onSubmit={handleAddEndpoint}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Endpoint name (e.g., Auth API)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              style={{
                padding: 'var(--space-3) var(--space-4)',
                flex: '1 1 180px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-base)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-body)',
                fontFamily: 'var(--font-display)',
                outline: 'none',
              }}
            />
            <input
              type="url"
              placeholder="https://api.example.com/health"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              required
              style={{
                padding: 'var(--space-3) var(--space-4)',
                flex: '2 1 280px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-base)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-body)',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <label
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 500,
                }}
              >
                Check Interval
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={newCheckInterval}
                onChange={(e) => setNewCheckInterval(parseInt(e.target.value) || 1)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  width: '60px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg-base)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--text-body)',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                }}
              />
              <span
                style={{
                  fontSize: 'var(--text-micro)',
                  color: 'var(--color-text-muted)',
                }}
              >
                min
              </span>
            </div>

            <button
              type="submit"
              disabled={isAdding}
              style={{
                padding: 'var(--space-3) var(--space-5)',
                background: 'var(--color-accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isAdding ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                fontSize: 'var(--text-body)',
                fontFamily: 'var(--font-display)',
                opacity: isAdding ? 0.7 : 1,
                transition: 'opacity 150ms ease',
                marginLeft: 'auto',
              }}
            >
              {isAdding ? 'Adding...' : 'Add Endpoint'}
            </button>
          </div>
        </form>
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: 'var(--text-body)',
            fontWeight: 500,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 'var(--space-4)',
          }}
        >
          Monitored Endpoints
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {endpoints.map((endpoint, index) => (
            <EndpointCard
              key={endpoint.id}
              endpoint={endpoint}
              index={index}
              isSelected={selectedEndpointId === endpoint.id}
              onSelect={setSelectedEndpointId}
              onRequestDelete={handleRequestDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>

        {endpoints.length === 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              padding: 'var(--space-12) 0',
            }}
          >
            <Globe
              size={32}
              style={{ color: 'var(--color-text-muted)' }}
            />
            <p
              style={{
                fontSize: 'var(--text-body)',
                color: 'var(--color-text-muted)',
              }}
            >
              No endpoints configured
            </p>
          </div>
        )}

        {grafanaIframeSrc ? (
          <div
            style={{
              marginTop: 'var(--space-8)',
              background: 'white',
              padding: 'var(--space-5)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
          
            <iframe
              src={grafanaIframeSrc}
              width="100%"
              height="500px"
              frameBorder="0"
              title="Grafana Metrics"
              style={{ border: 'none', borderRadius: '6px' }}
            />
          </div>
        ) : null}
      </main>

      <ConfirmModal
        isOpen={deleteConfirmEndpoint !== null}
        title="Delete Endpoint"
        message={`Are you sure you want to delete "${deleteConfirmEndpoint?.name}"? This will also remove all associated notifications. This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default App
