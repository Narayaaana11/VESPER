import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../domain/models/app_settings.dart';
import '../../domain/models/custom_vocabulary.dart';
import '../../domain/models/dictation_item.dart';
import '../../domain/models/voice_snippet.dart';

/// Local persistence service using SharedPreferences for instant zero-cloud storage
class StorageService {
  static const String _keyHistory = 'vesper_mobile_history';
  static const String _keySnippets = 'vesper_mobile_snippets';
  static const String _keyVocabulary = 'vesper_mobile_vocabulary';
  static const String _keySettings = 'vesper_mobile_settings';

  late SharedPreferences _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // --- Dictation History ---

  List<DictationItem> getHistory() {
    final raw = _prefs.getString(_keyHistory);
    if (raw == null || raw.isEmpty) return [];
    try {
      final list = jsonDecode(raw) as List<dynamic>;
      return list.map((e) => DictationItem.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveHistoryItem(DictationItem item) async {
    final history = getHistory();
    history.insert(0, item); // latest first
    final encoded = jsonEncode(history.map((e) => e.toJson()).toList());
    await _prefs.setString(_keyHistory, encoded);
  }

  Future<void> deleteHistoryItem(String id) async {
    final history = getHistory().where((e) => e.id != id).toList();
    final encoded = jsonEncode(history.map((e) => e.toJson()).toList());
    await _prefs.setString(_keyHistory, encoded);
  }

  Future<void> clearHistory() async {
    await _prefs.remove(_keyHistory);
  }

  // --- Voice Snippets ---

  List<VoiceSnippet> getSnippets() {
    final raw = _prefs.getString(_keySnippets);
    if (raw == null || raw.isEmpty) {
      return _seedSnippets();
    }
    try {
      final list = jsonDecode(raw) as List<dynamic>;
      return list.map((e) => VoiceSnippet.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return _seedSnippets();
    }
  }

  Future<void> saveSnippet(VoiceSnippet snippet) async {
    final snippets = getSnippets();
    final index = snippets.indexWhere((e) => e.id == snippet.id);
    if (index >= 0) {
      snippets[index] = snippet;
    } else {
      snippets.insert(0, snippet);
    }
    final encoded = jsonEncode(snippets.map((e) => e.toJson()).toList());
    await _prefs.setString(_keySnippets, encoded);
  }

  Future<void> deleteSnippet(String id) async {
    final snippets = getSnippets().where((e) => e.id != id).toList();
    final encoded = jsonEncode(snippets.map((e) => e.toJson()).toList());
    await _prefs.setString(_keySnippets, encoded);
  }

  List<VoiceSnippet> _seedSnippets() {
    return [
      VoiceSnippet(
        id: 'snip-1',
        trigger: 'my calendar link',
        expansion: 'Feel free to pick any time that works best for you on my calendar: https://cal.com/vesper/sync',
        category: 'Productivity',
        createdAt: DateTime.now().subtract(const Duration(days: 3)),
      ),
      VoiceSnippet(
        id: 'snip-2',
        trigger: 'standard email signoff',
        expansion: 'Best regards,\nNarayan\nAI Systems & Mobile Engineering Lead',
        category: 'Communication',
        createdAt: DateTime.now().subtract(const Duration(days: 5)),
      ),
      VoiceSnippet(
        id: 'snip-3',
        trigger: 'review checklist',
        expansion: '- [ ] Automated tests passing\n- [ ] UI visual inspection across DPI\n- [ ] Error boundary & network fallbacks verified',
        category: 'Development',
        createdAt: DateTime.now().subtract(const Duration(days: 7)),
      ),
      VoiceSnippet(
        id: 'snip-4',
        trigger: 'bug report template',
        expansion: '**Summary:** \n**Steps to Reproduce:** \n1. \n2. \n**Expected:** \n**Actual:** ',
        category: 'Development',
        createdAt: DateTime.now().subtract(const Duration(days: 10)),
      ),
    ];
  }

  // --- Custom Vocabulary ---

  List<CustomVocabulary> getVocabulary() {
    final raw = _prefs.getString(_keyVocabulary);
    if (raw == null || raw.isEmpty) {
      return _seedVocabulary();
    }
    try {
      final list = jsonDecode(raw) as List<dynamic>;
      return list.map((e) => CustomVocabulary.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return _seedVocabulary();
    }
  }

  Future<void> saveVocabulary(CustomVocabulary item) async {
    final vocab = getVocabulary();
    final index = vocab.indexWhere((e) => e.id == item.id);
    if (index >= 0) {
      vocab[index] = item;
    } else {
      vocab.insert(0, item);
    }
    final encoded = jsonEncode(vocab.map((e) => e.toJson()).toList());
    await _prefs.setString(_keyVocabulary, encoded);
  }

  Future<void> deleteVocabulary(String id) async {
    final vocab = getVocabulary().where((e) => e.id != id).toList();
    final encoded = jsonEncode(vocab.map((e) => e.toJson()).toList());
    await _prefs.setString(_keyVocabulary, encoded);
  }

  List<CustomVocabulary> _seedVocabulary() {
    return [
      CustomVocabulary(
        id: 'voc-1',
        term: 'VESPER',
        category: 'Product',
        phoneticAliases: ['kevra', 'kewra', 'kebra'],
        addedAt: DateTime.now(),
      ),
      CustomVocabulary(
        id: 'voc-2',
        term: 'Groq',
        category: 'AI',
        phoneticAliases: ['grok', 'grock'],
        addedAt: DateTime.now(),
      ),
      CustomVocabulary(
        id: 'voc-3',
        term: 'Whisper-large-v3',
        category: 'AI',
        phoneticAliases: ['whisper large v3', 'whisper v3'],
        addedAt: DateTime.now(),
      ),
      CustomVocabulary(
        id: 'voc-4',
        term: 'Flutter',
        category: 'Dev',
        phoneticAliases: ['fluter'],
        addedAt: DateTime.now(),
      ),
    ];
  }

  // --- App Settings ---

  AppSettings getSettings() {
    final raw = _prefs.getString(_keySettings);
    if (raw == null || raw.isEmpty) {
      return const AppSettings();
    }
    try {
      return AppSettings.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      return const AppSettings();
    }
  }

  Future<void> saveSettings(AppSettings settings) async {
    final encoded = jsonEncode(settings.toJson());
    await _prefs.setString(_keySettings, encoded);
  }
}
