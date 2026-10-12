import '../../domain/models/voice_snippet.dart';

/// Service to handle automatic expansion of voice shortcut snippets
class SnippetService {
  /// Checks if the transcribed text matches any configured snippet trigger.
  /// If matched, returns the expanded text; otherwise returns original text.
  static String expandSnippets(String text, List<VoiceSnippet> snippets) {
    if (text.trim().isEmpty || snippets.isEmpty) return text;

    final normalizedText = text.trim().toLowerCase();

    for (final snippet in snippets) {
      final trigger = snippet.trigger.trim().toLowerCase();
      // Exact match or contains trigger
      if (normalizedText == trigger ||
          normalizedText == '$trigger.' ||
          normalizedText.contains(trigger)) {
        // If trigger is a subphrase, replace it; otherwise return entire expansion
        if (normalizedText.length > trigger.length + 5) {
          final regex = RegExp(RegExp.escape(snippet.trigger), caseSensitive: false);
          return text.replaceAll(regex, snippet.expansion);
        } else {
          return snippet.expansion;
        }
      }
    }

    return text;
  }
}
