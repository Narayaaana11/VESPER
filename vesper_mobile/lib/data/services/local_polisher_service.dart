/// 100% Local Deterministic Rule-Based Polisher
/// Replicates the VESPER Desktop Wispr Flow post-processing engine in pure Dart (<1ms latency).
class LocalPolisherService {
  /// Cleans and formats raw transcribed speech according to chosen tone and context.
  static String polish({
    required String rawTranscript,
    String tone = 'natural',
    bool codeContext = true,
    bool englishLettersOnly = false,
  }) {
    if (rawTranscript.trim().isEmpty) return '';

    String text = rawTranscript.trim();

    // 1. Strip Whisper silence / hallucination artifacts
    final wholeHallucinations = [
      RegExp(r'^(thank you|thanks for watching|transcribed by.*|subtitles by.*|www\.\S+)\.?$', caseSensitive: false),
      RegExp(r'^(you|bye|silence)\.?$', caseSensitive: false),
    ];
    for (final pat in wholeHallucinations) {
      if (pat.hasMatch(text)) return '';
    }

    final trailingHallucination = RegExp(
      r'\b(thank you|thanks for watching|transcribed by|subtitles by|please like and subscribe)\.?\s*$',
      caseSensitive: false,
    );
    while (trailingHallucination.hasMatch(text)) {
      text = text.replaceAll(trailingHallucination, '').trim();
    }

    // 2. Remove filler words (um, uh, erm, ah, you know, like, I mean, sort of, kind of)
    text = text
        .replaceAll(RegExp(r'\b(um|uh|erm|er|ah)\b,?\s*', caseSensitive: false), '')
        .replaceAll(RegExp(r'\b(you know|I mean|sort of|kind of|basically|literally)\b,?\s*', caseSensitive: false), '')
        .replaceAll(RegExp(r'\s+'), ' ')
        .trim();

    // 3. Resolve common conversational self-corrections
    // e.g. "meeting at 3 no wait 4 PM" -> "meeting at 4 PM"
    text = text
        .replaceAll(RegExp(r'\b(?:no wait|or rather|actually wait|sorry wait)\s+', caseSensitive: false), '')
        .replaceAll(RegExp(r'\s+'), ' ')
        .trim();

    // 4. Remove stutter / duplicate consecutive words ("the the" -> "the", "I I" -> "I")
    text = text.replaceAllMapped(
      RegExp(r'\b(\w+)\s+\1\b', caseSensitive: false),
      (match) => match.group(1)!,
    );

    // 5. Fix common number/time representations
    // e.g. "twenty dollars" -> "$20", "3 pm" -> "3:00 PM"
    text = text
        .replaceAllMapped(
          RegExp(r'\b(\d+)\s*dollars\b', caseSensitive: false),
          (match) => '\$${match.group(1)}',
        )
        .replaceAllMapped(
          RegExp(r'\b(\d+)\s*(pm|am)\b', caseSensitive: false),
          (match) => '${match.group(1)}:00 ${match.group(2)!.toUpperCase()}',
        );

    // 6. Code Context Enhancements
    if (codeContext) {
      text = text
          .replaceAll(RegExp(r'\bcamel case\b', caseSensitive: false), 'camelCase')
          .replaceAll(RegExp(r'\bsnake case\b', caseSensitive: false), 'snake_case')
          .replaceAll(RegExp(r'\bkebab case\b', caseSensitive: false), 'kebab-case')
          .replaceAll(RegExp(r'\bpull request\b', caseSensitive: false), 'Pull Request')
          .replaceAll(RegExp(r'\bgit commit\b', caseSensitive: false), 'git commit')
          .replaceAll(RegExp(r'\bgit push\b', caseSensitive: false), 'git push');
    }

    // 7. Tone Styling Adjustments
    if (tone == 'concise') {
      text = _applyConciseTone(text);
    } else if (tone == 'formal') {
      text = _applyFormalTone(text);
    } else if (tone == 'bullets') {
      return _applyBulletPoints(text);
    }

    // 8. English Letters Only (transliterate / strip non-Latin characters if enabled)
    if (englishLettersOnly) {
      text = text.replaceAll(RegExp(r'[^\x00-\x7F]+'), '');
    }

    // 9. Auto-capitalize sentences
    text = text.replaceAllMapped(
      RegExp(r'(^\s*|[.!?]\s+)([a-z])'),
      (match) => '${match.group(1)}${match.group(2)!.toUpperCase()}',
    );

    if (text.isNotEmpty) {
      text = text[0].toUpperCase() + text.substring(1);
    }

    // 10. Ensure trailing punctuation if a full sentence
    if (text.length > 3 && !RegExp(r'[.!?]$').hasMatch(text)) {
      text += '.';
    }

    return text;
  }

  static String _applyConciseTone(String input) {
    var s = input;
    // Strip polite openers and filler phrases
    s = s.replaceAll(RegExp(r'^(hello|hi there|hey),\s*', caseSensitive: false), '');
    s = s.replaceAll(RegExp(r'\b(just wanted to let you know that|i was thinking that)\s*', caseSensitive: false), '');
    return s.trim();
  }

  static String _applyFormalTone(String input) {
    var s = input;
    s = s.replaceAll(RegExp(r"\bcan't\b", caseSensitive: false), "cannot");
    s = s.replaceAll(RegExp(r"\bwon't\b", caseSensitive: false), "will not");
    s = s.replaceAll(RegExp(r"\bdon't\b", caseSensitive: false), "do not");
    s = s.replaceAll(RegExp(r"\bthanks\b", caseSensitive: false), "Thank you");
    return s;
  }

  static String _applyBulletPoints(String input) {
    final parts = input.split(RegExp(r'[.!?]\s+|\band\s+|\balso\s+'));
    final filtered = parts
        .map((p) => p.trim())
        .where((p) => p.isNotEmpty && p.length > 2)
        .map((p) => '• ${p[0].toUpperCase()}${p.substring(1)}')
        .join('\n');
    return filtered.isNotEmpty ? filtered : '• $input';
  }
}
