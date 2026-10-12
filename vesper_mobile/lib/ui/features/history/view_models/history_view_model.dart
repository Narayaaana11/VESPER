import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';
import '../../../../data/repositories/dictation_repository.dart';
import '../../../../data/services/audio_chimes_service.dart';
import '../../../../data/services/haptic_service.dart';
import '../../../../domain/models/dictation_item.dart';

class HistoryViewModel extends ChangeNotifier {
  final DictationRepository _repository;
  List<DictationItem> items = [];
  String searchQuery = '';
  String? copiedId;

  HistoryViewModel(this._repository) {
    load();
  }

  void load() {
    items = _repository.getAll();
    notifyListeners();
  }

  List<DictationItem> get filteredItems {
    if (searchQuery.trim().isEmpty) return items;
    final q = searchQuery.toLowerCase();
    return items.where((item) {
      return item.polishedText.toLowerCase().contains(q) ||
          item.rawTranscript.toLowerCase().contains(q);
    }).toList();
  }

  void setSearchQuery(String query) {
    searchQuery = query;
    notifyListeners();
  }

  Future<void> copyItem(DictationItem item) async {
    await Clipboard.setData(ClipboardData(text: item.polishedText));
    await HapticService.success();
    await AudioChimesService.playSuccess();
    copiedId = item.id;
    notifyListeners();

    Future.delayed(const Duration(seconds: 2), () {
      if (copiedId == item.id) {
        copiedId = null;
        notifyListeners();
      }
    });
  }

  Future<void> shareItem(DictationItem item) async {
    await Share.share(item.polishedText, subject: 'VESPER Flow Dictation');
  }

  Future<void> deleteItem(String id) async {
    await _repository.remove(id);
    load();
  }

  Future<void> clearAll() async {
    await _repository.clearAll();
    load();
  }
}
