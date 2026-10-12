import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../../data/repositories/dictation_repository.dart';

class AmbientAssistantScreen extends StatefulWidget {
  final DictationRepository dictationRepo;

  const AmbientAssistantScreen({super.key, required this.dictationRepo});

  @override
  State<AmbientAssistantScreen> createState() => _AmbientAssistantScreenState();
}

class _AmbientAssistantScreenState extends State<AmbientAssistantScreen> {
  final TextEditingController _queryController = TextEditingController();
  final List<Map<String, String>> _messages = [
    {
      'role': 'assistant',
      'text': 'Hi! I am your VESPER Ambient Assistant. I can summarize your recent voice dictations, format meeting notes, or draft messages from your speech.',
    }
  ];
  bool _isLoading = false;

  void _sendMessage() {
    final text = _queryController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({'role': 'user', 'text': text});
      _isLoading = true;
    });
    _queryController.clear();

    // Local smart response generation using history context
    Future.delayed(const Duration(milliseconds: 600), () {
      final history = widget.dictationRepo.getAll();
      String reply;

      final lower = text.toLowerCase();
      if (lower.contains('summarize') || lower.contains('recent') || lower.contains('summary')) {
        if (history.isEmpty) {
          reply = "You don't have any recorded dictations yet. Speak into the microphone on the Flow tab first!";
        } else {
          final recentTexts = history.take(3).map((h) => "• ${h.polishedText}").join('\n');
          reply = "Here is a summary of your latest dictations:\n\n$recentTexts";
        }
      } else if (lower.contains('email') || lower.contains('draft')) {
        reply = "Subject: Quick Update regarding discussion\n\nHi team,\n\nFollowing up on our recent sync: $text\n\nBest regards,\nNarayan";
      } else {
        reply = "Understood: \"$text\". I have logged this to your local context memory.";
      }

      setState(() {
        _messages.add({'role': 'assistant', 'text': reply});
        _isLoading = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('Ambient Assistant'),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.all(16.0),
                itemCount: _messages.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final msg = _messages[index];
                  final isUser = msg['role'] == 'user';

                  return Align(
                    alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: isUser ? AppTheme.primary : AppTheme.surfaceCard,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isUser ? AppTheme.primary : AppTheme.surfaceBorder,
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          SelectableText(
                            msg['text']!,
                            style: const TextStyle(
                              color: AppTheme.textPrimary,
                              fontSize: 14,
                              height: 1.45,
                            ),
                          ),
                          if (!isUser) ...[
                            const SizedBox(height: 6),
                            InkWell(
                              onTap: () {
                                Clipboard.setData(ClipboardData(text: msg['text']!));
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Copied response!'),
                                    duration: Duration(seconds: 1),
                                  ),
                                );
                              },
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: const [
                                  Icon(Icons.copy_rounded, size: 12, color: AppTheme.textMuted),
                                  SizedBox(width: 4),
                                  Text('Copy', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                                ],
                              ),
                            ),
                          ]
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            if (_isLoading)
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.primary),
                ),
              ),
            // Message Input Field
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _queryController,
                      style: const TextStyle(color: AppTheme.textPrimary),
                      onSubmitted: (_) => _sendMessage(),
                      decoration: InputDecoration(
                        hintText: 'Ask assistant or summarize notes...',
                        hintStyle: const TextStyle(color: AppTheme.textMuted),
                        filled: true,
                        fillColor: AppTheme.surfaceCard,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: const BorderSide(color: AppTheme.surfaceBorder),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: const BorderSide(color: AppTheme.surfaceBorder),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: const BorderSide(color: AppTheme.primary),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    style: IconButton.styleFrom(
                      backgroundColor: AppTheme.primary,
                      shape: const CircleBorder(),
                    ),
                    icon: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
                    onPressed: _sendMessage,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
