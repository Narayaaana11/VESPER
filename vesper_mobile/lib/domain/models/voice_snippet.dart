/// Voice shortcut expansion snippet
class VoiceSnippet {
  final String id;
  final String trigger;
  final String expansion;
  final String category;
  final DateTime createdAt;

  const VoiceSnippet({
    required this.id,
    required this.trigger,
    required this.expansion,
    this.category = 'Productivity',
    required this.createdAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'trigger': trigger,
        'expansion': expansion,
        'category': category,
        'createdAt': createdAt.millisecondsSinceEpoch,
      };

  factory VoiceSnippet.fromJson(Map<String, dynamic> json) => VoiceSnippet(
        id: json['id'] as String,
        trigger: json['trigger'] as String,
        expansion: json['expansion'] as String,
        category: json['category'] as String? ?? 'Productivity',
        createdAt: DateTime.fromMillisecondsSinceEpoch(
            json['createdAt'] as int? ?? DateTime.now().millisecondsSinceEpoch),
      );

  VoiceSnippet copyWith({
    String? id,
    String? trigger,
    String? expansion,
    String? category,
    DateTime? createdAt,
  }) {
    return VoiceSnippet(
      id: id ?? this.id,
      trigger: trigger ?? this.trigger,
      expansion: expansion ?? this.expansion,
      category: category ?? this.category,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
