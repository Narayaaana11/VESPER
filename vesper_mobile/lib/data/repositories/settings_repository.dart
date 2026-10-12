import '../../domain/models/app_settings.dart';
import '../services/storage_service.dart';

class SettingsRepository {
  final StorageService _storage;

  SettingsRepository(this._storage);

  AppSettings get() => _storage.getSettings();

  Future<void> update(AppSettings settings) => _storage.saveSettings(settings);
}
