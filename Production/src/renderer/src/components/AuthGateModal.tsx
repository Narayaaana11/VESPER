import React, { useState } from 'react'
import { LogIn, UserPlus, ExternalLink, ShieldCheck, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { ProfileService, UserProfile } from '../core/profile-service'
import { VesperLogo } from './VesperLogo'

interface AuthGateModalProps {
  isOpen: boolean
  onAuthenticated: (profile: UserProfile) => void
  onClose: () => void
}

export const AuthGateModal: React.FC<AuthGateModalProps> = ({
  isOpen,
  onAuthenticated,
  onClose
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    const profile = ProfileService.login(email.trim(), password)
    onAuthenticated(profile)
    onClose()
  }

  const handleOpenWebSignup = () => {
    const baseUrl = (import.meta as any).env?.VITE_LAUNCHPAD_URL || (import.meta as any).env?.VITE_VESPER_API_URL || 'https://vesperflow-ai.vercel.app'
    const url = `${baseUrl}/#signup`
    if (window.electronAPI?.openExternalUrl) {
      window.electronAPI.openExternalUrl(url)
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="wfd-auth-modal-overlay">
      <div className="wfd-auth-modal-box">
        {/* Brand Icon */}
        <div className="wfd-auth-icon-wrap">
          <VesperLogo size={48} />
        </div>

        <h2 className="wfd-auth-title">Welcome to VESPER</h2>
        <p className="wfd-auth-subtitle">
          Sign in to activate your ambient voice-to-action engine and synchronize your license.
        </p>

        {error && <div className="wfd-auth-error">{error}</div>}

        <form onSubmit={handleSignIn} className="wfd-auth-form">
          <div className="wfd-auth-field">
            <label className="wfd-auth-label">Email Address</label>
            <div className="wfd-auth-input-wrap">
              <Mail size={15} className="wfd-auth-field-icon" />
              <input
                type="email"
                className="wfd-auth-input"
                placeholder="developer@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                autoFocus
              />
            </div>
          </div>

          <div className="wfd-auth-field">
            <label className="wfd-auth-label">Password</label>
            <div className="wfd-auth-input-wrap">
              <Lock size={15} className="wfd-auth-field-icon" />
              <input
                type="password"
                className="wfd-auth-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="wfd-auth-submit-btn">
            <LogIn size={15} />
            <span>Sign In to VESPER</span>
          </button>
        </form>

        <div className="wfd-auth-divider">
          <span>or create an account</span>
        </div>

        <button type="button" className="wfd-auth-signup-btn" onClick={handleOpenWebSignup}>
          <UserPlus size={15} />
          <span>Create Account on Web Portal</span>
          <ExternalLink size={13} className="ml-auto text-slate-400" />
        </button>
      </div>
    </div>
  )
}
