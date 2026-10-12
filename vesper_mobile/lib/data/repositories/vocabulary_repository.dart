import '../../domain/models/custom_vocabulary.dart';
import '../services/storage_service.dart';

class VocabularyRepository {
  final StorageService _storage;

  VocabularyRepository(this._storage);

  List<CustomVocabulary> getAll() => _storage.getVocabulary();

  Future<void> save(CustomVocabulary item) => _storage.saveVocabulary(item);

  Future<void> remove(String id) => _storage.deleteVocabulary(id);
}
