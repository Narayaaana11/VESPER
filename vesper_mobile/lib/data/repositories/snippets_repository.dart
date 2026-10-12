import '../../domain/models/voice_snippet.dart';
import '../services/storage_service.dart';

class SnippetsRepository {
  final StorageService _storage;

  SnippetsRepository(this._storage);

  List<VoiceSnippet> getAll() => _storage.getSnippets();

  Future<void> save(VoiceSnippet snippet) => _storage.saveSnippet(snippet);

  Future<void> remove(String id) => _storage.deleteSnippet(id);
}
