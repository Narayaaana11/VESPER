import { app } from 'electron'
import path from 'path'
import fs from 'fs'

/**
 * Resolves the absolute path to an executable binary.
 * CRITICAL RULE: Windows child_process CANNOT execute binaries inside an ASAR archive (app.asar).
 * This resolver guarantees:
 * 1. Checks unpacked resources and extraResources FIRST when running packaged.
 * 2. If any path contains 'app.asar', it converts it to 'app.asar.unpacked'.
 * 3. Never returns a path that does not physically exist on disk.
 */
export function resolveBinary(binaryName: string): string {
  const isPackaged = typeof app !== 'undefined' && app.isPackaged
  const resourcesPath = typeof process !== 'undefined' && process.resourcesPath ? process.resourcesPath : ''
  const appPath = typeof app !== 'undefined' && app.getAppPath ? app.getAppPath() : ''
  const cwd = process.cwd()

  const candidates: string[] = []

  // 1. Packaged locations (Prioritized when packaged)
  if (resourcesPath) {
    // extraResources: /bin/<binaryName>
    candidates.push(path.join(resourcesPath, 'bin', binaryName))
    // extraResources: /<binaryName>
    candidates.push(path.join(resourcesPath, binaryName))
    // extraResources: /out/main/<binaryName>
    candidates.push(path.join(resourcesPath, 'out', 'main', binaryName))
    // asarUnpack: app.asar.unpacked/out/main/<binaryName>
    candidates.push(path.join(resourcesPath, 'app.asar.unpacked', 'out', 'main', binaryName))
    // asarUnpack: app.asar.unpacked/node_modules/node-global-key-listener/bin/<binaryName>
    candidates.push(
      path.join(
        resourcesPath,
        'app.asar.unpacked',
        'node_modules',
        'node-global-key-listener',
        'bin',
        binaryName
      )
    )
  }

  // 2. If appPath is available and contains app.asar, convert to app.asar.unpacked
  if (appPath) {
    const unpackedAppPath = appPath.replace(/app\.asar$/, 'app.asar.unpacked')
    candidates.push(path.join(unpackedAppPath, 'out', 'main', binaryName))
    candidates.push(path.join(unpackedAppPath, 'src', 'main', binaryName))
    candidates.push(
      path.join(
        unpackedAppPath,
        'node_modules',
        'node-global-key-listener',
        'bin',
        binaryName
      )
    )
  }

  // 3. Development / Local workspace locations
  if (!isPackaged) {
    candidates.push(path.join(cwd, 'src', 'main', binaryName))
    candidates.push(path.join(cwd, 'out', 'main', binaryName))
    candidates.push(path.join(cwd, 'out', 'bin', binaryName))
    candidates.push(path.join(__dirname, binaryName))
    candidates.push(path.join(__dirname, '..', binaryName))
    candidates.push(path.join(__dirname, '..', '..', 'bin', binaryName))
    candidates.push(
      path.join(
        cwd,
        'node_modules',
        'node-global-key-listener',
        'bin',
        binaryName
      )
    )
  }

  // Find first candidate that physically exists on disk and is NOT inside app.asar
  for (const candidate of candidates) {
    // Strict defense: reject any path containing app.asar without unpacked
    if (candidate.includes('app.asar') && !candidate.includes('app.asar.unpacked')) {
      continue
    }

    try {
      if (fs.existsSync(candidate)) {
        console.log(`[QEVRA BinaryResolver] Found ${binaryName} at: ${candidate}`)
        return candidate
      }
    } catch {
      // Ignore filesystem access errors during check
    }
  }

  console.warn(`[QEVRA BinaryResolver] Warning: Could not locate physical binary for "${binaryName}". Searched ${candidates.length} locations.`)
  return ''
}
