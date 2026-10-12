import 'package:flutter_test/flutter_test.dart';
import 'package:vesper_mobile/data/services/vocabulary_service.dart';
import 'package:vesper_mobile/domain/models/custom_vocabulary.dart';

void main() {
  group('VocabularyService - Custom Domain Jargon', () {
    final vocabulary = [
      CustomVocabulary(
        id: 'voc-1',
        term: 'VESPER',
        phoneticAliases: ['kevra', 'kewra'],
        addedAt: DateTime.now(),
      ),
      CustomVocabulary(
        id: 'voc-2',
        term: 'Groq',
        phoneticAliases: ['grok'],
        addedAt: DateTime.now(),
      ),
    ];

    test('replaces phonetic alias with proper capitalized term', () {
      final res = VocabularyService.applyVocabulary(
        'I am developing with kevra platform',
        vocabulary,
      );
      expect(res, equals('I am developing with VESPER platform'));
    });

    test('replaces alias grok with Groq', () {
      final res = VocabularyService.applyVocabulary(
        'Running on grok cloud inference',
        vocabulary,
      );
      expect(res, equals('Running on Groq cloud inference'));
    });

    test('replaces exact term casing', () {
      final res = VocabularyService.applyVocabulary(
        'Testing vesper mobile',
        vocabulary,
      );
      expect(res, equals('Testing VESPER mobile'));
    });
  });
}
