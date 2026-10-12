/// Application configurations for VESPER Mobile
class AppSettings {
  final bool isOfflineMode; // true = 100% On-Device local STT, false = Groq Cloud
  final String groqApiKey;
  final String speechLanguage; // 'auto', 'en', 'es', 'fr', 'de', 'hi', etc.
  final String defaultTone; // 'natural', 'concise', 'formal', 'bullets'
  final bool soundFeedback; // Audio chimes
  final bool hapticFeedback; // Vibration on tap & state change
  final bool autoCopyToClipboard; // Auto-copy on transcription finish
  final bool floatingCapsuleEnabled; // System overlay pill
  final bool englishLettersOnly; // Clean non-Latin symbols
  final bool codeContextOptimization; // camelCase / snake_case detection

  const AppSettings({
    this.isOfflineMode = true,
    this.groqApiKey = '',
    this.speechLanguage = 'auto',
    this.defaultTone = 'natural',
    this.soundFeedback = true,
    this.hapticFeedback = true,
    this.autoCopyToClipboard = true,
    this.floatingCapsuleEnabled = false,
    this.englishLettersOnly = false,
    this.codeContextOptimization = true,
  });

  Map<String, dynamic> toJson() => {
        'isOfflineMode': isOfflineMode,
        'groqApiKey': groqApiKey,
        'speechLanguage': speechLanguage,
        'defaultTone': defaultTone,
        'soundFeedback': soundFeedback,
        'hapticFeedback': hapticFeedback,
        'autoCopyToClipboard': autoCopyToClipboard,
        'floatingCapsuleEnabled': floatingCapsuleEnabled,
        'englishLettersOnly': englishLettersOnly,
        'codeContextOptimization': codeContextOptimization,
      };

  factory AppSettings.fromJson(Map<String, dynamic> json) => AppSettings(
        isOfflineMode: json['isOfflineMode'] as bool? ?? true,
        groqApiKey: json['groqApiKey'] as String? ?? '',
        speechLanguage: json['speechLanguage'] as String? ?? 'auto',
        defaultTone: json['defaultTone'] as String? ?? 'natural',
        soundFeedback: json['soundFeedback'] as bool? ?? true,
        hapticFeedback: json['hapticFeedback'] as bool? ?? true,
        autoCopyToClipboard: json['autoCopyToClipboard'] as bool? ?? true,
        floatingCapsuleEnabled: json['floatingCapsuleEnabled'] as bool? ?? false,
        englishLettersOnly: json['englishLettersOnly'] as bool? ?? false,
        codeContextOptimization: json['codeContextOptimization'] as bool? ?? true,
      );

  AppSettings copyWith({
    bool? isOfflineMode,
    String? groqApiKey,
    String? speechLanguage,
    String? defaultTone,
    bool? soundFeedback,
    bool? hapticFeedback,
    bool? autoCopyToClipboard,
    bool? floatingCapsuleEnabled,
    bool? englishLettersOnly,
    bool? codeContextOptimization,
  }) {
    return AppSettings(
      isOfflineMode: isOfflineMode ?? this.isOfflineMode,
      groqApiKey: groqApiKey ?? this.groqApiKey,
      speechLanguage: speechLanguage ?? this.speechLanguage,
      defaultTone: defaultTone ?? this.defaultTone,
      soundFeedback: soundFeedback ?? this.soundFeedback,
      hapticFeedback: hapticFeedback ?? this.hapticFeedback,
      autoCopyToClipboard: autoCopyToClipboard ?? this.autoCopyToClipboard,
      floatingCapsuleEnabled: floatingCapsuleEnabled ?? this.floatingCapsuleEnabled,
      englishLettersOnly: englishLettersOnly ?? this.englishLettersOnly,
      codeContextOptimization: codeContextOptimization ?? this.codeContextOptimization,
    );
  }
}
