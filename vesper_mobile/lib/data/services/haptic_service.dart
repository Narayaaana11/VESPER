import 'package:flutter/services.dart';

/// Provides tactile haptic feedback for micro-interactions
class HapticService {
  static bool hapticsEnabled = true;

  /// Subtle tactile tap on button press
  static Future<void> light() async {
    if (!hapticsEnabled) return;
    try {
      await HapticFeedback.lightImpact();
    } catch (_) {}
  }

  /// Distinct pulse when voice recording begins
  static Future<void> recordStart() async {
    if (!hapticsEnabled) return;
    try {
      await HapticFeedback.mediumImpact();
    } catch (_) {}
  }

  /// Distinct pulse when voice recording stops
  static Future<void> recordStop() async {
    if (!hapticsEnabled) return;
    try {
      await HapticFeedback.heavyImpact();
    } catch (_) {}
  }

  /// Celebratory double pulse when text is copied/injected
  static Future<void> success() async {
    if (!hapticsEnabled) return;
    try {
      await HapticFeedback.mediumImpact();
      await Future.delayed(const Duration(milliseconds: 60));
      await HapticFeedback.lightImpact();
    } catch (_) {}
  }
}
