import '../../domain/models/dictation_item.dart';
import '../services/storage_service.dart';

class DictationRepository {
  final StorageService _storage;

  DictationRepository(this._storage);

  List<DictationItem> getAll() => _storage.getHistory();

  Future<void> add(DictationItem item) => _storage.saveHistoryItem(item);

  Future<void> remove(String id) => _storage.deleteHistoryItem(id);

  Future<void> clearAll() => _storage.clearHistory();
}
