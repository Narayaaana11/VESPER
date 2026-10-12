# VESPER Mobile (Wispr Flow Ambient Intelligence for Android)

> **100% Local-First Voice-to-Action & Ambient Dictation Platform for Android**  
> *Crafted with Flutter for high performance, zero latency, and zero AI slop.*

---

## 🌟 Overview & Signature Features

VESPER Mobile brings the core ambient voice intelligence of **VESPER Desktop** and **Wispr Flow** to Android devices:

1. **🎙️ Flow Mic Capsule (Hold-to-Talk or Tap-to-Record):**
   - Central interactive capsule button with tactile haptic feedback.
   - Long-press to hold-to-talk, release to finish.
   - Or tap once to start, tap again to finish.

2. **🌊 React Bits Pro Animated Waveform:**
   - 20 dynamic glowing violet-to-indigo audio bars.
   - Real-time decibel responsiveness reacting directly to speech volume.
   - Idle breathing animation when waiting for voice.

3. **💻 100% Local On-Device Compute (Zero Cloud Offline Mode):**
   - Operates 100% on device using Android's native offline speech recognition engine.
   - **Deterministic Local Rule Polisher (<1ms):**
     - Automatically removes filler words (`um`, `uh`, `er`, `you know`, `like`, `sort of`).
     - Eliminates stutters and repeated words (`I I think` → `I think`).
     - Resolves spoken self-corrections (`meet at 3 no wait 4 PM` → `meet at 4:00 PM`).
     - Formats numbers, dates, currency (`50 dollars` → `$50`), and times.
     - Auto-capitalizes sentences and enforces proper punctuation.
     - Strips Whisper silence hallucinations (`Thank you for watching`).
   - Optional **Groq Cloud Acceleration** toggle (Whisper-large-v3-turbo) with automatic offline failover.

4. **⚡ Voice Snippets Expansion:**
   - Say a trigger phrase like *"my calendar link"*, *"review checklist"*, or *"standard email signoff"*.
   - Automatically expands into your full rich pre-configured templates.

5. **📖 Custom Vocabulary Dictionary:**
   - Teach speech recognition rare technical terms (`VESPER`, `Groq`, `Whisper-large-v3`, `Flutter`).
   - Configurable phonetic aliases to fix misrecognized speech (`kevra` → `VESPER`).

6. **🎨 Style Profiles (Polishing Tones):**
   - **Natural Dictation (Default):** Clean, standard punctuated grammar.
   - **Concise & Direct:** Trims polite fluff and gets straight to the point.
   - **Professional / Formal:** Polished business vocabulary, expands contractions.
   - **Key Bullet Points:** Transforms stream-of-consciousness thoughts into structured bullet items.
   - **English Letters Only:** Transliterates words into standard Latin alphabet.

7. **📜 Dictation History Hub:**
   - Searchable timeline of all past dictations.
   - Shows word count, duration in seconds, timestamp, and tone style.
   - One-tap copy to clipboard, native Android share sheet, and delete.

8. **🤖 Ambient Thought Assistant:**
   - Quick context Q&A drawer to summarize recent voice thoughts, brainstorm ideas, or draft email replies.

9. **📱 Android Native System Overlay (Floating Mic Pill):**
   - Android `SYSTEM_ALERT_WINDOW` permission support.
   - Floating microphone capsule over WhatsApp, Slack, Gmail, Notes, and Cursor for dictation anywhere on your phone.

---

## 🏗️ Architecture & Project Structure

Engineered using the Flutter team's Layered MVVM clean architecture:

```
vesper_mobile/
├── android/                         # Android native manifest, permissions & gradle
│   └── app/src/main/AndroidManifest.xml  # RECORD_AUDIO, SYSTEM_ALERT_WINDOW, VIBRATE
├── lib/
│   ├── main.dart                    # App entry point, DI & tab routing
│   ├── domain/models/
│   │   ├── dictation_item.dart      # Immutable dictation entity
│   │   ├── voice_snippet.dart       # Voice shortcut entity
│   │   ├── custom_vocabulary.dart   # Technical jargon entity
│   │   ├── style_profile.dart       # Polishing tone profiles
│   │   └── app_settings.dart        # User configuration state
│   ├── data/
│   │   ├── services/
│   │   │   ├── local_polisher_service.dart     # 100% offline rule post-processor
│   │   │   ├── snippet_service.dart            # Snippet trigger expander
│   │   │   ├── vocabulary_service.dart         # Phonetic jargon replacer
│   │   │   ├── speech_recognition_service.dart # On-device STT + Groq dispatcher
│   │   │   ├── audio_chimes_service.dart       # Auditory cues (start/stop/copy)
│   │   │   ├── haptic_service.dart             # Tactile vibration feedback
│   │   │   └── storage_service.dart            # Local SharedPreferences storage
│   │   └── repositories/
│   │       ├── dictation_repository.dart
│   │       ├── snippets_repository.dart
│   │       ├── vocabulary_repository.dart
│   │       └── settings_repository.dart
│   └── ui/
│       ├── core/
│       │   ├── theme/app_theme.dart            # Wispr Flow Obsidian dark palette
│       │   └── widgets/
│       │       ├── animated_waveform.dart      # React Bits live waveform bars
│       │       ├── glass_card.dart             # Frosted glassmorphism container
│       │       ├── status_pill.dart            # Dictation state indicator
│       │       └── app_nav_bar.dart            # Clean bottom tab navigation
│       └── features/
│           ├── dictation/                      # Flow Mic Capsule & transcript card
│           ├── history/                        # Searchable history timeline
│           ├── snippets/                       # Voice shortcuts management
│           ├── dictionary/                     # Custom technical vocabulary
│           ├── style/                          # Polishing tone profiles & preview
│           ├── assistant/                      # Ambient AI thought assistant
│           └── settings/                       # Engine toggles & overlay permissions
└── test/
    └── unit/
        ├── local_polisher_test.dart            # 9 unit tests for polisher rules
        ├── snippet_service_test.dart           # Unit tests for voice shortcuts
        └── vocabulary_service_test.dart        # Unit tests for custom jargon
```

---

## 🚀 Running on Android

### 1. Install Dependencies
```bash
flutter pub get
```

### 2. Run Tests
```bash
flutter test
```

### 3. Run on Connected Android Device or Emulator
```bash
flutter run
```

### 4. Build Release APK
```bash
flutter build apk --release
```
The compiled APK will be generated at `build/app/outputs/flutter-apk/app-release.apk`.
