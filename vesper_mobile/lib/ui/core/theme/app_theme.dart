import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// VESPER Flow Design System
/// Dark obsidian aesthetic matching Wispr Flow desktop & mobile UI.
class AppTheme {
  // Color Palette
  static const Color background = Color(0xFF0B0D13);
  static const Color surface = Color(0xFF131824);
  static const Color surfaceCard = Color(0xFF181F30);
  static const Color surfaceGlass = Color(0xCC181F30);
  static const Color surfaceBorder = Color(0x1FFFFFFF);
  static const Color surfaceHighlight = Color(0x2E6366F1);

  // Accents
  static const Color primary = Color(0xFF6366F1); // Indigo
  static const Color secondary = Color(0xFFA855F7); // Purple
  static const Color cyanAccent = Color(0xFF06B6D4);
  static const Color emeraldSuccess = Color(0xFF10B981);
  static const Color amberWarning = Color(0xFFF59E0B);
  static const Color roseDanger = Color(0xFFF43F5E);

  // Text
  static const Color textPrimary = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: primary,
      colorScheme: const ColorScheme.dark(
        primary: primary,
        secondary: secondary,
        surface: surface,
        error: roseDanger,
      ),
      textTheme: GoogleFonts.interTextTheme(
        const TextTheme(
          displayLarge: TextStyle(color: textPrimary, fontSize: 32, fontWeight: FontWeight.bold),
          displayMedium: TextStyle(color: textPrimary, fontSize: 24, fontWeight: FontWeight.bold),
          titleLarge: TextStyle(color: textPrimary, fontSize: 18, fontWeight: FontWeight.w600),
          titleMedium: TextStyle(color: textPrimary, fontSize: 16, fontWeight: FontWeight.w500),
          bodyLarge: TextStyle(color: textPrimary, fontSize: 15, fontWeight: FontWeight.normal),
          bodyMedium: TextStyle(color: textSecondary, fontSize: 13, fontWeight: FontWeight.normal),
          labelSmall: TextStyle(color: textMuted, fontSize: 11, fontWeight: FontWeight.w500),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(color: textPrimary, fontSize: 18, fontWeight: FontWeight.w700),
        iconTheme: IconThemeData(color: textPrimary),
      ),
    );
  }
}
