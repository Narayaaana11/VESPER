import '../../domain/models/custom_vocabulary.dart';

/// Replaces phonetically misheard technical jargon with exact custom domain terms
class VocabularyService {
  /// Replaces phonetic approximations and known aliases with the proper term.
  static String applyVocabulary(String text, List<CustomVocabulary> vocabulary) {
    if (text.trim().isEmpty || vocabulary.isEmpty) return text;

    var result = text;

    for (final item in vocabulary) {
      // 1. Direct case-insensitive match for the term itself
      final termPattern = RegExp(r'\b' + RegExp.escape(item.term) + r'\b', caseSensitive: false);
      result = result.replaceAll(termPattern, item.term);

      // 2. Replace all phonetic aliases
      for (final alias in item.phoneticAliases) {
        if (alias.trim().isNotEmpty) {
          final aliasPattern = RegExp(r'\b' + RegExp.escape(alias.trim()) + r'\b', caseSensitive: false);
          result = result.replaceAll(aliasPattern, item.term);
        }
      }
    }

    return result;
  }
}
