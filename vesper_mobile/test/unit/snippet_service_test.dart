import 'package:flutter_test/flutter_test.dart';
import 'package:vesper_mobile/data/services/snippet_service.dart';
import 'package:vesper_mobile/domain/models/voice_snippet.dart';

void main() {
  group('SnippetService - Voice Shortcuts', () {
    final snippets = [
      VoiceSnippet(
        id: 'snip-1',
        trigger: 'my calendar link',
        expansion: 'https://cal.com/vesper/sync',
        createdAt: DateTime.now(),
      ),
      VoiceSnippet(
        id: 'snip-2',
        trigger: 'standard email signoff',
        expansion: 'Best regards,\nNarayan',
        createdAt: DateTime.now(),
      ),
    ];

    test('expands full trigger to expansion text', () {
      final res = SnippetService.expandSnippets('my calendar link', snippets);
      expect(res, equals('https://cal.com/vesper/sync'));
    });

    test('expands trigger with punctuation', () {
      final res = SnippetService.expandSnippets('my calendar link.', snippets);
      expect(res, equals('https://cal.com/vesper/sync'));
    });

    test('replaces embedded trigger within larger sentence', () {
      final res = SnippetService.expandSnippets(
        'Please check my calendar link for availability',
        snippets,
      );
      expect(res, contains('https://cal.com/vesper/sync'));
      expect(res, contains('Please check'));
    });

    test('leaves regular text unmodified', () {
      const regular = 'Just normal text without any snippets';
      final res = SnippetService.expandSnippets(regular, snippets);
      expect(res, equals(regular));
    });
  });
}
