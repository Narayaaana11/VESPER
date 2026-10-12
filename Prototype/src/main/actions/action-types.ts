export type ActionRiskLevel = 'low' | 'medium' | 'high'

export type UniversalActionType =
  | 'typeText'
  | 'pasteText'
  | 'openApp'
  | 'closeApp'
  | 'openURL'
  | 'createFile'
  | 'editFile'
  | 'saveFile'
  | 'runCommand'
  | 'composeEmail'
  | 'sendMessage'

export interface ActionPreconditions {
  requiredApp?: string
  requiredHwnd?: number
  requiredFile?: string
  requiresInternet?: boolean
}

export interface UniversalActionPayload {
  actionId: string
  actionType: UniversalActionType
  target: string
  parameters: Record<string, any>
  riskLevel: ActionRiskLevel
  preconditions?: ActionPreconditions
  description: string
  reversalInfo?: {
    isReversible: boolean
    previousContent?: string
    targetPath?: string
    reversalActionType?: UniversalActionType
  }
}

export interface UniversalActionResult {
  success: boolean
  actionId: string
  actionType: UniversalActionType
  outcome: 'success' | 'failure' | 'partial_success' | 'needs_user'
  message: string
  details?: Record<string, any>
  verification: {
    verified: boolean
    checks: string[]
    timestamp: number
  }
  reversalAvailable: boolean
}
