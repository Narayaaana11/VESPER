import 'package:flutter/material.dart';
import '../../../../data/repositories/vocabulary_repository.dart';
import '../../../../domain/models/custom_vocabulary.dart';

class DictionaryViewModel extends ChangeNotifier {
  final VocabularyRepository _repository;
  List<CustomVocabulary> terms = [];

  DictionaryViewModel(this._repository) {
    load();
  }

  void load() {
    terms = _repository.getAll();
    notifyListeners();
  }

  Future<void> addTerm({
    required String term,
    required String category,
    required List<String> phoneticAliases,
  }) async {
    final item = CustomVocabulary(
      id: 'voc-${DateTime.now().millisecondsSinceEpoch}',
      term: term.trim(),
      category: category,
      phoneticAliases: phoneticAliases,
      addedAt: DateTime.now(),
    );
    await _repository.save(item);
    load();
  }

  Future<void> removeTerm(String id) async {
    await _repository.remove(id);
    load();
  }
}
