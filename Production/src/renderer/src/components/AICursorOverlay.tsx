import React from 'react'
import { ArrowUpLeft, ChevronRight, X, Sparkles, CheckCircle2, CornerDownLeft } from 'lucide-react'

export interface GuidanceStep {
  stepIndex: number
  totalSteps: number
  title: string
  instruction: string
  targetElement?: string
  coordinates?: { x: number; y: number }
  actionButtonText?: string
  shortcut?: string
  actionCommand?: string
}

interface AICursorOverlayProps {
  currentStep: GuidanceStep
  onNextStep?: () => void
  onPrevStep?: () => void
  onDismiss: () => void
  onExecuteCurrentStep?: () => void
}

export const AICursorOverlay: React.FC<AICursorOverlayProps> = ({
  currentStep,
  onNextStep,
  onPrevStep,
  onDismiss,
  onExecuteCurrentStep
}) => {
  // Clamp coordinates so the halo and callout card (280px wide) fit within the 620x290 capsule window
  const posX = currentStep.coordinates ? Math.min(260, Math.max(20, currentStep.coordinates.x)) : 140
  const posY = currentStep.coordinates ? Math.min(70, Math.max(10, currentStep.coordinates.y)) : 40

  const handleActionClick = () => {
    if (onExecuteCurrentStep) {
      onExecuteCurrentStep()
    } else if (onNextStep) {
      onNextStep()
    } else {
      onDismiss()
    }
  }

  return (
    <div className="vesper-guidance-overlay-wrapper">
      {/* Visual Cursor & Glowing Halo Pulse Target Ring */}
      <div
        className="vesper-ai-cursor-target"
        style={{
          left: `${posX}px`,
          top: `${posY}px`
        }}
      >
        <div
          className="vesper-cursor-halo-anchor"
          onClick={handleActionClick}
          title="Click to proceed"
        >
          <div className="vesper-cursor-pulse-ring" />
          <div className="vesper-cursor-inner-dot" />
          <div className="vesper-cursor-pointer-arrow">
            <ArrowUpLeft size={26} className="vesper-cursor-arrow-icon" />
          </div>
        </div>

        {/* Step Callout Card beside the cursor */}
        <div className="vesper-guidance-card">
          <div className="vesper-guidance-header">
            <div className="vesper-step-badge">
              <Sparkles size={11} className="vesper-sparkle-icon" />
              <span>
                Step {currentStep.stepIndex} of {currentStep.totalSteps}
              </span>
            </div>
            {currentStep.targetElement && (
              <div className="vesper-guidance-target-tag" title={currentStep.targetElement}>
                {currentStep.targetElement}
              </div>
            )}
            <button
              className="vesper-guidance-close"
              onClick={onDismiss}
              title="Dismiss Guide (Esc)"
            >
              <X size={12} />
            </button>
          </div>

          <div className="vesper-guidance-body">
            <div className="vesper-guidance-title">{currentStep.title}</div>
            <div className="vesper-guidance-instruction">{currentStep.instruction}</div>
            {currentStep.shortcut && (
              <div className="vesper-guidance-shortcut-badge">
                <span>Shortcut:</span>
                <kbd>{currentStep.shortcut}</kbd>
              </div>
            )}
          </div>

          <div className="vesper-guidance-footer">
            {onPrevStep && currentStep.stepIndex > 1 && (
              <button className="vesper-guidance-btn vesper-btn-secondary" onClick={onPrevStep}>
                Back
              </button>
            )}

            <button
              className="vesper-guidance-btn vesper-btn-execute"
              onClick={handleActionClick}
            >
              <CornerDownLeft size={11} />
              {currentStep.actionButtonText || (currentStep.stepIndex < currentStep.totalSteps ? 'Click that' : 'Done')}
            </button>

            {onNextStep && currentStep.stepIndex < currentStep.totalSteps && (
              <button className="vesper-guidance-btn vesper-btn-primary" onClick={onNextStep}>
                Next <ChevronRight size={12} />
              </button>
            )}

            {currentStep.stepIndex >= currentStep.totalSteps && !onNextStep && (
              <button className="vesper-guidance-btn vesper-btn-primary" onClick={onDismiss}>
                Done <CheckCircle2 size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
