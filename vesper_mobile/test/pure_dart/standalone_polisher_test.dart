import '../../lib/data/services/local_polisher_service.dart';
import '../../lib/data/services/snippet_service.dart';
import '../../lib/data/services/vocabulary_service.dart';
import '../../lib/domain/models/custom_vocabulary.dart';
import '../../lib/domain/models/voice_snippet.dart';

void main() {
  print('=== Running VESPER Mobile Dart Logic Verification Suite ===\n');
  int passed = 0;
  int failed = 0;

  void test(String description, void Function() body) {
    try {
      body();
      print('  ✓ PASS: $description');
      passed++;
    } catch (e) {
      print('  ✗ FAIL: $description -> $e');
      failed++;
    }
  }

  void expect(dynamic actual, dynamic expected, [String? message]) {
    if (actual != expected) {
      throw Exception('Expected "$expected" but got "$actual". ${message ?? ""}');
    }
  }

  void expectContains(String actual, String substring) {
    if (!actual.contains(substring)) {
      throw Exception('Expected "$actual" to contain "$substring".');
    }
  }

  void expectNotContains(String actual, String substring) {
    if (actual.contains(substring)) {
      throw Exception('Expected "$actual" to NOT contain "$substring".');
    }
  }

  // --- 1. LocalPolisherService Tests ---
  print('[1] Testing LocalPolisherService (Deterministic Rules)');

  test('removes filler words like um, uh, you know, sort of', () {
    const raw = 'um hello uh this is you know like a test sort of';
    final cleaned = LocalPolisherService.polish(rawTranscript: raw);
    expectNotContains(cleaned, 'um');
    expectNotContains(cleaned, 'uh');
    expectNotContains(cleaned, 'you know');
    expectNotContains(cleaned, 'sort of');
    expect(cleaned.startsWith('Hello'), true);
  });

  test('resolves conversational self-corrections', () {
    const raw = 'let us meet at 3 no wait 4 pm';
    final cleaned = LocalPolisherService.polish(rawTranscript: raw);
    expectContains(cleaned, '4:00 PM');
    expectNotContains(cleaned, 'no wait');
  });

  test('removes duplicate consecutive stutters', () {
    const raw = 'I I think the the project is ready';
    final cleaned = LocalPolisherService.polish(rawTranscript: raw);
    expectContains(cleaned, 'I think the project is ready.');
  });

  test('formats currency and time numbers properly', () {
    const rawNum = 'the cost is 50 dollars and lunch is at 1 pm';
    final cleaned = LocalPolisherService.polish(rawTranscript: rawNum);
    expectContains(cleaned, '\$50');
    expectContains(cleaned, '1:00 PM');
  });

  test('formats code terms in code context', () {
    const raw = 'convert this to camel case and open a pull request';
    final cleaned = LocalPolisherService.polish(
      rawTranscript: raw,
      codeContext: true,
    );
    expectContains(cleaned, 'camelCase');
    expectContains(cleaned, 'Pull Request');
  });

  test('strips Whisper silence / artifact hallucinations', () {
    expect(LocalPolisherService.polish(rawTranscript: 'thank you.'), '');
    expect(LocalPolisherService.polish(rawTranscript: 'Thanks for watching'), '');
    expect(LocalPolisherService.polish(rawTranscript: 'transcribed by www.example.com'), '');
  });

  test('applies formal tone replacing contractions', () {
    const raw = "we can't do this and won't agree";
    final cleaned = LocalPolisherService.polish(
      rawTranscript: raw,
      tone: 'formal',
    );
    expectContains(cleaned, 'cannot');
    expectContains(cleaned, 'will not');
  });

  test('applies concise tone trimming polite fluff', () {
    const raw = 'hi there, i was thinking that we should ship today';
    final cleaned = LocalPolisherService.polish(
      rawTranscript: raw,
      tone: 'concise',
    );
    expect(cleaned.startsWith('We should ship today.'), true);
  });

  test('applies bullet points tone', () {
    const raw = 'buy groceries. send email. finish code review.';
    final cleaned = LocalPolisherService.polish(
      rawTranscript: raw,
      tone: 'bullets',
    );
    expectContains(cleaned, '• Buy groceries');
    expectContains(cleaned, '• Send email');
    expectContains(cleaned, '• Finish code review');
  });

  // --- 2. SnippetService Tests ---
  print('\n[2] Testing SnippetService (Voice Shortcuts)');

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
    expect(res, 'https://cal.com/vesper/sync');
  });

  test('expands trigger with trailing period', () {
    final res = SnippetService.expandSnippets('my calendar link.', snippets);
    expect(res, 'https://cal.com/vesper/sync');
  });

  test('replaces embedded trigger within sentence', () {
    final res = SnippetService.expandSnippets(
      'Please check my calendar link for availability',
      snippets,
    );
    expectContains(res, 'https://cal.com/vesper/sync');
  });

  // --- 3. VocabularyService Tests ---
  print('\n[3] Testing VocabularyService (Custom Domain Jargon)');

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
    expect(res, 'I am developing with VESPER platform');
  });

  test('replaces alias grok with Groq', () {
    final res = VocabularyService.applyVocabulary(
      'Running on grok cloud inference',
      vocabulary,
    );
    expect(res, 'Running on Groq cloud inference');
  });

  // --- Summary ---
  print('\n----------------------------------------');
  print('Result: $passed passed, $failed failed.');
  print('----------------------------------------\n');

  if (failed > 0) {
    throw Exception('Some tests failed!');
  }
}
