import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';
import '../../../../data/repositories/dictation_repository.dart';
import '../../../../data/repositories/settings_repository.dart';
import '../../../../data/repositories/snippets_repository.dart';
import '../../../../data/repositories/vocabulary_repository.dart';
import '../../../../data/services/audio_chimes_service.dart';
import '../../../../data/services/haptic_service.dart';
import '../../../../data/services/local_polisher_service.dart';
import '../../../../data/services/snippet_service.dart';
import '../../../../data/services/speech_recognition_service.dart';
import '../../../../data/services/vocabulary_service.dart';
import '../../../../domain/models/dictation_item.dart';
import '../../../core/widgets/status_pill.dart';

class DictationViewModel extends ChangeNotifier {
  final SpeechRecognitionService _speechService;
  final DictationRepository _dictationRepo;
  final SnippetsRepository _snippetsRepo;
  final VocabularyRepository _vocabularyRepo;
  final SettingsRepository _settingsRepo;

  DictationState state = DictationState.idle;
  String rawTranscript = '';
  String polishedText = '';
  double soundLevel = 0.0;
  DateTime? _startTime;
  int durationMs = 0;
  String currentTone = 'natural';
  StreamSubscription<double>? _soundSub;

  DictationViewModel({
    required SpeechRecognitionService speechService,
    required DictationRepository dictationRepo,
    required SnippetsRepository snippetsRepo,
    required VocabularyRepository vocabularyRepo,
    required SettingsRepository settingsRepo,
  })  : _speechService = speechService,
        _dictationRepo = dictationRepo,
        _snippetsRepo = snippetsRepo,
        _vocabularyRepo = vocabularyRepo,
        _settingsRepo = settingsRepo {
    currentTone = _settingsRepo.get().defaultTone;
    _soundSub = _speechService.soundLevelStream.listen((level) {
      soundLevel = level;
      notifyListeners();
    });
  }

  bool get isRecording => state == DictationState.listening;

  /// Starts voice recording with haptic and audio feedback
  Future<void> startRecording() async {
    if (state == DictationState.listening) return;

    final settings = _settingsRepo.get();
    AudioChimesService.soundEnabled = settings.soundFeedback;
    HapticService.hapticsEnabled = settings.hapticFeedback;

    await HapticService.recordStart();
    await AudioChimesService.playStart();

    rawTranscript = '';
    polishedText = '';
    _startTime = DateTime.now();
    state = DictationState.listening;
    notifyListeners();

    try {
      await _speechService.startListening(
        language: settings.speechLanguage,
        onResult: (text, isFinal) {
          rawTranscript = text;
          if (isFinal) {
            _processAndFinish();
          } else {
            notifyListeners();
          }
        },
      );
    } catch (e) {
      print('Speech error: $e');
      state = DictationState.idle;
      notifyListeners();
    }
  }

  /// Stops voice recording, runs the local polisher and expansions, and logs to history
  Future<void> stopRecording() async {
    if (state != DictationState.listening) return;

    await HapticService.recordStop();
    await AudioChimesService.playStop();

    state = DictationState.polishing;
    notifyListeners();

    await _speechService.stopListening();
    await _processAndFinish();
  }

  Future<void> _processAndFinish() async {
    if (rawTranscript.trim().isEmpty) {
      state = DictationState.idle;
      notifyListeners();
      return;
    }

    state = DictationState.polishing;
    notifyListeners();

    final settings = _settingsRepo.get();
    final snippets = _snippetsRepo.getAll();
    final vocabulary = _vocabularyRepo.getAll();

    // 1. Calculate duration
    durationMs = _startTime != null
        ? DateTime.now().difference(_startTime!).inMilliseconds
        : 1500;

    // 2. Apply Custom Vocabulary replacements
    var text = VocabularyService.applyVocabulary(rawTranscript, vocabulary);

    // 3. Apply Local Deterministic Rules Polisher
    text = LocalPolisherService.polish(
      rawTranscript: text,
      tone: currentTone,
      codeContext: settings.codeContextOptimization,
      englishLettersOnly: settings.englishLettersOnly,
    );

    // 4. Expand Voice Snippets
    text = SnippetService.expandSnippets(text, snippets);

    polishedText = text;

    // 5. Calculate word count
    final wordCount = polishedText.trim().split(RegExp(r'\s+')).length;

    // 6. Save to History
    final item = DictationItem(
      id: 'dict-${DateTime.now().millisecondsSinceEpoch}',
      timestamp: DateTime.now(),
      rawTranscript: rawTranscript,
      polishedText: polishedText,
      durationMs: durationMs,
      wordCount: wordCount,
      tone: currentTone,
      targetApp: 'VESPER Flow Android',
    );
    await _dictationRepo.add(item);

    // 7. Auto-copy to clipboard if enabled
    if (settings.autoCopyToClipboard) {
      await copyToClipboard();
    } else {
      state = DictationState.idle;
      notifyListeners();
    }
  }

  /// Copies polished text to the Android system clipboard
  Future<void> copyToClipboard() async {
    if (polishedText.trim().isEmpty) return;
    await Clipboard.setData(ClipboardData(text: polishedText));
    await HapticService.success();
    await AudioChimesService.playSuccess();
    state = DictationState.copied;
    notifyListeners();

    Future.delayed(const Duration(seconds: 2), () {
      if (state == DictationState.copied) {
        state = DictationState.idle;
        notifyListeners();
      }
    });
  }

  /// Shares polished text to external Android apps (WhatsApp, Slack, Gmail, Notes)
  Future<void> shareText() async {
    if (polishedText.trim().isEmpty) return;
    await Share.share(polishedText, subject: 'Dictation from VESPER Flow');
  }

  /// Re-polishes current text with a different tone
  void changeTone(String newTone) {
    currentTone = newTone;
    if (rawTranscript.isNotEmpty) {
      final settings = _settingsRepo.get();
      final snippets = _snippetsRepo.getAll();
      final vocabulary = _vocabularyRepo.getAll();

      var text = VocabularyService.applyVocabulary(rawTranscript, vocabulary);
      text = LocalPolisherService.polish(
        rawTranscript: text,
        tone: currentTone,
        codeContext: settings.codeContextOptimization,
        englishLettersOnly: settings.englishLettersOnly,
      );
      text = SnippetService.expandSnippets(text, snippets);
      polishedText = text;
      notifyListeners();
    }
  }

  void clear() {
    rawTranscript = '';
    polishedText = '';
    state = DictationState.idle;
    notifyListeners();
  }

  @override
  void dispose() {
    _soundSub?.cancel();
    super.dispose();
  }
}
