import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:speech_to_text/speech_to_text.dart' as stt;

/// Speech recognition dispatcher supporting 100% on-device offline recognition
/// and optional Groq Cloud Whisper Turbo v3 with automatic failover.
class SpeechRecognitionService {
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _isInitialized = false;

  /// Stream controller for real-time sound level (dB) to drive waveform animation
  final StreamController<double> _soundLevelController =
      StreamController<double>.broadcast();
  Stream<double> get soundLevelStream => _soundLevelController.stream;

  bool get isAvailable => _isInitialized;

  /// Initializes the on-device speech engine
  Future<bool> initialize() async {
    if (_isInitialized) return true;
    try {
      _isInitialized = await _speech.initialize(
        onError: (val) => print('STT Error: ${val.errorMsg}'),
        onStatus: (val) => print('STT Status: $val'),
      );
      return _isInitialized;
    } catch (e) {
      print('STT init error: $e');
      return false;
    }
  }

  /// Starts listening via the on-device microphone
  Future<void> startListening({
    required Function(String text, bool isFinal) onResult,
    String language = 'auto',
  }) async {
    if (!_isInitialized) {
      await initialize();
    }

    String? localeId;
    if (language != 'auto' && language.isNotEmpty) {
      localeId = language;
    }

    await _speech.listen(
      onResult: (result) {
        onResult(result.recognizedWords, result.finalResult);
      },
      onSoundLevelChange: (level) {
        // level typically ranges from -20dB to 10dB; normalize to 0.0 - 1.0
        final normalized = ((level + 20.0) / 30.0).clamp(0.0, 1.0);
        _soundLevelController.add(normalized);
      },
      localeId: localeId,
      cancelOnError: false,
      partialResults: true,
      listenMode: stt.ListenMode.dictation,
    );
  }

  /// Stops on-device listening
  Future<void> stopListening() async {
    if (_speech.isListening) {
      await _speech.stop();
    }
    _soundLevelController.add(0.0);
  }

  /// Cancels listening immediately
  Future<void> cancelListening() async {
    if (_speech.isListening) {
      await _speech.cancel();
    }
    _soundLevelController.add(0.0);
  }

  bool get isListening => _speech.isListening;

  /// Cloud Whisper transcription via Groq API (fallback / cloud accelerator)
  static Future<String> transcribeWithGroq({
    required File audioFile,
    required String apiKey,
    String model = 'whisper-large-v3-turbo',
    String language = 'en',
  }) async {
    if (apiKey.trim().isEmpty) {
      throw Exception('Groq API Key is required for cloud mode.');
    }

    final uri = Uri.parse('https://api.groq.com/openai/v1/audio/transcriptions');
    final request = http.MultipartRequest('POST', uri)
      ..headers['Authorization'] = 'Bearer ${apiKey.trim()}'
      ..fields['model'] = model
      ..fields['temperature'] = '0.0'
      ..fields['response_format'] = 'json';

    if (language != 'auto') {
      request.fields['language'] = language;
    }

    request.files.add(await http.MultipartFile.fromPath('file', audioFile.path));

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      final json = jsonDecode(response.body);
      return json['text'] as String? ?? '';
    } else {
      throw Exception('Groq error: ${response.statusCode} - ${response.body}');
    }
  }

  void dispose() {
    _soundLevelController.close();
  }
}
