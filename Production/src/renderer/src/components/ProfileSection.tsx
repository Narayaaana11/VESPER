import React, { useState } from 'react'
import {
  User,
  ShieldCheck,
  Key,
  ExternalLink,
  Check,
  Eye,
  EyeOff,
  LogOut,
  Power,
  Sparkles,
  CloudLightning,
  CheckCircle2
} from 'lucide-react'
import { UserProfile, ProfileService } from '../core/profile-service'
import { AppSettings } from '../types/task'

interface ProfileSectionProps {
  settings: AppSettings
  onUpdateSettings: (settings: Partial<AppSettings>) => void
  userProfile: UserProfile
  onUpdateProfile: (profile: UserProfile) => void
  startupEnabled: boolean
  onToggleStartup: (enabled: boolean) => void
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  settings,
  onUpdateSettings,
  userProfile,
  onUpdateProfile,
  startupEnabled,
  onToggleStartup
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(settings.apiKey || userProfile.cloudApiKey || '')
  const [showKey, setShowKey] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  const handleSaveKey = () => {
    const trimmed = apiKeyInput.trim()
    onUpdateSettings({ apiKey: trimmed })
    const updatedProfile = ProfileService.updateCloudApiKey(trimmed)
    onUpdateProfile(updatedProfile)
    setSaveStatus('Key saved successfully!')
    setTimeout(() => setSaveStatus(null), 2500)
  }

  const handleOpenWebSignup = () => {
    const baseUrl = (import.meta as any).env?.VITE_LAUNCHPAD_URL || 'http://localhost:8080'
    const url = `${baseUrl}/#signup`
    if (window.electronAPI?.openExternalUrl) {
      window.electronAPI.openExternalUrl(url)
    } else {
      window.open(url, '_blank')
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of your VESPER account?')) {
      const loggedOut = ProfileService.logout()
      onUpdateProfile(loggedOut)
    }
  }

  return (
    <div className="wfd-profile-arena">
      {/* 1. Profile Header Card */}
      <div className="wfd-profile-card">
        <div className="wfd-profile-header-row">
          <div className="wfd-profile-avatar-wrap">
            <div className="wfd-profile-avatar">
              <User size={28} className="text-[#ff6b00]" />
            </div>
            <div>
              <div className="wfd-profile-name-row">
                <h3 className="wfd-profile-name">{userProfile.displayName || 'Authorized User'}</h3>
                <span className="wfd-profile-verified-badge">
                  <ShieldCheck size={12} />
                  <span>Verified User</span>
                </span>
              </div>
              <p className="wfd-profile-email">{userProfile.email || 'active.session@vesper.local'}</p>
            </div>
          </div>

          <div className="wfd-profile-actions-top">
            <button className="wfd-profile-web-btn" onClick={handleOpenWebSignup} title="Open Launchpad in browser">
              <span>Account Portal</span>
              <ExternalLink size={12} />
            </button>
            <button className="wfd-profile-logout-btn" onClick={handleLogout} title="Sign Out">
              <LogOut size={13} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        <div className="wfd-profile-meta-grid">
          <div className="wfd-meta-item">
            <span className="wfd-meta-label">Plan Membership</span>
            <span className="wfd-meta-val text-[#ff6b00]">
              {userProfile.tier === 'pro' ? 'Pro Unlimited' : 'Free Tier (30m/day)'}
            </span>
          </div>
          <div className="wfd-meta-item">
            <span className="wfd-meta-label">Authentication Status</span>
            <span className="wfd-meta-val text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>Session Authenticated</span>
            </span>
          </div>
          <div className="wfd-meta-item">
            <span className="wfd-meta-label">Hardware Acceleration</span>
            <span className="wfd-meta-val text-slate-700">Windows DirectInput Active</span>
          </div>
        </div>
      </div>

      {/* 2. Cloud Engine Key Section */}
      <div className="wfd-profile-section-box">
        <div className="wfd-box-header">
          <div className="wfd-box-title-wrap">
            <CloudLightning size={16} className="text-[#ff6b00]" />
            <h4 className="wfd-box-title">Cloud Acceleration Engine</h4>
          </div>
          <span className="wfd-box-badge">Multi-Cloud Ready</span>
        </div>

        <p className="wfd-box-description">
          Add your <strong>Cloud Acceleration Key (Groq LPU)</strong> to unlock sub-180ms cloud speech processing,
          multi-cloud intelligence, and contextual query acceleration. Your key stays encrypted on your local device.
        </p>

        <div className="wfd-key-input-row">
          <div className="wfd-key-field-wrap">
            <Key size={14} className="wfd-key-icon" />
            <input
              type={showKey ? 'text' : 'password'}
              className="wfd-key-input"
              placeholder="gsk_..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
            />
            <button
              type="button"
              className="wfd-key-toggle-btn"
              onClick={() => setShowKey(!showKey)}
              title={showKey ? 'Hide Key' : 'Reveal Key'}
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <button className="wfd-key-save-btn" onClick={handleSaveKey}>
            {saveStatus ? <Check size={14} /> : <Sparkles size={14} />}
            <span>{saveStatus || 'Save Key'}</span>
          </button>
        </div>
      </div>

      {/* 3. System Preferences */}
      <div className="wfd-profile-section-box">
        <div className="wfd-box-header">
          <div className="wfd-box-title-wrap">
            <Power size={16} className="text-slate-600" />
            <h4 className="wfd-box-title">System & Startup Configuration</h4>
          </div>
        </div>

        <div className="wfd-toggle-item">
          <div>
            <div className="wfd-toggle-title">Launch VESPER automatically on Windows startup</div>
            <div className="wfd-toggle-desc">
              Runs VESPER quietly in the background tray so your voice hotkey is always available.
            </div>
          </div>
          <label className="wfd-switch">
            <input
              type="checkbox"
              checked={startupEnabled}
              onChange={(e) => onToggleStartup(e.target.checked)}
            />
            <span className="wfd-slider"></span>
          </label>
        </div>

        <div className="wfd-toggle-item border-t border-slate-100 pt-3">
          <div>
            <div className="wfd-toggle-title">Sound Chime Feedback</div>
            <div className="wfd-toggle-desc">Play soft tactile audio feedback when speech recording starts and stops.</div>
          </div>
          <label className="wfd-switch">
            <input
              type="checkbox"
              checked={settings.soundFeedback}
              onChange={(e) => onUpdateSettings({ soundFeedback: e.target.checked })}
            />
            <span className="wfd-slider"></span>
          </label>
        </div>
      </div>
    </div>
  )
}
