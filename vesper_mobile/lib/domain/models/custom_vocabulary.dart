/// Custom vocabulary entry to teach speech recognition technical jargon & terms
class CustomVocabulary {
  final String id;
  final String term;
  final String category;
  final List<String> phoneticAliases;
  final DateTime addedAt;

  const CustomVocabulary({
    required this.id,
    required this.term,
    this.category = 'Technical',
    this.phoneticAliases = const [],
    required this.addedAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'term': term,
        'category': category,
        'phoneticAliases': phoneticAliases,
        'addedAt': addedAt.millisecondsSinceEpoch,
      };

  factory CustomVocabulary.fromJson(Map<String, dynamic> json) => CustomVocabulary(
        id: json['id'] as String,
        term: json['term'] as String,
        category: json['category'] as String? ?? 'Technical',
        phoneticAliases: (json['phoneticAliases'] as List<dynamic>?)
                ?.map((e) => e.toString())
                .toList() ??
            const [],
        addedAt: DateTime.fromMillisecondsSinceEpoch(
            json['addedAt'] as int? ?? DateTime.now().millisecondsSinceEpoch),
      );

  CustomVocabulary copyWith({
    String? id,
    String? term,
    String? category,
    List<String>? phoneticAliases,
    DateTime? addedAt,
  }) {
    return CustomVocabulary(
      id: id ?? this.id,
      term: term ?? this.term,
      category: category ?? this.category,
      phoneticAliases: phoneticAliases ?? this.phoneticAliases,
      addedAt: addedAt ?? this.addedAt,
    );
  }
}
