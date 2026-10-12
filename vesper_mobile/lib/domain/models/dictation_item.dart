/// Model representing a single recorded and polished dictation in VESPER Flow
class DictationItem {
  final String id;
  final DateTime timestamp;
  final String rawTranscript;
  final String polishedText;
  final int durationMs;
  final int wordCount;
  final String mode; // 'direct' or 'smart_assistant'
  final String targetApp;
  final String tone;

  const DictationItem({
    required this.id,
    required this.timestamp,
    required this.rawTranscript,
    required this.polishedText,
    required this.durationMs,
    required this.wordCount,
    this.mode = 'direct',
    this.targetApp = 'Android Input',
    this.tone = 'natural',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'timestamp': timestamp.millisecondsSinceEpoch,
        'rawTranscript': rawTranscript,
        'polishedText': polishedText,
        'durationMs': durationMs,
        'wordCount': wordCount,
        'mode': mode,
        'targetApp': targetApp,
        'tone': tone,
      };

  factory DictationItem.fromJson(Map<String, dynamic> json) => DictationItem(
        id: json['id'] as String,
        timestamp: DateTime.fromMillisecondsSinceEpoch(json['timestamp'] as int),
        rawTranscript: json['rawTranscript'] as String? ?? '',
        polishedText: json['polishedText'] as String? ?? '',
        durationMs: json['durationMs'] as int? ?? 0,
        wordCount: json['wordCount'] as int? ?? 0,
        mode: json['mode'] as String? ?? 'direct',
        targetApp: json['targetApp'] as String? ?? 'Android Input',
        tone: json['tone'] as String? ?? 'natural',
      );

  DictationItem copyWith({
    String? id,
    DateTime? timestamp,
    String? rawTranscript,
    String? polishedText,
    int? durationMs,
    int? wordCount,
    String? mode,
    String? targetApp,
    String? tone,
  }) {
    return DictationItem(
      id: id ?? this.id,
      timestamp: timestamp ?? this.timestamp,
      rawTranscript: rawTranscript ?? this.rawTranscript,
      polishedText: polishedText ?? this.polishedText,
      durationMs: durationMs ?? this.durationMs,
      wordCount: wordCount ?? this.wordCount,
      mode: mode ?? this.mode,
      targetApp: targetApp ?? this.targetApp,
      tone: tone ?? this.tone,
    );
  }
}
