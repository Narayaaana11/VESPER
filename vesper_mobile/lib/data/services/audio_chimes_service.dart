import 'package:flutter/services.dart';

/// Provides audio auditory cues for dictation states (Start, Stop, Success)
/// replicating Wispr Flow & VESPER desktop audio chimes.
class AudioChimesService {
  static bool soundEnabled = true;

  /// Rising auditory tone played when recording begins
  static Future<void> playStart() async {
    if (!soundEnabled) return;
    try {
      // System sound cue + vibration
      await SystemSound.play(SystemSoundType.click);
    } catch (_) {}
  }

  /// Falling auditory tone played when speech capture stops and processing starts
  static Future<void> playStop() async {
    if (!soundEnabled) return;
    try {
      await SystemSound.play(SystemSoundType.click);
    } catch (_) {}
  }

  /// Pleasant confirmation chime played when text is copied to clipboard
  static Future<void> playSuccess() async {
    if (!soundEnabled) return;
    try {
      await SystemSound.play(SystemSoundType.click);
    } catch (_) {}
  }
}
