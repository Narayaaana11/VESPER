/// Polishing style profile (Natural, Concise, Professional, Bullet Points, Transliteration)
class StyleProfile {
  final String id;
  final String name;
  final String description;
  final String icon;
  final bool isDefault;

  const StyleProfile({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    this.isDefault = false,
  });

  static const List<StyleProfile> defaultProfiles = [
    StyleProfile(
      id: 'natural',
      name: 'Natural Dictation',
      description: 'Cleans filler words, fixes stutters, and formats punctuation cleanly.',
      icon: 'sparkles',
      isDefault: true,
    ),
    StyleProfile(
      id: 'concise',
      name: 'Concise & Direct',
      description: 'Trims fluff, gets straight to the core message without pleasantries.',
      icon: 'zap',
    ),
    StyleProfile(
      id: 'formal',
      name: 'Professional / Formal',
      description: 'Polished executive business vocabulary, complete structured grammar.',
      icon: 'briefcase',
    ),
    StyleProfile(
      id: 'bullets',
      name: 'Key Bullet Points',
      description: 'Summarizes spoke thoughts into crisp bullet points.',
      icon: 'list',
    ),
    StyleProfile(
      id: 'transliterate',
      name: 'English Letters Only',
      description: 'Preserves native terms phonetically using standard Latin characters.',
      icon: 'globe',
    ),
  ];

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'icon': icon,
        'isDefault': isDefault,
      };

  factory StyleProfile.fromJson(Map<String, dynamic> json) => StyleProfile(
        id: json['id'] as String,
        name: json['name'] as String,
        description: json['description'] as String,
        icon: json['icon'] as String? ?? 'sparkles',
        isDefault: json['isDefault'] as bool? ?? false,
      );
}
