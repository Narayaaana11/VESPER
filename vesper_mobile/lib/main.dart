import 'package:flutter/material.dart';
import 'data/repositories/dictation_repository.dart';
import 'data/repositories/settings_repository.dart';
import 'data/repositories/snippets_repository.dart';
import 'data/repositories/vocabulary_repository.dart';
import 'data/services/speech_recognition_service.dart';
import 'data/services/storage_service.dart';
import 'ui/core/theme/app_theme.dart';
import 'ui/core/widgets/app_nav_bar.dart';
import 'ui/features/assistant/views/ambient_assistant_screen.dart';
import 'ui/features/dictation/view_models/dictation_view_model.dart';
import 'ui/features/dictation/views/dictation_screen.dart';
import 'ui/features/dictionary/view_models/dictionary_view_model.dart';
import 'ui/features/dictionary/views/dictionary_screen.dart';
import 'ui/features/history/view_models/history_view_model.dart';
import 'ui/features/history/views/history_screen.dart';
import 'ui/features/settings/view_models/settings_view_model.dart';
import 'ui/features/settings/views/settings_screen.dart';
import 'ui/features/snippets/view_models/snippets_view_model.dart';
import 'ui/features/snippets/views/snippets_screen.dart';
import 'ui/features/style/view_models/style_view_model.dart';
import 'ui/features/style/views/style_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Local Storage Service
  final storageService = StorageService();
  await storageService.init();

  // Initialize Speech Recognition Service
  final speechService = SpeechRecognitionService();
  await speechService.initialize();

  // Instantiate Repositories
  final dictationRepo = DictationRepository(storageService);
  final snippetsRepo = SnippetsRepository(storageService);
  final vocabularyRepo = VocabularyRepository(storageService);
  final settingsRepo = SettingsRepository(storageService);

  runApp(VesperMobileApp(
    storageService: storageService,
    speechService: speechService,
    dictationRepo: dictationRepo,
    snippetsRepo: snippetsRepo,
    vocabularyRepo: vocabularyRepo,
    settingsRepo: settingsRepo,
  ));
}

class VesperMobileApp extends StatelessWidget {
  final StorageService storageService;
  final SpeechRecognitionService speechService;
  final DictationRepository dictationRepo;
  final SnippetsRepository snippetsRepo;
  final VocabularyRepository vocabularyRepo;
  final SettingsRepository settingsRepo;

  const VesperMobileApp({
    super.key,
    required this.storageService,
    required this.speechService,
    required this.dictationRepo,
    required this.snippetsRepo,
    required this.vocabularyRepo,
    required this.settingsRepo,
  });

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VESPER Flow',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: RootNavigationContainer(
        speechService: speechService,
        dictationRepo: dictationRepo,
        snippetsRepo: snippetsRepo,
        vocabularyRepo: vocabularyRepo,
        settingsRepo: settingsRepo,
      ),
    );
  }
}

class RootNavigationContainer extends StatefulWidget {
  final SpeechRecognitionService speechService;
  final DictationRepository dictationRepo;
  final SnippetsRepository snippetsRepo;
  final VocabularyRepository vocabularyRepo;
  final SettingsRepository settingsRepo;

  const RootNavigationContainer({
    super.key,
    required this.speechService,
    required this.dictationRepo,
    required this.snippetsRepo,
    required this.vocabularyRepo,
    required this.settingsRepo,
  });

  @override
  State<RootNavigationContainer> createState() => _RootNavigationContainerState();
}

class _RootNavigationContainerState extends State<RootNavigationContainer> {
  int _currentIndex = 0;

  late final DictationViewModel _dictationVM;
  late final HistoryViewModel _historyVM;
  late final SnippetsViewModel _snippetsVM;
  late final DictionaryViewModel _dictionaryVM;
  late final StyleViewModel _styleVM;
  late final SettingsViewModel _settingsVM;

  @override
  void initState() {
    super.initState();
    _dictationVM = DictationViewModel(
      speechService: widget.speechService,
      dictationRepo: widget.dictationRepo,
      snippetsRepo: widget.snippetsRepo,
      vocabularyRepo: widget.vocabularyRepo,
      settingsRepo: widget.settingsRepo,
    );
    _historyVM = HistoryViewModel(widget.dictationRepo);
    _snippetsVM = SnippetsViewModel(widget.snippetsRepo);
    _dictionaryVM = DictionaryViewModel(widget.vocabularyRepo);
    _styleVM = StyleViewModel(widget.settingsRepo);
    _settingsVM = SettingsViewModel(widget.settingsRepo);
  }

  @override
  void dispose() {
    _dictationVM.dispose();
    _historyVM.dispose();
    _snippetsVM.dispose();
    _dictionaryVM.dispose();
    _styleVM.dispose();
    _settingsVM.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      DictationScreen(viewModel: _dictationVM),
      HistoryScreen(viewModel: _historyVM),
      SnippetsScreen(viewModel: _snippetsVM),
      DictionaryScreen(viewModel: _dictionaryVM),
      StyleScreen(viewModel: _styleVM),
      AmbientAssistantScreen(dictationRepo: widget.dictationRepo),
      SettingsScreen(viewModel: _settingsVM),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: AppNavBar(
        currentIndex: _currentIndex,
        onTabSelected: (index) {
          setState(() {
            _currentIndex = index;
            if (index == 1) _historyVM.load();
            if (index == 2) _snippetsVM.load();
            if (index == 3) _dictionaryVM.load();
            if (index == 6) _settingsVM.load();
          });
        },
      ),
    );
  }
}
