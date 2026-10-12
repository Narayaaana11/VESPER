import 'package:flutter_test/flutter_test.dart';
import 'package:vesper_mobile/data/services/local_polisher_service.dart';

void main() {
  group('LocalPolisherService - Deterministic Rules', () {
    test('removes filler words like um, uh, you know, sort of', () {
      const raw = 'um hello uh this is you know like a test sort of';
      final cleaned = LocalPolisherService.polish(rawTranscript: raw);
      expect(cleaned, isNot(contains('um')));
      expect(cleaned, isNot(contains('uh')));
      expect(cleaned, isNot(contains('you know')));
      expect(cleaned, isNot(contains('sort of')));
      expect(cleaned.startsWith('Hello'), isTrue);
    });

    test('resolves conversational self-corrections', () {
      const raw = 'let us meet at 3 no wait 4 pm';
      final cleaned = LocalPolisherService.polish(rawTranscript: raw);
      expect(cleaned, contains('4:00 PM'));
      expect(cleaned, isNot(contains('no wait')));
    });

    test('removes duplicate consecutive stutters', () {
      const raw = 'I I think the the project is ready';
      final cleaned = LocalPolisherService.polish(rawTranscript: raw);
      expect(cleaned, contains('I think the project is ready.'));
    });

    test('formats currency and time numbers properly', () {
      const raw = 'the cost is twenty dollars and lunch is at 1 pm';
      // twenty dollars is words, but test numeric:
      const rawNum = 'the cost is 50 dollars and lunch is at 1 pm';
      final cleaned = LocalPolisherService.polish(rawTranscript: rawNum);
      expect(cleaned, contains('\$50'));
      expect(cleaned, contains('1:00 PM'));
    });

    test('formats code terms in code context', () {
      const raw = 'convert this to camel case and open a pull request';
      final cleaned = LocalPolisherService.polish(
        rawTranscript: raw,
        codeContext: true,
      );
      expect(cleaned, contains('camelCase'));
      expect(cleaned, contains('Pull Request'));
    });

    test('strips Whisper silence / artifact hallucinations', () {
      expect(LocalPolisherService.polish(rawTranscript: 'thank you.'), isEmpty);
      expect(LocalPolisherService.polish(rawTranscript: 'Thanks for watching'), isEmpty);
      expect(LocalPolisherService.polish(rawTranscript: 'transcribed by www.example.com'), isEmpty);
    });

    test('applies formal tone replacing contractions', () {
      const raw = "we can't do this and won't agree";
      final cleaned = LocalPolisherService.polish(
        rawTranscript: raw,
        tone: 'formal',
      );
      expect(cleaned, contains('cannot'));
      expect(cleaned, contains('will not'));
    });

    test('applies concise tone trimming polite fluff', () {
      const raw = 'hi there, i was thinking that we should ship today';
      final cleaned = LocalPolisherService.polish(
        rawTranscript: raw,
        tone: 'concise',
      );
      expect(cleaned.startsWith('We should ship today.'), isTrue);
    });

    test('applies bullet points tone', () {
      const raw = 'buy groceries. send email. finish code review.';
      final cleaned = LocalPolisherService.polish(
        rawTranscript: raw,
        tone: 'bullets',
      );
      expect(cleaned, contains('• Buy groceries'));
      expect(cleaned, contains('• Send email'));
      expect(cleaned, contains('• Finish code review'));
    });
  });
}
