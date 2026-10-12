# VESPER Mobile Companion (Android Native Service)

This module provides the Android native companion application for VESPER, enabling system-wide floating overlay dictation across all Android apps.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       ANDROID OS SYSTEM                     │
├─────────────────────────────────────────────────────────────┤
│ 1. User taps any text input field (WhatsApp, Slack, Gmail)  │
│                            │                                │
│                            ▼                                │
│ 2. VesperAccessibilityService intercepts TYPE_VIEW_FOCUSED   │
│    (Checks AccessibilityNodeInfo.isEditable == true)        │
│                            │                                │
│                            ▼                                │
│ 3. FloatingPillOverlayService animates Capsule into view   │
│    (WindowManager TYPE_APPLICATION_OVERLAY)                 │
│                            │                                │
│                            ▼                                │
│ 4. Tap or Hold to Record (16kHz PCM AudioCapture)           │
│    Release or Tap stops recording                           │
│                            │                                │
│                            ▼                                │
│ 5. SpeechTranscriptionEngine transcribes & polishes audio   │
│                            │                                │
│                            ▼                                │
│ 6. Text Injected into focused input via ACTION_SET_TEXT     │
└─────────────────────────────────────────────────────────────┘
```

## Key Files
- `VesperAccessibilityService.kt`: Intercepts focused editable fields and manages text injection.
- `FloatingPillOverlayService.kt`: Manages the floating capsule overlay with tap/hold recording.
- `SpeechTranscriptionEngine.kt`: Handles on-device or cloud speech transcription.
- `accessibility_service_config.xml`: Configures accessibility event filters.
- `AndroidManifest.xml`: Declares required system permissions (`SYSTEM_ALERT_WINDOW`, `RECORD_AUDIO`, `BIND_ACCESSIBILITY_SERVICE`).

## Build & Installation
```bash
cd mobile/android
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```
