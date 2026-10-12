import 'package:flutter/material.dart';
import '../../../../data/repositories/settings_repository.dart';
import '../../../../data/services/local_polisher_service.dart';
import '../../../../domain/models/style_profile.dart';

class StyleViewModel extends ChangeNotifier {
  final SettingsRepository _settingsRepo;
  String selectedTone = 'natural';
  final List<StyleProfile> profiles = StyleProfile.defaultProfiles;

  StyleViewModel(this._settingsRepo) {
    selectedTone = _settingsRepo.get().defaultTone;
  }

  void selectTone(String tone) {
    selectedTone = tone;
    final currentSettings = _settingsRepo.get();
    _settingsRepo.update(currentSettings.copyWith(defaultTone: tone));
    notifyListeners();
  }

  String getSampleOutput(String tone) {
    const rawSample = 'um hi there so i was thinking we should meet at 3 no wait 4 pm and discuss the twenty dollars budget';
    return LocalPolisherService.polish(rawTranscript: rawSample, tone: tone);
  }
}
