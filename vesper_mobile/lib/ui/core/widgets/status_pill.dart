import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

enum DictationState {
  idle,
  listening,
  transcribing,
  polishing,
  copied,
}

/// Dynamic capsule status pill showing dictation stage
class StatusPill extends StatelessWidget {
  final DictationState state;

  const StatusPill({super.key, required this.state});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color textColor;
    IconData icon;
    String label;

    switch (state) {
      case DictationState.idle:
        bg = AppTheme.surfaceCard;
        textColor = AppTheme.textSecondary;
        icon = Icons.mic_none_rounded;
        label = 'Ready to Dictate';
        break;
      case DictationState.listening:
        bg = AppTheme.primary.withOpacity(0.2);
        textColor = AppTheme.primary;
        icon = Icons.mic_rounded;
        label = 'Listening...';
        break;
      case DictationState.transcribing:
        bg = AppTheme.secondary.withOpacity(0.2);
        textColor = AppTheme.secondary;
        icon = Icons.hearing_rounded;
        label = 'Transcribing...';
        break;
      case DictationState.polishing:
        bg = AppTheme.cyanAccent.withOpacity(0.2);
        textColor = AppTheme.cyanAccent;
        icon = Icons.auto_awesome_rounded;
        label = 'Polishing Text...';
        break;
      case DictationState.copied:
        bg = AppTheme.emeraldSuccess.withOpacity(0.2);
        textColor = AppTheme.emeraldSuccess;
        icon = Icons.check_circle_rounded;
        label = 'Copied to Clipboard!';
        break;
    }

    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(
          color: textColor.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: textColor),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              color: textColor,
              fontSize: 13,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}
