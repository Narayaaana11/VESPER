import { describe, it, expect } from 'vitest'
import { ScreenNavigator } from '../../src/renderer/src/core/screen-navigator'

describe('OmniScreen Navigation Engine', () => {
  it('resolves spatial coordinates for standard GitHub navigation queries', () => {
    const plan = ScreenNavigator.resolveNavigationTarget('click pull requests tab', 'GitHub', 1920, 1080)
    expect(plan.status).toBe('matched')
    expect(plan.targetElement).not.toBeNull()
    expect(plan.targetElement?.label).toBe('Pull Requests Tab')
    expect(plan.targetElement?.x).toBeGreaterThan(0)
    expect(plan.targetElement?.y).toBe(110)
    expect(plan.allCandidates.length).toBeGreaterThan(0)
  })

  it('identifies search bar target and calculates center coordinates', () => {
    const plan = ScreenNavigator.resolveNavigationTarget('focus search input bar', 'VS Code', 1920, 1080)
    expect(plan.status).toBe('matched')
    expect(plan.targetElement?.type).toBe('input')
    expect(plan.targetElement?.label).toBe('Search Input Bar')
    expect(plan.targetElement?.x).toBe(960)
  })

  it('creates interpreted target fallback for novel input targets', () => {
    const plan = ScreenNavigator.resolveNavigationTarget('click the blue deploy button', 'Vercel', 1920, 1080)
    expect(plan.targetElement).not.toBeNull()
    expect(plan.targetElement?.label).toContain('click the blue deploy button')
  })
})
