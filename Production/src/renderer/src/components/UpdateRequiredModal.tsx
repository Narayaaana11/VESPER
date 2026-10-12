import React, { useState } from 'react'
import { Download, ExternalLink, RefreshCw, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react'
import { VesperLogo } from './VesperLogo'

export interface UpdateInfo {
  isUpdateRequired: boolean
  currentVersion: string
  latestVersion: string
  minRequiredVersion?: string
  mandatory?: boolean
  downloadUrl?: string
  webPortalUrl?: string
  releaseNotes?: string
}

interface UpdateRequiredModalProps {
  isOpen: boolean
  updateInfo: UpdateInfo | null
  onCheckAgain?: () => void
}

export const UpdateRequiredModal: React.FC<UpdateRequiredModalProps> = ({
  isOpen,
  updateInfo,
  onCheckAgain
}) => {
  const [checking, setChecking] = useState(false)

  if (!isOpen || !updateInfo || !updateInfo.isUpdateRequired) {
    return null
  }

  const currentVersion = updateInfo.currentVersion || '1.0.0'
  const latestVersion = updateInfo.latestVersion || '1.10.0'
  const downloadUrl =
    updateInfo.downloadUrl || 'https://github.com/Narayaaana11/vesper-release/releases/download/v1.0.0/setup.exe'
  const portalUrl =
    updateInfo.webPortalUrl || 'https://vesperflow-ai.vercel.app/#download'
  const releaseNotes =
    updateInfo.releaseNotes ||
    'Mandatory system stability, high-speed neural pipeline, and cloud synchronization enhancements.'

  const handleDownload = () => {
    if (window.electronAPI?.openExternalUrl) {
      window.electronAPI.openExternalUrl(downloadUrl)
    } else {
      window.open(downloadUrl, '_blank')
    }
  }

  const handleOpenPortal = () => {
    if (window.electronAPI?.openExternalUrl) {
      window.electronAPI.openExternalUrl(portalUrl)
    } else {
      window.open(portalUrl, '_blank')
    }
  }

  const handleRefresh = async () => {
    if (checking) return
    setChecking(true)
    try {
      if (onCheckAgain) {
        await onCheckAgain()
      } else if (window.electronAPI?.checkForUpdates) {
        await window.electronAPI.checkForUpdates()
      }
    } finally {
      setTimeout(() => setChecking(false), 800)
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 border border-orange-100 shadow-sm">
              <VesperLogo size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-orange-600">
                  VESPER Flow
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  <AlertTriangle size={11} className="text-amber-600" />
                  Mandatory Update
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Update Required to Continue
              </h2>
            </div>
          </div>
        </div>

        {/* Informational Message */}
        <p className="mt-4 text-xs leading-relaxed text-slate-600">
          A new version of VESPER is available. To maintain real-time neural dictation, keyboard hooks, and cloud synchronization, you must update before using ambient features or the Right Alt hotkey.
        </p>

        {/* Version Badge Comparison */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Current Version
            </div>
            <div className="mt-1 font-mono text-sm font-semibold text-slate-700">
              v{currentVersion}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400">Installed locally</div>
          </div>

          <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-orange-600">
              Latest Required
            </div>
            <div className="mt-1 font-mono text-sm font-bold text-orange-600">
              v{latestVersion}
            </div>
            <div className="mt-0.5 text-[11px] text-orange-700/80">Available now</div>
          </div>
        </div>

        {/* Release Notes */}
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <Sparkles size={13} className="text-orange-500" />
            <span>What's New in v{latestVersion}</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-sans">
            {releaseNotes}
          </p>
        </div>

        {/* Notification Warning */}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50/80 border border-amber-200/60 px-3 py-2 text-[11px] text-amber-800">
          <AlertTriangle size={14} className="shrink-0 text-amber-600" />
          <span>
            Holding <strong>Right Alt</strong> is paused until the installer finishes.
          </span>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleDownload}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-500 active:scale-[0.99]"
          >
            <Download size={16} />
            <span>Download & Install Update (setup.exe)</span>
          </button>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleOpenPortal}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <span>View Web Download Portal</span>
              <ExternalLink size={12} />
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={checking}
              className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={12} className={checking ? 'animate-spin' : ''} />
              <span>{checking ? 'Checking...' : 'Check Again'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
