import 'package:flutter/material.dart';
import '../../../../data/repositories/snippets_repository.dart';
import '../../../../domain/models/voice_snippet.dart';

class SnippetsViewModel extends ChangeNotifier {
  final SnippetsRepository _repository;
  List<VoiceSnippet> snippets = [];
  String selectedCategory = 'All';

  SnippetsViewModel(this._repository) {
    load();
  }

  void load() {
    snippets = _repository.getAll();
    notifyListeners();
  }

  List<VoiceSnippet> get filteredSnippets {
    if (selectedCategory == 'All') return snippets;
    return snippets.where((s) => s.category == selectedCategory).toList();
  }

  void setCategory(String cat) {
    selectedCategory = cat;
    notifyListeners();
  }

  Future<void> addSnippet({
    required String trigger,
    required String expansion,
    required String category,
  }) async {
    final snippet = VoiceSnippet(
      id: 'snip-${DateTime.now().millisecondsSinceEpoch}',
      trigger: trigger.trim(),
      expansion: expansion.trim(),
      category: category,
      createdAt: DateTime.now(),
    );
    await _repository.save(snippet);
    load();
  }

  Future<void> removeSnippet(String id) async {
    await _repository.remove(id);
    load();
  }
}
