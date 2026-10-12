import 'package:flutter/material.dart';
import '../../../../data/repositories/settings_repository.dart';
import '../../../../domain/models/app_settings.dart';

class SettingsViewModel extends ChangeNotifier {
  final SettingsRepository _repository;
  AppSettings settings = const AppSettings();

  SettingsViewModel(this._repository) {
    load();
  }

  void load() {
    settings = _repository.get();
    notifyListeners();
  }

  Future<void> updateSettings(AppSettings newSettings) async {
    settings = newSettings;
    await _repository.update(newSettings);
    notifyListeners();
  }

  Future<void> toggleOfflineMode(bool value) async {
    await updateSettings(settings.copyWith(isOfflineMode: value));
  }

  Future<void> setApiKey(String key) async {
    await updateSettings(settings.copyWith(groqApiKey: key.trim()));
  }

  Future<void> setLanguage(String lang) async {
    await updateSettings(settings.copyWith(speechLanguage: lang));
  }

  Future<void> toggleSound(bool val) async {
    await updateSettings(settings.copyWith(soundFeedback: val));
  }

  Future<void> toggleHaptics(bool val) async {
    await updateSettings(settings.copyWith(hapticFeedback: val));
  }

  Future<void> toggleAutoCopy(bool val) async {
    await updateSettings(settings.copyWith(autoCopyToClipboard: val));
  }

  Future<void> toggleEnglishOnly(bool val) async {
    await updateSettings(settings.copyWith(englishLettersOnly: val));
  }

  Future<void> toggleCodeContext(bool val) async {
    await updateSettings(settings.copyWith(codeContextOptimization: val));
  }
}
