import React from 'react'
import { ArrowUpLeft, ChevronRight, X, Sparkles, CheckCircle2 } from 'lucide-react'

export interface GuidanceStep {
  stepIndex: number
  totalSteps: number
  title: string
  instruction: string
  targetElement?: string
  coordinates?: { x: number; y: number }
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
  // Clamp coordinates to safe visible screen margins if provided, else position near center-top
  const posX = currentStep.coordinates ? Math.max(40, currentStep.coordinates.x) : 180
  const posY = currentStep.coordinates ? Math.max(40, currentStep.coordinates.y) : 90

  return (
    <div className="vesper-guidance-overlay-wrapper">
      {/* Visual Cursor & Pulse Target Ring */}
      <div
        className="vesper-ai-cursor-target"
        style={{
          left: `${posX}px`,
          top: `${posY}px`
        }}
      >
        <div className="vesper-cursor-pulse-ring" />
        <div className="vesper-cursor-inner-dot" />
        <div className="vesper-cursor-pointer-arrow">
          <ArrowUpLeft size={24} className="vesper-cursor-arrow-icon" />
        </div>

        {/* Step Callout Card */}
        <div className="vesper-guidance-card">
          <div className="vesper-guidance-header">
            <div className="vesper-step-badge">
              <Sparkles size={11} className="vesper-sparkle-icon" />
              <span>
                Step {currentStep.stepIndex} of {currentStep.totalSteps}
              </span>
            </div>
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
          </div>

          <div className="vesper-guidance-footer">
            {onPrevStep && currentStep.stepIndex > 1 && (
              <button className="vesper-guidance-btn vesper-btn-secondary" onClick={onPrevStep}>
                Back
              </button>
            )}

            {onExecuteCurrentStep && (
              <button className="vesper-guidance-btn vesper-btn-execute" onClick={onExecuteCurrentStep}>
                Click for me
              </button>
            )}

            {onNextStep && currentStep.stepIndex < currentStep.totalSteps ? (
              <button className="vesper-guidance-btn vesper-btn-primary" onClick={onNextStep}>
                Next <ChevronRight size={12} />
              </button>
            ) : (
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
