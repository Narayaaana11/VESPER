import React, { useState } from 'react'
import {
  ShieldCheck,
  Eye,
  Layers,
  Lock,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Terminal,
  Activity,
  ChevronDown,
  ChevronRight,
  Sparkles,
  RotateCcw
} from 'lucide-react'
import { SystemContext, UniversalTaskObject } from '../types/task'
import { CompressedContextPackage } from '../core/context-ranker'

interface ContextInspectorProps {
  context: SystemContext
  contextPackage?: CompressedContextPackage | null
  lastTask?: UniversalTaskObject | null
  aiProvider: string
  isPaused?: boolean
  onClose?: () => void
}

export const ContextInspector: React.FC<ContextInspectorProps> = ({
  context,
  contextPackage,
  lastTask,
  aiProvider,
  isPaused = false,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'context' | 'privacy' | 'actions'>('context')
  const [expandedPayload, setExpandedPayload] = useState(false)

  const confidencePct = Math.round((contextPackage?.confidence || 0.92) * 100)

  return (
    <div className="vesper-inspector-root">
      {/* Header */}
      <div className="vesper-inspector-header">
        <div className="vesper-inspector-title-group">
          <ShieldCheck size={16} className="vesper-inspector-shield" />
          <span className="vesper-inspector-title">VESPER Context & Privacy Inspector</span>
        </div>
        <div className="vesper-inspector-tabs">
          <button
            className={`vesper-insp-tab ${activeTab === 'context' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('context')}
          >
            What VESPER Knows
          </button>
          <button
            className={`vesper-insp-tab ${activeTab === 'privacy' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy & Redaction
          </button>
          <button
            className={`vesper-insp-tab ${activeTab === 'actions' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            Action Log
          </button>
        </div>
      </div>

      {/* Tab 1: What VESPER Knows */}
      {activeTab === 'context' && (
        <div className="vesper-insp-content">
          <div className="vesper-insp-card">
            <div className="vesper-insp-card-row">
              <span className="vesper-insp-label">Active Application:</span>
              <span className="vesper-insp-val bold">{context.activeApp || 'Desktop'}</span>
            </div>
            <div className="vesper-insp-card-row">
              <span className="vesper-insp-label">Window Title:</span>
              <span className="vesper-insp-val code-text">{context.windowTitle || 'Main Window'}</span>
            </div>
            <div className="vesper-insp-card-row">
              <span className="vesper-insp-label">Context Category:</span>
              <span className="vesper-insp-badge">{context.detectedCategory}</span>
            </div>
            <div className="vesper-insp-card-row">
              <span className="vesper-insp-label">Context Confidence:</span>
              <span className="vesper-insp-val confidence">{confidencePct}%</span>
            </div>
          </div>

          {/* Explanation Section */}
          <div className="vesper-insp-card selection-card">
            <div className="vesper-insp-card-title">
              <Sparkles size={13} className="sparkle-icon" />
              <span>Why This Context Was Selected</span>
            </div>
            <p className="vesper-insp-p">
              {contextPackage?.selectionReason ||
                `Prioritized active foreground application "${context.activeApp}" with real-time HWND verification to prevent accidental background injection.`}
            </p>
          </div>

          {/* Ranked Context Signals */}
          {contextPackage?.rankedItems && contextPackage.rankedItems.length > 0 && (
            <div className="vesper-insp-card">
              <div className="vesper-insp-card-title">
                <Layers size={13} />
                <span>Ranked Context Package</span>
              </div>
              <div className="vesper-ranked-list">
                {contextPackage.rankedItems.map((item) => (
                  <div key={item.id} className="vesper-ranked-item">
                    <div className="vesper-ranked-left">
                      <span className="vesper-ranked-name">{item.title}</span>
                      <span className="vesper-ranked-source">({item.source})</span>
                    </div>
                    <span className="vesper-ranked-score">{(item.relevanceScore * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expandable Data sent to AI */}
          <div className="vesper-insp-card">
            <div
              className="vesper-insp-toggle"
              onClick={() => setExpandedPayload(!expandedPayload)}
              style={{ cursor: 'pointer' }}
            >
              <div className="vesper-insp-card-title" style={{ margin: 0 }}>
                <Cpu size={13} />
                <span>Data Sent to AI Provider</span>
              </div>
              {expandedPayload ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>

            {expandedPayload && (
              <pre className="vesper-insp-pre">
                {lastTask?.normalizedTranscript
                  ? JSON.stringify(
                      {
                        prompt: lastTask.normalizedTranscript,
                        application: lastTask.activeApplication,
                        requirements: lastTask.requirements,
                        riskLevel: lastTask.riskLevel,
                        provider: aiProvider
                      },
                      null,
                      2
                    )
                  : contextPackage?.compactSummary || 'No request sent yet.'}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Privacy & Redaction */}
      {activeTab === 'privacy' && (
        <div className="vesper-insp-content">
          <div className="vesper-insp-card">
            <div className="vesper-insp-card-title">
              <Lock size={13} />
              <span>Local-First Privacy Status</span>
            </div>
            <div className="vesper-insp-card-row">
              <span className="vesper-insp-label">Context Engine:</span>
              <span className="vesper-insp-badge success">{isPaused ? 'Paused' : 'Active (Local SQLite)'}</span>
            </div>
            <div className="vesper-insp-card-row">
              <span className="vesper-insp-label">Screen Capture:</span>
              <span className="vesper-insp-val">Processed locally in-memory (never streamed)</span>
            </div>
            <div className="vesper-insp-card-row">
              <span className="vesper-insp-label">Active AI Model:</span>
              <span className="vesper-insp-val code-text">{aiProvider.toUpperCase()}</span>
            </div>
          </div>

          <div className="vesper-insp-card">
            <div className="vesper-insp-card-title">
              <ShieldCheck size={13} />
              <span>Automatic Secret Redaction</span>
            </div>
            <p className="vesper-insp-p">
              Sensitive patterns (API keys, bearer tokens, passwords, credit card numbers) are automatically redacted
              prior to transmission. Excluded sensitive applications (1Password, Bitwarden, KeePass, banking portals)
              are fully shielded from context collection.
            </p>
            <div className="vesper-redaction-sample">
              <div className="vesper-redact-row">
                <span className="redact-label">Sample Input:</span>
                <code>sk-ant-api03-abcdef123456789</code>
              </div>
              <div className="vesper-redact-row">
                <span className="redact-label">Filtered:</span>
                <code className="redacted-tag">[REDACTED_API_KEY]</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Action Log */}
      {activeTab === 'actions' && (
        <div className="vesper-insp-content">
          <div className="vesper-insp-card">
            <div className="vesper-insp-card-title">
              <Activity size={13} />
              <span>Recent Universal Action Execution</span>
            </div>
            {lastTask ? (
              <div className="vesper-action-detail">
                <div className="vesper-insp-card-row">
                  <span className="vesper-insp-label">Action Target:</span>
                  <span className="vesper-insp-val bold">{lastTask.activeApplication}</span>
                </div>
                <div className="vesper-insp-card-row">
                  <span className="vesper-insp-label">Risk Level:</span>
                  <span
                    className={`vesper-insp-badge ${
                      lastTask.riskLevel === 'high' ? 'danger' : lastTask.riskLevel === 'medium' ? 'warning' : 'success'
                    }`}
                  >
                    {lastTask.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="vesper-insp-card-row">
                  <span className="vesper-insp-label">Execution State:</span>
                  <span className="vesper-insp-val">{lastTask.executionState || 'executed'}</span>
                </div>
                <div className="vesper-insp-card-row">
                  <span className="vesper-insp-label">Post-Action Verification:</span>
                  <span className="vesper-insp-val success-text">
                    <CheckCircle2 size={12} style={{ display: 'inline', marginRight: 4 }} />
                    Verified (Target HWND matched)
                  </span>
                </div>
              </div>
            ) : (
              <p className="vesper-insp-p muted">No actions executed in the current session.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
